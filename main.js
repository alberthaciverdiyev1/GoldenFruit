const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn, execSync } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');
const dns = require('dns');

let mainWindow;
let backendProcess;
let frontendProcess;
let previousHead = null;

// =====================
// UPDATE IPC HANDLERS
// =====================

function sendProgress(type, data) {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('update:progress', { type, ...data });
    }
}

ipcMain.handle('update:check-internet', async () => {
    try {
        await dns.promises.lookup('github.com');
        await dns.promises.lookup('google.com');
        return { connected: true };
    } catch {
        return { connected: false };
    }
});

ipcMain.handle('update:check-deps', async () => {
    const deps = { git: false, node: false, npm: false, dotnet: false, winget: false };
    try { execSync('git --version', { stdio: 'pipe' }); deps.git = true; } catch {}
    try { execSync('node --version', { stdio: 'pipe' }); deps.node = true; } catch {}
    try { execSync('npm --version', { stdio: 'pipe' }); deps.npm = true; } catch {}
    try { execSync('dotnet --version', { stdio: 'pipe' }); deps.dotnet = true; } catch {}
    try { execSync('winget --version', { stdio: 'pipe' }); deps.winget = true; } catch {}
    return deps;
});

ipcMain.handle('update:install-dep', async (_event, depName) => {
    const installers = {
        git: { winget: 'Git.Git', name: 'Git', url: 'https://git-scm.com/downloads' },
        node: { winget: 'OpenJS.NodeJS.LTS', name: 'Node.js', url: 'https://nodejs.org' },
        dotnet: { winget: 'Microsoft.DotNet.SDK.10', name: '.NET SDK', url: 'https://dotnet.microsoft.com/download' }
    };

    const dep = installers[depName];
    if (!dep) return { success: false, error: 'Bilinməyən proqram' };

    let useWinget = false;
    try { execSync('winget --version', { stdio: 'pipe' }); useWinget = true; } catch {}

    if (!useWinget) {
        return { success: false, error: `Zəhmət olmasa ${dep.name}-ı əl ilə quraşdırın`, downloadUrl: dep.url };
    }

    sendProgress('log', `${dep.name} quraşdırılır... (bu bir neçə dəqiqə çəkə bilər)`);
    try {
        execSync(`winget install --id ${dep.winget} --silent --accept-package-agreements`, {
            timeout: 300000, stdio: 'pipe'
        });
        sendProgress('log', `✅ ${dep.name} quraşdırıldı`);
        return { success: true };
    } catch (e) {
        return { success: false, error: `Quraşdırma uğursuz: ${e.message}` };
    }
});

ipcMain.handle('update:check', async () => {
    try {
        if (!fs.existsSync(path.join(__dirname, '.git'))) {
            sendProgress('log', 'Git repozitoriyası başladılır...');
            execSync('git init', { cwd: __dirname, stdio: 'pipe' });
            sendProgress('log', '✅ Git repozitoriyası başladıldı');
        }

        let remoteUrl;
        try {
            remoteUrl = execSync('git config --get remote.origin.url', { cwd: __dirname, encoding: 'utf8' }).trim();
        } catch {
            return { ok: false, error: 'Git remote (origin) təyin edilməyib.\nZəhmət olmasa:\ngit remote add origin <repo-url>' };
        }

        sendProgress('log', `Remote: ${remoteUrl}`);

        // Ensure we have the branch
        try {
            execSync('git symbolic-ref HEAD', { cwd: __dirname, stdio: 'pipe' });
        } catch {
            return { ok: false, error: 'Heç bir branch seçilməyib. git checkout -b main' };
        }

        sendProgress('log', 'Yeniliklər yoxlanılır...');
        execSync('git fetch origin', { cwd: __dirname, stdio: 'pipe', timeout: 30000 });

        previousHead = execSync('git rev-parse HEAD', { cwd: __dirname, encoding: 'utf8' }).trim();

        const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: __dirname, encoding: 'utf8' }).trim();

        if (branch === 'HEAD') {
            return { ok: false, error: 'Detached HEAD vəziyyətində. Zəhmət olmasa bir branch seçin.' };
        }

        const revList = `git rev-list --count --left-right HEAD...origin/${branch}`;
        const counts = execSync(revList, { cwd: __dirname, encoding: 'utf8' }).trim();
        const match = counts.match(/\t(\d+)/);
        const behindCount = match ? parseInt(match[1]) : 0;

        return { ok: true, hasUpdate: behindCount > 0, behindCount, currentHead: previousHead, branch };
    } catch (e) {
        return { ok: false, error: `Yeniliklərin yoxlanılması uğursuz: ${e.message}` };
    }
});

