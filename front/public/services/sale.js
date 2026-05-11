const API_SALES = 'http://localhost:5005/api/sale';
const API_CUSTOMERS = 'http://localhost:5005/api/customer';
const API_PRODUCTS = 'http://localhost:5005/api/product';

let basket = [];
let allProducts = [];


async function fetchSales() {
    const container = document.querySelector('#sale-container');
    try {
        const res = await fetch(API_SALES);
        const data = await res.json();
        renderSalesTable(data);
    } catch (e) {
        container.innerHTML = `<div class="p-8 text-red-500 text-center font-bold italic">Backend Connection Failed!</div>`;
    }
}

async function loadModalData() {
    try {
        const [custRes, prodRes] = await Promise.all([fetch(API_CUSTOMERS), fetch(API_PRODUCTS)]);
        const customers = await custRes.json();
        allProducts = await prodRes.json();

        const custSelect = document.getElementById('sale-customerId');
        custSelect.innerHTML = '<option value="">Müştəri Seç...</option>' +
            customers.map(c => `<option value="${c.id}">${c.name} ${c.surname}</option>`).join('');

        const prodSelect = document.getElementById('item-product-id');
        prodSelect.innerHTML = '<option value="">Məhsul Seç...</option>' +
            allProducts.map(p => `<option value="${p.id}" data-price="${p.sellingPrice}" data-weight="${p.weight}">${p.name} (${p.sellingPrice} AZN)</option>`).join('');
    } catch (e) {
        console.error("Modal verileri yüklenemedi:", e);
    }
}

// --- SEPET MANTIĞI ---

window.addItemToBasket = () => {
    const prodSelect = document.getElementById('item-product-id');
    const qtyInput = document.getElementById('item-qty');
    const weightInput = document.getElementById('item-weight');
    const priceInput = document.getElementById('item-price');

    const productId = prodSelect.value;
    const productName = prodSelect.options[prodSelect.selectedIndex]?.text.split(' (')[0];
    const qty = parseInt(qtyInput.value);
    const weigh = parseInt(weightInput.value);
    const price = parseFloat(priceInput.value);

    if (!productId || isNaN(qty) || isNaN(price) || qty <= 0) {
        alert("Lütfen geçerli ürün, miktar ve fiyat girin.");
        return;
    }

    // Sepette zaten varsa miktarı artır, yoksa yeni ekle
    const existing = basket.find(item => item.productId === productId);
    if (existing) {
        existing.quantity += qty;
    } else {
        basket.push({productId, productName, quantity: qty, priceAtSale: price, weight: weigh});
    }

    // Inputları temizle
    qtyInput.value = "1";
    priceInput.value = "";
    weightInput.value = "";
    renderBasket();
};

window.removeFromBasket = (index) => {
    basket.splice(index, 1);
    renderBasket();
};

