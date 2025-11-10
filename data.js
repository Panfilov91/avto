const ordersData = [
    {
        id: 'ORD-2024-001',
        date: '2024-01-15',
        client: {
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '+1 555-0101',
            address: '123 Main Street, Springfield, IL 62701'
        },
        vehicle: {
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            licensePlate: 'ABC-1234',
            vin: '1HGBH41JXMN109186'
        },
        status: 'completed',
        services: [
            { name: 'Oil Change', description: 'Full synthetic oil change', quantity: 1, unitPrice: 75.00 },
            { name: 'Tire Rotation', description: 'Four-wheel rotation and balancing', quantity: 1, unitPrice: 45.00 },
            { name: 'Brake Inspection', description: 'Complete brake system check', quantity: 1, unitPrice: 30.00 }
        ],
        parts: [
            { name: 'Oil Filter', partNumber: 'OF-2020-TC', quantity: 1, unitPrice: 12.50 },
            { name: 'Engine Oil 5W-30', partNumber: 'EO-5W30-5L', quantity: 5, unitPrice: 8.00 }
        ],
        discount: 10.00,
        discountType: 'fixed',
        vatRate: 21,
        notes: 'Customer requested premium oil. Next service due in 6 months.'
    },
    {
        id: 'ORD-2024-002',
        date: '2024-01-18',
        client: {
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            phone: '+1 555-0102',
            address: '456 Oak Avenue, Springfield, IL 62702'
        },
        vehicle: {
            make: 'Honda',
            model: 'Civic',
            year: 2019,
            licensePlate: 'XYZ-5678',
            vin: '2HGFC2F59KH542318'
        },
        status: 'completed',
        services: [
            { name: 'Air Conditioning Service', description: 'AC refrigerant recharge and system check', quantity: 1, unitPrice: 120.00 },
            { name: 'Cabin Filter Replacement', description: 'Replace air cabin filter', quantity: 1, unitPrice: 25.00 }
        ],
        parts: [
            { name: 'AC Refrigerant R134a', partNumber: 'AC-R134A-1KG', quantity: 1, unitPrice: 45.00 },
            { name: 'Cabin Air Filter', partNumber: 'CAF-HC-2019', quantity: 1, unitPrice: 18.00 }
        ],
        discount: 5,
        discountType: 'percentage',
        vatRate: 21,
        notes: 'AC working properly after service. Customer satisfied.'
    },
    {
        id: 'ORD-2024-003',
        date: '2024-01-22',
        client: {
            name: 'Michael Brown',
            email: 'mbrown@example.com',
            phone: '+1 555-0103',
            address: '789 Pine Street, Springfield, IL 62703'
        },
        vehicle: {
            make: 'Ford',
            model: 'F-150',
            year: 2021,
            licensePlate: 'DEF-9012',
            vin: '1FTFW1E85MFA12345'
        },
        status: 'pending',
        services: [
            { name: 'Transmission Service', description: 'Automatic transmission fluid change', quantity: 1, unitPrice: 180.00 },
            { name: 'Differential Service', description: 'Rear differential fluid change', quantity: 1, unitPrice: 95.00 },
            { name: 'Four-Wheel Alignment', description: 'Complete alignment service', quantity: 1, unitPrice: 110.00 }
        ],
        parts: [
            { name: 'ATF Transmission Fluid', partNumber: 'ATF-FORD-4L', quantity: 12, unitPrice: 9.50 },
            { name: 'Differential Fluid', partNumber: 'DF-FORD-2L', quantity: 3, unitPrice: 14.00 }
        ],
        discount: 15,
        discountType: 'percentage',
        vatRate: 21,
        notes: 'Waiting for customer approval. Vehicle currently in bay 3.'
    },
    {
        id: 'ORD-2024-004',
        date: '2024-01-25',
        client: {
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            phone: '+1 555-0104',
            address: '321 Elm Drive, Springfield, IL 62704'
        },
        vehicle: {
            make: 'BMW',
            model: 'X5',
            year: 2022,
            licensePlate: 'GHI-3456',
            vin: '5UXCR6C09M9L23456'
        },
        status: 'completed',
        services: [
            { name: 'Major Service', description: 'Complete major service package', quantity: 1, unitPrice: 450.00 },
            { name: 'Brake Pad Replacement', description: 'Front and rear brake pads', quantity: 1, unitPrice: 280.00 }
        ],
        parts: [
            { name: 'BMW Oil Filter', partNumber: 'OF-BMW-X5-22', quantity: 1, unitPrice: 22.00 },
            { name: 'Engine Oil 0W-40', partNumber: 'EO-0W40-7L', quantity: 7, unitPrice: 12.00 },
            { name: 'Air Filter', partNumber: 'AF-BMW-X5', quantity: 1, unitPrice: 35.00 },
            { name: 'Brake Pad Set Front', partNumber: 'BP-BMW-F', quantity: 1, unitPrice: 120.00 },
            { name: 'Brake Pad Set Rear', partNumber: 'BP-BMW-R', quantity: 1, unitPrice: 95.00 }
        ],
        discount: 50.00,
        discountType: 'fixed',
        vatRate: 21,
        notes: 'Premium customer. Applied loyalty discount. Next service in 12 months.'
    },
    {
        id: 'ORD-2024-005',
        date: '2024-01-28',
        client: {
            name: 'David Wilson',
            email: 'dwilson@example.com',
            phone: '+1 555-0105',
            address: '654 Maple Lane, Springfield, IL 62705'
        },
        vehicle: {
            make: 'Tesla',
            model: 'Model 3',
            year: 2023,
            licensePlate: 'JKL-7890',
            vin: '5YJ3E1EA1KF123456'
        },
        status: 'cancelled',
        services: [
            { name: 'Tire Replacement', description: 'Four new all-season tires', quantity: 4, unitPrice: 180.00 },
            { name: 'Wheel Alignment', description: 'Four-wheel alignment', quantity: 1, unitPrice: 95.00 }
        ],
        parts: [
            { name: 'All-Season Tire 235/45R18', partNumber: 'TIRE-AS-235-45-18', quantity: 4, unitPrice: 160.00 }
        ],
        discount: 0,
        discountType: 'fixed',
        vatRate: 21,
        notes: 'Order cancelled by customer. Found better price elsewhere.'
    },
    {
        id: 'ORD-2024-006',
        date: '2024-02-02',
        client: {
            name: 'Lisa Anderson',
            email: 'lisa.anderson@example.com',
            phone: '+1 555-0106',
            address: '987 Cedar Court, Springfield, IL 62706'
        },
        vehicle: {
            make: 'Mercedes-Benz',
            model: 'C-Class',
            year: 2021,
            licensePlate: 'MNO-2468',
            vin: 'WDDWF8EB1MR234567'
        },
        status: 'pending',
        services: [
            { name: 'Annual Inspection', description: 'State-required safety inspection', quantity: 1, unitPrice: 50.00 },
            { name: 'Windshield Wiper Replacement', description: 'Front wiper blades', quantity: 1, unitPrice: 35.00 }
        ],
        parts: [
            { name: 'Wiper Blade Set', partNumber: 'WB-MB-C-21', quantity: 1, unitPrice: 28.00 }
        ],
        discount: 0,
        discountType: 'fixed',
        vatRate: 21,
        notes: 'Scheduled for inspection. Customer will wait.'
    },
    {
        id: 'ORD-2024-007',
        date: '2024-02-05',
        client: {
            name: 'Robert Martinez',
            email: 'r.martinez@example.com',
            phone: '+1 555-0107',
            address: '147 Birch Road, Springfield, IL 62707'
        },
        vehicle: {
            make: 'Volkswagen',
            model: 'Golf',
            year: 2020,
            licensePlate: 'PQR-1357',
            vin: '3VW2B7AJ3LM123456'
        },
        status: 'completed',
        services: [
            { name: 'Battery Replacement', description: 'New 12V battery installation', quantity: 1, unitPrice: 45.00 },
            { name: 'Battery Test', description: 'Electrical system diagnostic', quantity: 1, unitPrice: 25.00 }
        ],
        parts: [
            { name: 'Car Battery 12V 70Ah', partNumber: 'BAT-12V-70AH', quantity: 1, unitPrice: 135.00 }
        ],
        discount: 10,
        discountType: 'percentage',
        vatRate: 21,
        notes: 'Old battery completely dead. New battery installed and tested successfully.'
    },
    {
        id: 'ORD-2024-008',
        date: '2024-02-08',
        client: {
            name: 'Jennifer Taylor',
            email: 'jtaylor@example.com',
            phone: '+1 555-0108',
            address: '258 Willow Way, Springfield, IL 62708'
        },
        vehicle: {
            make: 'Audi',
            model: 'A4',
            year: 2022,
            licensePlate: 'STU-9753',
            vin: 'WAUENAF49MN123456'
        },
        status: 'completed',
        services: [
            { name: 'Coolant System Flush', description: 'Complete coolant system service', quantity: 1, unitPrice: 125.00 },
            { name: 'Thermostat Replacement', description: 'Engine thermostat replacement', quantity: 1, unitPrice: 85.00 }
        ],
        parts: [
            { name: 'Coolant Antifreeze', partNumber: 'CL-G12-5L', quantity: 10, unitPrice: 8.50 },
            { name: 'Thermostat', partNumber: 'THERM-AUDI-A4', quantity: 1, unitPrice: 42.00 }
        ],
        discount: 20.00,
        discountType: 'fixed',
        vatRate: 21,
        notes: 'Thermostat was faulty causing overheating. System now working perfectly.'
    }
];
