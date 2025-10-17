let appointments = [];

document.addEventListener("DOMContentLoaded", () => {
  const btnAdd = document.getElementById("btnAdd");
  const modal = new bootstrap.Modal(document.getElementById("appointmentModal"));
  const form = document.getElementById("appointmentForm");

  // mở form khi bấm +
  btnAdd.addEventListener("click", () => {
    form.reset();
    document.getElementById("selectedServices").innerHTML = "";
    modal.show();
  });

  // submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      branch: document.getElementById("branch").value,
      staff: document.getElementById("staff").value,
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
    modal.hide();
  });
});

// hiển thị lịch hẹn ra card
function renderAppointments() {
  const container = document.getElementById("appointmentsList");
  container.innerHTML = "";
  appointments.forEach((ap, i) => {
    const card = document.createElement("div");
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

// thêm nhiều dịch vụ
document.addEventListener("DOMContentLoaded", () => {
  const btnAddService = document.getElementById("btnAddService");
  const svcInput = document.getElementById("serviceSearch");
  const list = document.getElementById("selectedServices");

  btnAddService.addEventListener("click", () => {
    if (!svcInput.value.trim()) return;
    let li = document.createElement("li");
    li.textContent = svcInput.value.trim();
    list.appendChild(li);
    svcInput.value = "";
  });
});
