# Add Dealer Feature - Documentation

## ✅ Feature Status: **FULLY IMPLEMENTED**

The "Add Dealer" functionality is already built into the Dealer Management component with a comprehensive modal form and validation system.

---

## 🎯 Access Control

### Roles with "Add Dealer" Permission:
- ✅ **SUPER_ADMIN** - Full access
- ✅ **OEM** - Full access
- ✅ **RND** - Full access
- ✅ **SALES** - Full access ⭐ **NEWLY ADDED**

### Roles WITHOUT Permission:
- ❌ DEALER - Cannot add dealers
- ❌ SERVICE - Cannot add dealers
- ❌ FLEET - Cannot add dealers
- ❌ FLEET_DRIVER - Cannot add dealers
- ❌ USER - Cannot add dealers

---

## 🎨 UI Components

### 1. **Add Dealer Button**
- **Location**: Top-right corner of Dealer Management page
- **Visibility**: Only shown to authorized roles
- **Style**: Blue gradient button with Plus icon
- **Label**: "Add Dealer"

### 2. **Add Dealer Modal**
A beautiful, full-featured modal with:
- **Header**: Icon, title, description, close button
- **Body**: Multi-section form with validation
- **Footer**: Cancel and Submit buttons with loading states

---

## 📋 Form Fields

### **Section 1: Basic Information**

| Field | Type | Required | Validation | Placeholder |
|-------|------|----------|------------|-------------|
| **Dealer Name** | Text | ✅ Yes | Must not be empty | "e.g. Kinetic Mumbai Central" |
| **License Number / ID** | Text | ✅ Yes | Must be unique | "Unique Dealer ID (e.g. D005)" |

### **Section 2: Contact Details**

| Field | Type | Required | Validation | Placeholder |
|-------|------|----------|------------|-------------|
| **Official Email** | Email | ✅ Yes | Valid email format | "dealer@kinetic.com" |
| **Phone Number** | Tel | ✅ Yes | 10 digits (with/without +91) | "+91 9876543210" |

### **Section 3: Business Address**

| Field | Type | Required | Validation | Placeholder |
|-------|------|----------|------------|-------------|
| **Street Address** | Textarea | ✅ Yes | Must not be empty | "Plot No, Street, Landmark..." |
| **City** | Text | ✅ Yes | Must not be empty | "City" |
| **State** | Text | ✅ Yes | Must not be empty | "State" |
| **Pincode** | Text | ✅ Yes | Must be exactly 6 digits | "6 Digits" |

---

## ✅ Validation Rules

### **Dealer Name**
- ❌ Cannot be empty
- ✅ Example: "Kinetic Mumbai Central"

### **License Number / ID**
- ❌ Cannot be empty
- ❌ Must be unique (no duplicates)
- ✅ Example: "D005", "D006", "MUM001"

### **Email**
- ❌ Cannot be empty
- ❌ Must be valid email format
- ✅ Example: "dealer@kinetic.com"

### **Phone Number**
- ❌ Cannot be empty
- ❌ Must be 10 digits
- ✅ Accepts: "9876543210" or "+91 9876543210"

### **Street Address**
- ❌ Cannot be empty
- ✅ Example: "Plot 123, MG Road, Near City Mall"

### **City**
- ❌ Cannot be empty
- ✅ Example: "Mumbai", "Delhi", "Bangalore"

### **State**
- ❌ Cannot be empty
- ✅ Example: "Maharashtra", "Delhi", "Karnataka"

### **Pincode**
- ❌ Cannot be empty
- ❌ Must be exactly 6 digits
- ✅ Example: "400001", "110001", "560001"

---

## 🎬 User Flow

### Step 1: Access Dealer Management
```
1. Login with authorized role (SUPER_ADMIN, OEM, RND, or SALES)
2. Navigate to "Dealer Management" from sidebar
3. Click "Add Dealer" button (top-right)
```

