const API = 'http://localhost:5005/api/expense';

let editingId = null;

async function fetchExpenses() {
    try {
        const res = await fetch(API);
        const data = await res.json();
        renderTable(data);
        calcStats(data);
    } catch (e) {
        console.error('Xərc yüklənmə xətası:', e);
    }
}

function renderTable(items) {
    const tbody = document.getElementById('expenseTableBody');
    if (!tbody) return;
    tbody.innerHTML = items.map(e => `
        <tr class="border-b hover:bg-slate-50">
            <td class="px-4 py-3">${new Date(e.date).toLocaleDateString('az-AZ')}</td>
            <td class="px-4 py-3 font-medium">${e.name}</td>
            <td class="px-4 py-3">${e.description || '-'}</td>
            <td class="px-4 py-3">${e.count ?? '-'}</td>
            <td class="px-4 py-3">${e.unitPrice ? e.unitPrice.toFixed(2) : '-'}</td>
            <td class="px-4 py-3 font-medium">${e.totalAmount.toFixed(2)}</td>
            <td class="px-4 py-3">${e.paidAmount.toFixed(2)}</td>
            <td class="px-4 py-3">
                <button onclick="editExpense(${e.id})" class="text-blue-600 hover:underline mr-2">Düzəliş</button>
                <button onclick="deleteExpense(${e.id})" class="text-red-600 hover:underline">Sil</button>
            </td>
        </tr>
    `).join('');
}

function calcStats(items) {
    const total = document.getElementById('totalExpense');
    const paid = document.getElementById('paidExpense');
    const debt = document.getElementById('debtExpense');
    if (total) total.textContent = items.reduce((s, e) => s + e.totalAmount, 0).toFixed(2);
    if (paid) paid.textContent = items.reduce((s, e) => s + e.paidAmount, 0).toFixed(2);
    if (debt) debt.textContent = items.reduce((s, e) => s + (e.totalAmount - e.paidAmount), 0).toFixed(2);
}

function openExpenseModal(data) {
    editingId = data?.id || null;
    document.getElementById('modalTitle').textContent = editingId ? 'Xərci Düzəliş Et' : 'Yeni Xərc';
    document.getElementById('expenseDate').value = data?.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0];
    document.getElementById('expenseName').value = data?.name || '';
    document.getElementById('expenseDesc').value = data?.description || '';
    document.getElementById('expenseCount').value = data?.count ?? '';
    document.getElementById('expenseUnitPrice').value = data?.unitPrice ?? '';
    document.getElementById('expenseTotal').value = data?.totalAmount || 0;
    document.getElementById('expensePaid').value = data?.paidAmount || 0;
    document.getElementById('expenseNote').value = data?.note || '';
    document.getElementById('expenseModal').classList.remove('hidden');
}

function closeExpenseModal() {
    editingId = null;
    document.getElementById('expenseModal').classList.add('hidden');
}

async function saveExpense(e) {
    e.preventDefault();
    const data = {
        date: document.getElementById('expenseDate').value,
        name: document.getElementById('expenseName').value,
        description: document.getElementById('expenseDesc').value,
        count: parseFloat(document.getElementById('expenseCount').value) || null,
        unitPrice: parseFloat(document.getElementById('expenseUnitPrice').value) || null,
        totalAmount: parseFloat(document.getElementById('expenseTotal').value) || 0,
        paidAmount: parseFloat(document.getElementById('expensePaid').value) || 0,
        note: document.getElementById('expenseNote').value
    };
    try {
        if (editingId) {
            await fetch(`${API}/${editingId}`, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
        } else {
            await fetch(API, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
        }
        closeExpenseModal();
        fetchExpenses();
    } catch (e) {
        console.error('Xərc xətası:', e);
    }
}

async function editExpense(id) {
    try {
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();
        openExpenseModal(data);
    } catch (e) {
        console.error('Xərc yükləmə xətası:', e);
    }
}

async function deleteExpense(id) {
    if (!confirm('Bu xərci silmək istədiyinizə əminsiniz?')) return;
    await fetch(`${API}/${id}`, {method: 'DELETE'});
    fetchExpenses();
}

document.addEventListener('DOMContentLoaded', fetchExpenses);
