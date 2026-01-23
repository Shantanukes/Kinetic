// Dashboard Content Component

import React, { useState } from 'react';
import {
    AlertTriangle,
    Cpu,
    Map as MapIcon,
    Zap,
    Clock,
    TrendingUp,
    Plus,
    Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import kineticScooter from '../assets/image-1768823038663.png';
import AddVehicle from './AddVehicle';
import { DeviceStats, SalesData, EnvironmentalData, QuickAction, Alert, Vehicle, Trip, PerformanceMetrics } from '../types';
// import RecentAlerts from './RecentAlerts';
// import FleetOverview from './FleetOverview';
// import PerformanceChart from './PerformanceChart';
// import RecentTrips from './RecentTrips';
// import ThreeScene from './ThreeScene';

interface DashboardContentProps {
    darkMode: boolean;
    deviceStats: DeviceStats;
    salesData: SalesData;
    environmentalData: EnvironmentalData;
    quickActions: QuickAction[];
    alerts: Alert[];
    vehicles: Vehicle[];
    trips: Trip[];
    performanceMetrics: PerformanceMetrics;
}

const DonutChart = ({ data, total, darkMode }: { data: { label: string, value: number, color: string }[], total: number, darkMode: boolean }) => {
    let accumulated = 0;
    const size = typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 160;
    const strokeWidth = typeof window !== 'undefined' && window.innerWidth < 640 ? 16 : 20;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {data.map((item, index) => {
                    // Simple Arc Calculation for Donut
                    const percent = item.value / total;
                    const strokeDasharray = `${circumference * percent} ${circumference}`;
                    const strokeDashoffset = -1 * accumulated * (circumference / total);
                    accumulated += item.value;

                    return (
                        <circle
                            key={index}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                        />
                    );
                })}
            </svg>
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className={`text-xl sm:text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{total}</span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium">VEHICLES</span>
            </div>
        </div>
    );
};

const Gauge = ({ value, max, label, darkMode }: { value: number, max: number, label: string, darkMode: boolean }) => {
    const percent = Math.min(value / max, 1);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const gaugeWidth = isMobile ? 32 : 40;
    const gaugeHeight = isMobile ? 16 : 20;
    return (
        <div className="flex flex-col items-center">
            <div className={`relative overflow-hidden`} style={{ width: `${gaugeWidth * 4}px`, height: `${gaugeHeight * 4}px` }}>
                <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-700 rounded-t-full"></div>
                <div
                    className="absolute top-0 left-0 w-full h-full bg-blue-600 rounded-t-full origin-bottom transition-transform duration-1000 ease-out"
                    style={{ transform: `rotate(${(percent * 180) - 180}deg)` }}
                ></div>
            </div>
            <div className="flex flex-col items-center -mt-6 sm:-mt-8 relative z-10">
                <span className={`text-lg sm:text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value} MW</span>
                <span className="text-[10px] sm:text-xs text-gray-500">{label}</span>
            </div>
        </div>
    )
}

