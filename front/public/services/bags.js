const API_BAG = 'http://localhost:5005/api/bag';

// ========== LIST PAGE ==========
async function fetchBags() {
    const container = document.querySelector('#bag-container');
    try {
        const res = await fetch(API_BAG);
        const data = await res.json();
        renderBagTable(data);
        calculateStats(data);
    } catch (e) {
        container.innerHTML = `<div class="p-20 text-center text-red-500 font-bold">Serverlə bağlantı kəsildi.</div>`;
    }
}

function renderBagTable(items) {
    const container = document.querySelector('#bag-container');
    if (!items || items.length === 0) {
        container.innerHTML = `<div class="p-20 text-center text-slate-400 italic">Məlumat tapılmadı.</div>`;
        return;
    }

    container.innerHTML = `
        <table class="w-full text-left">
            <thead class="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <tr>
                    <th class="px-6 py-5">Tarix</th>
                    <th class="px-6 py-5">Şəxs</th>
                    <th class="px-6 py-5">Bağ / Geri</th>
                    <th class="px-6 py-5">Borc</th>
                    <th class="px-6 py-5">Ödəniş</th>
                    <th class="px-6 py-5 text-right">İşlemler</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
                ${items.map(b => `
                    <tr class="hover:bg-slate-50/50 transition-all group">
                        <td class="px-6 py-4 font-bold text-slate-700 text-sm italic">
                            ${new Date(b.date).toLocaleDateString('az-AZ')}
                        </td>
                        <td class="px-6 py-4">
                            <div class="font-bold text-slate-800">${b.personName}</div>
                            <div class="text-[10px] text-slate-400">${b.note || ''}</div>
                        </td>
                        <td class="px-6 py-4">
                            <span class="text-indigo-600 font-bold">${b.count}</span>
                            <span class="text-slate-300 mx-1">/</span>
                            <span class="text-slate-500 text-xs">${b.returnedCount}</span>
                        </td>
                        <td class="px-6 py-4 text-red-600 font-bold">${b.remainingDebt.toFixed(2)} AZN</td>
                        <td class="px-6 py-4">
                            <span class="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-black">
                                ${b.paymentAmount.toFixed(2)} AZN
                            </span>
                        </td>
                        <td class="px-6 py-4 text-right space-x-2">
                            <a href="/bags/${b.id}" class="px-3 py-1 text-blue-600 border border-blue-100 rounded-md hover:bg-blue-50 inline-block">Detallar</a>
                            <button onclick="editBag(${b.id}, '${b.date}', '${b.personName}', ${b.count}, ${b.returnedCount}, ${b.remainingDebt}, ${b.paymentAmount}, '${(b.note || '').replace(/'/g, "\\'")}')" class="px-3 py-1 text-orange-600 border border-orange-100 rounded-md hover:bg-orange-50">Düzenle</button>
                            <button onclick="deleteBag(${b.id})" class="px-3 py-1 text-red-600 border border-red-100 rounded-md hover:bg-red-50">Sil</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

function calculateStats(items) {
    const totalBags = items.reduce((acc, b) => acc + b.count, 0);
    const totalDebt = items.reduce((acc, b) => acc + b.remainingDebt, 0);
    const totalPayment = items.reduce((acc, b) => acc + b.paymentAmount, 0);

    document.getElementById('stat-total-bags').innerText = totalBags;
    document.getElementById('stat-total-debt').innerText = totalDebt.toFixed(2) + " AZN";
    document.getElementById('stat-total-payment').innerText = totalPayment.toFixed(2) + " AZN";
}

window.openBagModal = () => {
    document.getElementById('bag-form').reset();
    document.getElementById('bag-id').value = "";
    document.getElementById('bag-date').valueAsDate = new Date();
    document.getElementById('modal-title').innerText = "Yeni Qeydiyyat";
    document.getElementById('bag-modal').classList.remove('hidden');
};

window.closeBagModal = () => document.getElementById('bag-modal').classList.add('hidden');

window.editBag = (id, date, person, count, returned, debt, payment, note) => {
    document.getElementById('bag-id').value = id;
    document.getElementById('bag-date').value = date.split('T')[0];
    document.getElementById('bag-person').value = person;
    document.getElementById('bag-count').value = count;
    document.getElementById('bag-returned').value = returned;
    document.getElementById('bag-debt').value = debt;
    document.getElementById('bag-payment').value = payment;
    document.getElementById('bag-note').value = note;
    document.getElementById('modal-title').innerText = "Qeydi Düzənlə";
    document.getElementById('bag-modal').classList.remove('hidden');
};

