# Lift Scheduling Calendar

A web-based calendar application for managing lift scheduling and workload visualization.

## Features

- **Week-View Calendar**: Display 7-day week with multiple lifts and time slots (8 AM - 6 PM)
- **Assignment Workflow**: 
  - Click on time slots to assign orders via modal
  - Drag-drop orders to reschedule
  - Right-click on orders to change status or remove
- **Status Color Coding**:
  - Green: Free slots
  - Blue: Reserved orders
  - Orange: In-progress orders
  - Red: Overdue orders
- **Navigation**: 
  - Previous/Next week buttons
  - Lift filtering
- **Conflict Detection**: Prevents double bookings with user feedback
- **Order Details**: Hover tooltips show detailed order information
- **Responsive Design**: Works on desktop and mobile devices

## Structure

```
├── index.html          # Main HTML entry point
├── js/
│   ├── data.js        # Data management and storage
│   ├── calendar.js    # Calendar logic and rendering
│   └── app.js         # UI interactions and event handling
├── styles/
│   └── calendar.css   # Styling and layout
└── README.md          # This file
```

## Usage

1. Open `index.html` in a web browser
2. The calendar displays the current week with seeded lifts and orders
3. Click on any time slot to assign an unassigned order
4. Drag order badges to reschedule them
5. Right-click on order badges to change status or remove assignments
6. Use "Previous" and "Next" buttons to navigate weeks
7. Use the "Filter by Lift" dropdown to view specific lifts

## Data

- **Lifts**: 4 seeded lifts (A, B, C, D) with different capacities
- **Orders**: 6 seeded orders with customer information and weights
- **Storage**: Data is persisted in sessionStorage during the session

## Technical Details

- **Framework**: Vanilla JavaScript (no external dependencies)
- **Storage**: SessionStorage for data persistence
- **Semantics**: Semantic HTML with proper accessibility attributes
- **Styling**: CSS with CSS variables for theming

## Keyboard Shortcuts

- `ESC`: Close modal, hide tooltips, and hide alerts

## Accessibility

- All interactive elements have proper ARIA labels
- Keyboard navigation support
- Color-blind friendly status indicators with additional visual cues
