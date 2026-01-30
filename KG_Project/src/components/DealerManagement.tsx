import React, { useState, useEffect } from 'react';
import {
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  Hash,
  Cpu,
  Battery,
  Smartphone,
  Plus,
  X,
  Building2,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { DEALER_DATA } from '../constants';
import { UserRole } from '../types';

interface DealerManagementProps {
  darkMode: boolean;
  userRole: UserRole;
}

const DealerManagement: React.FC<DealerManagementProps> = ({ darkMode, userRole }) => {
  const [dealers, setDealers] = useState(DEALER_DATA);
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null);
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<'all' | '2-wheeler' | '3-wheeler'>('all');

  // Add Dealer Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [newDealer, setNewDealer] = useState({
    referenceNo: '',
    dealerCode: '',
    dealershipName: '',
    address: '',
    state: '',
    zone: '',
    location: '',
    pincode: '',
    partnerName: '',
    contactPersonName: '',
    mobileNo: '',
    email: '',
    gstNo: '',
    loiDate: '',
    loiValidUpto: '',
    leadStatus: 'Digital' as 'Digital' | 'Newspaper' | 'Scouting'
  });

  const canAddDealer = ['SUPER_ADMIN', 'OEM', 'RND', 'SALES'].includes(userRole);

  const dealer = selectedDealer
    ? dealers.find(d => d.id === selectedDealer)
    : null;

  const getStatusColor = (status: string) => {
    return status === 'assigned'
      ? 'text-green-400 bg-green-500/20'
      : 'text-orange-400 bg-orange-500/20';
  };

  const getStatusIcon = (status: string) => {
    return status === 'assigned' ? CheckCircle : Clock;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Reference No validation
    if (!newDealer.referenceNo.trim()) errors.referenceNo = 'Reference number is required';

    // Dealer Code validation
    if (!newDealer.dealerCode.trim()) errors.dealerCode = 'Dealer code is required';
    else if (dealers.some(d => d.id === newDealer.dealerCode)) errors.dealerCode = 'Dealer code must be unique';

    // Dealership Name validation
    if (!newDealer.dealershipName.trim()) errors.dealershipName = 'Dealership name is required';

    // Address validation
    if (!newDealer.address.trim()) errors.address = 'Address is required';

    // State validation
    if (!newDealer.state.trim()) errors.state = 'State is required';

    // Zone validation
    if (!newDealer.zone.trim()) errors.zone = 'Zone is required';

    // Location validation
    if (!newDealer.location.trim()) errors.location = 'Location is required';

    // Pincode validation
    if (!newDealer.pincode.trim()) errors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(newDealer.pincode)) errors.pincode = 'Pincode must be 6 digits';

    // Partner Name validation
    if (!newDealer.partnerName.trim()) errors.partnerName = 'Partner name is required';

    // Contact Person validation
    if (!newDealer.contactPersonName.trim()) errors.contactPersonName = 'Contact person name is required';

    // Mobile No validation
    if (!newDealer.mobileNo.trim()) errors.mobileNo = 'Mobile number is required';
    else if (!/^\+?91\s?\d{10}$|^\d{10}$/.test(newDealer.mobileNo)) errors.mobileNo = 'Invalid mobile format (e.g. 9876543210)';

    // Email validation
    if (!newDealer.email.trim()) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(newDealer.email)) errors.email = 'Invalid email format';

    // GST No validation
    if (!newDealer.gstNo.trim()) errors.gstNo = 'GST number is required';
    else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(newDealer.gstNo))
      errors.gstNo = 'Invalid GST format (e.g. 27AAPFU0939F1ZV)';

    // LOI Date validation
    if (!newDealer.loiDate) errors.loiDate = 'LOI date is required';

    // LOI Valid Upto validation
    if (!newDealer.loiValidUpto) errors.loiValidUpto = 'LOI valid upto date is required';
    else if (newDealer.loiDate && new Date(newDealer.loiValidUpto) <= new Date(newDealer.loiDate))
      errors.loiValidUpto = 'LOI valid upto must be after LOI date';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddDealer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API Call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const createdDealer = {
        id: newDealer.dealerCode,
        name: newDealer.dealershipName,
        location: `${newDealer.location}, ${newDealer.state}`,
        contact: newDealer.mobileNo,
        email: newDealer.email,
        establishedYear: new Date().getFullYear(),
        vehicles: {
          twoWheeler: [],
          threeWheeler: []
        },
        // Additional fields for reference
        referenceNo: newDealer.referenceNo,
        dealerCode: newDealer.dealerCode,
        zone: newDealer.zone,
        partnerName: newDealer.partnerName,
        contactPersonName: newDealer.contactPersonName,
        gstNo: newDealer.gstNo,
        loiDate: newDealer.loiDate,
        loiValidUpto: newDealer.loiValidUpto,
        leadStatus: newDealer.leadStatus
      };

      setDealers(prev => [createdDealer, ...prev]);
      setSuccessMessage('Dealer successfully registered!');

      // Reset form
      setTimeout(() => {
        setShowAddModal(false);
        setSuccessMessage('');
        setNewDealer({
          referenceNo: '',
          dealerCode: '',
          dealershipName: '',
          address: '',
          state: '',
          zone: '',
          location: '',
          pincode: '',
          partnerName: '',
          contactPersonName: '',
          mobileNo: '',
          email: '',
          gstNo: '',
          loiDate: '',
          loiValidUpto: '',
          leadStatus: 'Digital'
        });
      }, 2000);

    } catch (error) {
      setFormErrors({ submit: 'Failed to register dealer. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Dealer Management
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage dealer network and vehicle inventory distribution
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <Users size={20} />
            <span className="font-semibold">{dealers.length} Active Dealers</span>
          </div>
          {canAddDealer && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus size={20} />
              Add Dealer
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dealer List */}
        <div className={`p-6 rounded-2xl ${darkMode ? 'glass bg-gray-800/50' : 'bg-white border border-gray-200'}`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Dealer Partners
          </h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {dealers.map((dealer) => {
              const totalVehicles = (dealer.vehicles?.twoWheeler?.length || 0) + (dealer.vehicles?.threeWheeler?.length || 0);
              const assignedVehicles = [
                ...(dealer.vehicles?.twoWheeler || []),
                ...(dealer.vehicles?.threeWheeler || [])
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
              <div className={`p-6 rounded-2xl ${darkMode ? 'glass bg-gray-800/50' : 'bg-white border border-gray-200'}`}>
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
              <div className={`p-6 rounded-2xl ${darkMode ? 'glass bg-gray-800/50' : 'bg-white border border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <CheckCircle size={20} className="text-green-500" />
                  Sales & Delivery Statistics
                </h3>

                {(() => {
                  const allVehicles = [...(dealer.vehicles?.twoWheeler || []), ...(dealer.vehicles?.threeWheeler || [])];
                  const soldVehicles = allVehicles.filter(v => v.status === 'assigned');
                  const sold2Wheeler = (dealer.vehicles?.twoWheeler || []).filter(v => v.status === 'assigned').length;
                  const sold3Wheeler = (dealer.vehicles?.threeWheeler || []).filter(v => v.status === 'assigned').length;
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
                            {(dealer.vehicles?.twoWheeler?.length || 0)} total inventory
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
                            {(dealer.vehicles?.threeWheeler?.length || 0)} total inventory
                          </p>
                        </div>
                      </div>

                      {/* Delivery Timeline */}
                      <div>
                        <h4 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Recent Deliveries
                        </h4>
                        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
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
                  2-Wheeler ({dealer.vehicles?.twoWheeler?.length || 0})
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
                  3-Wheeler ({dealer.vehicles?.threeWheeler?.length || 0})
                </button>
              </div>

              {/* 2-Wheeler Vehicles */}
              {(vehicleTypeFilter === 'all' || vehicleTypeFilter === '2-wheeler') && (
                <div className={`p-6 rounded-2xl ${darkMode ? 'glass bg-gray-800/50' : 'bg-white border border-gray-200'}`}>
                  <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Package size={20} />
                    2-Wheeler Inventory
                  </h3>
                  <div className="space-y-4">
                    {(dealer.vehicles?.twoWheeler || []).length > 0 ? (
                      dealer.vehicles.twoWheeler.map((vehicle) => {
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
                      })
                    ) : (
                      <div className="text-center py-6 text-gray-500">No 2-Wheelers in stock</div>
                    )}
                  </div>
                </div>
              )}

              {/* 3-Wheeler Vehicles */}
              {(vehicleTypeFilter === 'all' || vehicleTypeFilter === '3-wheeler') && (
                <div className={`p-6 rounded-2xl ${darkMode ? 'glass bg-gray-800/50' : 'bg-white border border-gray-200'}`}>
                  <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Package size={20} />
                    3-Wheeler Inventory
                  </h3>
                  <div className="space-y-4">
                    {(dealer.vehicles?.threeWheeler || []).length > 0 ? (
                      dealer.vehicles.threeWheeler.map((vehicle) => {
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
                      })
                    ) : (
                      <div className="text-center py-6 text-gray-500">No 3-Wheelers in stock</div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={`p-12 rounded-2xl ${darkMode ? 'glass bg-gray-800/50' : 'bg-white border border-gray-200'} flex flex-col items-center justify-center`}>
              <Users size={64} className={`mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Select a dealer to view inventory
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Dealer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setShowAddModal(false)}></div>

          <div className={`relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'}`}>
            {/* Modal Header */}
            <div className={`px-8 py-6 flex items-center justify-between border-b ${darkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
                  <Building2 className="text-white" size={24} />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add New Dealer</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Register a new partner to the network</p>
                </div>
              </div>
              <button
                disabled={isSubmitting}
                onClick={() => setShowAddModal(false)}
                className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddDealer} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {successMessage ? (
                <div className={`flex flex-col items-center justify-center py-10 text-center space-y-4 animate-in fade-in zoom-in`}>
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border-4 border-green-500/20">
                    <ShieldCheck className="text-green-500" size={40} />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Registration Successful!</h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{successMessage}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Basic Information Section */}
                  <div className="space-y-4">
                    <h3 className={`text-sm font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Reference No */}
                      <div className="space-y-1.5">
                        <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Reference No.*</label>
                        <div className="relative">
                          <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            placeholder="e.g. REF2024001"
                            value={newDealer.referenceNo}
                            onChange={(e) => setNewDealer({ ...newDealer, referenceNo: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${formErrors.referenceNo ? 'border-red-500' : darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                          />
                        </div>
                        {formErrors.referenceNo && <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.referenceNo}</p>}
                      </div>

                      {/* Dealer Code */}
                      <div className="space-y-1.5">
                        <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dealer Code*</label>
                        <div className="relative">
                          <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            placeholder="Unique Code (e.g. D005)"
                            value={newDealer.dealerCode}
                            onChange={(e) => setNewDealer({ ...newDealer, dealerCode: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${formErrors.dealerCode ? 'border-red-500' : darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                          />
                        </div>
                        {formErrors.dealerCode && <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.dealerCode}</p>}
                      </div>

                      {/* Dealership Name */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dealership Name*</label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            placeholder="e.g. Kinetic Mumbai Central"
                            value={newDealer.dealershipName}
                            onChange={(e) => setNewDealer({ ...newDealer, dealershipName: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${formErrors.dealershipName ? 'border-red-500' : darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                          />
                        </div>
                        {formErrors.dealershipName && <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.dealershipName}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Party Creation Details */}
                  <div className="space-y-4">
                    <h3 className={`text-sm font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Party Creation Details</h3>
                    <div className="space-y-4">
                      {/* Dealer's Address */}
                      <div className="space-y-1.5">
                        <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dealer's Address*</label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                          <textarea
                            placeholder="Plot No, Street, Landmark..."
                            rows={2}
                            value={newDealer.address}
                            onChange={(e) => setNewDealer({ ...newDealer, address: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none resize-none ${formErrors.address ? 'border-red-500' : darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                          ></textarea>
                        </div>
                        {formErrors.address && <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.address}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {/* State */}
                        <div className="space-y-1.5">
                          <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>State*</label>
                          <input
                            type="text"
                            placeholder="State"
                            value={newDealer.state}
                            onChange={(e) => setNewDealer({ ...newDealer, state: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${formErrors.state ? 'border-red-500' : darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                          />
                          {formErrors.state && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.state}</p>}
                        </div>

                        {/* Zone */}
                        <div className="space-y-1.5">
                          <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Zone*</label>
                          <select
                            value={newDealer.zone}
                            onChange={(e) => setNewDealer({ ...newDealer, zone: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${formErrors.zone ? 'border-red-500' : darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                          >
                            <option value="">Select Zone</option>
                            <option value="North">North</option>
                            <option value="South">South</option>
                            <option value="East">East</option>
                            <option value="West">West</option>
                            <option value="Central">Central</option>
                          </select>
                          {formErrors.zone && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.zone}</p>}
                        </div>

                        {/* Location */}
                        <div className="space-y-1.5">
                          <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location*</label>
                          <input
                            type="text"
                            placeholder="City"
                            value={newDealer.location}
                            onChange={(e) => setNewDealer({ ...newDealer, location: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${formErrors.location ? 'border-red-500' : darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                          />
                          {formErrors.location && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.location}</p>}
                        </div>

                        {/* Pin Code */}
                        <div className="space-y-1.5">
                          <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pin Code*</label>
                          <input
                            type="text"
                            placeholder="6 Digits"
                            maxLength={6}
                            value={newDealer.pincode}
                            onChange={(e) => setNewDealer({ ...newDealer, pincode: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${formErrors.pincode ? 'border-red-500' : darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                          />
                          {formErrors.pincode && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.pincode}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className={`text-sm font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Partner's Name */}
                      <div className="space-y-1.5">
                        <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Partner's Name*</label>
                        <div className="relative">
                          <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            placeholder="Owner/Partner Name"
                            value={newDealer.partnerName}
                            onChange={(e) => setNewDealer({ ...newDealer, partnerName: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${formErrors.partnerName ? 'border-red-500' : darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                          />
                        </div>
                        {formErrors.partnerName && <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.partnerName}</p>}
                      </div>

                      {/* Contact Person Name */}
                      <div className="space-y-1.5">
                        <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Contact Person Name*</label>
                        <div className="relative">
                          <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            placeholder="Contact Person"
                            value={newDealer.contactPersonName}
                            onChange={(e) => setNewDealer({ ...newDealer, contactPersonName: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${formErrors.contactPersonName ? 'border-red-500' : darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                          />
                        </div>
                        {formErrors.contactPersonName && <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.contactPersonName}</p>}
                      </div>

                      {/* Mobile No */}
                      <div className="space-y-1.5">
                        <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mobile No.*</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="tel"
                            placeholder="+91 9876543210"
                            value={newDealer.mobileNo}
                            onChange={(e) => setNewDealer({ ...newDealer, mobileNo: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${formErrors.mobileNo ? 'border-red-500' : darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                          />
                        </div>
                        {formErrors.mobileNo && <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.mobileNo}</p>}
                      </div>

                      {/* E-mail ID */}
                      <div className="space-y-1.5">
                        <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>E-mail ID*</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="email"
                            placeholder="dealer@kinetic.com"
                            value={newDealer.email}
                            onChange={(e) => setNewDealer({ ...newDealer, email: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${formErrors.email ? 'border-red-500' : darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                          />
                        </div>
                        {formErrors.email && <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.email}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Legal & Business Details */}
                  <div className="space-y-4">
                    <h3 className={`text-sm font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Legal & Business Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* GST No */}
                      <div className="space-y-1.5 md:col-span-3">
                        <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>GST No.*</label>
                        <div className="relative">
                          <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            placeholder="e.g. 27AAPFU0939F1ZV"
                            maxLength={15}
                            value={newDealer.gstNo}
                            onChange={(e) => setNewDealer({ ...newDealer, gstNo: e.target.value.toUpperCase() })}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${formErrors.gstNo ? 'border-red-500' : darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                          />
                        </div>
                        {formErrors.gstNo && <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.gstNo}</p>}
                      </div>

                      {/* LOI Date */}
                      <div className="space-y-1.5">
                        <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>LOI Date*</label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="date"
                            value={newDealer.loiDate}
                            onChange={(e) => setNewDealer({ ...newDealer, loiDate: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${formErrors.loiDate ? 'border-red-500' : darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                          />
                        </div>
                        {formErrors.loiDate && <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.loiDate}</p>}
                      </div>

                      {/* LOI Valid Upto */}
                      <div className="space-y-1.5">
                        <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>LOI Valid Upto*</label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="date"
                            value={newDealer.loiValidUpto}
                            onChange={(e) => setNewDealer({ ...newDealer, loiValidUpto: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${formErrors.loiValidUpto ? 'border-red-500' : darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                          />
                        </div>
                        {formErrors.loiValidUpto && <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.loiValidUpto}</p>}
                      </div>

                      {/* Lead Status */}
                      <div className="space-y-1.5">
                        <label className={`text-sm font-semibold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lead Status*</label>
                        <select
                          value={newDealer.leadStatus}
                          onChange={(e) => setNewDealer({ ...newDealer, leadStatus: e.target.value as 'Digital' | 'Newspaper' | 'Scouting' })}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${darkMode ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500 text-gray-900'}`}
                        >
                          <option value="Digital">Digital</option>
                          <option value="Newspaper">Newspaper</option>
                          <option value="Scouting">Scouting</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </form>

            {/* Modal Footer */}
            {!successMessage && (
              <div className={`p-8 border-t flex flex-col sm:flex-row gap-4 items-center justify-between ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={14} className="text-green-500" />
                  Secure Registration Platform
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setShowAddModal(false)}
                    className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddDealer}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Registering...
                      </>
                    ) : 'Register Dealer'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerManagement;
