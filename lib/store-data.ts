export interface DarazStore {
  id: string;
  name: string;
  sellerId: string;
  connectedAt: string;
  status: 'active' | 'inactive';
  connectionType: 'API' | 'CSV';
  apiKey?: string;
  apiSecret?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  storeId: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  safetyStock: number;
  status: 'Active' | 'Inactive';
  ordersCount: number;
  revenue: number;
  returnsCount: number;
  cancellationsCount: number;
  rating: number;
  lastUpdated: string;
}

export type OrderStatus = 'Pending' | 'Ready to Pack' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';

export interface Order {
  id: string;
  storeId: string;
  customerName: string;
  customerPhone: string;
  sku: string;
  productName: string;
  quantity: number;
  amount: number;
  status: OrderStatus;
  orderDate: string;
  trackingNumber?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userRole: string;
  action: string;
  storeId: string;
  sku?: string;
  details: string;
}

export type UserRole = 'Admin' | 'Manager' | 'Packing Staff' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

// Initial Mock Stores
export const INITIAL_STORES: DarazStore[] = [
  {
    id: 'store-1',
    name: 'Al-Wahab Digital',
    sellerId: 'PK_ALW_982',
    connectedAt: '2026-01-15T10:00:00Z',
    status: 'active',
    connectionType: 'API',
    apiKey: 'dz_live_83910x98124a',
    apiSecret: '••••••••••••••••••••••••'
  },
  {
    id: 'store-2',
    name: 'Super Mart Karachi',
    sellerId: 'PK_SMK_412',
    connectedAt: '2026-02-12T14:30:00Z',
    status: 'active',
    connectionType: 'CSV'
  },
  {
    id: 'store-3',
    name: 'Decent Home & Style',
    sellerId: 'PK_DHS_723',
    connectedAt: '2026-04-01T09:15:00Z',
    status: 'active',
    connectionType: 'API',
    apiKey: 'dz_live_21094b81726c',
    apiSecret: '••••••••••••••••••••••••'
  },
  {
    id: 'store-4',
    name: 'Pindi Apparel Hub',
    sellerId: 'PK_PAH_055',
    connectedAt: '2026-05-18T16:45:00Z',
    status: 'inactive',
    connectionType: 'CSV'
  }
];

