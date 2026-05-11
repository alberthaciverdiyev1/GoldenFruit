const API_PURCHASE = 'http://localhost:5005/api/purchase';
const API_CUSTOMERS = 'http://localhost:5005/api/customer';
const API_PRODUCTS = 'http://localhost:5005/api/product';

let basket = [];
let allProducts = [];

async function fetchPurchases() {
    const container = document.querySelector('#purchase-container');
    try {
        const res = await fetch(API_PURCHASE);
        const data = await res.json();
        renderPurchaseTable(data);
    } catch (e) {
        container.innerHTML = `<div class="p-8 text-red-500 text-center font-bold italic">Backend Connection Failed!</div>`;
    }
}

async function loadModalData() {
    try {
        const [custRes, prodRes] = await Promise.all([fetch(API_CUSTOMERS), fetch(API_PRODUCTS)]);
        const customers = await custRes.json();
        allProducts = await prodRes.json();

        const custSelect = document.getElementById('purchase-customerId');
        custSelect.innerHTML = '<option value="">Müştəri Seç...</option>' +
            customers.map(c => `<option value="${c.id}">${c.name} ${c.surname}</option>`).join('');

        const prodSelect = document.getElementById('item-product-id');
        prodSelect.innerHTML = '<option value="">Məhsul Seç...</option>' +
            allProducts.map(p => `<option value="${p.id}" data-price="${p.buyingPrice}" data-weight="${p.weight}">${p.name} (${p.buyingPrice} AZN)</option>`).join('');
    } catch (e) {
        console.error("Modal verileri yüklenemedi:", e);
    }
}

// --- SEPET MANTIĞI ---

window.addItemToBasket = () => {
    const prodSelect = document.getElementById('item-product-id');
    const qtyInput = document.getElementById('item-qty');
    const priceInput = document.getElementById('item-price');

    const productId = parseInt(prodSelect.value);
    const productName = prodSelect.options[prodSelect.selectedIndex]?.text.split(' (')[0];
    const quantity = parseInt(qtyInput.value);
    const price = parseFloat(priceInput.value);

    if (!productId || isNaN(quantity) || isNaN(price) || quantity <= 0) {
        alert("Lütfen geçerli ürün, miktar və fiyat girin.");
        return;
    }

    const existing = basket.find(i => i.productId === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        basket.push({
            productId, productName, quantity, price,
            weight: 0, boxWeight: 0, weightWithBox: 0
        });
    }

    qtyInput.value = "";
    priceInput.value = "";
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
        const lineTotal = item.quantity * item.price;
        total += lineTotal;
        return `
            <tr class="text-sm font-semibold text-slate-700 animate-in slide-in-from-left-2 duration-200">
                <td class="px-4 py-3">${item.productName}</td>
                <td class="px-4 py-3 text-center">${item.quantity}</td>
                <td class="px-4 py-3">${item.price.toFixed(2)} AZN</td>
                <td class="px-4 py-3">${lineTotal.toFixed(2)} AZN</td>
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

function renderPurchaseTable(purchases) {
    const container = document.querySelector('#purchase-container');
    if (!purchases || purchases.length === 0) {
        container.innerHTML = `<div class="p-20 text-center text-slate-400 font-bold italic">Henüz bir alış kaydı bulunmuyor.</div>`;
        return;
    }

    container.innerHTML = `
        <table class="w-full text-left">
            <thead class="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b">
                <tr>
                    <th class="px-6 py-4">Müştəri</th>
                    <th class="px-6 py-4 text-center">Məhsul Sayı</th>
                    <th class="px-6 py-4">Toplam Qiymət</th>
                    <th class="px-6 py-4">Tarix</th>
                    <th class="px-6 py-4 text-right">İşlem</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
                ${purchases.map(p => `
                    <tr class="hover:bg-green-50/40 transition-all group">
                        <td class="px-8 py-5 font-bold">${p.customerName}</td>
                        <td class="px-6 py-5 text-center font-bold text-slate-600">${p.totalQuantity}</td>
                        <td class="px-6 py-5 font-black text-green-600">${p.totalPrice.toFixed(2)} AZN</td>
                        <td class="px-6 py-5 text-slate-400 text-xs font-bold">${new Date(p.createdAt).toLocaleString('az-AZ')}</td>
                        <td class="px-6 py-5 text-right space-x-2">
                            <button onclick="viewDetails(${p.id})" class="px-3 py-1 text-blue-600 border border-blue-100 rounded-md hover:bg-blue-50">Detallar</button>
                            <button onclick="deletePurchase(${p.id})" class="px-3 py-1 text-red-600 border border-red-100 rounded-md hover:bg-red-50">Sil</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

window.openPurchaseModal = () => {
    basket = [];
    renderBasket();
    document.getElementById('purchase-form').reset();
    document.getElementById('modal-title').innerText = "Yeni Alış";
    document.getElementById('purchase-modal').classList.remove('hidden');
    loadModalData();
};

window.closePurchaseModal = () => document.getElementById('purchase-modal').classList.add('hidden');

// --- KAYDETME VE SİLME ---

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('purchase-form');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            if (!basket.length) {
                alert("Lütfen en az bir ürün ekleyin!");
                return;
            }

            const payload = {
                customerId: parseInt(document.getElementById('purchase-customerId').value),
                items: basket.map(i => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    price: i.price,
                    weight: i.weight,
                    boxWeight: i.boxWeight,
                    weightWithBox: i.weightWithBox
                }))
            };

            await fetch(API_PURCHASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            window.closePurchaseModal();
            fetchPurchases();
        };
    }

    document.getElementById('item-product-id')?.addEventListener('change', (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const price = selectedOption.getAttribute('data-price');
        document.getElementById('item-price').value = price || "";
    });

    fetchPurchases();
});

window.viewDetails = async (id) => {
    try {
        const res = await fetch(`${API_PURCHASE}/${id}`);
        const data = await res.json();

        document.getElementById('details-customer').innerText = data.customerName;
        document.getElementById('details-total').innerText = `${data.totalPrice.toFixed(2)} AZN`;
        document.getElementById('details-total-weight').innerText = data.totalWeight ? `${data.totalWeight.toFixed(2)} kg` : '0 kg';
        document.getElementById('details-date').innerText = new Date(data.createdAt).toLocaleString('tr-TR');

        const itemsBody = document.getElementById('details-items-body');
        itemsBody.innerHTML = data.items.map(i => `
            <tr>
                <td class="px-6 py-4 text-slate-400">${i.productName}</td>
                <td class="px-6 py-4 text-center">${i.quantity}</td>
                <td class="px-6 py-4">${i.price.toFixed(2)} AZN</td>
                <td class="px-6 py-4 text-right font-black text-slate-800">${(i.quantity * i.price).toFixed(2)} AZN</td>
            </tr>
        `).join('');

        document.getElementById('details-modal').classList.remove('hidden');
    } catch (e) {
        alert("Detaylar yüklenirken hata oluştu!");
    }
};

window.closeDetailsModal = () => document.getElementById('details-modal').classList.add('hidden');

window.deletePurchase = async (id) => {
    if (!confirm("Bu alışı silmek istediğinize emin misiniz?")) return;
    await fetch(`${API_PURCHASE}/${id}`, { method: 'DELETE' });
    fetchPurchases();
};