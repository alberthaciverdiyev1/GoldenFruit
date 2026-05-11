const API = 'http://localhost:5005/api/driver';

let editingId = null;

async function fetchDrivers() {
    try {
        const res = await fetch(API);
        const data = await res.json();
        renderTable(data);
        fetchSummary();
    } catch (e) {
        console.error('Şoför yüklənmə xətası:', e);
    }
}

async function fetchSummary() {
    try {
        const res = await fetch(`${API}/summary`);
        const data = await res.json();
        renderSummary(data);
    } catch (e) {
        console.error('Xülasə xətası:', e);
    }
}

function renderTable(items) {
    const tbody = document.getElementById('driverTableBody');
    if (!tbody) return;
    tbody.innerHTML = items.map(d => `
        <tr class="border-b hover:bg-slate-50">
            <td class="px-4 py-3">${new Date(d.date).toLocaleDateString('az-AZ')}</td>
            <td class="px-4 py-3 font-medium">${d.driverName}</td>
            <td class="px-4 py-3">${d.dailyWage.toFixed(2)}</td>
            <td class="px-4 py-3">${d.extraTripAmount ? d.extraTripAmount.toFixed(2) : '-'}</td>
            <td class="px-4 py-3 font-medium">${d.totalAmount.toFixed(2)}</td>
            <td class="px-4 py-3">${d.paidAmount.toFixed(2)}</td>
            <td class="px-4 py-3 text-red-600">${d.remainingDebt.toFixed(2)}</td>
            <td class="px-4 py-3 text-sm">${d.note || '-'}</td>
            <td class="px-4 py-3">
                <button onclick="editDriver(${d.id})" class="text-blue-600 hover:underline mr-2">Düzəliş</button>
                <button onclick="deleteDriver(${d.id})" class="text-red-600 hover:underline">Sil</button>
            </td>
        </tr>
    `).join('');
}

function renderSummary(data) {
    const container = document.getElementById('driverSummary');
    if (!container) return;
    container.innerHTML = data.map(s => `
        <div class="bg-slate-50 px-4 py-3 rounded-lg border">
            <div class="font-semibold text-slate-800">${s.driverName}</div>
            <div class="text-sm text-slate-500">${s.entryCount} sefer | Toplam: ${s.totalWage.toFixed(2)} | Ödənən: ${s.totalPaid.toFixed(2)} | <span class="text-red-600">Borç: ${s.totalDebt.toFixed(2)}</span></div>
        </div>
    `).join('');
}

function calcDriverStats() {
    const rows = document.querySelectorAll('#driverTableBody tr');
    let total = 0, paid = 0, debt = 0;
    rows.forEach(r => {
        const tds = r.querySelectorAll('td');
        if (tds.length > 6) {
            total += parseFloat(tds[4]?.textContent) || 0;
            paid += parseFloat(tds[5]?.textContent) || 0;
            debt += parseFloat(tds[6]?.textContent) || 0;
        }
    });
    const el = document.getElementById('driverTotalStats');
    if (el) el.textContent = `Cəmi: ${total.toFixed(2)} | Ödənən: ${paid.toFixed(2)} | Borç: ${debt.toFixed(2)}`;
}

function openDriverModal(data) {
    editingId = data?.id || null;
    document.getElementById('driverModalTitle').textContent = editingId ? 'Maaşı Düzəliş Et' : 'Yeni Şoför Maaşı';
    document.getElementById('driverDate').value = data?.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0];
    document.getElementById('driverName').value = data?.driverName || '';
    document.getElementById('driverWage').value = data?.dailyWage || 0;
    document.getElementById('driverExtra').value = data?.extraTripAmount ?? '';
    document.getElementById('driverTotal').value = data?.totalAmount || 0;
    document.getElementById('driverPaid').value = data?.paidAmount || 0;
    document.getElementById('driverDebt').value = data?.remainingDebt || 0;
    document.getElementById('driverNote').value = data?.note || '';
    document.getElementById('driverModal').classList.remove('hidden');
}

function closeDriverModal() {
    editingId = null;
    document.getElementById('driverModal').classList.add('hidden');
}

async function saveDriver(e) {
    e.preventDefault();
    const data = {
        date: document.getElementById('driverDate').value,
        driverName: document.getElementById('driverName').value,
        dailyWage: parseFloat(document.getElementById('driverWage').value) || 0,
        extraTripAmount: parseFloat(document.getElementById('driverExtra').value) || null,
        totalAmount: parseFloat(document.getElementById('driverTotal').value) || 0,
        paidAmount: parseFloat(document.getElementById('driverPaid').value) || 0,
        remainingDebt: parseFloat(document.getElementById('driverDebt').value) || 0,
        note: document.getElementById('driverNote').value
    };
    try {
        if (editingId) {
            await fetch(`${API}/${editingId}`, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
        } else {
            await fetch(API, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
        }
        closeDriverModal();
        fetchDrivers();
    } catch (e) {
        console.error('Şoför xətası:', e);
    }
}

async function editDriver(id) {
    try {
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();
        openDriverModal(data);
    } catch (e) {
        console.error('Şoför yükləmə xətası:', e);
    }
}

async function deleteDriver(id) {
    if (!confirm('Bu kaydı silmək istədiyinizə əminsiniz?')) return;
    await fetch(`${API}/${id}`, {method: 'DELETE'});
    fetchDrivers();
}

document.addEventListener('DOMContentLoaded', fetchDrivers);
