import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Battery, Gauge, IndianRupee, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
// import { VEHICLE_INSIGHTS } from '../constants'; // Removed constant import

interface VehicleInsightsProps {
  darkMode: boolean;
  vehicleInsights: any[]; // Using any[] for quick refactor, ideally interface
}

const VehicleInsights: React.FC<VehicleInsightsProps> = ({ darkMode, vehicleInsights }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleInsights[0]);

  // Update selected vehicle when list changes
  useEffect(() => {
    if (vehicleInsights.length > 0 && (!selectedVehicle || !vehicleInsights.find(v => v.id === selectedVehicle.id))) {
      setSelectedVehicle(vehicleInsights[0]);
    }
  }, [vehicleInsights]);

  if (!selectedVehicle) return <div className="p-6">No vehicles available</div>;


  const _getHealthBg = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <main className="p-6 space-y-6 animate-fade-in">
      {/* Vehicle Selector */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
          Vehicle Selection
        </h2>
        <div className="flex gap-4 overflow-x-auto">
          {vehicleInsights.map((vehicle) => (
            <button
              key={vehicle.id}
              onClick={() => setSelectedVehicle(vehicle)}
              className={`flex-shrink-0 px-6 py-4 rounded-lg border-2 transition ${
                selectedVehicle.id === vehicle.id
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : darkMode
                  ? 'border-gray-700 bg-gray-700/50 hover:bg-gray-700'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className={`text-left ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className="font-semibold">{vehicle.vehicle}</div>
                <div className="text-sm text-gray-500">{vehicle.licensePlate}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Trips</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedVehicle.totalTrips.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="text-blue-600" size={32} />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Distance</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedVehicle.totalDistance.toLocaleString()} km
              </p>
            </div>
            <Gauge className="text-purple-600" size={32} />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Revenue</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ₹{selectedVehicle.revenue.toLocaleString()}
              </p>
            </div>
            <IndianRupee className="text-green-600" size={32} />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Uptime</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedVehicle.uptime}%
              </p>
            </div>
            <CheckCircle className="text-teal-600" size={32} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Metrics */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Vehicle Health
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">Overall Health Score</span>
                <span className={`font-bold ${getHealthColor(selectedVehicle.healthScore)}`}>
                  {selectedVehicle.healthScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    selectedVehicle.healthScore >= 90
                      ? 'bg-green-500'
                      : selectedVehicle.healthScore >= 70
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${selectedVehicle.healthScore}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 flex items-center gap-2">
                  <Battery size={16} /> Battery Health
                </span>
                <span className={`font-bold ${getHealthColor(selectedVehicle.batteryHealth)}`}>
                  {selectedVehicle.batteryHealth}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    selectedVehicle.batteryHealth >= 90
                      ? 'bg-green-500'
                      : selectedVehicle.batteryHealth >= 70
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${selectedVehicle.batteryHealth}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">Tire Condition</span>
                <span className={`font-bold ${getHealthColor(selectedVehicle.tireCondition)}`}>
                  {selectedVehicle.tireCondition}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    selectedVehicle.tireCondition >= 90
                      ? 'bg-green-500'
                      : selectedVehicle.tireCondition >= 70
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${selectedVehicle.tireCondition}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">Brake Health</span>
                <span className={`font-bold ${getHealthColor(selectedVehicle.brakeHealth)}`}>
                  {selectedVehicle.brakeHealth}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    selectedVehicle.brakeHealth >= 90
                      ? 'bg-green-500'
                      : selectedVehicle.brakeHealth >= 70
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${selectedVehicle.brakeHealth}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Performance Metrics
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-500">Avg Speed</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedVehicle.avgSpeed} km/h
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-500">Battery Performance</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedVehicle.batteryHealth}%
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-500">Capacity</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedVehicle.utilizationRate}%
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-500">Maintenance Cost</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ₹{selectedVehicle.maintenanceCost.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-gray-500">CO₂ Saved</span>
              <span className="font-bold text-green-600">
                {selectedVehicle.co2Saved.toLocaleString()} g
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
          <Calendar size={24} />
          Maintenance Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <CheckCircle className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-500">Last Service</p>
              <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {new Date(selectedVehicle.lastService).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <AlertCircle className="text-orange-600" size={24} />
            <div>
              <p className="text-sm text-gray-500">Next Service</p>
              <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {new Date(selectedVehicle.nextService).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
          Monthly Performance Trend
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={darkMode ? 'border-gray-700' : 'border-gray-200'}>
                <th className={`text-left p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Month</th>
                <th className={`text-right p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Trips</th>
                <th className={`text-right p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Distance (km)</th>
                <th className={`text-right p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Revenue</th>
                <th className={`text-right p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {selectedVehicle.monthlyTrend?.map((month: any, idx: number) => {
                const prevMonth = idx > 0 ? selectedVehicle.monthlyTrend[idx - 1] : null;
                const revenueTrend = prevMonth ? month.revenue - prevMonth.revenue : 0;
                
                return (
                  <tr key={month.month} className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className={`p-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{month.month}</td>
                    <td className={`p-4 text-right ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {month.trips.toLocaleString()}
                    </td>
                    <td className={`p-4 text-right ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {month.distance.toLocaleString()}
                    </td>
                    <td className={`p-4 text-right ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ₹{month.revenue.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      {prevMonth && (
                        <span className={`flex items-center justify-end gap-1 ${
                          revenueTrend >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {revenueTrend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          {Math.abs(revenueTrend).toLocaleString()}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default VehicleInsights;
