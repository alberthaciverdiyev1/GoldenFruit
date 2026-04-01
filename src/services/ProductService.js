const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Məhsul siyahısı üçün mock data
let rawProducts = [
    { id: 101, name: 'Qırmızı Alma (Göyçay)', quantity: 50, stock: 1200, buyingPrice: 0.80, sellingPrice: 1.50, weight: 20.5 },
    { id: 102, name: 'Sultan Armudu', quantity: 30, stock: 800, buyingPrice: 1.20, sellingPrice: 2.20, weight: 15.0 },
    { id: 103, name: 'Ağ Gilas', quantity: 100, stock: 500, buyingPrice: 2.50, sellingPrice: 4.50, weight: 10.0 },
    { id: 104, name: 'Sarı Limon (Lənkəran)', quantity: 80, stock: 2000, buyingPrice: 0.90, sellingPrice: 1.80, weight: 12.0 },
    { id: 105, name: 'Şaftalı (Naxçıvan)', quantity: 40, stock: 650, buyingPrice: 1.50, sellingPrice: 3.20, weight: 18.5 },
    { id: 106, name: 'Yaşıl Üzüm (Xaçmaz)', quantity: 60, stock: 900, buyingPrice: 1.10, sellingPrice: 2.50, weight: 14.0 },
    { id: 107, name: 'Heyva (Ordubad)', quantity: 25, stock: 400, buyingPrice: 1.30, sellingPrice: 2.80, weight: 22.0 },
    { id: 108, name: 'Nar (Göyçay)', quantity: 70, stock: 1500, buyingPrice: 1.60, sellingPrice: 3.50, weight: 25.0 },
    { id: 109, name: 'Banan (İdxal)', quantity: 120, stock: 3000, buyingPrice: 1.80, sellingPrice: 2.60, weight: 18.0 },
    { id: 110, name: 'Xurma (Qəbələ)', quantity: 45, stock: 1100, buyingPrice: 1.40, sellingPrice: 2.90, weight: 16.5 },
    { id: 111, name: 'Çiyələk (İstixana)', quantity: 200, stock: 300, buyingPrice: 3.00, sellingPrice: 5.50, weight: 5.0 },
    { id: 112, name: 'Pomidor (Zirə)', quantity: 150, stock: 2500, buyingPrice: 0.70, sellingPrice: 2.20, weight: 10.0 },
    { id: 113, name: 'Xiyar (Şəmkir)', quantity: 180, stock: 2200, buyingPrice: 0.50, sellingPrice: 1.40, weight: 12.0 },
    { id: 114, name: 'Qoz (Qabıqlı)', quantity: 15, stock: 350, buyingPrice: 4.50, sellingPrice: 7.00, weight: 50.0 },
    { id: 115, name: 'Fındıq (Təmizlənmiş)', quantity: 10, stock: 200, buyingPrice: 8.50, sellingPrice: 13.00, weight: 20.0 },
    { id: 116, name: 'Kartof (Gədəbəy)', quantity: 300, stock: 5000, buyingPrice: 0.45, sellingPrice: 0.95, weight: 40.0 },
    { id: 117, name: 'Soğan (Yerli)', quantity: 250, stock: 4500, buyingPrice: 0.30, sellingPrice: 0.75, weight: 40.0 },
    { id: 118, name: 'Plastik Yeşik (Böyük)', quantity: 500, stock: 500, buyingPrice: 0.60, sellingPrice: 1.20, weight: 1.5 },
    { id: 119, name: 'Taxta Qutu (Kiçik)', quantity: 300, stock: 300, buyingPrice: 0.40, sellingPrice: 0.80, weight: 0.8 },
    { id: 120, name: 'Qablaşdırma Kağızı (Top)', quantity: 50, stock: 50, buyingPrice: 5.00, sellingPrice: 8.50, weight: 2.0 }
];
export const ProductService = {
    // 1. Bütün məhsulları gətirir (Axtarış filtri ilə birlikdə)
    getProducts: async (searchQuery = '') => {
        await delay(600);
        if (!searchQuery) return rawProducts;

        return rawProducts.filter(p =>
            p.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    },

    // 2. Tək bir məhsulun detallarını gətirir
    getProductById: async (id) => {
        await delay(300);
        return rawProducts.find(p => p.id === id);
    },

    // 3. Yeni məhsul əlavə edir (Add)
    createProduct: async (productData) => {
        await delay(500);
        const newProduct = {
            id: Math.floor(Math.random() * 1000) + 200,
            name: productData.name,
            quantity: parseInt(productData.quantity || 0),
            stock: parseInt(productData.stock || 0),
            buyingPrice: parseFloat(productData.buyingPrice || 0),
            sellingPrice: parseFloat(productData.sellingPrice || 0),
            weight: parseFloat(productData.weight || 0),
        };
        rawProducts.push(newProduct);
        return { success: true, data: newProduct };
    },

    // 4. Məhsulu redaktə edir (Update)
    updateProduct: async (id, updatedData) => {
        await delay(500);
        const index = rawProducts.findIndex(p => p.id === id);
        if (index !== -1) {
            rawProducts[index] = {
                ...rawProducts[index],
                ...updatedData,
                // Tip təhlükəsizliyi üçün parse əməliyyatları
                quantity: updatedData.quantity !== undefined ? parseInt(updatedData.quantity) : rawProducts[index].quantity,
                stock: updatedData.stock !== undefined ? parseInt(updatedData.stock) : rawProducts[index].stock,
                buyingPrice: updatedData.buyingPrice !== undefined ? parseFloat(updatedData.buyingPrice) : rawProducts[index].buyingPrice,
                sellingPrice: updatedData.sellingPrice !== undefined ? parseFloat(updatedData.sellingPrice) : rawProducts[index].sellingPrice,
                weight: updatedData.weight !== undefined ? parseFloat(updatedData.weight) : rawProducts[index].weight,
            };
            return { success: true, data: rawProducts[index] };
        }
        throw new Error("Məhsul tapılmadı");
    },

    // 5. Məhsulu silir (Delete)
    deleteProduct: async (id) => {
        await delay(400);
        rawProducts = rawProducts.filter(p => p.id !== id);
        return { success: true };
    },

    // 6. Stok vəziyyəti xülasəsi (ERP paneli üçün)
    getInventorySummary: async () => {
        await delay(400);
        const totalStockValue = rawProducts.reduce((sum, p) => sum + (p.stock * p.buyingPrice), 0);
        const potentialProfit = rawProducts.reduce((sum, p) => sum + (p.stock * (p.sellingPrice - p.buyingPrice)), 0);

        return {
            totalItems: rawProducts.length,
            totalStockValue,
            potentialProfit
        };
    }
};