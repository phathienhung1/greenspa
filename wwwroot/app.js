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

// Load Services (autocomplete + thêm nhiều + số lượng)
async function loadServices() {
  let resp = await fetch("services.json");
  services = await resp.json();

  let txtSvc = document.getElementById("serviceSearch");
  let listContainer = document.getElementById("selectedServices");

  txtSvc.addEventListener("input", () => {
    let val = txtSvc.value.trim().toLowerCase();
    let list = services.filter(s => s.Name.toLowerCase().includes(val));
    showSuggestions(txtSvc, list.map(s => s.Name)); // ✅ hiển thị tất cả
  });

  document.getElementById("btnAddService").addEventListener("click", () => {
    let svcName = txtSvc.value.trim();
    let svc = services.find(s => s.Name === svcName);
    if (!svc) {
      alert("Chọn dịch vụ hợp lệ!");
      return;
    }

    addServiceToList(svc, listContainer);
    txtSvc.value = "";
  });
}

// thêm dịch vụ vào danh sách với input số lượng
function addServiceToList(svc, listContainer) {
  let li = document.createElement("li");
  li.dataset.id = svc.Id;
  li.dataset.name = svc.Name;
  li.dataset.price = svc.Price;
  li.className = "d-flex align-items-center mb-1";

  let span = document.createElement("span");
  span.textContent = `${svc.Name} (${svc.Price.toLocaleString()}₫)`;
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
}

// Hiển thị lịch hẹn dạng card
function renderAppointments() {
  const container = document.getElementById("appointmentsList");
  container.innerHTML = "";
  appointments.forEach(ap => {
    let servicesHtml = ap.services.map(s => `• ${s.name} (x${s.qty})`).join("<br>");
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
            ${servicesHtml}<br>
            <b>Thanh toán:</b> ${ap.paid ? "✅ Đã trả" : "❌ Chưa"}
          </p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Submit form
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const servicesData = Array.from(document.querySelectorAll("#selectedServices li")).map(li => {
    let qtyInput = li.querySelector("input");
    return {
      id: li.dataset.id,
      name: li.dataset.name,
      price: li.dataset.price,
      qty: qtyInput ? parseInt(qtyInput.value) : 1
    };
  });

  const data = {
    branch: cboBranch.value,
    staff: document.getElementById("staff").selectedOptions[0]?.textContent || "",
    phone: document.getElementById("phone").value,
    customer: document.getElementById("customer").value,
    services: servicesData,
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
