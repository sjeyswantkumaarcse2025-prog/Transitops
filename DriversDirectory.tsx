/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  UserPlus, 
  Phone, 
  CreditCard, 
  Star, 
  Truck, 
  Lock, 
  Check, 
  UserMinus, 
  HeartCrack,
  AlertCircle
} from 'lucide-react';
import { Driver, DriverStatus, Role, Vehicle } from '../types';

interface DriversDirectoryProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  userRole: Role;
  onAddDriver: (driver: Omit<Driver, 'id'>) => void;
  onUpdateDriverStatus: (id: string, status: DriverStatus) => void;
  onDeleteDriver: (id: string) => void;
}

export default function DriversDirectory({
  drivers,
  vehicles,
  userRole,
  onAddDriver,
  onUpdateDriverStatus,
  onDeleteDriver,
}: DriversDirectoryProps) {
  // Permissions logic
  // Safety Officer & Fleet Manager can edit. Dispatcher & Financial Analyst can view-only.
  const canEdit = userRole === 'Fleet Manager' || userRole === 'Safety Officer';

  // State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Driver Form state
  const [newName, setNewName] = useState('');
  const [newLicense, setNewLicense] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStatus, setNewStatus] = useState<DriverStatus>('Active');
  const [newVehicleId, setNewVehicleId] = useState<string>('');
  const [newRating, setNewRating] = useState(5.0);

  // Filters
  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch = 
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newLicense || !newPhone) return;

    onAddDriver({
      name: newName,
      licenseNumber: newLicense,
      phone: newPhone,
      status: newStatus,
      assignedVehicleId: newVehicleId || undefined,
      rating: Number(newRating),
    });

    // Reset Form
    setNewName('');
    setNewLicense('');
    setNewPhone('');
    setNewVehicleId('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink">Drivers & License Registry</h1>
          <p className="text-xs text-muted">Track driver safety points, license numbers, active duty status, and vehicle links.</p>
        </div>

        {canEdit ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 py-2.5 px-4 bg-ink hover:bg-ink/90 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-amber" />
            Add Driver Record
          </button>
        ) : (
          <div className="flex items-center gap-2 py-2 px-3 bg-panel-alt text-faint font-mono border border-line rounded-lg text-xs" title="Only Safety Officers & Fleet Managers can edit driver profiles">
            <Lock className="w-3.5 h-3.5 text-muted" />
            <span>Audit Scoped Only</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-panel border border-line rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-faint" />
          <input
            type="text"
            placeholder="Search drivers by name, license number, license plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-panel border border-line rounded-xl text-ink font-sans text-xs focus:outline-none focus:ring-2 focus:ring-amber/50 placeholder:text-muted/60"
          />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-faint uppercase mr-1">Filter:</span>
          {['All', 'Active', 'On Trip', 'Off Duty', 'Suspended'].map((status) => {
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

      {/* Driver Cards Grid */}
      {filteredDrivers.length === 0 ? (
        <div className="p-12 text-center bg-panel border border-line rounded-2xl">
          <p className="text-sm text-muted">No drivers found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDrivers.map((driver) => {
            const vehicle = vehicles.find((v) => v.id === driver.assignedVehicleId);

            // Style status badges
            let badgeStyle = 'bg-gray-chip text-muted border-line';
            if (driver.status === 'Active') badgeStyle = 'bg-green-bg text-green border-green/10';
            if (driver.status === 'On Trip') badgeStyle = 'bg-blue-bg text-blue border-blue/10';
            if (driver.status === 'Off Duty') badgeStyle = 'bg-gray-chip text-muted border-line';
            if (driver.status === 'Suspended') badgeStyle = 'bg-red-bg text-red border-red/10 animate-pulse';

            return (
              <div key={driver.id} className="bg-panel border border-line rounded-2xl p-5 shadow-xs hover:border-line/80 transition-all flex flex-col justify-between group relative">
                {/* Delete/Deregister Driver */}
                {canEdit && (
                  <button 
                    onClick={() => {
                      if (confirm(`Remove ${driver.name} from the active database?`)) {
                        onDeleteDriver(driver.id);
                      }
                    }}
                    className="absolute top-4 right-4 p-1.5 bg-panel-alt hover:bg-red-bg text-muted hover:text-red border border-line rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Remove record"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                  </button>
                )}

                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-panel-alt flex items-center justify-center font-bold text-ink border border-line text-sm shadow-xs">
                      {driver.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-ink text-sm leading-snug">{driver.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`inline-flex items-center gap-1 py-0.2 px-1.5 rounded-full text-[9px] font-bold border ${badgeStyle}`}>
                          {driver.status}
                        </span>
                        <div className="flex items-center gap-0.5 text-xs text-amber-deep font-semibold">
                          <Star className="w-3.5 h-3.5 fill-current text-amber" />
                          <span className="text-[10px]">{driver.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver Contact & Licensing details */}
                  <div className="space-y-2 mt-4 pt-3.5 border-t border-line/50 text-[11px] text-muted font-mono">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-faint flex-none" />
                      <span>Lic: <span className="text-ink font-semibold">{driver.licenseNumber}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-faint flex-none" />
                      <span>Phone: <span className="text-ink font-semibold">{driver.phone}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-faint flex-none" />
                      <span>Linked Vehicle: <span className="text-ink font-sans font-semibold">
                        {vehicle ? `${vehicle.registrationNumber} (${vehicle.model.split(' ')[0]})` : 'None Assigned'}
                      </span></span>
                    </div>
                  </div>
                </div>

                {/* Quick actions status toggle (for Safety/Managers) */}
                {canEdit && (
                  <div className="mt-5 pt-3.5 border-t border-line/50 flex items-center justify-between gap-2">
                    <span className="text-[9px] font-mono font-bold text-faint uppercase">COMPLIANCE CODE:</span>
                    <select
                      value={driver.status}
                      onChange={(e) => onUpdateDriverStatus(driver.id, e.target.value as DriverStatus)}
                      className="p-1 bg-panel-alt border border-line rounded-lg text-[10px] font-semibold text-ink focus:outline-none cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="On Trip">On Trip</option>
                      <option value="Off Duty">Off Duty</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ink/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-panel w-full max-w-md rounded-2xl border border-line shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-line">
              <h3 className="font-display font-bold text-base text-ink">Add Licensed Driver Profile</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-muted hover:bg-panel-alt rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">FULL NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Patil"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">COMMERCIAL LICENSE NUMBER (DL)</label>
                <input
                  type="text"
                  placeholder="e.g. MH-122008110000"
                  value={newLicense}
                  onChange={(e) => setNewLicense(e.target.value.toUpperCase())}
                  className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink font-mono font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">TELEPHONE NUMBER</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 99887 76655"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">INITIAL SAFETY SCORE</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">ASSIGN TRUCK / VEHICLE</label>
                <select
                  value={newVehicleId}
                  onChange={(e) => setNewVehicleId(e.target.value)}
                  className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink cursor-pointer"
                >
                  <option value="">No Vehicle Assignment (Floating status)</option>
                  {vehicles.filter(v => v.status === 'Available').map(v => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} ({v.model.split(' ')[0]})
                    </option>
                  ))}
                </select>
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
