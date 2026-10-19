/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MapPin, 
  Truck, 
  User, 
  Calendar, 
  Lock, 
  Check, 
  ArrowRight, 
  TrendingUp, 
  Package, 
  Play, 
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Trip, TripStatus, Role, Vehicle, Driver } from '../types';

interface DispatchTripsProps {
  trips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
  userRole: Role;
  onAddTrip: (trip: Omit<Trip, 'id' | 'tripId' | 'progress'>) => void;
  onUpdateTripProgress: (id: string, progress: number) => void;
  onUpdateTripStatus: (id: string, status: TripStatus) => void;
}

export default function DispatchTrips({
  trips,
  vehicles,
  drivers,
  userRole,
  onAddTrip,
  onUpdateTripProgress,
  onUpdateTripStatus,
}: DispatchTripsProps) {
  // Dispatchers can edit/create. Fleet Managers & Safety Officers can view. Financial Analysts have restricted or view-only access.
  const canEdit = userRole === 'Dispatcher' || userRole === 'Fleet Manager';

  // State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Trip form state
  const [newOrigin, setNewOrigin] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newVehicleId, setNewVehicleId] = useState('');
  const [newDriverId, setNewDriverId] = useState('');
  const [newCargo, setNewCargo] = useState('');

  // Filtered lists
  const filteredTrips = trips.filter((t) => {
    const matchesSearch = 
      t.tripId.toLowerCase().includes(search.toLowerCase()) ||
      t.origin.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      t.cargo.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrigin || !newDestination || !newVehicleId || !newDriverId || !newCargo) return;

    onAddTrip({
      vehicleId: newVehicleId,
      driverId: newDriverId,
      origin: newOrigin,
      destination: newDestination,
      status: 'Pending',
      cargo: newCargo,
    });

    // Reset Form
    setNewOrigin('');
    setNewDestination('');
    setNewVehicleId('');
    setNewDriverId('');
    setNewCargo('');
    setShowAddModal(false);
  };

  // Helper to handle trip simulations
  const handleAdvanceTrip = (id: string, currentProgress: number) => {
    if (currentProgress >= 100) {
      onUpdateTripStatus(id, 'Completed');
    } else {
      const nextProgress = Math.min(currentProgress + 20, 100);
      onUpdateTripProgress(id, nextProgress);
      if (nextProgress === 100) {
        onUpdateTripStatus(id, 'Completed');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink">Dispatch & Trip Desk</h1>
          <p className="text-xs text-muted">Create manifest lines, assign available trucks & drivers, and track route status.</p>
        </div>

        {canEdit ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 py-2.5 px-4 bg-ink hover:bg-ink/90 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber" />
            Launch Trip Dispatch
          </button>
        ) : (
          <div className="flex items-center gap-2 py-2 px-3 bg-panel-alt text-faint font-mono border border-line rounded-lg text-xs" title="Only Dispatch Desk personnel can launch new dispatches">
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
            placeholder="Search manifests by ID, origin, destination, cargo specs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-panel border border-line rounded-xl text-ink font-sans text-xs focus:outline-none focus:ring-2 focus:ring-amber/50 placeholder:text-muted/60"
          />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-faint uppercase mr-1">Filter:</span>
          {['All', 'Pending', 'Active', 'Completed', 'Cancelled'].map((status) => {
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

      {/* Grid of Trip Manifest Cards */}
      {filteredTrips.length === 0 ? (
        <div className="p-12 text-center bg-panel border border-line rounded-2xl">
          <p className="text-sm text-muted">No trip logs found matching search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTrips.map((trip) => {
            const vehicle = vehicles.find((v) => v.id === trip.vehicleId);
            const driver = drivers.find((d) => d.id === trip.driverId);

            // Style status badges
            let badgeStyle = 'bg-gray-chip text-muted border-line';
            if (trip.status === 'Active') badgeStyle = 'bg-blue-bg text-blue border-blue/10';
            if (trip.status === 'Completed') badgeStyle = 'bg-green-bg text-green border-green/10';
            if (trip.status === 'Pending') badgeStyle = 'bg-amber-bg text-amber-deep border-amber/10';
            if (trip.status === 'Cancelled') badgeStyle = 'bg-red-bg text-red border-red/10';

            return (
              <div key={trip.id} className="bg-panel border border-line rounded-2xl p-5 shadow-xs hover:border-line/80 transition-all flex flex-col justify-between group relative">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-ink bg-panel-alt px-2.5 py-1 rounded-md border border-line tracking-wide">
                        {trip.tripId}
                      </span>
                      <span className={`inline-flex items-center gap-1 py-0.2 px-2.5 rounded-full text-[9px] font-bold border ${badgeStyle}`}>
                        {trip.status}
                      </span>
                    </div>

                    {/* Quick dispatcher actions */}
                    {canEdit && trip.status === 'Pending' && (
                      <button
                        onClick={() => onUpdateTripStatus(trip.id, 'Active')}
                        className="py-1 px-2 bg-blue text-white rounded-lg text-[10px] font-bold hover:bg-blue-bg hover:text-blue transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" /> Dispatch Now
                      </button>
                    )}
                  </div>

                  {/* Route details */}
                  <div className="my-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                      <MapPin className="w-4 h-4 text-faint flex-none" />
                      <span>{trip.origin}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted" />
                      <span>{trip.destination}</span>
                    </div>
                  </div>

                  {/* Cargo Info */}
                  <div className="flex items-center gap-2 p-3 bg-panel-alt rounded-xl border border-line/60 mb-4 text-xs font-mono text-muted">
                    <Package className="w-4 h-4 text-faint flex-none" />
                    <span>Cargo: <span className="text-ink font-sans font-semibold">{trip.cargo}</span></span>
                  </div>

                  {/* Vehicle and Driver links */}
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="flex items-center gap-2 p-2 bg-panel-alt border border-line rounded-xl">
                      <Truck className="w-3.5 h-3.5 text-muted flex-none" />
                      <div className="truncate">
                        <div className="text-[8px] text-faint leading-none font-mono">TRUCK</div>
                        <span className="font-semibold text-ink font-sans">
                          {vehicle ? vehicle.registrationNumber.substring(0, 7) : 'Unknown'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-panel-alt border border-line rounded-xl">
                      <User className="w-3.5 h-3.5 text-muted flex-none" />
                      <div className="truncate">
                        <div className="text-[8px] text-faint leading-none font-mono">DRIVER</div>
                        <span className="font-semibold text-ink">
                          {driver ? driver.name.split(' ')[0] : 'Unassigned'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress visual bar */}
                  {trip.status !== 'Pending' && trip.status !== 'Cancelled' && (
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-muted font-bold">ROUTE PROGRESS:</span>
                        <span className="font-bold text-ink">{trip.progress}%</span>
                      </div>
                      <div className="w-full bg-line h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue h-full rounded-full transition-all duration-500" 
                          style={{ width: `${trip.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress simulator overrides (only for Dispatchers) */}
                {canEdit && (trip.status === 'Active' || trip.status === 'Pending') && (
                  <div className="mt-4 pt-3.5 border-t border-line/50 flex items-center justify-between gap-2.5">
                    <span className="text-[9px] font-mono font-bold text-faint uppercase">OVERRIDE CONSOLE:</span>
                    <div className="flex items-center gap-2">
                      {trip.status === 'Active' && (
                        <button
                          onClick={() => handleAdvanceTrip(trip.id, trip.progress)}
                          className="py-1 px-2 bg-panel-alt hover:bg-gray-chip border border-line text-ink rounded-lg text-[10px] font-semibold cursor-pointer flex items-center gap-1"
                        >
                          <TrendingUp className="w-3 h-3 text-blue" />
                          {trip.progress >= 80 ? 'Final Destination' : '+20% Progress'}
                        </button>
                      )}

                      <button
                        onClick={() => onUpdateTripStatus(trip.id, 'Cancelled')}
                        className="py-1 px-2 hover:bg-red-bg text-muted hover:text-red border border-transparent hover:border-red/20 rounded-lg text-[10px] font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-3 h-3" />
                        Cancel Trip
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Launch Trip Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ink/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-panel w-full max-w-md rounded-2xl border border-line shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-line">
              <h3 className="font-display font-bold text-base text-ink">Launch Trip Manifest</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-muted hover:bg-panel-alt rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">ORIGIN STATION</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai Port"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">DESTINATION HUB</label>
                  <input
                    type="text"
                    placeholder="e.g. Pune Ind. Area"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">CARGO MANIFEST DESCRIPTION</label>
                <input
                  type="text"
                  placeholder="e.g. Pharmaceutical Ingredients (2.2 tons)"
                  value={newCargo}
                  onChange={(e) => setNewCargo(e.target.value)}
                  className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">CHOOSE AVAILABLE TRUCK</label>
                  <select
                    value={newVehicleId}
                    onChange={(e) => setNewVehicleId(e.target.value)}
                    className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink cursor-pointer"
                    required
                  >
                    <option value="">Select Vehicle...</option>
                    {vehicles.filter(v => v.status === 'Available').map(v => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber} ({v.model.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">CHOOSE ACTIVE DRIVER</label>
                  <select
                    value={newDriverId}
                    onChange={(e) => setNewDriverId(e.target.value)}
                    className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink cursor-pointer"
                    required
                  >
                    <option value="">Select Driver...</option>
                    {drivers.filter(d => d.status === 'Active').map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} (★ {d.rating})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {vehicles.filter(v => v.status === 'Available').length === 0 && (
                <div className="flex items-start gap-2 p-2.5 bg-amber-bg text-amber-deep rounded-xl border border-amber/10">
                  <AlertCircle className="w-4 h-4 flex-none mt-0.5" />
                  <span className="text-[10px] leading-tight">No idle trucks listed in available state. Go to Fleet Registry and override a status to Available first.</span>
                </div>
              )}

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
                  disabled={vehicles.filter(v => v.status === 'Available').length === 0}
                  className="py-2 px-4 bg-ink hover:bg-ink/90 text-white rounded-xl font-semibold cursor-pointer flex items-center gap-1 disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-amber" />
                  Launch Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
