class DataManager {
    constructor() {
        this.lifts = [];
        this.orders = [];
        this.assignments = [];
        this.init();
    }

    init() {
        this.seedData();
        this.loadFromStorage();
    }

    seedData() {
        // Seed lifts
        this.lifts = [
            { id: 'lift-1', name: 'Lift A', capacity: 2000 },
            { id: 'lift-2', name: 'Lift B', capacity: 3000 },
            { id: 'lift-3', name: 'Lift C', capacity: 2500 },
            { id: 'lift-4', name: 'Lift D', capacity: 1500 }
        ];

        // Seed orders
        this.orders = [
            { id: 'order-1', name: 'Order #001', customer: 'Acme Corp', weight: 1500, status: 'pending' },
            { id: 'order-2', name: 'Order #002', customer: 'Tech Solutions', weight: 2000, status: 'pending' },
            { id: 'order-3', name: 'Order #003', customer: 'Global Industries', weight: 2500, status: 'pending' },
            { id: 'order-4', name: 'Order #004', customer: 'Local Shop', weight: 800, status: 'pending' },
            { id: 'order-5', name: 'Order #005', customer: 'Big Enterprise', weight: 3000, status: 'pending' },
            { id: 'order-6', name: 'Order #006', customer: 'Small Biz', weight: 1200, status: 'pending' }
        ];

        // Seed some initial assignments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date(today);
        dayAfter.setDate(dayAfter.getDate() + 2);

        this.assignments = [
            {
                id: 'assign-1',
                orderId: 'order-1',
                liftId: 'lift-1',
                date: tomorrow.toISOString().split('T')[0],
                time: '09:00',
                status: 'reserved'
            },
            {
                id: 'assign-2',
                orderId: 'order-2',
                liftId: 'lift-2',
                date: tomorrow.toISOString().split('T')[0],
                time: '10:00',
                status: 'in-progress'
            },
            {
                id: 'assign-3',
                orderId: 'order-3',
                liftId: 'lift-1',
                date: dayAfter.toISOString().split('T')[0],
                time: '14:00',
                status: 'reserved'
            }
        ];
    }

    saveToStorage() {
        sessionStorage.setItem('calendar-data', JSON.stringify({
            lifts: this.lifts,
            orders: this.orders,
            assignments: this.assignments
        }));
    }

    loadFromStorage() {
        const data = sessionStorage.getItem('calendar-data');
        if (data) {
            const parsed = JSON.parse(data);
            this.lifts = parsed.lifts || this.lifts;
            this.orders = parsed.orders || this.orders;
            this.assignments = parsed.assignments || this.assignments;
        }
    }

    getLifts() {
        return [...this.lifts];
    }

    getOrders() {
        return [...this.orders];
    }

    getUnassignedOrders() {
        const assignedOrderIds = new Set(this.assignments.map(a => a.orderId));
        return this.orders.filter(order => !assignedOrderIds.has(order.id));
    }

    getAssignments() {
        return [...this.assignments];
    }

    getAssignmentsForSlot(liftId, date, time) {
        return this.assignments.filter(
            a => a.liftId === liftId && a.date === date && a.time === time
        );
    }

    checkConflict(liftId, date, time, excludeAssignmentId = null) {
        return this.assignments.some(
            a => a.liftId === liftId &&
                 a.date === date &&
                 a.time === time &&
                 a.id !== excludeAssignmentId
        );
    }

    assignOrder(orderId, liftId, date, time, status) {
        // Check if order is already assigned
        const existingAssignment = this.assignments.find(a => a.orderId === orderId);
        if (existingAssignment) {
            existingAssignment.liftId = liftId;
            existingAssignment.date = date;
            existingAssignment.time = time;
            existingAssignment.status = status;
        } else {
            const assignment = {
                id: `assign-${Date.now()}`,
                orderId,
                liftId,
                date,
                time,
                status
            };
            this.assignments.push(assignment);
        }
        this.saveToStorage();
        return this.getAssignmentDetails(orderId);
    }

    getAssignmentDetails(orderId) {
        const assignment = this.assignments.find(a => a.orderId === orderId);
        if (!assignment) return null;

        const order = this.orders.find(o => o.id === orderId);
        const lift = this.lifts.find(l => l.id === assignment.liftId);

        return {
            ...assignment,
            orderName: order?.name,
            orderCustomer: order?.customer,
            liftName: lift?.name,
            orderWeight: order?.weight
        };
    }

    updateAssignmentStatus(assignmentId, status) {
        const assignment = this.assignments.find(a => a.id === assignmentId);
        if (assignment) {
            assignment.status = status;
            this.saveToStorage();
        }
    }

    removeAssignment(assignmentId) {
        const index = this.assignments.findIndex(a => a.id === assignmentId);
        if (index !== -1) {
            this.assignments.splice(index, 1);
            this.saveToStorage();
        }
    }

    getOrderName(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        return order ? order.name : 'Unknown';
    }

    getLiftName(liftId) {
        const lift = this.lifts.find(l => l.id === liftId);
        return lift ? lift.name : 'Unknown';
    }
}

const dataManager = new DataManager();
