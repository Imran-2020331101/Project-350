# Project-350 API Testing Guide

## Overview
This guide provides comprehensive testing instructions for all API endpoints in the Project-350 travel assistant application.

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints Summary

### Authentication Endpoints (4)
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- POST `/api/auth/refresh` - Refresh JWT token
- POST `/api/auth/profile/update` - Update user profile

### Trip Management Endpoints (3)
- POST `/api/trips` - Create new trip
- GET `/api/trips/{id}` - Get trip by ID
- DELETE `/api/trips/{id}` - Delete trip

### Blog Management Endpoints (7)
- GET `/api/blogs` - Get all blogs
- POST `/api/blogs` - Create blog
- PUT `/api/blogs` - Update blog
- DELETE `/api/blogs/{id}` - Delete blog
- POST `/api/blogs/{id}/comments` - Add comment
- POST `/api/blogs/{blogId}/comments/{commentId}/replies` - Reply to comment
- POST `/api/blogs/{id}/like` - Like/unlike blog

### Group Management Endpoints (3)
- GET `/api/groups` - Get all groups
- POST `/api/groups` - Create travel group
- POST `/api/groups/{id}/join` - Join group
- POST `/api/groups/{id}/cancel` - Leave group

### Media Management Endpoints (3)
- POST `/api/upload-image` - Upload images
- POST `/api/upload-profile-picture` - Upload profile picture
- GET `/api/photos/{id}` - Get trip photos

### Translation Endpoint (1)
- POST `/api/translate` - Translate text

### Emergency Assistance Endpoints (6)
- GET `/api/emergency/types` - Get emergency contact types
- GET `/api/emergency/search` - Search emergency contacts
- GET `/api/emergency/{location}` - Get contacts by location
- POST `/api/emergency` - Add emergency contact (Admin)
- PUT `/api/emergency/{id}` - Update emergency contact (Admin)
- DELETE `/api/emergency/{id}` - Delete emergency contact (Admin)

### Expense Tracker Endpoints (8)
- GET `/api/expenses/categories` - Get expense categories
- GET `/api/expenses/summary` - Get expense summary/analytics
- GET `/api/expenses/search` - Search expenses
- GET `/api/expenses` - Get user expenses (with filters)
- GET `/api/expenses/{expenseID}` - Get specific expense
- POST `/api/expenses` - Add new expense
- PUT `/api/expenses/{expenseID}` - Update expense
- DELETE `/api/expenses/{expenseID}` - Delete expense

**Total Endpoints: 36+**

## Testing Scenarios

### 1. Authentication Flow
```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Update profile (requires token)
curl -X POST http://localhost:3000/api/auth/profile/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Updated Name",
    "bio": "Travel enthusiast"
  }'
```

### 2. Trip Management
```bash
# Create a trip
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "destination": "Cox'\''s Bazar, Bangladesh",
    "duration": 3,
    "budget": 500,
    "preferences": ["beach", "adventure"]
  }'

# Get trip by ID
curl -X GET http://localhost:3000/api/trips/TRIP_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Emergency Assistance Testing
```bash
# Get emergency contact types
curl -X GET http://localhost:3000/api/emergency/types

# Search emergency contacts
curl -X GET "http://localhost:3000/api/emergency/search?location=Dhaka&contactType=police"

# Get contacts by location
curl -X GET http://localhost:3000/api/emergency/Dhaka

# Add emergency contact (Admin only)
curl -X POST http://localhost:3000/api/emergency \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "location": "Dhaka, Bangladesh",
    "contactType": "police",
    "name": "Dhaka Metropolitan Police",
    "phoneNumber": "999",
    "address": "Police Headquarters, Ramna",
    "description": "Emergency police services",
    "priority": 1
  }'
```

### 4. Expense Tracker Testing
```bash
# Get expense categories
curl -X GET http://localhost:3000/api/expenses/categories

# Add expense
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "category": "food",
    "subcategory": "restaurant",
    "amount": 25.50,
    "currency": "USD",
    "date": "2024-01-15",
    "description": "Lunch at local restaurant",
    "location": "Bangkok, Thailand",
    "paymentMethod": "card",
    "tags": ["lunch", "local"],
    "notes": "Great food!"
  }'

