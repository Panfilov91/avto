const ExportModule = {
  init() {
    console.log('Initializing Export Module...');
    this.setupEventListeners();
    this.populateOrderSelects();
  },

  setupEventListeners() {
    const exportCsvBtn = document.getElementById('export-csv-btn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => this.exportToCSV());
    }

    const printOrderSelect = document.getElementById('print-order-select');
    if (printOrderSelect) {
      printOrderSelect.addEventListener('change', () => {
        const printBtn = document.getElementById('print-order-btn');
        if (printBtn) {
          printBtn.disabled = !printOrderSelect.value;
        }
      });
    }

    const printOrderBtn = document.getElementById('print-order-btn');
    if (printOrderBtn) {
      printOrderBtn.addEventListener('click', () => this.printOrder());
    }

    const exportHtmlSelect = document.getElementById('export-html-select');
    if (exportHtmlSelect) {
      exportHtmlSelect.addEventListener('change', () => {
        const exportBtn = document.getElementById('export-html-btn');
        if (exportBtn) {
          exportBtn.disabled = !exportHtmlSelect.value;
        }
      });
    }

    const exportHtmlBtn = document.getElementById('export-html-btn');
    if (exportHtmlBtn) {
      exportHtmlBtn.addEventListener('click', () => this.exportToHTML());
    }
  },

  populateOrderSelects() {
    const orders = StorageManager.getAllOrders();
    const clients = StorageManager.getAllClients();

    const printSelect = document.getElementById('print-order-select');
    const exportSelect = document.getElementById('export-html-select');

    const optionsHtml = orders.map(order => {
      const client = clients.find(c => c.id === order.clientId);
      const clientName = client ? client.name : 'Unknown';
      const orderLabel = `${order.orderNumber || order.id.substring(0, 8)} - ${clientName}`;
      return `<option value="${order.id}">${this.escapeHtml(orderLabel)}</option>`;
    }).join('');

    if (printSelect) {
      printSelect.innerHTML = '<option value="">Select an order to print</option>' + optionsHtml;
    }

    if (exportSelect) {
      exportSelect.innerHTML = '<option value="">Select an order to export</option>' + optionsHtml;
    }
  },

  exportToCSV() {
    const orders = StorageManager.getAllOrders();
    const clients = StorageManager.getAllClients();
    const vehicles = StorageManager.getAllVehicles();

    if (orders.length === 0) {
      Notification.show('No orders to export', 'info');
      return;
    }

    let csv = 'Order Number,Client,Vehicle,Status,Scheduled Date,Completed Date,Total Amount,Lift\n';

    orders.forEach(order => {
      const client = clients.find(c => c.id === order.clientId);
      const vehicle = vehicles.find(v => v.id === order.vehicleId);

      const clientName = client ? client.name : 'Unknown';
      const vehicleInfo = vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown';
      const orderNum = order.orderNumber || order.id.substring(0, 8);
      const scheduledDate = order.scheduledDate || '';
      const completedDate = order.completedDate || '';
      const totalAmount = (order.totalAmount || 0).toFixed(2);
      const lift = order.liftReference || '';

      csv += `"${orderNum}","${this.escapeCsv(clientName)}","${this.escapeCsv(vehicleInfo)}","${order.status}","${scheduledDate}","${completedDate}","${totalAmount}","${lift}"\n`;
    });

    this.downloadFile(csv, 'orders-export.csv', 'text/csv');
    Notification.show('Orders exported successfully', 'success');
  },

  printOrder() {
    const orderId = document.getElementById('print-order-select').value;
    if (!orderId) return;

    const order = StorageManager.getOrderById(orderId);
    if (!order) return;

    const client = StorageManager.getClientById(order.clientId);
    const vehicle = StorageManager.getVehicleById(order.vehicleId);

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order ${order.orderNumber || order.id.substring(0, 8)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #2563eb; }
          .section { margin: 20px 0; }
          .label { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Order #${order.orderNumber || order.id.substring(0, 8)}</h1>
        
        <div class="section">
          <div><span class="label">Client:</span> ${client ? this.escapeHtml(client.name) : 'Unknown'}</div>
          <div><span class="label">Vehicle:</span> ${vehicle ? `${this.escapeHtml(vehicle.make)} ${this.escapeHtml(vehicle.model)} (${this.escapeHtml(vehicle.licensePlate)})` : 'Unknown'}</div>
          <div><span class="label">Status:</span> ${order.status}</div>
          <div><span class="label">Scheduled Date:</span> ${order.scheduledDate || 'Not set'}</div>
          ${order.liftReference ? `<div><span class="label">Lift:</span> ${order.liftReference}</div>` : ''}
        </div>

        ${order.lineItems && order.lineItems.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.lineItems.map(item => `
                <tr>
                  <td>${this.escapeHtml(item.serviceName)}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.unitPrice.toFixed(2)}</td>
                  <td>$${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="section" style="text-align: right;">
            <div><span class="label">Subtotal:</span> $${order.subtotal ? order.subtotal.toFixed(2) : '0.00'}</div>
            ${order.discount ? `<div><span class="label">Discount:</span> -$${order.discount.toFixed(2)}</div>` : ''}
            ${order.vat ? `<div><span class="label">VAT (20%):</span> $${order.vat.toFixed(2)}</div>` : ''}
            <div style="font-size: 1.2em; margin-top: 10px;"><span class="label">Total:</span> $${(order.totalAmount || 0).toFixed(2)}</div>
          </div>
        ` : ''}

        ${order.notes ? `
          <div class="section">
            <div class="label">Notes:</div>
            <p>${this.escapeHtml(order.notes)}</p>
          </div>
        ` : ''}

        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
      </body>
      </html>
    `);
    printWindow.document.close();
  },

  exportToHTML() {
    const orderId = document.getElementById('export-html-select').value;
    if (!orderId) return;

    const order = StorageManager.getOrderById(orderId);
    if (!order) return;

    const client = StorageManager.getClientById(order.clientId);
    const vehicle = StorageManager.getVehicleById(order.vehicleId);

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Order ${order.orderNumber || order.id.substring(0, 8)}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
    h1 { color: #2563eb; }
    .section { margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
    .label { font-weight: bold; color: #4b5563; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
    th { background-color: #f3f4f6; font-weight: 600; }
    .total-row { font-weight: bold; font-size: 1.1em; }
  </style>
</head>
<body>
  <h1>Order #${order.orderNumber || order.id.substring(0, 8)}</h1>
  
  <div class="section">
    <div><span class="label">Client:</span> ${client ? this.escapeHtml(client.name) : 'Unknown'}</div>
    <div><span class="label">Vehicle:</span> ${vehicle ? `${this.escapeHtml(vehicle.make)} ${this.escapeHtml(vehicle.model)} (${this.escapeHtml(vehicle.licensePlate)})` : 'Unknown'}</div>
    <div><span class="label">Status:</span> ${order.status}</div>
    <div><span class="label">Scheduled Date:</span> ${order.scheduledDate || 'Not set'}</div>
    ${order.liftReference ? `<div><span class="label">Lift:</span> ${order.liftReference}</div>` : ''}
  </div>

  ${order.lineItems && order.lineItems.length > 0 ? `
    <table>
      <thead>
        <tr>
          <th>Service</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.lineItems.map(item => `
          <tr>
            <td>${this.escapeHtml(item.serviceName)}</td>
            <td>${item.quantity}</td>
            <td>$${item.unitPrice.toFixed(2)}</td>
            <td>$${item.total.toFixed(2)}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="3" style="text-align: right;">Total:</td>
          <td>$${(order.totalAmount || 0).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  ` : ''}

  ${order.notes ? `
    <div class="section">
      <div class="label">Notes:</div>
      <p>${this.escapeHtml(order.notes)}</p>
    </div>
  ` : ''}
</body>
</html>`;

    const filename = `order-${order.orderNumber || order.id.substring(0, 8)}.html`;
    this.downloadFile(html, filename, 'text/html');
    Notification.show('Order exported as HTML', 'success');
  },

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  escapeCsv(text) {
    return text.replace(/"/g, '""');
  }
};

if (typeof window !== 'undefined') {
  window.ExportModule = ExportModule;
}