ipcMain.handle('update:perform', async () => {
    try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: __dirname, encoding: 'utf8' }).trim();

        // 1. Pull
        sendProgress('log', '📥 Yeni dəyişikliklər endirilir...');
        execSync(`git pull origin ${branch}`, { cwd: __dirname, stdio: 'pipe', timeout: 60000 });
        sendProgress('log', '✅ Dəyişikliklər endirildi');

        // 2. Install npm deps
        sendProgress('log', '📦 Root npm bağımlılıqları yenilənir...');
        try {
            execSync('npm install', { cwd: __dirname, stdio: 'pipe', timeout: 120000 });
            sendProgress('log', '✅ Root npm paketlər yeniləndi');
        } catch {
            sendProgress('log', '⚠️  npm install xətası (əhəmiyyətsiz)');
        }

        sendProgress('log', '📦 Frontend npm bağımlılıqları yenilənir...');
        try {
            execSync('npm install', { cwd: path.join(__dirname, 'front'), stdio: 'pipe', timeout: 120000 });
            sendProgress('log', '✅ Frontend npm paketlər yeniləndi');
        } catch {
            sendProgress('log', '⚠️  Frontend npm install xətası (əhəmiyyətsiz)');
        }

        // 3. Build backend
        sendProgress('status', 'build-backend');
        sendProgress('log', '🔨 Backend build edilir...');
        try {
            execSync('dotnet build', { cwd: path.join(__dirname, 'back'), stdio: 'pipe', timeout: 120000 });
            sendProgress('log', '✅ Backend build uğurlu');
        } catch {
            sendProgress('log', '❌ Backend build uğursuz!');
            return await rollback('Backend build xətası');
        }

        // 4. Build frontend
        sendProgress('status', 'build-frontend');
        sendProgress('log', '🔨 Frontend build edilir...');
        try {
            execSync('npm run build', { cwd: path.join(__dirname, 'front'), stdio: 'pipe', timeout: 120000 });
            sendProgress('log', '✅ Frontend build uğurlu');
        } catch {
            sendProgress('log', '❌ Frontend build uğursuz!');
            return await rollback('Frontend build xətası');
        }

        sendProgress('status', 'done');
        sendProgress('log', '🎉 Yeniləmə tamamlandı!');

        return { success: true, restart: true };
    } catch (e) {
        return await rollback(`Yeniləmə uğursuz: ${e.message}`);
    }
});

async function rollback(reason) {
    sendProgress('log', '⏪ Geri qaytarılır...');
    sendProgress('status', 'rollback');
    try {
        if (previousHead) {
            execSync(`git reset --hard ${previousHead}`, { cwd: __dirname, stdio: 'pipe' });
            sendProgress('log', '✅ Köhnə versiyaya uğurla qayıdıldı');
        }
    } catch {
        sendProgress('log', '⚠️  Geri qaytarma xətası');
    }
    return { success: false, error: reason };
}

ipcMain.handle('update:restart', async () => {
    sendProgress('log', 'Proqram yenidən başladılır...');
    setTimeout(() => {
        const child = spawn(process.argv0, process.argv.slice(1), {
            cwd: process.cwd(),
            detached: true,
            stdio: 'ignore'
        });
        child.unref();
        app.quit();
    }, 1500);
    return { ok: true };
});

// =====================
// PRODUCTION / DEV MODE
// =====================

const isPackaged = app.isPackaged;

