// 🔥 giả lập dữ liệu nhân viên theo chi nhánh
const staffByBranch = {
  1: ["Hùng", "Lan", "Mai"],
  2: ["Hòa", "Trang"],
  3: ["Tú", "Vy", "Minh"]
};

// 🔥 mapping KH <-> SĐT
const customerLookup = {
  "0123": "Phathienhung",
  "0987": "Nguyen Van A",
  "0111": "Nguyen Van B"
};

// load NV khi chọn chi nhánh
document.getElementById("branch").addEventListener("change", e => {
  const branchId = e.target.value;
  const staffSelect = document.getElementById("staff");
  staffSelect.innerHTML = '<option value="">-- Chọn nhân viên --</option>';

  if (staffByBranch[branchId]) {
    staffByBranch[branchId].forEach(name => {
      let opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      staffSelect.appendChild(opt);
    });
  }
});

// mapping KH <-> SĐT
document.getElementById("phone").addEventListener("blur", e => {
  let phone = e.target.value.trim();
  if (customerLookup[phone]) {
    document.getElementById("customer").value = customerLookup[phone];
  }
});

// load services từ API (fake)
async function loadServices() {
  try {
    let resp = await fetch("https://greenspa3.onrender.com/api/services");
    if (!resp.ok) throw new Error("API lỗi");
    let data = await resp.json();

    const serviceSelect = document.getElementById("service");
    serviceSelect.innerHTML = '<option value="">-- Chọn dịch vụ --</option>';
    data.forEach(svc => {
      let opt = document.createElement("option");
      opt.value = svc.id;
      opt.textContent = svc.name;
      serviceSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Không load được services:", err);
  }
}
loadServices();

// submit form
document.getElementById("appointmentForm").addEventListener("submit", async e => {
  e.preventDefault();

  const data = {
    branchId: parseInt(document.getElementById("branch").value),
    staff: document.getElementById("staff").value,
    date: document.getElementById("date").value,
    start: document.getElementById("start").value,
    end: document.getElementById("end").value,
    customer: document.getElementById("customer").value,
    phone: document.getElementById("phone").value,
    serviceId: document.getElementById("service").value,
    paid: document.getElementById("paid").checked
  };

  try {
    let resp = await fetch("https://greenspa3.onrender.com/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (resp.ok) {
      document.getElementById("msg").innerHTML =
        '<div class="alert alert-success">✅ Đã tạo lịch hẹn thành công!</div>';
      e.target.reset();
    } else {
      document.getElementById("msg").innerHTML =
        '<div class="alert alert-danger">❌ Lỗi khi tạo lịch!</div>';
    }
  } catch (err) {
    document.getElementById("msg").innerHTML =
      '<div class="alert alert-danger">❌ Không kết nối được server!</div>';
  }
});
