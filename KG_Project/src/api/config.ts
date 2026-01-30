/**
 * API Configuration
 * Central configuration for all API endpoints and settings
 */

// API Base URL - Change this based on environment
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// API Version
export const API_VERSION = 'v1';

// Full API URL
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_TOKEN: '/auth/verify',
  },

  // Users & Team Management
  USERS: {
    BASE: '/users',
    BY_ID: (id: string | number) => `/users/${id}`,
    BY_ROLE: (role: string) => `/users?role=${role}`,
  },

  TEAM: {
    BASE: '/team-members',
    BY_ID: (id: string | number) => `/team-members/${id}`,
  },

  // Vehicles
  VEHICLES: {
    BASE: '/vehicles',
    BY_ID: (id: string | number) => `/vehicles/${id}`,
    TELEMETRY: (id: string | number) => `/vehicles/${id}/telemetry`,
    TRIPS: (id: string | number) => `/vehicles/${id}/trips`,
    ALERTS: (id: string | number) => `/vehicles/${id}/alerts`,
    BY_DEALER: (dealerId: string | number) => `/vehicles?dealerId=${dealerId}`,
    BY_FLEET: (fleetId: string | number) => `/vehicles?fleetId=${fleetId}`,
  },

  // Telemetry
  TELEMETRY: {
    LIVE: '/telemetry/live',
    BMS: (vehicleId: string | number) => `/telemetry/bms/${vehicleId}`,
    VCU: (vehicleId: string | number) => `/telemetry/vcu/${vehicleId}`,
    MCU: (vehicleId: string | number) => `/telemetry/mcu/${vehicleId}`,
    HISTORY: (vehicleId: string | number) => `/telemetry/history/${vehicleId}`,
    MOTOR_PERFORMANCE: (vehicleId: string | number) => `/telemetry/motor/${vehicleId}`,
  },

  // Dealers
  DEALERS: {
    BASE: '/dealers',
    BY_ID: (id: string | number) => `/dealers/${id}`,
    VEHICLES: (id: string | number) => `/dealers/${id}/vehicles`,
    STATS: (id: string | number) => `/dealers/${id}/stats`,
  },

  // Fleet
  FLEET: {
    OVERVIEW: '/fleet/overview',
    VEHICLES: '/fleet/vehicles',
    ALERTS: '/fleet/alerts',
    PERFORMANCE: '/fleet/performance',
    STATS: '/fleet/stats',
  },

  // Reports
  REPORTS: {
    VEHICLE: (id: string | number) => `/reports/vehicle/${id}`,
    FLEET: '/reports/fleet',
    DEALER: (id: string | number) => `/reports/dealer/${id}`,
    ANALYTICS: '/reports/analytics',
    GENERATE: '/reports/generate',
    DOWNLOAD: (id: string | number) => `/reports/download/${id}`,
  },

  // FOTA (Firmware Over The Air)
  FOTA: {
    UPDATES: '/fota/updates',
    DEPLOY: '/fota/deploy',
    STATUS: (id: string | number) => `/fota/status/${id}`,
    HISTORY: '/fota/history',
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ALERTS: '/dashboard/alerts/recent',
    RECENT_TRIPS: '/dashboard/trips/recent',
  },

  // Settings
  SETTINGS: {
    ORGANIZATION: '/settings/organization',
    BILLING: '/settings/billing',
    NOTIFICATIONS: '/settings/notifications',
  },
};

// Request timeout (in milliseconds)
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Token storage keys
export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

// API Response Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};
