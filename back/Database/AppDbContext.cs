using System;
using System.IO;
using System.Threading.Tasks;
using GoldenFruit.Backend.Models;
using SQLite;

namespace GoldenFruit.Backend.Database;

public class AppDbContext
{
    private SQLiteAsyncConnection? _db;
    private const string DbFileName = "GoldenFruit.db3";

    // GoldenFruit.Backend/Database/AppDbContext.cs

    public async Task<SQLiteAsyncConnection> GetConnection()
    {
        if (_db is not null) return _db;

        string baseFolder = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);

        string dbPath = Path.Combine(baseFolder, DbFileName);

        Console.WriteLine($"\n[DB LOG] Veritabanı Buraya Oluşturuldu: {dbPath}");

        _db = new SQLiteAsyncConnection(dbPath);

        await _db.CreateTablesAsync<Customer, Employee, Product, Purchase, Sale>();
        await _db.CreateTablesAsync<SaleItem,Balance,Salary,Bag,PurchaseItem>();
        await _db.CreateTablesAsync<WarehouseExpense, SupplierAdvance, DriverSalary, Export, StockBalance>();

        return _db;
    }
}