/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  MapPin, 
  Wrench, 
  Fuel, 
  BarChart3, 
  Settings as SettingsIcon, 
  LogOut, 
  Bell, 
  Lock, 
  Menu, 
  X,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';

import { 
  Role, 
  User, 
  Vehicle, 
  VehicleStatus, 
  Driver, 
  DriverStatus, 
  Trip, 
  TripStatus, 
  MaintenanceLog, 
  MaintenanceStatus, 
  FuelEntry, 
  SystemNotification 
} from './types';

import { 
  INITIAL_VEHICLES, 
  INITIAL_DRIVERS, 
  INITIAL_TRIPS, 
  INITIAL_MAINTENANCE, 
  INITIAL_FUEL, 
  INITIAL_NOTIFICATIONS 
} from './mockData';

// Component Imports
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FleetRegistry from './components/FleetRegistry';
import DriversDirectory from './components/DriversDirectory';
import DispatchTrips from './components/DispatchTrips';
import MaintenanceLogViewer from './components/MaintenanceLogViewer';
import FuelCostTracker from './components/FuelCostTracker';
import AnalyticsCharts from './components/AnalyticsCharts';
import Settings from './components/Settings';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('transitops_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Sidebar navigation active state
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('transitops_active_tab') || 'dashboard';
  });

  // Mobile sidebar visibility toggle
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // App Master States
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('transitops_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('transitops_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('transitops_trips');
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  const [maintenance, setMaintenance] = useState<MaintenanceLog[]>(() => {
    const saved = localStorage.getItem('transitops_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>(() => {
    const saved = localStorage.getItem('transitops_fuel');
    return saved ? JSON.parse(saved) : INITIAL_FUEL;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('transitops_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Synced local storage state updates
  useEffect(() => {
    localStorage.setItem('transitops_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('transitops_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('transitops_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('transitops_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  useEffect(() => {
    localStorage.setItem('transitops_fuel', JSON.stringify(fuelEntries));
  }, [fuelEntries]);

  useEffect(() => {
    localStorage.setItem('transitops_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('transitops_active_tab', activeTab);
  }, [activeTab]);

  // Auth helper
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('transitops_user', JSON.stringify(user));
    // Set tab to allowed first tab
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('transitops_user');
  };

  const handleRoleOverride = (role: Role) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, role };
    setCurrentUser(updatedUser);
    localStorage.setItem('transitops_user', JSON.stringify(updatedUser));
  };

  // Restore Defaults helper
  const handleRestoreDefaults = () => {
    setVehicles(INITIAL_VEHICLES);
    setDrivers(INITIAL_DRIVERS);
    setTrips(INITIAL_TRIPS);
    setMaintenance(INITIAL_MAINTENANCE);
    setFuelEntries(INITIAL_FUEL);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveTab('dashboard');
  };

  // Push system notification helper
  const pushNotification = (
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'warning' | 'error'
  ) => {
    const newNotif: SystemNotification = {
      id: `n-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // --- COMPONENT HANDLERS ---
  
  // Vehicles
  const handleAddVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      id: `v-${Date.now()}`,
      ...vehicleData
    };
    setVehicles(prev => [newVehicle, ...prev]);
    pushNotification(
      'Asset Registered', 
      `Vehicle ${newVehicle.registrationNumber} has been recorded into the centralized yard ledger.`,
      'success'
    );
  };

  const handleUpdateVehicleStatus = (id: string, status: VehicleStatus) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    const vName = vehicles.find(v => v.id === id)?.registrationNumber || 'Vehicle';
    pushNotification(
      'Telemetry Updated', 
      `${vName} status overridden to "${status}".`,
      'info'
    );
  };

  const handleDeleteVehicle = (id: string) => {
    const plate = vehicles.find(v => v.id === id)?.registrationNumber || 'Asset';
    setVehicles(prev => prev.filter(v => v.id !== id));
    pushNotification('Asset Deregistered', `Vehicle ${plate} was removed from database operations.`, 'warning');
  };

  // Drivers
  const handleAddDriver = (driverData: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      id: `d-${Date.now()}`,
      ...driverData
    };
    setDrivers(prev => [newDriver, ...prev]);
    pushNotification('Driver Profile Saved', `${newDriver.name} is now approved in compliance files.`, 'success');
  };

  const handleUpdateDriverStatus = (id: string, status: DriverStatus) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    const dName = drivers.find(d => d.id === id)?.name || 'Driver';
    pushNotification('Safety Compliance Code', `${dName} changed to "${status}".`, 'info');
  };

  const handleDeleteDriver = (id: string) => {
    const name = drivers.find(d => d.id === id)?.name || 'Driver';
    setDrivers(prev => prev.filter(d => d.id !== id));
    pushNotification('Driver Expelled', `${name} profile removed from operating schedule.`, 'warning');
  };

  // Trips & Simulating Progress
  const handleAddTrip = (tripData: Omit<Trip, 'id' | 'tripId' | 'progress'>) => {
    const tripNum = 1000 + trips.length + 1;
    const newTrip: Trip = {
      id: `t-${Date.now()}`,
      tripId: `TR-${tripNum}`,
      progress: 0,
      ...tripData
    };
    setTrips(prev => [newTrip, ...prev]);

    // Update vehicle and driver status to On Trip
    setVehicles(prev => prev.map(v => v.id === tripData.vehicleId ? { ...v, status: 'On Trip' } : v));
    setDrivers(prev => prev.map(d => d.id === tripData.driverId ? { ...d, status: 'On Trip' } : d));

    pushNotification('Trip Launched', `Manifest line ${newTrip.tripId} dispatched. Vehicle is now in-route.`, 'success');
  };

  const handleUpdateTripProgress = (id: string, progress: number) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, progress } : t));
  };

  const handleUpdateTripStatus = (id: string, status: TripStatus) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    const targetTrip = trips.find(t => t.id === id);
    if (!targetTrip) return;

    if (status === 'Completed') {
      // Release vehicle & driver
      setVehicles(prev => prev.map(v => v.id === targetTrip.vehicleId ? { ...v, status: 'Available' } : v));
      setDrivers(prev => prev.map(d => d.id === targetTrip.driverId ? { ...d, status: 'Active' } : d));
      pushNotification('Trip Completed', `Manifest ${targetTrip.tripId} has reached destination yard. Assets returned to idle pool.`, 'success');
    } else if (status === 'Cancelled') {
      setVehicles(prev => prev.map(v => v.id === targetTrip.vehicleId ? { ...v, status: 'Available' } : v));
      setDrivers(prev => prev.map(d => d.id === targetTrip.driverId ? { ...d, status: 'Active' } : d));
      pushNotification('Trip Cancelled', `Manifest ${targetTrip.tripId} abort command logged.`, 'error');
    }
  };

  // Maintenance Repairs
  const handleAddLog = (logData: Omit<MaintenanceLog, 'id'>) => {
    const newLog: MaintenanceLog = {
      id: `m-${Date.now()}`,
      ...logData
    };
    setMaintenance(prev => [newLog, ...prev]);

    // If repair order is In Progress, send the vehicle to Shop
    if (logData.status === 'In Progress') {
      setVehicles(prev => prev.map(v => v.id === logData.vehicleId ? { ...v, status: 'In Shop' } : v));
    }

    pushNotification('Repair Scheduled', `Repair logged for asset. Workshop ticket assigned.`, 'warning');
  };

  const handleUpdateLogStatus = (id: string, status: MaintenanceStatus) => {
    setMaintenance(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    const targetLog = maintenance.find(m => m.id === id);
    if (!targetLog) return;

    if (status === 'In Progress') {
      setVehicles(prev => prev.map(v => v.id === targetLog.vehicleId ? { ...v, status: 'In Shop' } : v));
      pushNotification('Repair Active', `Vehicle has been towed into workshop bay for labor.`, 'warning');
    } else if (status === 'Completed') {
      // Return vehicle to Available
      setVehicles(prev => prev.map(v => v.id === targetLog.vehicleId ? { ...v, status: 'Available' } : v));
      pushNotification('Repair Cleared', `Diagnostics passed. Maintenance ticket closed. Vehicle returned to yard.`, 'success');
    }
  };

  // Fuel Ledger
  const handleAddFuelEntry = (entryData: Omit<FuelEntry, 'id'>) => {
    const newEntry: FuelEntry = {
      id: `f-${Date.now()}`,
      ...entryData
    };
    setFuelEntries(prev => [newEntry, ...prev]);

    // Replenish fuel of the vehicle
    setVehicles(prev => prev.map(v => v.id === entryData.vehicleId ? { ...v, fuelLevel: 100 } : v));

    pushNotification('Fuel Replenished', `Truck refueled to 100% at ${entryData.location}. Bill catalogued.`, 'success');
  };

  // Master Global Telematics Simulation Loop
  const handleTriggerSimulation = () => {
    // 1. Iterate over active trips
    let hasUpdated = false;

    setTrips(prevTrips => {
      const updated = prevTrips.map(trip => {
        if (trip.status === 'Active') {
          hasUpdated = true;
          const nextProgress = Math.min(trip.progress + Math.floor(Math.random() * 16) + 10, 100);
          
          if (nextProgress === 100) {
            // Releasing the vehicle and driver in adjacent state
            setTimeout(() => {
              setVehicles(vPrev => vPrev.map(v => v.id === trip.vehicleId ? { ...v, status: 'Available', fuelLevel: Math.max(v.fuelLevel - 25, 10) } : v));
              setDrivers(dPrev => dPrev.map(d => d.id === trip.driverId ? { ...d, status: 'Active' } : d));
              pushNotification('Destination Reached', `Trip ${trip.tripId} finished! Cargo successfully unloaded.`, 'success');
            }, 100);

            return { ...trip, progress: 100, status: 'Completed' };
          }

          // Reduce vehicle fuel and add odometer mileage
          setTimeout(() => {
            setVehicles(vPrev => vPrev.map(v => {
              if (v.id === trip.vehicleId) {
                const updatedFuel = Math.max(v.fuelLevel - Math.floor(Math.random() * 8) - 5, 5);
                if (updatedFuel <= 15) {
                  pushNotification('Critical Fuel Alert', `${v.registrationNumber} is operating below 15% fuel level. Refueling required.`, 'error');
                }
                return {
                  ...v,
                  fuelLevel: updatedFuel,
                  odometer: v.odometer + Math.floor(Math.random() * 120) + 40
                };
              }
              return v;
            }));
          }, 100);

          return { ...trip, progress: nextProgress };
        }
        return trip;
      });
      return updated;
    });

    if (!hasUpdated) {
      pushNotification('Simulation Idle', 'No active dispatches are currently in-route. Go to the Dispatch Desk to launch routes.', 'info');
    }
  };

  // Render Login Gate
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // RBAC Access Maps: Check if page is locked for current role
  // We will display restricted pages with an interactive explanatory gate
  const isPageRestricted = (tab: string): boolean => {
    const role = currentUser.role;
    if (tab === 'fleet' && role === 'Safety Officer') return true;
    return false;
  };

  // Sidebar Menu Items with role boundaries information
  const menuItems = [
    { id: 'dashboard', label: 'Operational Dashboard', icon: LayoutDashboard },
    { id: 'fleet', label: 'Fleet & Assets', icon: Truck, restricted: currentUser.role === 'Safety Officer' },
    { id: 'drivers', label: 'Drivers Directory', icon: Users },
    { id: 'trips', label: 'Dispatch Trips', icon: MapPin },
    { id: 'maintenance', label: 'Yard Repairs', icon: Wrench },
    { id: 'fuel', label: 'Fuel & Expenses', icon: Fuel },
    { id: 'analytics', label: 'Visual Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Platform Settings', icon: SettingsIcon },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-page-bg text-ink flex flex-col md:flex-row relative">
      
      {/* 1. SIDEBAR NAVIGATION - DESKTOP & MOBILE TRANSITIONS */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-sidebar text-[#C9D0CD] p-5 flex flex-col justify-between border-r border-sidebar-line transition-transform duration-300
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Logo Mark Header */}
          <div className="flex items-center justify-between pb-3 border-b border-sidebar-line/50">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 bg-amber rotate-45 rounded-xs shadow-[0_0_8px_rgba(245,166,35,0.4)]"></div>
              <span className="font-display font-bold text-lg tracking-wider text-white">TRANSITOPS</span>
            </div>
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 bg-sidebar-active rounded-lg text-faint hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Menu Options */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              const isRestricted = item.restricted;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer text-left focus:outline-none
                    ${isActive 
                      ? 'bg-sidebar-active text-white border-l-3 border-amber pl-2.5' 
                      : 'hover:bg-sidebar-active/60 text-[#AEB8B4] hover:text-white'
                    }
                    ${isRestricted ? 'opacity-55' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber' : 'opacity-80'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isRestricted && (
                    <Lock className="w-3 h-3 text-red flex-none" title="Access scoped out" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Account Info */}
        <div className="pt-4 border-t border-sidebar-line">
          <div className="p-3 bg-sidebar-active/60 rounded-2xl flex items-center gap-3 border border-sidebar-line/40">
            <div 
              style={{ backgroundColor: currentUser.avatarColor }}
              className="w-8 h-8 rounded-xl font-bold flex items-center justify-center text-ink text-xs flex-none"
            >
              {currentUser.name.charAt(0)}
            </div>
            <div className="truncate flex-1">
              <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-faint font-mono font-semibold tracking-wide mt-0.5">{currentUser.role}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 mt-3.5 py-2 px-3 border border-sidebar-line hover:bg-red-bg/10 rounded-xl font-semibold text-xs text-[#C7CFCC] hover:text-red transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            De-authenticate Desk
          </button>
        </div>
      </aside>

      {/* Mobile Dark Overlay background */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-ink/65 backdrop-blur-xs md:hidden"
        ></div>
      )}

      {/* 2. MAIN HUB CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col min-h-screen min-w-0">
        
        {/* TOP BANNER STATUS BAR */}
        <header className="sticky top-0 z-20 bg-panel border-b border-line px-5 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 bg-panel-alt hover:bg-gray-chip border border-line rounded-xl text-ink cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-panel-alt border border-line/60 rounded-full font-mono text-[10px] text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse"></span>
              <span>CONSOLE SECURITY STATUS: <strong className="text-green">PASS</strong></span>
            </div>
          </div>

          {/* User profile selection & testing indicator */}
          <div className="flex items-center gap-3 text-xs">
            {/* Quick Accelerate Trigger */}
            <button
              onClick={handleTriggerSimulation}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 bg-amber-bg text-amber-deep border border-amber/10 font-bold rounded-full hover:bg-amber hover:text-white transition-all cursor-pointer text-[10px]"
              title="Fast forward all active journeys"
            >
              <Zap className="w-3.5 h-3.5 animate-bounce" />
              Simulate Progress
            </button>

            {/* Quick role toggle dropdown */}
            <div className="flex items-center gap-1.5 bg-panel-alt border border-line rounded-xl p-1">
              <span className="text-[10px] font-mono text-faint font-semibold pl-1.5 hidden md:inline">RBAC PROFILE:</span>
              <select
                value={currentUser.role}
                onChange={(e) => handleRoleOverride(e.target.value as Role)}
                className="bg-transparent border-none text-[11px] font-bold text-ink pr-5 cursor-pointer focus:outline-none"
              >
                <option value="Fleet Manager">🔧 Fleet Manager</option>
                <option value="Dispatcher">🗺️ Dispatcher</option>
                <option value="Safety Officer">🛡️ Safety Officer</option>
                <option value="Financial Analyst">📈 Financial Analyst</option>
              </select>
            </div>
          </div>
        </header>

        {/* CONTAINER WITH THE RELEVANT ACTIVE TAB COMPONENT */}
        <section className="p-5 md:p-6 flex-1 overflow-y-auto">
          {(() => {
            // Check access first
            if (isPageRestricted(activeTab)) {
              return (
                <div className="p-8 max-w-xl mx-auto text-center bg-panel border border-line rounded-2xl shadow-xs mt-12 space-y-6 animate-fade-in">
                  <div className="w-16 h-16 bg-red-bg text-red rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-display font-bold text-ink">Access Blocked by Security</h2>
                    <p className="text-sm text-muted leading-relaxed">
                      Your current credential role (<span className="font-semibold text-ink font-mono">{currentUser.role}</span>) does not hold the permissions required to enter this page.
                    </p>
                  </div>
                  <div className="p-4 bg-panel-alt rounded-xl border border-line text-xs text-muted leading-normal space-y-2 text-left">
                    <div className="font-bold text-ink flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber" /> Authorized personnel only:
                    </div>
                    <p>• Fleet Manager can access and override physical fleet registry variables.</p>
                    <p>• Dispatchers can planning transit journeys.</p>
                    <p>• Change your role using the top right dropdown selector to audit this page.</p>
                  </div>
                </div>
              );
            }

            switch (activeTab) {
              case 'dashboard':
                return (
                  <Dashboard 
                    vehicles={vehicles}
                    drivers={drivers}
                    trips={trips}
                    maintenance={maintenance}
                    notifications={notifications}
                    onTriggerSimulation={handleTriggerSimulation}
                    onNavigate={handleTabClick}
                  />
                );
              case 'fleet':
                return (
                  <FleetRegistry 
                    vehicles={vehicles}
                    userRole={currentUser.role}
                    onAddVehicle={handleAddVehicle}
                    onUpdateVehicleStatus={handleUpdateVehicleStatus}
                    onDeleteVehicle={handleDeleteVehicle}
                  />
                );
              case 'drivers':
                return (
                  <DriversDirectory 
                    drivers={drivers}
                    vehicles={vehicles}
                    userRole={currentUser.role}
                    onAddDriver={handleAddDriver}
                    onUpdateDriverStatus={handleUpdateDriverStatus}
                    onDeleteDriver={handleDeleteDriver}
                  />
                );
              case 'trips':
                return (
                  <DispatchTrips 
                    trips={trips}
                    vehicles={vehicles}
                    drivers={drivers}
                    userRole={currentUser.role}
                    onAddTrip={handleAddTrip}
                    onUpdateTripProgress={handleUpdateTripProgress}
                    onUpdateTripStatus={handleUpdateTripStatus}
                  />
                );
              case 'maintenance':
                return (
                  <MaintenanceLogViewer 
                    logs={maintenance}
                    vehicles={vehicles}
                    userRole={currentUser.role}
                    onAddLog={handleAddLog}
                    onUpdateLogStatus={handleUpdateLogStatus}
                  />
                );
              case 'fuel':
                return (
                  <FuelCostTracker 
                    fuelEntries={fuelEntries}
                    vehicles={vehicles}
                    userRole={currentUser.role}
                    onAddFuelEntry={handleAddFuelEntry}
                  />
                );
              case 'analytics':
                return (
                  <AnalyticsCharts 
                    vehicles={vehicles}
                    maintenance={maintenance}
                    fuelEntries={fuelEntries}
                    userRole={currentUser.role}
                  />
                );
              case 'settings':
                return (
                  <Settings 
                    currentUser={currentUser}
                    onRestoreDefaults={handleRestoreDefaults}
                    onRoleOverride={handleRoleOverride}
                  />
                );
              default:
                return <div>Selection error.</div>;
            }
          })()}
        </section>

      </main>
    </div>
  );
}
