# README for Simple E-Commerce Backend with FastAPI

## Project Overview

This project is a simple e-commerce backend built using FastAPI. It provides core functionalities such as user authentication, product management, shopping cart, and order placement. The system implements role-based access control (RBAC) and utilizes SQLite with SQLAlchemy for data management.

## Features

- User registration and login with JWT-based authentication
- Role management for Admin and Regular users
- Product management with CRUD operations
- Shopping cart functionality for users
- Order placement and tracking
- RESTful API endpoints for all functionalities

## Tech Stack

- **Backend Framework**: FastAPI
- **Database**: SQLite (with SQLAlchemy ORM)
- **Authentication**: JWT using PyJWT or fastapi-jwt-auth
- **Password Hashing**: bcrypt
- **Testing**: Pytest
- **Documentation**: Auto-generated Swagger docs
- **Environment Management**: Pydantic `.env` support

## Project Structure

```
ecommerce-backend/
├── app/                  # Application code
│   ├── api/              # API routes
│   ├── core/             # Core functionalities
│   ├── models/           # Database models
│   ├── schemas/          # Pydantic schemas
│   ├── crud/             # CRUD operations
│   ├── db/               # Database session management
│   └── tests/            # Unit tests
├── alembic.ini           # Alembic configuration for migrations
├── requirements.txt      # Project dependencies
├── .env                  # Environment variables
└── README.md             # Project documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd ecommerce-backend
   ```

2. **Create a virtual environment**:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies**:
   ```
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   Create a `.env` file in the root directory and add your configuration settings, such as database URL and secret keys.

5. **Run the application**:
   ```
   uvicorn app.main:app --reload
   ```

6. **Access the API documentation**:
   Open your browser and go to `http://127.0.0.1:8000/docs` to view the Swagger UI.

## Usage

- Use the provided API endpoints for user registration, product management, cart operations, and order management.
- Refer to the API documentation for detailed information on each endpoint.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.