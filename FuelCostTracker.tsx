/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Fuel, 
  Calendar, 
  IndianRupee, 
  Lock, 
  Check, 
  Gauge, 
  MapPin, 
  Calculator,
  ArrowDownToLine,
  TrendingUp,
  Award
} from 'lucide-react';
import { FuelEntry, Role, Vehicle } from '../types';

interface FuelCostTrackerProps {
  fuelEntries: FuelEntry[];
  vehicles: Vehicle[];
  userRole: Role;
  onAddFuelEntry: (entry: Omit<FuelEntry, 'id'>) => void;
}

export default function FuelCostTracker({
  fuelEntries,
  vehicles,
  userRole,
  onAddFuelEntry,
}: FuelCostTrackerProps) {
  // Financial Analysts and Fleet Managers can write fuel entries. Others have view-only access.
  const canEdit = userRole === 'Financial Analyst' || userRole === 'Fleet Manager';

  // State
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [date, setDate] = useState('');
  const [gallons, setGallons] = useState(40);
  const [cost, setCost] = useState(3800);
  const [odometer, setOdometer] = useState(90000);
  const [location, setLocation] = useState('IndianOil Petrol Station');

  // Compute stats
  const totalCost = fuelEntries.reduce((acc, curr) => acc + curr.cost, 0);
  const totalGallons = fuelEntries.reduce((acc, curr) => acc + curr.gallons, 0);
  const averagePrice = totalGallons > 0 ? (totalCost / totalGallons) : 0;

  // Filter logs
  const filteredEntries = fuelEntries.filter((entry) => {
    const vehicle = vehicles.find(v => v.id === entry.vehicleId);
    const regNum = vehicle ? vehicle.registrationNumber : '';
    const matchesSearch = 
      entry.location.toLowerCase().includes(search.toLowerCase()) ||
      regNum.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId || !date || !gallons || !cost || !odometer || !location) return;

    onAddFuelEntry({
      vehicleId: selectedVehicleId,
      date: date,
      gallons: Number(gallons),
      cost: Number(cost),
      odometer: Number(odometer),
      location: location,
    });

    // Reset Form
    setSelectedVehicleId('');
    setLocation('IndianOil Petrol Station');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink">Fuel Ledger & Expenses</h1>
          <p className="text-xs text-muted">Log fuel receipts, track diesel prices, and audit fuel efficiency metrics.</p>
        </div>

        {canEdit ? (
          <button
            onClick={() => {
              setDate(new Date().toISOString().split('T')[0]);
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 py-2.5 px-4 bg-ink hover:bg-ink/90 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber" />
            Add Refueling Log
          </button>
        ) : (
          <div className="flex items-center gap-2 py-2 px-3 bg-panel-alt text-faint font-mono border border-line rounded-lg text-xs" title="Only Financial Analysts & Managers can edit fuel costs">
            <Lock className="w-3.5 h-3.5 text-muted" />
            <span>Audit Scoped Only</span>
          </div>
        )}
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-panel border border-line rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-green-bg text-green rounded-xl">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-faint uppercase tracking-wider font-mono">TOTAL FUEL SPEND</div>
            <h4 className="text-lg font-display font-bold text-ink">₹ {totalCost.toLocaleString('en-IN')}</h4>
          </div>
        </div>

        <div className="p-4 bg-panel border border-line rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-blue-bg text-blue rounded-xl">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-faint uppercase tracking-wider font-mono">LITERS REPLENISHED</div>
            <h4 className="text-lg font-display font-bold text-ink">{totalGallons.toFixed(1)} L</h4>
          </div>
        </div>

        <div className="p-4 bg-panel border border-line rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-amber-bg text-amber-deep rounded-xl">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-faint uppercase tracking-wider font-mono">AVG COST / LITER</div>
            <h4 className="text-lg font-display font-bold text-ink">₹ {averagePrice.toFixed(2)}</h4>
          </div>
        </div>
      </div>

      {/* Search Filter and Table */}
      <div className="p-4 bg-panel border border-line rounded-2xl shadow-xs space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-faint" />
          <input
            type="text"
            placeholder="Search expense entries by fuel station, highway, or truck registration..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-panel border border-line rounded-xl text-ink font-sans text-xs focus:outline-none focus:ring-2 focus:ring-amber/50 placeholder:text-muted/60"
          />
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-line text-faint font-semibold">
                <th className="py-3 px-2">REG. NUMBER</th>
                <th className="py-3 px-2">DATE</th>
                <th className="py-3 px-2">LOCATION / FUEL OUTLET</th>
                <th className="py-3 px-2 text-right">LITERS REPLENISHED</th>
                <th className="py-3 px-2 text-right">ODOMETER (KM)</th>
                <th className="py-3 px-2 text-right">TOTAL PAID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">No fuel receipts logged.</td>
                </tr>
              ) : (
                filteredEntries.map((entry) => {
                  const vehicle = vehicles.find((v) => v.id === entry.vehicleId);
                  return (
                    <tr key={entry.id} className="hover:bg-panel-alt/50 transition-all font-mono">
                      <td className="py-3.5 px-2">
                        <span className="font-sans font-bold text-ink bg-gray-chip px-2 py-0.5 rounded-sm border border-line">
                          {vehicle ? vehicle.registrationNumber : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-muted font-sans">{entry.date}</td>
                      <td className="py-3.5 px-2 text-ink font-sans font-semibold">{entry.location}</td>
                      <td className="py-3.5 px-2 text-right text-ink font-bold">{entry.gallons.toFixed(1)} L</td>
                      <td className="py-3.5 px-2 text-right text-muted">{entry.odometer.toLocaleString()} km</td>
                      <td className="py-3.5 px-2 text-right text-green font-bold">₹ {entry.cost.toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log refuel modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ink/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-panel w-full max-w-md rounded-2xl border border-line shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-line">
              <h3 className="font-display font-bold text-base text-ink">Record Fuel Receipt</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-muted hover:bg-panel-alt rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">SELECT TRUCK</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">DATE OF REFILL</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">FUEL VOLUME (LITERS)</label>
                  <input
                    type="number"
                    min="1"
                    value={gallons}
                    onChange={(e) => setGallons(Number(e.target.value))}
                    className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">TOTAL EXPENSE PAID (INR)</label>
                  <input
                    type="number"
                    min="1"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink font-mono font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">ODOMETER AT REFILL (KM)</label>
                  <input
                    type="number"
                    min="1"
                    value={odometer}
                    onChange={(e) => setOdometer(Number(e.target.value))}
                    className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-faint uppercase mb-1">RETAIL OUTLET / LOCATION</label>
                <input
                  type="text"
                  placeholder="e.g. Bharat Petroleum NH-48 Hub"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 bg-panel border border-line rounded-xl text-ink"
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
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
