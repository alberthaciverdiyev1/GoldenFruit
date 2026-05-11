const API = 'http://localhost:5005/api/stockbalance';

let editingId = null;

async function fetchStockBalances() {
    try {
        const res = await fetch(API);
        const data = await res.json();
        renderTable(data);
    } catch (e) {
        console.error('Stok qalığı yüklənmə xətası:', e);
    }
}

function renderTable(items) {
    const tbody = document.getElementById('stockTableBody');
    if (!tbody) return;
    tbody.innerHTML = items.map(s => `
        <tr class="border-b hover:bg-slate-50">
            <td class="px-4 py-3">${new Date(s.date).toLocaleDateString('az-AZ')}</td>
            <td class="px-4 py-3 font-medium">${s.description}</td>
            <td class="px-4 py-3">${s.quantity ?? '-'}</td>
            <td class="px-4 py-3">${s.netWeight ? s.netWeight.toFixed(1) : '-'}</td>
            <td class="px-4 py-3">${s.amount ? s.amount.toFixed(2) : '-'}</td>
            <td class="px-4 py-3 text-sm">${s.relatedPerson || '-'}</td>
            <td class="px-4 py-3 text-sm text-slate-500">${s.note || '-'}</td>
            <td class="px-4 py-3">
                <button onclick="editStockBalance(${s.id})" class="text-blue-600 hover:underline mr-2">Düzəliş</button>
                <button onclick="deleteStockBalance(${s.id})" class="text-red-600 hover:underline">Sil</button>
            </td>
        </tr>
    `).join('');
}

function openStockModal(data) {
    editingId = data?.id || null;
    document.getElementById('stockModalTitle').textContent = editingId ? 'Qalığı Düzəliş Et' : 'Yeni Stok Qalığı';
    document.getElementById('stockDate').value = data?.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0];
    document.getElementById('stockDesc').value = data?.description || '';
    document.getElementById('stockQty').value = data?.quantity ?? '';
    document.getElementById('stockWeight').value = data?.netWeight ?? '';
    document.getElementById('stockAmount').value = data?.amount ?? '';
    document.getElementById('stockPerson').value = data?.relatedPerson || '';
    document.getElementById('stockNote').value = data?.note || '';
    document.getElementById('stockModal').classList.remove('hidden');
}

function closeStockModal() {
    editingId = null;
    document.getElementById('stockModal').classList.add('hidden');
}

async function saveStockBalance(e) {
    e.preventDefault();
    const data = {
        date: document.getElementById('stockDate').value,
        description: document.getElementById('stockDesc').value,
        quantity: parseFloat(document.getElementById('stockQty').value) || null,
        netWeight: parseFloat(document.getElementById('stockWeight').value) || null,
        amount: parseFloat(document.getElementById('stockAmount').value) || null,
        relatedPerson: document.getElementById('stockPerson').value,
        note: document.getElementById('stockNote').value
    };
    try {
        if (editingId) {
            await fetch(`${API}/${editingId}`, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
        } else {
            await fetch(API, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
        }
        closeStockModal();
        fetchStockBalances();
    } catch (e) {
        console.error('Stok xətası:', e);
    }
}

async function editStockBalance(id) {
    try {
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();
        openStockModal(data);
    } catch (e) {
        console.error('Stok yükləmə xətası:', e);
    }
}

async function deleteStockBalance(id) {
    if (!confirm('Bu qalıq kaydını silmək istədiyinizə əminsiniz?')) return;
    await fetch(`${API}/${id}`, {method: 'DELETE'});
    fetchStockBalances();
}

document.addEventListener('DOMContentLoaded', fetchStockBalances);
