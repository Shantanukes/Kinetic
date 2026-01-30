# Support & Connect - Role-Based Access Control

## Overview
The Support & Connect system now has three distinct access levels based on user roles.

---

## Access Levels

### 1️⃣ **End Users / Customers**
**Roles:** USER, DEALER, FLEET (non-OEM, non-admin roles)

**What they can do:**
- ✅ Submit new complaints with:
  - Customer Name
  - License Plate Number
  - VIN Number
  - Complaint About (brief title)
  - Complaint Details (full description)
- ✅ View contact information (Phone, Email, Live Chat)
- ✅ Receive success confirmation after submission

**What they CANNOT do:**
- ❌ View other customers' complaints
- ❌ View complaint list or dashboard
- ❌ Search or filter complaints
- ❌ Respond to complaints
- ❌ See complaint status or priority

**Interface:** Simple complaint submission form

---

### 2️⃣ **OEM / Plant Users (Read-Only)**
**Roles:** OEM

**What they can do:**
- ✅ View ALL customer complaints
- ✅ See complete complaint details:
  - Customer Name
  - License Plate Number
  - VIN Number
  - Complaint About
  - Complaint Details
  - Status (Open, In Progress, Resolved, Closed)
  - Priority (Low, Medium, High, Critical)
- ✅ View dashboard statistics (Total, Open, In Progress, Resolved)
- ✅ Search complaints by name, license plate, or VIN
- ✅ Filter complaints by status
- ✅ View team responses to complaints

**What they CANNOT do:**
- ❌ Submit new complaints
- ❌ Respond to customer complaints
- ❌ Change complaint status or priority
- ❌ Assign complaints to teams

**Interface:** Read-only monitoring panel with "Monitoring Panel" header

---

### 3️⃣ **Admin / Service / RND (Full Access)**
**Roles:** SUPER_ADMIN, RND, SERVICE

**What they can do:**
- ✅ View ALL customer complaints
- ✅ See complete complaint details (same as OEM)
- ✅ View dashboard statistics
- ✅ Search and filter complaints
- ✅ **Respond to customer complaints**
- ✅ View all team responses
- ✅ Manage complaint workflow

**Interface:** Full admin panel with "Admin Panel" header and response capabilities

---

## Key Differences Summary

| Feature | End Users | OEM (Plant) | Admin/Service/RND |
|---------|-----------|-------------|-------------------|
| Submit Complaints | ✅ | ❌ | ❌ |
| View All Complaints | ❌ | ✅ | ✅ |
| View Dashboard Stats | ❌ | ✅ | ✅ |
| Search/Filter | ❌ | ✅ | ✅ |
| View Responses | ❌ | ✅ | ✅ |
| **Send Responses** | ❌ | ❌ | ✅ |
| Change Status/Priority | ❌ | ❌ | ✅ |

---

## Implementation Details

### Permission Variables
```typescript
const canViewComplaints = userRole === 'SUPER_ADMIN' || userRole === 'RND' || userRole === 'SERVICE' || userRole === 'OEM';
const canRespond = userRole === 'SUPER_ADMIN' || userRole === 'RND' || userRole === 'SERVICE';
```

### Interface Selection Logic
1. **If `!canViewComplaints`** → Show customer complaint form
2. **If `canViewComplaints && !canRespond`** → Show read-only monitoring panel (OEM)
3. **If `canViewComplaints && canRespond`** → Show full admin panel with response capability

### Response Input Visibility
```tsx
{canRespond && selectedTicket.status !== 'closed' && (
  // Response input field and send button
)}
```

---

## User Experience

### For OEM Users:
- Header shows: **"Support & Connect - Monitoring Panel"**
- Subtitle: **"View customer complaints and support tickets (Read-Only)"**
- Can browse and search all complaints
- Can see all details and team responses
- **No response input field visible**
- Clean, professional monitoring interface

### For Admin/Service/RND Users:
- Header shows: **"Support & Connect - Admin Panel"**
- Subtitle: **"Manage customer complaints and support tickets"**
- Full complaint management capabilities
- **Response input field visible** for open tickets
- Can communicate directly with customers

### For End Users:
- Header shows: **"Customer Support"**
- Subtitle: **"Submit your complaint and we'll get back to you soon"**
- Simple 5-field form
- Contact options for alternative support channels
- Success confirmation after submission

---

## Workflow

1. **Customer** submits complaint via simple form
2. **OEM** can monitor all incoming complaints (read-only)
3. **Admin/Service/RND** can view complaints and respond
4. Customer receives responses from support team
5. OEM can track resolution progress

This ensures proper information flow while maintaining appropriate access controls! 🎯
