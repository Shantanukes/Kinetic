# API Integration Quick Start Guide

## ✅ What's Been Done

### 1. **Signup Form Removed**
- ✅ Removed signup functionality from LoginPage
- ✅ Simplified authentication flow
- ✅ Cleaned up unused imports and state

### 2. **API Infrastructure Created**
- ✅ `src/api/config.ts` - Centralized API configuration
- ✅ `src/api/client.ts` - Axios client with interceptors
- ✅ `src/api/auth.ts` - Authentication API functions
- ✅ Axios package installed

### 3. **Component Architecture**
- ✅ TeamMembers component ready for API integration
- ✅ All existing components identified and cataloged
- ✅ Component-based structure in place

### 4. **Documentation**
- ✅ `API_INTEGRATION_ARCHITECTURE.md` - Complete architecture guide
- ✅ `TEAM_MEMBERS_API_GUIDE.md` - Team members API guide
- ✅ This quick start guide

---

## 🚀 Next Steps - Implementation Order

### **Phase 1: Authentication (START HERE)**

#### Step 1.1: Update Main App to Use Auth API
**File:** `src/connected_auto_dashboard.tsx` or main app file

```typescript
import { login, logout, getCurrentUser, isAuthenticated } from './api/auth';

// In your handleLogin function:
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await login({
      username: loginForm.username,
      password: loginForm.password,
      rememberMe: loginForm.rememberMe,
    });
    
    // Set user state
    setCurrentUser(response.user);
    setIsLoggedIn(true);
    
    // Success notification
    console.log('Login successful:', response.user);
  } catch (error) {
    console.error('Login failed:', error);
    alert('Login failed. Please check your credentials.');
  } finally {
    setLoading(false);
  }
};

// In your handleLogout function:
const handleLogout = async () => {
  await logout();
  setIsLoggedIn(false);
  setCurrentUser(null);
};
```

#### Step 1.2: Create Environment Variables
**File:** `.env` (create in project root)

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_VERSION=v1
```

#### Step 1.3: Test Authentication
1. Run the app: `npm run dev`
2. Try logging in with test credentials
3. Check browser console for API logs
4. Verify tokens in localStorage

---

### **Phase 2: Super Admin - User Management**

#### Step 2.1: Create Users API Module
**File:** `src/api/users.ts`

```typescript
import { get, post, put, del } from './client';
import { API_ENDPOINTS } from './config';

