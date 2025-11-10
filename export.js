function escapeCSVValue(value) {
    if (value === null || value === undefined) {
        return '';
    }
    
    const stringValue = String(value);
    
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
        return '"' + stringValue.replace(/"/g, '""') + '"';
    }
    
    return stringValue;
}

function calculateOrderTotals(order) {
    const servicesSubtotal = order.services.reduce((sum, service) => {
        return sum + (service.quantity * service.unitPrice);
    }, 0);
    
    const partsSubtotal = order.parts.reduce((sum, part) => {
        return sum + (part.quantity * part.unitPrice);
    }, 0);
    
    const subtotal = servicesSubtotal + partsSubtotal;
    
    let discountAmount = 0;
    if (order.discountType === 'percentage') {
        discountAmount = subtotal * (order.discount / 100);
    } else {
        discountAmount = order.discount;
    }
    
    const afterDiscount = subtotal - discountAmount;
    const vatAmount = afterDiscount * (order.vatRate / 100);
    const total = afterDiscount + vatAmount;
    
    return {
        servicesSubtotal,
        partsSubtotal,
        subtotal,
        discountAmount,
        afterDiscount,
        vatAmount,
        total
    };
}

function exportToCSV(orders) {
    const headers = [
        'Order ID',
        'Date',
        'Status',
        'Client Name',
        'Client Email',
        'Client Phone',
        'Client Address',
        'Vehicle Make',
        'Vehicle Model',
        'Vehicle Year',
        'License Plate',
        'VIN',
        'Services Subtotal (€)',
        'Parts Subtotal (€)',
        'Subtotal (€)',
        'Discount Amount (€)',
        'After Discount (€)',
        'VAT Rate (%)',
        'VAT Amount (€)',
        'Total (€)',
        'Notes'
    ];
    
    let csvContent = headers.map(escapeCSVValue).join(',') + '\n';
    
    orders.forEach(order => {
        const totals = calculateOrderTotals(order);
        
        const row = [
            order.id,
            order.date,
            order.status,
            order.client.name,
            order.client.email,
            order.client.phone,
            order.client.address,
            order.vehicle.make,
            order.vehicle.model,
            order.vehicle.year,
            order.vehicle.licensePlate,
            order.vehicle.vin,
            totals.servicesSubtotal.toFixed(2),
            totals.partsSubtotal.toFixed(2),
            totals.subtotal.toFixed(2),
            totals.discountAmount.toFixed(2),
            totals.afterDiscount.toFixed(2),
            order.vatRate,
            totals.vatAmount.toFixed(2),
            totals.total.toFixed(2),
            order.notes || ''
        ];
        
        csvContent += row.map(escapeCSVValue).join(',') + '\n';
    });
    
    return csvContent;
}

function downloadCSV(csvContent, filename) {
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}

function handleCSVExport(filteredOrders) {
    if (filteredOrders.length === 0) {
        alert('No orders to export. Please adjust your filters.');
        return;
    }
    
    const csvContent = exportToCSV(filteredOrders);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `orders-export-${timestamp}.csv`;
    
    downloadCSV(csvContent, filename);
}
