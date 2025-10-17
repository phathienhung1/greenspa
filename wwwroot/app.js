let appointments = [];

async function loadAppointments() {
  let resp = await fetch("appointments.json");
  appointments = await resp.json();
  renderList();
  renderCalendar();
}

// ========== Danh sách ==========
function renderList() {
  const ul = document.getElementById("appointment-list");
  ul.innerHTML = "";
  appointments.forEach(ap => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${ap.CustomerName}</b> (${ap.Phone})<br>
      ${ap.Start} - ${ap.End}<br>
      ${ap.Services.join(", ")}<br>
      <span style="color:${ap.Paid ? 'green':'red'}">
        ${ap.Paid ? "Đã thanh toán":"Chưa thanh toán"}
      </span>
    `;
    ul.appendChild(li);
  });
}

// ========== Calendar ==========
let calendar;
function renderCalendar() {
  const el = document.getElementById("calendar");
  if (calendar) calendar.destroy();

  calendar = new FullCalendar.Calendar(el, {
    initialView: "timeGridDay",
    locale: "vi",
    allDaySlot: false,
    slotMinTime: "07:00:00",
    slotMaxTime: "23:00:00",
    events: appointments.map(ap => ({
      title: ap.CustomerName + " - " + ap.Services.join(", "),
      start: ap.Start,
      end: ap.End,
      color: ap.Paid ? "green" : "red"
    }))
  });
  calendar.render();
}

// ========== Tabs ==========
document.addEventListener("DOMContentLoaded", () => {
  loadAppointments();

  document.getElementById("tab-list").addEventListener("click", () => {
    document.getElementById("list-view").classList.add("active");
    document.getElementById("calendar-view").classList.remove("active");
  });

  document.getElementById("tab-calendar").addEventListener("click", () => {
    document.getElementById("calendar-view").classList.add("active");
    document.getElementById("list-view").classList.remove("active");
    renderCalendar();
  });
});
