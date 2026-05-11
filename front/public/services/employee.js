const API_BASE = 'http://localhost:5005/api/employee';
const SALARY_API = 'http://localhost:5005/api/salary';

const pathParts = window.location.pathname.split('/').filter(p => p !== "");
const EMPLOYEE_ID = pathParts[pathParts.length - 1];

let currentMonthlySalary = 0;
let allSalaries = [];

/**
 * 1. İŞÇİ SİYAHISI (LİST)
 */
async function fetchEmployees() {
    const container = document.querySelector('#employee-container');
    if (!container) return;

    try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error();
        const data = await res.json();
        renderTable(data);
    } catch (e) {
        container.innerHTML = `<div class="p-8 text-red-500 text-center font-bold">Backend Bağlantısı Başarısız!</div>`;
    }
}

function renderTable(employees) {
    const container = document.querySelector('#employee-container');

    const list = Array.isArray(employees) ? employees : (employees.employees || []);
    if (list.length === 0) {
        container.innerHTML = `<div class="p-12 text-center text-slate-400">Qeydiyyatda olan işçi tapılmadı.</div>`;
        return;
    }
    container.innerHTML = `
        <table class="w-full text-left">
            <thead class="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b">
                <tr>
                    <th class="px-6 py-4">İşçi Adı</th>
                    <th class="px-6 py-4">Telefon</th>
                    <th class="px-6 py-4">Maaş</th>
                    <th class="px-6 py-4 text-right">Əməliyyatlar</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                ${list.map(e => {
        const fullName = e.fullName || `${e.name} ${e.surname}`;
        return `
                    <tr class="hover:bg-blue-50/30 transition-colors">
                        <td class="px-6 py-4">
                            <div class="font-bold text-slate-800">${e.name} ${e.surname}</div>
                        </td>
                        <td class="px-6 py-4 text-slate-600">${e.phone || '-'}</td>
                        <td class="px-6 py-4 font-semibold text-emerald-600">${e.monthlySalary} AZN</td>
                        <td class="px-6 py-4 text-right space-x-2">
                            <button onclick="viewEmployeeDetails(${e.id})" class="px-3 py-1.5 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-xs font-bold shadow-sm">Detallar</button>
                            <button onclick="editEmployee(${e.id}, '${e.name}', '${e.surname}', '${e.phone || ''}', ${e.monthlySalary})" class="px-3 py-1.5 text-amber-600 border border-amber-100 rounded-lg hover:bg-amber-600 hover:text-white transition-all text-xs font-bold shadow-sm">Düzənlə</button>
                            <button onclick="deleteEmployee(${e.id})" class="px-3 py-1.5 text-red-600 border border-red-100 rounded-lg hover:bg-red-600 hover:text-white transition-all text-xs font-bold shadow-sm">Sil</button>
                        </td>
                    </tr>`;
    }).join('')}
            </tbody>
        </table>`;
}