### Step 2: Fill Form
```
1. Modal opens with animated entrance
2. Fill in Basic Information:
   - Dealer Name
   - License Number/ID
3. Fill in Contact Details:
   - Email
   - Phone Number
4. Fill in Business Address:
   - Street Address
   - City, State, Pincode
```

### Step 3: Submit
```
1. Click "Register Dealer" button
2. Form validates all fields
3. If errors: Red borders appear with error messages
4. If valid: Loading state shows "Registering..."
5. After 1.5 seconds: Success message displays
6. After 2 more seconds: Modal closes automatically
7. New dealer appears at top of dealer list
```

---

## 🎨 Visual Features

### **Form Validation Feedback**
- ✅ **Valid Field**: Blue border on focus
- ❌ **Invalid Field**: Red border with error icon and message
- 🔄 **Loading State**: Spinner animation with "Registering..." text

### **Success State**
- 🎉 **Success Icon**: Green checkmark in circle
- 📝 **Message**: "Registration Successful!"
- ⏱️ **Auto-close**: Modal closes after 2 seconds

### **Responsive Design**
- 📱 **Mobile**: Single column layout
- 💻 **Desktop**: Two-column grid for form fields
- 🎯 **Max Width**: 2xl (672px) for optimal readability

---

## 🔧 Technical Implementation

### **Component State**
```typescript
const [showAddModal, setShowAddModal] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [successMessage, setSuccessMessage] = useState('');
const [formErrors, setFormErrors] = useState<Record<string, string>>({});
const [newDealer, setNewDealer] = useState({
  name: '',
  licenseNumber: '',
  email: '',
  phone: '',
  address: {
    street: '',
    city: '',
    state: '',
    pincode: ''
  }
});
```

### **Validation Function**
```typescript
const validateForm = () => {
  const errors: Record<string, string> = {};
  
  // Name validation
  if (!newDealer.name.trim()) 
    errors.name = 'Dealer name is required';
  
  // License number validation
  if (!newDealer.licenseNumber.trim()) 
    errors.licenseNumber = 'License number is required';
  else if (dealers.some(d => d.id === newDealer.licenseNumber)) 
    errors.licenseNumber = 'License number must be unique';
  
  // Email validation
  if (!newDealer.email.trim()) 
    errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(newDealer.email)) 
    errors.email = 'Invalid email format';
  
  // Phone validation
  if (!newDealer.phone.trim()) 
    errors.phone = 'Phone number is required';
  else if (!/^\+?91\s?\d{10}$|^\d{10}$/.test(newDealer.phone)) 
    errors.phone = 'Invalid phone format (e.g. 9876543210)';
  
  // Address validation
  if (!newDealer.address.street.trim()) 
    errors.street = 'Street address is required';
  if (!newDealer.address.city.trim()) 
    errors.city = 'City is required';
  if (!newDealer.address.state.trim()) 
    errors.state = 'State is required';
  if (!newDealer.address.pincode.trim()) 
    errors.pincode = 'Pincode is required';
  else if (!/^\d{6}$/.test(newDealer.address.pincode)) 
    errors.pincode = 'Pincode must be 6 digits';
  
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};
```

