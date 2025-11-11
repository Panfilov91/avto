# Avto Management System - Complete Application

A comprehensive web application for managing vehicle service operations, including client and vehicle directories, order management, lift scheduling, and export capabilities.

## 🚀 Features

### 1. **Directories Management**
- **Clients Directory**: Add, edit, delete, and search client records (individual and corporate)
- **Vehicles Directory**: Manage vehicle information linked to clients with full CRUD operations
- **Services Catalog**: Maintain service offerings with categories, prices, and durations
- Real-time search and filtering
- Type-based filtering (corporate vs individual clients)

### 2. **Order Form (Order-Narad)**
- Create comprehensive service orders with multiple line items
- Client and vehicle selection with automatic filtering
- Service catalog integration
- Automatic calculations:
  - Subtotal
  - Discount (percentage-based)
  - VAT (20%)
  - Grand total
- Lift assignment
- Scheduled date selection
- Order notes

### 3. **Orders Registry**
- Display all orders in a filterable table
- Summary statistics dashboard:
  - Total orders
  - Pending orders
  - In-progress orders
  - Completed orders
  - Total revenue
- Search by order number or client name
- Date range filtering
- Status filtering (draft, scheduled, in-progress, completed)
- Client and lift filtering
- Sort by order number, date, or total
- View and delete orders

### 4. **Lift Scheduling Calendar**
- Week-view calendar showing lift availability
- 4 lifts tracked simultaneously
- Visual order markers on scheduled dates
- Week navigation (previous/next)
- Status-based color coding
- Lift filtering

### 5. **Export & Print**
- **CSV Export**: Export all orders to spreadsheet-compatible format
- **Print Orders**: Generate print-ready order documents with full details
- **HTML Export**: Create standalone HTML files for sharing orders

### 6. **Data Management**
- Comprehensive localStorage-backed storage
- Automatic data persistence
- Sample data seeding
- Clear storage and reseed options in settings

## 📋 Project Structure

```
/
├── index.html                      # Main application HTML
├── styles.css                      # Complete styling with accessibility
├── build.js                        # Single-file bundler for deployment
├── package.json                    # Project metadata
├── README.md                       # This file
├── .gitignore                      # Git ignore rules
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml              # Main deployment workflow
│   │   ├── deploy-pages.yml        # GitHub Pages deployment
│   │   └── auto-merge.yml          # Auto-merge workflow
│   └── WORKFLOWS.md                # Workflow documentation
└── js/
    ├── app.js                      # Main application coordinator
    ├── storage-manager.js          # Comprehensive storage layer
    ├── directories-module.js       # Directories CRUD module
    ├── order-form-module.js        # Order creation module
    ├── orders-registry-module.js   # Orders display and filtering
    ├── lift-calendar-module.js     # Calendar scheduling
    └── export-module.js            # Export and print functionality
```

## 🏗️ Architecture

### Storage Layer
The `StorageManager` provides a comprehensive data management system:
- **Entities**: Clients, Vehicles, Services, Orders, Lifts
- **Operations**: CRUD operations for all entities
- **Persistence**: localStorage-backed with automatic initialization
- **Data Integrity**: UUID-based IDs, timestamps, relationships
- **Seeding**: Automatic sample data generation

### Module System
Each functional area is encapsulated in its own module:

1. **Directories Module**: Manages clients, vehicles, and services with modal-based forms
2. **Order Form Module**: Handles order creation with service selection and calculations
3. **Orders Registry Module**: Displays and filters orders with summary statistics
4. **Lift Calendar Module**: Visualizes lift scheduling across a week view
5. **Export Module**: Provides data export and printing capabilities

### Navigation
- **Main Navigation**: Switch between major sections (Directories, New Order, Orders Registry, Calendar, Export)
- **Sub Navigation**: Within Directories, switch between Clients, Vehicles, and Services tabs
- **Modal System**: Consistent modal dialogs for forms and confirmations

## 🎨 Design Features

### Accessibility
- **WCAG AA Compliant**: All colors meet 4.5:1 contrast ratio
- **Semantic HTML**: Proper ARIA labels, roles, and landmarks
- **Keyboard Navigation**: Full keyboard support throughout
- **Focus Management**: Visible focus indicators and modal focus trapping
- **Screen Reader Support**: Descriptive labels and live regions

### Responsive Design
- Grid-based layouts that adapt to screen size
- Mobile-friendly forms and tables
- Responsive navigation
- Touch-friendly controls

