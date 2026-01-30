// Main Dashboard Component - Refactored

import { useState, lazy, Suspense } from 'react';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
// Lazy load components to reduce initial bundle size
const DashboardContent = lazy(() => import('./components/DashboardContent'));
const LiveTracking = lazy(() => import('./components/LiveTracking'));
const VehicleInsights = lazy(() => import('./components/VehicleInsights'));
const FaultAnalysis = lazy(() => import('./components/FaultAnalysis'));
const Reports = lazy(() => import('./components/Reports'));
const DeviceManagement = lazy(() => import('./components/DeviceManagement'));
const FotaUpdates = lazy(() => import('./components/FotaUpdates'));
const Configure = lazy(() => import('./components/Configure'));
const EnterpriseSettings = lazy(() => import('./components/EnterpriseSettings'));
const AddVehicle = lazy(() => import('./components/AddVehicle'));
const DealerManagement = lazy(() => import('./components/DealerManagement'));
const McuData = lazy(() => import('./components/McuData'));
const VcuData = lazy(() => import('./components/VcuData'));
const BrakeData = lazy(() => import('./components/BrakeData'));
const BmsData = lazy(() => import('./components/BmsData'));
const HeatMaps = lazy(() => import('./components/HeatMaps'));
const SupportConnect = lazy(() => import('./components/SupportConnect'));
const VehicleAssignment = lazy(() => import('./components/VehicleAssignment'));
import { useAuth } from './hooks/useAuth';
// import { useDeviceStats } from './hooks/useDeviceStats'; // Hook removed
import { Alert, Vehicle } from './types';
import {
  MENU_ITEMS,
  QUICK_ACTIONS,
  INITIAL_SALES_DATA,
  INITIAL_ENVIRONMENTAL_DATA,
  RECENT_ALERTS,
  FLEET_VEHICLES,
  RECENT_TRIPS,
  PERFORMANCE_METRICS,
  VEHICLE_INSIGHTS,
  FAULT_CODES,
  FAULT_CODE_ANALYSIS
} from './constants';

