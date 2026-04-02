const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "GoldenFruit ERP",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false // Font ve asset erişimi için gerekli
        }
    });

    win.loadURL('http://localhost:8081');
    win.webContents.openDevTools();
    // Ana dosyayı yükle
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

app.whenReady().then(() => {
    // ÖNEMLİ: Yanlış giden tüm dosya yollarını 'dist' klasörüne yönlendiriyoruz
    protocol.interceptFileProtocol('file', (request, callback) => {
        let url = request.url.substring(7); // 'file://' kısmını at

        // Windows'taki ters slaş ve başlangıç slaşı sorunlarını temizle
        url = decodeURIComponent(url);
        if (process.platform === 'win32' && url.startsWith('/')) {
            url = url.substring(1);
        }

        // Eğer istenen dosya mevcut değilse ama /assets veya /_expo içeriyorsa dist içine bak
        if (!fs.existsSync(url)) {
            if (url.includes('_expo') || url.includes('assets')) {
                // Dosya adını al (yolun son kısmı)
                const fileName = path.basename(url);

                // dist klasörü içinde bu dosyayı recursive (derinlemesine) ara
                const findFile = (dir) => {
                    const files = fs.readdirSync(dir);
                    for (const file of files) {
                        const fullPath = path.join(dir, file);
                        if (fs.lstatSync(fullPath).isDirectory()) {
                            const found = findFile(fullPath);
                            if (found) return found;
                        } else if (file === fileName) {
                            return fullPath;
                        }
                    }
                    return null;
                };

                const correctedPath = findFile(path.join(__dirname, 'dist'));
                if (correctedPath) {
                    return callback({ path: correctedPath });
                }
            }
        }

        callback({ path: path.normalize(url) });
    });

    createWindow();
});