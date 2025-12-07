# Coupon Management System

A simple coupon management system for e-commerce built with Express.js and TypeScript. The system provides APIs to create coupons with eligibility rules and find the best matching coupon for a user and cart.

## Tech Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: In-memory (no external DB)
- **Runtime**: Node.js 18+

---

## How to Run

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd coupon-management
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **For development with auto-reload:**
   ```bash
   npm run dev
   ```
   
6. Postman collection you can use to test the HTTP server - https://.postman.co/workspace/My-Workspace~8d0c3868-71b2-48a2-8456-faab5ae68979/collection/41721238-14d01826-6bb7-4921-9bf2-2e597e0edbae?action=share&creator=41721238

---

## API Endpoints

### Health Check

**Route:** `GET /health`

**Description:** Checks if the server is running properly.

**Input Required:** None

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### Demo Login

**Route:** `POST /api/demo-login`

**Description:** Authenticate with hard-coded demo credentials. This user must exist as per assignment requirements.

**Input Required:**
```json
{
  "email": "hire-me@anshumat.org",
  "password": "HireMe@2025!"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "userId": "demo-user-001",
    "userTier": "GOLD",
    "country": "IN",
    "lifetimeSpend": 10000,
    "ordersPlaced": 5
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### Create New Coupon

**Route:** `POST /api/coupons`

**Description:** Creates a new coupon with eligibility rules and discount configuration.

**Input Required:**
```json
{
  "code": "WELCOME100",
  "description": "₹100 off on first order",
  "discountType": "FLAT",
  "discountValue": 100,
  "maxDiscountAmount": null,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "usageLimitPerUser": 1,
  "eligibility": {
    "allowedUserTiers": null,
    "minLifetimeSpend": null,
    "minOrdersPlaced": null,
    "firstOrderOnly": true,
    "allowedCountries": null,
    "minCartValue": 500,
    "applicableCategories": null,
    "excludedCategories": null,
    "minItemsCount": null
  }
}
```

**Response (Success - 201 Created):**
```json
{
  "id": "coupon_12345",
  "code": "WELCOME100",
  "description": "₹100 off on first order",
  "discountType": "FLAT",
  "discountValue": 100,
  "maxDiscountAmount": null,
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T23:59:59.000Z",
  "usageLimitPerUser": 1,
  "eligibility": {
    "firstOrderOnly": true,
    "minCartValue": 500
  },
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Response (Error - 409 Conflict):**
```json
{
  "error": "Coupon with code WELCOME100 already exists"
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "error": "Missing required fields"
}
```

---

### Get All Coupons

**Route:** `GET /api/coupons`

**Description:** Returns a list of all stored coupons (for debugging/testing).

**Input Required:** None

**Response:**
```json
[
  {
    "id": "coupon_12345",
    "code": "WELCOME100",
    "description": "₹100 off on first order",
    "discountType": "FLAT",
    "discountValue": 100,
    "maxDiscountAmount": null,
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.000Z",
    "usageLimitPerUser": 1,
    "eligibility": {
      "firstOrderOnly": true,
      "minCartValue": 500
    },
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  {
    "id": "coupon_67890",
    "code": "SUMMER20",
    "description": "20% off on fashion",
    "discountType": "PERCENT",
    "discountValue": 20,
    "maxDiscountAmount": 500,
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-08-31T23:59:59.000Z",
    "usageLimitPerUser": null,
    "eligibility": {
      "applicableCategories": ["fashion"],
      "minCartValue": 1000
    },
    "createdAt": "2024-01-01T12:05:00.000Z",
    "updatedAt": "2024-01-01T12:05:00.000Z"
  }
]
```

---

### Get Best Matching Coupon

**Route:** `POST /api/coupons/best-match`

**Description:** Evaluates all valid coupons and returns the best matching coupon for the given user and cart based on eligibility rules and discount amount.

**Input Required:**
```json
{
  "userContext": {
    "userId": "u123",
    "userTier": "NEW",
    "country": "IN",
    "lifetimeSpend": 1200,
    "ordersPlaced": 0
  },
  "cart": {
    "items": [
      {
        "productId": "p1",
        "category": "electronics",
        "unitPrice": 1500,
        "quantity": 1
      },
      {
        "productId": "p2",
        "category": "fashion",
        "unitPrice": 500,
        "quantity": 2
      }
    ]
  }
}
```

**Response (Success - With Coupon):**
```json
{
  "coupon": {
    "id": "coupon_12345",
    "code": "WELCOME100",
    "description": "₹100 off on first order",
    "discountType": "FLAT",
    "discountValue": 100,
    "maxDiscountAmount": null,
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.000Z",
    "usageLimitPerUser": 1,
    "eligibility": {
      "firstOrderOnly": true,
      "minCartValue": 500
    },
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "discountAmount": 100
}
```

**Response (Success - No Eligible Coupon):**
```json
{
  "coupon": null,
  "discountAmount": 0
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "error": "Missing userContext or cart"
}
```

---

### Seed Demo Data

**Route:** `POST /api/coupons/seed`

**Description:** Seeds the system with pre-defined demo coupons for testing purposes.

**Input Required:** None

**Response:**
```json
{
  "message": "Demo coupons seeded successfully",
  "count": 3,
  "coupons": [
    {
      "id": "coupon_1",
      "code": "WELCOME100",
      "description": "₹100 off on first order",
      "discountType": "FLAT",
      "discountValue": 100,
      "maxDiscountAmount": null,
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T23:59:59.000Z",
      "usageLimitPerUser": 1,
      "eligibility": {
        "firstOrderOnly": true,
        "minCartValue": 500
      },
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    },
    {
      "id": "coupon_2",
      "code": "SUMMER20",
      "description": "20% off on fashion",
      "discountType": "PERCENT",
      "discountValue": 20,
      "maxDiscountAmount": 500,
      "startDate": "2024-06-01T00:00:00.000Z",
      "endDate": "2024-08-31T23:59:59.000Z",
      "usageLimitPerUser": null,
      "eligibility": {
        "applicableCategories": ["fashion"],
        "minCartValue": 1000
      },
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    },
    {
      "id": "coupon_3",
      "code": "GOLD50",
      "description": "₹50 flat discount for gold members",
      "discountType": "FLAT",
      "discountValue": 50,
      "maxDiscountAmount": null,
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T23:59:59.000Z",
      "usageLimitPerUser": null,
      "eligibility": {
        "allowedUserTiers": ["GOLD"]
      },
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

---

## Project Structure

```
src/
├── index.ts              # Application entry point
├── server.ts             # Express app configuration
├── routes/               # API route definitions
│   └── coupons.routes.ts
├── controllers/          # Request handlers
│   └── coupons.controller.ts
├── services/            # Business logic
│   └── coupons.service.ts
├── repositories/        # In-memory data storage
│   └── coupons.repository.ts
├── models/              # TypeScript interfaces
│   └── index.ts
├── middlewares/         # Express middlewares
│   ├── error.middleware.ts
│   └── notfound.middleware.ts
```

---

## How It Works

### Coupon Evaluation Process

1. **Filter valid coupons:** Check date validity (startDate ≤ current date ≤ endDate)
2. **Check usage limits:** Verify user hasn't exceeded usageLimitPerUser
3. **Evaluate eligibility:** Apply all user-based and cart-based rules
4. **Calculate discount:** Compute actual discount amount (capped by maxDiscountAmount for PERCENT coupons)
5. **Select best coupon:** Choose based on highest discount → earliest endDate → lexicographically smaller code

### Eligibility Rules Supported

**User-based:**
- `allowedUserTiers`
- `minLifetimeSpend`
- `minOrdersPlaced`
- `firstOrderOnly`
- `allowedCountries`

**Cart-based:**
- `minCartValue`
- `applicableCategories`
- `excludedCategories`
- `minItemsCount`

### Discount Types

- **FLAT:** Fixed amount discount (e.g., ₹100 off)
- **PERCENT:** Percentage discount (e.g., 20% off) with optional maxDiscountAmount cap

---
