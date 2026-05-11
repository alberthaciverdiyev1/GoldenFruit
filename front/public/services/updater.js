const { ipcRenderer } = require('electron');

window.checkForUpdates = async () => {
    const modal = document.getElementById('update-modal');
    const logArea = document.getElementById('update-log');
    const statusEl = document.getElementById('update-status');
    const btnStart = document.getElementById('update-btn-start');
    const btnClose = document.getElementById('update-btn-close');
    const progressBar = document.getElementById('update-progress-bar');

    function log(msg) {
        const div = document.createElement('div');
        div.className = 'text-sm font-medium text-slate-700 py-0.5';
        div.textContent = msg;
        logArea.appendChild(div);
        logArea.scrollTop = logArea.scrollHeight;
    }

    function setStatus(text, type) {
        statusEl.textContent = text;
        statusEl.className = `text-lg font-black tracking-tight ${type === 'error' ? 'text-red-600' : type === 'success' ? 'text-green-600' : 'text-blue-600'}`;
    }

    function setProgress(pct) {
        progressBar.style.width = `${pct}%`;
    }

    function hideModal() {
        modal.classList.add('hidden');
    }

    // Show modal
    modal.classList.remove('hidden');
    logArea.innerHTML = '';
    setProgress(0);
    btnStart.classList.add('hidden');
    btnClose.textContent = 'Bağla';
    btnClose.onclick = hideModal;
    setStatus('Yoxlanılır...', '');

    // 1. Check internet
    log('🔍 İnternet bağlantısı yoxlanılır...');
    setProgress(5);
    const internet = await ipcRenderer.invoke('update:check-internet');
    if (!internet.connected) {
        log('❌ İnternet bağlantısı yoxdur!');
        setStatus('İnternet yoxdur', 'error');
        setProgress(0);
        btnClose.classList.remove('hidden');
        return;
    }
    log('✅ İnternet bağlantısı var');
    setProgress(10);

    // 2. Check dependencies
    log('🔍 Tələb olunan proqramlar yoxlanılır...');
    const deps = await ipcRenderer.invoke('update:check-deps');
    setProgress(15);

    const missing = [];
    if (!deps.git) missing.push({ id: 'git', name: 'Git' });
    if (!deps.node) missing.push({ id: 'node', name: 'Node.js' });
    if (!deps.npm) missing.push({ id: 'npm', name: 'npm' });
    if (!deps.dotnet) missing.push({ id: 'dotnet', name: '.NET SDK' });

    if (missing.length > 0) {
        log(`⚠️  Çatışmayan proqramlar: ${missing.map(m => m.name).join(', ')}`);
        for (const dep of missing) {
            const installDep = confirm(`${dep.name} quraşdırılmalıdır. İcazə verirsiniz?`);
            if (!installDep) {
                log(`❌ ${dep.name} quraşdırılması ləğv edildi`);
                setStatus('Quraşdırma ləğv edildi', 'error');
                return;
            }
            log(`${dep.name} quraşdırılır...`);
            const result = await ipcRenderer.invoke('update:install-dep', dep.id);
            if (!result.success) {
                log(`❌ ${result.error}`);
                setStatus('Quraşdırma uğursuz', 'error');
                return;
            }
        }
        log('✅ Bütün proqramlar quraşdırıldı');
    } else {
        log('✅ Bütün proqramlar mövcuddur');
    }
    setProgress(25);

    // 3. Check for updates
    log('🔍 Yeni versiya yoxlanılır...');
    setStatus('Yeniliklər yoxlanılır...', '');
    const updateInfo = await ipcRenderer.invoke('update:check');
    setProgress(40);

    if (!updateInfo.ok) {
        log(`❌ ${updateInfo.error}`);
        setStatus('Xəta baş verdi', 'error');
        return;
    }

    if (!updateInfo.hasUpdate) {
        log('✅ Artıq ən son versiyadasınız!');
        setStatus('Proqram güncəldir', 'success');
        setProgress(100);
        return;
    }

    log(`📦 ${updateInfo.behindCount} yeni dəyişiklik mövcuddur`);
    setProgress(50);

    // Ask user to proceed
    const proceed = confirm(`${updateInfo.behindCount} yeni yeniləmə mövcuddur. Yenilənsin?`);
    if (!proceed) {
        log('⏸ Yeniləmə ləğv edildi');
        setStatus('Yeniləmə ləğv edildi', '');
        setProgress(0);
        return;
    }

    // 4. Perform update
    log('🚀 Yeniləmə başladılır...');
    setStatus('Yenilənir...', '');
    setProgress(60);

    // Listen for progress from main process
    const progressHandler = (_event, data) => {
        if (data.type === 'log') {
            log(data.text || '');
        } else if (data.type === 'status') {
            switch (data.text) {
                case 'build-backend':
                    setProgress(70);
                    setStatus('Backend build edilir...', '');
                    break;
                case 'build-frontend':
                    setProgress(85);
                    setStatus('Frontend build edilir...', '');
                    break;
                case 'rollback':
                    setProgress(40);
                    setStatus('Geri qaytarılır...', 'error');
                    break;
                case 'done':
                    setProgress(100);
                    setStatus('Yeniləmə tamamlandı! ✅', 'success');
                    break;
            }
        }
    };

    ipcRenderer.on('update:progress', progressHandler);

    const result = await ipcRenderer.invoke('update:perform');

    ipcRenderer.removeListener('update:progress', progressHandler);

    if (result.success) {
        log('🎉 Proqram uğurla yeniləndi!');
        setStatus('Yeniləmə tamamlandı! ✅', 'success');
        setProgress(100);

        // Restart button
        btnStart.textContent = 'Proqramı Yenidən Başlat';
        btnStart.classList.remove('hidden');
        btnStart.onclick = async () => {
            btnStart.disabled = true;
            btnStart.textContent = 'Yenidən başladılır...';
            await ipcRenderer.invoke('update:restart');
        };
    } else {
        log(`❌ ${result.error}`);
        setStatus('Yeniləmə uğursuz', 'error');
        setProgress(0);
    }
};