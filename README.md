# E-Commerce-Full-Stack-Web-Application-using-Fast-API

A modern, responsive e-commerce web application with a React frontend and a FastAPI backend. Features include product listing, admin product management, cart functionality, user authentication, order placement, and user/admin role management.

---

## Features

- **User Authentication**: Register, login, and role-based access (user/admin).
- **Product Management**: List, search, sort, add, edit, and delete products (admin only for management).
- **Cart**: Add to cart, update quantity, remove items, and view cart summary.
- **Order Placement**: Place orders from cart, view order history with product details.
- **Admin Panel**: Manage products and view all orders (future: manage order status).
- **Modern UI/UX**: Responsive design using Bootstrap and custom CSS.

---

## Project Structure

```
/Readme.md
/Application/
  frontend/         # React frontend
  backend/
    ecommerce-backend/  # FastAPI backend
      app/
        api/           # API endpoints
        models/        # SQLAlchemy models
        schemas/       # Pydantic schemas
        crud/          # CRUD logic
        db/            # DB session and base
      requirements.txt # Backend dependencies
```

---

## Setup Guide

### Prerequisites
- Node.js (v18+ recommended)
- Python 3.10+
- (Optional) Virtualenv for backend

### 1. Backend Setup

```bash
cd Application/backend/ecommerce-backend
# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate [MacOs]
venv\Scripts\activate [Windows]

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload
```

- The backend will be available at `http://localhost:8000`.
- API docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd Application/frontend
npm install
npm run dev
```

- The frontend will be available at `http://localhost:5173` (or refer terminal output).

---

## Usage

- Register a new user or login.
- Browse products, add to cart, update quantities, and place orders.
- Hover on Icons in the NavBar to understand the significance provided via tooltip.
- Admin users can add/edit/delete products and view orders/transactions.
- View your profile and upgrade to admin.

---

## Environment Variables

- The frontend expects the backend at `http://localhost:8000` by default. Update API URLs in `/frontend/src/api/` if needed.
- The backend uses SQLite by default (`app.db`).


