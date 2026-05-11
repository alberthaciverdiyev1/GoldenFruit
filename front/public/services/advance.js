const API = 'http://localhost:5005/api/advance';

let editingId = null;
let customers = [];

async function fetchAdvances() {
    try {
        const res = await fetch(API);
        const data = await res.json();
        renderTable(data);
        calcStats(data);
    } catch (e) {
        console.error('Avans yüklənmə xətası:', e);
    }
}

async function loadCustomersForSelect() {
    try {
        const res = await fetch('http://localhost:5005/api/customer');
        customers = await res.json();
        const sel = document.getElementById('advanceCustomerId');
        if (sel) {
            sel.innerHTML = '<option value="">Müştəri seçin (istеğe bağlı)</option>' +
                customers.map(c => `<option value="${c.id}">${c.name} ${c.surname || ''}</option>`).join('');
        }
    } catch (e) {
        console.error('Müştəri yükləmə xətası:', e);
    }
}

function renderTable(items) {
    const tbody = document.getElementById('advanceTableBody');
    if (!tbody) return;
    tbody.innerHTML = items.map(a => `
        <tr class="border-b hover:bg-slate-50">
            <td class="px-4 py-3">${new Date(a.date).toLocaleDateString('az-AZ')}</td>
            <td class="px-4 py-3">${a.sender}</td>
            <td class="px-4 py-3">${a.receiverName}</td>
            <td class="px-4 py-3 font-medium">${a.amount.toFixed(2)}</td>
            <td class="px-4 py-3">${a.paidAmount.toFixed(2)}</td>
            <td class="px-4 py-3 text-red-600 font-medium">${a.remainingDebt.toFixed(2)}</td>
            <td class="px-4 py-3 text-sm">${a.note || '-'}</td>
            <td class="px-4 py-3">
                <button onclick="editAdvance(${a.id})" class="text-blue-600 hover:underline mr-2">Düzəliş</button>
                <button onclick="deleteAdvance(${a.id})" class="text-red-600 hover:underline">Sil</button>
            </td>
        </tr>
    `).join('');
}

function calcStats(items) {
    const total = document.getElementById('totalAdvance');
    const paid = document.getElementById('paidAdvance');
    const debt = document.getElementById('debtAdvance');
    if (total) total.textContent = items.reduce((s, a) => s + a.amount, 0).toFixed(2);
    if (paid) paid.textContent = items.reduce((s, a) => s + a.paidAmount, 0).toFixed(2);
    if (debt) debt.textContent = items.reduce((s, a) => s + a.remainingDebt, 0).toFixed(2);
}

function openAdvanceModal(data) {
    editingId = data?.id || null;
    document.getElementById('advanceModalTitle').textContent = editingId ? 'Avansı Düzəliş Et' : 'Yeni Avans';
    document.getElementById('advanceDate').value = data?.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0];
    document.getElementById('advanceSender').value = data?.sender || '';
    document.getElementById('advanceReceiver').value = data?.receiverName || '';
    document.getElementById('advanceCustomerId').value = data?.customerId || '';
    document.getElementById('advanceAmount').value = data?.amount || 0;
    document.getElementById('advancePaid').value = data?.paidAmount || 0;
    document.getElementById('advanceDebt').value = data?.remainingDebt || 0;
    document.getElementById('advanceNote').value = data?.note || '';
    document.getElementById('advanceModal').classList.remove('hidden');
}

function closeAdvanceModal() {
    editingId = null;
    document.getElementById('advanceModal').classList.add('hidden');
}

async function saveAdvance(e) {
    e.preventDefault();
    const data = {
        date: document.getElementById('advanceDate').value,
        sender: document.getElementById('advanceSender').value,
        receiverName: document.getElementById('advanceReceiver').value,
        customerId: parseInt(document.getElementById('advanceCustomerId').value) || null,
        amount: parseFloat(document.getElementById('advanceAmount').value) || 0,
        paidAmount: parseFloat(document.getElementById('advancePaid').value) || 0,
        remainingDebt: parseFloat(document.getElementById('advanceDebt').value) || 0,
        note: document.getElementById('advanceNote').value
    };
    try {
        if (editingId) {
            await fetch(`${API}/${editingId}`, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
        } else {
            await fetch(API, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
        }
        closeAdvanceModal();
        fetchAdvances();
    } catch (e) {
        console.error('Avans xətası:', e);
    }
}

async function editAdvance(id) {
    try {
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();
        openAdvanceModal(data);
    } catch (e) {
        console.error('Avans yükləmə xətası:', e);
    }
}

async function deleteAdvance(id) {
    if (!confirm('Bu avansı silmək istədiyinizə əminsiniz?')) return;
    await fetch(`${API}/${id}`, {method: 'DELETE'});
    fetchAdvances();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAdvances();
    loadCustomersForSelect();
});
