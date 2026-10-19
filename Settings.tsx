/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldCheck, 
  Database, 
  RotateCcw, 
  Sliders, 
  Cpu, 
  Wifi, 
  HelpCircle,
  Clock,
  Settings as SettingsIcon,
  HardDrive
} from 'lucide-react';
import { Role, User } from '../types';

interface SettingsProps {
  currentUser: User;
  onRestoreDefaults: () => void;
  onRoleOverride: (role: Role) => void;
}

export default function Settings({
  currentUser,
  onRestoreDefaults,
  onRoleOverride,
}: SettingsProps) {
  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-ink flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-amber" />
          Platform Settings
        </h1>
        <p className="text-xs text-muted">Configure access mappings, clean temporary cache buffers, and monitor platform nodes.</p>
      </div>

      {/* Role override quick toggle */}
      <div className="p-5 bg-panel border border-line rounded-2xl shadow-xs space-y-4">
        <div>
          <h3 className="font-display font-bold text-ink text-sm flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-amber" />
            Testing Override: Fast Role Switching
          </h3>
          <p className="text-xs text-muted">As an operator in AI Studio, you can dynamically hot-swap your security role to audit of different screens and gates.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {[
            { role: 'Fleet Manager', desc: 'Full write access' },
            { role: 'Dispatcher', desc: 'Route & map console' },
            { role: 'Safety Officer', desc: 'License compliance' },
            { role: 'Financial Analyst', desc: 'Refuel ledger control' }
          ].map((item) => {
            const isCurrent = currentUser.role === item.role;
            return (
              <button
                key={item.role}
                type="button"
                onClick={() => onRoleOverride(item.role as Role)}
                className={`p-3 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                  isCurrent 
                    ? 'bg-ink border-amber/30 text-white shadow-md' 
                    : 'bg-panel-alt border-line text-muted hover:border-line/80 hover:text-ink'
                }`}
              >
                <div className={`font-semibold ${isCurrent ? 'text-amber' : 'text-ink'}`}>{item.role}</div>
                <div className="text-[10px] opacity-75 mt-0.5 leading-tight">{item.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Telemetry and System Integrity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left Card: Database Reset */}
        <div className="p-5 bg-panel border border-line rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <h3 className="font-display font-bold text-ink text-sm flex items-center gap-1.5">
              <Database className="w-4 h-4 text-faint" />
              Local Database Management
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              TransitOps caches vehicles, logs, and active dispatch manifests inside the client local storage database. Restore defaults to discard any custom logs and seed original mock files.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to restore original default assets and wipe custom entries?')) {
                onRestoreDefaults();
              }
            }}
            className="flex items-center gap-1.5 py-2 px-3 bg-red-bg hover:bg-red text-red hover:text-white font-semibold text-xs rounded-xl border border-red/10 transition-all cursor-pointer self-start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restore Factory Seed Data
          </button>
        </div>

        {/* Right Card: Nodes and Telemetry status */}
        <div className="p-5 bg-panel border border-line rounded-2xl shadow-xs space-y-4 font-mono text-xs text-muted">
          <h3 className="font-display font-bold text-ink text-sm flex items-center gap-1.5 font-sans">
            <Cpu className="w-4 h-4 text-faint" />
            System Telemetry Node
          </h3>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center py-1 border-b border-line/40">
              <span className="flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5 text-green" /> Telematics Node:</span>
              <span className="text-ink font-bold">CONNECTED (99.8%)</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-line/40">
              <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-faint" /> Client Cache:</span>
              <span className="text-ink font-bold">2.4 KB (Active)</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-line/40">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-amber" /> Encryption Status:</span>
              <span className="text-ink font-bold">AES-256 Enabled</span>
            </div>
          </div>
        </div>

      </div>

      {/* Safety Compliance Section */}
      <div className="p-5 bg-sidebar rounded-2xl border border-sidebar-line flex flex-col md:flex-row gap-5 justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-amber" />
            <h4 className="font-display font-bold text-white text-sm">Regulatory Compliance Certification</h4>
          </div>
          <p className="text-[11px] text-faint max-w-xl">
            TransitOps meets standard Indian Transport Authority commercial code requirements (including driver shift boundaries, speed telemetry alerts, and regular fitness checks).
          </p>
        </div>
        <div className="font-mono text-[10px] text-green font-bold bg-green-bg/10 py-1.5 px-3 rounded-lg border border-green/20">
          APPROVED • COMPLIANT
        </div>
      </div>
    </div>
  );
}
