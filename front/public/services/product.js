const API_BASE = 'http://localhost:5005/api/product';

// ========== LIST PAGE ==========
async function fetchProducts() {
    const container = document.querySelector('#product-container');
    try {
        const res = await fetch(API_BASE);
        const data = await res.json();
        renderTable(data);
    } catch (e) {
        container.innerHTML = `<div class="p-8 text-red-500 text-center font-bold">Backend Bağlantısı Başarısız!</div>`;
    }
}

function renderTable(products) {
    const container = document.querySelector('#product-container');
    if (!products || products.length === 0) {
        container.innerHTML = `<div class="p-12 text-center text-slate-400">Kayıtlı product bulunamadı.</div>`;
        return;
    }

    container.innerHTML = `
        <table class="w-full text-left">
            <thead class="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b">
                <tr>
                    <th class="px-6 py-4">Ad</th>
                    <th class="px-6 py-4">Stok</th>
                    <th class="px-6 py-4">Alış Qiyməti</th>
                    <th class="px-6 py-4">Satış Qiyməti</th>
                    <th class="px-6 py-4">Çəki</th>
                    <th class="px-6 py-4">Yaradılma Tarixi</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                ${products.map(c => `
                    <tr class="hover:bg-orange-50/30 transition-colors">
                        <td class="px-6 py-4">
                            <div class="font-bold text-slate-800">${c.name}</div>
                        </td>
                        <td class="px-6 py-4 text-slate-600">${c.stock || '-'}</td>
                        <td class="px-6 py-4 text-slate-600">${c.buyingPrice ? c.buyingPrice.toFixed(2) : '-'}</td>
                        <td class="px-6 py-4 text-slate-600">${c.sellingPrice ? c.sellingPrice.toFixed(2) : '-'}</td>
                        <td class="px-6 py-4 text-slate-600">${c.weight || '-'}</td>
                        <td class="px-6 py-4 text-slate-600">${new Date(c.createdAt).toLocaleString('az-AZ')}</td>
                        <td class="px-6 py-4 text-right space-x-2">
                            <a href="/products/${c.id}" class="px-3 py-1 text-blue-600 border border-blue-100 rounded-md hover:bg-blue-50 inline-block">Detallar</a>
                            <button onclick="editProduct(${c.id}, '${c.name}', '${c.stock}', '${c.buyingPrice || ''}','${c.sellingPrice || ''}','${c.weight || ''}')" class="px-3 py-1 text-orange-600 border border-orange-100 rounded-md hover:bg-orange-50">Edit</button>
                            <button onclick="deleteProduct(${c.id})" class="px-3 py-1 text-red-600 border border-red-100 rounded-md hover:bg-red-50">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

window.deleteProduct = async (id) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    fetchProducts();
};

window.openProductModal = () => {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = "";
    document.getElementById('modal-title').innerText = "Yeni Məhsul Elave Et";
    document.getElementById('product-modal').classList.remove('hidden');
};

window.closeProductModal = () => document.getElementById('product-modal').classList.add('hidden');

window.editProduct = (id, name, stock, buyingPrice, sellingPrice, weight) => {
    document.getElementById('product-id').value = id;
    document.getElementById('prod-name').value = name;
    document.getElementById('prod-stock').value = stock;
    document.getElementById('prod-buyingPrice').value = buyingPrice;
    document.getElementById('prod-sellingPrice').value = sellingPrice;
    document.getElementById('prod-weight').value = weight;
    document.getElementById('modal-title').innerText = "Edit Product";
    document.getElementById('product-modal').classList.remove('hidden');
};

document.addEventListener('DOMContentLoaded', () => {
    // DETAIL PAGE
    const isDetailPage = window.location.pathname.match(/^\/products\/(\d+)$/);
    if (isDetailPage) {
        const productId = isDetailPage[1];
        fetchProductDetail(productId);
        return;
    }

    // LIST PAGE
    const form = document.getElementById('product-form');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const id = document.getElementById('product-id').value;
            const payload = {
                name: document.getElementById('prod-name').value,
                stock: document.getElementById('prod-stock').value,
                buyingPrice: document.getElementById('prod-buyingPrice').value,
                sellingPrice: document.getElementById('prod-sellingPrice').value,
                weight: document.getElementById('prod-weight').value,
            };
            const method = id ? 'PUT' : 'POST';
            const url = id ? `${API_BASE}/${id}` : API_BASE;

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            window.closeProductModal();
            fetchProducts();
        };
    }
    fetchProducts();
});

