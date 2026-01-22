// Recent Trips Component

import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { Trip } from '../types';

interface RecentTripsProps {
  trips: Trip[];
  darkMode: boolean;
}

const RecentTrips: React.FC<RecentTripsProps> = ({ trips, darkMode }) => {
  return (
    <div className={`glass rounded-xl shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Trips</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All →</button>
      </div>
      <div className="space-y-4">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg border ${
              darkMode ? 'border-gray-600' : 'border-gray-200'
            } hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{trip.vehicle}</h4>
                <p className="text-sm text-gray-500">{trip.driver}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {trip.duration}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{trip.startLocation}</p>
                  <div className="h-4 w-px bg-gray-300 ml-1.5 my-1"></div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{trip.endLocation}</p>
                </div>
                <div className="flex items-center space-x-4 text-right">
                  <div>
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {trip.distance}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cost</p>
                    <p className={`text-sm font-semibold text-green-600`}>{trip.cost}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <span className="text-xs text-gray-500">{trip.startTime} - {trip.endTime}</span>
              <div className="flex items-center">
                <div className={`text-xs px-2 py-1 rounded-full ${
                  trip.efficiency > 92 ? 'bg-green-100 text-green-700' :
                  trip.efficiency > 85 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {trip.efficiency}% Efficiency
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTrips;