const ConnectedAutoDashboard = () => {
  const {
    isAuthenticated,
    userRole,
    displayName,
    dealerId,
    loginForm,
    setLoginForm,
    signupForm,
    setSignupForm,
    handleLogin,
    handleSignup,
    handleLogout
  } = useAuth();

  // Use displayName from useAuth for the header
  const headerUsername = displayName || localStorage.getItem('displayName') || '';

  // State definitions moved up to be used in calculations if needed, or we just calculate derived state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState(3);

  // Filter Data based on Role
  const filteredMenuItems = MENU_ITEMS.filter(item => item.roles.includes(userRole));

  const clientVehicleIds = ['V001', 'V002'];
  const filteredVehicles = userRole === 'DEALER' && dealerId
    ? (FLEET_VEHICLES as Vehicle[]).filter(v => v.dealerId === dealerId)
    : userRole === 'USER'
      ? (FLEET_VEHICLES as Vehicle[]).filter(v => clientVehicleIds.includes(v.id))
      : (FLEET_VEHICLES as Vehicle[]);

  // Heavy pages (map/device table) choke on thousands of rows; keep the UI lean
  const displayVehicles = filteredVehicles.slice(0, 300);

  // Calculate Device Stats based on Filtered Vehicles
  const deviceStats = {
    active: filteredVehicles.filter(v => v.status === 'active' || v.status === 'charging').length,
    faulty: filteredVehicles.filter(v => v.health < 80).length, // Heuristic for faulty
    inactive: filteredVehicles.filter(v => v.status === 'idle').length,
    total: filteredVehicles.length
  };

  const filteredAlerts = (userRole === 'USER' || userRole === 'DEALER')
    ? (RECENT_ALERTS as Alert[]).filter(a => filteredVehicles.some(v => a.vehicle.includes(v.name)))
    : (RECENT_ALERTS as Alert[]);

  const filteredTrips = (userRole === 'USER' || userRole === 'DEALER')
    ? RECENT_TRIPS.filter(t => filteredVehicles.some(v => t.vehicle === v.name))
    : RECENT_TRIPS;

  const filteredVehicleInsights = (userRole === 'USER' || userRole === 'DEALER')
    ? VEHICLE_INSIGHTS.filter(vi => filteredVehicles.some(v => v.licensePlate === vi.licensePlate))
    : VEHICLE_INSIGHTS;

  // Calculate specific data for the user
  const salesData = (userRole === 'USER' || userRole === 'DEALER') ? {
    sold: filteredVehicles.filter(v => v.status === 'active' || v.status === 'charging').length,
    inventory: filteredVehicles.length,
    percentage: filteredVehicles.length > 0
      ? (filteredVehicles.filter(v => v.status === 'active' || v.status === 'charging').length / filteredVehicles.length) * 100
      : 0
  } : INITIAL_SALES_DATA;

  // Aggregate environmental data from insights if possible, or scale
  const totalCo2 = filteredVehicleInsights.reduce((acc, curr) => acc + curr.co2Saved, 0);
  const environmentalData = (userRole === 'USER' || userRole === 'DEALER') ? {
    co2Saved: totalCo2,
    totalKm: filteredTrips.reduce((acc, t) => acc + parseFloat(t.distance), 0),
    treesEquivalent: Math.round(totalCo2 / 20) // Roughly 20g per tree per day or similar heuristic
  } : INITIAL_ENVIRONMENTAL_DATA;

  const filteredFaultCodes = (userRole === 'USER' || userRole === 'DEALER')
    ? FAULT_CODES.filter(fc => filteredVehicles.some(v => fc.vehicle.includes(v.licensePlate) || fc.vehicle.includes(v.name)))
    : FAULT_CODES;

  const filteredFaultAnalysis = {
    ...FAULT_CODE_ANALYSIS,
    summary: {
      ...FAULT_CODE_ANALYSIS.summary,
      totalFaults: filteredFaultCodes.length,
      activeFaults: filteredFaultCodes.filter(f => f.status === 'active').length,
      resolvedFaults: filteredFaultCodes.filter(f => f.status === 'resolved').length,
    },
    // Use filtered faults for top faults list
    topFaults: FAULT_CODE_ANALYSIS.topFaults.filter(tf =>
      filteredFaultCodes.some(ff => ff.code === tf.code)
    )
  };

  const [performanceMetrics] = useState(PERFORMANCE_METRICS);

  // Login Page
  if (!isAuthenticated) {
    return (
      <LoginPage
        loginForm={loginForm}
        showForgotPassword={showForgotPassword}
        darkMode={darkMode}
        setLoginForm={setLoginForm}
        setShowForgotPassword={setShowForgotPassword}
        handleLogin={handleLogin}
      />
    );
  }

  // Effect to reset page if current page is not allowed
  const isValidPage = filteredMenuItems.some(item => {
    if (item.id === currentPage) return true;
    if (item.subItems) {
      return item.subItems.some(sub => sub.id === currentPage);
    }
    return false;
  });

  if (!isValidPage && currentPage !== 'dashboard') {
    setCurrentPage('dashboard');
  }

  // Main Dashboard
  return (
    <div className={`h-screen w-screen overflow-hidden ${darkMode ? 'bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black' : 'bg-white'} transition-colors duration-300`}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        darkMode={darkMode}
        currentPage={currentPage}
        menuItems={filteredMenuItems}
        setSidebarOpen={setSidebarOpen}
        setCurrentPage={setCurrentPage}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} ml-0 h-full flex flex-col`}>
        <Header
          darkMode={darkMode}
          notifications={notifications}
          showUserMenu={showUserMenu}
          currentPage={currentPage}
          menuItems={filteredMenuItems}
          userRole={userRole}
          username={headerUsername}
          setDarkMode={setDarkMode}
          setCurrentPage={setCurrentPage}
          setShowUserMenu={setShowUserMenu}
          handleLogout={handleLogout}
          setSidebarOpen={setSidebarOpen}
        />

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <main className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {currentPage === 'dashboard' && (
              <DashboardContent
                darkMode={darkMode}
                deviceStats={deviceStats}
                salesData={salesData}
                environmentalData={environmentalData}
                quickActions={QUICK_ACTIONS}
                alerts={filteredAlerts}
                vehicles={displayVehicles}
                trips={filteredTrips}
                performanceMetrics={performanceMetrics}
              />
            )}

            {currentPage === 'tracking' && (
              <LiveTracking vehicles={displayVehicles} darkMode={darkMode} />
            )}

            {currentPage === 'insights' && (
              <VehicleInsights darkMode={darkMode} vehicleInsights={filteredVehicleInsights} />
            )}

            {currentPage === 'faults' && (
              <FaultAnalysis darkMode={darkMode} faultCodes={filteredFaultCodes} faultCodeAnalysis={filteredFaultAnalysis} />
            )}

            {currentPage === 'reports' && (
              <Reports darkMode={darkMode} vehicleInsights={filteredVehicleInsights} faultCodes={filteredFaultCodes} userRole={userRole} />
            )}

            {currentPage === 'devices' && (
              <DeviceManagement darkMode={darkMode} vehicles={displayVehicles} />
            )}

            {currentPage === 'fota' && (
              <FotaUpdates darkMode={darkMode} vehicles={filteredVehicles} />
            )}

            {currentPage === 'configure' && (
              <Configure darkMode={darkMode} />
            )}

            {currentPage === 'enterprise' && (
              <EnterpriseSettings darkMode={darkMode} />
            )}

            {currentPage === 'mcu-data' && (
              <McuData darkMode={darkMode} vehicleInsights={filteredVehicleInsights} />
            )}

            {currentPage === 'vcu-data' && (
              <VcuData
                darkMode={darkMode}
                vehicleInsights={filteredVehicleInsights}
                vehicles={filteredVehicles}
              />
            )}

            {currentPage === 'ipc-data' && (
              <BrakeData darkMode={darkMode} vehicleInsights={filteredVehicleInsights} />
            )}

            {currentPage === 'bms-data' && (
              <BmsData darkMode={darkMode} vehicleInsights={filteredVehicleInsights} />
            )}

            {currentPage === 'heat-maps' && (
              <HeatMaps darkMode={darkMode} vehicleInsights={filteredVehicleInsights} />
            )}

            {currentPage === 'add-vehicle' && (
              <AddVehicle
                darkMode={darkMode}
                userRole={userRole}
                onAdd={(vehicleData) => {
                  console.log('Vehicle Added', vehicleData);
                  setCurrentPage('dashboard');
                }}
              />
            )}

            {currentPage === 'dealer-management' && (
              <DealerManagement darkMode={darkMode} userRole={userRole} />
            )}

            {currentPage === 'support-connect' && (
              <SupportConnect darkMode={darkMode} userRole={userRole} username={headerUsername} />
            )}

            {currentPage === 'assign-vehicle' && (
              <VehicleAssignment darkMode={darkMode} vehicles={filteredVehicles} />
            )}
          </main>
        </Suspense>
      </div>
    </div>
  );
};

export default ConnectedAutoDashboard;
