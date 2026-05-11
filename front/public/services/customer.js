const API_BASE = 'http://localhost:5005/api/customer';

// ========== LIST PAGE ==========
async function fetchCustomers() {
    const container = document.querySelector('#customer-container');
    try {
        const res = await fetch(API_BASE);
        const data = await res.json();
        renderTable(data);
    } catch (e) {
        container.innerHTML = `<div class="p-8 text-red-500 text-center font-bold">Backend Bağlantısı Başarısız!</div>`;
    }
}

function renderTable(customers) {
    const container = document.querySelector('#customer-container');
    if (!customers || customers.length === 0) {
        container.innerHTML = `<div class="p-12 text-center text-slate-400">Kayıtlı müşteri bulunamadı.</div>`;
        return;
    }

    container.innerHTML = `
        <table class="w-full text-left">
            <thead class="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b">
                <tr>
                    <th class="px-6 py-4">Müşteri Bilgisi</th>
                    <th class="px-6 py-4">Nomre</th>
                    <th class="px-6 py-4">Address</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                ${customers.map(c => `
                    <tr class="hover:bg-orange-50/30 transition-colors">
                        <td class="px-6 py-4">
                            <div class="font-bold text-slate-800">${c.name} ${c.surname || ''}</div>
                        </td>
                        <td class="px-6 py-4 text-slate-600">${c.phone || '-'}</td>
                        <td class="px-6 py-4 text-slate-600">${c.address || '-'}</td>
                        <td class="px-6 py-4 text-right space-x-2">
                            <a href="/customers/${c.id}" class="px-3 py-1 text-blue-600 border border-blue-100 rounded-md hover:bg-blue-50 inline-block">Detallar</a>
                            <button onclick="editCustomer(${c.id}, '${c.name}', '${c.surname || ''}', '${c.phone || ''}','${c.address || ''}')" class="px-3 py-1 text-orange-600 border border-orange-100 rounded-md hover:bg-orange-50">Düzenle</button>
                            <button onclick="deleteCustomer(${c.id})" class="px-3 py-1 text-red-600 border border-red-100 rounded-md hover:bg-red-50">Sil</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

window.deleteCustomer = async (id) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    fetchCustomers();
};

window.openCustomerModal = () => {
    document.getElementById('customer-form').reset();
    document.getElementById('customer-id').value = "";
    document.getElementById('modal-title').innerText = "Yeni Müşteri Elave Et";
    document.getElementById('customer-modal').classList.remove('hidden');
};

window.closeCustomerModal = () => document.getElementById('customer-modal').classList.add('hidden');

window.editCustomer = (id, name, surname, phone, address) => {
    document.getElementById('customer-id').value = id;
    document.getElementById('cust-name').value = name;
    document.getElementById('cust-surname').value = surname;
    document.getElementById('cust-phone').value = phone;
    document.getElementById('cust-address').value = address;
    document.getElementById('modal-title').innerText = "Müşteriyi Düzenle";
    document.getElementById('customer-modal').classList.remove('hidden');
};

document.addEventListener('DOMContentLoaded', () => {
    // DETAIL PAGE
    const isDetailPage = window.location.pathname.match(/^\/customers\/(\d+)$/);
    if (isDetailPage) {
        const customerId = isDetailPage[1];
        fetchCustomerDetail(customerId);
        return;
    }

    // LIST PAGE
    const form = document.getElementById('customer-form');
    if(form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const id = document.getElementById('customer-id').value;
            const payload = {
                name: document.getElementById('cust-name').value,
                surname: document.getElementById('cust-surname').value,
                address: document.getElementById('cust-address').value,
                phone: document.getElementById('cust-phone').value
            };
            const method = id ? 'PUT' : 'POST';
            const url = id ? `${API_BASE}/${id}` : API_BASE;

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            window.closeCustomerModal();
            fetchCustomers();
        };
    }
    fetchCustomers();
});

