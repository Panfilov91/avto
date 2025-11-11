const OrdersRegistryModule = {
  init() {
    console.log('Initializing Orders Registry Module...');
    this.setupEventListeners();
    this.render();
  },

  setupEventListeners() {
    const searchInput = document.getElementById('order-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => this.filterOrders());
    }

    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => this.clearFilters());
    }
  },

  render() {
    this.renderSummary();
    this.renderOrders();
  },

  renderSummary() {
    const orders = StorageManager.getAllOrders();
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'draft' || o.status === 'scheduled').length;
    const inProgressOrders = orders.filter(o => o.status === 'in-progress' || o.status === 'in_progress').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('in-progress-orders').textContent = inProgressOrders;
    document.getElementById('completed-orders').textContent = completedOrders;
    document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
  },

  renderOrders() {
    const orders = StorageManager.getAllOrders();
    const clients = StorageManager.getAllClients();
    const vehicles = StorageManager.getAllVehicles();
    const tbody = document.getElementById('orders-table-body');
    const emptyState = document.getElementById('orders-empty');

    if (!tbody) return;

    if (orders.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = orders.map(order => {
      const client = clients.find(c => c.id === order.clientId);
      const vehicle = vehicles.find(v => v.id === order.vehicleId);
      
      const clientName = client ? client.name : 'Unknown';
      const vehicleInfo = vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown';
      const statusClass = this.getStatusClass(order.status);

      return `
        <tr>
          <td>${order.orderNumber || order.id.substring(0, 8)}</td>
          <td>${this.escapeHtml(clientName)}</td>
          <td>${this.escapeHtml(vehicleInfo)}</td>
          <td><span class="status-badge ${statusClass}">${this.formatStatus(order.status)}</span></td>
          <td>${order.scheduledDate ? this.formatDate(order.scheduledDate) : '-'}</td>
          <td>${order.completedDate ? this.formatDate(order.completedDate) : '-'}</td>
          <td>$${(order.totalAmount || 0).toFixed(2)}</td>
          <td>${order.liftReference || '-'}</td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="OrdersRegistryModule.viewOrder('${order.id}')">View</button>
            <button class="btn btn-sm btn-danger" onclick="OrdersRegistryModule.deleteOrder('${order.id}')">Delete</button>
          </td>
        </tr>
      `;
    }).join('');
  },

  viewOrder(id) {
    const order = StorageManager.getOrderById(id);
    if (!order) return;

    const client = StorageManager.getClientById(order.clientId);
    const vehicle = StorageManager.getVehicleById(order.vehicleId);

    let details = `Order: ${order.orderNumber || order.id.substring(0, 8)}\n\n`;
    details += `Client: ${client ? client.name : 'Unknown'}\n`;
    details += `Vehicle: ${vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown'}\n`;
    details += `Status: ${this.formatStatus(order.status)}\n`;
    details += `Scheduled: ${order.scheduledDate ? this.formatDate(order.scheduledDate) : 'Not set'}\n`;
    details += `Total: $${(order.totalAmount || 0).toFixed(2)}\n`;
    if (order.notes) {
      details += `\nNotes: ${order.notes}`;
    }

    alert(details);
  },

  deleteOrder(id) {
    Confirmation.show(
      'Delete Order',
      'Are you sure you want to delete this order? This action cannot be undone.',
      () => {
        StorageManager.deleteOrder(id);
        Notification.show('Order deleted successfully', 'success');
        this.render();
      }
    );
  },

  filterOrders() {
    const searchTerm = document.getElementById('order-search-input').value.toLowerCase();
    const rows = document.querySelectorAll('#orders-table-body tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  },

  clearFilters() {
    document.getElementById('order-search-input').value = '';
    this.filterOrders();
  },

  getStatusClass(status) {
    const statusMap = {
      'draft': 'status-draft',
      'scheduled': 'status-scheduled',
      'in-progress': 'status-in-progress',
      'in_progress': 'status-in-progress',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-draft';
  },

  formatStatus(status) {
    const statusMap = {
      'draft': 'Draft',
      'scheduled': 'Scheduled',
      'in-progress': 'In Progress',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

if (typeof window !== 'undefined') {
  window.OrdersRegistryModule = OrdersRegistryModule;
}
