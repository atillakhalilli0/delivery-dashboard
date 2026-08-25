import type {
  Delivery,
  DeliveryStatus,
  Driver,
  DriverStatus,
  MaintenanceStatus,
  Priority,
  Vehicle,
  VehicleType,
  GeoPoint,
  DailyMetric,
} from "./types";

// Deterministic pseudo-random generator so server & client renders match exactly.
function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(88422);
const pick = <T,>(arr: readonly T[]): T => {
  const item = arr[Math.floor(rand() * arr.length)];
  if (item === undefined) throw new Error("empty array");
  return item;
};
const range = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

const FIRST_NAMES = [
  "Marcus", "Elena", "Rafael", "Sana", "Tobias", "Priya", "Declan", "Winnie",
  "Jonas", "Amara", "Felix", "Noor", "Griffin", "Yuki", "Owen", "Leilani",
  "Hassan", "Ingrid", "Diego", "Mei",
];
const LAST_NAMES = [
  "Okafor", "Reyes", "Bergström", "Patel", "Kowalski", "Nakamura", "Fitzgerald",
  "Solis", "Andersen", "Osei", "Marchetti", "Volkov", "Choi", "Larsson", "Haddad",
];

const REGIONS = ["North Loop", "Riverside", "Harbor District", "Midtown", "West End", "Eastgate"];

const CUSTOMERS = [
  "Norrland Foods Co.", "Bright Path Clinic", "Union Textile Supply", "Kestrel Robotics",
  "Marlowe & Finch Books", "Solstice Bakery", "Vantage Hardware", "Cobalt Analytics",
  "Ferro Machine Works", "Willow Creek Nursery", "Ampersand Studio", "Granite Peak Outfitters",
  "Lighthouse Pharmacy", "Delta Grain Co-op", "Northbound Coffee Roasters", "Ivy & Oak Furniture",
  "Pinehurst Dental Group", "Cascade Auto Parts", "Meridian Textbooks", "Redwood Produce",
];

const STREETS = [
  "Harbor Ave", "9th St", "Elmwood Dr", "Kestrel Way", "Cannery Row", "Union Sq",
  "Foundry Ln", "Birchwood Ct", "Dockside Blvd", "Maple Terrace", "Ironworks Rd",
  "Cedar Crossing", "Granary St", "Wharf Rd", "Aspen Loop",
];

const PACKAGES = [
  "Pallet — dry goods", "Cold chain box (2°–8°C)", "Document tube", "Machine part crate",
  "Pharmacy parcel", "Furniture — flat pack", "Electronics carton", "Textile bundle",
  "Bakery order — insulated", "Auto parts box", "Produce crate", "Hardware kit",
];

const STATUSES: DeliveryStatus[] = [
  "Pending", "Assigned", "Picked up", "In transit", "Delivered", "Delayed", "Failed",
];
const STATUS_WEIGHTS = [6, 8, 10, 22, 40, 10, 4];

function weightedStatus(): DeliveryStatus {
  const total = STATUS_WEIGHTS.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < STATUSES.length; i++) {
    r -= STATUS_WEIGHTS[i] ?? 0;
    if (r <= 0) return STATUSES[i] ?? "Pending";
  }
  return "Pending";
}

const PRIORITIES: Priority[] = ["Standard", "Express", "Critical"];
const PRIORITY_WEIGHTS = [60, 30, 10];
function weightedPriority(): Priority {
  const total = PRIORITY_WEIGHTS.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < PRIORITIES.length; i++) {
    r -= PRIORITY_WEIGHTS[i] ?? 0;
    if (r <= 0) return PRIORITIES[i] ?? "Standard";
  }
  return "Standard";
}

const VEHICLE_TYPES: VehicleType[] = ["Van", "Truck", "Cargo bike", "Refrigerated truck"];
const MAINTENANCE: MaintenanceStatus[] = ["Operational", "Due soon", "In service", "Flagged"];
const MAINTENANCE_WEIGHTS = [64, 20, 10, 6];
function weightedMaintenance(): MaintenanceStatus {
  const total = MAINTENANCE_WEIGHTS.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < MAINTENANCE.length; i++) {
    r -= MAINTENANCE_WEIGHTS[i] ?? 0;
    if (r <= 0) return MAINTENANCE[i] ?? "Operational";
  }
  return "Operational";
}

const AVATAR_COLORS = [
  "#FF7A1A", "#2FB6A6", "#7C8CFF", "#E8598B", "#33C481", "#F0B429", "#6E7BFF", "#4EC9E0",
];

