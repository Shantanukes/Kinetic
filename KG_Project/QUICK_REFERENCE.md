# 🎯 Quick Reference Card - New Demo Accounts

## SALES Role 🟠

### Login Credentials:
```
Username: sales
Password: sales123
```

### What You Can Do:
✅ View Dashboard (all vehicles)  
✅ Add New Vehicles  
✅ Manage Dealers  
✅ View Vehicle Insights  
✅ Analyze Faults  
✅ Generate Reports  
✅ Handle Customer Support  

### What You Cannot Do:
❌ Live Vehicle Tracking  
❌ Access ECU Data  
❌ Firmware Updates  
❌ System Configuration  

---

## FLEET_DRIVER Role 🟡

### Login Credentials:
```
Username: driver
Password: driver123
Assigned Vehicle: V000001
```

### What You Can Do:
✅ View Dashboard (assigned vehicle only)  
✅ Track Your Vehicle Live  
✅ View Your Vehicle Insights  
✅ Monitor Your Vehicle Faults  
✅ Submit Maintenance Requests  

### What You Cannot Do:
❌ See Other Vehicles  
❌ Add Vehicles  
❌ Manage Dealers  
❌ Generate Reports  
❌ Access ECU Data  
❌ System Configuration  

---

## All Demo Accounts Summary

| Role | Username | Password | Color |
|------|----------|----------|-------|
| Super Admin | `admin` | `admin123` | 🔴 Red |
| OEM | `oem_user` | `oem123` | 🔵 Blue |
| R&D | `research` | `rnd123` | 🟣 Purple |
| **Sales** | `sales` | `sales123` | 🟠 Orange |
| **Fleet Driver** | `driver` | `driver123` | 🟡 Yellow |
| Dealer | `dealer1` | `dealer123` | 🟢 Green |
| Service | `service` | `service123` | 🔵 Cyan |
| Fleet Manager | `fleet` | `fleet123` | 🟣 Violet |
| End User | `user` | `user123` | ⚪ White |

---

## Quick Test Steps

### Test SALES:
1. Login: `sales / sales123`
2. Go to: Add Vehicle ✅
3. Go to: Dealer Management ✅
4. Go to: Live Tracking ❌ (Should be blocked)

### Test FLEET_DRIVER:
1. Login: `driver / driver123`
2. Go to: Live Tracking ✅ (Only V000001 visible)
3. Go to: Vehicle Insights ✅ (Only V000001 data)
4. Go to: Add Vehicle ❌ (Menu hidden)

---

**Print this card for quick reference during demos!**
