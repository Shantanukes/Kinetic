# Updated Add Dealer Form Fields

## Form Structure

The Add Dealer form now includes the following professional fields organized in sections:

### Section 1: Basic Information
1. **Sr. No** (Auto-generated)
2. **Reference No.** - Required text field
3. **Dealer Code** - Required, unique identifier
4. **Dealership Name** - Required text field

### Section 2: Party Creation Details
5. **Dealer's Address** - Required textarea
6. **State** - Required text field
7. **Zone** - Required dropdown/text (North/South/East/West/Central)
8. **Location** - Required text field (City)
9. **Pin Code** - Required, 6 digits

### Section 3: Contact Information
10. **Partner's Name** - Required text field
11. **Contact Person Name** - Required text field
12. **Mobile No.** - Required, 10 digits
13. **E-mail ID** - Required, valid email format

### Section 4: Legal & Business Details
14. **GST No.** - Required, valid GST format (15 characters)
15. **LOI Date** - Required date picker
16. **LOI Valid upto** - Required date picker (must be after LOI Date)

### Section 5: Lead Information
17. **Lead Status** - Required dropdown
    - Digital
    - Newspaper
    - Scouting

## Field Validations

| Field | Validation Rule | Error Message |
|-------|----------------|---------------|
| Reference No | Not empty | "Reference number is required" |
| Dealer Code | Not empty, Unique | "Dealer code is required" / "Dealer code must be unique" |
| Dealership Name | Not empty | "Dealership name is required" |
| Address | Not empty | "Address is required" |
| State | Not empty | "State is required" |
| Zone | Not empty | "Zone is required" |
| Location | Not empty | "Location is required" |
| Pin Code | 6 digits | "Pincode must be 6 digits" |
| Partner Name | Not empty | "Partner name is required" |
| Contact Person | Not empty | "Contact person name is required" |
| Mobile No | 10 digits | "Invalid mobile format" |
| Email | Valid email | "Invalid email format" |
| GST No | 15 char GST format | "Invalid GST format" |
| LOI Date | Valid date | "LOI date is required" |
| LOI Valid Upto | After LOI Date | "LOI valid upto must be after LOI date" |
| Lead Status | One of 3 options | Auto-selected |

## Implementation Status

✅ State variables updated
✅ Validation function updated
✅ Submit handler updated
✅ Form reset logic updated
⏳ Form UI needs to be updated (in progress)

The form UI will be organized into collapsible sections for better UX.