### **Submit Handler**
```typescript
const handleAddDealer = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  setIsSubmitting(true);
  
  try {
    // Simulate API call (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create dealer object
    const createdDealer = {
      id: newDealer.licenseNumber,
      name: newDealer.name,
      location: `${newDealer.address.city}, ${newDealer.address.state}`,
      contact: newDealer.phone,
      email: newDealer.email,
      establishedYear: new Date().getFullYear(),
      vehicles: {
        twoWheeler: [],
        threeWheeler: []
      }
    };
    
    // Add to dealers list
    setDealers(prev => [createdDealer, ...prev]);
    setSuccessMessage('Dealer successfully registered!');
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setShowAddModal(false);
      setSuccessMessage('');
      setNewDealer({
        name: '',
        licenseNumber: '',
        email: '',
        phone: '',
        address: { street: '', city: '', state: '', pincode: '' }
      });
    }, 2000);
    
  } catch (error) {
    setFormErrors({ submit: 'Failed to register dealer. Please try again.' });
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 📊 Example Data

### **Sample Dealer Registration**
```json
{
  "name": "Kinetic Pune Central",
  "licenseNumber": "D005",
  "email": "pune@kinetic.com",
  "phone": "+91 9876543210",
  "address": {
    "street": "Plot 456, FC Road, Near Deccan Gymkhana",
    "city": "Pune",
    "state": "Maharashtra",
    "pincode": "411004"
  }
}
```

### **Created Dealer Object**
```json
{
  "id": "D005",
  "name": "Kinetic Pune Central",
  "location": "Pune, Maharashtra",
  "contact": "+91 9876543210",
  "email": "pune@kinetic.com",
  "establishedYear": 2026,
  "vehicles": {
    "twoWheeler": [],
    "threeWheeler": []
  }
}
```

---

## 🧪 Testing Checklist

### **Access Control Testing**
- [ ] Login as SUPER_ADMIN → "Add Dealer" button visible ✅
- [ ] Login as OEM → "Add Dealer" button visible ✅
- [ ] Login as RND → "Add Dealer" button visible ✅
- [ ] Login as SALES → "Add Dealer" button visible ✅
- [ ] Login as DEALER → "Add Dealer" button hidden ❌
- [ ] Login as SERVICE → "Add Dealer" button hidden ❌
- [ ] Login as FLEET_DRIVER → "Add Dealer" button hidden ❌

### **Form Validation Testing**
- [ ] Submit empty form → All fields show errors
- [ ] Enter invalid email → Email field shows error
- [ ] Enter invalid phone → Phone field shows error
- [ ] Enter 5-digit pincode → Pincode field shows error
- [ ] Enter duplicate license number → License field shows error
- [ ] Fill all fields correctly → Form submits successfully

### **UI/UX Testing**
- [ ] Modal opens with smooth animation
- [ ] Close button works
- [ ] Click outside modal closes it (when not submitting)
- [ ] Loading state displays during submission
- [ ] Success message displays after submission
- [ ] Modal auto-closes after success
- [ ] New dealer appears in list
- [ ] Form resets after successful submission

---

## 🎯 Demo Instructions

### **For SALES Role:**
```bash
1. Login: sales / sales123
2. Navigate to: Dealer Management
3. Click: "Add Dealer" button
4. Fill form with sample data:
   - Name: "Kinetic Hyderabad Hub"
   - License: "D010"
   - Email: "hyderabad@kinetic.com"
   - Phone: "9876543210"
   - Street: "Plot 789, Banjara Hills"
   - City: "Hyderabad"
   - State: "Telangana"
   - Pincode: "500034"
5. Click: "Register Dealer"
6. Observe: Loading state → Success message → Auto-close
7. Verify: New dealer appears at top of list
```

---

## 📝 Notes

### **Current Behavior**
- ✅ Form validation is comprehensive
- ✅ UI is polished with animations
- ✅ Success feedback is clear
- ✅ Error messages are helpful
- ⚠️ Data is stored in component state (not persisted)
- ⚠️ API call is simulated (1.5 second delay)

### **Future Enhancements**
- 🔄 Backend API integration
- 💾 Database persistence
- 📧 Email verification
- 📱 SMS verification
- 🖼️ Dealer logo upload
- 📄 Document upload (license, GST, etc.)
- 🗺️ Google Maps integration for address
- 📊 Dealer onboarding workflow
- 🔔 Admin notification on new dealer registration

---

## 🚀 Quick Reference

| Action | Button/Link | Location |
|--------|-------------|----------|
| Open Modal | "Add Dealer" | Top-right of page |
| Close Modal | X icon or Cancel | Modal header/footer |
| Submit Form | "Register Dealer" | Modal footer |
| View Errors | Red borders + messages | Below each field |
| Success State | Green checkmark | Modal center |

---

**Last Updated:** January 29, 2026  
**Status:** ✅ Fully Functional  
**Version:** 1.0.0
