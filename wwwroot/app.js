// Load Staff theo chi nhánh
async function loadStaffs(branchId) {
  let resp = await fetch("/staff.json");
  let data = await resp.json();
  let cbo = document.getElementById("staff");
  cbo.innerHTML = '<option value="">-- Chọn nhân viên --</option>';
  data.filter(s => s.branchId === branchId).forEach(staff => {
    let opt = document.createElement("option");
    opt.value = staff.id;
    opt.textContent = staff.name;
    cbo.appendChild(opt);
  });
}

// Load Customers (map SĐT ↔ Tên)
let customers = [];
async function loadCustomers() {
  let resp = await fetch("/customers.json");
  customers = await resp.json();
  let txtPhone = document.getElementById("phone");
  let txtName = document.getElementById("customer");

  txtPhone.addEventListener("change", () => {
    let c = customers.find(x => x.phone === txtPhone.value);
    if (c) txtName.value = c.name;
  });

  txtName.addEventListener("change", () => {
    let c = customers.find(x => x.name === txtName.value);
    if (c) txtPhone.value = c.phone;
  });
}

// Load Services
async function loadServices() {
  let resp = await fetch("/services.json");
  let data = await resp.json();
  let cbo = document.getElementById("service");
  cbo.innerHTML = '<option value="">-- Chọn dịch vụ --</option>';
  data.forEach(svc => {
    let opt = document.createElement("option");
    opt.value = svc.id;
    opt.textContent = svc.name;
    cbo.appendChild(opt);
  });
}

// Khi chọn chi nhánh thì reload staff
document.addEventListener("DOMContentLoaded", () => {
  const cboBranch = document.getElementById("branch");
  cboBranch.addEventListener("change", () => {
    let branchId = parseInt(cboBranch.value);
    loadStaffs(branchId);
  });

  loadCustomers();
  loadServices();
});