function startBackend() {
    // Önceki backend sürecini temizle (port 5005)
    try {
        const result = execSync('netstat -ano | findstr ":5005"', { encoding: 'utf8', stdio: 'pipe' });
        const lines = result.trim().split('\n');
        for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && !isNaN(pid)) {
                try { execSync(`taskkill /pid ${pid} /f`, { stdio: 'pipe' }); } catch {}
            }
        }
    } catch {}

    if (isPackaged) {
        const backendExe = path.join(process.resourcesPath, 'backend', 'GoldenFruit.Backend.exe');
        console.log(`[Main] Starting packaged backend: ${backendExe}`);
        backendProcess = spawn(backendExe, [], { shell: true });
    } else {
        const backendDir = path.join(__dirname, 'back');
        backendProcess = spawn('dotnet', ['run', '--project', backendDir], { shell: true });
    }

    backendProcess.stdout.on('data', (data) => {
        const msg = data.toString().trim();
        if (msg) console.log(`[Backend] ${msg}`);
    });

    backendProcess.stderr.on('data', (data) => {
        const msg = data.toString().trim();
        if (msg) console.error(`[Backend] ${msg}`);
    });

    backendProcess.on('error', (err) => {
        console.error('[Backend] Failed to start:', err.message);
    });

    backendProcess.on('exit', (code) => {
        console.log(`[Backend] Process exited with code ${code}`);
    });
}

function startFrontend() {
    const frontendDir = isPackaged ? path.join(process.resourcesPath, 'frontend') : path.join(__dirname, 'front');

    if (isPackaged) {
        const serverEntry = path.join(frontendDir, 'server', 'entry.mjs');
        console.log(`[Main] Starting frontend server: ${serverEntry}`);
        frontendProcess = spawn(process.execPath, [serverEntry], {
            env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
            stdio: 'pipe'
        });
    } else {
        frontendProcess = spawn('npm', ['run', 'dev', '--', '--port', '4321'], {
            cwd: frontendDir, shell: true
        });
    }

    frontendProcess.stdout.on('data', (data) => {
        const msg = data.toString().trim();
        if (msg) console.log(`[Frontend] ${msg}`);
    });

    frontendProcess.stderr.on('data', (data) => {
        const msg = data.toString().trim();
        if (msg) console.error(`[Frontend] ${msg}`);
    });

    frontendProcess.on('error', (err) => {
        console.error('[Frontend] Failed to start:', err.message);
    });

    frontendProcess.on('exit', (code) => {
        console.log(`[Frontend] Process exited with code ${code}`);
    });
}

function waitForServer(url, label, retries = 45) {
    return new Promise((resolve, reject) => {
        const check = (attempt) => {
            http.get(url, () => {
                console.log(`[Main] ${label} ready at ${url}`);
                resolve();
            }).on('error', () => {
                if (attempt >= retries) {
                    reject(new Error(`${label} did not start in time`));
                } else {
                    if (attempt % 10 === 0) {
                        console.log(`[Main] Waiting for ${label} (attempt ${attempt + 1}/${retries})...`);
                    }
                    setTimeout(() => check(attempt + 1), 1000);
                }
            });
        };
        check(0);
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 860,
        title: "GoldenFruit ERP",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL('http://localhost:4321');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(async () => {
    console.log('[Main] Starting GoldenFruit ERP...');
    console.log('[Main] Starting backend (port 5005)...');
    startBackend();

    console.log('[Main] Starting frontend (port 4321)...');
    startFrontend();

    try {
        await Promise.all([
            waitForServer('http://localhost:5005', 'Backend'),
            waitForServer('http://localhost:4321', 'Frontend')
        ]);
        console.log('[Main] Both servers are ready. Opening window...');
    } catch (err) {
        console.error('[Main] Server startup failed:', err.message);
    }

    createWindow();
});

app.on('window-all-closed', () => {
    if (backendProcess) {
        try { spawn("taskkill", ["/pid", String(backendProcess.pid), '/f', '/t']); } catch (_) {}
        backendProcess = null;
    }
    if (frontendProcess) {
        try { spawn("taskkill", ["/pid", String(frontendProcess.pid), '/f', '/t']); } catch (_) {}
        frontendProcess = null;
    }
    if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
    if (backendProcess) {
        try { spawn("taskkill", ["/pid", String(backendProcess.pid), '/f', '/t']); } catch (_) {}
        backendProcess = null;
    }
    if (frontendProcess) {
        try { spawn("taskkill", ["/pid", String(frontendProcess.pid), '/f', '/t']); } catch (_) {}
        frontendProcess = null;
    }
});