# SmartStore Backend API 🚀

Complete Node.js + Express backend for an e-commerce store with enterprise-grade architecture and best practices.

## 📚 Table of Contents

- [Overview](#-overview)
- [🚀 Key Features](#-key-features)
- [🎯 Architecture](#-architecture)
- [🧪 Testing](#-testing)
- [📝 API Documentation](#-api-documentation)
- [📊 Database](#-database)
- [🔄 Deployment](#-deployment)

---

## 📖 Overview

SmartStore Backend is a robust e-commerce API built with Node.js, Express, and PostgreSQL. It follows a layered architecture pattern, separating concerns between the presentation layer, business logic, and database layer.

## 🚀 Key Features

### Authentication & Authorization
- **Secure Login**: JWT-based authentication with token refreshing
- **Role-Based Access**: ADMIN, MANAGER, USER roles with proper authorization middleware
- **Password Security**: bcrypt encryption for all passwords
- **Security Features**:
  - Rate limiting on login endpoints
  - Brute-force protection

### Product Management
- CRUD operations for products
- Image upload support
- Search, filter, and sorting

### Order Processing
- Create, read, update, delete orders
- Guest checkout support
- Email notifications (Formspree integration)
- Real-time tracking updates

### API Gateway Pattern
- **API Versioning**: Support for multiple API versions (v1, v2)
- **Unified Routing**: Single entry point with intelligent routing
- **Rate Limiting**: Global rate limiting across all endpoints
- **Request Logging**: Comprehensive request tracking

## 🎯 Architecture

The backend follows a 4-layer architecture pattern:

```
Client (Frontend)
      ↓
┌─────────────────────────┐
│    API Gateway Layer    │  ← Entry Point
│    (nginx / reverse proxy)│
└─────────────────────────┘
      ↓
┌─────────────────────────┐
│   Business Logic Layer    │  ← Application Layer
│    (Backend API - Express)│
│ ├─ Controllers           │
│ ├─ Services              │
│ ├─ Routes                │
│ ├─ Middleware            │
│ └─ Configuration         │
└─────────────────────────┘
      ↓
┌─────────────────────────┐
│    Data Access Layer    │  ← Database Layer
│    (Sequelize ORM)      │
│ ├─ Models                │
│ ├─ Migrations            │
│ └─ Seed Data             │
└─────────────────────────┘
      ↓
┌─────────────────────────┐
│    External Services    │
│ ├─ PostgreSQL (Database) │
│ ├─ Redis (Caching/Queues)│
│ └─ Formspree (Emails)    │
└─────────────────────────┘
```

### Layer Details

1. **API Gateway Layer**
   - Handles routing, SSL termination, load balancing
   - Enforces global security policies
   - Supports API versioning

2. **Business Logic Layer**
   - Express application with MVC-like structure
   - Controllers handle HTTP requests/responses
   - Services contain business logic
   - Middleware for security and cross-cutting concerns

3. **Data Access Layer**
   - Sequelize ORM for database interactions
   - Models define database schema
   - Migrations manage database changes
   - Seeders populate initial data

4. **External Services**
   - PostgreSQL for relational data
   - Redis for caching and message queue
   - Formspree for transactional emails

## 🧪 Testing

The backend includes comprehensive test coverage with JUnit 5 and Mockito.

### Test Structure
```
Backend_Application/
  ├── Models/               # Database Models (11 tests)
  ├── Services/             # Business Logic (26 tests)
  ├── Middleware/           # Security Middleware (11 tests)
  └── Controllers/          # API Controllers (4 tests)
```

### Running Tests
```bash
cd Architecture/SmartStore/Backend_Application
./mvnw test
```

### Test Coverage Summary
- Total Tests: **52**
- Models: **11**
- Services: **26**
- Middleware: **11**
- Controllers: **4**

## 📝 API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication

**Login**
```bash
POST /api/v1/auth/login
```
**Request:**
```json
{
  "email": "[EMAIL_ADDRESS]",
  "password": "[PASSWORD]"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "ADMIN",
      "email": "[EMAIL_ADDRESS]"
    }
  }
}
```

### Products

**Get All Products**
```bash
GET /api/v1/products
```

### Orders

**Create Order**
```bash
POST /api/v1/orders/confirm
```

## 📊 Database

### Schema Diagram

```
╔═══════════════╗         ╔══════════════════════════════╗
║    USERS      ║         ║           ORDERS           ║
╠═══════════════╣         ╠══════════════════════════════╣
║ id (PK)       ║─────╮   ║ id (PK)                    ║
║ name          ║     │   ║ user_id (FK) ←┐            ║
║ email         ║     │   ║ total_amount (Decimal)     ║
║ password_hash ║     │   ║ status (Varchar)           ║
║ role          ║     │   ║ created_at (Timestamp)   ║
║ created_at    ║     │   ║ updated_at (Timestamp)   ║
╚═══════════════╝     │   ╚══════════════════════════════╝
                      │                │
                      ╰────────────────╯

╔═══════════════════════╗        ╔══════════════════════╗
║      PRODUCTS         ║        ║   ORDER_ITEMS        ║
╠═══════════════════════╣        ╠══════════════════════╣
║ id (PK)               ║        ║ id (PK)              ║
║ name (Varchar)        ║        ║ order_id (FK) ────┘
║ description (Text)    ║        ║ product_id (FK) ────╮
║ price (Decimal)       ║        ║ quantity (Integer)     │
║ category (Varchar)    ║        ║ unit_price (Decimal) ║
║ stock_quantity (Int)  ║        ║                      ║
╚═══════════════════════╝        ╚══════════════════════╝
```

### Migrations

```bash
# Run migrations
cd Architecture/SmartStore/Backend_Application
node Database_Layer/migration.js

# Add migration for status column
ALTER TABLE "Orders"
ADD COLUMN status VARCHAR(20) DEFAULT 'PENDING';

# Add migration for phone number
ALTER TABLE "Orders"
ADD COLUMN phonenumber VARCHAR(20) DEFAULT 'PENDING';
```

### Seed Data

```bash
# Add admin user
INSERT INTO "Users" (name, email, password, role) VALUES
('Admin User', [EMAIL_ADDRESS]', '$2a$10$abcdef...', 'ADMIN');

# Add products
INSERT INTO "Products" (name, description, price, category, stock_quantity) VALUES
('Laptop', 'High performance laptop', 1200.00, 'Electronics', 10),
('Mouse', 'Wireless optical mouse', 25.00, 'Accessories', 50);
```

## 🔄 Deployment

### Using Docker

**Build and run:**
```bash
cd Architecture/SmartStore/Deployment
docker-compose