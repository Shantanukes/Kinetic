# Backend API Integration Architecture

## Overview
This document outlines the complete API integration strategy for the Kinetic Green EV Dashboard, following a **top-to-bottom approach** starting from Super Admin to End User.

---

## 🏗️ Architecture Principles

### 1. **Component-Based Structure**
- Each major feature is a separate, self-contained component
- Components handle their own API calls and state management
- Shared utilities for common API operations

### 2. **Centralized API Configuration**
- Single source of truth for API endpoints
- Environment-based configuration
- Consistent error handling

### 3. **Authentication & Authorization**
- JWT token-based authentication
- Role-based access control (RBAC)
- Automatic token refresh

---

## 📁 Project Structure

```
src/
├── api/
│   ├── config.ts              # API base URL and configuration
│   ├── client.ts              # Axios instance with interceptors
│   ├── auth.ts                # Authentication API calls
│   ├── users.ts               # User management APIs
│   ├── vehicles.ts            # Vehicle management APIs
│   ├── telemetry.ts           # Telemetry data APIs
│   ├── dealers.ts             # Dealer management APIs
│   ├── fleet.ts               # Fleet management APIs
│   └── reports.ts             # Reports and analytics APIs
├── components/
│   ├── auth/
│   │   └── LoginPage.tsx      # ✅ Already exists
│   ├── admin/
│   │   ├── TeamMembers.tsx    # ✅ Already created
│   │   ├── UserManagement.tsx
│   │   ├── RoleManagement.tsx
│   │   └── SystemSettings.tsx
│   ├── dealer/
│   │   ├── DealerManagement.tsx  # ✅ Already exists
│   │   ├── DealerList.tsx
│   │   └── DealerDetails.tsx
│   ├── fleet/
│   │   ├── FleetOverview.tsx     # ✅ Already exists
│   │   ├── VehicleList.tsx
│   │   └── VehicleDetails.tsx
│   ├── telemetry/
│   │   ├── LiveTracking.tsx      # ✅ Already exists
│   │   ├── BmsData.tsx           # ✅ Already exists
│   │   ├── VcuData.tsx           # ✅ Already exists
│   │   └── McuData.tsx           # ✅ Already exists
│   └── shared/
│       ├── DataTable.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── useVehicles.ts
│   └── useTelemetry.ts
├── context/
│   ├── AuthContext.tsx
│   └── AppContext.tsx
├── types/
│   ├── api.ts                 # API response types
│   ├── auth.ts                # Authentication types
│   └── index.ts               # ✅ Already exists
└── utils/
    ├── apiHelpers.ts
    ├── errorHandler.ts
    └── tokenManager.ts
```

---

## 🔐 Authentication Flow

### Login Process
```typescript
1. User enters credentials → LoginPage
2. POST /api/auth/login
3. Receive JWT token + user info
4. Store token in localStorage/sessionStorage
5. Set user context
6. Redirect to dashboard based on role
```

### Token Management
```typescript
- Access Token: Short-lived (15 minutes)
- Refresh Token: Long-lived (7 days)
- Auto-refresh before expiration
- Logout on token expiration
```

---

## 👥 Role-Based Access Control (RBAC)

### Role Hierarchy (Top to Bottom)

#### 1. **SUPER_ADMIN** (Highest Access)
**Permissions:**
- Full system access
- User management (create, edit, delete all users)
- Team member management
- System configuration
- View all data across organization
- Billing and subscription management

**Components:**
- TeamMembers
- UserManagement
- EnterpriseSettings
- SystemSettings
- All other components (read-only or full access)

---

#### 2. **OEM** (Manufacturer Level)
**Permissions:**
- View all vehicles manufactured
- Access to R&D data
- Fleet analytics
- Dealer management
- FOTA updates
- Performance reports

**Components:**
- FleetOverview
- VehicleInsights
- DealerManagement
- FotaUpdates
- Reports

---

#### 3. **RND** (Research & Development)
**Permissions:**
- Access to telemetry data
- Performance analytics
- Fault analysis
- Motor performance data
- Test vehicle data

**Components:**
- BmsData
- VcuData
- McuData
- FaultAnalysis
- PerformanceChart
- HeatMaps

---

#### 4. **DEALER**
**Permissions:**
- Manage assigned vehicles
- Customer management
- Service scheduling
- Inventory management
- Sales reports

**Components:**
- DealerManagement (own dealership only)
- FleetOverview (filtered by dealership)
- AddVehicle
- Reports (dealership-specific)

---

#### 5. **SERVICE**
**Permissions:**
- View assigned vehicles
- Service history
- Fault diagnostics
- Maintenance scheduling
- Parts management

**Components:**
- LiveTracking (assigned vehicles)
- FaultAnalysis
- BmsData
- VcuData
- McuData

---

#### 6. **FLEET** (Fleet Manager)
**Permissions:**
- Manage fleet vehicles
- Driver management
- Route optimization
- Fuel/Energy efficiency
- Fleet reports

