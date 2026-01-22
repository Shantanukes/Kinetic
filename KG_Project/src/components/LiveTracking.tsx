// Live Tracking Component with Interactive Map

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import L from 'leaflet';
import { Battery, Gauge, Navigation, User, AlertCircle, MapPin } from 'lucide-react';
import { Vehicle } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LiveTrackingProps {
  vehicles: Vehicle[];
  darkMode: boolean;
}

const LiveTracking: React.FC<LiveTrackingProps> = ({ vehicles, darkMode }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [mapCenter] = useState<[number, number]>([19.0760, 72.8777]); // Mumbai center
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Custom marker icons based on vehicle status
  const getVehicleIcon = (status: string) => {
    const color = status === 'active' ? 'green' : 
                  status === 'charging' ? 'blue' : 
                  status === 'idle' ? 'orange' : 'red';
    
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="${color}" opacity="0.3"/>
          <circle cx="20" cy="20" r="12" fill="${color}"/>
          <path d="M 12 20 L 20 12 L 28 20 L 20 16 Z" fill="white"/>
        </svg>
      `)}`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'charging': return 'bg-blue-500';
      case 'idle': return 'bg-yellow-500';
      case 'maintenance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'text-green-500';
    if (battery > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Vehicles</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {vehicles.filter(v => v.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Charging</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {vehicles.filter(v => v.status === 'charging').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Battery className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Idle</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {vehicles.filter(v => v.status === 'idle').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Maintenance</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {vehicles.filter(v => v.status === 'maintenance').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Map and Vehicle List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
          <div className="h-[600px] relative">
            {!isClient ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <MapContainer
                center={mapCenter}
                zoom={12}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                scrollWheelZoom={true}
                key="live-tracking-map"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {vehicles.length > 0 && vehicles.map((vehicle) => (
                  <Marker
                    key={vehicle.id}
                    position={[vehicle.location.lat, vehicle.location.lng]}
                    icon={getVehicleIcon(vehicle.status)}
                    eventHandlers={{
                      click: () => setSelectedVehicle(vehicle)
                    }}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-bold text-lg mb-2">{vehicle.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{vehicle.licensePlate}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Driver:</span>
                            <span className="font-semibold">{vehicle.driver}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Battery:</span>
                            <span className={`font-semibold ${getBatteryColor(vehicle.battery)}`}>
                              {vehicle.battery}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Speed:</span>
                            <span className="font-semibold">{vehicle.speed} km/h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs text-white ${
                              vehicle.status === 'active' ? 'bg-green-500' :
                              vehicle.status === 'charging' ? 'bg-blue-500' :
                              vehicle.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}>
                              {vehicle.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>

        {/* Vehicle List Sidebar */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4`}>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Fleet Vehicles ({vehicles.length})
          </h3>
          <div className="space-y-3 max-h-[550px] overflow-y-auto custom-scrollbar">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedVehicle?.id === vehicle.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : darkMode
                    ? 'border-gray-700 bg-gray-700/50 hover:bg-gray-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(vehicle.status)} animate-pulse`}></div>
                      <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {vehicle.name}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{vehicle.licensePlate}</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    vehicle.health > 90 ? 'bg-green-100 text-green-700' :
                    vehicle.health > 75 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {vehicle.health}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <Battery className={`w-3 h-3 ${getBatteryColor(vehicle.battery)}`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {vehicle.battery}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Gauge className="w-3 h-3 text-blue-500" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {vehicle.speed} km/h
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3 text-purple-500" />
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>
                      {vehicle.driver}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Navigation className="w-3 h-3 text-green-500" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {vehicle.lastUpdate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Vehicle Details */}
      {selectedVehicle && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Vehicle Details - {selectedVehicle.name}
            </h3>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">License Plate</p>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedVehicle.licensePlate}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Driver</p>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedVehicle.driver}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Battery Level</p>
              <p className={`font-semibold ${getBatteryColor(selectedVehicle.battery)}`}>
                {selectedVehicle.battery}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Speed</p>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedVehicle.speed} km/h
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Odometer</p>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedVehicle.odometer.toLocaleString()} km
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Vehicle Health</p>
              <p className={`font-semibold ${
                selectedVehicle.health > 90 ? 'text-green-500' :
                selectedVehicle.health > 75 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {selectedVehicle.health}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(selectedVehicle.status)}`}>
                {selectedVehicle.status.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Last Update</p>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedVehicle.lastUpdate}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;