### Visual Design
- Clean, modern interface
- Consistent color scheme with semantic status colors
- Card-based layouts for directories
- Badge indicators for status and categories
- Smooth transitions and hover states

## 🔧 Data Schemas

### Client
```javascript
{
  id: string (uuid),
  name: string,
  type: 'individual' | 'corporate',
  email: string,
  phone: string,
  address: string,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
```

### Vehicle
```javascript
{
  id: string (uuid),
  clientId: string,
  make: string,
  model: string,
  year: number,
  licensePlate: string,
  vin: string,
  color: string,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
```

### Service
```javascript
{
  id: string (uuid),
  name: string,
  category: string,
  description: string,
  basePrice: number,
  duration: number (minutes),
  isActive: boolean,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
```

### Order
```javascript
{
  id: string (uuid),
  orderNumber: string,
  clientId: string,
  vehicleId: string,
  serviceIds: array,
  lineItems: array,
  status: 'draft' | 'scheduled' | 'in-progress' | 'completed',
  scheduledDate: string (ISO),
  liftReference: string,
  subtotal: number,
  discount: number,
  vat: number,
  totalAmount: number,
  notes: string,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
```

## 🚀 Deployment

### GitHub Pages
The application is configured for automatic deployment to GitHub Pages:
1. Push to `main` branch triggers deployment workflow
2. `build.js` bundles everything into a single HTML file
3. Deployed to GitHub Pages automatically
4. Accessible at your GitHub Pages URL

### Manual Deployment
```bash
npm run build
# Deploy dist/index.html to any static hosting
```

## 💻 Development

### Local Development
Simply open `index.html` in a modern browser. No build step required for development.

### Testing Data
- Application seeds sample data automatically on first run
- Use Settings → Reseed Data to regenerate sample data
- Use Settings → Clear Storage to reset everything

### Browser Requirements
- Modern browser with ES6 support
- localStorage enabled
- JavaScript enabled

## 📱 Usage Guide

### Getting Started
1. Open the application
2. Navigate to **Directories** to add clients, vehicles, and services
3. Go to **New Order** to create service orders
4. View all orders in **Orders Registry**
5. See scheduled orders in **Calendar**
6. Export data from **Export** section

### Creating an Order
1. Click **New Order** in the main navigation
2. Select a client (vehicle dropdown updates automatically)
3. Select a vehicle
4. Choose a scheduled date
5. Optionally assign a lift
6. Click **+ Add Service** to add services to the order
7. Apply discount if needed (VAT calculates automatically)
8. Add notes if needed
9. Click **Create Order**

### Managing Directories
1. Navigate to **Directories**
2. Switch between Clients, Vehicles, and Services tabs
3. Click **Add** button to create new entries
4. Click **Edit** on any card to modify
5. Click **Delete** to remove (with confirmation)
6. Use search and filters to find entries

### Viewing and Filtering Orders
1. Go to **Orders Registry**
2. Use the search box to find specific orders
3. Apply filters (status, date range, client, lift)
4. Click on column headers to sort
5. View summary statistics at the top
6. Click **View** to see order details
7. Click **Delete** to remove orders

### Using the Calendar
1. Navigate to **Calendar**
2. Use Previous/Next buttons to navigate weeks
3. See which lifts are assigned on which days
4. Filter by specific lift to focus view
5. Color-coded markers show order status

### Exporting Data
1. Go to **Export** section
2. **Export CSV**: Click to download all orders as CSV
3. **Print Order**: Select an order and click Print
4. **Export HTML**: Select an order and export as standalone HTML file

## 🤝 Contributing

This is a complete, integrated application combining features from multiple development branches. All modules work together seamlessly through the global StorageManager.

## 📄 License

This project is open source and available under the MIT License.

## 🎯 Features Checklist

✅ Client directory with CRUD operations
✅ Vehicle directory with client linking
✅ Service catalog management
✅ Comprehensive order form with calculations
✅ Orders registry with filtering and search
✅ Lift scheduling calendar
✅ CSV export functionality
✅ Print-ready order documents
✅ HTML export for sharing
✅ Offline-first architecture
✅ LocalStorage persistence
✅ Sample data seeding
✅ Settings management
✅ Accessibility compliance (WCAG AA)
✅ Responsive design
✅ Keyboard navigation
✅ Modal dialogs
✅ Confirmation dialogs
✅ Toast notifications
✅ Form validation
✅ Real-time calculations
✅ Status tracking
✅ Summary statistics

## 📞 Support

For issues or questions, please create an issue in the GitHub repository.