**Components:**
- FleetOverview
- LiveTracking
- VehicleInsights
- Reports
- HeatMaps

---

#### 7. **USER** (End User - Lowest Access)
**Permissions:**
- View own vehicle(s) only
- Basic telemetry data
- Trip history
- Charging status
- Service requests

**Components:**
- DashboardContent (filtered)
- LiveTracking (own vehicle)
- RecentTrips (own vehicle)
- Basic vehicle stats

---

## 🔌 API Endpoints Structure

### Authentication
```
POST   /api/auth/login           # User login
POST   /api/auth/logout          # User logout
POST   /api/auth/refresh         # Refresh access token
POST   /api/auth/forgot-password # Password reset request
POST   /api/auth/reset-password  # Reset password with token
```

### Users & Team Management
```
GET    /api/users                # List all users (SUPER_ADMIN)
GET    /api/users/:id            # Get user details
POST   /api/users                # Create new user
PUT    /api/users/:id            # Update user
DELETE /api/users/:id            # Delete user
GET    /api/team-members         # List team members
POST   /api/team-members         # Add team member
PUT    /api/team-members/:id     # Update team member
DELETE /api/team-members/:id     # Remove team member
```

### Vehicles
```
GET    /api/vehicles             # List vehicles (filtered by role)
GET    /api/vehicles/:id         # Get vehicle details
POST   /api/vehicles             # Add new vehicle
PUT    /api/vehicles/:id         # Update vehicle
DELETE /api/vehicles/:id         # Delete vehicle
GET    /api/vehicles/:id/telemetry  # Get vehicle telemetry
GET    /api/vehicles/:id/trips      # Get vehicle trips
```

### Telemetry
```
GET    /api/telemetry/live       # Real-time telemetry data
GET    /api/telemetry/bms/:vehicleId    # BMS data
GET    /api/telemetry/vcu/:vehicleId    # VCU data
GET    /api/telemetry/mcu/:vehicleId    # MCU data
GET    /api/telemetry/history/:vehicleId # Historical data
```

### Dealers
```
GET    /api/dealers              # List dealers
GET    /api/dealers/:id          # Get dealer details
POST   /api/dealers              # Create dealer
PUT    /api/dealers/:id          # Update dealer
DELETE /api/dealers/:id          # Delete dealer
GET    /api/dealers/:id/vehicles # Get dealer vehicles
```

### Fleet
```
GET    /api/fleet/overview       # Fleet overview stats
GET    /api/fleet/vehicles       # Fleet vehicles
GET    /api/fleet/alerts         # Fleet alerts
GET    /api/fleet/performance    # Fleet performance metrics
```

### Reports
```
GET    /api/reports/vehicle/:id  # Vehicle report
GET    /api/reports/fleet        # Fleet report
GET    /api/reports/dealer/:id   # Dealer report
GET    /api/reports/analytics    # Analytics report
POST   /api/reports/generate     # Generate custom report
```

### FOTA (Firmware Over The Air)
```
GET    /api/fota/updates         # List available updates
POST   /api/fota/deploy          # Deploy update
GET    /api/fota/status/:id      # Update status
```

---

## 🛠️ Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up API client with Axios
- [ ] Create authentication context
- [ ] Implement login API integration
- [ ] Set up token management
- [ ] Create error handling utilities

### Phase 2: Super Admin (Week 2)
- [ ] User management API integration
- [ ] Team members API integration
- [ ] Role management
- [ ] System settings
- [ ] Billing integration

### Phase 3: OEM & RND (Week 3)
- [ ] Vehicle management APIs
- [ ] Telemetry data APIs
- [ ] FOTA update APIs
- [ ] Analytics APIs

### Phase 4: Dealer & Service (Week 4)
- [ ] Dealer management APIs
- [ ] Service scheduling APIs
- [ ] Inventory management
- [ ] Customer management

### Phase 5: Fleet & User (Week 5)
- [ ] Fleet management APIs
- [ ] Live tracking APIs
- [ ] Trip history APIs
- [ ] User dashboard APIs

### Phase 6: Testing & Optimization (Week 6)
- [ ] Integration testing
- [ ] Performance optimization
- [ ] Error handling refinement
- [ ] Documentation

---

## 📝 Next Steps

1. **Review this architecture** with your backend team
2. **Confirm API endpoint structure** and naming conventions
3. **Set up development environment** variables
4. **Create API client utilities** (next file to create)
5. **Start with authentication** implementation
6. **Follow top-to-bottom approach** as outlined

---

## 🔗 Related Documents

- `TEAM_MEMBERS_API_GUIDE.md` - Team Members API integration guide
- `API_CLIENT_SETUP.md` - API client configuration (to be created)
- `AUTHENTICATION_GUIDE.md` - Authentication implementation (to be created)

---

**Last Updated:** 2026-01-28
**Version:** 1.0
**Status:** Ready for Implementation
