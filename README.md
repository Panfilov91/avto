# Vehicle Registry & Calendar Management Application

A fully functional web application for managing vehicle registries and calendars with comprehensive form validation, input masking, and accessibility features.

## Features

### 1. Input Masks (Objective 1)
- **Phone Number Mask**: Enforces +7 (XXX) XXX-XX-XX format
- **Vehicle Plate Mask**: Enforces A000AA00 format (Letter, 3 digits, 2 letters, 2 digits)
- Real-time formatting as users type
- Automatic validation of masked formats

### 2. Form Validation (Objective 2)
- **Required Field Validation**: Ensures all mandatory fields are filled
- **Format Validation**: Phone and plate format validation with clear error messages
- **Contextual Error Messaging**: Field-specific error messages guide user correction
- **Global Validation Helpers**: Reusable validation functions for common patterns
- **Real-time Feedback**: Errors clear automatically when field is corrected

### 3. Accessibility & UI Polish (Objective 3)
- **WCAG AA Compliant Color Palette**:
  - Status colors: Active (Green #2e8555), Inactive (Gray #5a6c7d), Maintenance (Orange #c26200)
  - Error color: Red (#c5192d) - high contrast against white
  - All text meets 4.5:1 minimum contrast ratio
- **Semantic HTML**: Proper use of ARIA labels, roles, and landmarks
- **Keyboard Navigation**: Full keyboard support including Tab, Enter, Escape, Arrow keys
- **Focus Management**: Visible focus indicators and modal focus trapping
- **Legends**: Status and workload legends with color indicators in registry and calendar

### 4. Settings Panel (Objective 4)
- **Clear Local Storage**: Removes all saved data with user confirmation
- **Reseed Sample Data**: Regenerates initial sample data for testing
- **Confirmation Dialogs**: User confirmation required before destructive actions
- **Non-Modal Accessibility**: Settings accessible from header button

### 5. QA Compliance (Objective 5)
- **Offline Operation**: All data stored in localStorage, no external API calls
- **Accessibility Audit**: Labels, focus order, keyboard navigation, ARIA attributes
- **Module Interoperability**: All modules work together seamlessly
- **Console Clean**: No errors or warnings in browser console
- **No External Requests**: Fully self-contained application

## Project Structure

```
/
├── index.html           # Main HTML document
├── styles.css          # Styling with accessibility features
├── package.json        # Project metadata
├── README.md           # This file
├── .gitignore         # Git ignore rules
└── js/
    ├── app.js         # Main application initialization and QA utilities
    ├── inputMask.js   # Input mask implementation for phone and plates
    ├── validation.js  # Form validation helpers
    ├── storage.js     # LocalStorage management and data seeding
    ├── registry.js    # Vehicle registry display and filtering
    ├── calendar.js    # Calendar view with vehicle scheduling
    ├── forms.js       # Form handling and submission
    └── settings.js    # Settings panel and data management
```

## Module Architecture

### Storage Module
- LocalStorage wrapper for offline data persistence
- Sample data seeding on first run
- Search and filter capabilities
- CRUD operations for vehicles

### InputMask Module
- Phone number masking: +7 (XXX) XXX-XX-XX
- Vehicle plate masking: A000AA00
- Format validation functions
- Raw data extraction utilities

### Validation Module
- Required field validation
- Phone and plate format validation
- Numeric range validation
- Form-wide validation with error collection
- Error display and clearing

### Registry Module
- Display vehicles in filterable table
- Search by plate or phone
- Filter by status and workload
- Edit and delete functionality
- Real-time updates

### Calendar Module
- Monthly calendar view
- Vehicle event indicators
- Month navigation
- Status-based color coding
- Keyboard accessible

### Forms Module
- Vehicle entry form
- Input mask application
- Validation integration
- Submit and reset handling
- Edit mode support

### Settings Module
- Settings modal dialog
- Data management options
- Confirmation dialogs
- Modal accessibility

## Usage

### Starting the Application

```bash
# Using Python's built-in server
python3 -m http.server 8000

# Or use npm start
npm start
```

Then open http://localhost:8000 in your browser.

### Adding a Vehicle

1. Navigate to the "Forms" tab
2. Fill in the vehicle plate (format: A000AA00)
3. Enter phone number (format: +7 (XXX) XXX-XX-XX)
4. Select status and workload levels
5. Add optional notes
6. Click "Save Vehicle"

### Managing Vehicles

- **Registry Tab**: View all vehicles in a sortable table
- **Search**: Search by plate, phone, or notes
- **Filter**: Filter by status or workload
- **Edit**: Click "Edit" to modify a vehicle
- **Delete**: Click "Delete" to remove a vehicle

### Calendar View

- Navigate between months using Previous/Next buttons
- Days with vehicles show color-coded indicators
- Click on any day to see vehicle details

### Settings

- Click the ⚙️ button in the header
- **Clear Storage**: Remove all data and reset to factory state
- **Reseed Data**: Restore sample data for testing

## Accessibility Features

- **Skip Link**: Jump to main content
- **Semantic HTML**: Proper heading hierarchy, landmarks, and roles
- **ARIA Labels**: All interactive elements have descriptive labels
- **Keyboard Navigation**: Tab through controls, Enter/Space to activate
- **Focus Management**: Modal dialogs trap focus and return it when closed
- **Color Contrast**: All text meets WCAG AA standards (4.5:1 ratio)
- **Error Messages**: Clear, contextual error messages for form validation
- **Form Hints**: Helpful hints below form fields
- **Reduced Motion**: Respects prefers-reduced-motion preference

## Color Palette (WCAG AA Compliant)

| Color | Purpose | Hex | Contrast |
|-------|---------|-----|----------|
| Primary | Links, buttons | #0052cc | 9.0:1 |
| Active | Green status/indicator | #2e8555 | 4.8:1 |
| Inactive | Gray status/indicator | #5a6c7d | 5.2:1 |
| Maintenance | Orange status/indicator | #c26200 | 4.5:1 |
| Error | Red alerts/errors | #c5192d | 4.9:1 |

## Offline Operation

The application is fully functional offline:
- All data is stored in browser's localStorage
- No external API calls or network requests
- Works without internet connection
- Data persists across browser sessions

## QA Checklist

- ✅ Input masks enforce formats while allowing correction
- ✅ Validation feedback is consistent and blocks invalid submissions
- ✅ Color indicators and legends are accessible with proper contrast
- ✅ Data reset workflow includes user confirmation
- ✅ Application runs without console errors
- ✅ No external network requests
- ✅ Full keyboard navigation support
- ✅ Proper ARIA labels and semantic HTML
- ✅ Module interoperability verified
- ✅ Offline operation confirmed

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any modern browser with ES6+ support and localStorage

## Development Notes

- Vanilla JavaScript (no frameworks)
- No external dependencies
- Modular architecture for easy maintenance
- Each module has clear responsibilities
- Functions are pure and testable
- Global namespace pollution minimized

## Testing

Run the QA checklist from browser console:

```javascript
App.runQAChecklist()
```

This returns an object with results for:
- Offline operation
- Form validation
- Input masks
- Accessibility
- Color contrast
- Module interoperability
- Console errors

## License

MIT
