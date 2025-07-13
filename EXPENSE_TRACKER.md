# Expense Tracker Feature

A comprehensive expense tracking system designed for travelers to monitor and analyze their spending across trips and daily activities.

## 💰 Features

- **Smart Expense Categorization**: 10 predefined categories covering all travel expenses
- **Multi-Currency Support**: Track expenses in different currencies (USD, EUR, BDT, GBP, etc.)
- **Advanced Analytics**: Visual summaries, category breakdowns, and spending trends
- **Trip Association**: Link expenses to specific trips for organized tracking
- **Powerful Search & Filtering**: Find expenses by description, tags, location, or date range
- **Receipt & Notes Management**: Add notes and receipt URLs for better record keeping
- **Payment Method Tracking**: Monitor spending across cash, card, digital wallets
- **Tag System**: Custom tags for flexible expense organization
- **Real-time Calculations**: Instant totals, averages, and spending insights

## 🏗️ Implementation

### Backend Components

#### 1. Enhanced Database Schema (`backend/models/expense.js`)
```javascript
{
  expenseID: String (unique),
  userID: String (indexed, required),
  tripID: String (optional, for trip association),
  category: Enum (required) [
    'accommodation', 'transportation', 'food', 'entertainment',
    'shopping', 'tours', 'insurance', 'visa', 'health', 'miscellaneous'
  ],
  subcategory: String (optional),
  amount: Number (required, min: 0),
  currency: String (default: 'USD'),
  date: Date (required, default: now),
  description: String (required, max: 500),
  location: String (optional),
  paymentMethod: Enum ['cash', 'card', 'digital_wallet', 'bank_transfer', 'other'],
  receiptURL: String (optional),
  tags: [String] (optional),
  notes: String (max: 1000),
  isRecurring: Boolean (default: false),
  timestamps: true
}
```

#### 2. Comprehensive Service Layer (`backend/Service/ExpenseService.js`)
- `getUserExpenses(userID, filters)` - Get user expenses with advanced filtering
- `getExpenseById(expenseID, userID)` - Get specific expense details
- `addExpense(userID, expenseData)` - Add new expense with validation
- `updateExpense(expenseID, userID, updateData)` - Update existing expense
- `deleteExpense(expenseID, userID)` - Delete expense
- `getExpenseSummary(userID, filters)` - Advanced analytics and summaries
- `getExpenseCategories()` - Get available expense categories
- `searchExpenses(userID, searchTerm, filters)` - Smart search functionality

#### 3. RESTful API Routes (`backend/app.js`)
```
GET    /api/expenses/categories           - Get expense categories
GET    /api/expenses/summary             - Get expense analytics & summary
GET    /api/expenses/search              - Search expenses by term
GET    /api/expenses                     - Get user expenses with filters
GET    /api/expenses/:expenseID          - Get specific expense
POST   /api/expenses                     - Add new expense
PUT    /api/expenses/:expenseID          - Update expense
DELETE /api/expenses/:expenseID          - Delete expense
```

### Frontend Components

#### 1. Main Component (`frontend/src/components/ExpenseTracker.jsx`)

**Dashboard Overview**
- Summary cards showing total expenses, count, averages, and highest expense
- Real-time calculations and visual indicators
- Quick access to add new expenses

**Advanced Search & Filtering**
- Text search across descriptions, tags, and locations
- Category filtering with visual icons
- Date range selection (start/end dates)
- Amount range filtering (min/max)
- Pagination for large datasets

**Expense Management**
- Add/Edit expense modal with comprehensive form
- Delete functionality with confirmation
- Inline editing capabilities
- Visual categorization with emojis and colors

**Smart Features**
- Auto-complete for locations and descriptions
- Tag suggestions and management
- Currency conversion indicators
- Payment method tracking with icons

#### 2. Navigation Integration
- Added to main navbar as "Expenses" link
- Route: `/expenses`
- Protected route requiring authentication

## 📊 Expense Categories & Icons

