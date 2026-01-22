// BMS Telemetry Dashboard

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface BmsDataProps {
  darkMode: boolean;
  vehicleInsights: any[];
}

type BmsPoint = {
  ts: number;
  temperature: number;
  performance: number;
  torque: number;
  power: number;
  rangeLeft: number;
  idleTime: number;
  speed: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const formatTime = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const chartTheme = (darkMode: boolean) => ({
  grid: darkMode ? 'rgba(148,163,184,0.2)' : 'rgba(15,23,42,0.1)',
  axis: darkMode ? '#94a3b8' : '#64748b',
  area: '#22c55e'
});

const BmsData: React.FC<BmsDataProps> = ({ darkMode, vehicleInsights }) => {
  const stepSeconds = 8;
  const maxPoints = 60;
  const tickRef = useRef(0);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleInsights[0]);

  useEffect(() => {
    if (vehicleInsights.length > 0 && (!selectedVehicle || !vehicleInsights.find(v => v.id === selectedVehicle.id))) {
      setSelectedVehicle(vehicleInsights[0]);
    }
  }, [vehicleInsights, selectedVehicle]);

  const baseSpeed = clamp(selectedVehicle?.avgSpeed ?? 30, 15, 60);
  const batteryHealth = clamp(selectedVehicle?.batteryHealth ?? 92, 70, 100);
  const efficiency = clamp(selectedVehicle?.fuelEfficiency ?? 92, 85, 100);
  const utilization = clamp(selectedVehicle?.utilizationRate ?? 80, 50, 100) / 100;

  const buildInitial = () => {
    const now = Date.now();
    const series: BmsPoint[] = [];
    let speed = clamp(baseSpeed * 0.6, 8, 45);
    let temperature = 30 + (1 - batteryHealth / 100) * 10;
    let performance = clamp(batteryHealth - (100 - efficiency) * 0.2, 60, 100);
    let torque = 50 + utilization * 40;
    let power = 10 + utilization * 15;
    let rangeLeft = clamp(70 + efficiency * 0.2, 0, 100);
    let idleTime = 10;

    for (let i = maxPoints - 1; i >= 0; i -= 1) {
      const ts = now - i * stepSeconds * 1000;
      const phase = (maxPoints - i) % 90;
      const isDriving = phase < 60;
      const isIdle = phase >= 60 && phase < 75;

      const targetSpeed = isDriving ? baseSpeed + 16 * utilization + 16 * Math.sin((maxPoints - i) / 6) : 0;
      speed = clamp(speed + (targetSpeed - speed) * 0.2, 0, 120);

      const accel = clamp((speed - (series[series.length - 1]?.speed ?? speed)) / stepSeconds / 3.6, -3, 3);

      torque = clamp(40 + (speed / 120) * 140 + accel * 35, 0, 300);
      if (isIdle) torque = clamp(torque * 0.12, 0, 40);

      power = clamp(torque * 0.22 + accel * 12 - 8, -50, 80);
      if (isIdle) power = clamp(power * 0.25, -10, 25);

      temperature = clamp(temperature + (speed > 5 ? 0.18 : -0.08) + (power > 25 ? 0.12 : -0.05), 20, 65);

      performance = clamp(performance - 0.002 - (temperature - 35) * 0.0015, 60, 100);

      rangeLeft = clamp(rangeLeft - (speed > 5 ? 0.05 : 0.005) * (1 + (1 - efficiency / 100) * 0.4), 0, 100);

      idleTime = clamp(idleTime + (speed < 1 ? 0.8 : -0.15), 0, 100);

      series.push({
        ts,
        temperature,
        performance,
        torque,
        power,
        rangeLeft,
        idleTime,
        speed
      });
    }
    return series;
  };

  const [series, setSeries] = useState<BmsPoint[]>(() => buildInitial());

  useEffect(() => {
    setSeries(buildInitial());
  }, [baseSpeed, batteryHealth, efficiency, utilization]);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      setSeries(prev => {
        const last = prev[prev.length - 1];
        const ts = Date.now();
        const phase = tickRef.current % 90;
        const isDriving = phase < 60;
        const isIdle = phase >= 60 && phase < 75;

        const targetSpeed = isDriving ? baseSpeed + 16 * utilization + 18 * Math.sin(tickRef.current / 6) : 0;
        const speed = clamp(last.speed + (targetSpeed - last.speed) * 0.2, 0, 120);

        const accel = clamp((speed - last.speed) / stepSeconds / 3.6, -3, 3);

        let torque = clamp(40 + (speed / 120) * 150 + accel * 35, 0, 300);
        if (isIdle) torque = clamp(torque * 0.12, 0, 40);

        let power = clamp(torque * 0.22 + accel * 12 - 8, -50, 80);
        if (isIdle) power = clamp(power * 0.25, -10, 25);

        const temperature = clamp(last.temperature + (speed > 5 ? 0.16 : -0.08) + (power > 25 ? 0.1 : -0.05), 20, 65);

        const performance = clamp(last.performance - 0.002 - (temperature - 35) * 0.0015, 60, 100);

        const rangeLeft = clamp(last.rangeLeft - (speed > 5 ? 0.05 : 0.005) * (1 + (1 - efficiency / 100) * 0.4), 0, 100);

        const idleTime = clamp(last.idleTime + (speed < 1 ? 0.8 : -0.15), 0, 100);

        const nextPoint: BmsPoint = {
          ts,
          temperature,
          performance,
          torque,
          power,
          rangeLeft,
          idleTime,
          speed
        };

        return [...prev.slice(1), nextPoint];
      });
    }, stepSeconds * 1000);

    return () => clearInterval(interval);
  }, [baseSpeed, utilization, efficiency, stepSeconds]);

  const commonChartProps = useMemo(() => {
    const theme = chartTheme(darkMode);
    return {
      gridStroke: theme.grid,
      axisStroke: theme.axis,
      areaColor: theme.area
    };
  }, [darkMode]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: number }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        className={`rounded-lg border px-3 py-2 text-xs ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}
      >
        <div className="font-semibold mb-1">{formatTime(label as number)}</div>
        {payload.map((p, idx) => (
          <div key={idx} className={`font-semibold ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
            {p.name}: {p.value}
          </div>
        ))}
      </div>
    );
  };

  const renderArea = (
    title: string,
    dataKey: keyof BmsPoint,
    unit: string,
    min: number,
    max: number
  ) => (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900/60' : 'bg-white shadow-sm'}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Real-time telemetry</p>
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Range: {min}–{max} {unit}
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 6, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={commonChartProps.gridStroke} strokeDasharray="4 4" />
            <XAxis
              dataKey="ts"
              tickFormatter={formatTime}
              stroke={commonChartProps.axisStroke}
              tick={{ fontSize: 11 }}
              minTickGap={24}
            />
            <YAxis
              domain={[min, max]}
              stroke={commonChartProps.axisStroke}
              tick={{ fontSize: 11 }}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              name={`${title} (${unit})`}
              stroke={commonChartProps.areaColor}
              fill={commonChartProps.areaColor}
              fillOpacity={0.18}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <main className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>BMS Telemetry</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Battery Management System telemetry dashboard
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-emerald-900/30 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
          <div className={`text-xs ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>Update Interval</div>
          <div className={`text-lg font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{stepSeconds}s</div>
        </div>
      </div>

      {vehicleInsights.length > 0 && (
        <div className={`${darkMode ? 'bg-gray-900/60' : 'bg-white shadow-sm'} rounded-xl p-4`}>
          <div className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Vehicle Selection</div>
          <div className="flex gap-3 overflow-x-auto">
            {vehicleInsights.map(vehicle => (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => setSelectedVehicle(vehicle)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg border transition ${
                  selectedVehicle?.id === vehicle.id
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : darkMode
                    ? 'border-gray-700 bg-gray-800/60 hover:bg-gray-800'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`text-left ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <div className="font-semibold">{vehicle.vehicle}</div>
                  <div className="text-xs text-gray-500">{vehicle.licensePlate}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderArea('Battery Temperature', 'temperature', '°C', 20, 65)}
        {renderArea('Battery Performance', 'performance', '%', 60, 100)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderArea('Battery Torque', 'torque', 'Nm', 0, 300)}
        {renderArea('Battery Power', 'power', 'kW', -50, 80)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderArea('Range Left on Battery', 'rangeLeft', '%', 0, 100)}
        {renderArea('Idle Time', 'idleTime', '%', 0, 100)}
      </div>
    </main>
  );
};

export default BmsData;
