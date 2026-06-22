'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  Boxes,
  FileSpreadsheet,
  TrendingUp,
  ClipboardList,
  Sliders,
  Settings,
  ShieldAlert,
  Users,
  Bell,
  UploadCloud,
  Download,
  Search,
  Filter,
  Plus,
  Check,
  Trash2,
  AlertTriangle,
  Eye,
  RefreshCw,
  X,
  Lock,
  Printer,
  ChevronRight,
  Package,
  CheckSquare,
  Square,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import Image from 'next/image';

import {
  INITIAL_STORES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
  MOCK_USERS,
  DarazStore,
  Product,
  Order,
  AuditLog,
  UserRole,
  OrderStatus
} from '@/lib/store-data';

// Static purity helpers declared at module scope to pass react-hooks/purity filters
const generateTimestampId = (prefix: string) => `${prefix}-${Date.now()}`;
const generateTimestampIso = () => new Date().toISOString();
const generateTrackingId = () => `LP-${Math.floor(100000000 + Math.random() * 900000000)}-PK`;

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);

  // Core Persistent State
  const [stores, setStores] = useState<DarazStore[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('sd_stores');
      return cached ? JSON.parse(cached) : INITIAL_STORES;
    }
    return INITIAL_STORES;
  });
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('sd_products');
      return cached ? JSON.parse(cached) : INITIAL_PRODUCTS;
    }
    return INITIAL_PRODUCTS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('sd_orders');
      return cached ? JSON.parse(cached) : INITIAL_ORDERS;
    }
    return INITIAL_ORDERS;
  });
  const [logs, setLogs] = useState<AuditLog[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('sd_logs');
      return cached ? JSON.parse(cached) : INITIAL_AUDIT_LOGS;
    }
    return INITIAL_AUDIT_LOGS;
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('sd_role');
      return (cached ? JSON.parse(cached) : 'Admin') as UserRole;
    }
    return 'Admin';
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Interactive Component Control States
  const [activeAlerts, setActiveAlerts] = useState<string[]>([
    'Low stock alert: Wireless Mouse (G-109) has only 8 items remaining.',
    'Urgent: SMK-TSH-BLACK is completely out of stock!',
    'Fulfillment Target: Today we have 3 pending orders dispatchers limit.'
  ]);

  // Sidebar compact toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [storeFilter, setStoreFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'low', 'out'
  const [statusFilterByOrder, setStatusFilterByOrder] = useState<string>('all');
  const [perfFilter, setPerfFilter] = useState<string>('all'); // 'all', 'high', 'slow', 'returns'

  // Single Product Fast Editor
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Bulk pricing helper states
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bulkPriceMethod, setBulkPriceMethod] = useState<'fixed' | 'percent_inc' | 'percent_dec'>('percent_inc');
  const [bulkPriceValue, setBulkPriceValue] = useState<string>('');
  const [bulkStockValue, setBulkStockValue] = useState<string>('');

  // CSV Simulator Workspace States
  const [csvPreviewRows, setCsvPreviewRows] = useState<any[]>([]);
  const [csvSelectedStoreId, setCsvSelectedStoreId] = useState<string>('store-1');
  const [csvUploadRawText, setCsvUploadRawText] = useState<string>('');
  const [csvUploadError, setCsvUploadError] = useState<string>('');
  const [csvUploadSuccess, setCsvUploadSuccess] = useState<boolean>(false);

  // Order Details Modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAirwayBill, setShowAirwayBill] = useState<boolean>(false);

  // Connection management State
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreSellerId, setNewStoreSellerId] = useState('');
  const [newStoreConnectionType, setNewStoreConnectionType] = useState<'API' | 'CSV'>('API');
  const [newStoreApiKey, setNewStoreApiKey] = useState('');

  // Daily task checklist
  const [checklist, setChecklist] = useState([
    { id: 'chk-1', text: 'Pack 3 pending orders in Al-Wahab Digital', completed: false, tab: 'orders' },
    { id: 'chk-2', text: 'Update SMK-TSH-BLACK stock level (Out of stock)', completed: false, tab: 'products' },
    { id: 'chk-3', text: 'Restock G-109 Mouse (8 items left, safety triggers at 15)', completed: false, tab: 'products' },
    { id: 'chk-4', text: 'Compare Store prices before Daraz Tech Expo Campaign', completed: true, tab: 'bulk' },
    { id: 'chk-5', text: 'Review return orders for Decent Home Fab Organizer', completed: false, tab: 'orders' }
  ]);

  // Loaded state sync
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save changes
  const saveStateToStorage = (updatedStores: DarazStore[], updatedProducts: Product[], updatedOrders: Order[], updatedLogs: AuditLog[]) => {
    localStorage.setItem('sd_stores', JSON.stringify(updatedStores));
    localStorage.setItem('sd_products', JSON.stringify(updatedProducts));
    localStorage.setItem('sd_orders', JSON.stringify(updatedOrders));
    localStorage.setItem('sd_logs', JSON.stringify(updatedLogs));
  };

  const updateStoresState = (newStores: DarazStore[]) => {
    setStores(newStores);
    saveStateToStorage(newStores, products, orders, logs);
  };

  const updateProductsState = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveStateToStorage(stores, newProducts, orders, logs);
  };

  const updateOrdersState = (newOrders: Order[]) => {
    setOrders(newOrders);
    saveStateToStorage(stores, products, newOrders, logs);
  };

  const logActivity = (action: string, storeId: string, details: string, sku?: string) => {
    const newLog: AuditLog = {
      id: generateTimestampId('log'),
      timestamp: generateTimestampIso(),
      userId: currentRole === 'Admin' ? 'user-admin' : currentRole === 'Manager' ? 'user-manager' : 'user-staff',
      userRole: currentRole,
      action,
      storeId,
      sku,
      details
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    saveStateToStorage(stores, products, orders, updated);
  };

  // Switch Role
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('sd_role', JSON.stringify(role));
  };

  // Helper check for permissions
  const hasAccess = (requiredRoles: UserRole[]): boolean => {
    return requiredRoles.includes(currentRole);
  };

  // Derived metrics
  const stats = useMemo(() => {
    const todayOrdersCount = orders.filter(o => o.orderDate.startsWith('2026-06-22') || o.status === 'Pending').length;
    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    const packedCount = orders.filter(o => o.status === 'Ready to Pack').length;
    const shippedCount = orders.filter(o => o.status === 'Shipped').length;
    const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;
    const returnedCount = orders.filter(o => o.status === 'Returned').length;

    // Revenue calculation
    let totalRevenue = 0;
    products.forEach(p => {
      totalRevenue += p.revenue;
    });

    // Today dynamic sales approximation
    const todaySales = orders
      .filter(o => o.status !== 'Cancelled' && (o.orderDate.startsWith('2026-06-22') || o.status === 'Pending'))
      .reduce((acc, current) => acc + current.amount, 0);

    const lowStockCount = products.filter(p => p.stock <= p.safetyStock).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

    return {
      todayOrders: todayOrdersCount,
      pending: pendingCount,
      readyToPack: packedCount,
      shipped: shippedCount,
      cancelled: cancelledCount,
      returned: returnedCount,
      totalSalesEstimate: totalRevenue,
      todayRevenue: todaySales,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount
    };
  }, [orders, products]);

  // Product helper name mappings
  const getStoreName = (id: string) => {
    const s = stores.find(st => st.id === id);
    return s ? s.name : 'Unknown Store';
  };

  // Tab Selection
  const selectTab = (tab: string) => {
    setActiveTab(tab);
  };

  // Quick Action: Auto-Pack Checklist Orders
  const resolveChecklistTask = (chkId: string, actionType: string) => {
    if (!hasAccess(['Admin', 'Manager', 'Packing Staff'])) {
      alert('Access Denied: You do not have permissions to perform tasks.');
      return;
    }

    setChecklist(prev => prev.map(c => c.id === chkId ? { ...c, completed: true } : c));

    if (actionType === 'pack-all') {
      const pendingOrders = orders.filter(o => o.status === 'Pending');
      if (pendingOrders.length === 0) return;
      
      const updated = orders.map(o => o.status === 'Pending' ? { ...o, status: 'Ready to Pack' as OrderStatus, trackingNumber: `LP-${Math.floor(100000000 + Math.random() * 900000000)}-PK` } : o);
      updateOrdersState(updated);
      logActivity('Order Fulfillment', 'store-1', `Auto-packed all (${pendingOrders.length}) pending orders via daily checklist optimizer.`);
    } else if (actionType === 'restock-black') {
      const updated = products.map(p => p.sku === 'SMK-TSH-BLACK' ? { ...p, stock: 45, lastUpdated: new Date().toISOString() } : p);
      updateProductsState(updated);
      logActivity('Inventory Restock', 'store-2', 'Refilled SMK-TSH-BLACK T-Shirt stock to 45 from Daily Tasks list.', 'SMK-TSH-BLACK');
    }
  };

  // Toggle Single Checklist item manually
  const toggleChecklistManual = (id: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  // Reset Mock Data to clear alterations
  const resetAllData = () => {
    if (confirm('Are you sure you want to restore the platform to the pristine original template metrics?')) {
      localStorage.removeItem('sd_stores');
      localStorage.removeItem('sd_products');
      localStorage.removeItem('sd_orders');
      localStorage.removeItem('sd_logs');
      setStores(INITIAL_STORES);
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
      setLogs(INITIAL_AUDIT_LOGS);
      alert('System reset successfully. Enjoy the fresh sandbox!');
    }
  };

  // SINGLE product inline edits
  const handleSaveInlineProduct = (sku: string, updatedPrice: number, updatedStock: number) => {
    if (!hasAccess(['Admin', 'Manager'])) {
      alert('Permission Denied. Only Admins and Managers can edit prices or inventories.');
      return;
    }

    if (updatedPrice < 0 || updatedStock < 0) {
      alert('Values must be non-negative!');
      return;
    }

    const matchedProd = products.find(p => p.sku === sku);
    if (!matchedProd) return;

    const oldPrice = matchedProd.salePrice;
    const oldStock = matchedProd.stock;

    const updated = products.map(p => {
      if (p.sku === sku) {
        return {
          ...p,
          salePrice: updatedPrice,
          stock: updatedStock,
          lastUpdated: new Date().toISOString()
        };
      }
      return p;
    });

    updateProductsState(updated);
    logActivity(
      'Product Edit',
      matchedProd.storeId,
      `Updated inline properties. Price: Rs.${oldPrice} → Rs.${updatedPrice}. Stock: ${oldStock} → ${updatedStock}.`,
      sku
    );
    setEditingProduct(null);
  };

  // Order state pipeline updater
  const advanceOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    if (nextStatus === 'Ready to Pack' && !hasAccess(['Admin', 'Manager', 'Packing Staff'])) {
      alert('Unauthorized! Standard staff handles pack sequences.');
      return;
    }
    if ((nextStatus === 'Shipped' || nextStatus === 'Delivered' || nextStatus === 'Cancelled') && !hasAccess(['Admin', 'Manager'])) {
      alert('Unauthorized! Require Manager or Admin privileges to ship, deliver, or cancel.');
      return;
    }

    const matchedOrder = orders.find(o => o.id === orderId);
    if (!matchedOrder) return;

    // Deduct stock if package is moving to Packed or Shipped, if not done yet
    let matchedProd = products.find(p => p.sku === matchedOrder.sku);
    let updatedProds = [...products];
    
    if (nextStatus === 'Ready to Pack' && matchedOrder.status === 'Pending') {
      if (matchedProd) {
        const targetStock = Math.max(0, matchedProd.stock - matchedOrder.quantity);
        updatedProds = products.map(p => p.sku === matchedOrder.sku ? {
          ...p,
          stock: targetStock,
          ordersCount: p.ordersCount + matchedOrder.quantity,
          revenue: p.revenue + matchedOrder.amount,
          lastUpdated: new Date().toISOString()
        } : p);
      }
    } else if (nextStatus === 'Cancelled' && (matchedOrder.status === 'Ready to Pack' || matchedOrder.status === 'Shipped')) {
      // Return stock back if cancelled post stock reduction
      if (matchedProd) {
        updatedProds = products.map(p => p.sku === matchedOrder.sku ? {
          ...p,
          stock: p.stock + matchedOrder.quantity,
          lastUpdated: new Date().toISOString()
        } : p);
      }
    }

    const tracking = matchedOrder.trackingNumber || generateTrackingId();

    const updatedOrds = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: nextStatus,
          trackingNumber: nextStatus !== 'Pending' ? tracking : undefined
        };
      }
      return o;
    });

    updateProductsState(updatedProds);
    updateOrdersState(updatedOrds);
    logActivity(
      'Order Status Update',
      matchedOrder.storeId,
      `Upgraded order ID #${orderId} from "${matchedOrder.status}" to "${nextStatus}".`,
      matchedOrder.sku
    );

    // Refresh selected modal reference if open
    setSelectedOrder(prev => prev && prev.id === orderId ? { ...prev, status: nextStatus, trackingNumber: tracking } : prev);
  };

  // Bulk operation executor
  const handleApplyBulkOperations = () => {
    if (!hasAccess(['Admin', 'Manager'])) {
      alert('Access Denied: Only Admins or Managers can execute batch bulk operations.');
      return;
    }

    if (selectedProductIds.length === 0) {
      alert('Please check/select at least one SKU to run a bulk batch!');
      return;
    }

    let pVal = parseFloat(bulkPriceValue);
    let sVal = parseInt(bulkStockValue);

    if (isNaN(pVal) && !bulkStockValue) {
      alert('Please enter a modification formula (Price adjustment or Stock override).');
      return;
    }

    const updated = products.map(p => {
      if (selectedProductIds.includes(p.id)) {
        let updatedPrice = p.salePrice;
        let updatedStock = p.stock;

        if (!isNaN(pVal)) {
          if (bulkPriceMethod === 'fixed') {
            updatedPrice = pVal;
          } else if (bulkPriceMethod === 'percent_inc') {
            updatedPrice = Math.round(p.salePrice * (1 + pVal / 100));
          } else if (bulkPriceMethod === 'percent_dec') {
            updatedPrice = Math.round(p.salePrice * (1 - pVal / 100));
          }
        }

        if (bulkStockValue && !isNaN(sVal)) {
          updatedStock = sVal;
        }

        if (updatedPrice < 0) updatedPrice = 0;
        if (updatedStock < 0) updatedStock = 0;

        return {
          ...p,
          salePrice: updatedPrice,
          stock: updatedStock,
          lastUpdated: new Date().toISOString()
        };
      }
      return p;
    });

    updateProductsState(updated);
    logActivity(
      'Bulk Update Batch',
      'multi-store',
      `Modified ${selectedProductIds.length} checked SKU items. Pricing rule: ${bulkPriceMethod} Rs.${bulkPriceValue || 'N/A'}. Stock setter: ${bulkStockValue || 'N/A'}.`
    );

    alert(`Successfully completed bulk updates on ${selectedProductIds.length} target products!`);
    setSelectedProductIds([]);
    setBulkPriceValue('');
    setBulkStockValue('');
  };

  // Store Connection Form submission
  const handleConnectStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAccess(['Admin'])) {
      alert('Unauthorized! Only the primary Owner (Admin role) can register secondary Daraz storefront endpoints.');
      return;
    }

    if (!newStoreName || !newStoreSellerId) {
      alert('Please specify Store Name and Daraz Seller ID hash.');
      return;
    }

    const duplicateCheck = stores.find(s => s.sellerId === newStoreSellerId);
    if (duplicateCheck) {
      alert('This Seller ID is already registered in SellerDesk!');
      return;
    }

    const nStore: DarazStore = {
      id: generateTimestampId('store'),
      name: newStoreName,
      sellerId: newStoreSellerId,
      connectedAt: generateTimestampIso(),
      status: 'active',
      connectionType: newStoreConnectionType,
      apiKey: newStoreConnectionType === 'API' ? newStoreApiKey || 'dz_sandbox_key_active' : undefined,
      apiSecret: newStoreConnectionType === 'API' ? '••••••••••••••••••••••••' : undefined
    };

    const updated = [...stores, nStore];
    updateStoresState(updated);
    logActivity(
      'Store Registered',
      nStore.id,
      `Permanently established a ${newStoreConnectionType} connection to Daraz Seller Center as ID: ${newStoreSellerId}`
    );

    alert(`Successfully registered "${newStoreName}" as a Connected Storefront!`);
    setNewStoreName('');
    setNewStoreSellerId('');
    setNewStoreApiKey('');
  };

  // Toggle store status
  const toggleStoreStatus = (id: string) => {
    if (!hasAccess(['Admin'])) {
      alert('Admin rights required to toggle store integration statuses.');
      return;
    }

    const updatedStatus = stores.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'active' ? 'inactive' : 'active';
        logActivity('Store Status Change', id, `Flipped storefront active toggle. Now: ${nextStatus.toUpperCase()}`);
        return { ...s, status: nextStatus as 'active' | 'inactive' };
      }
      return s;
    });
    updateStoresState(updatedStatus);
  };

  // Bulk Selector logic
  const handleToggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleSelectPageProducts = (visibleProducts: Product[]) => {
    const visibleIds = visibleProducts.map(vp => vp.id);
    const allSelected = visibleIds.every(id => selectedProductIds.includes(id));
    
    if (allSelected) {
      setSelectedProductIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedProductIds(prev => {
        const combined = [...prev, ...visibleIds];
        return Array.from(new Set(combined));
      });
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Search text
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      // 2. Store filter
      const matchesStore = storeFilter === 'all' || p.storeId === storeFilter;
      // 3. Category filter
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      // 4. Stock alert filters
      let matchesStock = true;
      if (stockFilter === 'low') {
        matchesStock = p.stock <= p.safetyStock;
      } else if (stockFilter === 'out') {
        matchesStock = p.stock === 0;
      }
      // 5. Performance / Alert metrics
      let matchesPerf = true;
      if (perfFilter === 'high') {
        matchesPerf = p.ordersCount >= 100;
      } else if (perfFilter === 'slow') {
        matchesPerf = p.ordersCount < 30;
      } else if (perfFilter === 'returns') {
        matchesPerf = p.returnsCount >= 5;
      }

      return matchesSearch && matchesStore && matchesCategory && matchesStock && matchesPerf;
    });
  }, [products, searchTerm, storeFilter, categoryFilter, stockFilter, perfFilter]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.id.includes(searchTerm) || o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || o.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStore = storeFilter === 'all' || o.storeId === storeFilter;
      const matchesStatus = statusFilterByOrder === 'all' || o.status === statusFilterByOrder;
      return matchesSearch && matchesStore && matchesStatus;
    });
  }, [orders, searchTerm, storeFilter, statusFilterByOrder]);

  // Actual CSV Generator / Exporter
  const handleTriggerCSVDownload = (storeId: string) => {
    const storeProducts = products.filter(p => p.storeId === storeId);
    if (storeProducts.length === 0) {
      alert('No products found for the selected store to write a CSV!');
      return;
    }

    const headers = ['StoreName', 'SKU', 'Product Name', 'Current Sale Price', 'New Price', 'Current Stock', 'New Stock', 'Status'];
    const rows = storeProducts.map(p => [
      getStoreName(p.storeId),
      p.sku,
      p.name,
      p.salePrice,
      p.salePrice, // default new price to current
      p.stock,
      p.stock, // default new stock to current
      p.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SellerDesk_DarazBulk_${getStoreName(storeId).replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logActivity('CSV Export', storeId, `Generated and exported pristine bulk CSV inventory list for ${getStoreName(storeId)}.`);
  };

  // Real-time client-side CSV Parser
  const handleParseSimulatedCSV = (e: React.FormEvent) => {
    e.preventDefault();
    setCsvUploadError('');
    setCsvUploadSuccess(false);

    if (!hasAccess(['Admin', 'Manager'])) {
      alert('Access Denied: Only Admin or Managers can apply parsed CSV datasets.');
      return;
    }

    if (!csvUploadRawText.trim()) {
      setCsvUploadError('Draft script is empty. Paste template elements or load a simulated copy.');
      return;
    }

    const lines = csvUploadRawText.trim().split('\n');
    if (lines.length < 2) {
      setCsvUploadError('Invalid file structure. Requires at least headers and a single target value.');
      return;
    }

    // Match CSV header indexes
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const skuIdx = headers.indexOf('SKU');
    const newPriceIdx = headers.indexOf('New Price');
    const newStockIdx = headers.indexOf('New Stock');

    if (skuIdx === -1 || newPriceIdx === -1 || newStockIdx === -1) {
      setCsvUploadError('Structural Mismatch: Header must contain "SKU", "New Price", and "New Stock" columns.');
      return;
    }

    interface ParsedRow {
      sku: string;
      newPrice: number;
      newStock: number;
      originalProduct?: Product;
      isValid: boolean;
      errorMsg?: string;
    }

    const parsedResults: ParsedRow[] = [];
    let updatedProds = [...products];
    let changesMade = 0;

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      // Basic comma split (handling possible escaped strings)
      // For standard preview, split on comma since the template generation matches
      const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < headers.length) continue;

      const rawSku = cols[skuIdx];
      const rawPrice = cols[newPriceIdx];
      const rawStock = cols[newStockIdx];

      const sku = rawSku;
      const price = parseFloat(rawPrice);
      const stock = parseInt(rawStock);

      const prod = products.find(p => p.sku === sku);

      if (!prod) {
        parsedResults.push({
          sku,
          newPrice: price,
          newStock: stock,
          isValid: false,
          errorMsg: `SKU "${sku}" does not exist in our matching database`
        });
        continue;
      }

      if (prod.storeId !== csvSelectedStoreId) {
        parsedResults.push({
          sku,
          newPrice: price,
          newStock: stock,
          isValid: false,
          errorMsg: `SKU belongs to "${getStoreName(prod.storeId)}" but uploaded for filter "${getStoreName(csvSelectedStoreId)}"`
        });
        continue;
      }

      if (isNaN(price) || price < 0) {
        parsedResults.push({
          sku,
          newPrice: price,
          newStock: stock,
          isValid: false,
          errorMsg: `Invalid pricing format: "${rawPrice}"`
        });
        continue;
      }

      if (isNaN(stock) || stock < 0) {
        parsedResults.push({
          sku,
          newPrice: price,
          newStock: stock,
          isValid: false,
          errorMsg: `Invalid stock inventory: "${rawStock}"`
        });
        continue;
      }

      // Valid item row
      parsedResults.push({
        sku,
        newPrice: price,
        newStock: stock,
        originalProduct: prod,
        isValid: true
      });

      // Update in memory array
      updatedProds = updatedProds.map(p => p.sku === sku ? {
        ...p,
        salePrice: price,
        stock: stock,
        lastUpdated: new Date().toISOString()
      } : p);
      changesMade++;
    }

    setCsvPreviewRows(parsedResults);

    if (changesMade > 0) {
      updateProductsState(updatedProds);
      setCsvUploadSuccess(true);
      logActivity(
        'CSV Import Update',
        csvSelectedStoreId,
        `Processed and mapped Daraz standard CSV upload file. Updated ${changesMade} product items successfully.`
      );
      setCsvUploadRawText('');
    } else {
      setCsvUploadError('No fields modified. Check SKU mappings or store attributes.');
    }
  };

  // Paste Sample CSV quickly
  const loadCSVSampleMock = () => {
    const targetProducts = products.filter(p => p.storeId === csvSelectedStoreId);
    if (targetProducts.length === 0) {
      alert('Selected store has no products to generate a reference draft!');
      return;
    }

    const headers = 'StoreName,SKU,Product Name,Current Sale Price,New Price,Current Stock,New Stock,Status';
    const rows = targetProducts.slice(0, 3).map(p => {
      // simulate small edits in price (+150 PKR) and stock (+25 units)
      return `"${getStoreName(p.storeId)}","${p.sku}","${p.name}",${p.salePrice},${p.salePrice + 150},${p.stock},${p.stock + 20},"${p.status}"`;
    });

    setCsvUploadRawText([headers, ...rows].join('\n'));
    setCsvUploadError('');
  };

  // Performance category math helper
  const categoryTotals = useMemo(() => {
    const counts: { [key: string]: number } = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + p.revenue;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  // Total sales per store mockup
  const storeSalesComparison = useMemo(() => {
    return stores.map(s => {
      const storeProducts = products.filter(p => p.storeId === s.id);
      const rev = storeProducts.reduce((acc, p) => acc + p.revenue, 0);
      const ordersCount = orders.filter(o => o.storeId === s.id).length;
      const lowStockCount = storeProducts.filter(p => p.stock <= p.safetyStock).length;
      return {
        id: s.id,
        name: s.name,
        sellerId: s.sellerId,
        status: s.status,
        revenue: rev,
        orders: ordersCount * 4 + 5, // scaled to look realistic
        lowStock: lowStockCount
      };
    });
  }, [stores, products, orders]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="animate-spin text-orange-500 h-12 w-12" />
          <h2 className="text-xl font-medium tracking-wide">Initializing SellerDesk Secure Workspace...</h2>
          <p className="text-slate-400 text-xs font-mono">Verifying store states and credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-orange-500/30 selection:text-orange-200">
      
      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 transition"
          >
            <LayoutDashboard className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-orange-950/20">
              SD
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">SellerDesk</span>
              <span className="ml-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">Daraz Partner</span>
            </div>
          </div>
        </div>

        {/* Global Warning Indicator Bar if low stock is fatal */}
        {stats.outOfStock > 0 && (
          <div className="hidden md:flex items-center space-x-2 bg-red-950/40 border border-red-500/20 px-3 py-1.5 rounded-full text-xs text-red-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-mono">{stats.outOfStock} SKUs Out of Stock!</span>
          </div>
        )}

        {/* Credentials and User Role Switcher */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-1.5">
            <ShieldAlert className="h-4 w-4 text-emerald-400" />
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-bold leading-none">Simulated Identity</div>
              <div className="text-xs font-semibold text-slate-200">
                {currentRole === 'Admin' ? 'Admin (Owner)' : currentRole === 'Manager' ? 'HQ Manager' : currentRole === 'Packing Staff' ? 'Store Clerk' : 'Guest Viewer'}
              </div>
            </div>
          </div>

          <div className="flex bg-slate-850 p-1 rounded-lg border border-slate-700 text-xs">
            {(['Admin', 'Manager', 'Packing Staff', 'Viewer'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`px-2 py-1 rounded transition-all font-medium ${
                  currentRole === role
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {role.split(' ')[0]}
              </button>
            ))}
          </div>

          <button 
            onClick={resetAllData}
            title="Reset storage to original pristine mock state"
            className="p-2 hover:bg-slate-800 rounded-lg border border-slate-800 text-slate-400 hover:text-orange-400 transition"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300`}>
          <div className="p-3">
            <ul className="space-y-1">
              {[
                { id: 'dashboard', label: 'Multi-Store Summary', icon: LayoutDashboard },
                { id: 'checklist', label: 'Daily Operations List', icon: ClipboardList, badge: checklist.filter(c => !c.completed).length },
                { id: 'products', label: 'Product Master Ledger', icon: Boxes, badge: stats.lowStock > 0 ? stats.lowStock : undefined, badgeColor: 'bg-amber-600/20 text-amber-400' },
                { id: 'orders', label: 'Order Fulfillment Hub', icon: Package, badge: stats.pending > 0 ? stats.pending : undefined, badgeColor: 'bg-orange-600 text-white' },
                { id: 'bulk', label: 'Bulk Console Operations', icon: Sliders },
                { id: 'csv', label: 'CSV Bulk Sync Console', icon: FileSpreadsheet },
                { id: 'analytics', label: 'Performance Analytics', icon: TrendingUp },
                { id: 'stores', label: 'Storefront Connections', icon: Settings, badge: stores.length }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => selectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition group ${
                        activeTab === item.id
                          ? 'bg-orange-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-4 w-4 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-orange-400 transition'}`} />
                        {sidebarOpen && <span>{item.label}</span>}
                      </div>
                      {sidebarOpen && item.badge !== undefined && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* User Details box at the footer of sidebar */}
          {sidebarOpen && (
            <div className="p-4 border-t border-slate-800 bg-slate-950/30">
              <div className="flex items-center space-x-3">
                <Image 
                  src={MOCK_USERS.find(u => u.role === currentRole)?.avatarUrl || 'https://picsum.photos/100'} 
                  alt="Profile" 
                  width={32} 
                  height={32}
                  referrerPolicy="no-referrer"
                  className="h-8 w-8 rounded-full border border-orange-500/40 object-cover"
                />
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-200">
                    {MOCK_USERS.find(u => u.role === currentRole)?.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {MOCK_USERS.find(u => u.role === currentRole)?.email}
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Content Viewer Section */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
          
          {/* Active Notifications banner block (if any) */}
          {activeAlerts.length > 0 && activeTab === 'dashboard' && (
            <div className="mb-6 bg-amber-950/20 border border-amber-600/25 rounded-xl p-4 flex items-start justify-between">
              <div className="flex space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-200">System Inventory Notifications & Alerts</h4>
                  <ul className="mt-1.5 space-y-1 text-xs text-amber-400/90 list-disc list-inside">
                    {activeAlerts.map((alertItem, idx) => (
                      <li key={idx}>{alertItem}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <button 
                onClick={() => setActiveAlerts([])}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* HEADER PATHS AND SEARCH INFO FOR PRODUCTS/ORDERS LIST */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                <span>SellerDesk Workspace</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-orange-400 capitalize">{activeTab} Console</span>
              </div>
              <h1 className="text-3xl font-serif italic tracking-tight text-white mt-1">
                {activeTab === 'dashboard' && 'Central Multi-Store Dashboard'}
                {activeTab === 'checklist' && 'Daily Store Checklist'}
                {activeTab === 'products' && 'Product Master Catalog'}
                {activeTab === 'orders' && 'Fulfillment Order Pipeline'}
                {activeTab === 'bulk' && 'Bulk Batch Processor'}
                {activeTab === 'csv' && 'CSV Bulk Import & Export Portal'}
                {activeTab === 'analytics' && 'Operational Reports'}
                {activeTab === 'stores' && 'Daraz API & CSV Integrations'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab === 'dashboard' && 'Consolidated live view of key sales targets, out-of-stock threats, and operations metrics.'}
                {activeTab === 'checklist' && 'Daily prioritized checklist items to quickly process orders, top inventory deficits, and validation review.'}
                {activeTab === 'products' && 'Global SKU catalog matching your connected Daraz seller center accounts. Edit individual metrics seamlessly.'}
                {activeTab === 'orders' && 'Process orders, package pending bundles, change status sequences, and generate printable shipping labels.'}
                {activeTab === 'bulk' && 'Apply formulas to update pricing coordinates or restock levels in batch sweeps across categories and SKUs.'}
                {activeTab === 'csv' && 'Download standard Daraz Seller template, edit via Excel, then upload to instantly rewrite store catalogs.'}
                {activeTab === 'analytics' && 'Dynamic statistics tracking sales revenues, cancelled-to-return correlations, and store comparison graphs.'}
                {activeTab === 'stores' && 'Link multiple Daraz stores. Toggle between secure API sync tunnels and client CSV offline modes.'}
              </p>
            </div>

            {/* Quick Action Reset Indicators */}
            <div className="flex items-center gap-2">
              {['products', 'orders'].includes(activeTab) && (
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search SKU, customer, title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-1.5 w-60 text-xs bg-slate-900 border border-slate-850 rounded-lg focus:outline-none focus:border-orange-500 text-slate-200 transition"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-2 hover:bg-slate-800 p-0.5 rounded text-slate-400 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ==================================== TAB 1: DASHBOARD ==================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* KPI Summary Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>TODAY&apos;S REVENUE</span>
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="text-3xl font-serif italic text-white mt-1.5">
                    Rs. {stats.todayRevenue.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center">
                    <span>+14.2% from yesterday</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>PENDING DISPATCH</span>
                    <ClipboardList className="h-4 w-4 text-orange-400 animate-pulse" />
                  </div>
                  <div className="text-3xl font-serif italic text-white mt-1.5">
                    {stats.pending} Orders
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center">
                    <span className="font-mono text-orange-400">{stats.readyToPack} Packed</span>
                    <span className="mx-1.5">|</span>
                    <span className="font-mono text-slate-400">{stats.shipped} Shipped</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>LOW STOCK ALERTS</span>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="text-3xl font-serif italic text-amber-400 mt-1.5">
                    {stats.lowStock} SKUs
                  </div>
                  <div className="text-[10px] text-red-400 mt-1 font-mono">
                    {stats.outOfStock} completely out of stock!
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>CUMULATIVE SALES</span>
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-serif italic text-emerald-400 mt-1.5">
                    Rs. {stats.totalSalesEstimate.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Combined catalog estimation
                  </div>
                </div>
              </div>

              {/* Store wise summary grid table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold tracking-wide text-white uppercase">Linked Daraz Stores Performance</h3>
                  <button 
                    onClick={() => selectTab('stores')}
                    className="text-orange-400 hover:text-orange-300 text-xs font-medium flex items-center space-x-1"
                  >
                    <span>Manage Connections</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Store Name</th>
                        <th className="py-3 px-4">Seller ID</th>
                        <th className="py-3 px-4">Today Orders</th>
                        <th className="py-3 px-4">Estimated Sales</th>
                        <th className="py-3 px-4">Low Stock Count</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Sync Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {storeSalesComparison.map((store) => (
                        <tr key={store.id} className="hover:bg-slate-850/50 transition">
                          <td className="py-3.5 px-4 font-semibold text-white">{store.name}</td>
                          <td className="py-3.5 px-4 text-slate-400 font-mono">{store.sellerId}</td>
                          <td className="py-3.5 px-4">{store.orders} orders</td>
                          <td className="py-3.5 px-4 font-semibold text-emerald-400">Rs. {store.revenue.toLocaleString()}</td>
                          <td className="py-3.5 px-4">
                            {store.lowStock > 0 ? (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                                {store.lowStock} Alarms
                              </span>
                            ) : (
                              <span className="text-emerald-400 font-semibold font-mono">Good</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${store.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded font-bold ${
                              stores.find(st => st.id === store.id)?.connectionType === 'API'
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              {stores.find(st => st.id === store.id)?.connectionType}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bento Grid: Top Selling Products and Status Breakdown charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Top Selling Products Ledger */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-mono">Top Products by Revenue</h3>
                    <button 
                      onClick={() => selectTab('products')}
                      className="text-orange-400 hover:text-orange-300 text-xs font-semibold"
                    >
                      View Catalog
                    </button>
                  </div>

                  <div className="space-y-3">
                    {products.slice(0, 4).map((p, idx) => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 hover:bg-slate-850/30 transition border border-slate-850">
                        <div className="flex items-center space-x-3 truncate">
                          <span className="text-xs font-bold text-slate-500 font-mono w-4">#{idx+1}</span>
                          <div className="truncate">
                            <h5 className="text-xs font-bold text-white truncate">{p.name}</h5>
                            <div className="flex items-center space-x-1.5 mt-0.5 text-[10px] text-slate-400 font-mono">
                              <span>SKU: {p.sku}</span>
                              <span>•</span>
                              <span>{getStoreName(p.storeId)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <div className="text-xs font-bold text-emerald-400">Rs. {p.revenue.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{p.ordersCount} Units Sold</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Order Stage Pipeline Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-mono">Order Status Distribution</h3>
                    <button 
                      onClick={() => selectTab('orders')}
                      className="text-orange-400 hover:text-orange-300 text-xs font-semibold"
                    >
                      Process Orders
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { label: 'Pending', count: stats.pending, color: 'border-amber-500 text-amber-400 bg-amber-500/5' },
                      { label: 'Ready to Pack', count: stats.readyToPack, color: 'border-orange-500 text-orange-400 bg-orange-500/5' },
                      { label: 'Shipped Out', count: stats.shipped, color: 'border-indigo-500 text-indigo-400 bg-indigo-500/5' },
                      { label: 'Completed', count: stats.todayOrders - stats.pending - stats.readyToPack - stats.shipped, color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10' },
                      { label: 'Cancelled', count: stats.cancelled, color: 'border-red-500 text-red-400 bg-red-400/5' },
                      { label: 'Returns Received', count: stats.returned, color: 'border-pink-500 text-pink-400 bg-pink-400/5' }
                    ].map((stItem) => (
                      <div key={stItem.label} className={`border rounded-lg p-3 text-center transition hover:shadow-md ${stItem.color}`}>
                        <div className="text-lg font-bold font-mono">{stItem.count}</div>
                        <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{stItem.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 p-3 rounded-lg bg-orange-600/5 border border-orange-500/20 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-orange-300">
                      <Bell className="h-4 w-4 shrink-0 animate-bounce" />
                      <span>Ready to pack: <strong>{stats.pending} items</strong> need immediate processing today.</span>
                    </div>
                    <button 
                      onClick={() => selectTab('checklist')}
                      className="text-[10px] bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-2.5 rounded transition shadow"
                    >
                      Process Now
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================================== TAB 2: DAILY CHECKLIST ==================================== */}
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-orange-500" />
                      <span>Today&apos;s High Priority Store Tasks</span>
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">Complete your e-commerce operations in sequence to maintain Seller Performance levels of &gt;95%.</p>
                  </div>
                  <span className="text-xs bg-slate-850 px-3 py-1 rounded text-slate-300 border border-slate-800">
                    Done: <strong className="text-orange-400 font-mono">{checklist.filter(c => c.completed).length}/{checklist.length}</strong>
                  </span>
                </div>

                <div className="space-y-3">
                  {checklist.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        item.completed 
                          ? 'bg-slate-950/40 border-slate-850 text-slate-500' 
                          : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start space-x-3">
                          <button 
                            onClick={() => toggleChecklistManual(item.id)}
                            className="mt-0.5 shrink-0 text-slate-400 hover:text-orange-500 transition"
                          >
                            {item.completed ? (
                              <div className="h-5 w-5 rounded bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/40">
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="h-5 w-5 rounded border border-slate-600 hover:border-slate-400" />
                            )}
                          </button>
                          <div>
                            <span className={`text-xs font-semibold ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                              {item.text}
                            </span>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-[10px] font-mono uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                                Tab: {item.tab}
                              </span>
                              {!item.completed && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {!item.completed && (
                          <div className="shrink-0">
                            {item.id === 'chk-1' && (
                              <button 
                                onClick={() => resolveChecklistTask('chk-1', 'pack-all')}
                                className="text-[10px] bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-3 rounded transition-all-200"
                              >
                                Pack All Pending (Auto)
                              </button>
                            )}
                            {item.id === 'chk-2' && (
                              <button 
                                onClick={() => resolveChecklistTask('chk-2', 'restock-black')}
                                className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-3 rounded transition-all"
                              >
                                Auto Restock (+45)
                              </button>
                            )}
                            {item.id === 'chk-3' && (
                              <button 
                                onClick={() => {
                                  selectTab('products');
                                  setStockFilter('low');
                                }}
                                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-1 px-3 rounded transition-all border border-slate-700"
                              >
                                View Low Stock
                              </button>
                            )}
                            {item.id === 'chk-5' && (
                              <button 
                                onClick={() => {
                                  selectTab('orders');
                                  setStatusFilterByOrder('Returned');
                                }}
                                className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded transition-all"
                              >
                                Go To Returns
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================== TAB 3: PRODUCTS ==================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Product Ledger Filtering Toolbar */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex flex-wrap gap-2.5 items-center">
                  
                  {/* Store Filter */}
                  <div className="text-xs">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Store Filter</label>
                    <select
                      value={storeFilter}
                      onChange={(e) => setStoreFilter(e.target.value)}
                      className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500 text-slate-200"
                    >
                      <option value="all">All Connected Stores ({stores.length})</option>
                      {stores.map(st => (
                        <option key={st.id} value={st.id}>{st.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div className="text-xs">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500 text-slate-200"
                    >
                      <option value="all">All Categories</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion & Apparel">Fashion & Apparel</option>
                      <option value="Home & Living">Home & Living</option>
                    </select>
                  </div>

                  {/* Stock Level Alert Filter */}
                  <div className="text-xs">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Stock Level</label>
                    <select
                      value={stockFilter}
                      onChange={(e) => setStockFilter(e.target.value)}
                      className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500 text-slate-200"
                    >
                      <option value="all">All stock settings</option>
                      <option value="low">Low Inventory Alarms (≤ Safety Stock)</option>
                      <option value="out">Completely Out of stock (0 items)</option>
                    </select>
                  </div>

                  {/* Performance Indicators Filter */}
                  <div className="text-xs">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Metrics & Standing</label>
                    <select
                      value={perfFilter}
                      onChange={(e) => setPerfFilter(e.target.value)}
                      className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500 text-slate-200"
                    >
                      <option value="all">All operational velocity</option>
                      <option value="high">High Selling (≥ 100 orders)</option>
                      <option value="slow">Slow Selling (&lt; 30 orders)</option>
                      <option value="returns">High return rates (≥ 5 instances)</option>
                    </select>
                  </div>

                </div>

                <div className="flex gap-2">
                  {(storeFilter !== 'all' || categoryFilter !== 'all' || stockFilter !== 'all' || perfFilter !== 'all') && (
                    <button 
                      onClick={() => {
                        setStoreFilter('all');
                        setCategoryFilter('all');
                        setStockFilter('all');
                        setPerfFilter('all');
                      }}
                      className="text-xs font-semibold px-3 py-1.5 border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg transition"
                    >
                      Reset Filters
                    </button>
                  )}

                  <button 
                    onClick={() => selectTab('bulk')}
                    className="text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg transition"
                  >
                    Bulk Price/Stock
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-semibold text-white text-sm">Product Listings Available ({filteredProducts.length})</h3>
                  <div className="text-[10px] text-slate-400">
                    Showing {filteredProducts.length} of {products.length} products listed
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/20">
                        <th className="py-3 px-4 w-10">
                          <input
                            type="checkbox"
                            checked={filteredProducts.length > 0 && filteredProducts.every(fp => selectedProductIds.includes(fp.id))}
                            onChange={() => handleSelectPageProducts(filteredProducts)}
                            className="rounded text-orange-500 focus:ring-0 focus:ring-offset-0 cursor-pointer h-3.5 w-3.5"
                          />
                        </th>
                        <th className="py-3 px-4">SKU Code</th>
                        <th className="py-3 px-4">Product Name</th>
                        <th className="py-3 px-4">Connected Store</th>
                        <th className="py-3 px-4">Original Price</th>
                        <th className="py-3 px-4">Sale Price</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4">Orders Count</th>
                        <th className="py-3 px-4">Revenue</th>
                        <th className="py-3 px-4">Ratings</th>
                        <th className="py-3 px-4 text-center">Catalog Status</th>
                        <th className="py-3 px-4 text-center">Fast Edit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={12} className="py-12 text-center text-slate-500 font-medium">
                            No products match your active search terms or category constraints.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((p) => {
                          const isLowStock = p.stock <= p.safetyStock;
                          const isOutOfStock = p.stock === 0;
                          return (
                            <tr key={p.id} className="hover:bg-slate-850/50 transition">
                              <td className="py-3 px-4">
                                <input
                                  type="checkbox"
                                  checked={selectedProductIds.includes(p.id)}
                                  onChange={() => handleToggleSelectProduct(p.id)}
                                  className="rounded text-orange-500 focus:ring-0 focus:ring-offset-0 cursor-pointer h-3.5 w-3.5"
                                />
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-slate-300">{p.sku}</td>
                              <td className="py-3 px-4 font-semibold text-white max-w-[260px] truncate" title={p.name}>
                                {p.name}
                              </td>
                              <td className="py-3 px-4 text-slate-400">{getStoreName(p.storeId)}</td>
                              <td className="py-3 px-4 font-mono text-slate-400">Rs. {p.originalPrice}</td>
                              <td className="py-3 px-4 font-mono font-bold text-white">Rs. {p.salePrice}</td>
                              <td className="py-3 px-4">
                                {isOutOfStock ? (
                                  <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 font-bold uppercase text-[9px]">
                                    Out Of Stock (0)
                                  </span>
                                ) : isLowStock ? (
                                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold text-[9px]">
                                    Low Stock ({p.stock})
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold font-mono">
                                    {p.stock} Units
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 font-mono text-center">{p.ordersCount}</td>
                              <td className="py-3 px-4 font-mono font-bold text-emerald-400">Rs. {p.revenue.toLocaleString()}</td>
                              <td className="py-3 px-4 font-mono font-semibold text-amber-400">★ {p.rating}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  p.status === 'Active'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-slate-700/20 text-slate-500'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => setEditingProduct(p)}
                                  className="p-1 hover:bg-slate-800 text-orange-400 hover:text-white rounded"
                                >
                                  <Sliders className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Product Inline Fast Editor Modal overlay */}
              {editingProduct && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 relative">
                    <button 
                      onClick={() => setEditingProduct(null)}
                      className="absolute right-4 top-4 hover:bg-slate-800 p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    
                    <span className="text-[10px] font-bold uppercase text-orange-400 tracking-wider">Fast Edit Console</span>
                    <h3 className="text-base font-bold text-white mt-1 mb-2 truncate" title={editingProduct.name}>
                      {editingProduct.name}
                    </h3>
                    <div className="text-xs text-slate-400 mb-4 font-mono">SKU: {editingProduct.sku} • Store: {getStoreName(editingProduct.storeId)}</div>

                    {!hasAccess(['Admin', 'Manager']) ? (
                      <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-xs text-red-300 flex items-start gap-2">
                        <Lock className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>View Only Mode: Changes to catalog price tags require Manager level permissions.</span>
                      </div>
                    ) : (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const price = parseFloat((e.currentTarget.elements.namedItem('salePrice') as HTMLInputElement).value);
                        const stock = parseInt((e.currentTarget.elements.namedItem('stock') as HTMLInputElement).value);
                        handleSaveInlineProduct(editingProduct.sku, price, stock);
                      }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Sale Price (PKR)</label>
                          <input
                            type="number"
                            name="salePrice"
                            defaultValue={editingProduct.salePrice}
                            required
                            min="0"
                            className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Stock Level (Units)</label>
                          <input
                            type="number"
                            name="stock"
                            defaultValue={editingProduct.stock}
                            required
                            min="0"
                            className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">This product’s safety stock triggers at {editingProduct.safetyStock} units.</p>
                        </div>
                        <div className="flex gap-2 justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(null)}
                            className="px-4 py-2 border border-slate-800 bg-slate-950 text-slate-300 rounded-lg text-xs hover:bg-slate-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold font-semibold transition"
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==================================== TAB 4: ORDERS ==================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Filter controls and progress bars */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-2.5 items-center justify-between">
                
                {/* Store selection switcher */}
                <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850">
                  <button
                    onClick={() => setStatusFilterByOrder('all')}
                    className={`px-3 py-1.5 text-xs rounded-md transition ${statusFilterByOrder === 'all' ? 'bg-orange-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
                  >
                    All Orders
                  </button>
                  <button
                    onClick={() => setStatusFilterByOrder('Pending')}
                    className={`px-3 py-1.5 text-xs rounded-md transition ${statusFilterByOrder === 'Pending' ? 'bg-amber-600/35 text-amber-300 font-semibold border-b border-amber-500' : 'text-slate-400 hover:text-white'}`}
                  >
                    Pending ({orders.filter(o => o.status === 'Pending').length})
                  </button>
                  <button
                    onClick={() => setStatusFilterByOrder('Ready to Pack')}
                    className={`px-3 py-1.5 text-xs rounded-md transition ${statusFilterByOrder === 'Ready to Pack' ? 'bg-orange-600/25 text-orange-400 font-semibold border-b border-orange-500' : 'text-slate-400 hover:text-white'}`}
                  >
                    Ready To Pack ({orders.filter(o => o.status === 'Ready to Pack').length})
                  </button>
                  <button
                    onClick={() => setStatusFilterByOrder('Shipped')}
                    className={`px-3 py-1.5 text-xs rounded-md transition ${statusFilterByOrder === 'Shipped' ? 'bg-indigo-600/25 text-indigo-400 font-semibold border-b border-indigo-500' : 'text-slate-400 hover:text-white'}`}
                  >
                    Shipped ({orders.filter(o => o.status === 'Shipped').length})
                  </button>
                  <button
                    onClick={() => setStatusFilterByOrder('Returned')}
                    className={`px-3 py-1.5 text-xs rounded-md transition ${statusFilterByOrder === 'Returned' ? 'bg-pink-600/25 text-pink-400 font-semibold border-b border-pink-500' : 'text-slate-400 hover:text-white'}`}
                  >
                    Returns/Cancellations ({orders.filter(o => o.status === 'Returned' || o.status === 'Cancelled').length})
                  </button>
                </div>

                <div className="text-xs">
                  <select
                    value={storeFilter}
                    onChange={(e) => setStoreFilter(e.target.value)}
                    className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 focus:outline-none text-slate-200"
                  >
                    <option value="all">Compare All Stores</option>
                    {stores.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Simple Table showing results */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/25">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Store Channel</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Product Sku</th>
                        <th className="py-3 px-4 text-center">Qty</th>
                        <th className="py-3 px-4">Total Price</th>
                        <th className="py-3 px-4">Fulfillment Status</th>
                        <th className="py-3 px-4">Order Received</th>
                        <th className="py-3 px-4 text-center">Fulfill Package</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-slate-500">
                            No orders matching your criteria found.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((o) => {
                          const dateObj = new Date(o.orderDate);
                          return (
                            <tr key={o.id} className="hover:bg-slate-850/50 transition">
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => setSelectedOrder(o)}
                                  className="text-orange-400 hover:text-white font-mono font-bold hover:underline"
                                >
                                  #{o.id}
                                </button>
                              </td>
                              <td className="py-3 px-4 text-slate-300 font-semibold">{getStoreName(o.storeId)}</td>
                              <td className="py-3 px-4">
                                <div className="font-semibold text-white">{o.customerName}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{o.customerPhone}</div>
                              </td>
                              <td className="py-3 px-4 font-mono max-w-[150px] truncate" title={o.productName}>
                                {o.sku}
                              </td>
                              <td className="py-3 px-4 text-center">{o.quantity}</td>
                              <td className="py-3 px-4 font-bold text-white">Rs. {o.amount.toLocaleString()}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  o.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' :
                                  o.status === 'Ready to Pack' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/10' :
                                  o.status === 'Shipped' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10' :
                                  o.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' :
                                  o.status === 'Returned' ? 'bg-pink-500/10 text-pink-400' :
                                  'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-400 font-mono">
                                {dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {o.status === 'Pending' && (
                                  <button
                                    onClick={() => advanceOrderStatus(o.id, 'Ready to Pack')}
                                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-2.5 rounded text-[10px] transition"
                                  >
                                    Move to Pack
                                  </button>
                                )}
                                {o.status === 'Ready to Pack' && (
                                  <button
                                    onClick={() => advanceOrderStatus(o.id, 'Shipped')}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-2.5 rounded text-[10px] transition"
                                  >
                                    Dispatch Package
                                  </button>
                                )}
                                {o.status === 'Shipped' && (
                                  <button
                                    onClick={() => advanceOrderStatus(o.id, 'Delivered')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2.5 rounded text-[10px] transition"
                                  >
                                    Completed
                                  </button>
                                )}
                                {['Cancelled', 'Returned', 'Delivered'].includes(o.status) && (
                                  <span className="text-slate-500 text-[11px] font-mono">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Specific Detail & Print Air Bill Dialog Overlay */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
                    
                    <button
                      onClick={() => {
                        setSelectedOrder(null);
                        setShowAirwayBill(false);
                      }}
                      className="absolute right-4 top-4 hover:bg-slate-800 p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {/* Left/Right layouts */}
                    {!showAirwayBill ? (
                      <div>
                        <div className="flex items-center space-x-2">
                          <Package className="h-5 w-5 text-orange-500" />
                          <h3 className="text-lg font-bold text-white">Order Details Desk #{selectedOrder.id}</h3>
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">Fulfillment sequence metrics tracking live.</div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          
                          {/* Invoice Detail Card */}
                          <div className="bg-slate-950/50 p-4 border border-slate-800 rounded-xl space-y-3">
                            <span className="text-[10px] font-bold text-orange-400 uppercase">Product Details</span>
                            <div className="border-b border-slate-850 pb-2">
                              <h5 className="text-xs font-bold text-white">{selectedOrder.productName}</h5>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">SKU: {selectedOrder.sku}</div>
                            </div>

                            <div className="flex justify-between text-xs pt-1">
                              <span className="text-slate-400">Unit Price</span>
                              <span className="font-mono text-slate-200">Rs. {selectedOrder.amount / selectedOrder.quantity}</span>
                            </div>
                            <div className="flex justify-between text-xs pt-0.5">
                              <span className="text-slate-400">Quantity</span>
                              <span className="font-mono text-slate-200">{selectedOrder.quantity}x</span>
                            </div>
                            <div className="flex justify-between text-xs pt-1 border-t border-slate-850 font-bold">
                              <span className="text-white">Amount Paid</span>
                              <span className="font-mono text-orange-400">Rs. {selectedOrder.amount.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Shipment Customer Card */}
                          <div className="bg-slate-950/50 p-4 border border-slate-800 rounded-xl space-y-3">
                            <span className="text-[10px] font-bold text-orange-400 uppercase">Shipping Address Courier</span>
                            <div className="space-y-1.5 text-xs text-slate-300">
                              <div className="font-bold text-white">{selectedOrder.customerName}</div>
                              <div className="font-mono">{selectedOrder.customerPhone}</div>
                              <div className="text-slate-400">Lahore Cargo Terminal, Pakistan</div>
                              <div className="text-slate-500 text-[10px] font-mono">Carrier: Daraz Express (DEX)</div>
                            </div>
                            
                            {selectedOrder.trackingNumber && (
                              <div className="bg-slate-850 px-3 py-1.5 rounded border border-slate-800">
                                <div className="text-[9px] uppercase font-bold text-slate-500 leading-none">Airway Tracking</div>
                                <div className="font-mono text-xs font-semibold text-slate-350">{selectedOrder.trackingNumber}</div>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Pipeline sequence status actions */}
                        <div className="mt-6 border-t border-slate-800 pt-5 flex items-center justify-between flex-wrap gap-4">
                          <div className="flex gap-1.5">
                            {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered' && (
                              <button
                                onClick={() => advanceOrderStatus(selectedOrder.id, 'Cancelled')}
                                className="px-3.5 py-2 hover:bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg text-xs font-bold transition"
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {selectedOrder.status !== 'Pending' && (
                              <button
                                onClick={() => setShowAirwayBill(true)}
                                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-bold flex items-center gap-2 border border-slate-700 transition"
                              >
                                <Printer className="h-3.5 w-3.5 text-orange-400" />
                                <span>Preview Daraz Slip</span>
                              </button>
                            )}

                            {selectedOrder.status === 'Pending' && (
                              <button
                                onClick={() => advanceOrderStatus(selectedOrder.id, 'Ready to Pack')}
                                className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-lg text-xs font-bold tracking-wide transition shadow"
                              >
                                Pack & Generate Label
                              </button>
                            )}
                            {selectedOrder.status === 'Ready to Pack' && (
                              <button
                                onClick={() => advanceOrderStatus(selectedOrder.id, 'Shipped')}
                                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold tracking-wide transition"
                              >
                                Dispatch Shipped
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Live simulated printable document */
                      <div className="space-y-4 font-sans text-black">
                        <div className="flex justify-between items-center bg-slate-800 text-white p-3 rounded-lg -mx-6 -mt-6 rounded-b-none mb-4">
                          <span className="text-xs font-bold">Simulated Airway Bill Printing Hub</span>
                          <button 
                            onClick={() => setShowAirwayBill(false)}
                            className="text-orange-400 text-xs hover:underline"
                          >
                            Back To Details
                          </button>
                        </div>

                        {/* Visual Printable Slip Container */}
                        <div className="bg-white p-6 rounded-xl border-4 border-dashed border-slate-350 max-w-lg mx-auto font-mono text-[11px] leading-relaxed select-text">
                          <div className="flex justify-between items-start border-b border-black pb-2 mb-3">
                            <div className="text-sm font-extrabold tracking-tighter">daraz Express (DEX)</div>
                            <div className="text-right text-[10px]">COURIER ROUTE: LHE-05</div>
                          </div>

                          {/* Barcode representation */}
                          <div className="bg-black text-white h-10 flex items-center justify-center font-bold font-mono tracking-[4px] py-1 border-y border-black uppercase text-xs">
                            ||||| {selectedOrder.trackingNumber?.replace(/-/g, ' ')} |||||
                          </div>
                          <div className="text-center font-mono text-[9px] mt-1 mb-3 text-slate-700 font-bold">
                            TRACKING ID: {selectedOrder.trackingNumber}
                          </div>

                          <div className="grid grid-cols-2 gap-4 border-b border-black pb-3 mb-3 text-[10px]">
                            <div>
                              <strong className="block text-[9px] text-slate-500">CONSIGNEE RECIPIENT:</strong>
                              <span className="font-bold text-xs">{selectedOrder.customerName}</span>
                              <div className="mt-0.5">{selectedOrder.customerPhone}</div>
                              <div className="text-slate-600">Lahore Postal Terminal sector A, Pakistan</div>
                            </div>
                            <div>
                              <strong className="block text-[9px] text-slate-500">SENDER / STORE:</strong>
                              <span className="font-bold font-sans">{getStoreName(selectedOrder.storeId)}</span>
                              <div className="mt-0.5">SellerDesk Sync Console ID</div>
                              <div className="text-slate-600">PKR-Karachi Port Terminal</div>
                            </div>
                          </div>

                          <div className="border hover:border-black p-2 border-slate-300 rounded mb-3 text-[10px]">
                            <div className="flex justify-between font-bold">
                              <span>Product SKU: {selectedOrder.sku}</span>
                              <span>QTY: {selectedOrder.quantity}</span>
                            </div>
                            <p className="text-slate-600 text-[9px] truncate mt-0.5">{selectedOrder.productName}</p>
                          </div>

                          <div className="flex justify-between text-xs font-bold border-t border-black pt-2 uppercase">
                            <span>Payment Method: COD (Cash on Delivery)</span>
                            <span>Total: Rs. {selectedOrder.amount}</span>
                          </div>

                          <span className="block text-center text-[8px] text-slate-500 font-sans mt-4 italic">
                            Generated securely via SellerDesk Daraz Multi-Store Portal. Ready to be pasted on shipper package.
                          </span>
                        </div>

                        <div className="text-center pt-3">
                          <button
                            onClick={() => window.print()}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg text-xs font-bold tracking-wide shadow"
                          >
                            Print Real AirBill Slip (System PDF)
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==================================== TAB 5: BULK CONSOLE ==================================== */}
          {activeTab === 'bulk' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Left side formulas input properties */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 h-fit">
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                    <Sliders className="h-4.5 w-4.5 text-orange-500" />
                    <span>Configure Pricing & Stock Formula</span>
                  </h3>
                  <p className="text-xs text-slate-450 mt-1">Select multiple products on the catalog selector (right list) and configure changes to apply to sale prices or stocks instantly.</p>

                  <div className="border-t border-slate-800 pt-4 space-y-4">
                    
                    {/* Operation Selection */}
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Adjustment Formula</span>
                      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-850">
                        <button
                          type="button"
                          onClick={() => setBulkPriceMethod('percent_inc')}
                          className={`py-1.5 text-[10px] font-bold rounded text-center transition ${bulkPriceMethod === 'percent_inc' ? 'bg-orange-600/20 text-orange-400 border border-orange-500/10' : 'text-slate-400 hover:text-white'}`}
                        >
                          Increase %
                        </button>
                        <button
                          type="button"
                          onClick={() => setBulkPriceMethod('percent_dec')}
                          className={`py-1.5 text-[10px] font-bold rounded text-center transition ${bulkPriceMethod === 'percent_dec' ? 'bg-orange-600/20 text-orange-400 border border-orange-500/10' : 'text-slate-400 hover:text-white'}`}
                        >
                          Decrease %
                        </button>
                        <button
                          type="button"
                          onClick={() => setBulkPriceMethod('fixed')}
                          className={`py-1.5 text-[10px] font-bold rounded text-center transition ${bulkPriceMethod === 'fixed' ? 'bg-orange-600/20 text-orange-400 border border-orange-500/10' : 'text-slate-400 hover:text-white'}`}
                        >
                          Fixed Value
                        </button>
                      </div>
                    </div>

                    {/* Numeric percentage or fixed multiplier inputs */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {bulkPriceMethod === 'fixed' ? 'Set Price to (PKR)' : 'Price Alter Percentage (%)'}
                      </label>
                      <input
                        type="number"
                        placeholder={bulkPriceMethod === 'fixed' ? 'e.g. 1500' : 'e.g. 10'}
                        value={bulkPriceValue}
                        onChange={(e) => setBulkPriceValue(e.target.value)}
                        className="w-full text-xs font-semibold bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">Calculates dynamically with rounding points (e.g. Rs. 249.99 → Rs. 275).</p>
                    </div>

                    {/* Stock level modification override */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bulk Stock Override (Units)</label>
                      <input
                        type="number"
                        placeholder="e.g. 50"
                        value={bulkStockValue}
                        onChange={(e) => setBulkStockValue(e.target.value)}
                        className="w-full text-xs font-semibold bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">Leave empty to modify prices only, or fill to force set warehouse inventories.</p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleApplyBulkOperations}
                        className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-extrabold tracking-wide transition shadow"
                      >
                        Apply Bulk Batch to {selectedProductIds.length} Selected
                      </button>
                      <p className="text-[9px] text-slate-500 mt-2 text-center">Batch edits are written instantly to the central audit history database.</p>
                    </div>

                  </div>
                </div>

                {/* 2. Target list selections for pricing updates */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 lg:col-span-2 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="font-bold text-white text-sm">Select Target SKU Listings</h4>
                      <p className="text-[11px] text-slate-450">Check SKUs in list to add to batch. Total selected: <strong>{selectedProductIds.length} item(s)</strong></p>
                    </div>
                    <button
                      onClick={() => setSelectedProductIds(products.map(p => p.id))}
                      className="text-xs text-orange-400 hover:text-white"
                    >
                      Select All Products
                    </button>
                  </div>

                  {/* Micro list */}
                  <div className="space-y-2 max-h-[350px] overflow-y-auto">
                    {products.map((p) => {
                      const isChecked = selectedProductIds.includes(p.id);
                      return (
                        <div 
                          key={p.id}
                          onClick={() => handleToggleSelectProduct(p.id)}
                          className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                            isChecked 
                              ? 'bg-orange-600/10 border-orange-500/40 text-white' 
                              : 'bg-slate-950/40 border-slate-850 text-slate-350 hover:bg-slate-850/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3 truncate">
                            <div className="shrink-0 mt-0.5">
                              {isChecked ? (
                                <div className="h-4 w-4 bg-orange-600 text-white flex items-center justify-center rounded">
                                  <Check className="h-3 w-3 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="h-4 w-4 rounded border border-slate-600" />
                              )}
                            </div>
                            <div className="truncate text-left">
                              <span className="font-bold font-mono text-xs">{p.sku}</span>
                              <span className="mx-2 text-slate-500">|</span>
                              <span className="text-xs truncate">{p.name}</span>
                            </div>
                          </div>
                          
                          <div className="text-right shrink-0 font-mono text-xs ml-4">
                            <div className="font-bold">Rs. {p.salePrice}</div>
                            <div className="text-[10px] text-slate-400">{p.stock} units</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================================== TAB 6: CSV BULK IMPORT/EXPORT ==================================== */}
          {activeTab === 'csv' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Exporter Block */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                    <Download className="h-4.5 w-4.5 text-orange-500" />
                    <span>Download Store CSV Template</span>
                  </h3>
                  <p className="text-xs text-slate-400">Download the standard template matching current listed SKUs from physical stores to edit prices or inventories easily in Excel or sheets.</p>

                  <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Select Origin Store</label>
                      <select
                        value={csvSelectedStoreId}
                        onChange={(e) => setCsvSelectedStoreId(e.target.value)}
                        className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 text-slate-200 font-medium"
                      >
                        {stores.map(st => (
                          <option key={st.id} value={st.id}>{st.name} ({getStoreName(st.id)})</option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4">
                      <button 
                        onClick={() => handleTriggerCSVDownload(csvSelectedStoreId)}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs tracking-wider transition flex items-center justify-center gap-2 border border-slate-700"
                      >
                        <Download className="h-3.5 w-3.5 text-orange-400" />
                        <span>Export Daraz SKU Catalog CSV</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-505/10 border border-indigo-500/10 rounded-lg text-[11px] text-slate-400 select-all font-mono leading-relaxed">
                    <strong>Expected CSV Format Schema:</strong><br />
                    StoreName, SKU, Product Name, Current Sale Price, New Price, Current Stock, New Stock, Status
                  </div>
                </div>

                {/* Importer Block */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                    <UploadCloud className="h-4.5 w-4.5 text-orange-500" />
                    <span>Upload CSV Bulk Corrections</span>
                  </h3>
                  <p className="text-xs text-slate-400">Process updated CSV spreadsheets back to the workspace to rewrite active stores simultaneously.</p>

                  <form onSubmit={handleParseSimulatedCSV} className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-400">Upload to store:</span>
                      <strong className="text-orange-400">{getStoreName(csvSelectedStoreId)}</strong>
                    </div>

                    <div className="p-1 border border-dashed border-slate-800 rounded-xl bg-slate-950">
                      <textarea
                        rows={5}
                        placeholder='Paste CSV text here, or click "Load Sample Draft Draft" below to test...'
                        value={csvUploadRawText}
                        onChange={(e) => setCsvUploadRawText(e.target.value)}
                        className="w-full p-3 text-xs bg-slate-950 text-slate-250 font-mono focus:outline-none resize-none"
                      />
                    </div>

                    {csvUploadError && (
                      <div className="text-xs text-red-400 font-semibold p-2 bg-red-950/20 border border-red-500/20 rounded">
                        ⚠️ Err: {csvUploadError}
                      </div>
                    )}

                    {csvUploadSuccess && (
                      <div className="text-xs text-emerald-400 font-semibold p-2 bg-emerald-950/20 border border-emerald-500/20 rounded">
                        ✓ Parsed and synchronized inventory successfully to system. Ready for Daraz.
                      </div>
                    )}

                    <div className="flex justify-between gap-2 pt-2">
                      <button
                        type="button"
                        onClick={loadCSVSampleMock}
                        className="px-3.5 py-2 hover:bg-slate-800 text-slate-300 font-bold border border-slate-800 bg-slate-950 rounded-lg text-xs transition"
                      >
                        Load Sample CSV
                      </button>

                      <button
                        type="submit"
                        className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs font-semibold tracking-wide transition shadow"
                      >
                        Parse & Apply Bulk Changes
                      </button>
                    </div>
                  </form>
                </div>

              </div>

              {/* Parsed list changes preview */}
              {csvPreviewRows.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-white text-sm">Last Processing Sync Log Preview</h4>
                    <button 
                      onClick={() => setCsvPreviewRows([])}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      Clear review logs
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase bg-slate-950/30">
                          <th className="py-2.5 px-3">SKU</th>
                          <th className="py-2.5 px-3">Validation Status</th>
                          <th className="py-2.5 px-3">Proposed Price</th>
                          <th className="py-2.5 px-3">Proposed Stock</th>
                          <th className="py-2.5 px-3">Change Note</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 text-slate-300 font-mono">
                        {csvPreviewRows.map((row, index) => (
                          <tr key={index} className="hover:bg-slate-850/50">
                            <td className="py-2.5 px-3 font-semibold text-white">{row.sku}</td>
                            <td className="py-2.5 px-3">
                              {row.isValid ? (
                                <span className="text-emerald-400 font-bold">✓ Ready</span>
                              ) : (
                                <span className="text-red-400 font-bold">❌ Error</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3">Rs. {row.newPrice}</td>
                            <td className="py-2.5 px-3">{row.newStock} units</td>
                            <td className="py-2.5 px-3 text-xs font-sans text-slate-400">
                              {row.isValid && row.originalProduct ? (
                                <span>Edits price from Rs.{row.originalProduct.salePrice} and stock from {row.originalProduct.stock}</span>
                              ) : (
                                <span className="text-red-300 font-semibold">{row.errorMsg}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==================================== TAB 7: ANALYTICS ==================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Revenue Comparison SVG Visual Ring representation */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">Revenue split by Category</h4>
                  
                  <div className="flex items-center justify-center p-4">
                    <svg width="220" height="220" viewBox="0 0 200 200" className="transform -rotate-95">
                      {/* Outer backing track */}
                      <circle cx="100" cy="100" r="70" fill="transparent" stroke="#1e293b" strokeWidth="20" />
                      
                      {/* Segment 1: Electronics ~47% */}
                      <circle cx="100" cy="100" r="70" fill="transparent" stroke="#f97316" strokeWidth="20" 
                        strokeDasharray="440" strokeDashoffset="180" />
                        
                      {/* Segment 2: Apparel ~40% */}
                      <circle cx="100" cy="100" r="70" fill="transparent" stroke="#818cf8" strokeWidth="20" 
                        strokeDasharray="440" strokeDashoffset="310" className="transform origin-center rotate-45" />

                      {/* Segment 3: Home ~13% */}
                      <circle cx="100" cy="100" r="70" fill="transparent" stroke="#34d399" strokeWidth="20" 
                        strokeDasharray="440" strokeDashoffset="400" className="transform origin-center rotate-120" />
                    </svg>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="p-2 bg-slate-950 rounded border border-slate-850">
                      <span className="inline-block w-2.5 h-2.5 rounded bg-orange-500 mr-1.5" />
                      <span className="font-semibold text-slate-400">Electronics</span>
                      <div className="font-mono font-bold text-white mt-0.5">Rs. 47%</div>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-850">
                      <span className="inline-block w-2.5 h-2.5 rounded bg-indigo-400 mr-1.5" />
                      <span className="font-semibold text-slate-400">Fashion</span>
                      <div className="font-mono font-bold text-white mt-0.5">Rs. 40%</div>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-850">
                      <span className="inline-block w-2.5 h-2.5 rounded bg-emerald-400 mr-1.5" />
                      <span className="font-semibold text-slate-400">Home</span>
                      <div className="font-mono font-bold text-white mt-0.5">Rs. 13%</div>
                    </div>
                  </div>
                </div>

                {/* Return rate risk indicators comparison */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">Product Return Risks Tracker</h4>
                  
                  <div className="space-y-4 pt-2">
                    {products.slice(0, 4).map((p) => {
                      const totalActions = p.ordersCount;
                      const returnRate = totalActions > 0 ? Math.round((p.returnsCount / totalActions) * 100) : 0;
                      return (
                        <div key={p.id} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-white truncate max-w-[170px]">{p.sku} — {p.name}</span>
                            <span className="text-pink-400 font-mono">{returnRate}% Defect rate({p.returnsCount} ret)</span>
                          </div>
                          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${returnRate > 10 ? 'bg-rose-500 shadow shadow-red-950' : 'bg-slate-500'}`}
                              style={{ width: `${Math.min(100, Math.max(8, returnRate * 5))}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Sales compare trend lines simulation */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono mb-4">Store Sales comparison index</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {storeSalesComparison.map((st) => (
                    <div key={st.id} className="bg-slate-950 p-4 border border-slate-850 rounded-xl">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">{st.name}</div>
                      <div className="text-xl font-bold font-mono text-white mt-1">Rs. {st.revenue.toLocaleString()}</div>
                      
                      <div className="mt-3 flex items-end gap-1.5 h-12 pt-4 bg-slate-900/40 p-2 rounded border border-slate-850/50">
                        {/* mini bar chart bars */}
                        <div className="w-full bg-orange-600/30 hover:bg-orange-600 rounded-t h-[40%]" />
                        <div className="w-full bg-orange-600/30 hover:bg-orange-600 rounded-t h-[60%]" />
                        <div className="w-full bg-orange-600/30 hover:bg-orange-600 rounded-t h-[30%]" />
                        <div className="w-full bg-orange-600/30 hover:bg-orange-600 rounded-t h-[75%]" />
                        <div className="w-full bg-orange-600 hover:bg-orange-500 rounded-t h-[95%]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================================== TAB 8: STORES INTEGRATION ==================================== */}
          {activeTab === 'stores' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Store status list */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 lg:col-span-2 space-y-4">
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wide">Connected Daraz Channels</h3>
                  <p className="text-xs text-slate-450">Double-check sync statuses or secure app access tokens to verify connection properties.</p>

                  <div className="divide-y divide-slate-850 border-t border-slate-800">
                    {stores.map((st) => (
                      <div key={st.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-white text-sm">{st.name}</h4>
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                              st.status === 'active' 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : 'bg-slate-700/20 text-slate-500'
                            }`}>
                              {st.status}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-450 font-mono">
                            <span>Seller ID: {st.sellerId}</span>
                            <span>•</span>
                            <span>Linked Date: {new Date(st.connectedAt).toLocaleDateString()}</span>
                          </div>

                          {st.connectionType === 'API' && (
                            <div className="mt-1 text-[10px] font-mono bg-slate-950 p-1 px-2.5 rounded inline-block text-indigo-400 border border-indigo-505/20">
                              API Hook: {st.apiKey}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleStoreStatus(st.id)}
                            className={`px-3 py-1 bg-slate-950 border rounded-lg text-xs font-semibold hover:bg-slate-800 transition ${
                              st.status === 'active' 
                                ? 'border-red-500/20 text-red-400' 
                                : 'border-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {st.status === 'active' ? 'Deactivate Tunnel' : 'Activate Tunnel'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connect new storefront form */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-fit">
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                    <Plus className="h-4.5 w-4.5 text-orange-500" />
                    <span>Link New Store</span>
                  </h3>
                  <p className="text-xs text-slate-450 mt-1">Register secondary Daraz Seller credentials for instant dashboard consolidation.</p>

                  <form onSubmit={handleConnectStore} className="space-y-4 mt-4 border-t border-slate-850 pt-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-450 mb-1.5">Store Outlet Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Al-Wahab Fashion Karachi"
                        value={newStoreName}
                        onChange={(e) => setNewStoreName(e.target.value)}
                        required
                        className="w-full text-xs bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-450 mb-1.5">Daraz Seller ID</label>
                      <input
                        type="text"
                        placeholder="e.g. PK_WFA_2309"
                        value={newStoreSellerId}
                        onChange={(e) => setNewStoreSellerId(e.target.value)}
                        required
                        className="w-full text-xs bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-450 mb-1.5">Connection Protocol Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewStoreConnectionType('API')}
                          className={`py-1.5 rounded text-xs font-bold transition border ${
                            newStoreConnectionType === 'API'
                              ? 'bg-orange-600/15 border-orange-500 text-orange-400'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          Direct Seller API
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewStoreConnectionType('CSV')}
                          className={`py-1.5 rounded text-xs font-bold transition border ${
                            newStoreConnectionType === 'CSV'
                              ? 'bg-orange-600/15 border-orange-500 text-orange-400'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          Manual CSV Import
                        </button>
                      </div>
                    </div>

                    {newStoreConnectionType === 'API' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-450 mb-1.5">App Key API Token</label>
                        <input
                          type="password"
                          placeholder="••••••••••••••••••••••••"
                          value={newStoreApiKey}
                          onChange={(e) => setNewStoreApiKey(e.target.value)}
                          className="w-full text-xs bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold tracking-wide transition shadow"
                      >
                        Secure Link Storefront
                      </button>
                    </div>
                  </form>
                </div>

              </div>

            </div>
          )}

          {/* ==================================== FOOTER: AUDIT LOG LEDGER DISPLAY ==================================== */}
          <footer className="mt-8 border-t border-slate-800 pt-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Platform Audit Log Ledger</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Authorized ledger tracking active configuration and inventory rewrites.</p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Role Permissions Active: <span className="text-orange-400 font-bold">{currentRole}</span>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-2">
                {logs.map((log) => {
                  const stamp = new Date(log.timestamp);
                  return (
                    <div key={log.id} className="text-[11px] bg-slate-950/40 p-2.5 rounded-lg border border-slate-850/60 font-mono text-slate-350 flex justify-between gap-4">
                      <div>
                        <span className="text-slate-500 shrink-0">
                          {stamp.toLocaleDateString()} {stamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="mx-2 text-slate-750">|</span>
                        <span className="font-bold text-orange-400 shrink-0">[{log.userRole}]</span>
                        <span className="mx-2 text-slate-750">|</span>
                        <span className="text-slate-200 uppercase font-bold text-[10px] bg-slate-850 px-1.5 py-0.5 rounded mr-2 border border-slate-800">{log.action}</span>
                        <span className="text-slate-300 font-sans">{log.details}</span>
                      </div>
                      {log.sku && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/10 px-1.5 rounded shrink-0 h-fit self-center">
                          {log.sku}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-500 mt-6 font-mono">
              SellerDesk Central Daraz Multi-Store Portal © 2026. All operations synchronized securely under SSL sandbox.
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
