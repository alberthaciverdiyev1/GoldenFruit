# GoldenFruit ERP - Proje Yapısı

## Genel Bakış
Meyve-sebze toptancıları için ERP (Kurumsal Kaynak Planlama) uygulaması.  
**Mimari:** Electron masaüstü kabuğu + Astro önyüz (SSR) + .NET Web API + SQLite

```
GoldenFruit.Frontend/
├── main.js                    # Electron ana süreç (backend + frontend başlatır)
├── package.json               # Electron için kök paket tanımı
├── back/                      # .NET 10 Backend API
│   ├── Program.cs             # API giriş noktası (port 5005, CORS, Swagger, DI)
│   ├── GoldenFruit.Backend.csproj
│   ├── appsettings.json
│   ├── Controllers/           # REST API endpoint'leri
│   │   ├── CustomerController.cs   # /api/customer
│   │   ├── ProductController.cs    # /api/product
│   │   ├── EmployeeController.cs   # /api/employee
│   │   ├── SalaryController.cs     # /api/salary
│   │   ├── SaleController.cs       # /api/sale
│   │   ├── PurchaseController.cs   # /api/purchase
│   │   ├── BagController.cs        # /api/bag (kaset takibi)
│   │   ├── ExpenseController.cs    # /api/expense (anbar xercleri)
│   │   ├── AdvanceController.cs    # /api/advance (tedarikci avanslari)
│   │   ├── DriverController.cs     # /api/driver (sofer maaslari)
│   │   ├── ExportController.cs     # /api/export (xarice ixrac)
│   │   └── StockBalanceController.cs  # /api/stockbalance
│   ├── Models/                # SQLite veritabanı modelleri
│   │   ├── Customer.cs        # Müşteri
│   │   ├── Product.cs         # Ürün (meyve/sebze)
│   │   ├── Employee.cs        # İşçi
│   │   ├── Sale.cs            # Satış başlık
│   │   ├── SaleItem.cs        # Satış kalemleri
│   │   ├── Purchase.cs        # Alış başlık
│   │   ├── PurchaseItem.cs    # Alış kalemleri
│   │   ├── Bag.cs             # Kaset/kova takibi
│   │   ├── Balance.cs         # Cari bakiye hareketleri
│   │   ├── Salary.cs          # Maaş ödemeleri
│   │   ├── WarehouseExpense.cs    # Anbar xercleri
│   │   ├── SupplierAdvance.cs     # Tedarikçi avansları
│   │   ├── DriverSalary.cs        # Şoför maaşları
│   │   ├── Export.cs              # Xaricə ixrac
│   │   └── StockBalance.cs        # Stok qalıqları
│   ├── DTOs/                  # Veri transfer objeleri
│   │   ├── EmployeeDTO.cs     # Employee + Salary DTO'ları
│   │   ├── SaleDTO.cs         # Sale + SaleItem DTO'ları
│   │   ├── PurchaseDTO.cs     # Purchase + PurchaseItem DTO'ları
│   │   └── BalanceDTO.cs      # BalanceHistoryDTO
│   └── Database/
│       └── AppDbContext.cs    # SQLite bağlantı yönetimi (Desktop'a kaydeder)
└── front/                     # Astro önyüz
    ├── astro.config.mjs       # Astro yapılandırması (SSR, Tailwind, Node adapter)
    ├── package.json
    ├── tailwind.config.mjs
    ├── tsconfig.json
    ├── public/
    │   └── services/          # Frontend JS (Astro sayfalarına inline include edilir)
    │       ├── customer.js    # Müşteri CRUD + detay
    │       ├── product.js     # Ürün CRUD + detay
    │       ├── employee.js    # İşçi CRUD + Maaş yönetimi
    │       ├── sale.js        # Satış + sepet yönetimi
    │       ├── purchase.js    # Alış + sepet yönetimi
    │       ├── bags.js        # Kaset takibi + detay
    │       ├── expense.js     # Anbar xercleri
    │       ├── advance.js     # Tedarikçi avansları
    │       ├── driver.js      # Şoför maaşları
    │       ├── export.js      # Xaricə ixrac
    │       └── stockbalance.js # Stok qalıqları
    └── src/
        ├── layouts/
        │   └── MainLayout.astro  # Ana layout (sidebar + header)
        ├── components/
        │   └── Sidebar.astro     # Navigasyon sidebar (Lucide ikonları)
        └── pages/                 # Astro route'ları
            ├── index.astro              # / (Dashboard)
            ├── customers.astro          # /customers
            ├── customers/[id].astro     # /customers/:id (detay)
            ├── products.astro           # /products
            ├── products/[id].astro      # /products/:id (detay)
            ├── sales.astro              # /sales
            ├── purchases.astro          # /purchases
            ├── bags.astro               # /bags (kaset)
            ├── bags/[id].astro          # /bags/:id (detay)
            ├── expenses.astro           # /expenses (anbar xercleri)
            ├── advances.astro           # /advances (avans)
            ├── drivers.astro            # /drivers (soferler)
            ├── exports.astro            # /exports (ixrac)
            ├── stockbalances.astro      # /stockbalances (stok)
            └── employees/
                ├── index.astro          # /employees (liste)
                └── [id].astro           # /employees/:id (detay + maaş)
```

## Çalışma Akışı

1. **Kök dizinde `npm start`** (`electron .`) ile Electron başlatılır
2. `main.js` çalışır, **`dotnet run --project back/`** ile backend'i başlatır (port 5005)
3. `main.js` **`npm run dev -- --port 4321`** ile Astro frontend'i başlatır (`front/` dizininden)
4. `main.js` **her iki sunucuyu da (5005 + 4321) paralel şekilde yoklar**, ikisi de hazır olunca BrowserWindow açar
5. Electron BrowserWindow, `http://localhost:4321` adresini yükler
6. Frontend JS, `http://localhost:5005/api/*` adresine fetch istekleri yapar
7. Pencere kapanınca `taskkill /f /t` ile alt süreçler temizlenir

## Veritabanı İlişkileri

```
Customer ──┬── Sale (CustomerId)
           ├── Purchase (CustomerId)
           ├── Balance (CustomerId)
           └── SupplierAdvance (CustomerId)

Product ──┬── SaleItem (ProductId)
          └── PurchaseItem (ProductId)

Sale ─── SaleItem (SaleId)

Purchase ─── PurchaseItem (PurchaseId)

Employee ─── Salary (EmployeeId)

Balance ─── SaleId, PurchaseId (polymorphic)
```

## Frontend JS Mimarisi
- Astro sayfaları `<script is:inline src="/services/xxx.js">` ile JS dosyalarını yükler
- Her JS dosyası kendi DOM elementlerini yönetir, `window.*` fonksiyonları ile global event handler'lar tanımlar
- Sepet (basket) mantığı: `sale.js` ve `purchase.js`'de client-side array olarak tutulur

## Deployment
- **Backend:** .NET 10, `Program.cs:5005` portu, AppDbContext DI singleton
- **Frontend:** Astro SSR, Node adapter (standalone mode)
- **Desktop:** Electron ile paketlenir
- **Veritabanı:** `C:\Users\<kullanici>\Desktop\GoldenFruit.db3` konumunda oluşur
