class CalendarManager {
    constructor() {
        this.currentDate = this.getMonday(new Date());
        this.timeSlots = this.generateTimeSlots();
        this.currentFilter = '';
        this.selectedSlot = null;
    }

    getMonday(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    generateTimeSlots() {
        const slots = [];
        for (let hour = 8; hour < 18; hour++) {
            slots.push(`${String(hour).padStart(2, '0')}:00`);
        }
        return slots;
    }

    getWeekDates() {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(this.currentDate);
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    }

    getWeekDateStrings() {
        return this.getWeekDates().map(d => d.toISOString().split('T')[0]);
    }

    getWeekDisplayText() {
        const dates = this.getWeekDates();
        const startDate = dates[0];
        const endDate = dates[6];
        const format = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `${format(startDate)} - ${format(endDate)}, ${startDate.getFullYear()}`;
    }

    nextWeek() {
        this.currentDate.setDate(this.currentDate.getDate() + 7);
    }

    prevWeek() {
        this.currentDate.setDate(this.currentDate.getDate() - 7);
    }

    setFilter(liftId) {
        this.currentFilter = liftId;
    }

    getVisibleLifts() {
        if (this.currentFilter) {
            return dataManager.getLifts().filter(l => l.id === this.currentFilter);
        }
        return dataManager.getLifts();
    }

    getSlotStatus(liftId, date, time) {
        const assignments = dataManager.getAssignmentsForSlot(liftId, date, time);
        if (assignments.length === 0) {
            return 'free';
        }
        // Return the status of the first assignment (since we should have max 1)
        return assignments[0].status;
    }

    getSlotContent(liftId, date, time) {
        const assignments = dataManager.getAssignmentsForSlot(liftId, date, time);
        return assignments;
    }

    generateCalendarHTML() {
        const lifts = this.getVisibleLifts();
        const weekDates = this.getWeekDateStrings();
        let html = '';

        for (const lift of lifts) {
            html += `<tr>`;
            html += `<td class="lift-cell" data-lift-id="${lift.id}">${lift.name}</td>`;

            for (const date of weekDates) {
                html += `<td class="time-slot-container">`;
                html += `<div class="time-slot-group">`;

                for (const time of this.timeSlots) {
                    const status = this.getSlotStatus(lift.id, date, time);
                    const assignments = this.getSlotContent(lift.id, date, time);
                    
                    let slotContent = '';
                    if (assignments.length > 0) {
                        for (const assignment of assignments) {
                            const orderName = dataManager.getOrderName(assignment.orderId);
                            slotContent += `<div class="order-badge ${assignment.status}" data-assignment-id="${assignment.id}" data-order-id="${assignment.orderId}">${orderName}</div>`;
                        }
                    } else {
                        slotContent = `<span class="time-label">${time}</span>`;
                    }

                    html += `<div class="time-slot ${status}" data-lift-id="${lift.id}" data-date="${date}" data-time="${time}" role="button" tabindex="0" aria-label="Time slot ${time} on ${date}">${slotContent}</div>`;
                }

                html += `</div></td>`;
            }

            html += `</tr>`;
        }

        return html;
    }

    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }
}

const calendarManager = new CalendarManager();
