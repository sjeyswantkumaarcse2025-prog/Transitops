/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Wrench, 
  Calendar, 
  IndianRupee, 
  ShieldAlert, 
  Lock, 
  Check, 
  ClipboardList, 
  FileText,
  Clock,
  CheckCircle,
  Truck
} from 'lucide-react';
import { MaintenanceLog, MaintenanceStatus, Role, Vehicle } from '../types';

interface MaintenanceLogViewerProps {
  logs: MaintenanceLog[];
  vehicles: Vehicle[];
  userRole: Role;
  onAddLog: (log: Omit<MaintenanceLog, 'id'>) => void;
  onUpdateLogStatus: (id: string, status: MaintenanceStatus) => void;
}

export default function MaintenanceLogViewer({
  logs,
  vehicles,
  userRole,
  onAddLog,
  onUpdateLogStatus,
}: MaintenanceLogViewerProps) {
  // Fleet Managers can write. Dispatchers & Analysts & Safety Officers have view-only access.
  const canEdit = userRole === 'Fleet Manager';
  const canView = true; // Everyone can view repair schedules

  // State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New repair form state
  const [newVehicleId, setNewVehicleId] = useState('');
  const [newServiceType, setNewServiceType] = useState('');
  const [newCost, setNewCost] = useState(5000);
  const [newTechnician, setNewTechnician] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newStatus, setNewStatus] = useState<MaintenanceStatus>('Scheduled');

  // Filters
  const filteredLogs = logs.filter((log) => {
    const vehicle = vehicles.find(v => v.id === log.vehicleId);
    const regNum = vehicle ? vehicle.registrationNumber : '';
    const matchesSearch = 
      log.serviceType.toLowerCase().includes(search.toLowerCase()) ||
      log.technician.toLowerCase().includes(search.toLowerCase()) ||
      regNum.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicleId || !newServiceType || !newTechnician) return;

    const today = new Date().toISOString().split('T')[0];

    onAddLog({
      vehicleId: newVehicleId,
      serviceType: newServiceType,
      cost: Number(newCost),
      date: today,
      status: newStatus,
      technician: newTechnician,
      notes: newNotes,
    });

    // Reset Form
    setNewVehicleId('');
    setNewServiceType('');
    setNewCost(5000);
    setNewTechnician('');
    setNewNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink">Yard Maintenance & Repairs</h1>
          <p className="text-xs text-muted">Book heavy overhauls, schedule routine services, and log workshop labor costs.</p>
        </div>

        {canEdit ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 py-2.5 px-4 bg-ink hover:bg-ink/90 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber" />
            Book Repair Order
          </button>
        ) : (
          <div className="flex items-center gap-2 py-2 px-3 bg-panel-alt text-faint font-mono border border-line rounded-lg text-xs" title="Only Fleet Managers can create repair logs">
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
            placeholder="Search logs by service type, tech, license plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-panel border border-line rounded-xl text-ink font-sans text-xs focus:outline-none focus:ring-2 focus:ring-amber/50 placeholder:text-muted/60"
          />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-faint uppercase mr-1">Filter:</span>
          {['All', 'Scheduled', 'In Progress', 'Completed'].map((status) => {
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

      {/* Repair Cards list */}
      {filteredLogs.length === 0 ? (
        <div className="p-12 text-center bg-panel border border-line rounded-2xl">
          <p className="text-sm text-muted">No maintenance entries found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredLogs.map((log) => {
            const vehicle = vehicles.find((v) => v.id === log.vehicleId);

            let statusBadge = 'bg-gray-chip text-muted border-line';
            if (log.status === 'Scheduled') statusBadge = 'bg-blue-bg text-blue border-blue/10';
            if (log.status === 'In Progress') statusBadge = 'bg-amber-bg text-amber-deep border-amber/10 animate-pulse';
            if (log.status === 'Completed') statusBadge = 'bg-green-bg text-green border-green/10';

            return (
              <div key={log.id} className="bg-panel border border-line rounded-2xl p-5 shadow-xs hover:border-line/80 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="font-mono text-xs font-bold text-ink bg-panel-alt px-2.5 py-1 rounded-md border border-line">
                      {vehicle ? vehicle.registrationNumber : 'UNRESOLVED PLATE'}
                    </span>
                    <span className={`inline-flex items-center gap-1 py-0.2 px-2.5 rounded-full text-[9px] font-bold border ${statusBadge}`}>
                      {log.status}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-ink text-sm mb-1">{log.serviceType}</h3>
                  <p className="text-xs text-muted mb-4 line-clamp-2 italic">"{log.notes}"</p>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-4 font-mono">
                    <div className="flex items-center gap-2 p-2 bg-panel-alt border border-line rounded-xl">
                      <IndianRupee className="w-3.5 h-3.5 text-amber-deep flex-none" />
                      <div>
                        <div className="text-[8px] text-faint leading-none">ORDER COST</div>
                        <span className="font-bold text-ink">₹ {log.cost.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-panel-alt border border-line rounded-xl">
                      <Calendar className="w-3.5 h-3.5 text-faint flex-none" />
                      <div>
                        <div className="text-[8px] text-faint leading-none">LOGGED ON</div>
                        <span className="font-semibold text-ink font-sans">{log.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-muted space-y-1 pb-3">
                    <div>⚙️ <span className="font-semibold">Truck Specification:</span> {vehicle ? vehicle.model : 'Unknown Model'}</div>
                    <div>👤 <span className="font-semibold">Technician Unit:</span> {log.technician}</div>
                  </div>
                </div>

                {/* Overwrite repairs status (only for Fleet Manager) */}
                {canEdit && log.status !== 'Completed' && (
                  <div className="mt-4 pt-3.5 border-t border-line/50 flex items-center justify-between gap-2.5">
                    <span className="text-[9px] font-mono font-bold text-faint uppercase">OVERRIDE REPAIRS:</span>
                    <div className="flex gap-2">
                      {log.status === 'Scheduled' && (
                        <button
                          onClick={() => onUpdateLogStatus(log.id, 'In Progress')}
                          className="py-1 px-2.5 bg-amber text-ink rounded-lg text-[10px] font-bold hover:bg-amber-deep hover:text-white cursor-pointer flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3" /> Initiate Labor
                        </button>
                      )}
                      {log.status === 'In Progress' && (
                        <button
                          onClick={() => onUpdateLogStatus(log.id, 'Completed')}
                          className="py-1 px-2.5 bg-green text-white rounded-lg text-[10px] font-bold hover:bg-green-bg hover:text-green cursor-pointer flex items-center gap-1 border border-transparent"
                        >
                          <CheckCircle className="w-3 h-3" /> Sign Off Repair
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Book repair modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ink/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-panel w-full max-w-md rounded-2xl border border-line shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-line">
              <h3 className="font-display font-bold text-base text-ink">Book Workshop Repair</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-muted hover:bg-panel-alt rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">CHOOSE WORKSHOP VEHICLE</label>
                <select
                  value={newVehicleId}
                  onChange={(e) => setNewVehicleId(e.target.value)}
                  className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink cursor-pointer"
                  required
                >
                  <option value="">Select vehicle...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} ({v.model.split(' ')[0]}) - Status: {v.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">REPAIR DESCRIPTION / SERVICE TYPE</label>
                <input
                  type="text"
                  placeholder="e.g. Brake Caliper Overhaul & Fluid Flush"
                  value={newServiceType}
                  onChange={(e) => setNewServiceType(e.target.value)}
                  className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">REPAIR LABOR COST (INR)</label>
                  <input
                    type="number"
                    min="1"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">TECHNICIAN UNIT</label>
                  <input
                    type="text"
                    placeholder="e.g. Fernandes Workshop"
                    value={newTechnician}
                    onChange={(e) => setNewTechnician(e.target.value)}
                    className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">INITIAL REPAIR STATUS</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as MaintenanceStatus)}
                  className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink cursor-pointer"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress (Tows vehicle immediately)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">DIAGNOSTIC WORKSHOP NOTES</label>
                <textarea
                  placeholder="Engine check lamp code P0112 reported. Severe steering alignments requested."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink font-sans"
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
                  Issue Repair Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
