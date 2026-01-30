# Team Members API Integration Guide

This document explains how to integrate the Team Members component with your backend API.

## Component Location
`src/components/TeamMembers.tsx`

## API Endpoints Required

### 1. **GET /api/team-members**
Fetch all team members for the organization.

**Headers:**
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_TOKEN_HERE'
}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Admin User",
    "email": "admin@kinetic.com",
    "role": "Super Admin",
    "status": "Active",
    "lastLogin": "Just now",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### 2. **POST /api/team-members**
Add a new team member.

**Headers:**
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_TOKEN_HERE'
}
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@kinetic.com",
  "role": "Fleet Manager",
  "status": "Active"
}
```

**Response:**
```json
{
  "id": 5,
  "name": "John Doe",
  "email": "john@kinetic.com",
  "role": "Fleet Manager",
  "status": "Active",
  "lastLogin": "Never",
  "createdAt": "2024-01-28T11:53:00Z"
}
```

---

### 3. **PUT /api/team-members/:id**
Update an existing team member.

**Headers:**
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_TOKEN_HERE'
}
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@kinetic.com",
  "role": "Operations Lead",
  "status": "Active"
}
```

**Response:**
```json
{
  "id": 5,
  "name": "John Doe Updated",
  "email": "john.updated@kinetic.com",
  "role": "Operations Lead",
  "status": "Active",
  "lastLogin": "2 hours ago",
  "updatedAt": "2024-01-28T12:00:00Z"
}
```

---

### 4. **DELETE /api/team-members/:id**
Remove a team member.

**Headers:**
```javascript
{
  'Authorization': 'Bearer YOUR_TOKEN_HERE'
}
```

**Response:**
```json
{
  "success": true,
  "message": "Team member removed successfully"
}
```

---

## Implementation Steps

### Step 1: Update API Base URL
In your project, create or update an API configuration file:

```javascript
// src/config/api.ts
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
export const API_ENDPOINTS = {
  TEAM_MEMBERS: '/api/team-members',
};
```

### Step 2: Uncomment API Calls in TeamMembers.tsx

Open `src/components/TeamMembers.tsx` and locate the API integration section (around lines 50-150). You'll find commented-out API calls like this:

```typescript
// TODO: Replace with your actual API endpoint
// const response = await fetch('/api/team-members', {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${localStorage.getItem('token')}`
//   }
// });
```

Uncomment these sections and update with your actual endpoints.

### Step 3: Add Error Handling

Replace the `// TODO: Add error handling/notification` comments with actual error handling:

```typescript
catch (error) {
  console.error('Error fetching team members:', error);
  // Example with a toast notification library
  toast.error('Failed to fetch team members. Please try again.');
}
```

### Step 4: Add Success Notifications

Replace the `// TODO: Add success notification` comments:

```typescript
// After successful add/update/delete
toast.success('Team member added successfully!');
```

---

## Authentication

The component expects an authentication token stored in `localStorage`. Make sure to:

1. Store the token after login:
```javascript
localStorage.setItem('token', yourAuthToken);
```

2. Clear the token on logout:
```javascript
localStorage.removeItem('token');
```

---

## Available Roles

The component supports the following roles:
- Super Admin
- Fleet Manager
- Operations Lead
- Service Manager
- Viewer

You can modify these in the `roles` array in `TeamMembers.tsx` (around line 45).

---

## Features Included

✅ **CRUD Operations** - Create, Read, Update, Delete team members
✅ **Search Functionality** - Search by name, email, or role
✅ **Role Management** - Assign and update user roles
✅ **Status Tracking** - Active/Inactive status management
✅ **Responsive Design** - Works on mobile, tablet, and desktop
✅ **Dark Mode Support** - Automatically adapts to theme
✅ **Loading States** - Shows spinner while fetching data
✅ **Modal Forms** - Clean UI for adding/editing members

---

## Testing

Before connecting to your real API, the component uses mock data. To test:

1. Navigate to Enterprise Settings → Team Members
2. Try adding, editing, and deleting members
3. Test the search functionality
4. Verify dark mode compatibility

Once your API is ready, uncomment the API calls and test with real endpoints.

---

## Error Handling Best Practices

Consider adding:
- Network error handling
- Validation error messages
- Rate limiting feedback
- Session timeout handling
- Optimistic UI updates

---

## Security Considerations

⚠️ **Important:**
- Always validate user permissions on the backend
- Use HTTPS in production
- Implement CSRF protection
- Sanitize all inputs
- Use secure token storage (consider httpOnly cookies instead of localStorage for production)

---

## Support

For issues or questions, refer to the main project documentation or contact the development team.