// Initial Mock Products
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'AL-MOU-01',
    name: 'Wireless Optical Ergonomic Mouse (G-109)',
    category: 'Electronics',
    storeId: 'store-1',
    originalPrice: 1550,
    salePrice: 1200,
    stock: 8,
    safetyStock: 15,
    status: 'Active',
    ordersCount: 142,
    revenue: 170400,
    returnsCount: 2,
    cancellationsCount: 1,
    rating: 4.7,
    lastUpdated: '2026-06-21T18:30:00Z'
  },
  {
    id: 'prod-2',
    sku: 'AL-EAR-NEO',
    name: 'Bluetooth Noise-Cancelling Earbuds Sports Neo Pro',
    category: 'Electronics',
    storeId: 'store-1',
    originalPrice: 4200,
    salePrice: 3499,
    stock: 35,
    safetyStock: 10,
    status: 'Active',
    ordersCount: 88,
    revenue: 307912,
    returnsCount: 6,
    cancellationsCount: 4,
    rating: 4.4,
    lastUpdated: '2026-06-22T08:00:00Z'
  },
  {
    id: 'prod-3',
    sku: 'SMK-KUR-PEACH',
    name: 'Pure Cotton Printed Kurti - Peach Blossom Elegance',
    category: 'Fashion & Apparel',
    storeId: 'store-2',
    originalPrice: 2800,
    salePrice: 1999,
    stock: 3,
    safetyStock: 12,
    status: 'Active',
    ordersCount: 210,
    revenue: 419790,
    returnsCount: 15,
    cancellationsCount: 12,
    rating: 4.2,
    lastUpdated: '2026-06-20T12:15:00Z'
  },
  {
    id: 'prod-4',
    sku: 'SMK-TSH-BLACK',
    name: 'Minimalist Premium Cotton Black T-Shirt (M/L/XL)',
    category: 'Fashion & Apparel',
    storeId: 'store-2',
    originalPrice: 1400,
    salePrice: 950,
    stock: 0,
    safetyStock: 15,
    status: 'Active',
    ordersCount: 340,
    revenue: 323000,
    returnsCount: 4,
    cancellationsCount: 5,
    rating: 4.8,
    lastUpdated: '2026-06-22T05:40:00Z'
  },
  {
    id: 'prod-5',
    sku: 'DHS-BOT-750',
    name: 'Stainless Steel Thermal Water Bottle double insulated (750ml)',
    category: 'Home & Living',
    storeId: 'store-3',
    originalPrice: 1999,
    salePrice: 1450,
    stock: 65,
    safetyStock: 10,
    status: 'Active',
    ordersCount: 56,
    revenue: 81200,
    returnsCount: 1,
    cancellationsCount: 0,
    rating: 4.5,
    lastUpdated: '2026-06-19T09:30:00Z'
  },
  {
    id: 'prod-6',
    sku: 'DHS-ORG-WA',
    name: 'Multi-purpose 6-Pocket Wall Hanging Fabric Organizer',
    category: 'Home & Living',
    storeId: 'store-3',
    originalPrice: 999,
    salePrice: 799,
    stock: 4,
    safetyStock: 8,
    status: 'Active',
    ordersCount: 74,
    revenue: 59126,
    returnsCount: 4,
    cancellationsCount: 3,
    rating: 3.9,
    lastUpdated: '2026-06-21T11:20:00Z'
  },
  {
    id: 'prod-7',
    sku: 'PAH-WAL-LEA',
    name: 'Handcrafted Premium Tan Leather Wallet for Men',
    category: 'Fashion & Apparel',
    storeId: 'store-4',
    originalPrice: 3500,
    salePrice: 2490,
    stock: 12,
    safetyStock: 5,
    status: 'Inactive',
    ordersCount: 19,
    revenue: 47310,
    returnsCount: 0,
    cancellationsCount: 1,
    rating: 4.6,
    lastUpdated: '2026-05-25T15:20:00Z'
  },
  {
    id: 'prod-8',
    sku: 'AL-FAN-USB',
    name: 'Rechargeable Ultra-Quiet Portable Desktop Cooler Fan',
    category: 'Electronics',
    storeId: 'store-1',
    originalPrice: 2300,
    salePrice: 1850,
    stock: 52,
    safetyStock: 15,
    status: 'Active',
    ordersCount: 95,
    revenue: 175750,
    returnsCount: 3,
    cancellationsCount: 2,
    rating: 4.3,
    lastUpdated: '2026-06-22T08:10:00Z'
  }
];

