const delay = (ms) => new Promise(res => setTimeout(res, ms));

let rawSales = [
    {
        id: 1001,
        docNo: 'S-202601',
        customerName: 'Əli Məmmədov',
        date: '02.04.2026',
        totalAmount: 450.50,
        status: 'Ödənilib',
        itemsCount: 3,
        items: [
            { name: 'Qırmızı Alma (Göyçay)', quantity: 100, price: 1.50 },
            { name: 'Sultan Armudu', quantity: 50, price: 2.20 },
            { name: 'Ağ Gilas', quantity: 42.3, price: 4.50 }
        ]
    },
    {
        id: 1002,
        docNo: 'S-202602',
        customerName: 'Vüqar Hüseynov',
        date: '02.04.2026',
        totalAmount: 120.00,
        status: 'Gözləyir',
        itemsCount: 2,
        items: [
            { name: 'Sarı Limon (Lənkəran)', quantity: 40, price: 1.80 },
            { name: 'Xiyar (Şəmkir)', quantity: 34.2, price: 1.40 }
        ]
    },
    {
        id: 1003,
        docNo: 'S-202603',
        customerName: 'Natiq Əliyev',
        date: '01.04.2026',
        totalAmount: 890.00,
        status: 'Borc',
        itemsCount: 4,
        items: [
            { name: 'Nar (Göyçay)', quantity: 100, price: 3.50 },
            { name: 'Banan (İdxal)', quantity: 50, price: 2.60 },
            { name: 'Xurma (Qəbələ)', quantity: 100, price: 2.90 },
            { name: 'Kartof (Gədəbəy)', quantity: 126.3, price: 0.95 }
        ]
    },
    {
        id: 1004,
        docNo: 'S-202604',
        customerName: 'Leyla Bağırova',
        date: '01.04.2026',
        totalAmount: 55.40,
        status: 'Ödənilib',
        itemsCount: 1,
        items: [
            { name: 'Çiyələk (İstixana)', quantity: 10, price: 5.54 }
        ]
    },
    {
        id: 1005,
        docNo: 'S-202605',
        customerName: 'Sabir Quliyev',
        date: '31.03.2026',
        totalAmount: 2100.00,
        status: 'Ödənilib',
        itemsCount: 2,
        items: [
            { name: 'Fındıq (Təmizlənmiş)', quantity: 100, price: 13.00 },
            { name: 'Qoz (Qabıqlı)', quantity: 114.2, price: 7.00 }
        ]
    }
];

export const SalesService = {
    getSales: async (searchQuery = '') => {
        await delay(600);
        if (!searchQuery) return rawSales;
        const query = searchQuery.toLowerCase();
        return rawSales.filter(s =>
            s.customerName?.toLowerCase().includes(query) ||
            s.docNo?.toLowerCase().includes(query)
        );
    },

    getSaleById: async (id) => {
        await delay(300);
        return rawSales.find(s => s.id === id);
    },

    createSale: async (saleData) => {
        await delay(500);
        const newSale = {
            id: Math.floor(Math.random() * 5000) + 2000,
            docNo: `S-${new Date().getFullYear()}${Math.floor(Math.random() * 900) + 100}`,
            customerName: saleData.customerName,
            date: new Date().toLocaleDateString('az-AZ'),
            totalAmount: parseFloat(saleData.totalAmount || 0),
            status: saleData.status || 'Gözləyir',
            itemsCount: saleData.items ? saleData.items.length : 0,
            items: saleData.items || []
        };
        rawSales.unshift(newSale);
        return { success: true, data: newSale };
    },

    updateSale: async (id, updatedData) => {
        await delay(500);
        const index = rawSales.findIndex(s => s.id === id);
        if (index !== -1) {
            rawSales[index] = { ...rawSales[index], ...updatedData };
            return { success: true, data: rawSales[index] };
        }
        throw new Error("Satış tapılmadı");
    },

    deleteSale: async (id) => {
        await delay(400);
        rawSales = rawSales.filter(s => s.id !== id);
        return { success: true };
    }
};