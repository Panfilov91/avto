let allOrders = [];
let filteredOrders = [];

function initializeApp() {
    allOrders = [...ordersData];
    filteredOrders = [...allOrders];
    
    renderOrdersTable();
    setupEventListeners();
}

function setupEventListeners() {
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
    document.getElementById('export-csv').addEventListener('click', () => handleCSVExport(filteredOrders));
    
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function applyFilters() {
    const statusFilter = document.getElementById('filter-status').value.toLowerCase();
    const clientFilter = document.getElementById('filter-client').value.toLowerCase();
    const dateFromFilter = document.getElementById('filter-date-from').value;
    const dateToFilter = document.getElementById('filter-date-to').value;
    
    filteredOrders = allOrders.filter(order => {
        if (statusFilter && order.status.toLowerCase() !== statusFilter) {
            return false;
        }
        
        if (clientFilter && !order.client.name.toLowerCase().includes(clientFilter)) {
            return false;
        }
        
        if (dateFromFilter && order.date < dateFromFilter) {
            return false;
        }
        
        if (dateToFilter && order.date > dateToFilter) {
            return false;
        }
        
        return true;
    });
    
    renderOrdersTable();
}

function resetFilters() {
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-client').value = '';
    document.getElementById('filter-date-from').value = '';
    document.getElementById('filter-date-to').value = '';
    
    filteredOrders = [...allOrders];
    renderOrdersTable();
}

function renderOrdersTable() {
    const tbody = document.getElementById('orders-tbody');
    
    if (filteredOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #999;">No orders found matching the current filters.</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredOrders.map(order => {
        const totals = calculateOrderTotals(order);
        const statusClass = `status-${order.status.toLowerCase()}`;
        
        return `
            <tr>
                <td><strong>${escapeHTML(order.id)}</strong></td>
                <td>${escapeHTML(order.date)}</td>
                <td>${escapeHTML(order.client.name)}</td>
                <td>${escapeHTML(order.vehicle.make)} ${escapeHTML(order.vehicle.model)} (${escapeHTML(String(order.vehicle.year))})</td>
                <td><span class="status-badge ${statusClass}">${escapeHTML(order.status)}</span></td>
                <td style="text-align: right;"><strong>€${totals.total.toFixed(2)}</strong></td>
                <td>
                    <button class="btn btn-info btn-small" onclick="printOrder(ordersData.find(o => o.id === '${order.id}'))">
                        🖨️ Print
                    </button>
                    <button class="btn btn-primary btn-small" onclick="showExportModal(ordersData.find(o => o.id === '${order.id}'))">
                        📤 Export
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function escapeHTML(str) {
    if (str === null || str === undefined) {
        return '';
    }
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', initializeApp);
