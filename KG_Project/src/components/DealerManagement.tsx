import React, { useState } from 'react';
import { Users, MapPin, Phone, Mail, Calendar, Package, CheckCircle, Clock, Hash, Cpu, Battery, Smartphone } from 'lucide-react';
import { DEALER_DATA } from '../constants';

interface DealerManagementProps {
  darkMode: boolean;
}

const DealerManagement: React.FC<DealerManagementProps> = ({ darkMode }) => {
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null);
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<'all' | '2-wheeler' | '3-wheeler'>('all');

  const dealer = selectedDealer
    ? DEALER_DATA.find(d => d.id === selectedDealer)
    : null;

  const getStatusColor = (status: string) => {
    return status === 'assigned'
      ? 'text-green-400 bg-green-500/20'
      : 'text-orange-400 bg-orange-500/20';
  };

  const getStatusIcon = (status: string) => {
    return status === 'assigned' ? CheckCircle : Clock;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Dealer Management
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage dealer network and vehicle inventory distribution
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
          <Users size={20} />
          <span className="font-semibold">{DEALER_DATA.length} Active Dealers</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dealer List */}
        <div className={`glass p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Dealer Partners
          </h2>
          <div className="space-y-3">
            {DEALER_DATA.map((dealer) => {
              const totalVehicles = dealer.vehicles.twoWheeler.length + dealer.vehicles.threeWheeler.length;
              const assignedVehicles = [
                ...dealer.vehicles.twoWheeler,
                ...dealer.vehicles.threeWheeler
              ].filter(v => v.status === 'assigned').length;

              return (
                <div
                  key={dealer.id}
                  onClick={() => setSelectedDealer(dealer.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${selectedDealer === dealer.id
                      ? darkMode
                        ? 'bg-blue-500/20 border-2 border-blue-500'
                        : 'bg-blue-50 border-2 border-blue-500'
                      : darkMode
                        ? 'bg-gray-700/30 hover:bg-gray-700/50 border-2 border-transparent'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {dealer.name}
                    </h3>
                    <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${darkMode ? 'bg-gray-600/50 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                      {dealer.id}
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <MapPin size={14} />
                      <span>{dealer.location}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Package size={14} />
                      <span>{assignedVehicles} / {totalVehicles} vehicles assigned</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dealer Details & Vehicle Inventory */}
        <div className="lg:col-span-2 space-y-6">
          {dealer ? (
            <>
              {/* Dealer Information */}
              <div className={`glass p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {dealer.name}
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Established {dealer.establishedYear}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                    <MapPin className="text-blue-500" size={20} />
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Location</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dealer.location}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                    <Phone className="text-green-500" size={20} />
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Contact</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dealer.contact}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                    <Mail className="text-purple-500" size={20} />
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dealer.email}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                    <Calendar className="text-orange-500" size={20} />
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Est. Year</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dealer.establishedYear}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales & Delivery Statistics */}
              <div className={`glass p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <CheckCircle size={20} className="text-green-500" />
                  Sales & Delivery Statistics
                </h3>

                {(() => {
                  const allVehicles = [...dealer.vehicles.twoWheeler, ...dealer.vehicles.threeWheeler];
                  const soldVehicles = allVehicles.filter(v => v.status === 'assigned');
                  const sold2Wheeler = dealer.vehicles.twoWheeler.filter(v => v.status === 'assigned').length;
                  const sold3Wheeler = dealer.vehicles.threeWheeler.filter(v => v.status === 'assigned').length;
                  const totalInventory = allVehicles.length;

                  return (
                    <>
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30' : 'bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Total Sold</span>
                            <CheckCircle size={18} className="text-green-500" />
                          </div>
                          <p className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                            {soldVehicles.length}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                            out of {totalInventory} vehicles
                          </p>
                        </div>

                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>2-Wheeler</span>
                            <Package size={18} className="text-blue-500" />
                          </div>
                          <p className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {sold2Wheeler}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                            {dealer.vehicles.twoWheeler.length} total inventory
                          </p>
                        </div>

                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-medium ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>3-Wheeler</span>
                            <Package size={18} className="text-purple-500" />
                          </div>
                          <p className={`text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                            {sold3Wheeler}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                            {dealer.vehicles.threeWheeler.length} total inventory
                          </p>
                        </div>
                      </div>

                      {/* Delivery Timeline */}
                      <div>
                        <h4 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Recent Deliveries
                        </h4>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {soldVehicles
                            .sort((a: any, b: any) => new Date(b.deliveryDate || '').getTime() - new Date(a.deliveryDate || '').getTime())
                            .map((vehicle: any) => (
                              <div
                                key={vehicle.vehicleId}
                                className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} transition-all`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {vehicle.model}
                                      </h5>
                                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                                        {vehicle.vehicleId}
                                      </span>
                                    </div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      Customer: <span className="font-semibold">{vehicle.customerName}</span>
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className={`flex items-center gap-1 text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                      <Calendar size={14} />
                                      {vehicle.deliveryDate ? new Date(vehicle.deliveryDate).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                      }) : 'N/A'}
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <span className="font-semibold">License:</span> {vehicle.licensePlate}
                                  </div>
                                  <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <span className="font-semibold">VIN:</span> {vehicle.vin.slice(-6)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          {soldVehicles.length === 0 && (
                            <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              <Clock size={48} className="mx-auto mb-2 opacity-50" />
                              <p>No vehicles sold yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Vehicle Type Filter */}
              <div className="flex gap-3">
                <button
                  onClick={() => setVehicleTypeFilter('all')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${vehicleTypeFilter === 'all'
                      ? 'bg-blue-500 text-white'
                      : darkMode
                        ? 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  All Vehicles
                </button>
                <button
                  onClick={() => setVehicleTypeFilter('2-wheeler')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${vehicleTypeFilter === '2-wheeler'
                      ? 'bg-blue-500 text-white'
                      : darkMode
                        ? 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  2-Wheeler ({dealer.vehicles.twoWheeler.length})
                </button>
                <button
                  onClick={() => setVehicleTypeFilter('3-wheeler')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${vehicleTypeFilter === '3-wheeler'
                      ? 'bg-blue-500 text-white'
                      : darkMode
                        ? 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  3-Wheeler ({dealer.vehicles.threeWheeler.length})
                </button>
              </div>

              {/* 2-Wheeler Vehicles */}
              {(vehicleTypeFilter === 'all' || vehicleTypeFilter === '2-wheeler') && (
                <div className={`glass p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
                  <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Package size={20} />
                    2-Wheeler Inventory
                  </h3>
                  <div className="space-y-4">
                    {dealer.vehicles.twoWheeler.map((vehicle) => {
                      const StatusIcon = getStatusIcon(vehicle.status);
                      return (
                        <div
                          key={vehicle.vehicleId}
                          className={`p-4 rounded-xl border-2 ${darkMode
                              ? 'bg-gray-700/30 border-gray-600/50'
                              : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {vehicle.model}
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {vehicle.vehicleId}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-lg flex items-center gap-2 ${getStatusColor(vehicle.status)}`}>
                              <StatusIcon size={14} />
                              <span className="text-sm font-semibold capitalize">{vehicle.status}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Hash size={14} className="text-gray-500" />
                                <span className="font-semibold">VIN:</span>
                              </div>
                              <p className="ml-5 font-mono text-xs">{vehicle.vin}</p>
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Cpu size={14} className="text-gray-500" />
                                <span className="font-semibold">VCU:</span>
                              </div>
                              <p className="ml-5 font-mono text-xs">{vehicle.vcuNumber}</p>
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Battery size={14} className="text-gray-500" />
                                <span className="font-semibold">Battery S/N:</span>
                              </div>
                              <p className="ml-5 font-mono text-xs">{vehicle.batterySerialNo}</p>
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Smartphone size={14} className="text-gray-500" />
                                <span className="font-semibold">IMEI:</span>
                              </div>
                              <p className="ml-5 font-mono text-xs">{vehicle.imei}</p>
                            </div>
                          </div>

                          {vehicle.status === 'assigned' && vehicle.customerName && (
                            <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                              <div className="flex items-center justify-between">
                                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  <span className="font-semibold">Customer: </span>
                                  <span>{vehicle.customerName}</span>
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  <span className="font-semibold">License: </span>
                                  <span className="font-mono">{vehicle.licensePlate}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3-Wheeler Vehicles */}
              {(vehicleTypeFilter === 'all' || vehicleTypeFilter === '3-wheeler') && (
                <div className={`glass p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
                  <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Package size={20} />
                    3-Wheeler Inventory
                  </h3>
                  <div className="space-y-4">
                    {dealer.vehicles.threeWheeler.map((vehicle) => {
                      const StatusIcon = getStatusIcon(vehicle.status);
                      return (
                        <div
                          key={vehicle.vehicleId}
                          className={`p-4 rounded-xl border-2 ${darkMode
                              ? 'bg-gray-700/30 border-gray-600/50'
                              : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {vehicle.model}
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {vehicle.vehicleId}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-lg flex items-center gap-2 ${getStatusColor(vehicle.status)}`}>
                              <StatusIcon size={14} />
                              <span className="text-sm font-semibold capitalize">{vehicle.status}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Hash size={14} className="text-gray-500" />
                                <span className="font-semibold">VIN:</span>
                              </div>
                              <p className="ml-5 font-mono text-xs">{vehicle.vin}</p>
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Cpu size={14} className="text-gray-500" />
                                <span className="font-semibold">VCU:</span>
                              </div>
                              <p className="ml-5 font-mono text-xs">{vehicle.vcuNumber}</p>
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Battery size={14} className="text-gray-500" />
                                <span className="font-semibold">Battery S/N:</span>
                              </div>
                              <p className="ml-5 font-mono text-xs">{vehicle.batterySerialNo}</p>
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Smartphone size={14} className="text-gray-500" />
                                <span className="font-semibold">IMEI:</span>
                              </div>
                              <p className="ml-5 font-mono text-xs">{vehicle.imei}</p>
                            </div>
                          </div>

                          {vehicle.status === 'assigned' && vehicle.customerName && (
                            <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                              <div className="flex items-center justify-between">
                                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  <span className="font-semibold">Customer: </span>
                                  <span>{vehicle.customerName}</span>
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  <span className="font-semibold">License: </span>
                                  <span className="font-mono">{vehicle.licensePlate}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={`glass p-12 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'} flex flex-col items-center justify-center`}>
              <Users size={64} className={`mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Select a dealer to view inventory
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealerManagement;
