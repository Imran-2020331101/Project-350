# Emergency Assistance Feature

A comprehensive emergency assistance system that provides travelers with instant access to emergency contacts based on their location.

## 🚨 Features

- **Location-based Emergency Contacts**: Get emergency services for any city or country
- **Multiple Contact Types**: Police, Fire, Medical, Coast Guard, Embassy, Tourist Helpline
- **Advanced Search**: Filter by location, contact type, or service name
- **Priority-based Display**: Critical emergency services highlighted first
- **One-click Calling**: Direct dial emergency numbers from the interface
- **Google Maps Integration**: Get directions to emergency service locations
- **Responsive Design**: Works seamlessly on mobile and desktop

## 🏗️ Implementation

### Backend Components

#### 1. Database Schema (`backend/models/emergencycontact.js`)
```javascript
{
  contactID: String (unique),
  location: String (indexed),
  contactType: Enum ['police', 'fire', 'medical', 'coast_guard', 'embassy', 'tourist_helpline'],
  name: String (required),
  phoneNumber: String (required),
  address: String,
  description: String,
  isActive: Boolean (default: true),
  priority: Number (1-3, 1 being highest)
}
```

#### 2. Service Layer (`backend/Service/EmergencyService.js`)
- `getEmergencyContacts(location)` - Get all emergency contacts for a location
- `getContactTypes()` - Get available emergency contact types
- `addEmergencyContact(contactData)` - Add new emergency contact (admin)
- `searchEmergencyContacts(filters)` - Advanced search with multiple filters
- `updateEmergencyContact(id, updates)` - Update existing contact (admin)
- `deleteEmergencyContact(id)` - Delete emergency contact (admin)

#### 3. API Routes (`backend/app.js`)
```
GET    /api/emergency/types              - Get contact types
GET    /api/emergency/search             - Search with filters
GET    /api/emergency/:location          - Get contacts by location
POST   /api/emergency                    - Add new contact (admin)
PUT    /api/emergency/:id                - Update contact (admin)  
DELETE /api/emergency/:id                - Delete contact (admin)
```

### Frontend Components

#### 1. Main Component (`frontend/src/components/EmergencyAssistance.jsx`)
- **Search Interface**: Location input, contact type filter, name search
- **Contact Display**: Cards showing emergency service details
- **Action Buttons**: Call now, get directions
- **Emergency Tips**: Helpful guidance for travelers

#### 2. Navigation Integration
- Added to main navbar as "Emergency" link
- Route: `/emergency`
- Accessible from all pages

## 📊 Sample Data

The system includes emergency contacts for:

### Bangladesh
- National Police (999)
- Fire Service (199)
- Medical Emergency (999)
- Tourism Helpline

### Major Cities
- **Dhaka**: Metropolitan Police, Hospitals
- **Cox's Bazar**: Tourist Police, Coast Guard

### International Destinations
- **Thailand (Bangkok)**: Tourist Police (1155), Medical (1669)
- **Malaysia (Kuala Lumpur)**: Police (999), Embassy contacts
- **India (Delhi)**: Police (100), Ambulance (102), Tourist Helpline (1363)
- **UAE (Dubai)**: Police (999), Ambulance (998)
- **USA (New York)**: Emergency Services (911), Embassy
- **UK (London)**: Emergency Services (999), High Commission

## 🚀 Usage

### For Users
1. Navigate to `/emergency` or click "Emergency" in the navbar
2. Enter your location (city or country)
3. Optionally filter by contact type (police, medical, etc.)
4. View emergency contacts with priority ordering
5. Click "Call Now" to dial or "Directions" for Google Maps

### For Administrators
1. Use POST `/api/emergency` to add new emergency contacts
2. Use PUT `/api/emergency/:id` to update existing contacts
3. Use DELETE `/api/emergency/:id` to remove outdated contacts

## 📱 Mobile Features

- **Responsive Design**: Optimized for mobile devices
- **Touch-friendly**: Large buttons for emergency situations
- **Offline-ready**: Core contact information cached
- **GPS Integration**: "Use Current Location" button

## 🛡️ Security & Reliability

- **Data Validation**: All inputs validated and sanitized
- **Error Handling**: Graceful degradation when services unavailable
- **Priority System**: Critical services (police, fire, medical) shown first
- **Regular Updates**: Database can be updated with current contact information

## 🔧 Setup Instructions

### 1. Database Setup
```bash
# Run the seeding script to populate emergency contacts
cd backend
node utils/seedEmergencyContacts.js
```

### 2. Backend Configuration
```bash
# Emergency routes are automatically included in app.js
# No additional configuration needed
```

### 3. Frontend Integration
```bash
# Component is already integrated into App.jsx
# Navigation link added to Navbar.jsx
# Ready to use at /emergency route
```

## 🎯 Future Enhancements

- **Multilingual Support**: Emergency contact names in local languages
- **Real-time Validation**: Verify phone numbers are active
- **SMS Integration**: Send emergency contact details via SMS
- **Offline Mode**: Cache contacts for offline access
- **User Reviews**: Community feedback on emergency service quality
- **API Integration**: Connect with official emergency service APIs

## 📞 Emergency Contact Categories

| Type | Description | Examples |
|------|-------------|----------|
| Police | Law enforcement emergency | 999 (BD), 911 (US), 100 (India) |
| Fire | Fire department and rescue | 199 (BD), 911 (US) |
| Medical | Ambulance and medical emergency | 999 (BD), 1669 (Thailand) |
| Coast Guard | Maritime emergency and rescue | Coastal areas |
| Embassy | Diplomatic assistance for nationals | Bangladesh missions abroad |
| Tourist Helpline | Tourism-specific assistance | 1363 (India), 1155 (Thailand) |

---

✅ **Status**: Fully implemented and ready for production use
🔗 **Access**: Available at `/emergency` route in the application