export interface User {
  id: string | number;
  username: string;
  email: string;
  role: string;
  name: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export const getUsers = async (): Promise<User[]> => {
  // TODO: Uncomment when backend is ready
  // return get<User[]>(API_ENDPOINTS.USERS.BASE);
  
  // Mock data for now
  return [
    { id: 1, username: 'admin', email: 'admin@kinetic.com', role: 'SUPER_ADMIN', name: 'Admin User', status: 'Active', createdAt: '2024-01-01' },
  ];
};

export const getUserById = async (id: string | number): Promise<User> => {
  return get<User>(API_ENDPOINTS.USERS.BY_ID(id));
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  return post<User>(API_ENDPOINTS.USERS.BASE, userData);
};

export const updateUser = async (id: string | number, userData: Partial<User>): Promise<User> => {
  return put<User>(API_ENDPOINTS.USERS.BY_ID(id), userData);
};

export const deleteUser = async (id: string | number): Promise<void> => {
  return del(API_ENDPOINTS.USERS.BY_ID(id));
};
```

#### Step 2.2: Update TeamMembers Component
**File:** `src/components/TeamMembers.tsx`

In the `fetchTeamMembers` function, uncomment the API call:

```typescript
const fetchTeamMembers = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/api/team-members`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    const data = await response.json();
    setTeamMembers(data);
  } catch (error) {
    console.error('Error fetching team members:', error);
  } finally {
    setLoading(false);
  }
};
```

---

### **Phase 3: OEM - Vehicle Management**

#### Step 3.1: Create Vehicles API Module
**File:** `src/api/vehicles.ts`

```typescript
import { get, post, put, del } from './client';
import { API_ENDPOINTS } from './config';
import { Vehicle } from '../types';

export const getVehicles = async (): Promise<Vehicle[]> => {
  return get<Vehicle[]>(API_ENDPOINTS.VEHICLES.BASE);
};

export const getVehicleById = async (id: string | number): Promise<Vehicle> => {
  return get<Vehicle>(API_ENDPOINTS.VEHICLES.BY_ID(id));
};

export const createVehicle = async (vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
  return post<Vehicle>(API_ENDPOINTS.VEHICLES.BASE, vehicleData);
};

export const updateVehicle = async (id: string | number, vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
  return put<Vehicle>(API_ENDPOINTS.VEHICLES.BY_ID(id), vehicleData);
};

export const deleteVehicle = async (id: string | number): Promise<void> => {
  return del(API_ENDPOINTS.VEHICLES.BY_ID(id));
};
```

---

### **Phase 4: Telemetry Data**

#### Step 4.1: Create Telemetry API Module
**File:** `src/api/telemetry.ts`

```typescript
import { get } from './client';
import { API_ENDPOINTS } from './config';

export const getLiveTelemetry = async () => {
  return get(API_ENDPOINTS.TELEMETRY.LIVE);
};

export const getBmsData = async (vehicleId: string | number) => {
  return get(API_ENDPOINTS.TELEMETRY.BMS(vehicleId));
};

export const getVcuData = async (vehicleId: string | number) => {
  return get(API_ENDPOINTS.TELEMETRY.VCU(vehicleId));
};

export const getMcuData = async (vehicleId: string | number) => {
  return get(API_ENDPOINTS.TELEMETRY.MCU(vehicleId));
};
```

#### Step 4.2: Update BmsData Component
**File:** `src/components/BmsData.tsx`

```typescript
import { useEffect, useState } from 'react';
import { getBmsData } from '../api/telemetry';

// In your component:
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getBmsData(vehicleId);
      setBmsData(data);
    } catch (error) {
      console.error('Error fetching BMS data:', error);
    }
  };
  
  fetchData();
  const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
  
  return () => clearInterval(interval);
}, [vehicleId]);
```

---

## 📋 Implementation Checklist

### Authentication ✅
- [ ] Update main app to use auth API
- [ ] Create .env file with API URL
- [ ] Test login functionality
- [ ] Test logout functionality
- [ ] Verify token storage

### Super Admin
- [ ] Create users API module
- [ ] Update TeamMembers component
- [ ] Test user CRUD operations
- [ ] Add role management
- [ ] Add permissions handling

### OEM
- [ ] Create vehicles API module
- [ ] Update FleetOverview component
- [ ] Update VehicleInsights component
- [ ] Test vehicle CRUD operations

### RND
- [ ] Create telemetry API module
- [ ] Update BmsData component
- [ ] Update VcuData component
- [ ] Update McuData component
- [ ] Add real-time data streaming

### Dealer
- [ ] Create dealers API module
- [ ] Update DealerManagement component
- [ ] Add dealer-specific filtering
- [ ] Test dealer operations

### Service
- [ ] Add service scheduling API
- [ ] Update service components
- [ ] Add fault diagnostics

### Fleet
- [ ] Create fleet API module
- [ ] Update fleet components
- [ ] Add fleet analytics

### User
- [ ] Add user dashboard API
- [ ] Filter data by user
- [ ] Add trip history

---

## 🔧 Development Tips

### 1. **Use Mock Data First**
- All API modules have mock data
- Test UI before connecting to backend
- Gradually replace mocks with real API calls

### 2. **Error Handling**
- Always wrap API calls in try-catch
- Show user-friendly error messages
- Log errors for debugging

### 3. **Loading States**
- Add loading spinners during API calls
- Disable buttons while loading
- Provide feedback to users

### 4. **Testing**
- Test each API endpoint individually
- Use browser DevTools Network tab
- Check localStorage for tokens
- Verify API logs in console

---

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution:** Backend needs to enable CORS for your frontend URL

### Issue: 401 Unauthorized
**Solution:** Check if token is being sent in headers

### Issue: Token Expired
**Solution:** Refresh token automatically handled by interceptor

### Issue: Network Error
**Solution:** Verify API_BASE_URL in .env file

---

## 📞 Support

- Review `API_INTEGRATION_ARCHITECTURE.md` for detailed architecture
- Check `TEAM_MEMBERS_API_GUIDE.md` for team members example
- All API modules have TODO comments for backend integration

---

**Ready to Start?**
1. Begin with Phase 1 (Authentication)
2. Test thoroughly
3. Move to Phase 2 (Super Admin)
4. Continue top-to-bottom approach

**Last Updated:** 2026-01-28
**Status:** Ready for Implementation
