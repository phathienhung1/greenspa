document.addEventListener('DOMContentLoaded', async function() {
  const calendarEl = document.getElementById('calendar');
  const staffFilter = document.getElementById('staffFilter');
  const statusFilter = document.getElementById('statusFilter');

  let staffs = [];
  let customers = [];
  let services = [];
  let appointments = [];

  async function loadData() {
    staffs = await (await fetch('staff.json')).json();
    customers = await (await fetch('customers.json')).json();
    services = await (await fetch('services.json')).json();
    appointments = await (await fetch('appointments.json')).json();
  }

  function getStaffName(id) {
    const s = staffs.find(x => x.Id == id);
    return s ? s.Name : '';
  }
  function getCustomerName(id) {
    const c = customers.find(x => x.Id == id);
    return c ? c.Name + ' (' + c.Phone + ')' : '';
  }
  function getServiceNames(ids) {
    return ids.map(i => {
      const svc = services.find(x => x.Id == i);
      return svc ? svc.Name : '';
    }).join(', ');
  }

  await loadData();

  // Fill staff filter
  staffs.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.Id;
    opt.textContent = s.Name;
    staffFilter.appendChild(opt);
  });

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridDay',
    slotMinTime: '07:00:00',
    slotMaxTime: '24:00:00',
    locale: 'vi',
    events: function(fetchInfo, successCallback) {
      let list = appointments.map(a => ({
        id: a.Id,
        title: getCustomerName(a.CustomerId),
        start: a.Start,
        end: a.End,
        extendedProps: {
          staff: getStaffName(a.StaffId),
          services: getServiceNames(a.ServiceIds),
          status: a.Status,
          paid: a.Paid
        }
      }));

      // filter by staff
      if (staffFilter.value) {
        list = list.filter(e => e.extendedProps.staff && staffs.find(s => s.Id == staffFilter.value).Name === e.extendedProps.staff);
      }
      // filter by status
      if (statusFilter.value) {
        list = list.filter(e => e.extendedProps.status === statusFilter.value);
      }
      successCallback(list);
    },
    eventClick: function(info) {
      const ev = info.event;
      const props = ev.extendedProps;
      const detail = `
        <b>Khách:</b> ${ev.title}<br/>
        <b>Dịch vụ:</b> ${props.services}<br/>
        <b>Nhân viên:</b> ${props.staff}<br/>
        <b>Trạng thái:</b> ${props.status}<br/>
        <b>Thanh toán:</b> ${props.paid ? 'Đã TT' : 'Chưa TT'}
      `;
      document.getElementById('eventDetails').innerHTML = detail;
      new bootstrap.Modal(document.getElementById('eventModal')).show();
    }
  });

  calendar.render();

  staffFilter.addEventListener('change', () => calendar.refetchEvents());
  statusFilter.addEventListener('change', () => calendar.refetchEvents());
});
