# Order Management System

A lightweight, offline-capable order management system with export and printing capabilities.

## Features

### 📊 Order Registry
- View all orders in a clean, organized table
- Filter orders by status, client name, and date range
- Real-time filtering without page reloads

### 📥 CSV Export
- Export filtered orders to CSV format
- Proper delimiters and UTF-8 encoding with BOM
- Includes all order details, client info, vehicle info, and financial totals
- No external libraries required - uses native Blob API

### 🖨️ Print Orders
- Print individual orders with professional A4 layout
- Print-friendly styling with proper page breaks
- Company branding included in printout
- Shows client information, vehicle details, services, parts, discounts, VAT, and totals
- Uses browser's native print dialog

### 📤 Standalone HTML Export
- Generate self-contained HTML files for individual orders
- Copy HTML to clipboard for easy sharing
- Download HTML file with all styles embedded
- Works offline - no external resources required

## Technology Stack

- **Pure HTML/CSS/JavaScript** - No frameworks or external dependencies
- **Blob API** - For generating downloadable files
- **CSS Print Media Queries** - For print-optimized layouts
- **Responsive Design** - Works on desktop and mobile devices

## File Structure

```
.
├── index.html          # Main application page
├── styles.css          # Application styles
├── print-styles.css    # Print-specific styles
├── app.js              # Main application logic
├── data.js             # Sample order data
├── export.js           # CSV export functionality
├── print.js            # Print and HTML export functionality
└── README.md           # This file
```

## Getting Started

1. Open `index.html` in a modern web browser
2. Browse the order registry
3. Use filters to narrow down orders
4. Click "Export to CSV" to download filtered orders
5. Click "Print" on any order to print it
6. Click "Export" on any order to get standalone HTML

## Usage

### Filtering Orders

1. Select a status from the dropdown (Pending, Completed, Cancelled)
2. Enter a client name in the search box
3. Set date range using the date pickers
4. Click "Apply Filters" to filter the orders
5. Click "Reset" to clear all filters

### Exporting to CSV

1. Apply filters to select desired orders (or leave filters empty for all orders)
2. Click "Export to CSV" button
3. CSV file will be downloaded automatically with timestamp in filename
4. File includes: Order details, client info, vehicle info, itemized services/parts, and financial calculations

### Printing an Order

1. Click the "Print" button next to any order
2. Browser print dialog will open
3. Select your printer or "Save as PDF"
4. Print uses A4 page size with proper margins and formatting

### Exporting Standalone HTML

1. Click the "Export" button next to any order
2. Choose to either:
   - **Copy to Clipboard**: HTML code is copied for pasting elsewhere
   - **Download File**: HTML file is downloaded to your computer
3. The HTML file is self-contained and can be opened in any browser
4. Perfect for sharing orders via email or storing offline

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- CSS Grid and Flexbox
- Blob API
- CSS Print Media Queries

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Offline Capability

This application works completely offline:
- No external CSS or JavaScript libraries
- No web fonts or icon libraries
- No API calls to external services
- All resources are self-contained

## Data Structure

Orders include:
- Order ID and date
- Client information (name, email, phone, address)
- Vehicle information (make, model, year, license plate, VIN)
- Services (with descriptions, quantities, and prices)
- Parts (with part numbers, quantities, and prices)
- Discounts (fixed amount or percentage)
- VAT calculations
- Order status
- Notes

## Customization

### Company Branding

Update company information in:
- `index.html`: Header section
- `print.js`: `generatePrintHTML()` function header section

### Styling

- Modify `styles.css` for application appearance
- Modify `print-styles.css` for print layout
- Colors, fonts, and spacing can be easily customized

### Data

- Replace sample data in `data.js` with real data
- Or integrate with a backend API by modifying `app.js`

## License

This project is provided as-is for use in order management applications.
