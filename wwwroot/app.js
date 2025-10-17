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

  txtPhone.addEventListener("input", () => {
    let val = txtPhone.value.trim();
    let list = customers.filter(x => x.Phone.startsWith(val));
    showSuggestions(txtPhone, list.map(x => x.Phone));
  });

  txtName.addEventListener("input", () => {
    let val = txtName.value.trim().toLowerCase();
    let list = customers.filter(x => x.Name.toLowerCase().includes(val));
    showSuggestions(txtName, list.map(x => x.Name));
  });

  txtPhone.addEventListener("change", () => {
    let c = customers.find(x => x.Phone === txtPhone.value.trim());
    if (c) txtName.value = c.Name;
  });
  txtName.addEventListener("change", () => {
    let c = customers.find(x => x.Name === txtName.value.trim());
    if (c) txtPhone.value = c.Phone;
  });
}

// Load Services (autocomplete + thêm nhiều + số lượng)
async function loadServices() {
  let resp = await fetch("/services.json");
  services = await resp.json();

  let txtSvc = document.getElementById("serviceSearch");
  let listContainer = document.getElementById("selectedServices");

  txtSvc.addEventListener("input", () => {
    let val = txtSvc.value.trim().toLowerCase();
    let list = services.filter(s => s.Name.toLowerCase().includes(val));
    showSuggestions(txtSvc, list.map(s => s.Name)); // ❌ bỏ slice
  });

  document.getElementById("btnAddService").addEventListener("click", () => {
    let svcName = txtSvc.value.trim();
    let svc = services.find(s => s.Name === svcName);
    if (!svc) {
      alert("Chọn dịch vụ hợp lệ!");
      return;
    }

    // tạo item dịch vụ có input số lượng
    let li = document.createElement("li");
    li.dataset.id = svc.Id;
    li.className = "d-flex align-items-center mb-1";

    let span = document.createElement("span");
    span.textContent = svc.Name + " (" + svc.Price + "₫)";
    span.style.flex = "1";

    let qty = document.createElement("input");
    qty.type = "number";
    qty.value = 1;
    qty.min = 1;
    qty.className = "form-control form-control-sm";
    qty.style.width = "60px";
    qty.style.marginLeft = "8px";

    let remove = document.createElement("button");
    remove.textContent = "x";
    remove.className = "btn btn-sm btn-danger ms-2";
    remove.onclick = () => li.remove();

    li.appendChild(span);
    li.appendChild(qty);
    li.appendChild(remove);
    listContainer.appendChild(li);

    txtSvc.value = "";
  });
}

// Gợi ý autocomplete
function showSuggestions(input, suggestions) {
  closeSuggestions();
  if (!suggestions.length) return;
  let list = document.createElement("ul");
  list.className = "suggestions list-group position-absolute";
  list.style.zIndex = 1000;
  list.style.maxHeight = "200px";
  list.style.overflowY = "auto";
  list.style.width = input.offsetWidth + "px";

  suggestions.forEach(s => {
    let item = document.createElement("li");
    item.textContent = s;
    item.className = "list-group-item list-group-item-action";
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
