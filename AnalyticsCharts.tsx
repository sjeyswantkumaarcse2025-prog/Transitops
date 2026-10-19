/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Sparkles, PieChart, Info, DollarSign, Calendar, Truck, Layers } from 'lucide-react';
import { Vehicle, MaintenanceLog, FuelEntry, Role } from '../types';

interface AnalyticsChartsProps {
  vehicles: Vehicle[];
  maintenance: MaintenanceLog[];
  fuelEntries: FuelEntry[];
  userRole: Role;
}

export default function AnalyticsCharts({
  vehicles,
  maintenance,
  fuelEntries,
  userRole,
}: AnalyticsChartsProps) {
  // Compute data counts
  const totalVehicles = vehicles.length;
  const onTripCount = vehicles.filter(v => v.status === 'On Trip').length;
  const availableCount = vehicles.filter(v => v.status === 'Available').length;
  const inShopCount = vehicles.filter(v => v.status === 'In Shop').length;
  const outOfServiceCount = vehicles.filter(v => v.status === 'Out of Service').length;

  const totalFuelCost = fuelEntries.reduce((sum, f) => sum + f.cost, 0);
  const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + m.cost, 0);
  const cumulativeSpend = totalFuelCost + totalMaintenanceCost;

  // Active tab state
  const [activeTab, setActiveTab] = useState<'utilization' | 'financials'>('utilization');

  // Interactive highlight state
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  // Custom SVG donut chart parameters
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const dataPoints = [
    { label: 'On Trip', value: onTripCount, color: 'var(--color-blue)' },
    { label: 'Available', value: availableCount, color: 'var(--color-green)' },
    { label: 'In Shop', value: inShopCount, color: 'var(--color-amber)' },
    { label: 'Out of Service', value: outOfServiceCount, color: 'var(--color-red)' },
  ].filter(dp => dp.value > 0);

  const totalPointsValue = dataPoints.reduce((sum, p) => sum + p.value, 0);

  // SVG Line Chart parameters for Fuel Cost Logs
  const fuelCostValues = fuelEntries.map(f => f.cost);
  const maxFuelCost = Math.max(...fuelCostValues, 5000);
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = 500;
  const chartHeight = 200;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink">Operational Analytics</h1>
          <p className="text-xs text-muted">Acoustic cost breakdowns, fleet allocation cycles, and mechanical overhead metrics.</p>
        </div>

        {/* Tab selection */}
        <div className="flex bg-panel-alt border border-line rounded-xl p-1 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('utilization')}
            className={`py-1.5 px-3.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'utilization' ? 'bg-panel border border-line text-ink shadow-xs' : 'text-muted hover:text-ink'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Asset Utilization
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`py-1.5 px-3.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'financials' ? 'bg-panel border border-line text-ink shadow-xs' : 'text-muted hover:text-ink'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Financial Leaks
          </button>
        </div>
      </div>

      {/* Top Level Quick Financial Statistics Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-panel border border-line rounded-2xl shadow-xs">
          <div className="text-[10px] font-bold text-faint uppercase tracking-wider font-mono">CUMULATIVE RUNTIME EXPENSE</div>
          <h3 className="text-2xl font-display font-bold text-ink mt-1">₹ {cumulativeSpend.toLocaleString('en-IN')}</h3>
          <div className="flex items-center gap-1.5 text-[10px] text-muted mt-2">
            <span className="font-mono bg-amber-bg text-amber-deep font-bold px-1 rounded-sm">74.5% Fuel</span>
            <span>•</span>
            <span className="font-mono text-ink">25.5% Mechanics</span>
          </div>
        </div>

        <div className="p-5 bg-panel border border-line rounded-2xl shadow-xs">
          <div className="text-[10px] font-bold text-faint uppercase tracking-wider font-mono">ACTIVE UTILIZATION RATE</div>
          <h3 className="text-2xl font-display font-bold text-ink mt-1">
            {totalVehicles > 0 ? ((onTripCount / totalVehicles) * 100).toFixed(0) : 0}%
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] text-muted mt-2">
            <span className="font-mono bg-green-bg text-green font-bold px-1 rounded-sm">COMPLIANT</span>
            <span>•</span>
            <span>Target threshold is 80%</span>
          </div>
        </div>

        <div className="p-5 bg-panel border border-line rounded-2xl shadow-xs">
          <div className="text-[10px] font-bold text-faint uppercase tracking-wider font-mono">WORKSHOP REPAIR BURDEN</div>
          <h3 className="text-2xl font-display font-bold text-ink mt-1">₹ {totalMaintenanceCost.toLocaleString('en-IN')}</h3>
          <div className="flex items-center gap-1.5 text-[10px] text-muted mt-2 text-red font-semibold">
            <span className="font-mono animate-pulse">●</span> Heavy engine leaks active
          </div>
        </div>
      </div>

      {activeTab === 'utilization' ? (
        /* ==================== TAB: UTILIZATION ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Pie/Donut Chart Segment */}
          <div className="lg:col-span-5 p-5 bg-panel border border-line rounded-2xl shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-ink text-base">Fleet Allocation Breakdown</h3>
              <p className="text-xs text-muted mb-6">Visual distribution of trucks logged on, offline, or currently undergoing repair.</p>
            </div>

            {/* Render Donut using SVG */}
            <div className="relative flex justify-center py-6">
              <svg width="220" height="220" viewBox="0 0 160 160" className="transform -rotate-90">
                <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--color-gray-chip)" strokeWidth="18" />
                {(() => {
                  let accumulatedPercent = 0;
                  return dataPoints.map((dp, idx) => {
                    const percent = dp.value / totalPointsValue;
                    const strokeDashoffset = circumference - (percent * circumference);
                    const strokeDasharray = `${circumference} ${circumference}`;
                    const rotation = accumulatedPercent * 360;
                    accumulatedPercent += percent;

                    const isHighlighted = highlightedIndex === idx;

                    return (
                      <circle
                        key={dp.label}
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke={dp.color}
                        strokeWidth={isHighlighted ? 24 : 18}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        transform={`rotate(${rotation} 80 80)`}
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        onMouseLeave={() => setHighlightedIndex(null)}
                      />
                    );
                  });
                })()}
              </svg>

              {/* Centered Stats overlay inside Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-display font-bold text-ink">{totalVehicles}</span>
                <span className="text-[10px] font-mono text-faint uppercase font-bold tracking-widest">ACTIVE TRUCKS</span>
              </div>
            </div>

            {/* Interactive chart legend */}
            <div className="grid grid-cols-2 gap-3.5 pt-4 border-t border-line/60">
              {dataPoints.map((dp, idx) => {
                const percent = ((dp.value / totalPointsValue) * 100).toFixed(0);
                const isSelected = highlightedIndex === idx;
                return (
                  <div 
                    key={dp.label}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onMouseLeave={() => setHighlightedIndex(null)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected ? 'bg-panel-alt border-line/80 shadow-xs scale-102' : 'border-transparent bg-panel-alt/55'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs flex-none" style={{ backgroundColor: dp.color }}></span>
                      <span className="text-xs font-semibold text-ink">{dp.label}</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-muted mt-1 ml-4.5">
                      {dp.value} Unit ({percent}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Allocation Analysis */}
          <div className="lg:col-span-7 p-5 bg-panel border border-line rounded-2xl shadow-xs space-y-4">
            <div>
              <h3 className="font-display font-bold text-ink text-base">Allocation Diagnostic Notes</h3>
              <p className="text-xs text-muted">Weekly operational review and recommendations compiled based on asset logs.</p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-blue-bg/40 border border-blue/10 rounded-xl flex gap-3">
                <div className="mt-0.5 text-blue text-sm flex-none">🔍</div>
                <div>
                  <h4 className="text-xs font-bold text-ink">Trip Allocation Cycles</h4>
                  <p className="text-xs text-muted leading-relaxed mt-0.5">
                    Currently, {onTripCount} vehicles are making long-haul routes. Fleet availability remains solid at {availableCount} units, providing comfortable overhead to take on more deliveries this week.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-bg/40 border border-amber/10 rounded-xl flex gap-3">
                <div className="mt-0.5 text-amber-deep text-sm flex-none">🛠️</div>
                <div>
                  <h4 className="text-xs font-bold text-ink">Yard Repair Bottlenecks</h4>
                  <p className="text-xs text-muted leading-relaxed mt-0.5">
                    We have {inShopCount} heavy truck currently detailed inside workshop bays. Labor compression is active. Recommended to release Tata Prima by 2026-07-15 to keep maintenance costs flat.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-panel-alt rounded-xl border border-line flex gap-3">
                <div className="mt-0.5 text-muted text-sm flex-none">🛡️</div>
                <div>
                  <h4 className="text-xs font-bold text-ink">Safety Compliance Score</h4>
                  <p className="text-xs text-muted leading-relaxed mt-0.5">
                    All currently active trips match certified speed limits and driver shifts. Zero hour-limit breaches or telematics anomalies logged over the last 48 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Graphic Spark Bar */}
            <div className="pt-4 border-t border-line/50">
              <span className="text-[10px] font-mono font-bold text-faint uppercase tracking-wider block mb-2">OPERATIONAL MIX BAR</span>
              <div className="w-full h-4 rounded-md overflow-hidden flex font-mono text-[9px] font-bold text-white">
                <div style={{ width: `${(onTripCount/totalVehicles)*100}%` }} className="bg-blue flex items-center justify-center truncate">On Trip</div>
                <div style={{ width: `${(availableCount/totalVehicles)*100}%` }} className="bg-green flex items-center justify-center truncate">Idle</div>
                <div style={{ width: `${((inShopCount+outOfServiceCount)/totalVehicles)*100}%` }} className="bg-amber flex items-center justify-center truncate">Yard</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== TAB: FINANCIALS ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Custom SVG Line Chart showing refuel expenses */}
          <div className="lg:col-span-7 p-5 bg-panel border border-line rounded-2xl shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-ink text-base">Fuel Expense Ledger Curve</h3>
              <p className="text-xs text-muted mb-4">Tracking purchase costs (INR) across recent fuel receipts.</p>
            </div>

            {/* Custom Responsive SVG Line/Area graph */}
            <div className="w-full overflow-x-auto pt-2">
              <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                {/* Background Grid Lines */}
                <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="var(--color-line)" strokeDasharray="3,3" opacity="0.4" />
                <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="var(--color-line)" strokeDasharray="3,3" opacity="0.4" />
                <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="var(--color-line)" strokeDasharray="3,3" opacity="0.4" />

                {/* Draw SVG Area Gradient under the Curve */}
                {(() => {
                  if (fuelEntries.length < 2) return null;
                  const stepX = (chartWidth - 2 * paddingX) / (fuelEntries.length - 1);
                  const points = fuelEntries.map((f, i) => {
                    const x = paddingX + i * stepX;
                    const y = chartHeight - paddingY - ((f.cost / maxFuelCost) * (chartHeight - 2 * paddingY));
                    return `${x},${y}`;
                  });

                  const areaPath = `M ${paddingX},${chartHeight - paddingY} L ${points.join(' L ')} L ${chartWidth - paddingX},${chartHeight - paddingY} Z`;

                  return (
                    <>
                      {/* Gradient def */}
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-green)" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="var(--color-green)" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d={areaPath} fill="url(#areaGrad)" />
                      {/* Curve line */}
                      <path d={`M ${points.join(' L ')}`} fill="none" stroke="var(--color-green)" strokeWidth="3" />
                    </>
                  );
                })()}

                {/* Draw Interactive node circles */}
                {fuelEntries.map((f, i) => {
                  const stepX = (chartWidth - 2 * paddingX) / (fuelEntries.length - 1);
                  const x = paddingX + i * stepX;
                  const y = chartHeight - paddingY - ((f.cost / maxFuelCost) * (chartHeight - 2 * paddingY));

                  return (
                    <g key={f.id} className="group cursor-pointer">
                      <circle cx={x} cy={y} r="5" fill="var(--color-green)" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx={x} cy={y} r="8" fill="var(--color-green)" opacity="0" className="group-hover:opacity-20 transition-all" />
                      {/* Tooltip text */}
                      <text x={x} y={y - 10} textAnchor="middle" className="text-[10px] font-mono font-bold fill-ink hidden group-hover:block">
                        ₹ {f.cost}
                      </text>
                    </g>
                  );
                })}

                {/* X-axis labels */}
                {fuelEntries.map((f, i) => {
                  const stepX = (chartWidth - 2 * paddingX) / (fuelEntries.length - 1);
                  const x = paddingX + i * stepX;
                  return (
                    <text key={f.id} x={x} y={chartHeight - 10} textAnchor="middle" className="text-[9px] font-mono fill-faint">
                      {f.date.substring(5)}
                    </text>
                  );
                })}
              </svg>
            </div>

            <div className="flex justify-between items-center text-[10px] text-muted font-mono pt-4 border-t border-line/60">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green"></span> Diesel refuels
              </span>
              <span>Y-Axis: Total billing paid (INR)</span>
            </div>
          </div>

          {/* comparative side-by-side bar chart */}
          <div className="lg:col-span-5 p-5 bg-panel border border-line rounded-2xl shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-ink text-base">Expense Class Proportions</h3>
              <p className="text-xs text-muted mb-6">Auditing mechanic labor fees against fuel receipts.</p>
            </div>

            <div className="space-y-6">
              {/* Bar 1: Fuel Expense */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-ink flex items-center gap-1.5">⛽ Diesel Replenishments</span>
                  <span className="font-mono font-bold text-ink">₹ {totalFuelCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-line h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-green h-full rounded-full" 
                    style={{ width: `${(totalFuelCost / cumulativeSpend) * 100}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-faint font-mono text-right">
                  {((totalFuelCost / cumulativeSpend) * 100).toFixed(0)}% of total budget
                </div>
              </div>

              {/* Bar 2: Maintenance labor */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-ink flex items-center gap-1.5">🛠️ Repair Labor Charges</span>
                  <span className="font-mono font-bold text-ink">₹ {totalMaintenanceCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-line h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber h-full rounded-full" 
                    style={{ width: `${(totalMaintenanceCost / cumulativeSpend) * 100}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-faint font-mono text-right">
                  {((totalMaintenanceCost / cumulativeSpend) * 100).toFixed(0)}% of total budget
                </div>
              </div>
            </div>

            <div className="mt-8 p-3.5 bg-panel-alt rounded-xl border border-line text-xs text-muted leading-relaxed">
              <span className="font-bold text-ink flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber" /> Cost Analysis Audit:
              </span>
              Fuel remains our primary running overhead. Mechanic repairs are spiking due to the heavy Volvo FM alignment. Recommended to run preemptive chassis alignments to lower labor overhead.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