function makePoint(): GeoPoint {
  return { x: range(8, 92), y: range(10, 88) };
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ---------- Vehicles ----------
const VEHICLE_COUNT = 16;
export const vehicles: Vehicle[] = Array.from({ length: VEHICLE_COUNT }, (_, i) => {
  const type = pick(VEHICLE_TYPES);
  const mileage = range(4200, 98000);
  return {
    id: `VH-${String(1000 + i)}`,
    name: `${type} ${String.fromCharCode(65 + (i % 26))}${range(10, 99)}`,
    type,
    plate: `${pick(["ABX", "KLN", "TRQ", "GWD", "MPL", "ZYX"])}-${range(100, 999)}`,
    driverId: null,
    mileage,
    maintenance: weightedMaintenance(),
    nextServiceInMiles: range(150, 4200),
    fuelLevel: range(18, 100),
    capacityUsed: range(20, 98),
  };
});

// ---------- Drivers ----------
const DRIVER_COUNT = 18;
export const drivers: Driver[] = Array.from({ length: DRIVER_COUNT }, (_, i) => {
  const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  const vehicle = vehicles[i % vehicles.length];
  const deliveriesTotal = range(210, 1450);
  const history = Array.from({ length: 7 }, (_, d) => ({
    date: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d] ?? "Mon",
    deliveries: range(8, 34),
    onTimeRate: range(82, 100),
  }));
  return {
    id: `DR-${String(200 + i)}`,
    name,
    avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length] ?? "#FF7A1A",
    initials: initialsOf(name),
    status: pick<DriverStatus>(["On route", "On route", "On route", "Idle", "Break", "Off duty"]),
    vehicleId: vehicle?.id ?? null,
    deliveriesToday: range(3, 26),
    deliveriesTotal,
    rating: Math.round((3.7 + rand() * 1.3) * 10) / 10,
    onTimeRate: range(84, 99),
    phone: `+1 (${range(200, 989)}) 555-${String(range(1000, 9999))}`,
    region: pick(REGIONS),
    position: makePoint(),
    history,
  };
});

// wire drivers back onto vehicles
drivers.forEach((d) => {
  const v = vehicles.find((veh) => veh.id === d.vehicleId);
  if (v) v.driverId = d.id;
});

// ---------- Deliveries ----------
const DELIVERY_COUNT = 64;
function timelineFor(status: DeliveryStatus, createdAt: string): Delivery["timeline"] {
  const order: DeliveryStatus[] = ["Pending", "Assigned", "Picked up", "In transit", "Delivered"];
  const idx = status === "Delayed" || status === "Failed" ? 3 : order.indexOf(status);
  const events: Delivery["timeline"] = [];
  const labels: Record<DeliveryStatus, string> = {
    Pending: "Order received",
    Assigned: "Driver assigned",
    "Picked up": "Package picked up",
    "In transit": "En route to destination",
    Delivered: "Delivered to recipient",
    Delayed: "Delay reported",
    Failed: "Delivery attempt failed",
  };
  for (let i = 0; i <= idx && i < order.length; i++) {
    const s = order[i];
    if (!s) continue;
    events.push({ status: s, label: labels[s], timestamp: createdAt });
  }
  if (status === "Delayed") {
    events.push({ status: "Delayed", label: labels.Delayed, timestamp: createdAt, note: "Traffic congestion on primary route" });
  }
  if (status === "Failed") {
    events.push({ status: "Failed", label: labels.Failed, timestamp: createdAt, note: "Recipient unavailable at address" });
  }
  return events;
}

export const deliveries: Delivery[] = Array.from({ length: DELIVERY_COUNT }, (_, i) => {
  const status = weightedStatus();
  const driver = status === "Pending" ? null : pick(drivers);
  const createdHour = range(0, 22);
  const createdAt = `Today, ${String(createdHour).padStart(2, "0")}:${pick(["00", "15", "30", "45"])}`;
  const etaHour = Math.min(23, createdHour + range(1, 5));
  return {
    id: `FF-${String(48200 + i)}`,
    customer: pick(CUSTOMERS),
    customerAddress: `${range(100, 4899)} ${pick(STREETS)}`,
    package: pick(PACKAGES),
    weightKg: Math.round((rand() * 48 + 0.5) * 10) / 10,
    driverId: driver?.id ?? null,
    vehicleId: driver?.vehicleId ?? null,
    destination: `${range(100, 4899)} ${pick(STREETS)}`,
    status,
    priority: weightedPriority(),
    eta: status === "Delivered" ? "Completed" : status === "Failed" ? "—" : `${String(etaHour).padStart(2, "0")}:${pick(["00", "15", "30", "45"])}`,
    distanceKm: Math.round((rand() * 38 + 1.2) * 10) / 10,
    createdAt,
    origin: makePoint(),
    destinationPoint: makePoint(),
    timeline: timelineFor(status, createdAt),
    value: Math.round(rand() * 1800 + 45),
  };
});

// ---------- Analytics ----------
export const weeklyMetrics: DailyMetric[] = [
  { day: "Mon", delivered: 1280, delayed: 32 },
  { day: "Tue", delivered: 1390, delayed: 24 },
  { day: "Wed", delivered: 1502, delayed: 41 },
  { day: "Thu", delivered: 1440, delayed: 19 },
  { day: "Fri", delivered: 1610, delayed: 37 },
  { day: "Sat", delivered: 980, delayed: 15 },
  { day: "Sun", delivered: 812, delayed: 11 },
];

export const monthlyDeliveryTime = [
  { week: "W1", avgMinutes: 38 },
  { week: "W2", avgMinutes: 35 },
  { week: "W3", avgMinutes: 41 },
  { week: "W4", avgMinutes: 33 },
  { week: "W5", avgMinutes: 30 },
  { week: "W6", avgMinutes: 32 },
];

export const driverLeaderboard = [...drivers]
  .sort((a, b) => b.onTimeRate - a.onTimeRate || b.deliveriesTotal - a.deliveriesTotal)
  .slice(0, 8);

export function getDriverById(id: string | null): Driver | undefined {
  if (!id) return undefined;
  return drivers.find((d) => d.id === id);
}

export function getVehicleById(id: string | null): Vehicle | undefined {
  if (!id) return undefined;
  return vehicles.find((v) => v.id === id);
}
