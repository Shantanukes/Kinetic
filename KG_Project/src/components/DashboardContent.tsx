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
    const size = 160;
    const strokeWidth = 20;
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
                <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{total}</span>
                <span className="text-xs text-gray-500 font-medium">VEHICLES</span>
            </div>
        </div>
    );
};

const Gauge = ({ value, max, label, darkMode }: { value: number, max: number, label: string, darkMode: boolean }) => {
    const percent = Math.min(value / max, 1);
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-700 rounded-t-full"></div>
                <div
                    className="absolute top-0 left-0 w-full h-full bg-blue-600 rounded-t-full origin-bottom transition-transform duration-1000 ease-out"
                    style={{ transform: `rotate(${(percent * 180) - 180}deg)` }}
                ></div>
            </div>
            <div className="flex flex-col items-center -mt-8 relative z-10">
                <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value} MW</span>
                <span className="text-xs text-gray-500">{label}</span>
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
        <main className={`p-6 space-y-6 ${darkMode
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
                : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 text-gray-900'
            } min-h-screen font-sans`}>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Status & Map */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Live Status Card */}
                    <div className={`p-6 rounded-2xl ${darkMode
                            ? 'bg-gradient-to-br from-gray-800 to-gray-800/80 border border-gray-700/50 shadow-xl'
                            : 'bg-white shadow-lg border border-gray-100'
                        } transform hover:scale-[1.02] transition-all duration-300`}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-bold text-xl mb-1">Live Status</h3>
                                <p className="text-xs text-gray-500">Real-time vehicle monitoring</p>
                            </div>
                            <div className="flex space-x-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center relative">
                            {/* Integrated Scooter Image or Icon in Center/Overlay */}
                            <div className="relative mb-6">
                                <DonutChart data={donutData} total={deviceStats.total} darkMode={darkMode} />
                            </div>

                            <div className="grid grid-cols-3 gap-3 w-full text-center text-sm">
                                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-3 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                                    <span className="block font-bold text-2xl text-blue-500 mb-1">{deviceStats.active}</span>
                                    <span className="text-gray-500 text-xs font-medium">Active</span>
                                </div>
                                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-3 border border-green-500/20 hover:border-green-500/40 transition-all">
                                    <span className="block font-bold text-2xl text-green-500 mb-1">{deviceStats.inactive}</span>
                                    <span className="text-gray-500 text-xs font-medium">Idle</span>
                                </div>
                                <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-3 border border-red-500/20 hover:border-red-500/40 transition-all">
                                    <span className="block font-bold text-2xl text-red-500 mb-1">{deviceStats.faulty}</span>
                                    <span className="text-gray-500 text-xs font-medium">Faulty</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Showcase Card (The requested Scooter Image) */}
                    <div className={`p-6 rounded-2xl ${darkMode
                            ? 'bg-gradient-to-br from-gray-800 to-gray-800/80 border border-gray-700/50 shadow-xl'
                            : 'bg-gradient-to-br from-white to-blue-50/30 shadow-lg border border-blue-100'
                        } relative overflow-hidden group transform hover:scale-[1.02] transition-all duration-300`}>
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Zap size={140} />
                        </div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div>
                                <h3 className="font-bold text-xl mb-1">Vehicle Model</h3>
                                <p className="text-xs text-gray-500">Kinetic Green Series</p>
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold shadow-lg">
                                Featured
                            </div>
                        </div>
                        <div className="flex flex-col items-center relative z-10">
                            <div className="bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-2xl p-4 mb-4 w-full">
                                <img
                                    src={kineticScooter}
                                    alt="Electric Scooter"
                                    className="w-full h-56 object-contain rounded-lg hover:scale-110 transition-transform duration-700 ease-out px-4"
                                />
                            </div>
                            <div className="w-full grid grid-cols-2 gap-3">
                                <div className={`p-4 rounded-xl border backdrop-blur-sm ${darkMode
                                        ? 'bg-blue-900/30 border-blue-500/30 hover:bg-blue-900/50'
                                        : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 hover:shadow-md'
                                    } transition-all duration-300 cursor-pointer group/card`}>
                                    <div className={`text-xs font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'
                                        } flex items-center justify-between`}>
                                        <span>Avg Range</span>
                                        <MapIcon size={14} className="opacity-50 group-hover/card:opacity-100 transition-opacity" />
                                    </div>
                                    <div className={`font-bold text-3xl ${darkMode ? 'text-blue-400' : 'text-blue-600'
                                        }`}>45 <span className="text-lg">km</span></div>
                                </div>
                                <div className={`p-4 rounded-xl border backdrop-blur-sm ${darkMode
                                        ? 'bg-green-900/30 border-green-500/30 hover:bg-green-900/50'
                                        : 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 hover:shadow-md'
                                    } transition-all duration-300 cursor-pointer group/card`}>
                                    <div className={`text-xs font-semibold mb-2 ${darkMode ? 'text-green-300' : 'text-green-700'
                                        } flex items-center justify-between`}>
                                        <span>Battery Health</span>
                                        <Activity size={14} className="opacity-50 group-hover/card:opacity-100 transition-opacity" />
                                    </div>
                                    <div className={`font-bold text-3xl ${darkMode ? 'text-green-400' : 'text-green-600'
                                        }`}>94<span className="text-lg">%</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Real-Time Demand */}
                    <div className={`p-6 rounded-2xl ${darkMode
                            ? 'bg-gradient-to-br from-gray-800 to-gray-800/80 border border-gray-700/50 shadow-xl'
                            : 'bg-white shadow-lg border border-gray-100'
                        } transform hover:scale-[1.02] transition-all duration-300`}>
                        <div className="mb-4">
                            <h3 className="font-bold text-xl mb-1">Real-Time Demand</h3>
                            <p className="text-xs text-gray-500">Current power consumption</p>
                        </div>
                        <div className="flex justify-center py-4">
                            <Gauge value={2.3} max={4} label="Current Load" darkMode={darkMode} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Metrics & Charts */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={`p-5 rounded-2xl ${darkMode
                                ? 'bg-gradient-to-br from-gray-800 to-gray-800/80 border border-gray-700/50 shadow-xl'
                                : 'bg-white shadow-lg border border-gray-100'
                            } transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer group`}>
                            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center min-h-[120px]">
                                <MapIcon size={24} className="mb-2" />
                                <p className="text-xs font-medium mb-1 opacity-90">Distance Travelled</p>
                                <p className="text-2xl font-bold">{environmentalData.totalKm.toLocaleString()}<span className="text-sm font-normal ml-1">m</span></p>
                            </div>
                        </div>
                        <div className={`p-5 rounded-2xl ${darkMode
                                ? 'bg-gradient-to-br from-gray-800 to-gray-800/80 border border-gray-700/50 shadow-xl'
                                : 'bg-white shadow-lg border border-gray-100'
                            } transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer group`}>
                            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center min-h-[120px]">
                                <Zap size={24} className="mb-2" />
                                <p className="text-xs font-medium mb-1 opacity-90">Energy Consumed</p>
                                <p className="text-2xl font-bold">3,640<span className="text-sm font-normal ml-1">kWh</span></p>
                            </div>
                        </div>
                        <div className={`p-5 rounded-2xl ${darkMode
                                ? 'bg-gradient-to-br from-gray-800 to-gray-800/80 border border-gray-700/50 shadow-xl'
                                : 'bg-white shadow-lg border border-gray-100'
                            } transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer group`}>
                            <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center min-h-[120px]">
                                <Clock size={24} className="mb-2" />
                                <p className="text-xs font-medium mb-1 opacity-90">Avg Trip Time</p>
                                <p className="text-2xl font-bold">50<span className="text-sm font-normal ml-1">min</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Row: Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Expenses / Savings Chart */}
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold">Cost Savings</h3>
                                <div className="flex items-center text-green-500 text-sm font-bold">
                                    <TrendingUp size={16} className="mr-1" /> ₹19,240
                                </div>
                            </div>
                            {/* CSS Bar Chart Simulation */}
                            <div className="h-48 flex items-end justify-between space-x-2">
                                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col justify-end group">
                                        <div
                                            className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-sm relative transition-all hover:bg-blue-200"
                                            style={{ height: `${h}%` }}
                                        >
                                            <div
                                                className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all group-hover:bg-blue-600"
                                                style={{ height: `${h * 0.6}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                            </div>
                        </div>

                        {/* Sessions Chart */}
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold">Trip Sessions</h3>
                                <div className="text-sm text-gray-500">Total: 842</div>
                            </div>
                            {/* Detailed Line Chart with hover info */}
                            <div className="h-56 relative border-l border-b border-gray-200 dark:border-gray-700 pl-8 pb-8">
                                {/* Y-axis labels */}
                                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-2">
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
                                        const tripData = [
                                            { x: 0, y: 145, time: '10:00:00', sessions: 42 },
                                            { x: 12, y: 140, time: '10:00:05', sessions: 48 },
                                            { x: 24, y: 135, time: '10:00:10', sessions: 54 },
                                            { x: 36, y: 130, time: '10:00:15', sessions: 58 },
                                            { x: 48, y: 125, time: '10:00:20', sessions: 62 },
                                            { x: 60, y: 120, time: '10:00:25', sessions: 68 },
                                            { x: 72, y: 115, time: '10:00:30', sessions: 72 },
                                            { x: 84, y: 110, time: '10:00:35', sessions: 75 },
                                            { x: 96, y: 105, time: '10:00:40', sessions: 78 },
                                            { x: 108, y: 100, time: '10:00:45', sessions: 82 },
                                            { x: 120, y: 95, time: '10:00:50', sessions: 88 },
                                            { x: 132, y: 90, time: '10:00:55', sessions: 92 },
                                            { x: 144, y: 85, time: '10:01:00', sessions: 98 },
                                            { x: 156, y: 80, time: '10:01:05', sessions: 102 },
                                            { x: 168, y: 75, time: '10:01:10', sessions: 105 },
                                            { x: 180, y: 70, time: '10:01:15', sessions: 108 },
                                            { x: 192, y: 65, time: '10:01:20', sessions: 112 },
                                            { x: 204, y: 60, time: '10:01:25', sessions: 118 },
                                            { x: 216, y: 55, time: '10:01:30', sessions: 125 },
                                            { x: 228, y: 60, time: '10:01:35', sessions: 118 },
                                            { x: 240, y: 65, time: '10:01:40', sessions: 112 },
                                            { x: 252, y: 70, time: '10:01:45', sessions: 108 },
                                            { x: 264, y: 75, time: '10:01:50', sessions: 105 },
                                            { x: 276, y: 80, time: '10:01:55', sessions: 102 },
                                            { x: 288, y: 85, time: '10:02:00', sessions: 98 },
                                            { x: 300, y: 90, time: '10:02:05', sessions: 92 },
                                            { x: 312, y: 95, time: '10:02:10', sessions: 88 },
                                            { x: 324, y: 100, time: '10:02:15', sessions: 82 },
                                            { x: 336, y: 105, time: '10:02:20', sessions: 78 },
                                            { x: 348, y: 110, time: '10:02:25', sessions: 75 }
                                        ];
                                        const nearest = tripData.reduce((prev, curr) => {
                                            return Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev;
                                        });
                                        setTripTooltip({ x: nearest.x, y: nearest.y, time: nearest.time, value: nearest.sessions });
                                    }}
                                    onMouseLeave={() => setTripTooltip(null)}
                                >
                                    <defs>
                                        <linearGradient id="tripSessionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05" />
                                        </linearGradient>
                                    </defs>

                                    {/* Solid horizontal grid lines */}
                                    <line x1="0" y1="40" x2="360" y2="40" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />
                                    <line x1="0" y1="80" x2="360" y2="80" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />
                                    <line x1="0" y1="120" x2="360" y2="120" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />
                                    <line x1="0" y1="160" x2="360" y2="160" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />

                                    {/* Vertical lines at x=90, 180, 270, 360 */}
                                    <line x1="90" y1="0" x2="90" y2="200" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />
                                    <line x1="180" y1="0" x2="180" y2="200" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />
                                    <line x1="270" y1="0" x2="270" y2="200" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />
                                    <line x1="360" y1="0" x2="360" y2="200" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />

                                    {/* Gradient fill area */}
                                    <polygon
                                        fill="url(#tripSessionGradient)"
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
                                        stroke="#8B5CF6"
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
                                            stroke="#8B5CF6"
                                            strokeWidth="1"
                                            strokeDasharray="4 2"
                                            opacity="0.5"
                                        />
                                    )}

                                    {/* Hover point */}
                                    {tripTooltip && (
                                        <>
                                            <circle cx={tripTooltip.x} cy={tripTooltip.y} r="4" fill="white" stroke="#8B5CF6" strokeWidth="2" />
                                            <circle cx={tripTooltip.x} cy={tripTooltip.y} r="8" fill="#8B5CF6" fillOpacity="0.2" />
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
                                            <div className="text-xs font-semibold text-purple-500">{tripTooltip.time}</div>
                                            <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {tripTooltip.value} trips
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-2 pl-8">
                                <span>10:00:00</span><span>10:00:25</span><span>10:00:50</span><span>10:01:15</span><span>10:01:40</span><span>10:02:05</span>
                            </div>
                        </div>
                    </div>

                    {/* Activity List */}
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Recent Activity</h3>
                            <button className="text-xs text-blue-500 font-semibold hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                            {alerts.slice(0, 4).map((alert, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 px-2 rounded-lg transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-full ${alert.severity === 'critical' ? 'bg-red-100 text-red-600' :
                                                alert.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-blue-100 text-blue-600'
                                            }`}>
                                            {alert.severity === 'critical' ? <AlertTriangle size={16} /> : <Activity size={16} />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{alert.message}</p>
                                            <p className="text-xs text-gray-500">{alert.vehicle}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`px-2 py-1 text-xs rounded-full ${alert.status === 'active' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {alert.status}
                                        </span>
                                        <span className="text-xs text-gray-400 ml-3">{alert.timestamp}</span>
                                    </div>
                                </div>
                            ))}
                            {alerts.length === 0 && (
                                <div className="text-center text-gray-500 py-4">No recent activity</div>
                            )}
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