async function fetchDetails() {
    const container = document.getElementById('salary-history-container');
    if (!container) return;

    try {
        const res = await fetch(`${API_BASE}/${EMPLOYEE_ID}`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        currentMonthlySalary = data.monthlySalary || 0;
        allSalaries = data.salaries || [];

        renderEmployeeInfo(data);
        renderSalaryTable(allSalaries);

        const dateInput = document.getElementById('sal-date');
        if (dateInput) dateInput.valueAsDate = new Date();

    } catch (e) {
        if (container) {
            container.innerHTML = `<div class="p-20 text-center text-red-500 font-bold">Məlumat yüklənərkən xəta baş verdi.</div>`;
        }
    }
}

function renderEmployeeInfo(data) {
    document.getElementById('det-fullname').innerText = `${data.name} ${data.surname}`;
    document.getElementById('det-phone').innerText = data.phone || '-';
    document.getElementById('det-salary').innerText = `${currentMonthlySalary} AZN`;
    document.getElementById('det-createdat').innerText = new Date(data.createdAt).toLocaleDateString('az-AZ');
}

function renderSalaryTable(salaries) {
    const container = document.getElementById('salary-history-container');
    let total = 0;

    if (!salaries || salaries.length === 0) {
        container.innerHTML = `<div class="p-12 text-center text-slate-400">Ödəniş tarixçəsi tapılmadı.</div>`;
        updateTotalPaid(0);
        return;
    }

    const html = `
        <table class="w-full text-left">
            <thead class="bg-slate-50 text-slate-500 text-[10px] font-black uppercase border-b">
                <tr><th class="px-6 py-4">Tarix</th><th class="px-6 py-4">Məbləğ</th><th class="px-6 py-4">Açıqlama</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                ${salaries.map(s => {
        total += s.amount;
        return `
                    <tr class="hover:bg-slate-50/50 transition-colors">
                        <td class="px-6 py-4 text-slate-600 text-sm font-medium">${new Date(s.createdAt).toLocaleDateString('az-AZ')}</td>
                        <td class="px-6 py-4 font-bold text-blue-600">${s.amount} AZN</td>
                        <td class="px-6 py-4 text-slate-500 text-sm italic">${s.comment || '-'}</td>
                    </tr>`;
    }).join('')}
            </tbody>
        </table>`;

    container.innerHTML = html;
    updateTotalPaid(total);
}


window.viewEmployeeDetails = (id) => { window.location.href = `/employees/${id}`; };

window.deleteEmployee = async (id) => {
    if (!confirm("Bu işçini və maaş tarixçəsini silmək istədiyinizə əminsiniz?")) return;
    try {
        const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        if (res.ok) fetchEmployees();
    } catch (error) { alert("Silinmə zamanı xəta baş verdi."); }
};

window.openEmployeeModal = () => {
    document.getElementById('employee-form').reset();
    document.getElementById('emp-id').value = "";
    document.getElementById('modal-title').innerText = "Yeni İşçi Əlavə Et";
    document.getElementById('employee-modal').classList.remove('hidden');
};

window.closeEmployeeModal = () => document.getElementById('employee-modal').classList.add('hidden');

window.editEmployee = (id, name, surname, phone, salary) => {
    document.getElementById('emp-id').value = id;
    document.getElementById('emp-name').value = name;
    document.getElementById('emp-surname').value = surname;
    document.getElementById('emp-phone').value = phone;
    document.getElementById('emp-salary').value = salary;
    document.getElementById('modal-title').innerText = "İşçi Məlumatlarını Yenilə";
    document.getElementById('employee-modal').classList.remove('hidden');
};

window.applyFilters = () => {
    const start = document.getElementById('filter-start').value;
    const end = document.getElementById('filter-end').value;
    const filtered = allSalaries.filter(s => {
        const d = s.createdAt.split('T')[0];
        return (!start || d >= start) && (!end || d <= end);
    });
    renderSalaryTable(filtered);
};

window.setFastAmount = (percent) => {
    const amountInput = document.getElementById('sal-amount');
    const commentInput = document.getElementById('sal-comment');
    if (amountInput) {
        amountInput.value = (currentMonthlySalary * percent).toFixed(2);
        amountInput.focus();
    }
    if (commentInput) {
        commentInput.value = percent === 1 ? "Aylıq tam maaş" : "Maaş avansı (50%)";
    }
};

function updateTotalPaid(total) {
    const el = document.getElementById('total-paid');
    if (el) el.innerText = `Cəmi Ödəniş: ${total.toFixed(2)} AZN`;
}

/**
 * 4. INITIALIZATION (DOM LOADED)
 */
document.addEventListener('DOMContentLoaded', () => {
    const empForm = document.getElementById('employee-form');
    if (empForm) {
        empForm.onsubmit = async (e) => {
            e.preventDefault();
            const id = document.getElementById('emp-id').value;
            const payload = {
                name: document.getElementById('emp-name').value,
                surname: document.getElementById('emp-surname').value,
                phone: document.getElementById('emp-phone').value,
                monthlySalary: parseFloat(document.getElementById('emp-salary').value)
            };
            try {
                const res = await fetch(id ? `${API_BASE}/${id}` : API_BASE, {
                    method: id ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) { window.closeEmployeeModal(); fetchEmployees(); }
            } catch (err) { alert("Xəta baş verdi."); }
        };
    }

    const salForm = document.getElementById('salary-form');
    if (salForm) {
        salForm.onsubmit = async (e) => {
            e.preventDefault();
            const payload = {
                employeeId: parseInt(EMPLOYEE_ID),
                amount: parseFloat(document.getElementById('sal-amount').value),
                comment: document.getElementById('sal-comment')?.value || "",
                createdAt: document.getElementById('sal-date').value
            };
            try {
                const res = await fetch(SALARY_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) { salForm.reset(); fetchDetails(); }
            } catch (err) { alert("Ödəniş qeyd edilmədi."); }
        };
    }

    fetchEmployees();
    if (document.getElementById('salary-history-container')) {
        fetchDetails();
    }
});