| Category | Icon | Examples |
|----------|------|----------|
| Accommodation | 🏨 | Hotels, hostels, Airbnb, camping |
| Transportation | 🚗 | Flights, buses, taxis, fuel, parking |
| Food | 🍽️ | Restaurants, street food, groceries |
| Entertainment | 🎭 | Movies, shows, nightlife, activities |
| Shopping | 🛍️ | Souvenirs, clothing, electronics |
| Tours | 🗺️ | Guided tours, attractions, excursions |
| Insurance | 🛡️ | Travel insurance, health coverage |
| Visa | 📋 | Visa fees, permits, documentation |
| Health | ⚕️ | Medicine, doctor visits, treatments |
| Miscellaneous | 📦 | Tips, fees, other unexpected expenses |

## 🎯 Sample Data Structure

### Domestic Trip Example (Bangladesh)
```javascript
{
  category: "accommodation",
  amount: 3500,
  currency: "BDT",
  description: "Hotel booking in Cox's Bazar",
  location: "Cox's Bazar, Bangladesh",
  paymentMethod: "card",
  tags: ["vacation", "beach", "weekend"],
  notes: "Sea view room for 2 nights"
}
```

### International Trip Example (Thailand)
```javascript
{
  category: "transportation",
  amount: 350,
  currency: "USD",
  description: "Round trip flight to Bangkok",
  location: "Dhaka to Bangkok",
  paymentMethod: "card",
  tags: ["international", "vacation"],
  notes: "Bangkok Airways with good service"
}
```

### Business Trip Example (Malaysia)
```javascript
{
  category: "accommodation",
  amount: 120,
  currency: "USD",
  description: "Business hotel in Kuala Lumpur",
  location: "KLCC, Kuala Lumpur",
  paymentMethod: "card",
  tags: ["business", "conference", "reimbursable"],
  notes: "Conference hotel with meeting facilities"
}
```

## 📈 Analytics & Reporting

### Summary Dashboard
- **Total Expenses**: Sum of all user expenses
- **Expense Count**: Number of recorded expenses
- **Average Expense**: Mean spending per transaction
- **Highest Expense**: Maximum single transaction

### Category Analysis
- Spending breakdown by category
- Visual pie charts and bar graphs
- Category-wise averages and totals
- Trend analysis over time

### Time-based Analytics
- Monthly spending patterns
- Date range comparisons
- Seasonal spending insights
- Trip-specific summaries

### Payment Method Insights
- Cash vs. card spending ratios
- Digital wallet usage patterns
- Payment method preferences by category

## 🔍 Advanced Search Features

### Smart Search
- **Description Search**: Find expenses by description text
- **Tag Search**: Search through custom tags
- **Location Search**: Find expenses by location
- **Fuzzy Matching**: Handles typos and partial matches

### Filtering Options
- **Category Filter**: Filter by expense category
- **Date Range**: Start and end date selection
- **Amount Range**: Minimum and maximum amounts
- **Trip Filter**: Filter by associated trip
- **Payment Method**: Filter by payment type
- **Currency**: Filter by specific currency

### Sorting & Pagination
- Sort by date, amount, category, or description
- Ascending/descending order
- Configurable page sizes (10, 20, 50 items)
- Navigation between pages

## 💱 Multi-Currency Support

### Supported Currencies
- **USD** - US Dollar (default)
- **EUR** - Euro
- **BDT** - Bangladeshi Taka
- **GBP** - British Pound
- **JPY** - Japanese Yen
- **CAD** - Canadian Dollar
- **AUD** - Australian Dollar

### Currency Features
- Individual expense currency tracking
- Summary calculations in preferred currency
- Exchange rate awareness (future enhancement)
- Currency-specific formatting

## 🔧 Setup Instructions

### 1. Database Setup
```bash
# Run the expense data seeding script
cd backend
node utils/seedExpenseData.js
```

### 2. Backend Configuration
```bash
# Expense routes are automatically included in app.js
# ExpenseService is integrated with existing authentication
# No additional configuration needed
```

### 3. Frontend Integration
```bash
# Component is already integrated into App.jsx
# Navigation link added to Navbar.jsx
# Available at /expenses route
```