// ========== DETAIL PAGE ==========
async function fetchCustomerDetail(id) {
    try {
        // Customer info
        const res = await fetch(`${API_BASE}/${id}`);
        const c = await res.json();
        document.getElementById('detailName').textContent = `${c.name} ${c.surname || ''}`;
        document.getElementById('detailPhone').textContent = `Telefon: ${c.phone || '-'}`;
        document.getElementById('detailAddress').textContent = `Ünvan: ${c.address || '-'}`;
        document.getElementById('detailCreated').textContent = `Qeydiyyat: ${new Date(c.createdAt).toLocaleDateString('az-AZ')}`;

        // Sales
        const salesRes = await fetch('http://localhost:5005/api/sale');
        const allSales = await salesRes.json();
        const customerSales = allSales.filter(s => s.customerName === `${c.name} ${c.surname || ''}`.trim() || s.customerId === id);
        const salesTbody = document.getElementById('customerSales');
        if (customerSales.length === 0) {
            salesTbody.innerHTML = '<tr><td colspan="4" class="px-4 py-8 text-center text-slate-400">Satış yoxdur</td></tr>';
        } else {
            salesTbody.innerHTML = customerSales.map(s => `
                <tr class="border-b hover:bg-slate-50">
                    <td class="px-4 py-2">${new Date(s.createdAt).toLocaleDateString('az-AZ')}</td>
                    <td class="px-4 py-2">${s.type || '-'}</td>
                    <td class="px-4 py-2">${s.totalQuantity}</td>
                    <td class="px-4 py-2 font-medium">${s.totalPrice.toFixed(2)}</td>
                </tr>
            `).join('');
        }

        // Purchases
        const purRes = await fetch('http://localhost:5005/api/purchase');
        const allPurchases = await purRes.json();
        const customerPurchases = allPurchases.filter(p => p.customerId === id);
        const purTbody = document.getElementById('customerPurchases');
        if (customerPurchases.length === 0) {
            purTbody.innerHTML = '<tr><td colspan="4" class="px-4 py-8 text-center text-slate-400">Alış yoxdur</td></tr>';
        } else {
            purTbody.innerHTML = customerPurchases.map(p => `
                <tr class="border-b hover:bg-slate-50">
                    <td class="px-4 py-2">${new Date(p.createdAt).toLocaleDateString('az-AZ')}</td>
                    <td class="px-4 py-2">${p.totalQuantity}</td>
                    <td class="px-4 py-2 font-medium">${p.totalPrice.toFixed(2)}</td>
                    <td class="px-4 py-2">${p.totalWeight || '-'}</td>
                </tr>
            `).join('');
        }

        // Advances
        const advRes = await fetch('http://localhost:5005/api/advance');
        const allAdvances = await advRes.json();
        const custAdvances = allAdvances.filter(a => a.customerId === id);
        const advTbody = document.getElementById('customerAdvances');
        if (custAdvances.length === 0) {
            advTbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-400">Avans yoxdur</td></tr>';
        } else {
            advTbody.innerHTML = custAdvances.map(a => `
                <tr class="border-b hover:bg-slate-50">
                    <td class="px-4 py-2">${new Date(a.date).toLocaleDateString('az-AZ')}</td>
                    <td class="px-4 py-2">${a.sender}</td>
                    <td class="px-4 py-2 font-medium">${a.amount.toFixed(2)}</td>
                    <td class="px-4 py-2">${a.paidAmount.toFixed(2)}</td>
                    <td class="px-4 py-2 text-red-600">${a.remainingDebt.toFixed(2)}</td>
                </tr>
            `).join('');
        }

        // Balance
        document.getElementById('balanceInfo').textContent = `${customerSales.reduce((s, x) => s + x.totalPrice, 0).toFixed(2)} AZN`;

        // Balance history from sale details
        const balTbody = document.getElementById('customerBalanceHistory');
        const balanceEntries = [];
        customerSales.forEach(s => balanceEntries.push({ date: s.createdAt, type: 'Satış', amount: s.totalPrice }));
        customerPurchases.forEach(p => balanceEntries.push({ date: p.createdAt, type: 'Alış', amount: -p.totalPrice }));
        balanceEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (balanceEntries.length === 0) {
            balTbody.innerHTML = '<tr><td colspan="3" class="px-4 py-8 text-center text-slate-400">Balans hərəkəti yoxdur</td></tr>';
        } else {
            balTbody.innerHTML = balanceEntries.map(b => `
                <tr class="border-b hover:bg-slate-50">
                    <td class="px-4 py-2">${new Date(b.date).toLocaleDateString('az-AZ')}</td>
                    <td class="px-4 py-2"><span class="px-2 py-0.5 rounded text-xs ${b.type === 'Satış' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}">${b.type}</span></td>
                    <td class="px-4 py-2 font-medium ${b.amount < 0 ? 'text-red-600' : 'text-green-600'}">${b.amount.toFixed(2)}</td>
                </tr>
            `).join('');
        }
    } catch (e) {
        console.error('Müştəri detalları xətası:', e);
    }
}
