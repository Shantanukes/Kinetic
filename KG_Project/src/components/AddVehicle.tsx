import React, { useState } from 'react';
import { X, Save, Truck, Cpu, Battery, FileText, Hash, User, Phone, CreditCard, MapPin } from 'lucide-react';
import { Vehicle } from '../types';


interface AddVehicleProps {
  // isOpen: boolean; // Removed since it's now a page
  // onClose: () => void; // Removed since it's now a page
  onAdd: (vehicle: Partial<Vehicle> & { imei: string; batteryCapacity: string; vcuNumber: string; batterySerialNumber: string; vin: string }) => void;
  darkMode: boolean;
  userRole?: string;
}

const AddVehicle: React.FC<AddVehicleProps> = ({ onAdd, darkMode, userRole }) => {
  const isDealer = userRole === 'DEALER';

  // Generate mock data for dealers
  const generateMockVIN = () => `MA1KG${Math.floor(Math.random() * 1000000).toString().padStart(11, '0')}`;
  const generateVehicleID = () => `KG-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  const [formData, setFormData] = useState({
    name: isDealer ? generateVehicleID() : '',
    imei: '',
    vin: isDealer ? generateMockVIN() : '',
    licensePlate: '',
    type: 'Scooter',
    batteryCapacity: isDealer ? '2.5' : '',
    vcuNumber: '',
    batterySerialNumber: '',
    model: isDealer ? 'Kinetic Zulu' : '',
    manufacturingYear: new Date().getFullYear().toString(),
    status: 'idle' as const,
    health: 100,
    // Dealer-specific fields
    customerName: '',
    customerPhone: '',
    customerAadhaar: '',
    customerAddress: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    // You might want to navigate back or show a success message here
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg mt-6 mx-auto max-w-4xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        
        {/* Header */}
        <div className={`pb-4 mb-6 flex justify-between items-center border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <Truck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Add New Vehicle</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enter vehicle details for fleet registration</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Info */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              <FileText size={16} /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Vehicle Name / ID {isDealer && <span className="text-xs text-gray-500">(Pre-assigned)</span>}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={isDealer}
                  placeholder="e.g. Kinetic Zoom 01"
                  className={`w-full p-3 rounded-xl border ${isDealer ? 'bg-gray-600/30 cursor-not-allowed' : darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'} ${!isDealer && 'focus:ring-2 focus:ring-blue-500/20'} outline-none transition-all`}
                />
              </div>
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  VIN Number {isDealer && <span className="text-xs text-gray-500">(Pre-assigned)</span>}
                </label>
                <div className="relative">
                  <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="vin"
                    required
                    value={formData.vin}
                    onChange={handleChange}
                    readOnly={isDealer}
                    placeholder="17-character VIN"
                    className={`w-full pl-10 p-3 rounded-xl border ${isDealer ? 'bg-gray-600/30 cursor-not-allowed' : darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'} ${!isDealer && 'focus:ring-2 focus:ring-blue-500/20'} outline-none transition-all`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Vehicle Model {isDealer && <span className="text-xs text-gray-500">(Pre-configured)</span>}
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  readOnly={isDealer}
                  placeholder="e.g. Kinetic Zulu"
                  className={`w-full p-3 rounded-xl border ${isDealer ? 'bg-gray-600/30 cursor-not-allowed' : darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'} ${!isDealer && 'focus:ring-2 focus:ring-blue-500/20'} outline-none transition-all`}
                />
              </div>
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Type {isDealer && <span className="text-xs text-gray-500">(Pre-configured)</span>}
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={isDealer}
                  className={`w-full p-3 rounded-xl border ${isDealer ? 'bg-gray-600/30 cursor-not-allowed' : darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'} ${!isDealer && 'focus:ring-2 focus:ring-blue-500/20'} outline-none transition-all`}
                >
                  <option value="Scooter">Scooter</option>
                  <option value="Bike">Bike</option>
                  <option value="3-Wheeler">3-Wheeler</option>
                </select>
              </div>
              
              {isDealer && (
                <div className="space-y-2 md:col-span-2">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>License Plate Number</label>
                  <div className="relative">
                    <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="licensePlate"
                      required
                      value={formData.licensePlate}
                      onChange={handleChange}
                      placeholder="e.g. MH-12-AB-1234"
                      className={`w-full pl-10 p-3 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section for Dealer: Customer Details */}
          {isDealer && (
            <>
              <div className={`h-px w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div>
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  <User size={16} /> Customer Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Customer Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="customerName"
                        required
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className={`w-full pl-10 p-3 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Customer Phone Number</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="customerPhone"
                        required
                        value={formData.customerPhone}
                        onChange={handleChange}
                        placeholder="10-digit phone number"
                        className={`w-full pl-10 p-3 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Customer Aadhaar Number</label>
                    <div className="relative">
                      <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="customerAadhaar"
                        required
                        value={formData.customerAadhaar}
                        onChange={handleChange}
                        placeholder="12-digit Aadhaar number"
                        maxLength={12}
                        className={`w-full pl-10 p-3 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Customer Address</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                      <textarea
                        name="customerAddress"
                        required
                        value={formData.customerAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerAddress: e.target.value }))}
                        placeholder="Full address"
                        rows={3}
                        className={`w-full pl-10 p-3 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Section 2: Hardware & Specs - Only for non-dealers */}
          {!isDealer && (
            <>
              <div className={`h-px w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div>
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  <Cpu size={16} /> Hardware & Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>VCU Number</label>
                    <input
                      type="text"
                      name="vcuNumber"
                      required
                      value={formData.vcuNumber}
                      onChange={handleChange}
                      placeholder="VCU ID"
                      className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>IMEI Number</label>
                    <div className="relative">
                      <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="imei"
                        required
                        value={formData.imei}
                        onChange={handleChange}
                        placeholder="15-digit IMEI"
                        className={`w-full pl-10 p-3 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Battery Serial Number</label>
                    <input
                      type="text"
                      name="batterySerialNumber"
                      value={formData.batterySerialNumber}
                      onChange={handleChange}
                      placeholder="Battery S/N"
                      className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Battery Capacity (kWh)</label>
                    <div className="relative">
                      <Battery size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="batteryCapacity"
                        value={formData.batteryCapacity}
                        onChange={handleChange}
                        placeholder="e.g. 2.5"
                        step="0.1"
                        className={`w-full pl-10 p-3 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Manufacturing Year</label>
                    <input
                      type="number"
                      name="manufacturingYear"
                      value={formData.manufacturingYear}
                      onChange={handleChange}
                      min="2020"
                      max="2030"
                      className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Initial Health Status</label>
                    <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex-1">
                            <input 
                                type="range" 
                                name="health"
                                min="0"
                                max="100"
                                value={formData.health}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <span className={`font-bold ${formData.health > 80 ? 'text-green-500' : formData.health > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {formData.health}%
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-6">
             <button
                type="button" // Change to type='button' to prevent form submission
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
             >
                Reset
             </button>
            <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
            >
                <Save size={18} />
                Register Vehicle
            </button>
          </div>
        </form>
    </div>
  );
};

export default AddVehicle;