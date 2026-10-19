/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Truck, KeyRound, AlertTriangle, HelpCircle } from 'lucide-react';
import { Role, User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('operations.manager@transitops.in');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<Role>('Fleet Manager');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate database lookup/authentication latency
    setTimeout(() => {
      setLoading(false);
      // Determine avatar color and nice display name based on role
      let displayName = 'Raven Kumar';
      let avatarColor = 'var(--color-amber)';
      
      if (role === 'Dispatcher') {
        displayName = 'Preeti Sharma';
        avatarColor = 'var(--color-blue)';
      } else if (role === 'Safety Officer') {
        displayName = 'Colonel Vikram Singh';
        avatarColor = 'var(--color-green)';
      } else if (role === 'Financial Analyst') {
        displayName = 'Ananya Sen';
        avatarColor = 'var(--color-red)';
      }

      onLoginSuccess({
        name: displayName,
        email: email,
        role: role,
        avatarColor: avatarColor,
      });
    }, 600);
  };

  const handleQuickSelect = (selectedRole: Role, defaultEmail: string) => {
    setRole(selectedRole);
    setEmail(defaultEmail);
    setError(null);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-sidebar select-none relative overflow-hidden" id="loginScreen">
      {/* Dynamic GRID lines overlay in CSS background */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#6366f1_1px,transparent_1px),linear-gradient(to_bottom,#6366f1_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* Brand Left Panel (Desktop only) */}
      <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-16 text-[#EDEFEC] relative z-10 border-r border-sidebar-line">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-amber rotate-45 rounded-xs shadow-[0_0_12px_rgba(99,102,241,0.5)]"></div>
          <span className="font-display font-bold text-xl tracking-wider text-white">TRANSITOPS</span>
        </div>

        <div className="my-auto max-w-xl">
          <span className="font-mono text-xs text-amber font-semibold tracking-widest bg-amber-bg/10 px-3 py-1.5 rounded-full border border-amber/20">
            ENTERPRISE CONSOLE
          </span>
          <h1 className="text-5xl font-display font-bold leading-[1.1] mt-6 mb-4 tracking-tight text-white">
            One login,<br />four distinct roles.
          </h1>
          <p className="text-faint text-base leading-relaxed max-w-lg mb-10">
            A high-fidelity operations terminal for fleet tracking, safety audit logging, maintenance diagnostics, and real-time operational cost summaries.
          </p>

          <div className="space-y-4">
            <div className="text-xs font-mono text-muted uppercase tracking-wider">AVAILABLE ACCESS PROFILES</div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => handleQuickSelect('Fleet Manager', 'operations.manager@transitops.in')}
                className={`p-3 text-left rounded-xl border text-sm transition-all cursor-pointer ${
                  role === 'Fleet Manager' 
                    ? 'bg-sidebar-active border-amber/40 text-white' 
                    : 'bg-transparent border-sidebar-line text-faint hover:border-sidebar-line/80 hover:text-white'
                }`}
              >
                <div className="font-semibold text-white">Fleet Manager</div>
                <div className="font-mono text-[11px] opacity-60">Full CRUD control & settings</div>
              </button>

              <button 
                type="button"
                onClick={() => handleQuickSelect('Dispatcher', 'dispatch.desk@transitops.in')}
                className={`p-3 text-left rounded-xl border text-sm transition-all cursor-pointer ${
                  role === 'Dispatcher' 
                    ? 'bg-sidebar-active border-amber/40 text-white' 
                    : 'bg-transparent border-sidebar-line text-faint hover:border-sidebar-line/80 hover:text-white'
                }`}
              >
                <div className="font-semibold text-white">Dispatcher</div>
                <div className="font-mono text-[11px] opacity-60">Trip builder & map console</div>
              </button>

              <button 
                type="button"
                onClick={() => handleQuickSelect('Safety Officer', 'safety.auditor@transitops.in')}
                className={`p-3 text-left rounded-xl border text-sm transition-all cursor-pointer ${
                  role === 'Safety Officer' 
                    ? 'bg-sidebar-active border-amber/40 text-white' 
                    : 'bg-transparent border-sidebar-line text-faint hover:border-sidebar-line/80 hover:text-white'
                }`}
              >
                <div className="font-semibold text-white">Safety Officer</div>
                <div className="font-mono text-[11px] opacity-60">Driver audits & ratings</div>
              </button>

              <button 
                type="button"
                onClick={() => handleQuickSelect('Financial Analyst', 'finance.hq@transitops.in')}
                className={`p-3 text-left rounded-xl border text-sm transition-all cursor-pointer ${
                  role === 'Financial Analyst' 
                    ? 'bg-sidebar-active border-amber/40 text-white' 
                    : 'bg-transparent border-sidebar-line text-faint hover:border-sidebar-line/80 hover:text-white'
                }`}
              >
                <div className="font-semibold text-white">Financial Analyst</div>
                <div className="font-mono text-[11px] opacity-60">Fuel ledgers & cost charts</div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <ShieldCheck className="w-4 h-4 text-green" />
          <span>TRANSITOPS SECURITY CORE • STATELESS RBAC DEPLOYED</span>
        </div>
      </div>

      {/* Login Screen Inputs Panel */}
      <div className="flex items-center justify-center p-8 lg:col-span-5 bg-panel relative z-10">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <div className="flex lg:hidden items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-amber rotate-45 rounded-xs"></div>
              <span className="font-display font-bold text-lg tracking-wider text-ink">TRANSITOPS</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-ink mb-1">Sign in to console</h2>
            <p className="text-muted text-xs">Access is scoped by your role assignment.</p>
          </div>

          {/* Quick Info Bar for Mobile */}
          <div className="lg:hidden p-3 bg-panel-alt rounded-lg border border-line mb-6 flex flex-col gap-1 text-xs text-muted">
            <span className="font-bold text-ink">Testing Tip:</span>
            <span>Switch the Role field to view different screens. Defaults are prefilled.</span>
          </div>

          {/* Error Box */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-bg text-red border border-red/20 rounded-xl mb-5 text-xs animate-pulse">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-none" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Role dropdown first as it drives credentials */}
            <div className="relative">
              <label className="block text-[10px] font-mono font-bold text-faint tracking-widest uppercase mb-1.5">
                ACCESS ROLE (RBAC)
              </label>
              <select
                value={role}
                onChange={(e) => {
                  const r = e.target.value as Role;
                  let m = 'operations.manager@transitops.in';
                  if (r === 'Dispatcher') m = 'dispatch.desk@transitops.in';
                  if (r === 'Safety Officer') m = 'safety.auditor@transitops.in';
                  if (r === 'Financial Analyst') m = 'finance.hq@transitops.in';
                  handleQuickSelect(r, m);
                }}
                className="w-full p-3 bg-panel border border-line rounded-xl text-ink font-sans text-sm focus:outline-none focus:ring-2 focus:ring-amber/50 cursor-pointer appearance-none"
              >
                <option value="Fleet Manager">🔧 Fleet Manager (Full Write Access)</option>
                <option value="Dispatcher">🗺️ Dispatcher (Trip Command)</option>
                <option value="Safety Officer">🛡️ Safety Officer (Driver Audits)</option>
                <option value="Financial Analyst">📈 Financial Analyst (Costs & Fuel Logs)</option>
              </select>
              <div className="absolute right-3.5 bottom-3.5 pointer-events-none text-muted text-xs">▼</div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-faint tracking-widest uppercase mb-1.5">
                OPERATIONAL EMAIL
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@transitops.in"
                  className="w-full p-3 bg-panel border border-line rounded-xl text-ink font-sans text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-amber/50"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-mono font-bold text-faint tracking-widest uppercase">
                  SECURITY KEY / PASSWORD
                </label>
                <a href="#reset" onClick={(e) => {e.preventDefault(); setError("Demo Mode: Contact your IT Admin to reset key.")}} className="text-[10px] font-semibold text-blue hover:underline">
                  Forgot key?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-panel border border-line rounded-xl text-ink font-sans text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-amber/50"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded-md accent-amber border-line w-4 h-4" defaultChecked />
                <span>Keep terminal active</span>
              </label>
              <span className="font-mono text-[10px]">v2.4.0-PRO</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-ink hover:bg-ink/90 text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer pt-3 pb-3 mt-6"
            >
              <KeyRound className="w-4 h-4 text-amber" />
              {loading ? 'Booting Console...' : 'Establish Secure Connection'}
            </button>
          </form>

          {/* Quick tips footer */}
          <div className="mt-10 p-3 bg-panel-alt rounded-xl border border-line/50 text-[11px] text-muted space-y-1">
            <div className="font-semibold text-ink flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber" /> Demo Credentials:
            </div>
            <p>You can use the dropdown to switch roles. The system automatically adjusts permissions and enables role-specific pages.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
