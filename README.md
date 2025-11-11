# Directories Management System

A web-based CRUD application for managing clients, vehicles, and services in a service-oriented business.

## Features

### Client Management
- Create, read, update, and delete client records
- Distinguish between corporate and individual clients
- Store contact information (name, phone, email, address)
- Search and filter clients by name, email, phone, or corporate status

### Vehicle Management
- Manage vehicle entries linked to clients
- Store vehicle details (make, model, year, license plate, VIN)
- Enforce relational integrity (vehicles must be linked to clients)
- Search and filter vehicles by various criteria
- Automatic cleanup of vehicles when client is deleted

### Service Management
- Comprehensive service catalog with categories
- Services grouped by category (Maintenance, Repair, Diagnostic, Detailing, Inspection)
- Pricing and duration management
- Search and filter services by name, description, or category
- Real-time search for large service lists

### Data Validation
- Client form validation (required fields, phone format, email format)
- Vehicle form validation (client linkage, required fields, year validation)
- Service form validation (required fields, numeric price validation)
- Inline error messages for invalid submissions

### User Experience
- Toast notifications for CRUD operations
- Confirmation dialogs for delete operations
- Warning when deleting entities with dependencies
- Responsive design for mobile and desktop
- Tab-based navigation between sections
- Modal forms for create/edit operations

### Data Persistence
- Local storage-based data persistence
- Automatic seed data initialization
- StorageManager class for data operations

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage API
- **Architecture**: Object-oriented JavaScript with classes
- **Styling**: CSS Grid, Flexbox, CSS animations

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # Complete styling
├── script.js           # Application logic
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

## Classes and Architecture

### StorageManager
Handles all data persistence operations using localStorage
- Seed data initialization
- CRUD operations for all entities
- Data validation and ID generation

### ToastManager
Manages user feedback notifications
- Success, error, and warning messages
- Auto-dismiss after 3 seconds
- Smooth animations

### Validator
Provides form validation utilities
- Phone number validation
- Email validation
- Required field checking
- Numeric validation

### DirectoriesApp
Main application controller
- UI rendering and updates
- Event handling
- Modal management
- Search and filter functionality

## Getting Started

1. Open `index.html` in a web browser
2. The application will automatically initialize with seed data
3. Use the tab navigation to switch between Clients, Vehicles, and Services
4. All data is persisted in browser localStorage

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Data Schema

### Client
```javascript
{
  id: string,
  name: string,
  phone: string,
  email: string,
  address: string,
  corporate: boolean
}
```

### Vehicle
```javascript
{
  id: string,
  clientId: string,
  make: string,
  model: string,
  year: number,
  license: string,
  vin: string
}
```

### Service
```javascript
{
  id: string,
  name: string,
  category: string,
  price: number,
  duration: number,
  description: string
}
```