// ========== DETAIL PAGE ==========
async function fetchProductDetail(id) {
    try {
        const res = await fetch(`${API_BASE}/${id}`);
        const p = await res.json();
        document.getElementById('detailProductName').textContent = p.name;
        document.getElementById('detailStock').textContent = p.stock;
        document.getElementById('detailBuyPrice').textContent = `${p.buyingPrice ? p.buyingPrice.toFixed(2) : '0.00'} AZN`;
        document.getElementById('detailSellPrice').textContent = `${p.sellingPrice ? p.sellingPrice.toFixed(2) : '0.00'} AZN`;
        document.getElementById('detailWeight').textContent = `${p.weight || '0'} kq`;
        document.getElementById('detailCreatedAt').textContent = new Date(p.createdAt).toLocaleDateString('az-AZ');

        const profit = ((p.sellingPrice || 0) - (p.buyingPrice || 0)) * (p.stock || 0);
        document.getElementById('detailProfit').textContent = `${profit.toFixed(2)} AZN`;

        // Sale history - fetch all sales and filter by this product
        try {
            const salesRes = await fetch('http://localhost:5005/api/sale');
            const allSales = await salesRes.json();
            const saleDetails = [];
            await Promise.all(allSales.map(async (s) => {
                try {
                    const dRes = await fetch(`http://localhost:5005/api/sale/${s.id}`);
                    const d = await dRes.json();
                    const matchItems = (d.items || []).filter(item => item.productId == id);
                    matchItems.forEach(item => {
                        saleDetails.push({
                            date: d.createdAt,
                            quantity: item.quantity,
                            price: item.priceAtSale,
                            weight: item.weight,
                            total: item.quantity * item.priceAtSale
                        });
                    });
                } catch (_) {}
            }));
            const salesTbody = document.getElementById('productSales');
            if (saleDetails.length === 0) {
                salesTbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-400">Satış yoxdur</td></tr>';
            } else {
                salesTbody.innerHTML = saleDetails.map(s => `
                    <tr class="border-b hover:bg-slate-50">
                        <td class="px-4 py-2">${new Date(s.date).toLocaleDateString('az-AZ')}</td>
                        <td class="px-4 py-2">${s.quantity}</td>
                        <td class="px-4 py-2">${s.price.toFixed(2)}</td>
                        <td class="px-4 py-2">${s.weight || '-'}</td>
                        <td class="px-4 py-2 font-medium">${s.total.toFixed(2)}</td>
                    </tr>
                `).join('');
            }
        } catch (_) {
            document.getElementById('productSales').innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-400">Yükləmə xətası</td></tr>';
        }

        // Purchase history
        try {
            const purRes = await fetch('http://localhost:5005/api/purchase');
            const allPurchases = await purRes.json();
            const purDetails = [];
            await Promise.all(allPurchases.map(async (p) => {
                try {
                    const dRes = await fetch(`http://localhost:5005/api/purchase/${p.id}`);
                    const d = await dRes.json();
                    const matchItems = (d.items || []).filter(item => item.productId == id);
                    matchItems.forEach(item => {
                        purDetails.push({
                            date: d.createdAt,
                            quantity: item.quantity,
                            price: item.price,
                            weight: item.weight,
                            total: item.quantity * item.price
                        });
                    });
                } catch (_) {}
            }));
            const purTbody = document.getElementById('productPurchases');
            if (purDetails.length === 0) {
                purTbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-400">Alış yoxdur</td></tr>';
            } else {
                purTbody.innerHTML = purDetails.map(p => `
                    <tr class="border-b hover:bg-slate-50">
                        <td class="px-4 py-2">${new Date(p.date).toLocaleDateString('az-AZ')}</td>
                        <td class="px-4 py-2">${p.quantity}</td>
                        <td class="px-4 py-2">${p.price.toFixed(2)}</td>
                        <td class="px-4 py-2">${p.weight || '-'}</td>
                        <td class="px-4 py-2 font-medium">${p.total.toFixed(2)}</td>
                    </tr>
                `).join('');
            }
        } catch (_) {
            document.getElementById('productPurchases').innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-400">Yükləmə xətası</td></tr>';
        }

        // Stock balances
        try {
            const sbRes = await fetch('http://localhost:5005/api/stockbalance');
            const allSB = await sbRes.json();
            const related = allSB.filter(s => (s.description || '').toLowerCase().includes((p.name || '').toLowerCase()) || (s.relatedPerson || '').toLowerCase().includes((p.name || '').toLowerCase()));
            const sbTbody = document.getElementById('productStockBalances');
            if (related.length === 0) {
                sbTbody.innerHTML = '<tr><td colspan="4" class="px-4 py-8 text-center text-slate-400">Stok qeydi yoxdur</td></tr>';
            } else {
                sbTbody.innerHTML = related.slice(0, 20).map(s => `
                    <tr class="border-b hover:bg-slate-50">
                        <td class="px-4 py-2">${new Date(s.date).toLocaleDateString('az-AZ')}</td>
                        <td class="px-4 py-2">${s.description}</td>
                        <td class="px-4 py-2">${s.quantity ?? '-'}</td>
                        <td class="px-4 py-2">${s.netWeight ? s.netWeight.toFixed(1) : '-'}</td>
                    </tr>
                `).join('');
            }
        } catch (_) {}
    } catch (e) {
        console.error('Məhsul detalları xətası:', e);
    }
}
