"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type AdminTab = "overview" | "parcels" | "drivers" | "branches" | "analytics" | "settings";
type ParcelStatus =
  | "Pending Pickup"
  | "In Hub"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Exception";

interface ParcelRecord {
  id: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  item: string;
  description: string;
  declaredValue: number;
  origin: string;
  destination: string;
  pickupType: "Doorstep" | "Branch";
  deliveryType: "Doorstep" | "Branch";
  speed: "Same-Day" | "Next-Day";
  status: ParcelStatus;
  driver?: string;
  date: string;
  photoUrl?: string;
}

interface DriverRecord {
  id: string;
  name: string;
  phone: string;
  vehicle: "Motorbike" | "Express Van" | "3-Ton Truck";
  status: "Available" | "On Delivery" | "Off Duty";
  activeParcels: number;
  rating: number;
  baseHub: string;
}

interface BranchRecord {
  id: string;
  name: string;
  city: string;
  inboundToday: number;
  outboundToday: number;
  capacityUsed: number; // percentage
  status: "Operational" | "Peak Capacity" | "Maintenance";
  manager: string;
  phone: string;
}

const INITIAL_PARCELS: ParcelRecord[] = [
  {
    id: "TX-9041-ZM",
    senderName: "Chanda Mwila",
    senderPhone: "+260 97 782 1092",
    receiverName: "Mutale Banda",
    receiverPhone: "+260 96 612 3456",
    item: "MacBook Pro M3 & Accessories",
    description: "Sealed laptop box with charger and mouse. Handle with care.",
    declaredValue: 24500,
    origin: "Lusaka Downtown",
    destination: "Kitwe - Doorstep",
    pickupType: "Doorstep",
    deliveryType: "Doorstep",
    speed: "Same-Day",
    status: "In Transit",
    driver: "Kelvin Phiri",
    date: "2026-07-27 14:30",
  },
  {
    id: "TX-9040-ZM",
    senderName: "Bwalya Tembo",
    senderPhone: "+260 95 543 2100",
    receiverName: "Nchimunya Haimbe",
    receiverPhone: "+260 97 111 2233",
    item: "Mining Equipment Spares",
    description: "Heavy industrial valves and heavy-duty gaskets.",
    declaredValue: 18000,
    origin: "Kitwe Central",
    destination: "Ndola Branch - Central",
    pickupType: "Branch",
    deliveryType: "Branch",
    speed: "Same-Day",
    status: "Out for Delivery",
    driver: "Chanda Musonda",
    date: "2026-07-27 13:15",
  },
  {
    id: "TX-9039-ZM",
    senderName: "Kabwe General Hospital",
    senderPhone: "+260 97 334 5566",
    receiverName: "Dr. Luyando Phiri",
    receiverPhone: "+260 96 445 6677",
    item: "Medical Test Samples",
    description: "Temperature controlled medical cooler bag. Urgent sample delivery.",
    declaredValue: 8500,
    origin: "Lusaka Cairo Road",
    destination: "Kitwe - Doorstep",
    pickupType: "Doorstep",
    deliveryType: "Doorstep",
    speed: "Same-Day",
    status: "Pending Pickup",
    driver: "Unassigned",
    date: "2026-07-27 15:10",
  },
  {
    id: "TX-9038-ZM",
    senderName: "Natasha Zimba",
    senderPhone: "+260 97 889 0011",
    receiverName: "Mulenga Kasonde",
    receiverPhone: "+260 95 223 3445",
    item: "Custom Chitenge Attire & Garments",
    description: "Box of 12 hand-stitched traditional outfits for wedding event.",
    declaredValue: 4200,
    origin: "Lusaka Downtown",
    destination: "Chingola - Doorstep",
    pickupType: "Doorstep",
    deliveryType: "Doorstep",
    speed: "Next-Day",
    status: "In Hub",
    driver: "Gift Sakala",
    date: "2026-07-27 11:45",
  },
  {
    id: "TX-9037-ZM",
    senderName: "Dennis Kaunda",
    senderPhone: "+260 96 776 5432",
    receiverName: "Alice Lungu",
    receiverPhone: "+260 97 998 8776",
    item: "Solar Inverter 5kVA",
    description: "Hybrid solar inverter system, fragile electronics label attached.",
    declaredValue: 15500,
    origin: "Lusaka Downtown",
    destination: "Ndola Branch - Central",
    pickupType: "Branch",
    deliveryType: "Branch",
    speed: "Same-Day",
    status: "Delivered",
    driver: "Kelvin Phiri",
    date: "2026-07-27 10:20",
  },
  {
    id: "TX-9036-ZM",
    senderName: "Copperbelt Traders Ltd",
    senderPhone: "+260 95 443 2198",
    receiverName: "James Chitembo",
    receiverPhone: "+260 97 654 3210",
    item: "Commercial Spare Parts",
    description: "Hydraulic pump repair kit.",
    declaredValue: 11200,
    origin: "Kitwe Central",
    destination: "Lusaka Branch - Downtown",
    pickupType: "Branch",
    deliveryType: "Branch",
    speed: "Same-Day",
    status: "In Transit",
    driver: "Rodrick Chewe",
    date: "2026-07-27 09:00",
  },
  {
    id: "TX-9035-ZM",
    senderName: "Agro-Chem Zambia",
    senderPhone: "+260 96 123 4567",
    receiverName: "Peter Kapwepwe",
    receiverPhone: "+260 97 789 0123",
    item: "Organic Fertilizer Samples",
    description: "4x 5kg sealed buckets of soil conditioner.",
    declaredValue: 2800,
    origin: "Lusaka Cairo Road",
    destination: "Chingola - Doorstep",
    pickupType: "Doorstep",
    deliveryType: "Doorstep",
    speed: "Next-Day",
    status: "Pending Pickup",
    driver: "Unassigned",
    date: "2026-07-27 15:45",
  },
];

const INITIAL_DRIVERS: DriverRecord[] = [
  {
    id: "DRV-01",
    name: "Kelvin Phiri",
    phone: "+260 97 123 9876",
    vehicle: "Express Van",
    status: "On Delivery",
    activeParcels: 4,
    rating: 4.9,
    baseHub: "Lusaka Downtown Hub",
  },
  {
    id: "DRV-02",
    name: "Chanda Musonda",
    phone: "+260 96 987 6543",
    vehicle: "Motorbike",
    status: "On Delivery",
    activeParcels: 3,
    rating: 4.8,
    baseHub: "Kitwe Central Hub",
  },
  {
    id: "DRV-03",
    name: "Gift Sakala",
    phone: "+260 95 456 7890",
    vehicle: "Express Van",
    status: "Available",
    activeParcels: 1,
    rating: 4.95,
    baseHub: "Lusaka Cairo Road Hub",
  },
  {
    id: "DRV-04",
    name: "Rodrick Chewe",
    phone: "+260 97 321 6549",
    vehicle: "3-Ton Truck",
    status: "On Delivery",
    activeParcels: 6,
    rating: 4.75,
    baseHub: "Lusaka Downtown Hub",
  },
  {
    id: "DRV-05",
    name: "Moses Banda",
    phone: "+260 96 654 9871",
    vehicle: "Motorbike",
    status: "Available",
    activeParcels: 0,
    rating: 5.0,
    baseHub: "Ndola Branch Hub",
  },
];

