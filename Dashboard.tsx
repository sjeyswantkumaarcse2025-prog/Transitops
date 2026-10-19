/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Truck, 
  MapPin, 
  Users, 
  Wrench, 
  Flame, 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Vehicle, Driver, Trip, MaintenanceLog, SystemNotification } from '../types';

interface DashboardProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  maintenance: MaintenanceLog[];
  notifications: SystemNotification[];
  onTriggerSimulation: () => void;
  onNavigate: (page: string) => void;
}

export default function Dashboard({
  vehicles,
  drivers,
  trips,
  maintenance,
  notifications,
  onTriggerSimulation,
  onNavigate
}: DashboardProps) {
  // Local state for dashboard map selection or simulation toast
  const [showSimulateToast, setShowSimulateToast] = useState(false);

  // Computed metrics
  const totalVehicles = vehicles.length;
  const vehiclesOnTrip = vehicles.filter(v => v.status === 'On Trip').length;
  const vehiclesInShop = vehicles.filter(v => v.status === 'In Shop').length;
  const vehiclesAvailable = vehicles.filter(v => v.status === 'Available').length;

  const activeTripsCount = trips.filter(t => t.status === 'Active').length;
  const pendingTripsCount = trips.filter(t => t.status === 'Pending').length;

  const totalDrivers = drivers.length;
  const activeDriversCount = drivers.filter(d => d.status === 'On Trip' || d.status === 'Active').length;

  const activeMaintenanceCount = maintenance.filter(m => m.status === 'In Progress' || m.status === 'Scheduled').length;

  // Simple progress animation simulation helper
  const handleSimulate = () => {
    onTriggerSimulation();
    setShowSimulateToast(true);
    setTimeout(() => setShowSimulateToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Simulation toast popup */}
      {showSimulateToast && (
        <div className="fixed bottom-6 right-6 bg-ink text-white border border-sidebar-line py-3.5 px-5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-amber animate-ping"></div>
          <span className="font-mono text-xs font-semibold text-amber">SIMULATION DISPATCHED</span>
          <span className="text-xs text-faint border-l border-sidebar-line pl-3">Trip coordinates & fuel variables updated.</span>
        </div>
      )}

      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-panel rounded-2xl border border-line shadow-xs">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink">Operations Control Center</h1>
          <p className="text-muted text-sm mt-0.5">Real-time telematics log, routing vectors, and fleet compliance logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSimulate}
            className="flex items-center gap-2 py-2 px-4 bg-amber text-ink font-semibold rounded-xl text-xs hover:bg-amber-deep hover:text-white transition-all cursor-pointer shadow-sm active:scale-98"
          >
            <Play className="w-3.5 h-3.5" />
            Simulate 15m Transit Progress
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center p-2.5 bg-panel-alt hover:bg-gray-chip border border-line text-muted rounded-xl transition-all cursor-pointer"
            title="Reload Systems"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stat KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="p-5 bg-panel border border-line rounded-2xl shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-faint uppercase tracking-wider">Fleet Status</span>
              <h3 className="text-3xl font-display font-bold text-ink mt-1.5">{vehiclesOnTrip}/{totalVehicles}</h3>
            </div>
            <div className="p-2.5 bg-blue-bg text-blue rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[11px] text-muted">
            <span className="font-semibold text-green font-mono bg-green-bg px-1.5 py-0.5 rounded-sm">
              {vehiclesAvailable} idle
            </span>
            <span>•</span>
            <span className="text-amber font-mono font-semibold">{vehiclesInShop} in repairs</span>
          </div>
          {/* Simulated sparkline */}
          <div className="mt-4 pt-1 flex items-end gap-0.5 h-6 opacity-30">
            <div className="bg-blue w-full h-[30%] rounded-xs"></div>
            <div className="bg-blue w-full h-[45%] rounded-xs"></div>
            <div className="bg-blue w-full h-[35%] rounded-xs"></div>
            <div className="bg-blue w-full h-[60%] rounded-xs"></div>
            <div className="bg-blue w-full h-[55%] rounded-xs"></div>
            <div className="bg-blue w-full h-[80%] rounded-xs"></div>
            <div className="bg-blue w-full h-[70%] rounded-xs"></div>
            <div className="bg-blue w-full h-[95%] rounded-xs"></div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="p-5 bg-panel border border-line rounded-2xl shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-faint uppercase tracking-wider">Active Dispatches</span>
              <h3 className="text-3xl font-display font-bold text-ink mt-1.5">{activeTripsCount}</h3>
            </div>
            <div className="p-2.5 bg-green-bg text-green rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[11px] text-muted">
            <span className="font-semibold text-blue font-mono bg-blue-bg px-1.5 py-0.5 rounded-sm">
              {pendingTripsCount} scheduled
            </span>
            <span>•</span>
            <span className="font-semibold text-ink font-mono">2 completed today</span>
          </div>
          {/* Simulated sparkline */}
          <div className="mt-4 pt-1 flex items-end gap-0.5 h-6 opacity-30">
            <div className="bg-green w-full h-[15%] rounded-xs"></div>
            <div className="bg-green w-full h-[25%] rounded-xs"></div>
            <div className="bg-green w-full h-[50%] rounded-xs"></div>
            <div className="bg-green w-full h-[40%] rounded-xs"></div>
            <div className="bg-green w-full h-[65%] rounded-xs"></div>
            <div className="bg-green w-full h-[85%] rounded-xs"></div>
            <div className="bg-green w-full h-[60%] rounded-xs"></div>
            <div className="bg-green w-full h-[100%] rounded-xs"></div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="p-5 bg-panel border border-line rounded-2xl shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-faint uppercase tracking-wider">Drivers Logged-On</span>
              <h3 className="text-3xl font-display font-bold text-ink mt-1.5">{activeDriversCount}/{totalDrivers}</h3>
            </div>
            <div className="p-2.5 bg-amber-bg text-amber-deep rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[11px] text-muted">
            <span className="text-green font-mono font-semibold">96.8% Efficiency score</span>
            <span>•</span>
            <span>0 infractions logged</span>
          </div>
          {/* Simulated sparkline */}
          <div className="mt-4 pt-1 flex items-end gap-0.5 h-6 opacity-30">
            <div className="bg-amber w-full h-[50%] rounded-xs"></div>
            <div className="bg-amber w-full h-[60%] rounded-xs"></div>
            <div className="bg-amber w-full h-[45%] rounded-xs"></div>
            <div className="bg-amber w-full h-[70%] rounded-xs"></div>
            <div className="bg-amber w-full h-[80%] rounded-xs"></div>
            <div className="bg-amber w-full h-[65%] rounded-xs"></div>
            <div className="bg-amber w-full h-[90%] rounded-xs"></div>
            <div className="bg-amber w-full h-[85%] rounded-xs"></div>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="p-5 bg-panel border border-line rounded-2xl shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-faint uppercase tracking-wider">Yard Repairs</span>
              <h3 className="text-3xl font-display font-bold text-ink mt-1.5">{activeMaintenanceCount}</h3>
            </div>
            <div className="p-2.5 bg-red-bg text-red rounded-xl">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[11px] text-muted">
            <span className="text-red font-mono font-semibold">1 Critical Overhaul</span>
            <span>•</span>
            <span className="text-muted">Avg downtime 3.2d</span>
          </div>
          {/* Simulated sparkline */}
          <div className="mt-4 pt-1 flex items-end gap-0.5 h-6 opacity-30">
            <div className="bg-red w-full h-[80%] rounded-xs"></div>
            <div className="bg-red w-full h-[65%] rounded-xs"></div>
            <div className="bg-red w-full h-[45%] rounded-xs"></div>
            <div className="bg-red w-full h-[30%] rounded-xs"></div>
            <div className="bg-red w-full h-[40%] rounded-xs"></div>
            <div className="bg-red w-full h-[20%] rounded-xs"></div>
            <div className="bg-red w-full h-[15%] rounded-xs"></div>
            <div className="bg-red w-full h-[10%] rounded-xs"></div>
          </div>
        </div>
      </div>

      {/* Map, Live Dispatch and Activity logs Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Map Simulator Visualizer Panel (Left 7 Columns) */}
        <div className="lg:col-span-8 flex flex-col p-5 bg-panel border border-line rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-ink text-base">GIS Telematics Console (Interactive Simulator)</h3>
              <p className="text-xs text-muted">Real-time routing map rendering. Grid points represent regional hubs.</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-muted">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue"></span> Transit
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green"></span> Idle
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber animate-pulse"></span> Repair
              </div>
            </div>
          </div>

          {/* Map Body Graphic */}
          <div className="relative h-72 bg-[#121A1E] rounded-xl overflow-hidden border border-sidebar-line flex flex-col justify-between p-4">
            {/* Grid overlay lines */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#F5A623_1px,transparent_1px),linear-gradient(to_bottom,#F5A623_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            {/* Simulated Road Lines / Curves using SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              {/* NH-48 Express highway */}
              <path d="M 50,50 Q 250,150 450,80 T 750,220" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6,4" />
              {/* Western Corridor */}
              <path d="M 120,280 Q 320,180 520,260 T 780,50" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4,6" />
              {/* Regional Connectors */}
              <line x1="50" y1="50" x2="120" y2="280" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="450" y1="80" x2="520" y2="260" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2,2" />
            </svg>

            {/* Static Marker Points (Hubs) */}
            <div className="absolute top-[50px] left-[50px] z-10 flex flex-col items-center">
              <div className="w-3 h-3 bg-white border border-ink rounded-full shadow-lg"></div>
              <span className="text-[9px] font-mono font-bold text-faint mt-1 bg-ink/75 px-1 rounded-xs">DELHI</span>
            </div>
            <div className="absolute bottom-[40px] left-[120px] z-10 flex flex-col items-center">
              <div className="w-3 h-3 bg-white border border-ink rounded-full shadow-lg"></div>
              <span className="text-[9px] font-mono font-bold text-faint mt-1 bg-ink/75 px-1 rounded-xs">MUMBAI</span>
            </div>
            <div className="absolute top-[80px] left-[450px] z-10 flex flex-col items-center">
              <div className="w-3 h-3 bg-white border border-ink rounded-full shadow-lg"></div>
              <span className="text-[9px] font-mono font-bold text-faint mt-1 bg-ink/75 px-1 rounded-xs">JAIPUR</span>
            </div>
            <div className="absolute bottom-[60px] left-[520px] z-10 flex flex-col items-center">
              <div className="w-3 h-3 bg-white border border-ink rounded-full shadow-lg"></div>
              <span className="text-[9px] font-mono font-bold text-faint mt-1 bg-ink/75 px-1 rounded-xs">AHMEDABAD</span>
            </div>
            <div className="absolute bottom-[100px] right-[100px] z-10 flex flex-col items-center">
              <div className="w-3 h-3 bg-white border border-ink rounded-full shadow-lg"></div>
              <span className="text-[9px] font-mono font-bold text-faint mt-1 bg-ink/75 px-1 rounded-xs">CHENNAI</span>
            </div>

            {/* Dynamic Interactive Moving Vehicles on Map */}
            {trips.filter(t => t.status === 'Active').map((trip, idx) => {
              // Map vehicle position using progress value
              const startX = idx === 0 ? 120 : 450;
              const startY = idx === 0 ? 240 : 80;
              const endX = idx === 0 ? 300 : 520;
              const endY = idx === 0 ? 180 : 260;

              const progressPct = trip.progress / 100;
              const currentX = startX + (endX - startX) * progressPct;
              const currentY = startY + (endY - startY) * progressPct;

              // Match vehicle model short-code
              const vehicle = vehicles.find(v => v.id === trip.vehicleId);
              const plateCode = vehicle ? vehicle.registrationNumber.substring(0, 7) : 'TRUCK';

              return (
                <div 
                  key={trip.id}
                  style={{ left: `${currentX}px`, top: `${currentY}px` }}
                  className="absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 group cursor-pointer"
                >
                  <div className="relative">
                    {/* Ring Pulse */}
                    <div className="absolute -inset-1.5 rounded-full bg-blue/40 animate-ping"></div>
                    <div className="w-5 h-5 bg-blue hover:bg-amber border border-white text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-lg relative">
                      🚚
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-sidebar text-[#EDEFEC] border border-sidebar-line p-2 rounded-lg text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-2xl pointer-events-none">
                      <div className="font-semibold text-amber">{trip.tripId} ({plateCode})</div>
                      <div>From: {trip.origin.split(' ')[0]}</div>
                      <div>To: {trip.destination.split(' ')[0]}</div>
                      <div>Progress: {trip.progress}%</div>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono bg-blue-bg/95 text-blue font-bold px-1 py-0.5 rounded-sm mt-1 shadow-md border border-blue/20">
                    {trip.tripId} • {trip.progress}%
                  </span>
                </div>
              );
            })}

            {/* Static In-Shop/Repair markers */}
            {vehicles.filter(v => v.status === 'In Shop').map((v, i) => {
              const xCoord = 280 + i * 40;
              const yCoord = 120 + i * 20;
              return (
                <div 
                  key={v.id}
                  style={{ left: `${xCoord}px`, top: `${yCoord}px` }}
                  className="absolute z-10 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                >
                  <div className="w-4.5 h-4.5 bg-amber border border-white text-[9px] rounded-full flex items-center justify-center shadow-lg">
                    🛠️
                  </div>
                  <span className="text-[8px] font-mono bg-amber-bg text-amber-deep font-bold px-0.5 py-0.2 rounded-sm mt-1 border border-amber/20">
                    SHOP ({v.registrationNumber.substring(0, 7)})
                  </span>
                </div>
              );
            })}

            {/* UI overlay cards within Map */}
            <div className="z-10 mt-auto flex justify-between items-end">
              <div className="bg-ink/80 backdrop-blur-xs border border-sidebar-line p-2.5 rounded-lg text-[10px] font-mono text-[#C7CFCC] space-y-0.5 max-w-xs">
                <div className="text-amber font-semibold">📍 SYSTEM STATUS REPORT</div>
                <div>Server Time: <span className="text-white">2026-07-12 UTC</span></div>
                <div>Live Satellites: <span className="text-green font-bold">● Connected (6)</span></div>
                <div>Telematics Ping: <span className="text-white">12ms (Direct Line)</span></div>
              </div>
              
              <div className="bg-amber p-2.5 rounded-lg shadow-xl border border-amber/10 flex items-center gap-2 max-w-xs cursor-pointer active:scale-95" onClick={handleSimulate}>
                <Play className="w-3.5 h-3.5 text-ink animate-pulse" />
                <div className="text-ink">
                  <div className="text-[9px] font-bold font-mono tracking-wider uppercase leading-none">AUTO SIMULATE</div>
                  <div className="text-[10px] font-semibold mt-0.5">Click to run fleet routes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Dispatches Feed within Map Container */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-faint uppercase tracking-wider">Transit Manifest Logs</h4>
              <button onClick={() => onNavigate('trips')} className="text-xs text-blue font-semibold flex items-center gap-0.5 hover:underline cursor-pointer">
                Dispatch Desk <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {trips.slice(0, 2).map((trip) => {
                const vehicle = vehicles.find(v => v.id === trip.vehicleId);
                const driver = drivers.find(d => d.id === trip.driverId);
                return (
                  <div key={trip.id} className="p-3.5 bg-panel-alt hover:bg-gray-chip/70 border border-line rounded-xl transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-ink">{trip.tripId}</span>
                          <span className="text-[10px] bg-blue-bg text-blue font-mono px-1.5 py-0.2 rounded-sm font-semibold">
                            ACTIVE
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-muted mt-1">
                          {trip.origin.split(' ')[0]} → {trip.destination.split(' ')[0]}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-semibold text-ink">{trip.progress}%</span>
                        <div className="text-[10px] text-faint mt-0.5">EST: 2.5h remaining</div>
                      </div>
                    </div>
                    {/* Progress slider bar */}
                    <div className="w-full bg-line h-1.5 rounded-full mt-3 overflow-hidden">
                      <div 
                        className="bg-blue h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${trip.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted mt-2">
                      <span>🚚 {vehicle?.model.split(' ')[0]}</span>
                      <span>👤 {driver?.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Alerts, Notifications & Logs (Right 4 Columns) */}
        <div className="lg:col-span-4 flex flex-col p-5 bg-panel border border-line rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-line">
            <h3 className="font-display font-bold text-ink text-base">Security Alerts & Logs</h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red"></span>
            </span>
          </div>

          <div className="flex-1 space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
            {notifications.map((n) => {
              let iconElement = <Bell className="w-4 h-4 text-blue" />;
              let badgeColorClass = 'bg-blue-bg border-blue/10';
              if (n.type === 'success') {
                iconElement = <CheckCircle className="w-4 h-4 text-green" />;
                badgeColorClass = 'bg-green-bg border-green/10';
              } else if (n.type === 'warning') {
                iconElement = <AlertTriangle className="w-4 h-4 text-amber-deep" />;
                badgeColorClass = 'bg-amber-bg border-amber/10';
              } else if (n.type === 'error') {
                iconElement = <AlertTriangle className="w-4 h-4 text-red" />;
                badgeColorClass = 'bg-red-bg border-red/10';
              }

              return (
                <div key={n.id} className={`p-3.5 border rounded-xl transition-all ${badgeColorClass}`}>
                  <div className="flex gap-2.5">
                    <div className="mt-0.5 flex-none">{iconElement}</div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-ink">{n.title}</span>
                        <span className="text-[9px] font-mono text-muted">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Support / Safety Code Card */}
          <div className="mt-6 p-4 bg-sidebar rounded-xl border border-sidebar-line flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber" />
              <span className="text-xs font-display font-bold text-white tracking-wide">COMPLIANCE PROTOCOL</span>
            </div>
            <p className="text-[10px] text-faint leading-normal">
              All active vehicle trips adhere to local road safety rules and driver hour limits (max 8h continuous driving). Any breach automatically prompts safety overrides.
            </p>
            <div className="flex gap-2 justify-between pt-1">
              <span className="text-[9px] font-mono text-muted">SECURE TOKEN: G-7721-OP</span>
              <span className="text-[9px] font-mono text-[#2E7D4F] font-bold bg-[#E3F2E9]/10 px-1 rounded-sm">COMPLIANT</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
