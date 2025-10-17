let customers = [];
let services = [];

// Load Staff theo chi nhánh
async function loadStaffs(branchId) {
  let resp = await fetch("/staff.json");
  let data = await resp.json();
  let cbo = document.getElementById("staff");
  cbo.innerHTML = '<option value="">-- Chọn nhân viên --</option>';
  data.filter(s => parseInt(s.BranchId) === branchId).forEach(staff => {
    let opt = document.createElement("option");
    opt.value = staff.Id;
    opt.textContent = staff.Name;
    cbo.appendChild(opt);
  });
}

// Load Customers (autocomplete)
async function loadCustomers() {
  let resp = await fetch("/customers.json");
  customers = await resp.json();

  let txtPhone = document.getElementById("phone");
  let txtName = document.getElementById("customer");

  // Autocomplete cho SĐT
  txtPhone.addEventListener("input", () => {
    let val = txtPhone.value.trim();
    let list = customers.filter(x => x.Phone.startsWith(val));
    showSuggestions(txtPhone, list.map(x => x.Phone));
  });

  // Autocomplete cho Tên
  txtName.addEventListener("input", () => {
    let val = txtName.value.trim().toLowerCase();
    let list = customers.filter(x => x.Name.toLowerCase().includes(val));
    showSuggestions(txtName, list.map(x => x.Name));
  });

  // Mapping khi blur
  txtPhone.addEventListener("change", () => {
    let c = customers.find(x => x.Phone === txtPhone.value.trim());
    if (c) txtName.value = c.Name;
  });
  txtName.addEventListener("change", () => {
    let c = customers.find(x => x.Name === txtName.value.trim());
    if (c) txtPhone.value = c.Phone;
  });
}

// Load Services (autocomplete + chọn nhiều)
async function loadServices() {
  let resp = await fetch("/services.json");
  services = await resp.json();

  let txtSvc = document.getElementById("serviceSearch");
  let listContainer = document.getElementById("selectedServices");

  // Autocomplete khi gõ dịch vụ
  txtSvc.addEventListener("input", () => {
    let val = txtSvc.value.trim().toLowerCase();
    let list = services.filter(s => s.Name.toLowerCase().includes(val));
    showSuggestions(txtSvc, list.map(s => s.Name));
  });

  // Nút +
  document.getElementById("btnAddService").addEventListener("click", () => {
    let svcName = txtSvc.value.trim();
    let svc = services.find(s => s.Name === svcName);
    if (!svc) {
      alert("Chọn dịch vụ hợp lệ!");
      return;
    }
    let li = document.createElement("li");
    li.textContent = svc.Name + " (" + svc.Price + "₫)";
    li.dataset.id = svc.Id;
    listContainer.appendChild(li);
    txtSvc.value = "";
  });
}

// Gợi ý autocomplete
function showSuggestions(input, suggestions) {
  closeSuggestions();
  if (!suggestions.length) return;
  let list = document.createElement("ul");
  list.className = "suggestions";
  list.style.position = "absolute";
  list.style.background = "#fff";
  list.style.border = "1px solid #ccc";
  list.style.width = input.offsetWidth + "px";
  list.style.zIndex = 1000;

  suggestions.slice(0, 5).forEach(s => {
    let item = document.createElement("li");
    item.textContent = s;
    item.style.padding = "4px";
    item.addEventListener("click", () => {
      input.value = s;
      closeSuggestions();
      input.dispatchEvent(new Event("change"));
    });
    list.appendChild(item);
  });

  input.parentNode.appendChild(list);
}

function closeSuggestions() {
  document.querySelectorAll(".suggestions").forEach(el => el.remove());
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
  document.addEventListener("click", closeSuggestions);
});
