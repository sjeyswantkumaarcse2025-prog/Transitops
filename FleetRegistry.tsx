/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Wrench, 
  Gauge, 
  Fuel, 
  Calendar, 
  Lock, 
  CheckCircle, 
  AlertOctagon, 
  ShieldAlert, 
  Check, 
  Trash2,
  SlidersHorizontal
} from 'lucide-react';
import { Vehicle, VehicleStatus, Role } from '../types';

interface FleetRegistryProps {
  vehicles: Vehicle[];
  userRole: Role;
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  onUpdateVehicleStatus: (id: string, status: VehicleStatus) => void;
  onDeleteVehicle: (id: string) => void;
}

export default function FleetRegistry({
  vehicles,
  userRole,
  onAddVehicle,
  onUpdateVehicleStatus,
  onDeleteVehicle,
}: FleetRegistryProps) {
  // Check permission: fleet: edit, view, or none
  // Fleet Manager: edit, Dispatcher: view, Safety Officer: none, Financial Analyst: view
  const canEdit = userRole === 'Fleet Manager';
  const canView = userRole !== 'Safety Officer';

  // State management
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New vehicle form state
  const [newRegNumber, setNewRegNumber] = useState('');
  const [newModel, setNewModel] = useState('Tata Prima 2830 (Heavy Tipper)');
  const [newStatus, setNewStatus] = useState<VehicleStatus>('Available');
  const [newFuel, setNewFuel] = useState(100);
  const [newOdometer, setNewOdometer] = useState(12000);

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      v.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegNumber) return;

    // Last service is today, next is 3 months from now
    const today = new Date().toISOString().split('T')[0];
    const nextS = new Date();
    nextS.setMonth(nextS.getMonth() + 3);
    const nextServiceDate = nextS.toISOString().split('T')[0];

    onAddVehicle({
      registrationNumber: newRegNumber,
      model: newModel,
      status: newStatus,
      fuelLevel: Number(newFuel),
      odometer: Number(newOdometer),
      lastService: today,
      nextService: nextServiceDate,
    });

    // Reset and close
    setNewRegNumber('');
    setShowAddModal(false);
  };

  // If user has 'none' access (Safety Officer)
  if (!canView) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center bg-panel border border-line rounded-2xl shadow-xs mt-12 space-y-6">
        <div className="w-16 h-16 bg-red-bg text-red rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-display font-bold text-ink">Access Scoped Out</h2>
          <p className="text-sm text-muted leading-relaxed">
            Your current security clearance (<span className="font-semibold text-ink font-mono">{userRole}</span>) is restricted from viewing the active Fleet Asset Registry.
          </p>
        </div>
        <div className="p-4 bg-panel-alt rounded-xl border border-line text-xs text-muted leading-normal space-y-2 text-left">
          <div className="font-bold text-ink flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber" /> Security Mapping:
          </div>
          <p>• Fleet Managers can manage registrations, repairs, and diagnostics.</p>
          <p>• Dispatchers & Analysts have view-only access for routing and audit ledgers.</p>
          <p>• Safety Officers bypass physical asset logs to prevent administrative overrides.</p>
        </div>
        <div className="pt-2">
          <span className="text-[10px] font-mono text-faint">TOKEN REF: RESTR-FL-0220</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Add Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink">Fleet Assets Registry</h1>
          <p className="text-xs text-muted">Register vehicles, update status codes, and audit engine services.</p>
        </div>

        {/* Add vehicle button */}
        {canEdit ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 py-2.5 px-4 bg-ink hover:bg-ink/90 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber" />
            Register New Vehicle
          </button>
        ) : (
          <div className="flex items-center gap-2 py-2 px-3 bg-panel-alt text-faint font-mono border border-line rounded-lg text-xs" title="Requires Fleet Manager permissions to register assets">
            <Lock className="w-3.5 h-3.5 text-muted" />
            <span>View-Only Scoped</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-panel border border-line rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-faint" />
          <input
            type="text"
            placeholder="Search assets by registration number, make, chassis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-panel border border-line rounded-xl text-ink font-sans text-xs focus:outline-none focus:ring-2 focus:ring-amber/50 placeholder:text-muted/60"
          />
        </div>

        {/* Status filtering chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-faint uppercase mr-1.5 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Filter:
          </span>
          {['All', 'Available', 'On Trip', 'In Shop', 'Out of Service'].map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-ink text-white shadow-xs' 
                    : 'bg-panel-alt border border-line text-muted hover:border-line/80 hover:text-ink'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Vehicle Cards */}
      {filteredVehicles.length === 0 ? (
        <div className="p-12 text-center bg-panel border border-line rounded-2xl">
          <p className="text-sm text-muted">No vehicles found matching search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredVehicles.map((vehicle) => {
            // Colors for status badges
            let badgeStyle = 'bg-gray-chip text-muted border-line';
            if (vehicle.status === 'Available') badgeStyle = 'bg-green-bg text-green border-green/10';
            if (vehicle.status === 'On Trip') badgeStyle = 'bg-blue-bg text-blue border-blue/10';
            if (vehicle.status === 'In Shop') badgeStyle = 'bg-amber-bg text-amber-deep border-amber/10';
            if (vehicle.status === 'Out of Service') badgeStyle = 'bg-red-bg text-red border-red/10';

            // Fuel levels color mapping
            let fuelColor = 'bg-green';
            if (vehicle.fuelLevel < 35) fuelColor = 'bg-amber';
            if (vehicle.fuelLevel < 15) fuelColor = 'bg-red';

            return (
              <div key={vehicle.id} className="bg-panel border border-line rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-line/80 transition-all group relative">
                {/* Delete button (only for Fleet Manager) */}
                {canEdit && (
                  <button 
                    onClick={() => {
                      if (confirm(`Confirm deletion of vehicle ${vehicle.registrationNumber}?`)) {
                        onDeleteVehicle(vehicle.id);
                      }
                    }}
                    className="absolute top-4 right-4 p-1.5 bg-panel-alt hover:bg-red-bg text-muted hover:text-red border border-line rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Remove asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div>
                  <div className="flex items-start justify-between mb-3 pr-6">
                    <div>
                      <span className="font-mono text-xs font-bold text-ink bg-panel-alt px-2.5 py-1 rounded-md border border-line tracking-wide">
                        {vehicle.registrationNumber}
                      </span>
                      <h3 className="font-display font-semibold text-ink text-sm mt-2">{vehicle.model}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1 mb-4">
                    <span className={`inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-[10px] font-bold border ${badgeStyle}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {vehicle.status}
                    </span>
                  </div>

                  {/* Telematics Info */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-panel-alt rounded-xl border border-line/60 mb-4 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-muted">
                      <Gauge className="w-3.5 h-3.5 text-faint flex-none" />
                      <div>
                        <div className="text-[9px] text-faint leading-none">ODOMETER</div>
                        <div className="font-bold text-ink mt-0.5">{vehicle.odometer.toLocaleString()} km</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted">
                      <Fuel className="w-3.5 h-3.5 text-faint flex-none" />
                      <div>
                        <div className="text-[9px] text-faint leading-none">FUEL LEVEL</div>
                        <div className="font-bold text-ink mt-0.5">{vehicle.fuelLevel}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Fuel level visual bar */}
                  <div className="w-full bg-line h-1.5 rounded-full mb-4 overflow-hidden">
                    <div 
                      className={`${fuelColor} h-full rounded-full`} 
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    ></div>
                  </div>

                  {/* Service Dates */}
                  <div className="space-y-1.5 text-[11px] text-muted border-t border-line/50 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1 font-semibold"><Calendar className="w-3 h-3 text-faint" /> Last Maintenance:</span>
                      <span className="font-mono">{vehicle.lastService}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1 font-semibold"><Wrench className="w-3 h-3 text-faint" /> Next Diagnostics:</span>
                      <span className="font-mono text-amber-deep font-semibold">{vehicle.nextService}</span>
                    </div>
                  </div>
                </div>

                {/* Status update selector (only for Fleet Manager) */}
                {canEdit && (
                  <div className="mt-5 pt-3 border-t border-line/50 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-faint uppercase">OVERRIDE STATUS:</span>
                    <select
                      value={vehicle.status}
                      onChange={(e) => onUpdateVehicleStatus(vehicle.id, e.target.value as VehicleStatus)}
                      className="p-1.5 bg-panel-alt border border-line rounded-lg text-[11px] font-semibold text-ink focus:outline-none focus:ring-1 focus:ring-amber cursor-pointer"
                    >
                      <option value="Available">Available</option>
                      <option value="On Trip">On Trip</option>
                      <option value="In Shop">In Shop</option>
                      <option value="Out of Service">Out of Service</option>
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ink/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-panel w-full max-w-md rounded-2xl border border-line shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-line">
              <h3 className="font-display font-bold text-base text-ink">Register Vehicle Profile</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-muted hover:bg-panel-alt rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">REGISTRATION LICENSE PLATE</label>
                <input
                  type="text"
                  placeholder="e.g. MH-12-PQ-9045"
                  value={newRegNumber}
                  onChange={(e) => setNewRegNumber(e.target.value.toUpperCase())}
                  className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink font-mono font-semibold uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">VEHICLE MODEL / SPECIFICATION</label>
                <select
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink font-sans cursor-pointer"
                >
                  <option value="Tata LPT 1613 (Rigid Cargo)">Tata LPT 1613 (Rigid Cargo)</option>
                  <option value="Ashok Leyland Boss 1215">Ashok Leyland Boss 1215</option>
                  <option value="BharatBenz 2823C (Heavy Tipper)">BharatBenz 2823C (Heavy Tipper)</option>
                  <option value="Eicher Pro 2049 (Light Truck)">Eicher Pro 2049 (Light Truck)</option>
                  <option value="Mahindra Furio 14 (Box Body)">Mahindra Furio 14 (Box Body)</option>
                  <option value="Volvo FM 420 (Puller Rig)">Volvo FM 420 (Puller Rig)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">INITIAL STATUS</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as VehicleStatus)}
                    className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink font-sans cursor-pointer"
                  >
                    <option value="Available">Available</option>
                    <option value="In Shop">In Shop</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">FUEL LEVEL (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newFuel}
                    onChange={(e) => setNewFuel(Number(e.target.value))}
                    className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink font-sans"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">ODOMETER READING (KM)</label>
                <input
                  type="number"
                  min="0"
                  value={newOdometer}
                  onChange={(e) => setNewOdometer(Number(e.target.value))}
                  className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink font-sans"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-3.5 bg-panel-alt border border-line rounded-xl text-muted font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-ink hover:bg-ink/90 text-white rounded-xl font-semibold cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-4 h-4 text-amber" />
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
