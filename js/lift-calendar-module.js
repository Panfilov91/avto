const LiftCalendarModule = {
  currentWeekStart: null,
  lifts: ['Lift 1', 'Lift 2', 'Lift 3', 'Lift 4'],

  init() {
    console.log('Initializing Lift Calendar Module...');
    this.currentWeekStart = this.getWeekStart(new Date());
    this.setupEventListeners();
    this.render();
  },

  setupEventListeners() {
    const prevWeekBtn = document.getElementById('prev-week');
    if (prevWeekBtn) {
      prevWeekBtn.addEventListener('click', () => this.previousWeek());
    }

    const nextWeekBtn = document.getElementById('next-week');
    if (nextWeekBtn) {
      nextWeekBtn.addEventListener('click', () => this.nextWeek());
    }
  },

  getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  previousWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.render();
  },

  nextWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.render();
  },

  render() {
    this.renderWeekDisplay();
    this.renderCalendar();
  },

  renderWeekDisplay() {
    const weekDisplay = document.getElementById('week-display');
    if (!weekDisplay) return;

    const weekEnd = new Date(this.currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const startStr = this.currentWeekStart.toLocaleDateString('en-US', options);
    const endStr = weekEnd.toLocaleDateString('en-US', options);

    weekDisplay.textContent = `${startStr} - ${endStr}`;
  },

  renderCalendar() {
    const tbody = document.getElementById('calendar-body');
    if (!tbody) return;

    const orders = StorageManager.getAllOrders();
    const weekDates = this.getWeekDates();

    tbody.innerHTML = this.lifts.map(lift => {
      return `
        <tr>
          <td class="lift-cell"><strong>${lift}</strong></td>
          ${weekDates.map((date, dayIndex) => {
            const dateStr = this.formatDateForComparison(date);
            const dayOrders = orders.filter(o => 
              o.liftReference === lift && 
              o.scheduledDate && 
              o.scheduledDate.startsWith(dateStr)
            );

            return `
              <td class="calendar-cell ${dayOrders.length > 0 ? 'has-orders' : ''}">
                ${dayOrders.map(order => {
                  const client = StorageManager.getClientById(order.clientId);
                  const clientName = client ? client.name : 'Unknown';
                  return `<div class="order-marker status-${order.status}" title="${clientName}">${order.orderNumber || '•'}</div>`;
                }).join('')}
              </td>
            `;
          }).join('')}
        </tr>
      `;
    }).join('');
  },

  getWeekDates() {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentWeekStart);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  },

  formatDateForComparison(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
};

if (typeof window !== 'undefined') {
  window.LiftCalendarModule = LiftCalendarModule;
}
