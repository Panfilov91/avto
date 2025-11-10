class CalendarApp {
    constructor() {
        this.assignmentModal = null;
        this.conflictAlert = null;
        this.orderDetailsTooltip = null;
        this.currentSlot = null;
        this.draggedAssignment = null;

        this.initializeElements();
        this.attachEventListeners();
        this.render();
    }

    initializeElements() {
        this.assignmentModal = document.getElementById('assignmentModal');
        this.conflictAlert = document.getElementById('conflictAlert');
        this.orderDetailsTooltip = document.getElementById('orderDetailsTooltip');
    }

    attachEventListeners() {
        // Navigation
        document.getElementById('prevWeek').addEventListener('click', () => this.handlePrevWeek());
        document.getElementById('nextWeek').addEventListener('click', () => this.handleNextWeek());

        // Filter
        document.getElementById('liftFilter').addEventListener('change', (e) => this.handleFilterChange(e));

        // Modal
        document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelAssignment').addEventListener('click', () => this.closeModal());
        document.getElementById('assignmentForm').addEventListener('submit', (e) => this.handleAssignment(e));

        // Alert
        document.querySelector('.alert-close').addEventListener('click', () => this.hideConflictAlert());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    render() {
        this.renderWeekDisplay();
        this.renderFilters();
        this.renderCalendar();
    }

    renderWeekDisplay() {
        document.getElementById('weekDisplay').textContent = calendarManager.getWeekDisplayText();
    }

    renderFilters() {
        const filterSelect = document.getElementById('liftFilter');
        const lifts = dataManager.getLifts();

        // Preserve current selection
        const currentValue = filterSelect.value;

        // Clear existing options except the first one
        filterSelect.innerHTML = '<option value="">All Lifts</option>';

        lifts.forEach(lift => {
            const option = document.createElement('option');
            option.value = lift.id;
            option.textContent = lift.name;
            filterSelect.appendChild(option);
        });

        filterSelect.value = currentValue;
    }

    renderCalendar() {
        const calendarBody = document.getElementById('calendarBody');
        calendarBody.innerHTML = calendarManager.generateCalendarHTML();

        // Attach event listeners to time slots
        this.attachTimeSlotListeners();
    }

    attachTimeSlotListeners() {
        const timeSlots = document.querySelectorAll('.time-slot');
        const orderBadges = document.querySelectorAll('.order-badge');

        timeSlots.forEach(slot => {
            slot.addEventListener('click', (e) => this.handleTimeSlotClick(e, slot));
            slot.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleTimeSlotClick(e, slot);
                }
            });
        });

        orderBadges.forEach(badge => {
            badge.addEventListener('mouseenter', (e) => this.showOrderTooltip(e));
            badge.addEventListener('mouseleave', () => this.hideOrderTooltip());
            badge.addEventListener('click', (e) => this.handleOrderBadgeClick(e));
            badge.addEventListener('contextmenu', (e) => this.handleOrderBadgeContextMenu(e));
            badge.draggable = true;
            badge.addEventListener('dragstart', (e) => this.handleDragStart(e));
            badge.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });

        timeSlots.forEach(slot => {
            slot.addEventListener('dragover', (e) => this.handleDragOver(e));
            slot.addEventListener('drop', (e) => this.handleDrop(e));
        });
    }

    handleTimeSlotClick(event, slot) {
        event.preventDefault();
        event.stopPropagation();

        // Don't open modal if clicking on an order badge
        if (event.target.classList.contains('order-badge')) {
            return;
        }

        const liftId = slot.dataset.liftId;
        const date = slot.dataset.date;
        const time = slot.dataset.time;

        this.currentSlot = { liftId, date, time };

        const unassignedOrders = dataManager.getUnassignedOrders();
        if (unassignedOrders.length === 0) {
            this.showConflictAlert('No unassigned orders available. All orders are already scheduled.');
            return;
        }

        this.openAssignmentModal(liftId, date, time);
    }

    openAssignmentModal(liftId, date, time) {
        const timeSlotInput = document.getElementById('timeSlotInput');
        const orderSelect = document.getElementById('orderSelect');

        const lift = dataManager.getLifts().find(l => l.id === liftId);
        const dateFormatted = calendarManager.formatDate(date);
        timeSlotInput.value = `${lift.name} - ${dateFormatted} at ${time}`;

        // Populate orders
        const unassignedOrders = dataManager.getUnassignedOrders();
        orderSelect.innerHTML = '<option value="">-- Select an order --</option>';
        unassignedOrders.forEach(order => {
            const option = document.createElement('option');
            option.value = order.id;
            option.textContent = `${order.name} - ${order.customer} (${order.weight}kg)`;
            orderSelect.appendChild(option);
        });

        this.assignmentModal.classList.remove('hidden');
    }

    closeModal() {
        this.assignmentModal.classList.add('hidden');
        this.currentSlot = null;
        document.getElementById('assignmentForm').reset();
    }

    handleAssignment(event) {
        event.preventDefault();

        const orderId = document.getElementById('orderSelect').value;
        const status = document.getElementById('statusSelect').value;

        if (!orderId) {
            this.showConflictAlert('Please select an order.');
            return;
        }

        if (!this.currentSlot) {
            this.showConflictAlert('Invalid time slot selected.');
            return;
        }

        const { liftId, date, time } = this.currentSlot;

        // Check for conflicts
        if (dataManager.checkConflict(liftId, date, time)) {
            this.showConflictAlert(`Time slot ${time} on ${calendarManager.formatDate(date)} is already occupied.`);
            return;
        }

        // Check if order is already assigned
        const existingAssignment = dataManager.getAssignments().find(a => a.orderId === orderId);
        if (existingAssignment) {
            // Update existing assignment
            dataManager.assignOrder(orderId, liftId, date, time, status);
        } else {
            // Create new assignment
            dataManager.assignOrder(orderId, liftId, date, time, status);
        }

        console.log(`Order ${dataManager.getOrderName(orderId)} assigned to ${dataManager.getLiftName(liftId)} on ${date} at ${time} with status ${status}`);

        this.closeModal();
        this.render();
    }

    handleFilterChange(event) {
        const liftId = event.target.value;
        calendarManager.setFilter(liftId);
        this.render();
    }

    handlePrevWeek() {
        calendarManager.prevWeek();
        this.render();
    }

    handleNextWeek() {
        calendarManager.nextWeek();
        this.render();
    }

    handleOrderBadgeClick(event) {
        event.stopPropagation();
        const assignmentId = event.currentTarget.dataset.assignmentId;
        const orderId = event.currentTarget.dataset.orderId;

        // Show context menu or allow editing
        const assignment = dataManager.getAssignments().find(a => a.id === assignmentId);
        if (assignment) {
            this.showOrderContextMenu(event, assignmentId, orderId, assignment);
        }
    }

    handleOrderBadgeContextMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        const assignmentId = event.currentTarget.dataset.assignmentId;
        const orderId = event.currentTarget.dataset.orderId;
        const assignment = dataManager.getAssignments().find(a => a.id === assignmentId);

        if (assignment) {
            this.showOrderContextMenu(event, assignmentId, orderId, assignment);
        }
    }

    showOrderContextMenu(event, assignmentId, orderId, assignment) {
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.cssText = `
            position: fixed;
            top: ${event.clientY}px;
            left: ${event.clientX}px;
            background: white;
            border: 1px solid var(--color-border);
            border-radius: 0.375rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1001;
            min-width: 150px;
        `;

        const statusOptions = ['reserved', 'in-progress', 'overdue'];
        let html = '';

        statusOptions.forEach(status => {
            const isCurrentStatus = assignment.status === status;
            html += `<button style="
                display: block;
                width: 100%;
                text-align: left;
                padding: 0.5rem 1rem;
                border: none;
                background: ${isCurrentStatus ? 'var(--color-background)' : 'white'};
                cursor: pointer;
                font-weight: ${isCurrentStatus ? 'bold' : 'normal'};
                border-bottom: 1px solid var(--color-border);
            " onclick="app.updateAssignmentStatus('${assignmentId}', '${status}')">
                Set ${status}
            </button>`;
        });

        html += `<button style="
            display: block;
            width: 100%;
            text-align: left;
            padding: 0.5rem 1rem;
            border: none;
            background: white;
            cursor: pointer;
            color: var(--status-overdue);
            font-weight: 500;
        " onclick="app.removeAssignment('${assignmentId}')">
            Remove
        </button>`;

        menu.innerHTML = html;
        document.body.appendChild(menu);

        const closeMenu = () => {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        };

        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 0);
    }

    updateAssignmentStatus(assignmentId, status) {
        dataManager.updateAssignmentStatus(assignmentId, status);
        console.log(`Assignment ${assignmentId} status updated to ${status}`);
        this.render();
    }

    removeAssignment(assignmentId) {
        dataManager.removeAssignment(assignmentId);
        console.log(`Assignment ${assignmentId} removed`);
        this.render();
    }

    handleDragStart(event) {
        this.draggedAssignment = {
            assignmentId: event.currentTarget.dataset.assignmentId,
            orderId: event.currentTarget.dataset.orderId
        };
        event.currentTarget.style.opacity = '0.5';
        event.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd(event) {
        event.currentTarget.style.opacity = '1';
    }

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        event.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.2)';
    }

    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();

        event.currentTarget.style.backgroundColor = '';

        if (!this.draggedAssignment) return;

        const liftId = event.currentTarget.dataset.liftId;
        const date = event.currentTarget.dataset.date;
        const time = event.currentTarget.dataset.time;

        const assignment = dataManager.getAssignments().find(a => a.id === this.draggedAssignment.assignmentId);
        if (!assignment) return;

        // Check for conflicts
        if (dataManager.checkConflict(liftId, date, time, assignment.id)) {
            this.showConflictAlert(`Time slot ${time} on ${calendarManager.formatDate(date)} is already occupied.`);
            this.draggedAssignment = null;
            return;
        }

        // Update assignment
        assignment.liftId = liftId;
        assignment.date = date;
        assignment.time = time;
        dataManager.saveToStorage();

        console.log(`Order moved to ${dataManager.getLiftName(liftId)} on ${date} at ${time}`);

        this.draggedAssignment = null;
        this.render();
    }

    showOrderTooltip(event) {
        const assignmentId = event.currentTarget.dataset.assignmentId;
        const assignment = dataManager.getAssignments().find(a => a.id === assignmentId);

        if (!assignment) return;

        const details = dataManager.getAssignmentDetails(assignment.orderId);
        const liftName = dataManager.getLiftName(assignment.liftId);
        const lift = dataManager.getLifts().find(l => l.id === assignment.liftId);

        let html = `
            <p><strong>${details.orderName}</strong></p>
            <p>Customer: ${details.orderCustomer}</p>
            <p>Weight: ${details.orderWeight}kg</p>
            <p>Lift: ${liftName} (Capacity: ${lift.capacity}kg)</p>
            <p>Date: ${calendarManager.formatDate(assignment.date)}</p>
            <p>Time: ${assignment.time}</p>
            <p>Status: <strong>${assignment.status}</strong></p>
        `;

        this.orderDetailsTooltip.querySelector('.tooltip-content').innerHTML = html;
        this.orderDetailsTooltip.classList.remove('hidden');

        const rect = event.currentTarget.getBoundingClientRect();
        this.orderDetailsTooltip.style.top = (rect.top - 10) + 'px';
        this.orderDetailsTooltip.style.left = (rect.right + 10) + 'px';
    }

    hideOrderTooltip() {
        this.orderDetailsTooltip.classList.add('hidden');
    }

    showConflictAlert(message) {
        const conflictMessage = document.getElementById('conflictMessage');
        conflictMessage.textContent = message;
        this.conflictAlert.classList.remove('hidden');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideConflictAlert();
        }, 5000);
    }

    hideConflictAlert() {
        this.conflictAlert.classList.add('hidden');
    }

    handleKeydown(event) {
        if (event.key === 'Escape') {
            this.closeModal();
            this.hideConflictAlert();
            this.hideOrderTooltip();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CalendarApp();
});