const DashboardContent: React.FC<DashboardContentProps> = ({
    darkMode,
    deviceStats,
    salesData,
    environmentalData,
    quickActions,
    alerts,
    vehicles,
    trips,
    performanceMetrics
}) => {
    const [tripTooltip, setTripTooltip] = useState<{ x: number, y: number, time: string, value: number } | null>(null);
    /* 
    const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  
    const handleAddVehicle = (vehicleData: any) => {
        console.log('Vehicle Added:', vehicleData);
        // Logic to add vehicle to state/backend would go here
        setIsAddVehicleOpen(false);
    };
    */

    // Prepare data for Donut
    const donutData = [
        { label: 'Active', value: deviceStats.active, color: '#3B82F6' },
        { label: 'Idle', value: deviceStats.inactive, color: '#10B981' },
        { label: 'Faulty', value: deviceStats.faulty, color: '#EF4444' }
    ];

    return (
        <main
            className={`p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 ${darkMode
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
                : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 text-gray-900'
            } font-sans`}
        >
            {/* Mobile GIF/Image section - always visible at the top on mobile */}
            <div className="block lg:hidden mb-4">
                <div className={`mx-auto w-full max-w-sm flex flex-col items-center justify-center p-4 rounded-2xl ${darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white border border-blue-100'} shadow-md`}>
                    <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-xs font-bold text-gray-500">Vehicle Model</span>
                        <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold">Featured</span>
                    </div>
                    <img
                        src={kineticScooter}
                        alt="Electric Scooter"
                        className="w-48 h-36 object-contain rounded-lg mb-4 animate-bounce"
                        style={{ background: darkMode ? 'rgba(30,41,59,0.1)' : 'rgba(59,130,246,0.05)' }}
                    />
                    
                    <div className="grid grid-cols-2 gap-3 w-full">
                         <div className={`p-2 rounded-xl border ${darkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-100'}`}>
                             <p className="text-[10px] text-gray-500 mb-1">Avg Range</p>
                             <p className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>45 <span className="text-xs">km</span></p>
                         </div>
                         <div className={`p-2 rounded-xl border ${darkMode ? 'bg-green-900/20 border-green-500/30' : 'bg-green-50 border-green-100'}`}>
                             <p className="text-[10px] text-gray-500 mb-1">Health</p>
                             <p className={`text-lg font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>94<span className="text-xs">%</span></p>
                         </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 transition-all duration-300 ease-in-out">

                {/* Left Column: Status & Map */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-1 space-y-4 sm:space-y-6 flex flex-col h-full">

                    {/* Live Status Card */}
                    <div className={`p-4 sm:p-6 rounded-2xl ${darkMode
                            ? 'bg-gradient-to-br from-gray-800 to-gray-800/80 border border-gray-700/50 shadow-xl'
                            : 'bg-white shadow-lg border border-gray-100'
                        } transform hover:scale-[1.02] transition-all duration-300 flex-1 flex flex-col justify-between`}>
                        <div className="flex justify-between items-start mb-4 sm:mb-6">
                            <div>
                                <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1">Live Status</h3>
                                <p className="text-[10px] sm:text-xs text-gray-500">Real-time vehicle monitoring</p>
                            </div>
                            <div className="flex space-x-1 sm:space-x-1.5">
                                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center relative">
                            {/* Integrated Scooter Image or Icon in Center/Overlay */}
                            <div className="relative mb-6">
                                <DonutChart data={donutData} total={deviceStats.total} darkMode={darkMode} />
                            </div>

                            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full text-center text-xs sm:text-sm">
                                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                                    <span className="block font-bold text-lg sm:text-xl md:text-2xl text-blue-500 mb-0.5 sm:mb-1">{deviceStats.active}</span>
                                    <span className="text-gray-500 text-[10px] sm:text-xs font-medium">Active</span>
                                </div>
                                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-green-500/20 hover:border-green-500/40 transition-all">
                                    <span className="block font-bold text-lg sm:text-xl md:text-2xl text-green-500 mb-0.5 sm:mb-1">{deviceStats.inactive}</span>
                                    <span className="text-gray-500 text-[10px] sm:text-xs font-medium">Idle</span>
                                </div>
                                <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-red-500/20 hover:border-red-500/40 transition-all">
                                    <span className="block font-bold text-lg sm:text-xl md:text-2xl text-red-500 mb-0.5 sm:mb-1">{deviceStats.faulty}</span>
                                    <span className="text-gray-500 text-[10px] sm:text-xs font-medium">Faulty</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Showcase Card (The requested Scooter Image) */}
                    <div className={`hidden lg:block p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl ${darkMode
                            ? 'bg-gradient-to-br from-gray-800 to-gray-800/80 border border-gray-700/50 shadow-xl'
                            : 'bg-gradient-to-br from-white to-blue-50/30 shadow-lg border border-blue-100'
                        } relative overflow-hidden group transform hover:scale-[1.02] transition-all duration-300`}>
                        <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Zap size={100} className="sm:w-[140px] sm:h-[140px]" />
                        </div>
                        <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
                            <div>
                                <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1">Vehicle Model</h3>
                                <p className="text-[10px] sm:text-xs text-gray-500">Kinetic Green Series</p>
                            </div>
                            <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] sm:text-xs font-semibold shadow-lg">
                                Featured
                            </div>
                        </div>
                        <div className="flex flex-col items-center relative z-10">
                            <div className="bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-xl sm:rounded-2xl p-2 sm:p-4 mb-3 sm:mb-4 w-full">
                                <img
                                    src={kineticScooter}
                                    alt="Electric Scooter"
                                    className="w-full h-40 sm:h-48 md:h-56 object-contain rounded-lg hover:scale-110 transition-transform duration-700 ease-out px-2 sm:px-4"
                                />
                            </div>
                            <div className="w-full grid grid-cols-2 gap-2 sm:gap-3">
                                <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border backdrop-blur-sm ${darkMode
                                        ? 'bg-blue-900/30 border-blue-500/30 hover:bg-blue-900/50'
                                        : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 hover:shadow-md'
                                    } transition-all duration-300 cursor-pointer group/card`}>
                                    <div className={`text-[10px] sm:text-xs font-semibold mb-1 sm:mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'
                                        } flex items-center justify-between`}>
                                        <span>Avg Range</span>
                                        <MapIcon size={12} className="sm:w-3.5 sm:h-3.5 opacity-50 group-hover/card:opacity-100 transition-opacity" />
                                    </div>
                                    <div className={`font-bold text-xl sm:text-2xl md:text-3xl ${darkMode ? 'text-blue-400' : 'text-blue-600'
                                        }`}>45 <span className="text-sm sm:text-base md:text-lg">km</span></div>
                                </div>
                                <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border backdrop-blur-sm ${darkMode
                                        ? 'bg-green-900/30 border-green-500/30 hover:bg-green-900/50'
                                        : 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 hover:shadow-md'
                                    } transition-all duration-300 cursor-pointer group/card`}>
                                    <div className={`text-[10px] sm:text-xs font-semibold mb-1 sm:mb-2 ${darkMode ? 'text-green-300' : 'text-green-700'
                                        } flex items-center justify-between`}>
                                        <span>Battery Health</span>
                                        <Activity size={12} className="sm:w-3.5 sm:h-3.5 opacity-50 group-hover/card:opacity-100 transition-opacity" />
                                    </div>
                                    <div className={`font-bold text-xl sm:text-2xl md:text-3xl ${darkMode ? 'text-green-400' : 'text-green-600'
                                        }`}>94<span className="text-sm sm:text-base md:text-lg">%</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Real-Time Demand */}
                    <div className={`p-4 sm:p-6 rounded-2xl ${darkMode
                            ? 'bg-gradient-to-br from-gray-800 to-gray-800/80 border border-gray-700/50 shadow-xl'
                            : 'bg-white shadow-lg border border-gray-100'
                        } transform hover:scale-[1.02] transition-all duration-300 flex-1 flex flex-col justify-between`}>
                        <div className="mb-3 sm:mb-4">
                            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1">Real-Time Demand</h3>
                            <p className="text-[10px] sm:text-xs text-gray-500">Current power consumption</p>
                        </div>
                        <div className="flex justify-center py-2 sm:py-4">
                            <Gauge value={2.3} max={4} label="Current Load" darkMode={darkMode} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Metrics & Charts */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-3 space-y-4 sm:space-y-6 flex flex-col">

                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                        <div className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl ${darkMode
                                ? 'bg-gradient-to-br from-gray-800 to-gray-800/80 border border-gray-700/50 shadow-xl'
                                : 'bg-white shadow-lg border border-gray-100'
                            } transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col justify-center`}>
                            <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] w-full">
                                <MapIcon size={20} className="sm:w-6 sm:h-6 mb-1 sm:mb-2" />
                                <p className="text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 opacity-90">Distance Travelled</p>
                                <p className="text-lg sm:text-xl md:text-2xl font-bold">{environmentalData.totalKm.toLocaleString()}<span className="text-xs sm:text-sm font-normal ml-1">m</span></p>
                            </div>
                        </div>
                        <div className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl ${darkMode
                                ? 'bg-gradient-to-br from-gray-800 to-gray-800/80 border border-gray-700/50 shadow-xl'
                                : 'bg-white shadow-lg border border-gray-100'
                            } transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col justify-center`}>
                            <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] w-full">
                                <Zap size={20} className="sm:w-6 sm:h-6 mb-1 sm:mb-2" />
                                <p className="text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 opacity-90">Energy Consumed</p>
                                <p className="text-lg sm:text-xl md:text-2xl font-bold">3,640<span className="text-xs sm:text-sm font-normal ml-1">kWh</span></p>
                            </div>
                        </div>
                        <div className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl ${darkMode
                                ? 'bg-gradient-to-br from-gray-800 to-gray-800/80 border border-gray-700/50 shadow-xl'
                                : 'bg-white shadow-lg border border-gray-100'
                            } transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col justify-center`}>
                            <div className="p-3 sm:p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] w-full">
                                <Clock size={20} className="sm:w-6 sm:h-6 mb-1 sm:mb-2" />
                                <p className="text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 opacity-90">Avg Trip Time</p>
                                <p className="text-lg sm:text-xl md:text-2xl font-bold">50<span className="text-xs sm:text-sm font-normal ml-1">min</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Row: Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                        {/* Cost Savings vs Fuel Types Chart */}
                        <div className={`p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'} h-full flex flex-col justify-between`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base">Cost Savings vs Fuel Types</h3>
                                    <p className="text-[10px] text-gray-500">Daily running cost comparison</p>
                                </div>
                                <div className="flex items-center text-green-500 text-xs sm:text-sm font-bold bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                                    <TrendingUp size={14} className="sm:w-4 sm:h-4 mr-1" /> ₹19,240
                                </div>
                            </div>
                            
                            <div className="h-48 sm:h-56 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={[
                                        { day: 'Mon', petrol: 450, diesel: 380, cng: 250, ev: 40 },
                                        { day: 'Tue', petrol: 480, diesel: 400, cng: 260, ev: 45 },
                                        { day: 'Wed', petrol: 520, diesel: 440, cng: 280, ev: 50 },
                                        { day: 'Thu', petrol: 490, diesel: 410, cng: 270, ev: 48 },
                                        { day: 'Fri', petrol: 550, diesel: 460, cng: 290, ev: 55 },
                                        { day: 'Sat', petrol: 600, diesel: 500, cng: 310, ev: 60 },
                                        { day: 'Sun', petrol: 580, diesel: 480, cng: 300, ev: 58 },
                                    ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorPetrol" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorDiesel" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorCng" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorEv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#374151" : "#E5E7EB"} />
                                        <XAxis 
                                            dataKey="day" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 10 }} 
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 10 }}
                                            tickFormatter={(value) => `₹${value}`}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', 
                                                borderColor: darkMode ? '#374151' : '#E5E7EB',
                                                borderRadius: '8px',
                                                fontSize: '12px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                            formatter={(value: number) => [`₹${value}`, '']}
                                        />
                                        <Legend 
                                            iconType="circle" 
                                            wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} 
                                        />
                                        <Area type="monotone" dataKey="petrol" name="Petrol" stroke="#EF4444" fillOpacity={1} fill="url(#colorPetrol)" strokeWidth={2} />
                                        <Area type="monotone" dataKey="diesel" name="Diesel" stroke="#F59E0B" fillOpacity={1} fill="url(#colorDiesel)" strokeWidth={2} />
                                        <Area type="monotone" dataKey="cng" name="CNG" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCng)" strokeWidth={2} />
                                        <Area type="monotone" dataKey="ev" name="Electric (EV)" stroke="#10B981" fillOpacity={1} fill="url(#colorEv)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Carbon Saved Chart */}
                        <div className={`p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'} h-full flex flex-col justify-between`}>
                            <div className="flex justify-between items-center mb-4 sm:mb-6">
                                <h3 className="font-bold text-sm sm:text-base">Carbon Saved</h3>
                                <div className="text-xs sm:text-sm text-green-500 font-bold">Total: 842 kg</div>
                            </div>
                            {/* Detailed Line Chart with hover info */}
                            <div className="h-40 sm:h-48 md:h-56 relative border-l border-b border-gray-200 dark:border-gray-700 pl-6 sm:pl-8 pb-6 sm:pb-8">
                                {/* Y-axis labels */}
                                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] sm:text-xs text-gray-400 pr-1 sm:pr-2">
                                    <span>200</span>
                                    <span>150</span>
                                    <span>100</span>
                                    <span>50</span>
                                    <span>0</span>
                                </div>

                                {/* SVG Line Chart */}
                                <svg
                                    className="absolute inset-0 w-full h-full overflow-visible pl-8 pb-8"
                                    preserveAspectRatio="none"
                                    viewBox="0 0 360 200"
                                    onMouseMove={(e) => {
                                        const svg = e.currentTarget;
                                        const rect = svg.getBoundingClientRect();
                                        const x = ((e.clientX - rect.left) / rect.width) * 360;
                                        const carbonData = [
                                            { x: 0, y: 145, time: '10:00', value: 42 },
                                            { x: 12, y: 140, time: '10:05', value: 48 },
                                            { x: 24, y: 135, time: '10:10', value: 54 },
                                            { x: 36, y: 130, time: '10:15', value: 58 },
                                            { x: 48, y: 125, time: '10:20', value: 62 },
                                            { x: 60, y: 120, time: '10:25', value: 68 },
                                            { x: 72, y: 115, time: '10:30', value: 72 },
                                            { x: 84, y: 110, time: '10:35', value: 75 },
                                            { x: 96, y: 105, time: '10:40', value: 78 },
                                            { x: 108, y: 100, time: '10:45', value: 82 },
                                            { x: 120, y: 95, time: '10:50', value: 88 },
                                            { x: 132, y: 90, time: '10:55', value: 92 },
                                            { x: 144, y: 85, time: '11:00', value: 98 },
                                            { x: 156, y: 80, time: '11:05', value: 102 },
                                            { x: 168, y: 75, time: '11:10', value: 105 },
                                            { x: 180, y: 70, time: '11:15', value: 108 },
                                            { x: 192, y: 65, time: '11:20', value: 112 },
                                            { x: 204, y: 60, time: '11:25', value: 118 },
                                            { x: 216, y: 55, time: '11:30', value: 125 },
                                            { x: 228, y: 60, time: '11:35', value: 118 },
                                            { x: 240, y: 65, time: '11:40', value: 112 },
                                            { x: 252, y: 70, time: '11:45', value: 108 },
                                            { x: 264, y: 75, time: '11:50', value: 105 },
                                            { x: 276, y: 80, time: '11:55', value: 102 },
                                            { x: 288, y: 85, time: '12:00', value: 98 },
                                            { x: 300, y: 90, time: '12:05', value: 92 },
                                            { x: 312, y: 95, time: '12:10', value: 88 },
                                            { x: 324, y: 100, time: '12:15', value: 82 },
                                            { x: 336, y: 105, time: '12:20', value: 78 },
                                            { x: 348, y: 110, time: '12:25', value: 75 }
                                        ];
                                        const nearest = carbonData.reduce((prev, curr) => {
                                            return Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev;
                                        });
                                        setTripTooltip({ x: nearest.x, y: nearest.y, time: nearest.time, value: nearest.value });
                                    }}
                                    onMouseLeave={() => setTripTooltip(null)}
                                >
                                    <defs>
                                        <linearGradient id="carbonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
                                        </linearGradient>
                                    </defs>

                                    {/* Solid horizontal grid lines */}
                                    <line x1="0" y1="40" x2="360" y2="40" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />
                                    <line x1="0" y1="80" x2="360" y2="80" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />
                                    <line x1="0" y1="120" x2="360" y2="120" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />
                                    <line x1="0" y1="160" x2="360" y2="160" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />

                                    {/* Vertical lines */}
                                    <line x1="90" y1="0" x2="90" y2="200" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />
                                    <line x1="180" y1="0" x2="180" y2="200" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />
                                    <line x1="270" y1="0" x2="270" y2="200" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />
                                    <line x1="360" y1="0" x2="360" y2="200" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />

                                    {/* Gradient fill area */}
                                    <polygon
                                        fill="url(#carbonGradient)"
                                        points="0,145 12,140 24,135 36,130 48,125 60,120 72,115 84,110 96,105 108,100 120,95 132,90 144,85 156,80 168,75 180,70 192,65 204,60 216,55 228,60 240,65 252,70 264,75 276,80 288,85 300,90 312,95 324,100 336,105 348,110 360,200 0,200"
                                        style={{
                                            strokeDasharray: '1000',
                                            strokeDashoffset: '1000',
                                            animation: 'draw 2s ease-out forwards'
                                        }}
                                    />

                                    {/* Animated line */}
                                    <polyline
                                        fill="none"
                                        stroke="#10B981"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points="0,145 12,140 24,135 36,130 48,125 60,120 72,115 84,110 96,105 108,100 120,95 132,90 144,85 156,80 168,75 180,70 192,65 204,60 216,55 228,60 240,65 252,70 264,75 276,80 288,85 300,90 312,95 324,100 336,105 348,110"
                                        className="animate-draw-line"
                                        style={{
                                            strokeDasharray: '1000',
                                            strokeDashoffset: '1000',
                                            animation: 'draw 2s ease-out forwards'
                                        }}
                                    />

                                    {/* Hover indicator line */}
                                    {tripTooltip && (
                                        <line
                                            x1={tripTooltip.x}
                                            y1="0"
                                            x2={tripTooltip.x}
                                            y2="200"
                                            stroke="#10B981"
                                            strokeWidth="1"
                                            strokeDasharray="4 2"
                                            opacity="0.5"
                                        />
                                    )}

                                    {/* Hover point */}
                                    {tripTooltip && (
                                        <>
                                            <circle cx={tripTooltip.x} cy={tripTooltip.y} r="4" fill="white" stroke="#10B981" strokeWidth="2" />
                                            <circle cx={tripTooltip.x} cy={tripTooltip.y} r="8" fill="#10B981" fillOpacity="0.2" />
                                        </>
                                    )}
                                </svg>

                                {/* Interactive tooltip */}
                                {tripTooltip && (
                                    <div
                                        className="absolute pointer-events-none z-10"
                                        style={{
                                            left: `${(tripTooltip.x / 360) * 100}%`,
                                            top: `${(tripTooltip.y / 200) * 100}%`,
                                            transform: 'translate(-50%, -120%)'
                                        }}
                                    >
                                        <div className={`px-3 py-2 rounded-lg shadow-lg ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
                                            <div className="text-xs font-semibold text-green-500">{tripTooltip.time}</div>
                                            <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {tripTooltip.value} kg
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 mt-2 pl-6 sm:pl-8">
                                <span>10:00</span><span>10:30</span><span>11:00</span><span>11:30</span><span>12:00</span><span>12:30</span>
                            </div>
                        </div>
                    </div>

                    {/* EV News & Insights */}
                    <div className={`p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                            <h3 className="font-bold text-sm sm:text-base">EV News & Future Growth</h3>
                            <button className="text-[10px] sm:text-xs text-blue-500 font-semibold hover:underline">View All</button>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            {[
                                {
                                    id: 1,
                                    title: "Global EV Adoption to Triple by 2030",
                                    excerpt: "New market analysis suggests a rapid surge in electric vehicle sales driven by policy changes and battery costs.",
                                    category: "Growth",
                                    badgeClass: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                                    date: "2h ago"
                                },
                                {
                                    id: 2,
                                    title: "Solid-State Batteries: The Next Frontier",
                                    excerpt: "Breakthroughs in solid-state technology promise 2x range and 50% faster charging speeds.",
                                    category: "Tech",
                                    badgeClass: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
                                    date: "5h ago"
                                },
                                {
                                    id: 3,
                                    title: "Sustainable Manufacturing in Auto Industry",
                                    excerpt: "Leading manufacturers commit to carbon-neutral production lines by 2025.",
                                    category: "Green",
                                    badgeClass: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                                    date: "1d ago"
                                },
                                {
                                    id: 4,
                                    title: "Smart Grid Integration for EVs",
                                    excerpt: "How V2G technology will stabilize the grid and lower energy costs for owners.",
                                    category: "Future",
                                    badgeClass: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
                                    date: "2d ago"
                                }
                            ].map((post) => (
                                <div key={post.id} className="group cursor-pointer">
                                    <div className={`flex flex-col p-3 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${post.badgeClass}`}>
                                                {post.category}
                                            </span>
                                            <span className="text-[10px] text-gray-400">{post.date}</span>
                                        </div>
                                        <h4 className={`text-sm font-bold mb-1 group-hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                            {post.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* 
      <AddVehicle 
        isOpen={isAddVehicleOpen} 
        onClose={() => setIsAddVehicleOpen(false)} 
        onAdd={handleAddVehicle}
        darkMode={darkMode}
      />
      */}
        </main>
    );
};

export default DashboardContent;