function renderBasket() {
    const body = document.getElementById('basket-body');
    const totalDisplay = document.getElementById('total-price-display');
    let total = 0;

    body.innerHTML = basket.map((item, index) => {
        const lineTotal = item.quantity * item.priceAtSale;
        total += lineTotal;
        return `
            <tr class="text-sm font-semibold text-slate-700 animate-in slide-in-from-left-2 duration-200">
                <td class="px-4 py-3">${item.productName}</td>
                <td class="px-4 py-3">${item.quantity}</td>
                <td class="px-4 py-3">${item.weight * item.quantity}</td>
                <td class="px-4 py-3">${item.priceAtSale.toFixed(2)}</td>
                <td class="px-4 py-3">${(item.quantity * item.priceAtSale).toFixed(2)}</td>

                <td class="px-4 py-3 text-right">
                    <button type="button" onclick="removeFromBasket(${index})" class="text-red-400 hover:text-red-600 transition-colors">
                        <i class='bx bx-trash-alt'></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    totalDisplay.innerText = total.toFixed(2);
}


// --- ANA TABLO VE MODAL ---

function renderSalesTable(sales) {
    const container = document.querySelector('#sale-container');
    if (!sales || sales.length === 0) {
        container.innerHTML = `<div class="p-20 text-center text-slate-400 font-bold italic">Henüz bir satış kaydı bulunmuyor.</div>`;
        return;
    }

    container.innerHTML = `
        <table class="w-full text-left">
            <thead class="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b">
                <tr>
                    <th class="px-6 py-4">Müştəri</th>
                    <th class="px-6 py-4 text-center">Məhsul Sayı</th>
                    <th class="px-6 py-4">Toplam Qiymət</th>
                    <th class="px-6 py-4">Type</th>
                    <th class="px-6 py-4">Tarix</th>
                    <th class="px-6 py-4 text-right">İşlem</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
                ${sales.map(s => `
                    <tr class="hover:bg-orange-50/40 transition-all group">
                        <td class="px-8 py-5 font-bold">
                            ${s.customerName}
                        </td>
                        <td class="px-6 py-5 text-center font-bold text-slate-600">${s.totalQuantity}</td>
                        <td class="px-6 py-5 font-black text-orange-600">${s.totalPrice.toFixed(2)} AZN</td>
                        <td class="px-6 py-5 font-black text-orange-600">${s.type ? (s.type === "cash" ? "Nagd" : "Borc") : ""} </td>
                        <td class="px-6 py-5 text-slate-400 text-xs font-bold">${new Date(s.createdAt).toLocaleString('az-AZ')}</td>
                             <td class="px-6 py-4 text-right space-x-2">
                            <button onclick="viewDetails(${s.id})" class="px-3 py-1 text-blue-600 border border-blue-100 rounded-md hover:bg-blue-50">Detallar</button>
                            <button onclick="deleteSale(${s.id})" class="px-3 py-1 text-red-600 border border-red-100 rounded-md hover:bg-red-50">Sil</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

window.openSaleModal = () => {
    basket = [];
    renderBasket();
    document.getElementById('sale-form').reset();
    document.getElementById('sale-id').value = "";
    document.getElementById('modal-title').innerText = "Yeni Satış";
    document.getElementById('sale-modal').classList.remove('hidden');
    loadModalData();
};

window.closeSaleModal = () => document.getElementById('sale-modal').classList.add('hidden');

// --- KAYDETME VE SİLME ---

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sale-form');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            if (basket.length === 0) return alert("Lütfen en az bir ürün ekleyin!");

            const payload = {
                customerId: parseInt(document.getElementById('sale-customerId').value),
                type: document.getElementById('sale-type').value,
                items: basket.map(item => ({
                    productId: parseInt(item.productId),
                    quantity: item.quantity,
                    priceAtSale: item.priceAtSale
                }))
            };

            await fetch(API_SALES, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });

            window.closeSaleModal();
            fetchSales();
        };
    }

    document.getElementById('item-product-id')?.addEventListener('change', (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const price = selectedOption.getAttribute('data-price');
        document.getElementById('item-price').value = price || "";

        const weight = selectedOption.getAttribute('data-weight');
        document.getElementById('item-weight').value = weight || "";
    });

    fetchSales();
});

window.viewDetails = async (id) => {
    try {
        const res = await fetch(`${API_SALES}/${id}`);
        const data = await res.json();

        const totalPrice = data.totalPrice;
        const paidAmount = data.paymentHistory
            .filter(p => p.type === "Payment")
            .reduce((sum, p) => sum + Math.abs(p.amount), 0);
        const remaining = totalPrice - paidAmount;

        document.getElementById('details-customer').innerText = data.customerName;
        document.getElementById('details-payment-type').innerText = (data.type === "debt" ? "Borc" : "Nagd");
        document.getElementById('details-total').innerText = `${totalPrice.toFixed(2)} AZN`;

        const paidTotalEl = document.getElementById('details-paid-total');
        const paySection = document.getElementById('details-pay-section');

        if (data.type === "debt") {
            paidTotalEl.innerText = `Ödənildi: ${paidAmount.toFixed(2)} / ${totalPrice.toFixed(2)} AZN`;
            paidTotalEl.classList.remove('text-orange-600');
            paidTotalEl.classList.add(remaining <= 0 ? 'text-green-600' : 'text-orange-600');

            if (remaining > 0) {
                paySection.classList.remove('hidden');
                document.getElementById('pay-amount').value = remaining.toFixed(2);
                document.getElementById('pay-remaining').innerText = remaining.toFixed(2);
                document.getElementById('pay-sale-id').value = id;
                document.getElementById('pay-message').classList.add('hidden');
            } else {
                paySection.classList.add('hidden');
            }
        } else {
            paidTotalEl.innerText = '';
            paySection.classList.add('hidden');
        }

        document.getElementById('details-date').innerText = new Date(data.createdAt).toLocaleString('tr-TR');

        const itemsBody = document.getElementById('details-items-body');
        itemsBody.innerHTML = data.items.map(item => `
            <tr>
                <td class="px-6 py-4 text-slate-400">${item.productName}</td>
                <td class="px-6 py-4 text-center">${item.quantity}</td>
                <td class="px-6 py-4">${item.priceAtSale.toFixed(2)} AZN</td>
                <td class="px-6 py-4 text-right font-black text-slate-800">${(item.quantity * item.priceAtSale).toFixed(2)} AZN</td>
            </tr>
        `).join('');

        // Ödeme geçmişini göster
        const payHistory = document.getElementById('details-pay-history');
        const payments = data.paymentHistory.filter(p => p.type === "Payment");
        if (payments.length > 0) {
            payHistory.classList.remove('hidden');
            document.getElementById('pay-history-body').innerHTML = payments.map(p => `
                <tr>
                    <td class="px-6 py-3 text-slate-400">${new Date(p.createdAt).toLocaleString('tr-TR')}</td>
                    <td class="px-6 py-3 font-bold text-green-600">${Math.abs(p.amount).toFixed(2)} AZN</td>
                </tr>
            `).join('');
        } else {
            payHistory.classList.add('hidden');
        }

        document.getElementById('details-modal').classList.remove('hidden');
    } catch (e) {
        alert("Detaylar yüklenirken hata oluştu!");
    }
};

window.paySale = async () => {
    const saleId = document.getElementById('pay-sale-id').value;
    const amount = parseFloat(document.getElementById('pay-amount').value);
    const msgEl = document.getElementById('pay-message');

    if (isNaN(amount) || amount <= 0) {
        msgEl.className = 'text-red-500 text-sm font-bold';
        msgEl.innerText = 'Lütfen geçerli bir miktar girin!';
        msgEl.classList.remove('hidden');
        return;
    }

    try {
        const res = await fetch(`${API_SALES}/${saleId}/pay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });

        const result = await res.json();

        if (!res.ok) {
            msgEl.className = 'text-red-500 text-sm font-bold';
            msgEl.innerText = result.message || 'Ödeme yapılırken hata oluştu!';
            msgEl.classList.remove('hidden');
            return;
        }

        msgEl.className = 'text-green-600 text-sm font-bold';
        msgEl.innerText = `✅ ${amount.toFixed(2)} AZN ödəniş qeydə alındı!`;
        msgEl.classList.remove('hidden');

        // Detayları yenile
        setTimeout(() => viewDetails(parseInt(saleId)), 1000);
    } catch (e) {
        msgEl.className = 'text-red-500 text-sm font-bold';
        msgEl.innerText = 'Ödeme yapılırken hata oluştu!';
        msgEl.classList.remove('hidden');
    }
};

window.closeDetailsModal = () => document.getElementById('details-modal').classList.add('hidden');

window.deleteSale = async (id) => {
    if (!confirm("Bu satışı silmek istediğinize emin misiniz?")) return;
    await fetch(`${API_SALES}/${id}`, {method: 'DELETE'});
    fetchSales();
};