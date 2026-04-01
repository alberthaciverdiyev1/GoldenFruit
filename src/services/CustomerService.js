const delay = (ms) => new Promise(res => setTimeout(res, ms));

let rawTransactions = [
    { id: 1, date: '2026-03-01', type: 'Sale', amount: 1200, note: 'Topdan satiş - Alma' },
    { id: 2, date: '2026-03-05', type: 'Purchase', amount: 500, note: 'Gübrə alışı' },
    { id: 3, date: '2026-03-10', type: 'Sale', amount: 3050.50, note: 'Eksport - Rusiya bazarı' },
    { id: 4, date: '2026-03-12', type: 'Purchase', amount: 700, note: 'Boş yeşik alışı' },
    { id: 5, date: '2026-03-15', type: 'Sale', amount: 450, note: 'Yerli bazar satışı' },
    { id: 6, date: '2026-03-15', type: 'Balance', amount: 450, note: 'Yerli bazar satışı' },
    { id: 7, date: '2026-03-15', type: 'Balance', amount: 450, note: 'Yerli bazar satışı' },

];

export const CustomerService = {
    getDetails: async (customerId, startDate, endDate, type = 'All') => {
        await delay(800);

        let filtered = rawTransactions.filter(t => {
            const tDate = new Date(t.date);
            const isWithinDate = tDate >= new Date(startDate) && tDate <= new Date(endDate);
            const isTypeMatch = type === 'All' || t.type === type;
            return isWithinDate && isTypeMatch;
        });

        const totalSales = rawTransactions.filter(t => t.type === 'Sale').reduce((s, t) => s + t.amount, 0);
        const totalPurchases = rawTransactions.filter(t => t.type === 'Purchase').reduce((s, t) => s + t.amount, 0);

        return {
            totalSales,
            totalPurchases,
            balance: totalSales - totalPurchases,
            lastUpdate: new Date().toLocaleDateString(),
            transactions: filtered
        };
    },
    create: async (newData) => {
        await delay(500);
        const newEntry = {
            id: Math.floor(Math.random() * 10000),
            date: new Date().toISOString().split('T')[0],
            ...newData,
            amount: parseFloat(newData.amount || 0)
        };
        rawTransactions.push(newEntry);
        return { success: true, data: newEntry };
    },


    update: async (id, updatedData) => {
        await delay(500);
        const index = rawTransactions.findIndex(t => t.id === id);
        if (index !== -1) {
            rawTransactions[index] = {
                ...rawTransactions[index],
                ...updatedData,
                amount: parseFloat(updatedData.amount || rawTransactions[index].amount)
            };
            return { success: true, data: rawTransactions[index] };
        }
        throw new Error("Məlumat tapılmadı");
    },

    delete: async (id) => {
        await delay(500);
        rawTransactions = rawTransactions.filter(t => t.id !== id);
        return { success: true };
    }
};