## 🛡️ Security & Validation

### Data Validation
- **Required Fields**: Category, amount, description enforced
- **Amount Validation**: Positive numbers only, decimal precision
- **Date Validation**: Valid date formats, reasonable date ranges
- **String Limits**: Description (500 chars), notes (1000 chars)
- **Enum Validation**: Category and payment method restricted to predefined values

### Authentication & Authorization
- **JWT Authentication**: All endpoints require valid authentication
- **User Isolation**: Users can only access their own expenses
- **Input Sanitization**: All inputs sanitized and validated
- **SQL Injection Prevention**: MongoDB with Mongoose protection

## 🚀 Performance Optimizations

### Database Indexing
```javascript
// Optimized indexes for common queries
userID_1_date_-1     // User expenses by date
userID_1_category_1   // User expenses by category
userID_1_tripID_1     // User expenses by trip
date_-1               // Global date-based queries
```

### Query Optimization
- **Pagination**: Limit large result sets
- **Aggregation Pipeline**: Efficient analytics calculations
- **Lean Queries**: Return plain objects for better performance
- **Selective Fields**: Return only required data

### Frontend Optimization
- **Lazy Loading**: Load expenses on demand
- **Debounced Search**: Prevent excessive API calls
- **Memoized Calculations**: Cache computed values
- **Virtual Scrolling**: Handle large expense lists

## 🎯 Future Enhancements

### Analytics Improvements
- **Visual Charts**: Pie charts, line graphs, bar charts
- **Export Features**: PDF reports, CSV exports, Excel integration
- **Budget Tracking**: Set and monitor spending limits
- **Spending Alerts**: Notifications for budget overruns

### Integration Features
- **Receipt Scanning**: OCR for automatic expense entry
- **Bank Integration**: Import transactions from bank accounts
- **Calendar Integration**: Link expenses to calendar events
- **GPS Integration**: Auto-detect location for expenses

### Advanced Features
- **Recurring Expenses**: Automated entry for regular expenses
- **Expense Splitting**: Share expenses with travel companions
- **Multi-language**: Support for different languages
- **Offline Mode**: Work without internet connection

## 📱 Mobile Features

### Responsive Design
- **Touch-friendly Interface**: Large buttons, easy navigation
- **Mobile-optimized Forms**: Streamlined data entry
- **Swipe Gestures**: Quick actions for edit/delete
- **Camera Integration**: Photo receipts (future)

### Quick Actions
- **Fast Entry**: Minimal form for quick expense logging
- **Voice Input**: Speech-to-text for descriptions
- **Location Services**: Auto-fill location data
- **QR Code Scanning**: Quick data entry from receipts

## 📞 API Usage Examples

### Adding an Expense
```javascript
POST /api/expenses
{
  "category": "food",
  "amount": 25.50,
  "currency": "USD",
  "description": "Lunch at local restaurant",
  "location": "Bangkok, Thailand",
  "paymentMethod": "card",
  "tags": ["lunch", "local cuisine"],
  "notes": "Great pad thai!"
}
```

### Getting Expense Summary
```javascript
GET /api/expenses/summary?startDate=2024-01-01&endDate=2024-12-31

Response:
{
  "success": true,
  "summary": {
    "overview": {
      "totalAmount": 1250.75,
      "totalExpenses": 45,
      "avgExpense": 27.79,
      "maxExpense": 350.00
    },
    "categoryBreakdown": [
      { "_id": "transportation", "totalAmount": 520, "count": 8 },
      { "_id": "accommodation", "totalAmount": 480, "count": 12 }
    ]
  }
}
```

### Searching Expenses
```javascript
GET /api/expenses/search?q=restaurant&page=1&limit=10

Response:
{
  "success": true,
  "expenses": [...],
  "totalResults": 15,
  "searchTerm": "restaurant"
}
```

---

✅ **Status**: Fully implemented and ready for production use  
🔗 **Access**: Available at `/expenses` route in the application  
📊 **Coverage**: Complete expense tracking solution for travelers
