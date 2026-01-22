// MCU Data Component with Telemetry Dashboard

import React, { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface McuDataProps {
  darkMode: boolean;
  vehicleInsights: any[];
}

type TelemetryPoint = {
  ts: number;
  speed: number;
  accel: number;
  temp: number;
  torque: number;
  power: number;
  controllerTemp: number;
  rpm: number;
  motorVoltage: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const formatTime = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const buildInitialSeries = (
  points: number,
  stepSeconds: number,
  baseSpeed: number,
  utilization: number,
  healthFactor: number
) => {
  const now = Date.now();
  const series: TelemetryPoint[] = [];
  let speed = clamp(baseSpeed * 0.6, 10, 50);
  let temp = 35 + (1 - healthFactor) * 6;
  let controllerTemp = 30 + (1 - healthFactor) * 4;
  let torque = 70 + healthFactor * 20;
  let power = 25 + utilization * 10;
  for (let i = points - 1; i >= 0; i -= 1) {
    const ts = now - i * stepSeconds * 1000;
    const target = baseSpeed + 18 * utilization + 18 * Math.sin((points - i) / 6) + 10 * Math.sin((points - i) / 14);
    speed = clamp(speed + (target - speed) * 0.18, 0, 120);
    const rpm = clamp(speed * 65, 0, 8000); // Approx RPM based on speed
    const accel = clamp((speed - (series[series.length - 1]?.speed ?? speed)) / stepSeconds / 3.6, -3, 3);
    const load = clamp(accel / 3, 0, 1);
    torque = clamp(60 + load * 150 + (speed / 120) * 35 + healthFactor * 20, 0, 250);
    temp = clamp(temp + load * 1.0 - 0.2 + (speed / 120) * 0.12 + (1 - healthFactor) * 0.15, 25, 90);
    controllerTemp = clamp(controllerTemp + load * 0.8 - 0.15 + (speed / 120) * 0.1 + (1 - healthFactor) * 0.1, 25, 85);
    const motorVoltage = clamp(72 - load * 5 + (speed / 120) * 2, 60, 84); // Voltage sag under load
    power = clamp((torque / 250) * 85 + (speed / 120) * 15, 0, 100);
    series.push({ ts, speed, accel, temp, torque, power, controllerTemp, rpm, motorVoltage });
  }
  return series;
};

const chartTheme = (darkMode: boolean) => ({
  grid: darkMode ? 'rgba(148,163,184,0.2)' : 'rgba(15,23,42,0.1)',
  axis: darkMode ? '#94a3b8' : '#64748b',
  tooltipBg: darkMode ? '#0f172a' : '#ffffff',
  tooltipBorder: darkMode ? '#1f2937' : '#e2e8f0',
  area: '#22c55e'
});

const McuData: React.FC<McuDataProps> = ({ darkMode, vehicleInsights }) => {
  const stepSeconds = 7;
  const maxPoints = 60;
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleInsights[0]);

  useEffect(() => {
    if (vehicleInsights.length > 0 && (!selectedVehicle || !vehicleInsights.find(v => v.id === selectedVehicle.id))) {
      setSelectedVehicle(vehicleInsights[0]);
    }
  }, [vehicleInsights, selectedVehicle]);

  const baseSpeed = clamp(selectedVehicle?.avgSpeed ?? 30, 15, 60);
  const utilization = clamp(selectedVehicle?.utilizationRate ?? 80, 50, 100) / 100;
  const healthFactor = clamp(selectedVehicle?.batteryHealth ?? 90, 70, 100) / 100;

  const [series, setSeries] = useState<TelemetryPoint[]>(() =>
    buildInitialSeries(maxPoints, stepSeconds, baseSpeed, utilization, healthFactor, selectedVehicle.id)
  );

  useEffect(() => {
    setSeries(buildInitialSeries(maxPoints, stepSeconds, baseSpeed, utilization, healthFactor, selectedVehicle.id));
  }, [baseSpeed, utilization, healthFactor, maxPoints, stepSeconds, selectedVehicle.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeries(prev => {
        const last = prev[prev.length - 1];
        const ts = Date.now();
        const target = baseSpeed + 18 * utilization + 20 * Math.sin(ts / 60000) + 10 * Math.sin(ts / 13000);
        const nextSpeed = clamp(last.speed + (target - last.speed) * 0.22, 0, 120);
        const rpm = clamp(nextSpeed * 65, 0, 8000);
        const accel = clamp((nextSpeed - last.speed) / stepSeconds / 3.6, -3, 3);
        const load = clamp(accel / 3, 0, 1);
        const torque = clamp(60 + load * 160 + (nextSpeed / 120) * 30 + healthFactor * 20, 0, 250);
        const temp = clamp(last.temp + load * 0.8 - 0.18 + (nextSpeed / 120) * 0.12 + (1 - healthFactor) * 0.08, 25, 90);
        const controllerTemp = clamp(last.controllerTemp + load * 0.7 - 0.12 + (nextSpeed / 120) * 0.1 + (1 - healthFactor) * 0.08, 25, 85);
        const motorVoltage = clamp(72 - load * 5 + (nextSpeed / 120) * 2, 60, 84);
        const power = clamp((torque / 250) * 85 + (nextSpeed / 120) * 15, 0, 100);
        const nextPoint: TelemetryPoint = {
          ts,
          speed: nextSpeed,
          accel,
          temp,
          torque,
          power,
          controllerTemp,
          rpm,
          motorVoltage
        };
        const updated = [...prev.slice(1), nextPoint];
        return updated;
      });
    }, stepSeconds * 1000);
    return () => clearInterval(interval);
  }, [baseSpeed, utilization, healthFactor, stepSeconds]);

  const commonChartProps = useMemo(() => {
    const theme = chartTheme(darkMode);
    return {
      gridStroke: theme.grid,
      axisStroke: theme.axis,
      areaColor: theme.area,
      tooltipBg: theme.tooltipBg,
      tooltipBorder: theme.tooltipBorder
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
    dataKey: keyof TelemetryPoint,
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
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>MCU Telemetry</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Vehicle MCU dashboard with smooth, time-based telemetry
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

      {renderArea('Vehicle Speed', 'speed', 'km/h', 0, 120)}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderArea('Acceleration', 'accel', 'm/s²', -3, 3)}
        {renderArea('Motor Temperature', 'temp', '°C', 25, 90)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderArea('Controller Temperature', 'controllerTemp', '°C', 25, 85)}
        {renderArea('Motor RPM', 'rpm', 'RPM', 0, 8000)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderArea('Motor Voltage', 'motorVoltage', 'V', 50, 90)}
        {renderArea('Torque', 'torque', 'Nm', 0, 250)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderArea('Power Generation', 'power', '%', 0, 100)}
      </div>
    </main>
  );
};

export default McuData;
