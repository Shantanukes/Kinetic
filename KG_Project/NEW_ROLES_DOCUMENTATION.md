# New User Roles Documentation

## Overview
Two new user roles have been added to the Kinetic Green EV Dashboard application:
1. **SALES** - Sales Team Members
2. **FLEET_DRIVER** - Fleet Vehicle Drivers

---

## 1. SALES Role (Sales Team)

### Purpose
The SALES role is designed for sales team members who need access to vehicle inventory, dealer management, and customer-facing features to support sales operations.

### Access Permissions

#### ✅ **Full Access:**
- **Dashboard** - View overall statistics and metrics
- **Add Vehicle** - Register new vehicles for dealers and customers
- **Dealer Management** - Manage dealer profiles and inventory
- **Vehicle Insights** - View vehicle performance and analytics
- **Fault Analysis** - Monitor vehicle health and issues
- **Reports** - Generate sales and performance reports
- **Support & Connect** - Submit and track customer complaints

#### ❌ **No Access:**
- Live Tracking
- Device Management
- ECUs (MCU/VCU/BMS/Heat Maps)
- FOTA Updates
- Configure
- Enterprise Settings

### Data Visibility
- **Vehicles**: All vehicles across all dealers
- **Dealers**: All dealer information
- **Reports**: Sales-focused reports and analytics

### Use Cases
1. **Vehicle Registration**: Add new vehicles to dealer inventory
2. **Dealer Coordination**: Manage dealer relationships and inventory
3. **Sales Reporting**: Generate reports on sales performance
4. **Customer Support**: Handle customer inquiries and complaints
5. **Inventory Management**: Track vehicle availability across dealers

### Demo Credentials
```
Username: sales_user
Password: sales123
```

---

## 2. FLEET_DRIVER Role (Fleet Vehicle Drivers)

### Purpose
The FLEET_DRIVER role is designed for drivers who operate fleet vehicles and need access to basic vehicle information, tracking, and reporting features.

### Access Permissions

#### ✅ **Full Access:**
- **Dashboard** - View assigned vehicle statistics
- **Live Tracking** - Track their assigned vehicle(s) location
- **Vehicle Insights** - View performance of assigned vehicle(s)
- **Fault Analysis** - Monitor vehicle health and report issues
- **Support & Connect** - Submit complaints and maintenance requests

#### ❌ **No Access:**
- Add Vehicle
- Dealer Management
- Reports
- Device Management
- ECUs (MCU/VCU/BMS/Heat Maps)
- FOTA Updates
- Configure
- Enterprise Settings

### Data Visibility
- **Vehicles**: Only the vehicle(s) assigned to them as a driver
- **Tracking**: Real-time location of their assigned vehicle(s)
- **Insights**: Performance metrics for their assigned vehicle(s)

### Use Cases
1. **Vehicle Monitoring**: Check battery level, health status
2. **Location Tracking**: View current location and route history
3. **Issue Reporting**: Report faults and maintenance needs
4. **Performance Tracking**: Monitor driving efficiency and metrics
5. **Support Requests**: Submit maintenance or support tickets

### Demo Credentials
```
Username: driver_user
Password: driver123
```

---

## Implementation Details

### Type Definition (types.ts)
```typescript
export type UserRole = 'SUPER_ADMIN' | 'OEM' | 'RND' | 'DEALER' | 'SERVICE' | 'FLEET' | 'SALES' | 'FLEET_DRIVER' | 'USER';
```

### Menu Items Configuration (constants.ts)

#### SALES Role Access:
```typescript
Dashboard: ['SALES']
Add Vehicle: ['SALES']
Dealer Management: ['SALES']
Vehicle Insights: ['SALES']
Fault Analysis: ['SALES']
Reports: ['SALES']
Support & Connect: ['SALES']
```

#### FLEET_DRIVER Role Access:
```typescript
Dashboard: ['FLEET_DRIVER']
Live Tracking: ['FLEET_DRIVER']
Vehicle Insights: ['FLEET_DRIVER']
Fault Analysis: ['FLEET_DRIVER']
Support & Connect: ['FLEET_DRIVER']
```

---

## Role Comparison Matrix

