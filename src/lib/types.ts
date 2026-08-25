export type DeliveryStatus =
  | "Pending"
  | "Assigned"
  | "Picked up"
  | "In transit"
  | "Delivered"
  | "Delayed"
  | "Failed";

export type Priority = "Standard" | "Express" | "Critical";

export type DriverStatus = "On route" | "Idle" | "Off duty" | "Break";

export type VehicleType = "Van" | "Truck" | "Cargo bike" | "Refrigerated truck";

export type MaintenanceStatus = "Operational" | "Due soon" | "In service" | "Flagged";

export interface GeoPoint {
  x: number; // 0-100 percentage across the abstract map canvas
  y: number; // 0-100 percentage down the abstract map canvas
}

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  plate: string;
  driverId: string | null;
  mileage: number;
  maintenance: MaintenanceStatus;
  nextServiceInMiles: number;
  fuelLevel: number;
  capacityUsed: number;
}

export interface DriverHistoryEntry {
  date: string;
  deliveries: number;
  onTimeRate: number;
}

export interface Driver {
  id: string;
  name: string;
  avatarColor: string;
  initials: string;
  status: DriverStatus;
  vehicleId: string | null;
  deliveriesToday: number;
  deliveriesTotal: number;
  rating: number;
  onTimeRate: number;
  phone: string;
  region: string;
  position: GeoPoint;
  history: DriverHistoryEntry[];
}

export interface TimelineEvent {
  status: DeliveryStatus;
  label: string;
  timestamp: string;
  note?: string;
}

export interface Delivery {
  id: string;
  customer: string;
  customerAddress: string;
  package: string;
  weightKg: number;
  driverId: string | null;
  vehicleId: string | null;
  destination: string;
  status: DeliveryStatus;
  priority: Priority;
  eta: string;
  distanceKm: number;
  createdAt: string;
  origin: GeoPoint;
  destinationPoint: GeoPoint;
  timeline: TimelineEvent[];
  value: number;
}

export interface DailyMetric {
  day: string;
  delivered: number;
  delayed: number;
}
