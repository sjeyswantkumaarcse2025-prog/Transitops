/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'Fleet Manager' | 'Dispatcher' | 'Safety Officer' | 'Financial Analyst';

export interface User {
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
}

export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Out of Service';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  status: VehicleStatus;
  fuelLevel: number; // Percentage 0 - 100
  odometer: number; // in km
  lastService: string; // YYYY-MM-DD
  nextService: string; // YYYY-MM-DD
}

export type DriverStatus = 'Active' | 'On Trip' | 'Off Duty' | 'Suspended';

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  status: DriverStatus;
  assignedVehicleId?: string;
  rating: number; // 1.0 - 5.0
}

export type TripStatus = 'Pending' | 'Active' | 'Completed' | 'Cancelled';

export interface Trip {
  id: string;
  tripId: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  status: TripStatus;
  cargo: string;
  startTime?: string;
  endTime?: string;
  progress: number; // Percentage 0 - 100
}

export type MaintenanceStatus = 'Scheduled' | 'In Progress' | 'Completed';

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  serviceType: string;
  cost: number;
  date: string;
  status: MaintenanceStatus;
  technician: string;
  notes: string;
}

export interface FuelEntry {
  id: string;
  vehicleId: string;
  date: string;
  gallons: number;
  cost: number;
  odometer: number;
  location: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}
