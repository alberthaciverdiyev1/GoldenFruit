const API = 'http://localhost:5005/api/export';

let editingId = null;

async function fetchExports() {
    try {
        const res = await fetch(API);
        const data = await res.json();
        renderTable(data);
        calcExportStats(data);
    } catch (e) {
        console.error('İxrac yüklənmə xətası:', e);
    }
}

function renderTable(items) {
    const tbody = document.getElementById('exportTableBody');
    if (!tbody) return;
    tbody.innerHTML = items.map(ex => `
        <tr class="border-b hover:bg-slate-50">
            <td class="px-4 py-3">${new Date(ex.date).toLocaleDateString('az-AZ')}</td>
            <td class="px-4 py-3 font-medium">${ex.customerName}</td>
            <td class="px-4 py-3">${ex.destination}</td>
            <td class="px-4 py-3">${ex.productType || '-'}</td>
            <td class="px-4 py-3">${ex.quantity}</td>
            <td class="px-4 py-3">${ex.netWeight.toFixed(1)}</td>
            <td class="px-4 py-3 font-medium">${ex.totalAmount.toFixed(2)}</td>
            <td class="px-4 py-3">${ex.paidAmount.toFixed(2)}</td>
            <td class="px-4 py-3 text-red-600">${ex.remainingDebt.toFixed(2)}</td>
            <td class="px-4 py-3 text-sm">${ex.driverName || '-'}</td>
            <td class="px-4 py-3">
                <button onclick="editExport(${ex.id})" class="text-blue-600 hover:underline mr-2">Düzəliş</button>
                <button onclick="deleteExport(${ex.id})" class="text-red-600 hover:underline">Sil</button>
            </td>
        </tr>
    `).join('');
}

function calcExportStats(items) {
    const total = document.getElementById('exportTotal');
    const paid = document.getElementById('exportPaid');
    const debt = document.getElementById('exportDebt');
    if (total) total.textContent = items.reduce((s, e) => s + e.totalAmount, 0).toFixed(2);
    if (paid) paid.textContent = items.reduce((s, e) => s + e.paidAmount, 0).toFixed(2);
    if (debt) debt.textContent = items.reduce((s, e) => s + e.remainingDebt, 0).toFixed(2);
}

function openExportModal(data) {
    editingId = data?.id || null;
    document.getElementById('exportModalTitle').textContent = editingId ? 'İxracı Düzəliş Et' : 'Yeni İxrac';
    document.getElementById('exportDate').value = data?.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0];
    document.getElementById('exportDestination').value = data?.destination || '';
    document.getElementById('exportCustomer').value = data?.customerName || '';
    document.getElementById('exportDriver').value = data?.driverName || '';
    document.getElementById('exportPhone').value = data?.phone || '';
    document.getElementById('exportPlate').value = data?.truckPlate || '';
    document.getElementById('exportProductType').value = data?.productType || '';
    document.getElementById('exportPallet').value = data?.palletCount ?? '';
    document.getElementById('exportQuantity').value = data?.quantity || 0;
    document.getElementById('exportWeightWithBox').value = data?.weightWithBox || 0;
    document.getElementById('exportBoxWeight').value = data?.boxWeight || 0;
    document.getElementById('exportNetWeight').value = data?.netWeight || 0;
    document.getElementById('exportPrice').value = data?.price || 0;
    document.getElementById('exportTotal').value = data?.totalAmount || 0;
    document.getElementById('exportExtraCost').value = data?.extraCost ?? '';
    document.getElementById('exportPaid').value = data?.paidAmount || 0;
    document.getElementById('exportDebt').value = data?.remainingDebt || 0;
    document.getElementById('exportNote').value = data?.note || '';
    document.getElementById('exportModal').classList.remove('hidden');
}

function closeExportModal() {
    editingId = null;
    document.getElementById('exportModal').classList.add('hidden');
}

async function saveExport(e) {
    e.preventDefault();
    const data = {
        date: document.getElementById('exportDate').value,
        destination: document.getElementById('exportDestination').value,
        customerName: document.getElementById('exportCustomer').value,
        driverName: document.getElementById('exportDriver').value,
        phone: document.getElementById('exportPhone').value,
        truckPlate: document.getElementById('exportPlate').value,
        productType: document.getElementById('exportProductType').value,
        palletCount: parseInt(document.getElementById('exportPallet').value) || null,
        quantity: parseFloat(document.getElementById('exportQuantity').value) || 0,
        weightWithBox: parseFloat(document.getElementById('exportWeightWithBox').value) || 0,
        boxWeight: parseFloat(document.getElementById('exportBoxWeight').value) || 0,
        netWeight: parseFloat(document.getElementById('exportNetWeight').value) || 0,
        price: parseFloat(document.getElementById('exportPrice').value) || 0,
        totalAmount: parseFloat(document.getElementById('exportTotal').value) || 0,
        extraCost: parseFloat(document.getElementById('exportExtraCost').value) || null,
        paidAmount: parseFloat(document.getElementById('exportPaid').value) || 0,
        remainingDebt: parseFloat(document.getElementById('exportDebt').value) || 0,
        note: document.getElementById('exportNote').value
    };
    try {
        if (editingId) {
            await fetch(`${API}/${editingId}`, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
        } else {
            await fetch(API, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
        }
        closeExportModal();
        fetchExports();
    } catch (e) {
        console.error('İxrac xətası:', e);
    }
}

function calcNetWeight() {
    const wwb = parseFloat(document.getElementById('exportWeightWithBox').value) || 0;
    const bw = parseFloat(document.getElementById('exportBoxWeight').value) || 0;
    document.getElementById('exportNetWeight').value = (wwb - bw).toFixed(1);
}

function calcTotalAmount() {
    const nw = parseFloat(document.getElementById('exportNetWeight').value) || 0;
    const price = parseFloat(document.getElementById('exportPrice').value) || 0;
    const extra = parseFloat(document.getElementById('exportExtraCost').value) || 0;
    document.getElementById('exportTotal').value = (nw * price + extra).toFixed(2);
}

async function editExport(id) {
    try {
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();
        openExportModal(data);
    } catch (e) {
        console.error('İxrac yükləmə xətası:', e);
    }
}

async function deleteExport(id) {
    if (!confirm('Bu ixrac kaydını silmək istədiyinizə əminsiniz?')) return;
    await fetch(`${API}/${id}`, {method: 'DELETE'});
    fetchExports();
}

document.addEventListener('DOMContentLoaded', fetchExports);