# Get expense summary
curl -X GET "http://localhost:3000/api/expenses/summary?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search expenses
curl -X GET "http://localhost:3000/api/expenses/search?q=restaurant" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get user expenses with filters
curl -X GET "http://localhost:3000/api/expenses?category=food&startDate=2024-01-01&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Blog Management Testing
```bash
# Get all blogs
curl -X GET "http://localhost:3000/api/blogs?page=1&limit=10"

# Create blog from trip
curl -X POST http://localhost:3000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "tripId": "TRIP_ID",
    "title": "Amazing Adventure",
    "content": "Custom content..."
  }'

# Add comment to blog
curl -X POST http://localhost:3000/api/blogs/BLOG_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "comment": "Great travel experience!"
  }'

# Like a blog
curl -X POST http://localhost:3000/api/blogs/BLOG_ID/like \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Group Management Testing
```bash
# Get all groups
curl -X GET http://localhost:3000/api/groups

# Create travel group
curl -X POST http://localhost:3000/api/groups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "tripId": "TRIP_ID",
    "groupName": "Adventure Seekers",
    "gatheringPoint": "Dhaka Airport Terminal 1",
    "availableSpots": 5
  }'

# Join group
curl -X POST http://localhost:3000/api/groups/GROUP_ID/join \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Translation Testing
```bash
# Translate text
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you?",
    "sourceLang": "en",
    "targetLang": "bn"
  }'
```

## Error Testing

### Test Invalid Authentication
```bash
# Try accessing protected endpoint without token
curl -X GET http://localhost:3000/api/expenses \
  -H "Authorization: Bearer invalid_token"
# Expected: 401 Unauthorized
```

### Test Invalid Data
```bash
# Try creating expense with missing required fields
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 25.50
  }'
# Expected: 400 Bad Request
```

### Test Not Found
```bash
# Try getting non-existent expense
curl -X GET http://localhost:3000/api/expenses/invalid_id \
  -H "Authorization: Bearer YOUR_TOKEN"
# Expected: 404 Not Found
```

## Validation Checklist

### ✅ Authentication & Authorization
- [x] User registration works
- [x] User login returns valid JWT
- [x] Protected routes require authentication
- [x] Admin-only routes check admin permissions
- [x] Token refresh functionality

### ✅ Emergency Assistance Feature
- [x] Get emergency contact types
- [x] Search contacts by filters
- [x] Get contacts by location
- [x] Add/update/delete contacts (Admin)
- [x] Proper error handling

### ✅ Expense Tracker Feature
- [x] Get expense categories
- [x] Add/edit/delete expenses
- [x] Search and filter expenses
- [x] Generate expense summaries
- [x] Pagination support

### ✅ Trip Management
- [x] Create trips with AI suggestions
- [x] Retrieve trip details
- [x] Delete trips
- [x] User-specific trip access

### ✅ Blog System
- [x] Create blogs from trips
- [x] View all blogs with pagination
- [x] Comment and reply system
- [x] Like functionality
- [x] Update and delete blogs

### ✅ Group Travel
- [x] Create travel groups
- [x] Join/leave groups
- [x] View available groups
- [x] Spot management

### ✅ Media & Translation
- [x] Image upload functionality
- [x] Profile picture upload
- [x] Text translation
- [x] Photo management

## Performance Testing

### Load Testing Commands
```bash
# Test multiple concurrent requests
for i in {1..10}; do
  curl -X GET http://localhost:3000/api/emergency/types &
done
wait

# Test API response times
time curl -X GET http://localhost:3000/api/expenses/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## API Documentation Access

After starting the server, access the Swagger documentation at:
```
http://localhost:3000/api-docs
```

## Summary

This comprehensive testing guide covers all **36+ API endpoints** implemented in the Project-350 application:

- **Authentication & User Management**: 5 endpoints
- **Trip Planning**: 3 endpoints  
- **Blog System**: 7 endpoints
- **Group Travel**: 4 endpoints
- **Emergency Assistance**: 6 endpoints ✨ **NEW**
- **Expense Tracker**: 8 endpoints ✨ **NEW**
- **Media & Translation**: 4 endpoints

All endpoints include proper error handling, authentication where required, input validation, and comprehensive response formats. The API is fully documented and ready for production use.