const INITIAL_BRANCHES: BranchRecord[] = [
  {
    id: "BR-LUS-01",
    name: "Lusaka Downtown Hub",
    city: "Lusaka",
    inboundToday: 412,
    outboundToday: 580,
    capacityUsed: 78,
    status: "Operational",
    manager: "Patricia Sikalinda",
    phone: "+260 211 254 000",
  },
  {
    id: "BR-LUS-02",
    name: "Lusaka Cairo Road Branch",
    city: "Lusaka",
    inboundToday: 240,
    outboundToday: 290,
    capacityUsed: 64,
    status: "Operational",
    manager: "George Mwamba",
    phone: "+260 211 255 111",
  },
  {
    id: "BR-KIT-01",
    name: "Kitwe Central Hub",
    city: "Kitwe",
    inboundToday: 310,
    outboundToday: 350,
    capacityUsed: 84,
    status: "Operational",
    manager: "Evelyn Chilufya",
    phone: "+260 212 223 444",
  },
  {
    id: "BR-NDO-01",
    name: "Ndola Central Branch",
    city: "Ndola",
    inboundToday: 195,
    outboundToday: 210,
    capacityUsed: 52,
    status: "Operational",
    manager: "Josephat Mulenga",
    phone: "+260 212 611 777",
  },
  {
    id: "BR-CHI-01",
    name: "Chingola Hub",
    city: "Chingola",
    inboundToday: 110,
    outboundToday: 95,
    capacityUsed: 40,
    status: "Operational",
    manager: "Florence Bwalya",
    phone: "+260 212 312 999",
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [settingsSubTab, setSettingsSubTab] = useState<"general" | "tariffs">("general");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [parcels, setParcels] = useState<ParcelRecord[]>(INITIAL_PARCELS);
  const [drivers] = useState<DriverRecord[]>(INITIAL_DRIVERS);
  const [branches] = useState<BranchRecord[]>(INITIAL_BRANCHES);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Selected Parcel Modal
  const [selectedParcel, setSelectedParcel] = useState<ParcelRecord | null>(null);

  // New Parcel Modal
  const [newParcelModalOpen, setNewParcelModalOpen] = useState(false);
  const [newSenderName, setNewSenderName] = useState("");
  const [newSenderPhone, setNewSenderPhone] = useState("");
  const [newReceiverName, setNewReceiverName] = useState("");
  const [newReceiverPhone, setNewReceiverPhone] = useState("");
  const [newItem, setNewItem] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newOrigin, setNewOrigin] = useState("Lusaka Downtown");
  const [newDestination, setNewDestination] = useState("Kitwe - Doorstep");

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  // Filtered parcels
  const filteredParcels = useMemo(() => {
    return parcels.filter((p) => {
      const matchesSearch =
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.senderPhone.includes(searchQuery) ||
        p.receiverPhone.includes(searchQuery) ||
        p.item.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All" || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [parcels, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = parcels.length;
    const pending = parcels.filter((p) => p.status === "Pending Pickup").length;
    const transit = parcels.filter((p) => p.status === "In Transit" || p.status === "In Hub").length;
    const outForDel = parcels.filter((p) => p.status === "Out for Delivery").length;
    const delivered = parcels.filter((p) => p.status === "Delivered").length;
    const totalValue = parcels.reduce((acc, p) => acc + p.declaredValue, 0);

    return { total, pending, transit, outForDel, delivered, totalValue };
  }, [parcels]);

  // Handle status update
  function updateParcelStatus(id: string, newStatus: ParcelStatus) {
    setParcels((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    if (selectedParcel && selectedParcel.id === id) {
      setSelectedParcel((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Order ${id} updated to "${newStatus}"`);
  }

  // Handle assign driver
  function assignDriverToParcel(id: string, driverName: string) {
    setParcels((prev) =>
      prev.map((p) => (p.id === id ? { ...p, driver: driverName } : p))
    );
    if (selectedParcel && selectedParcel.id === id) {
      setSelectedParcel((prev) => (prev ? { ...prev, driver: driverName } : null));
    }
    showToast(`Assigned ${driverName} to order ${id}`);
  }

  // Handle add manual parcel
  function handleCreateManualParcel(e: React.FormEvent) {
    e.preventDefault();
    const newId = `TX-${Math.floor(1000 + Math.random() * 9000)}-ZM`;
    const created: ParcelRecord = {
      id: newId,
      senderName: newSenderName || "Walk-in Customer",
      senderPhone: newSenderPhone || "+260 97 000 0000",
      receiverName: newReceiverName || "Recipient",
      receiverPhone: newReceiverPhone || "+260 96 000 0000",
      item: newItem || "General Package",
      description: newDesc || "Standard dispatch parcel",
      declaredValue: Number(newValue) || 1000,
      origin: newOrigin,
      destination: newDestination,
      pickupType: "Branch",
      deliveryType: "Doorstep",
      speed: "Same-Day",
      status: "Pending Pickup",
      driver: "Unassigned",
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
    };

    setParcels([created, ...parcels]);
    setNewParcelModalOpen(false);
    showToast(`New shipment ${newId} created successfully!`);

    // Reset form
    setNewSenderName("");
    setNewSenderPhone("");
    setNewReceiverName("");
    setNewReceiverPhone("");
    setNewItem("");
    setNewDesc("");
    setNewValue("");
  }

  return (
    <div className="admin-light-theme relative min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast" role="alert">
          <span className="admin-toast__icon">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── STICKY TOP HEADER BAR (Mobile & Desktop) ── */}
      <header className="sticky top-0 z-40 h-16 border-b border-[#e2e8f0] bg-white/95 backdrop-blur-md px-2 sm:px-4 flex items-center justify-between gap-2 sm:gap-4 shadow-xs">
        {/* Left Section: Hamburger Button (Top Left on Mobile) + Logo */}
        <div className="flex items-center gap-2 shrink-0 md:w-64 md:px-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center justify-center h-9 w-9 rounded-lg border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f8fafc] md:hidden"
            aria-label="Open Navigation Menu"
          >
            <svg className="w-5 h-5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="hidden md:flex items-center">
            <Link href="/" className="admin-brand-logo" aria-label="Thunder Express Home">
              <span>Thunder</span>
              <span className="admin-brand-bolt" aria-hidden="true" />
              <span className="text-[#0284c7]">Admin</span>
            </Link>
          </div>
        </div>

        {/* Global Search bar */}
        <div className="relative flex-1 min-w-0 max-w-xs sm:max-w-md">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders…"
            className="admin-search-input text-xs sm:text-sm pl-8 sm:pl-9 pr-2"
          />
          <svg
            className="admin-search-icon"
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="8.5" cy="8.5" r="5" />
            <path d="M12 12l4.5 4.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Right Section: Create Booking Action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setNewParcelModalOpen(true)}
            className="admin-btn-primary px-2.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
          >
            + <span className="hidden sm:inline">Create </span>Booking
          </button>
        </div>
      </header>

      {/* ── MAIN BODY WITH STICKY LEFT SIDEBAR (Desktop) ── */}
      <div className="flex flex-1 items-start">
        {/* ── STICKY LEFT SIDEBAR MENU ── */}
        <aside className="hidden md:flex sticky top-16 h-[calc(100vh-64px)] w-64 shrink-0 border-r border-[#e2e8f0] bg-white flex-col justify-between p-4 overflow-y-auto">
          <div>
            <p className="px-3 text-xs font-bold tracking-wider text-[#94a3b8] uppercase mb-2">
              Navigation
            </p>
            <nav className="space-y-1">
              {[
                {
                  key: "overview" as AdminTab,
                  label: "Overview",
                  icon: (
                    <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="14" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                  ),
                },
                {
                  key: "parcels" as AdminTab,
                  label: `Bookings (${parcels.length})`,
                  icon: (
                    <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                    </svg>
                  ),
                },
                {
                  key: "drivers" as AdminTab,
                  label: `Drivers (${drivers.length})`,
                  icon: (
                    <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="9" cy="7" r="4" />
                      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeLinecap="round" />
                      <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.85" strokeLinecap="round" />
                    </svg>
                  ),
                },
                {
                  key: "branches" as AdminTab,
                  label: `Fleet & Hubs (${branches.length})`,
                  icon: (
                    <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="1" y="3" width="15" height="13" rx="2" />
                      <path d="M16 8h4l3 3v5h-7V8z" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  ),
                },
                {
                  key: "analytics" as AdminTab,
                  label: "Analytics",
                  icon: (
                    <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 3v18h18M18 9l-5 5-4-4-5 5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  key: "settings" as AdminTab,
                  label: "Settings",
                  icon: (
                    <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                    </svg>
                  ),
                },
              ].map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveTab(item.key)}
                    className={`admin-sidebar-tab ${isActive ? "admin-sidebar-tab--active" : ""}`}
                  >
                    <span className="shrink-0 text-[#64748b]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer - Admin Profile & Logout */}
          <div className="border-t border-[#e2e8f0] pt-4 mt-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0284c7] text-xs font-bold text-white shadow-xs">
                  AD
                </div>
                <div className="overflow-hidden leading-tight">
                  <strong className="block text-xs font-bold text-[#0f172a] truncate">Admin User</strong>
                  <span className="block text-[0.7rem] text-[#64748b] truncate">ops@texpress.co.zm</span>
                </div>
              </div>
              <Link
                href="/"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#64748b] hover:bg-[#fef2f2] hover:text-[#ef4444] transition"
                title="Sign Out"
              >
                <svg className="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" />
                  <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
                </svg>
              </Link>
            </div>
          </div>
        </aside>

        {/* ── CONTENT AREA ── */}
        <main className="flex-1 min-w-0 w-full max-w-full overflow-x-hidden p-3 sm:p-4 md:p-6 pb-24 md:pb-6">
          {/* ── TAB 1: OVERVIEW ── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* KPI Cards Summary (Clean without subtext descriptions) */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <div className="admin-stat-card">
                  <span className="admin-stat-card__label">Total Orders</span>
                  <strong className="admin-stat-card__val text-[#0f172a]">{stats.total}</strong>
                </div>

                <div className="admin-stat-card">
                  <span className="admin-stat-card__label">Pending Pickup</span>
                  <strong className="admin-stat-card__val text-[#d97706]">{stats.pending}</strong>
                </div>

                <div className="admin-stat-card">
                  <span className="admin-stat-card__label">In Transit / Hub</span>
                  <strong className="admin-stat-card__val text-[#0284c7]">{stats.transit}</strong>
                </div>

                <div className="admin-stat-card">
                  <span className="admin-stat-card__label">Out for Delivery</span>
                  <strong className="admin-stat-card__val text-[#7c3aed]">{stats.outForDel}</strong>
                </div>

                <div className="admin-stat-card">
                  <span className="admin-stat-card__label">Delivered Today</span>
                  <strong className="admin-stat-card__val text-[#059669]">{stats.delivered}</strong>
                </div>

                <div className="admin-stat-card">
                  <span className="admin-stat-card__label">Declared Cargo</span>
                  <strong className="admin-stat-card__val text-[#0f172a]">
                    K{(stats.totalValue / 1000).toFixed(1)}k
                  </strong>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column (2 cols): Delivery Volume Graph + Recent Active Shipments */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Delivery Volume Graph Card */}
                  <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h2 className="text-base font-bold text-[#0f172a]">Weekly Delivery Volume</h2>
                        <p className="text-xs text-[#64748b]">
                          Daily shipment dispatches & completed handoffs
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1.5 text-[#334155]">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#0284c7]" />
                            Dispatched
                          </span>
                          <span className="flex items-center gap-1.5 text-[#334155]">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
                            Delivered
                          </span>
                        </div>
                        <div className="flex items-center rounded-md border border-[#e2e8f0] bg-[#f8fafc] p-0.5 text-xs font-medium text-[#475569]">
                          <button type="button" className="rounded bg-white px-2.5 py-1 text-[#0284c7] font-semibold shadow-xs">
                            7 Days
                          </button>
                          <button type="button" className="px-2.5 py-1 hover:text-[#0f172a]">
                            30 Days
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* SVG Area & Trend Chart */}
                    <div className="relative h-44 w-full">
                      <svg className="h-full w-full overflow-visible" viewBox="0 0 500 140" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Grid Lines */}
                        <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                        <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />

                        {/* Area Fill */}
                        <path
                          d="M 10,95 Q 80,70 150,55 T 290,40 T 430,25 T 490,45 L 490,130 L 10,130 Z"
                          fill="url(#chartGradient)"
                        />

                        {/* Line Path - Dispatched */}
                        <path
                          d="M 10,95 Q 80,70 150,55 T 290,40 T 430,25 T 490,45"
                          fill="none"
                          stroke="#0284c7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Line Path - Delivered */}
                        <path
                          d="M 10,105 Q 80,82 150,68 T 290,52 T 430,35 T 490,58"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                          strokeLinecap="round"
                        />

                        {/* Data Circles */}
                        {[
                          { x: 10, y: 95 },
                          { x: 90, y: 70 },
                          { x: 170, y: 55 },
                          { x: 250, y: 48 },
                          { x: 330, y: 38 },
                          { x: 410, y: 25 },
                          { x: 490, y: 45 },
                        ].map((pt, i) => (
                          <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="white" stroke="#0284c7" strokeWidth="2" />
                        ))}
                      </svg>

                      {/* X Axis Day Labels */}
                      <div className="mt-2 flex justify-between px-1 text-xs text-[#64748b]">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Active Shipments Table Card */}
                  <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                        Recent Active Shipments
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab("parcels")}
                        className="text-xs font-semibold text-[#0284c7] hover:underline"
                      >
                        View All Orders →
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Tracking ID</th>
                            <th>Sender</th>
                            <th>Receiver</th>
                            <th>Destination</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parcels.slice(0, 5).map((p) => (
                            <tr key={p.id}>
                              <td className="font-mono font-bold text-[#0284c7]">{p.id}</td>
                              <td>
                                <div>
                                  <strong className="block text-xs text-[#0f172a] font-semibold">{p.senderName}</strong>
                                  <small className="text-[0.68rem] text-[#64748b]">{p.senderPhone}</small>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <strong className="block text-xs text-[#0f172a] font-semibold">{p.receiverName}</strong>
                                  <small className="text-[0.68rem] text-[#64748b]">{p.receiverPhone}</small>
                                </div>
                              </td>
                              <td className="text-xs text-[#334155]">{p.destination}</td>
                              <td>
                                <StatusBadge status={p.status} />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  onClick={() => setSelectedParcel(p)}
                                  className="rounded border border-[#cbd5e1] bg-white px-2.5 py-1 text-xs font-medium text-[#0284c7] hover:bg-[#f8fafc]"
                                >
                                  Inspect
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right Column (1 col): Live Activity Feed */}
                <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 flex flex-col">
                  <h2 className="text-base font-bold text-[#0f172a] mb-4">Live Dispatch Log</h2>

                <div className="space-y-3.5 overflow-y-auto flex-1 max-h-[500px] pr-1">
                  {[
                    {
                      time: "14:32",
                      title: "Order TX-9041-ZM Status Changed",
                      desc: "Driver Kelvin Phiri marked shipment as IN TRANSIT to Kitwe.",
                    },
                    {
                      time: "13:45",
                      title: "New Booking Created",
                      desc: "Kabwe General Hospital booked urgent medical sample delivery.",
                    },
                    {
                      time: "12:10",
                      title: "Order TX-9037-ZM Delivered",
                      desc: "Delivered to Alice Lungu in Ndola. Recipient signed.",
                    },
                    {
                      time: "11:15",
                      title: "Driver Assigned",
                      desc: "Chanda Musonda assigned to parcel TX-9040-ZM.",
                    },
                    {
                      time: "09:30",
                      title: "Branch Sort Complete",
                      desc: "Lusaka Downtown Hub completed morning outbound batch.",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 border-b border-[#f1f5f9] pb-3">
                      <span className="rounded bg-[#f1f5f9] px-2 py-0.5 font-mono text-[0.65rem] font-medium text-[#475569]">
                        {item.time}
                      </span>
                      <div>
                        <strong className="block text-xs text-[#0f172a] font-semibold">{item.title}</strong>
                        <p className="mt-0.5 text-[0.72rem] text-[#64748b] leading-tight">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

          {/* ── TAB 2: PARCELS & BOOKINGS TABLE ── */}
          {activeTab === "parcels" && (
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
              {/* Header controls & filters */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-[#0f172a]">Active Shipments</h2>
                  <p className="text-xs text-[#64748b]">
                    Manage orders, update statuses, and inspect booking details.
                  </p>
                </div>

                {/* Status filter chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    "All",
                    "Pending Pickup",
                    "In Hub",
                    "In Transit",
                    "Out for Delivery",
                    "Delivered",
                  ].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                        statusFilter === st
                          ? "bg-[#0284c7] text-white"
                          : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Tracking ID</th>
                      <th>Sender Info</th>
                      <th>Receiver Info</th>
                      <th>Item & Value</th>
                      <th>Route</th>
                      <th>Status</th>
                      <th>Assigned Driver</th>
                      <th>Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParcels.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-sm text-[#64748b]">
                          No shipments found matching &quot;{searchQuery}&quot; or current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredParcels.map((p) => (
                        <tr key={p.id}>
                          <td className="font-mono font-bold text-[#0284c7]">
                            <button
                              type="button"
                              onClick={() => setSelectedParcel(p)}
                              className="hover:underline text-left"
                            >
                              {p.id}
                            </button>
                            <span className="block text-[0.65rem] text-[#94a3b8] font-sans font-normal">
                              {p.date}
                            </span>
                          </td>

                          <td>
                            <div>
                              <strong className="block text-xs text-[#0f172a] font-semibold">{p.senderName}</strong>
                              <small className="text-[0.68rem] text-[#64748b]">{p.senderPhone}</small>
                            </div>
                          </td>

                          <td>
                            <div>
                              <strong className="block text-xs text-[#0f172a] font-semibold">{p.receiverName}</strong>
                              <small className="text-[0.68rem] text-[#64748b]">{p.receiverPhone}</small>
                            </div>
                          </td>

                          <td>
                            <div>
                              <strong className="block text-xs text-[#0f172a] font-semibold">{p.item}</strong>
                              <span className="text-[0.68rem] text-[#0284c7] font-semibold">
                                K{p.declaredValue.toLocaleString()} ZMW
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="text-xs text-[#334155]">
                              <span>{p.origin}</span>
                              <span className="mx-1 text-[#94a3b8]">→</span>
                              <strong className="text-[#0f172a] font-semibold">{p.destination}</strong>
                            </div>
                          </td>

                          <td>
                            <StatusBadge status={p.status} />
                          </td>

                          <td>
                            <select
                              value={p.driver || "Unassigned"}
                              onChange={(e) => assignDriverToParcel(p.id, e.target.value)}
                              className="admin-select-sm"
                            >
                              <option value="Unassigned">Unassigned</option>
                              {drivers.map((d) => (
                                <option key={d.id} value={d.name}>
                                  {d.name} ({d.vehicle})
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <div className="flex items-center gap-2">
                              <select
                                value={p.status}
                                onChange={(e) =>
                                  updateParcelStatus(p.id, e.target.value as ParcelStatus)
                                }
                                className="admin-select-sm"
                              >
                                <option value="Pending Pickup">Pending Pickup</option>
                                <option value="In Hub">In Hub</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Exception">Exception</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => setSelectedParcel(p)}
                                className="rounded border border-[#cbd5e1] bg-white px-2.5 py-1 text-xs font-medium text-[#0284c7] hover:bg-[#f8fafc]"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB 3: FLEET & COURIERS ── */}
          {activeTab === "drivers" && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-xl border border-[#e2e8f0] bg-white p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-[#0f172a]">Couriers & Fleet Roster</h2>
                    <p className="text-xs text-[#64748b]">
                      Active couriers, vehicle capacity, and live assignments.
                    </p>
                  </div>
                  <span className="text-xs text-[#0284c7] font-semibold">
                    {drivers.filter((d) => d.status === "On Delivery").length} On Active Delivery
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Driver Name</th>
                        <th>Vehicle</th>
                        <th>Hub Base</th>
                        <th>Status</th>
                        <th>Active Packages</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drivers.map((d) => (
                        <tr key={d.id}>
                          <td>
                            <div>
                              <strong className="block text-xs text-[#0f172a] font-semibold">{d.name}</strong>
                              <small className="text-[0.68rem] text-[#64748b]">{d.phone}</small>
                            </div>
                          </td>

                          <td className="text-xs text-[#0f172a] font-medium">{d.vehicle}</td>
                          <td className="text-xs text-[#475569]">{d.baseHub}</td>
                          <td>
                            <span
                              className={`inline-block rounded-full px-2.5 py-0.5 text-[0.68rem] font-medium ${
                                d.status === "On Delivery"
                                  ? "bg-[#ecfdf5] text-[#047857]"
                                  : d.status === "Available"
                                  ? "bg-[#f0f9ff] text-[#0369a1]"
                                  : "bg-[#f1f5f9] text-[#64748b]"
                              }`}
                            >
                              {d.status}
                            </span>
                          </td>
                          <td className="font-bold text-center text-[#0f172a]">{d.activeParcels}</td>
                          <td className="text-xs font-semibold text-[#334155]">{d.rating} / 5.0</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Vehicle Fleet Breakdown */}
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
                <h3 className="text-sm font-bold text-[#0f172a] mb-4">Fleet Allocation</h3>
                <div className="space-y-3">
                  <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#0f172a]">Motorbikes (Last Mile)</span>
                      <strong className="text-[#0284c7]">18 Active</strong>
                    </div>
                    <p className="mt-1 text-[0.7rem] text-[#64748b]">
                      Rapid city deliveries in Lusaka & Kitwe.
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#0f172a]">Express Vans (Inter-city)</span>
                      <strong className="text-[#059669]">12 Active</strong>
                    </div>
                    <p className="mt-1 text-[0.7rem] text-[#64748b]">
                      Scheduled daily runs between Lusaka, Ndola & Kitwe.
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#0f172a]">3-Ton Freight Trucks</span>
                      <strong className="text-[#d97706]">6 Active</strong>
                    </div>
                    <p className="mt-1 text-[0.7rem] text-[#64748b]">
                      Heavy cargo & commercial transfers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 4: BRANCH NETWORK ── */}
          {activeTab === "branches" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {branches.map((b) => (
                <div key={b.id} className="rounded-xl border border-[#e2e8f0] bg-white p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[0.65rem] font-mono text-[#0284c7] font-bold">
                        {b.id}
                      </span>
                      <h3 className="text-base font-bold text-[#0f172a] mt-0.5">{b.name}</h3>
                      <p className="text-xs text-[#64748b]">{b.city}, Zambia</p>
                    </div>
                    <span className="rounded-full bg-[#ecfdf5] px-2.5 py-0.5 text-[0.65rem] font-medium text-[#047857]">
                      {b.status}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#f1f5f9] pt-4">
                    <div>
                      <span className="text-[0.65rem] text-[#64748b] uppercase font-medium">Inbound Today</span>
                      <p className="text-base font-bold text-[#0f172a]">{b.inboundToday} pkg</p>
                    </div>
                    <div>
                      <span className="text-[0.65rem] text-[#64748b] uppercase font-medium">Outbound Dispatched</span>
                      <p className="text-base font-bold text-[#0f172a]">{b.outboundToday} pkg</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#64748b]">Sorting Capacity</span>
                      <strong className="text-[#0f172a]">{b.capacityUsed}%</strong>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#e2e8f0] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          b.capacityUsed > 80 ? "bg-[#d97706]" : "bg-[#0284c7]"
                        }`}
                        style={{ width: `${b.capacityUsed}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 border-t border-[#f1f5f9] pt-3 text-[0.72rem] text-[#64748b] flex justify-between">
                    <span>Manager: <strong className="text-[#0f172a] font-semibold">{b.manager}</strong></span>
                    <span>{b.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── TAB 5: ANALYTICS & REVENUE ── */}
          {activeTab === "analytics" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
                <h2 className="text-base font-bold text-[#0f172a] mb-1">Revenue & Volume Growth</h2>
                <p className="text-xs text-[#64748b] mb-6">
                  Daily ZMW earnings across Lusaka, Copperbelt & Central provinces.
                </p>

                <div className="space-y-4">
                  {[
                    { region: "Lusaka Province", amount: "ZMW 28,450", pct: 58 },
                    { region: "Copperbelt (Kitwe/Ndola)", amount: "ZMW 15,200", pct: 31 },
                    { region: "Central & Northwestern", amount: "ZMW 5,400", pct: 11 },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-[#0f172a]">{item.region}</span>
                        <strong className="text-[#0284c7]">{item.amount}</strong>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#f1f5f9] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#0284c7]"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
                <h2 className="text-base font-bold text-[#0f172a] mb-1">Service Performance KPIs</h2>
                <p className="text-xs text-[#64748b] mb-6">
                  Operational benchmarks and target fulfillment.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4 text-center">
                    <span className="text-xs font-medium text-[#64748b]">Same-Day Success Rate</span>
                    <p className="mt-1 text-2xl font-bold text-[#059669]">97.8%</p>
                    <small className="text-[0.68rem] text-[#94a3b8]">Target: &gt;95%</small>
                  </div>

                  <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4 text-center">
                    <span className="text-xs font-medium text-[#64748b]">Avg Transit Time</span>
                    <p className="mt-1 text-2xl font-bold text-[#0284c7]">118 min</p>
                    <small className="text-[0.68rem] text-[#94a3b8]">Lusaka to Kitwe</small>
                  </div>

                  <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4 text-center">
                    <span className="text-xs font-medium text-[#64748b]">Customer CSAT</span>
                    <p className="mt-1 text-2xl font-bold text-[#334155]">4.9 / 5</p>
                    <small className="text-[0.68rem] text-[#94a3b8]">Based on 1,840 reviews</small>
                  </div>

                  <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4 text-center">
                    <span className="text-xs font-medium text-[#64748b]">Damage Claim Rate</span>
                    <p className="mt-1 text-2xl font-bold text-[#059669]">0.02%</p>
                    <small className="text-[0.68rem] text-[#94a3b8]">Industry leading</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 6: SETTINGS ── */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#0f172a]">System & Operational Settings</h2>
                  <p className="text-xs text-[#64748b]">
                    Manage company details, shipping tariff matrix, active hubs & SMS triggers
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setToastMessage("Settings saved successfully!")}
                  className="admin-btn-primary self-start sm:self-auto"
                >
                  Save Changes
                </button>
              </div>

              {/* Settings Sub-tab Navigation */}
              <div className="flex border-b border-[#e2e8f0] gap-6">
                <button
                  type="button"
                  onClick={() => setSettingsSubTab("general")}
                  className={`pb-3 text-sm font-semibold border-b-2 transition ${
                    settingsSubTab === "general"
                      ? "border-[#0284c7] text-[#0284c7]"
                      : "border-transparent text-[#64748b] hover:text-[#0f172a]"
                  }`}
                >
                  General Settings
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsSubTab("tariffs")}
                  className={`pb-3 text-sm font-semibold border-b-2 transition ${
                    settingsSubTab === "tariffs"
                      ? "border-[#0284c7] text-[#0284c7]"
                      : "border-transparent text-[#64748b] hover:text-[#0f172a]"
                  }`}
                >
                  Shipping Tariffs & Pricing Rules
                </button>
              </div>

              {/* ── SUB-TAB 1: GENERAL SETTINGS ── */}
              {settingsSubTab === "general" && (
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Left Column (2 cols): General & SMS Triggers */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* General Business Info */}
                    <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
                      <h3 className="text-sm font-bold text-[#0f172a] mb-3 pb-2 border-b border-[#f1f5f9]">
                        General Business Details
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="admin-form-label">Company Legal Name</label>
                          <input type="text" defaultValue="T-Express Logistics Zambia Ltd" className="admin-input" />
                        </div>
                        <div>
                          <label className="admin-form-label">Default Currency</label>
                          <select className="admin-select">
                            <option value="ZMW">ZMW (K) - Zambian Kwacha</option>
                            <option value="USD">USD ($) - US Dollar</option>
                          </select>
                        </div>
                        <div>
                          <label className="admin-form-label">Support Email</label>
                          <input type="email" defaultValue="ops@texpress.co.zm" className="admin-input" />
                        </div>
                        <div>
                          <label className="admin-form-label">Support Hotline</label>
                          <input type="tel" defaultValue="+260 97 100 2000" className="admin-input" />
                        </div>
                      </div>
                    </div>

                    {/* SMS Notification Triggers */}
                    <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
                      <h3 className="text-sm font-bold text-[#0f172a] mb-3 pb-2 border-b border-[#f1f5f9]">
                        SMS & Customer Notification Triggers
                      </h3>
                      <div className="space-y-3">
                        {[
                          { title: "Booking Confirmation SMS", desc: "Send tracking code to sender upon booking creation", defaultChecked: true },
                          { title: "Driver Pickup Alert", desc: "Notify sender when courier arrives at pickup address", defaultChecked: true },
                          { title: "Out for Delivery Alert", desc: "SMS recipient when parcel leaves destination hub", defaultChecked: true },
                          { title: "Delivery Signature Receipt", desc: "Send digital signature link upon delivery completion", defaultChecked: false },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#f8fafc] last:border-0">
                            <div>
                              <strong className="block text-xs font-semibold text-[#0f172a]">{item.title}</strong>
                              <p className="text-[0.72rem] text-[#64748b]">{item.desc}</p>
                            </div>
                            <input
                              type="checkbox"
                              defaultChecked={item.defaultChecked}
                              className="h-4 w-4 rounded border-[#cbd5e1] text-[#0284c7]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (1 col): System Access & Active Hubs */}
                  <div className="space-y-6">
                    <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
                      <h3 className="text-sm font-bold text-[#0f172a] mb-3 pb-2 border-b border-[#f1f5f9]">
                        Active Hub Network
                      </h3>
                      <div className="space-y-3">
                        {[
                          { name: "Lusaka Central Hub", status: "Operational", active: true },
                          { name: "Kitwe Transit Hub", status: "Operational", active: true },
                          { name: "Ndola Regional Hub", status: "Operational", active: true },
                          { name: "Chingola Outpost", status: "Operational", active: true },
                        ].map((hub, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div>
                              <strong className="block text-xs font-semibold text-[#0f172a]">{hub.name}</strong>
                              <span className="text-[0.68rem] text-[#059669] font-medium">{hub.status}</span>
                            </div>
                            <input
                              type="checkbox"
                              defaultChecked={hub.active}
                              className="h-4 w-4 rounded border-[#cbd5e1] text-[#0284c7]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
                      <h3 className="text-sm font-bold text-[#0f172a] mb-3 pb-2 border-b border-[#f1f5f9]">
                        Security & API Credentials
                      </h3>
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="admin-form-label">Active Admin Role</label>
                          <input type="text" value="Super Admin (Full Access)" disabled className="admin-input bg-[#f8fafc]" />
                        </div>
                        <div>
                          <label className="admin-form-label">API Key</label>
                          <div className="flex gap-2">
                            <input type="password" value="sk_live_texpress_90418274" readOnly className="admin-input font-mono text-xs" />
                            <button
                              type="button"
                              onClick={() => setToastMessage("API key copied to clipboard!")}
                              className="shrink-0 rounded-lg border border-[#cbd5e1] bg-white px-3 py-1.5 font-semibold text-[#0284c7] hover:bg-[#f8fafc]"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SUB-TAB 2: SHIPPING TARIFFS & PRICING RULES ── */}
              {settingsSubTab === "tariffs" && (
                <div className="space-y-6">
                  {/* 1. Parcel Size Tier Tariffs (Small, Medium, Large) */}
                  <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-4 pb-2 border-b border-[#f1f5f9]">
                      <div>
                        <h3 className="text-sm font-bold text-[#0f172a]">Parcel Size Tier Tariffs</h3>
                        <p className="text-xs text-[#64748b]">
                          Standard base rates for Small, Medium, and Large parcel sizes
                        </p>
                      </div>
                      <span className="inline-block rounded-md bg-[#eff6ff] px-2.5 py-1 text-xs font-semibold text-[#0284c7]">
                        3 Size Tiers Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {/* Small Parcel Card */}
                      <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-sm font-bold text-[#0f172a]">Small Parcel (S)</strong>
                            <span className="rounded bg-[#e0f2fe] px-2 py-0.5 text-[0.65rem] font-bold text-[#0369a1]">
                              Up to 3 kg
                            </span>
                          </div>
                          <p className="text-[0.72rem] text-[#64748b] mb-3">
                            Documents, phones, keys, small electronics, and light envelopes.
                          </p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-[#e2e8f0]">
                          <div>
                            <label className="admin-form-label">Base Rate (K)</label>
                            <input type="number" defaultValue={75} className="admin-input font-bold text-[#0f172a]" />
                          </div>
                          <div>
                            <label className="admin-form-label">Dimensions Limit</label>
                            <input type="text" defaultValue="30 × 20 × 10 cm" className="admin-input" />
                          </div>
                        </div>
                      </div>

                      {/* Medium Parcel Card */}
                      <div className="rounded-lg border border-[#bae6fd] bg-[#f0f9ff] p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-sm font-bold text-[#0f172a]">Medium Parcel (M)</strong>
                            <span className="rounded bg-[#0284c7] px-2 py-0.5 text-[0.65rem] font-bold text-white">
                              3 kg - 15 kg
                            </span>
                          </div>
                          <p className="text-[0.72rem] text-[#64748b] mb-3">
                            Shoeboxes, laptops, apparel boxes, kitchenware, and medium parcels.
                          </p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-[#bae6fd]">
                          <div>
                            <label className="admin-form-label">Base Rate (K)</label>
                            <input type="number" defaultValue={150} className="admin-input font-bold text-[#0f172a]" />
                          </div>
                          <div>
                            <label className="admin-form-label">Dimensions Limit</label>
                            <input type="text" defaultValue="50 × 40 × 30 cm" className="admin-input" />
                          </div>
                        </div>
                      </div>

                      {/* Large Parcel Card */}
                      <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-sm font-bold text-[#0f172a]">Large Parcel (L)</strong>
                            <span className="rounded bg-[#fef3c7] px-2 py-0.5 text-[0.65rem] font-bold text-[#b45309]">
                              15 kg - 50+ kg
                            </span>
                          </div>
                          <p className="text-[0.72rem] text-[#64748b] mb-3">
                            Heavy equipment, solar inverters, commercial crates, and bulk cargo.
                          </p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-[#e2e8f0]">
                          <div>
                            <label className="admin-form-label">Base Rate (K)</label>
                            <input type="number" defaultValue={350} className="admin-input font-bold text-[#0f172a]" />
                          </div>
                          <div>
                            <label className="admin-form-label">Dimensions Limit</label>
                            <input type="text" defaultValue="100 × 80 × 60 cm" className="admin-input" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Route & Distance Multiplier Matrix */}
                  <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-[#0f172a]">Inter-City Route Multipliers</h3>
                        <p className="text-xs text-[#64748b]">Custom rate multipliers by corridor distance</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setToastMessage("New pricing rule added!")}
                        className="rounded-lg border border-[#cbd5e1] bg-white px-3 py-1.5 text-xs font-semibold text-[#0284c7] hover:bg-[#f8fafc]"
                      >
                        + Add Route Rule
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Origin Hub</th>
                            <th>Destination Hub</th>
                            <th>Distance (km)</th>
                            <th>Base Multiplier</th>
                            <th>Est. SLA</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { origin: "Lusaka Central", dest: "Kitwe Transit", distance: "358 km", mult: "1.00x", sla: "24 Hours", active: true },
                            { origin: "Lusaka Central", dest: "Ndola Hub", distance: "316 km", mult: "0.95x", sla: "24 Hours", active: true },
                            { origin: "Kitwe Transit", dest: "Chingola Outpost", distance: "52 km", mult: "0.60x", sla: "6 Hours", active: true },
                            { origin: "Lusaka Central", dest: "Livingstone Hub", distance: "472 km", mult: "1.35x", sla: "36 Hours", active: true },
                          ].map((rule, idx) => (
                            <tr key={idx}>
                              <td className="font-semibold text-[#0f172a] text-xs">{rule.origin}</td>
                              <td className="font-semibold text-[#0f172a] text-xs">{rule.dest}</td>
                              <td className="text-xs text-[#64748b]">{rule.distance}</td>
                              <td className="font-mono font-bold text-[#0284c7] text-xs">{rule.mult}</td>
                              <td className="text-xs text-[#334155]">{rule.sla}</td>
                              <td>
                                <span className="inline-block rounded px-2 py-0.5 text-[0.65rem] font-medium bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]">
                                  Active Rule
                                </span>
                              </td>
                              <td>
                                <button type="button" className="text-xs font-semibold text-[#64748b] hover:text-[#0f172a]">
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3. Delivery Speed & Special Surcharges */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Service Speed Surcharges */}
                    <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
                      <h3 className="text-sm font-bold text-[#0f172a] mb-3 pb-2 border-b border-[#f1f5f9]">
                        Service Speed Surcharges
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <strong className="block text-xs font-semibold text-[#0f172a]">Same-Day Priority Express</strong>
                            <span className="text-[0.72rem] text-[#64748b]">Direct door-to-door expedited dispatch</span>
                          </div>
                          <div className="w-28">
                            <input type="text" defaultValue="+ K 50.00" className="admin-input text-right font-mono font-semibold" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <strong className="block text-xs font-semibold text-[#0f172a]">Doorstep Final Mile Delivery</strong>
                            <span className="text-[0.72rem] text-[#64748b]">Direct courier drop-off vs branch pickup</span>
                          </div>
                          <div className="w-28">
                            <input type="text" defaultValue="+ K 30.00" className="admin-input text-right font-mono font-semibold" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <strong className="block text-xs font-semibold text-[#0f172a]">Weekend & After-Hours Handling</strong>
                            <span className="text-[0.72rem] text-[#64748b]">Sunday & holiday sorting surcharge</span>
                          </div>
                          <div className="w-28">
                            <input type="text" defaultValue="+ K 35.00" className="admin-input text-right font-mono font-semibold" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cargo Insurance & Valuables Policy */}
                    <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
                      <h3 className="text-sm font-bold text-[#0f172a] mb-3 pb-2 border-b border-[#f1f5f9]">
                        Cargo Insurance & Declared Value Tariff
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="admin-form-label">Insurance Premium Rate (% of declared value)</label>
                          <input type="number" defaultValue={1.5} step="0.1" className="admin-input" />
                        </div>
                        <div>
                          <label className="admin-form-label">Minimum Insurance Charge (K)</label>
                          <input type="number" defaultValue={20} className="admin-input" />
                        </div>
                        <div>
                          <label className="admin-form-label">Maximum Insured Value Limit (K)</label>
                          <input type="number" defaultValue={100000} className="admin-input" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── PARCEL INSPECTION MODAL ── */}
      {selectedParcel && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedParcel(null)}>
          <div
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
              <div>
                <span className="text-xs font-mono text-[#0284c7] font-bold">
                  {selectedParcel.id}
                </span>
                <h2 className="text-lg font-bold text-[#0f172a] mt-0.5">Shipment Inspector</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedParcel(null)}
                className="text-gray-400 hover:text-[#0f172a] text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3">
                  <span className="text-[0.65rem] font-bold text-[#64748b] uppercase">Sender</span>
                  <strong className="block text-sm text-[#0f172a]">{selectedParcel.senderName}</strong>
                  <p className="text-xs text-[#0284c7] font-mono mt-0.5">{selectedParcel.senderPhone}</p>
                </div>

                <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3">
                  <span className="text-[0.65rem] font-bold text-[#64748b] uppercase">Receiver</span>
                  <strong className="block text-sm text-[#0f172a]">{selectedParcel.receiverName}</strong>
                  <p className="text-xs text-[#0284c7] font-mono mt-0.5">{selectedParcel.receiverPhone}</p>
                </div>

                <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3">
                  <span className="text-[0.65rem] font-bold text-[#64748b] uppercase">Item & Value</span>
                  <strong className="block text-sm text-[#0f172a]">{selectedParcel.item}</strong>
                  <p className="text-xs text-[#475569] mt-0.5">{selectedParcel.description}</p>
                  <span className="mt-2 inline-block rounded bg-[#ecfdf5] px-2 py-0.5 text-xs font-semibold text-[#047857]">
                    Declared Value: K{selectedParcel.declaredValue.toLocaleString()} ZMW
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3">
                  <span className="text-[0.65rem] font-bold text-[#64748b] uppercase">Route Details</span>
                  <p className="mt-1 text-xs text-[#0f172a]">
                    <strong>Origin:</strong> {selectedParcel.origin} ({selectedParcel.pickupType})
                  </p>
                  <p className="mt-1 text-xs text-[#0f172a]">
                    <strong>Destination:</strong> {selectedParcel.destination} ({selectedParcel.deliveryType})
                  </p>
                  <p className="mt-1 text-xs text-[#d97706]">
                    Speed: <strong>{selectedParcel.speed}</strong>
                  </p>
                </div>

                <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3">
                  <span className="text-[0.65rem] font-bold text-[#64748b] uppercase">Current Status & Driver</span>
                  <div className="mt-2 flex items-center justify-between">
                    <StatusBadge status={selectedParcel.status} />
                    <span className="text-xs text-[#475569]">
                      Courier: <strong>{selectedParcel.driver || "Unassigned"}</strong>
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#e2e8f0]">
                    <span className="text-[0.68rem] font-semibold text-[#64748b] block mb-2">
                      Update Order Status:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Pending Pickup",
                        "In Hub",
                        "In Transit",
                        "Out for Delivery",
                        "Delivered",
                      ].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => updateParcelStatus(selectedParcel.id, st as ParcelStatus)}
                          className={`rounded px-2.5 py-1 text-[0.7rem] font-medium transition ${
                            selectedParcel.status === st
                              ? "bg-[#0284c7] text-white"
                              : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedParcel(null)}
                className="rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-xs font-semibold text-[#0f172a] hover:bg-[#f8fafc]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE MANUAL BOOKING MODAL ── */}
      {newParcelModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setNewParcelModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 mb-4">
              <h2 className="text-base font-bold text-[#0f172a]">Create Manual Shipment Dispatch</h2>
              <button
                type="button"
                onClick={() => setNewParcelModalOpen(false)}
                className="text-gray-400 hover:text-[#0f172a]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualParcel} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-form-label">Sender Name</label>
                  <input
                    type="text"
                    required
                    value={newSenderName}
                    onChange={(e) => setNewSenderName(e.target.value)}
                    placeholder="Chanda Mwila"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-form-label">Sender Phone</label>
                  <input
                    type="tel"
                    required
                    value={newSenderPhone}
                    onChange={(e) => setNewSenderPhone(e.target.value)}
                    placeholder="+260 97 000 0000"
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-form-label">Receiver Name</label>
                  <input
                    type="text"
                    required
                    value={newReceiverName}
                    onChange={(e) => setNewReceiverName(e.target.value)}
                    placeholder="Mutale Banda"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-form-label">Receiver Phone</label>
                  <input
                    type="tel"
                    required
                    value={newReceiverPhone}
                    onChange={(e) => setNewReceiverPhone(e.target.value)}
                    placeholder="+260 96 000 0000"
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-form-label">Item Name</label>
                  <input
                    type="text"
                    required
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Laptop, Industrial Spare, etc."
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-form-label">Declared Value (ZMW)</label>
                  <input
                    type="number"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="5000"
                    className="admin-input"
                  />
                </div>
              </div>

              <div>
                <label className="admin-form-label">Parcel Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Handling instructions, fragile notice, etc."
                  className="admin-textarea"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-form-label">Origin Hub</label>
                  <select
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="admin-select"
                  >
                    <option value="Lusaka Downtown">Lusaka Downtown</option>
                    <option value="Lusaka Cairo Road">Lusaka Cairo Road</option>
                    <option value="Kitwe Central">Kitwe Central</option>
                  </select>
                </div>

                <div>
                  <label className="admin-form-label">Destination</label>
                  <select
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="admin-select"
                  >
                    <option value="Kitwe - Doorstep">Kitwe - Doorstep</option>
                    <option value="Ndola Branch - Central">Ndola Branch - Central</option>
                    <option value="Chingola - Doorstep">Chingola - Doorstep</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3 border-t border-[#e2e8f0] pt-4">
                <button
                  type="button"
                  onClick={() => setNewParcelModalOpen(false)}
                  className="rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-xs font-semibold text-[#0f172a] hover:bg-[#f8fafc]"
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Dispatch Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAVIGATION BAR ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[#e2e8f0] bg-white/95 backdrop-blur-md px-2 py-2 md:hidden shadow-lg">
        {[
          {
            key: "overview" as AdminTab,
            label: "Overview",
            icon: (
              <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            ),
          },
          {
            key: "parcels" as AdminTab,
            label: "Bookings",
            icon: (
              <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
              </svg>
            ),
          },
          {
            key: "drivers" as AdminTab,
            label: "Drivers",
            icon: (
              <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="9" cy="7" r="4" />
                <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeLinecap="round" />
              </svg>
            ),
          },
          {
            key: "settings" as AdminTab,
            label: "Settings",
            icon: (
              <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            ),
          },
        ].map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={`flex flex-col items-center gap-1 text-[0.7rem] font-medium transition ${
                isActive ? "text-[#0284c7] font-semibold" : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── MOBILE SLIDE-OVER NAVIGATION DRAWER ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content Card */}
          <div className="relative flex w-4/5 max-w-xs flex-1 flex-col justify-between bg-white p-5 shadow-2xl z-10">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e2e8f0]">
                <Link href="/" className="admin-brand-logo text-lg" onClick={() => setMobileMenuOpen(false)}>
                  <span>Thunder</span>
                  <span className="admin-brand-bolt" aria-hidden="true" />
                  <span className="text-[#0284c7]">Admin</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                >
                  ✕
                </button>
              </div>

              <p className="px-2 text-xs font-bold tracking-wider text-[#94a3b8] uppercase mb-3">
                Navigation
              </p>

              {/* Nav Items */}
              <nav className="space-y-1.5">
                {[
                  {
                    key: "overview" as AdminTab,
                    label: "Overview",
                    icon: (
                      <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="14" width="7" height="7" rx="1.5" />
                        <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      </svg>
                    ),
                  },
                  {
                    key: "parcels" as AdminTab,
                    label: `Bookings (${parcels.length})`,
                    icon: (
                      <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                      </svg>
                    ),
                  },
                  {
                    key: "drivers" as AdminTab,
                    label: `Drivers (${drivers.length})`,
                    icon: (
                      <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="9" cy="7" r="4" />
                        <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeLinecap="round" />
                        <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.85" strokeLinecap="round" />
                      </svg>
                    ),
                  },
                  {
                    key: "branches" as AdminTab,
                    label: `Fleet & Hubs (${branches.length})`,
                    icon: (
                      <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="1" y="3" width="15" height="13" rx="2" />
                        <path d="M16 8h4l3 3v5h-7V8z" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    ),
                  },
                  {
                    key: "analytics" as AdminTab,
                    label: "Analytics",
                    icon: (
                      <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 3v18h18M18 9l-5 5-4-4-5 5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                  },
                  {
                    key: "settings" as AdminTab,
                    label: "Settings",
                    icon: (
                      <svg className="w-5 h-5 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                      </svg>
                    ),
                  },
                ].map((item) => {
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.key);
                        setMobileMenuOpen(false);
                      }}
                      className={`admin-sidebar-tab ${isActive ? "admin-sidebar-tab--active" : ""}`}
                    >
                      <span className="shrink-0 text-[#64748b]">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer - Admin Profile & Logout */}
            <div className="border-t border-[#e2e8f0] pt-4 mt-6">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0284c7] text-xs font-bold text-white shadow-xs">
                    AD
                  </div>
                  <div className="overflow-hidden leading-tight">
                    <strong className="block text-xs font-bold text-[#0f172a] truncate">Admin User</strong>
                    <span className="block text-[0.7rem] text-[#64748b] truncate">ops@texpress.co.zm</span>
                  </div>
                </div>
                <Link
                  href="/"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#64748b] hover:bg-[#fef2f2] hover:text-[#ef4444] transition"
                  title="Sign Out"
                >
                  <svg className="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" />
                    <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ParcelStatus }) {
  const badgeClasses: Record<ParcelStatus, string> = {
    "Pending Pickup": "bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]",
    "In Hub": "bg-[#f0f9ff] text-[#0369a1] border border-[#e0f2fe]",
    "In Transit": "bg-[#eef2ff] text-[#4338ca] border border-[#e0e7ff]",
    "Out for Delivery": "bg-[#faf5ff] text-[#6b21a8] border border-[#f3e8ff]",
    Delivered: "bg-[#ecfdf5] text-[#047857] border border-[#d1fae5]",
    Exception: "bg-[#fef2f2] text-[#b91c1c] border border-[#fee2e2]",
  };

  return (
    <span
      className={`inline-block rounded-md px-2 py-0.5 text-[0.68rem] font-medium ${badgeClasses[status]}`}
    >
      {status}
    </span>
  );
}