window.deleteBag = async (id) => {
    if (!confirm("Bu qeydi silmək istədiyinizə əminsiniz?")) return;
    await fetch(`${API_BAG}/${id}`, { method: 'DELETE' });
    fetchBags();
};

document.addEventListener('DOMContentLoaded', () => {
    // DETAIL PAGE
    const isDetailPage = window.location.pathname.match(/^\/bags\/(\d+)$/);
    if (isDetailPage) {
        const bagId = isDetailPage[1];
        fetchBagDetail(bagId);
        return;
    }

    // LIST PAGE
    const form = document.getElementById('bag-form');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const id = document.getElementById('bag-id').value;
            const payload = {
                date: document.getElementById('bag-date').value,
                personName: document.getElementById('bag-person').value,
                count: parseInt(document.getElementById('bag-count').value),
                returnedCount: parseInt(document.getElementById('bag-returned').value),
                remainingDebt: parseFloat(document.getElementById('bag-debt').value),
                paymentAmount: parseFloat(document.getElementById('bag-payment').value),
                note: document.getElementById('bag-note').value
            };

            const url = id ? `${API_BAG}/${id}` : API_BAG;
            const method = id ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            closeBagModal();
            fetchBags();
        };
    }
    fetchBags();
});

// ========== DETAIL PAGE ==========
async function fetchBagDetail(id) {
    try {
        const res = await fetch(`${API_BAG}/${id}`);
        const b = await res.json();
        document.getElementById('detailBagPerson').textContent = b.personName;
        document.getElementById('detailBagDate').textContent = new Date(b.date).toLocaleDateString('az-AZ');
        document.getElementById('detailBagCount').textContent = b.count;
        document.getElementById('detailBagReturned').textContent = b.returnedCount;
        document.getElementById('detailBagToReturn').textContent = b.toBeReturned;
        document.getElementById('detailBagDebt').textContent = `${b.remainingDebt.toFixed(2)} AZN`;
        document.getElementById('detailBagPayment').textContent = `${b.paymentAmount.toFixed(2)} AZN`;
        document.getElementById('detailBagNote').textContent = b.note || '-';
        document.getElementById('bagPersonName').textContent = b.personName;

        // Find all entries for the same person (Vərəq12-style summary)
        const allRes = await fetch(API_BAG);
        const all = await allRes.json();
        const personEntries = all.filter(x => x.personName.toLowerCase() === b.personName.toLowerCase());

        const tbody = document.getElementById('bagHistory');
        if (personEntries.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="px-4 py-8 text-center text-slate-400">Məlumat yoxdur</td></tr>';
        } else {
            tbody.innerHTML = personEntries.map(be => `
                <tr class="border-b hover:bg-slate-50 ${be.id === b.id ? 'bg-indigo-50 font-semibold' : ''}">
                    <td class="px-4 py-2">${new Date(be.date).toLocaleDateString('az-AZ')}</td>
                    <td class="px-4 py-2">${be.count}</td>
                    <td class="px-4 py-2">${be.returnedCount}</td>
                    <td class="px-4 py-2">${be.toBeReturned}</td>
                    <td class="px-4 py-2 text-red-600">${be.remainingDebt.toFixed(2)}</td>
                    <td class="px-4 py-2 text-green-600">${be.paymentAmount.toFixed(2)}</td>
                    <td class="px-4 py-2 text-sm text-slate-500">${be.note || '-'}</td>
                </tr>
            `).join('');
        }

        // Vərəq12 summary
        const totalGiven = personEntries.reduce((s, x) => s + x.count, 0);
        const totalReturned = personEntries.reduce((s, x) => s + x.returnedCount, 0);
        const totalDebt = personEntries.reduce((s, x) => s + x.remainingDebt, 0);
        document.getElementById('totalGiven').textContent = totalGiven;
        document.getElementById('totalReturned').textContent = totalReturned;
        document.getElementById('totalBagDebt').textContent = `${totalDebt.toFixed(2)} AZN`;

    } catch (e) {
        console.error('Kaset detalları xətası:', e);
    }
}
