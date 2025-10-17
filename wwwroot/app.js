let customers = [];
let services = [];
let staffList = [];
let appointments = []; // lưu tạm lịch hẹn đã tạo

// Load Staff theo chi nhánh
async function loadStaffs(branchId) {
  let resp = await fetch("staff.json");
  staffList = await resp.json();
  let cbo = document.getElementById("staff");
  cbo.innerHTML = '<option value="">-- Chọn nhân viên --</option>';
  staffList.filter(s => s.BranchId === branchId).forEach(staff => {
    let opt = document.createElement("option");
    opt.value = staff.Id;
    opt.textContent = staff.Name;
    cbo.appendChild(opt);
  });
}

// Load Customers
async function loadCustomers() {
  let resp = await fetch("customers.json");
  customers = await resp.json();

  let txtPhone = document.getElementById("phone");
  let txtName = document.getElementById("customer");

  // Autocomplete SĐT
  txtPhone.addEventListener("input", () => {
    let val = txtPhone.value.toLowerCase();
    let match = customers.find(x => x.Phone && x.Phone.replace(/\s+/g, '').includes(val));
    if (match) txtName.value = match.Name;
  });

  // Autocomplete tên KH
  txtName.addEventListener("input", () => {
    let val = txtName.value.toLowerCase();
    let match = customers.find(x => x.Name && x.Name.toLowerCase().includes(val));
    if (match) txtPhone.value = match.Phone;
  });
}

// Load Services
async function loadServices() {
  let resp = await fetch("services.json");
  services = await resp.json();

  let txtSearch = document.getElementById("serviceSearch");
  let suggestionBox = document.createElement("div");
  suggestionBox.className = "list-group position-absolute w-100";
  txtSearch.parentNode.appendChild(suggestionBox);

  txtSearch.addEventListener("input", () => {
    let val = txtSearch.value.toLowerCase();
    suggestionBox.innerHTML = "";
    if (!val) return;
    let filtered = services.filter(s => s.Name.toLowerCase().includes(val)).slice(0, 5);
    filtered.forEach(svc => {
      let item = document.createElement("button");
      item.type = "button";
      item.className = "list-group-item list-group-item-action";
      item.textContent = svc.Name + " (" + svc.Price.toLocaleString() + "đ)";
      item.onclick = () => {
        addService(svc);
        suggestionBox.innerHTML = "";
        txtSearch.value = "";
      };
      suggestionBox.appendChild(item);
    });
  });

  document.getElementById("btnAddService").addEventListener("click", () => {
    let val = txtSearch.value.trim().toLowerCase();
    let svc = services.find(s => s.Name.toLowerCase().includes(val));
    if (svc) {
      addService(svc);
      txtSearch.value = "";
    }
  });
}

// Thêm dịch vụ đã chọn vào list
function addService(svc) {
  let ul = document.getElementById("selectedServices");
  let li = document.createElement("li");
  li.textContent = svc.Name + " - " + svc.Price.toLocaleString() + "đ";
  ul.appendChild(li);
}

// Hiển thị lịch hẹn dạng card
function renderAppointments() {
  const container = document.getElementById("appointmentsList");
  container.innerHTML = "";
  appointments.forEach(ap => {
    let card = document.createElement("div");
    card.className = "col-12 col-md-6";
    card.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${ap.customer} (${ap.phone})</h5>
          <p class="card-text">
            <b>Chi nhánh:</b> ${ap.branch}<br>
            <b>Nhân viên:</b> ${ap.staff}<br>
            <b>Ngày:</b> ${ap.date} ${ap.start} - ${ap.end}<br>
            <b>Dịch vụ:</b><br>
            ${ap.services.map(s => "• " + s).join("<br>")}<br>
            <b>Thanh toán:</b> ${ap.paid ? "✅ Đã trả" : "❌ Chưa"}
          </p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Khi DOM load
document.addEventListener("DOMContentLoaded", () => {
  const cboBranch = document.getElementById("branch");
  cboBranch.addEventListener("change", () => {
    let branchId = parseInt(cboBranch.value);
    loadStaffs(branchId);
  });

  loadCustomers();
  loadServices();

  // xử lý submit form
  const form = document.getElementById("appointmentForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      branch: cboBranch.value,
      staff: document.getElementById("staff").selectedOptions[0]?.textContent || "",
      phone: document.getElementById("phone").value,
      customer: document.getElementById("customer").value,
      services: Array.from(document.querySelectorAll("#selectedServices li")).map(li => li.textContent),
      date: document.getElementById("date").value,
      start: document.getElementById("start").value,
      end: document.getElementById("end").value,
      paid: document.getElementById("paid").checked
    };

    appointments.push(data);
    renderAppointments();
    form.reset();
    document.getElementById("selectedServices").innerHTML = "";
  });
});