// Initial Mock Orders
export const INITIAL_ORDERS: Order[] = [
  {
    id: '10931201',
    storeId: 'store-1',
    customerName: 'Muhammad Salman',
    customerPhone: '0300-1234567',
    sku: 'AL-MOU-01',
    productName: 'Wireless Optical Ergonomic Mouse (G-109)',
    quantity: 1,
    amount: 1200,
    status: 'Pending',
    orderDate: '2026-06-22T08:24:00Z'
  },
  {
    id: '10931202',
    storeId: 'store-1',
    customerName: 'Aisha Bibi',
    customerPhone: '0321-9876543',
    sku: 'AL-MOU-01',
    productName: 'Wireless Optical Ergonomic Mouse (G-109)',
    quantity: 2,
    amount: 2400,
    status: 'Pending',
    orderDate: '2026-06-22T07:15:00Z'
  },
  {
    id: '10931203',
    storeId: 'store-2',
    customerName: 'Bilal Khan',
    customerPhone: '0333-5432109',
    sku: 'SMK-KUR-PEACH',
    productName: 'Pure Cotton Printed Kurti - Peach Blossom Elegance',
    quantity: 1,
    amount: 1999,
    status: 'Pending',
    orderDate: '2026-06-22T06:12:00Z'
  },
  {
    id: '10931204',
    storeId: 'store-1',
    customerName: 'Zainab Fatima',
    customerPhone: '0345-1122334',
    sku: 'AL-EAR-NEO',
    productName: 'Bluetooth Noise-Cancelling Earbuds Sports Neo Pro',
    quantity: 1,
    amount: 3499,
    status: 'Ready to Pack',
    orderDate: '2026-06-21T18:45:00Z',
    trackingNumber: 'LP-391823901-PK'
  },
  {
    id: '10931205',
    storeId: 'store-3',
    customerName: 'Tariq Mehmood',
    customerPhone: '0312-8877665',
    sku: 'DHS-BOT-750',
    productName: 'Stainless Steel Thermal Water Bottle double insulated (750ml)',
    quantity: 1,
    amount: 1450,
    status: 'Shipped',
    orderDate: '2026-06-21T11:00:00Z',
    trackingNumber: 'LP-882103491-PK'
  },
  {
    id: '10931206',
    storeId: 'store-2',
    customerName: 'Sarah Malik',
    customerPhone: '0301-4433221',
    sku: 'SMK-TSH-BLACK',
    productName: 'Minimalist Premium Cotton Black T-Shirt (M/L/XL)',
    quantity: 2,
    amount: 1900,
    status: 'Delivered',
    orderDate: '2026-06-19T14:30:00Z',
    trackingNumber: 'LP-918231024-PK'
  },
  {
    id: '10931207',
    storeId: 'store-3',
    customerName: 'Osman Butt',
    customerPhone: '0331-5544332',
    sku: 'DHS-ORG-WA',
    productName: 'Multi-purpose 6-Pocket Wall Hanging Fabric Organizer',
    quantity: 1,
    amount: 799,
    status: 'Returned',
    orderDate: '2026-06-17T09:10:00Z',
    trackingNumber: 'LP-119283401-PK'
  },
  {
    id: '10931208',
    storeId: 'store-2',
    customerName: 'Ali Raza',
    customerPhone: '0322-9900112',
    sku: 'SMK-TSH-BLACK',
    productName: 'Minimalist Premium Cotton Black T-Shirt (M/L/XL)',
    quantity: 1,
    amount: 950,
    status: 'Cancelled',
    orderDate: '2026-06-20T16:00:00Z'
  },
  {
    id: '10931209',
    storeId: 'store-1',
    customerName: 'Nimra Sheikh',
    customerPhone: '0304-4411223',
    sku: 'AL-FAN-USB',
    productName: 'Rechargeable Ultra-Quiet Portable Desktop Cooler Fan',
    quantity: 1,
    amount: 1850,
    status: 'Ready to Pack',
    orderDate: '2026-06-21T21:00:00Z',
    trackingNumber: 'LP-412213904-PK'
  }
];

// Initial Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-06-22T08:15:00Z',
    userId: 'user-admin',
    userRole: 'Admin',
    action: 'Price Update',
    storeId: 'store-1',
    sku: 'AL-MOU-01',
    details: 'Changed Sale Price from Rs. 1250 to Rs. 1200 via Central Console (Manual)'
  },
  {
    id: 'log-2',
    timestamp: '2026-06-22T05:40:00Z',
    userId: 'user-manager',
    userRole: 'Manager',
    action: 'Stock Replenishment',
    storeId: 'store-2',
    sku: 'SMK-TSH-BLACK',
    details: 'Triggered out of stock threshold warning. Added +50 stock via CSV Bulk Import.'
  },
  {
    id: 'log-3',
    timestamp: '2026-06-21T15:20:00Z',
    userId: 'user-staff',
    userRole: 'Packing Staff',
    action: 'Order Packing',
    storeId: 'store-2',
    sku: 'SMK-KUR-PEACH',
    details: 'Moved Order #10931203 to "Ready to Pack" state'
  },
  {
    id: 'log-4',
    timestamp: '2026-06-20T11:00:00Z',
    userId: 'user-admin',
    userRole: 'Admin',
    action: 'Connect Store',
    storeId: 'store-3',
    details: 'Connected "Decent Home & Style" via Secure API Sandbox'
  }
];

// Pre-configured list of mock users to simulate roles
export const MOCK_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Mudassir Bashir',
    email: 'mudassirbashir530@gmail.com',
    role: 'Admin',
    avatarUrl: 'https://picsum.photos/seed/mudassir/150'
  },
  {
    id: 'usr-2',
    name: 'Zia Ahmed',
    email: 'zia.ahmed@sellerdesk.pk',
    role: 'Manager',
    avatarUrl: 'https://picsum.photos/seed/zia/150'
  },
  {
    id: 'usr-3',
    name: 'Haris Qureshi',
    email: 'haris.staff@sellerdesk.pk',
    role: 'Packing Staff',
    avatarUrl: 'https://picsum.photos/seed/haris/150'
  },
  {
    id: 'usr-4',
    name: 'Guest Assessor',
    email: 'guest@daraz.com',
    role: 'Viewer',
    avatarUrl: 'https://picsum.photos/seed/guest/150'
  }
];
