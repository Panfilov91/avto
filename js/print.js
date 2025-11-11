function generatePrintHTML(order) {
    const totals = calculateOrderTotals(order);
    
    const statusClass = order.status.toLowerCase();
    
    let servicesHTML = '';
    if (order.services && order.services.length > 0) {
        servicesHTML = `
            <div class="print-section">
                <h3 class="print-section-title">Services</h3>
                <table class="print-table">
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Description</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Unit Price</th>
                            <th style="text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.services.map(service => `
                            <tr>
                                <td>${escapeHTML(service.name)}</td>
                                <td>${escapeHTML(service.description)}</td>
                                <td style="text-align: center;">${service.quantity}</td>
                                <td style="text-align: right;">€${service.unitPrice.toFixed(2)}</td>
                                <td style="text-align: right;">€${(service.quantity * service.unitPrice).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" style="text-align: right;">Services Subtotal:</td>
                            <td style="text-align: right;">€${totals.servicesSubtotal.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    }
    
    let partsHTML = '';
    if (order.parts && order.parts.length > 0) {
        partsHTML = `
            <div class="print-section">
                <h3 class="print-section-title">Parts</h3>
                <table class="print-table">
                    <thead>
                        <tr>
                            <th>Part Name</th>
                            <th>Part Number</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Unit Price</th>
                            <th style="text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.parts.map(part => `
                            <tr>
                                <td>${escapeHTML(part.name)}</td>
                                <td>${escapeHTML(part.partNumber)}</td>
                                <td style="text-align: center;">${part.quantity}</td>
                                <td style="text-align: right;">€${part.unitPrice.toFixed(2)}</td>
                                <td style="text-align: right;">€${(part.quantity * part.unitPrice).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" style="text-align: right;">Parts Subtotal:</td>
                            <td style="text-align: right;">€${totals.partsSubtotal.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    }
    
    const discountLabel = order.discountType === 'percentage' 
        ? `Discount (${order.discount}%)` 
        : 'Discount';
    
    const html = `
        <div class="print-order">
            <div class="print-header">
                <div class="print-company-name">AutoService Pro</div>
                <div class="print-company-tagline">Professional Vehicle Maintenance</div>
                <div class="print-company-contact">
                    Phone: +1 555-0100 | Email: info@autoservicepro.com | www.autoservicepro.com
                </div>
            </div>
            
            <h2 class="print-title">Order #${escapeHTML(order.id)}</h2>
            
            <div class="print-section">
                <div class="print-info-grid">
                    <div>
                        <div class="print-info-item">
                            <span class="print-info-label">Date:</span>
                            <span class="print-info-value">${escapeHTML(order.date)}</span>
                        </div>
                        <div class="print-info-item">
                            <span class="print-info-label">Status:</span>
                            <span class="print-status ${statusClass}">${escapeHTML(order.status.toUpperCase())}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="print-section">
                <h3 class="print-section-title">Client Information</h3>
                <div class="print-info-item">
                    <span class="print-info-label">Name:</span>
                    <span class="print-info-value">${escapeHTML(order.client.name)}</span>
                </div>
                <div class="print-info-item">
                    <span class="print-info-label">Email:</span>
                    <span class="print-info-value">${escapeHTML(order.client.email)}</span>
                </div>
                <div class="print-info-item">
                    <span class="print-info-label">Phone:</span>
                    <span class="print-info-value">${escapeHTML(order.client.phone)}</span>
                </div>
                <div class="print-info-item">
                    <span class="print-info-label">Address:</span>
                    <span class="print-info-value">${escapeHTML(order.client.address)}</span>
                </div>
            </div>
            
            <div class="print-section">
                <h3 class="print-section-title">Vehicle Information</h3>
                <div class="print-info-grid">
                    <div>
                        <div class="print-info-item">
                            <span class="print-info-label">Make/Model:</span>
                            <span class="print-info-value">${escapeHTML(order.vehicle.make)} ${escapeHTML(order.vehicle.model)}</span>
                        </div>
                        <div class="print-info-item">
                            <span class="print-info-label">Year:</span>
                            <span class="print-info-value">${escapeHTML(String(order.vehicle.year))}</span>
                        </div>
                    </div>
                    <div>
                        <div class="print-info-item">
                            <span class="print-info-label">License Plate:</span>
                            <span class="print-info-value">${escapeHTML(order.vehicle.licensePlate)}</span>
                        </div>
                        <div class="print-info-item">
                            <span class="print-info-label">VIN:</span>
                            <span class="print-info-value">${escapeHTML(order.vehicle.vin)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${servicesHTML}
            ${partsHTML}
            
            <div class="print-section">
                <div class="print-totals">
                    <div class="print-total-row">
                        <span>Subtotal:</span>
                        <span>€${totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="print-total-row">
                        <span>${discountLabel}:</span>
                        <span>-€${totals.discountAmount.toFixed(2)}</span>
                    </div>
                    <div class="print-total-row">
                        <span>After Discount:</span>
                        <span>€${totals.afterDiscount.toFixed(2)}</span>
                    </div>
                    <div class="print-total-row">
                        <span>VAT (${order.vatRate}%):</span>
                        <span>€${totals.vatAmount.toFixed(2)}</span>
                    </div>
                    <div class="print-total-row grand-total">
                        <span>TOTAL:</span>
                        <span>€${totals.total.toFixed(2)}</span>
                    </div>
                </div>
                <div style="clear: both;"></div>
            </div>
            
            ${order.notes ? `
            <div class="print-section">
                <h3 class="print-section-title">Notes</h3>
                <p style="margin: 0; padding: 0.5rem; background: #f9f9f9; border-left: 3px solid #667eea;">
                    ${escapeHTML(order.notes)}
                </p>
            </div>
            ` : ''}
            
            <div class="print-footer">
                <p>Thank you for your business!</p>
                <p>This is an official order document from AutoService Pro. For any questions, please contact us.</p>
                <p style="margin-top: 0.5rem; font-size: 8pt;">Generated on ${new Date().toLocaleString()}</p>
            </div>
        </div>
    `;
    
    return html;
}

function escapeHTML(str) {
    if (str === null || str === undefined) {
        return '';
    }
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function printOrder(order) {
    const printContainer = document.getElementById('print-container');
    const printHTML = generatePrintHTML(order);
    
    printContainer.innerHTML = printHTML;
    
    setTimeout(() => {
        window.print();
    }, 100);
}

function generateStandaloneHTML(order) {
    const printHTML = generatePrintHTML(order);
    
    const standaloneHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order ${escapeHTML(order.id)} - AutoService Pro</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 2rem;
        }
        
        .print-order {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .print-header {
            border-bottom: 3px solid #667eea;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
        }
        
        .print-company-name {
            font-size: 24pt;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        
        .print-company-tagline {
            font-size: 11pt;
            color: #666;
            margin-bottom: 0.5rem;
        }
        
        .print-company-contact {
            font-size: 10pt;
            color: #666;
        }
        
        .print-title {
            font-size: 18pt;
            font-weight: bold;
            margin: 1.5rem 0;
            color: #333;
        }
        
        .print-section {
            margin-bottom: 1.5rem;
        }
        
        .print-section-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 0.75rem;
            color: #667eea;
            border-bottom: 1px solid #ddd;
            padding-bottom: 0.25rem;
        }
        
        .print-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .print-info-item {
            margin-bottom: 0.5rem;
        }
        
        .print-info-label {
            font-weight: bold;
            color: #555;
            display: inline-block;
            min-width: 120px;
        }
        
        .print-info-value {
            color: #333;
        }
        
        .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1rem;
        }
        
        .print-table th {
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            padding: 0.5rem;
            text-align: left;
            font-weight: bold;
            font-size: 10pt;
        }
        
        .print-table td {
            border: 1px solid #ccc;
            padding: 0.5rem;
            font-size: 10pt;
        }
        
        .print-table tfoot td {
            font-weight: bold;
            background-color: #f9f9f9;
        }
        
        .print-totals {
            margin-top: 1rem;
            float: right;
            width: 50%;
        }
        
        .print-total-row {
            display: flex;
            justify-content: space-between;
            padding: 0.4rem 0;
            border-bottom: 1px solid #eee;
        }
        
        .print-total-row.grand-total {
            font-size: 14pt;
            font-weight: bold;
            border-top: 2px solid #333;
            border-bottom: 3px double #333;
            margin-top: 0.5rem;
            padding-top: 0.5rem;
        }
        
        .print-footer {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #ddd;
            font-size: 9pt;
            color: #666;
            clear: both;
        }
        
        .print-status {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-size: 10pt;
            font-weight: bold;
        }
        
        .print-status.pending {
            background-color: #fef3c7;
            color: #92400e;
            border: 1px solid #fcd34d;
        }
        
        .print-status.completed {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #6ee7b7;
        }
        
        .print-status.cancelled {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fca5a5;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .print-order {
                box-shadow: none;
                max-width: 100%;
            }
            
            @page {
                size: A4;
                margin: 15mm;
            }
        }
        
        @media (max-width: 768px) {
            body {
                padding: 1rem;
            }
            
            .print-order {
                padding: 1rem;
            }
            
            .print-info-grid {
                grid-template-columns: 1fr;
            }
            
            .print-totals {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    ${printHTML}
</body>
</html>`;
    
    return standaloneHTML;
}

function showExportModal(order) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = 'Export Order ' + order.id;
    
    modalBody.innerHTML = `
        <p style="margin-bottom: 1rem;">Choose how you want to export this order:</p>
        <div class="modal-actions">
            <button id="copy-html-btn" class="btn btn-primary">
                <span class="icon">📋</span> Copy HTML to Clipboard
            </button>
            <button id="download-html-btn" class="btn btn-success">
                <span class="icon">💾</span> Download HTML File
            </button>
        </div>
        <div id="export-feedback" style="margin-top: 1rem; padding: 0.75rem; display: none; border-radius: 4px;"></div>
    `;
    
    modal.style.display = 'block';
    
    document.getElementById('copy-html-btn').addEventListener('click', () => {
        copyHTMLToClipboard(order);
    });
    
    document.getElementById('download-html-btn').addEventListener('click', () => {
        downloadHTMLFile(order);
    });
}

function copyHTMLToClipboard(order) {
    const html = generateStandaloneHTML(order);
    
    const textarea = document.createElement('textarea');
    textarea.value = html;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showFeedback('HTML copied to clipboard successfully!', 'success');
    } catch (err) {
        showFeedback('Failed to copy to clipboard. Please try downloading instead.', 'error');
    }
    
    document.body.removeChild(textarea);
}

function downloadHTMLFile(order) {
    const html = generateStandaloneHTML(order);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `order-${order.id}.html`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    showFeedback('HTML file downloaded successfully!', 'success');
}

function showFeedback(message, type) {
    const feedbackDiv = document.getElementById('export-feedback');
    feedbackDiv.textContent = message;
    feedbackDiv.style.display = 'block';
    
    if (type === 'success') {
        feedbackDiv.style.backgroundColor = '#d1fae5';
        feedbackDiv.style.color = '#065f46';
        feedbackDiv.style.border = '1px solid #6ee7b7';
    } else {
        feedbackDiv.style.backgroundColor = '#fee2e2';
        feedbackDiv.style.color = '#991b1b';
        feedbackDiv.style.border = '1px solid #fca5a5';
    }
}