| Feature | SALES | FLEET_DRIVER | DEALER | FLEET | USER |
|---------|:-----:|:------------:|:------:|:-----:|:----:|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add Vehicle | ✅ | ❌ | ✅ | ❌ | ❌ |
| Dealer Management | ✅ | ❌ | 🔸 | ❌ | ❌ |
| Live Tracking | ❌ | ✅ | ❌ | ✅ | ✅ |
| Vehicle Insights | ✅ | ✅ | ✅ | ✅ | ✅ |
| Fault Analysis | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reports | ✅ | ❌ | ✅ | ✅ | ✅ |
| Support & Connect | ✅ | ✅ | ✅ | ✅ | ✅ |

**Legend:**
- ✅ Full Access
- 🔸 Limited Access (Own data only)
- ❌ No Access

---

## User Journey Examples

### SALES Team Member Journey:
1. **Login** → Sales Dashboard
2. **View Inventory** → Check available vehicles across dealers
3. **Add Vehicle** → Register new vehicle for dealer
4. **Dealer Management** → Update dealer information
5. **Generate Reports** → Create sales performance reports
6. **Customer Support** → Handle customer inquiries

### Fleet Driver Journey:
1. **Login** → Driver Dashboard
2. **Check Vehicle** → View assigned vehicle status
3. **Live Tracking** → See current location and route
4. **Monitor Performance** → Check battery, efficiency
5. **Report Issue** → Submit fault or maintenance request
6. **View History** → Check trip history and performance

---

## Data Filtering Logic

### SALES Role:
```javascript
// SALES users see all vehicles and dealers
const filteredVehicles = allVehicles; // No filtering
const filteredDealers = allDealers;   // No filtering
```

### FLEET_DRIVER Role:
```javascript
// FLEET_DRIVER users see only their assigned vehicles
const filteredVehicles = allVehicles.filter(
  vehicle => vehicle.driver === currentUser.name
);
```

---

## Security Considerations

### SALES Role:
- Can view all dealer and vehicle data
- Cannot access technical/telemetry data (ECUs)
- Cannot modify system settings
- Cannot perform firmware updates
- Audit logs should track all vehicle additions

### FLEET_DRIVER Role:
- Strictly limited to assigned vehicle(s)
- Cannot view other drivers' vehicles
- Cannot modify vehicle settings
- Cannot access administrative features
- Location tracking should respect privacy policies

---

## Testing Checklist

### SALES Role Testing:
- [ ] Can login with sales credentials
- [ ] Dashboard shows all vehicles
- [ ] Can add new vehicles
- [ ] Can access dealer management
- [ ] Can generate reports
- [ ] Cannot access live tracking
- [ ] Cannot access ECU data
- [ ] Cannot access FOTA updates

### FLEET_DRIVER Role Testing:
- [ ] Can login with driver credentials
- [ ] Dashboard shows only assigned vehicle(s)
- [ ] Can view live tracking of assigned vehicle
- [ ] Can view vehicle insights (filtered)
- [ ] Can submit support requests
- [ ] Cannot add vehicles
- [ ] Cannot access dealer management
- [ ] Cannot generate reports
- [ ] Cannot access ECU data

---

## Migration Notes

### Existing Users:
- No impact on existing user roles
- Existing role permissions remain unchanged
- New roles are additive only

### Database Updates Required:
1. Update user role enum to include 'SALES' and 'FLEET_DRIVER'
2. Add demo users for testing:
   - sales_user (SALES role)
   - driver_user (FLEET_DRIVER role)
3. Update role-based access control middleware
4. Update audit logging to track new roles

### API Updates Required:
1. Update authentication endpoints to support new roles
2. Update authorization middleware for new permissions
3. Add data filtering for FLEET_DRIVER role
4. Update role validation in all endpoints

---

## Future Enhancements

### SALES Role:
- Sales pipeline management
- Lead tracking
- Commission calculations
- Customer relationship management (CRM) integration
- Sales forecasting and analytics

### FLEET_DRIVER Role:
- Driver performance scoring
- Route optimization suggestions
- Fuel/energy efficiency tips
- Gamification features (badges, achievements)
- Driver training modules
- Mobile app for drivers

---

## Support and Documentation

For questions or issues related to the new roles:
1. Check this documentation
2. Review the flowchart (FLOWCHART.md)
3. Contact the development team
4. Submit a support ticket

---

**Last Updated:** January 29, 2026  
**Version:** 1.0.0  
**Author:** Kinetic Green Development Team
