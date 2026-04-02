const delay = (ms) => new Promise(res => setTimeout(res, ms));

let rawPurchases = [
    {
        id: 2001,
        docNo: 'P-202601',
        supplierName: 'Göyçay Bağları ASC',
        date: '02.04.2026',
        totalAmount: 1500.00,
        status: 'Tamamlandı',
        itemsCount: 2,
        items: [
            { name: 'Qırmızı Alma', quantity: 2000, price: 0.50 },
            { name: 'Nar', quantity: 500, price: 1.00 }
        ]
    },
    {
        id: 2002,
        docNo: 'P-202602',
        supplierName: 'Lənkəran Sitrus MMC',
        date: '02.04.2026',
        totalAmount: 850.40,
        status: 'Gözləyir',
        itemsCount: 1,
        items: [
            { name: 'Sarı Limon', quantity: 1215, price: 0.70 }
        ]
    },
    {
        id: 2003,
        docNo: 'P-202603',
        supplierName: 'Şəmkir İstixanaları',
        date: '01.04.2026',
        totalAmount: 420.00,
        status: 'Tamamlandı',
        itemsCount: 2,
        items: [
            { name: 'Pomidor (Zirə)', quantity: 500, price: 0.60 },
            { name: 'Xiyar (Şəmkir)', quantity: 300, price: 0.40 }
        ]
    },
    {
        id: 2004,
        docNo: 'P-202604',
        supplierName: 'Xarici İdxal Brendləri',
        date: '31.03.2026',
        totalAmount: 2450.00,
        status: 'Tamamlandı',
        itemsCount: 1,
        items: [
            { name: 'Banan (İdxal)', quantity: 1500, price: 1.63 }
        ]
    },
    {
        id: 2005,
        docNo: 'P-202605',
        supplierName: 'Naxçıvan Meyvəçilik',
        date: '30.03.2026',
        totalAmount: 600.00,
        status: 'Gözləyir',
        itemsCount: 1,
        items: [
            { name: 'Şaftalı', quantity: 500, price: 1.20 }
        ]
    }
];

export const PurchaseService = {
    // 1. Bütün alışları gətirir
    getPurchases: async (searchQuery = '') => {
        await delay(600);
        if (!searchQuery) return rawPurchases;
        const query = searchQuery.toLowerCase();
        return rawPurchases.filter(p =>
            p.supplierName?.toLowerCase().includes(query) ||
            p.docNo?.toLowerCase().includes(query)
        );
    },

    // 2. ID-yə görə tək alış detallarını gətirir
    getPurchaseById: async (id) => {
        await delay(300);
        return rawPurchases.find(p => p.id === id);
    },

    // 3. Yeni alış sənədi yaradır
    createPurchase: async (purchaseData) => {
        await delay(500);
        const newPurchase = {
            id: Math.floor(Math.random() * 5000) + 3000,
            docNo: `P-${new Date().getFullYear()}${Math.floor(Math.random() * 900) + 100}`,
            supplierName: purchaseData.supplierName,
            date: new Date().toLocaleDateString('az-AZ'),
            totalAmount: parseFloat(purchaseData.totalAmount || 0),
            status: purchaseData.status || 'Gözləyir',
            itemsCount: purchaseData.items ? purchaseData.items.length : 0,
            items: purchaseData.items || []
        };
        rawPurchases.unshift(newPurchase);
        return { success: true, data: newPurchase };
    },

    // 4. Alış sənədini yeniləyir
    updatePurchase: async (id, updatedData) => {
        await delay(500);
        const index = rawPurchases.findIndex(p => p.id === id);
        if (index !== -1) {
            rawPurchases[index] = { ...rawPurchases[index], ...updatedData };
            return { success: true, data: rawPurchases[index] };
        }
        throw new Error("Alış sənədi tapılmadı");
    },

    // 5. Alış sənədini silir
    deletePurchase: async (id) => {
        await delay(400);
        rawPurchases = rawPurchases.filter(p => p.id !== id);
        return { success: true };
    }
};