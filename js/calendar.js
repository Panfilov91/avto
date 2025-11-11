/**
 * Calendar Module
 * Manages the calendar view with vehicle scheduling
 */

const Calendar = {
  currentDate: new Date(),

  /**
   * Initialize calendar
   */
  init() {
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
      });
    }

    this.render();
  },

  /**
   * Render calendar
   */
  render() {
    this.updateMonthDisplay();
    this.generateDays();
  },

  /**
   * Update month/year display
   */
  updateMonthDisplay() {
    const monthDisplay = document.getElementById('calendar-month');
    if (!monthDisplay) return;

    const options = { month: 'long', year: 'numeric' };
    monthDisplay.textContent = this.currentDate.toLocaleDateString('en-US', options);
  },

  /**
   * Generate calendar days
   */
  generateDays() {
    const daysContainer = document.getElementById('calendar-days');
    if (!daysContainer) return;

    daysContainer.innerHTML = '';

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Add days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const dayEl = this.createDayElement(dayNum, 'other-month');
      daysContainer.appendChild(dayEl);
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEl = this.createDayElement(day, 'current-month');
      daysContainer.appendChild(dayEl);
    }

    // Add days from next month
    const totalCells = daysContainer.children.length;
    const remainingCells = 42 - totalCells; // 6 weeks * 7 days
    for (let day = 1; day <= remainingCells; day++) {
      const dayEl = this.createDayElement(day, 'other-month');
      daysContainer.appendChild(dayEl);
    }
  },

  /**
   * Create a day element
   * @param {number} dayNum
   * @param {string} className
   * @returns {HTMLElement}
   */
  createDayElement(dayNum, className) {
    const dayEl = document.createElement('div');
    dayEl.className = `calendar-day ${className}`;
    dayEl.tabIndex = 0;

    if (className === 'current-month') {
      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), dayNum);
      const vehicles = Storage.getVehiclesForDate(date);

      dayEl.innerHTML = `
        <div class="calendar-day-number">${dayNum}</div>
      `;

      if (vehicles.length > 0) {
        dayEl.classList.add('has-events');

        const eventsEl = document.createElement('div');
        eventsEl.className = 'calendar-day-events';

        vehicles.forEach(vehicle => {
          const statusColor = this.getStatusColor(vehicle.status);
          eventsEl.innerHTML += `
            <div class="event-dot" style="background-color: ${statusColor}" title="${vehicle.plate}"></div>
          `;
        });

        dayEl.appendChild(eventsEl);
      }

      dayEl.addEventListener('click', () => this.showDayDetails(dayNum, vehicles));
      dayEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          this.showDayDetails(dayNum, vehicles);
        }
      });
    }

    return dayEl;
  },

  /**
   * Get color for status
   * @param {string} status
   * @returns {string}
   */
  getStatusColor(status) {
    const colors = {
      'active': '#2e8555',
      'inactive': '#5a6c7d',
      'maintenance': '#c26200'
    };
    return colors[status] || '#0052cc';
  },

  /**
   * Show day details
   * @param {number} dayNum
   * @param {Array} vehicles
   */
  showDayDetails(dayNum, vehicles) {
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), dayNum);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    let message = `${dateStr}\n\n`;

    if (vehicles.length === 0) {
      message += 'No vehicles scheduled.';
    } else {
      message += `${vehicles.length} vehicle(s):\n`;
      vehicles.forEach(v => {
        message += `• ${v.plate} (${v.status})\n`;
      });
    }

    Notification.show(`${dateStr}: ${vehicles.length} vehicle(s)`, 'info');
  },

  /**
   * Reset to current month
   */
  resetToCurrentMonth() {
    this.currentDate = new Date();
    this.render();
  }
};
