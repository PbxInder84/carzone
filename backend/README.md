# CareZone Car Accessories E-commerce Backend

This is the backend API for the CareZone Car Accessories E-commerce platform built with Node.js, Express, and Sequelize.

## Features

- Authentication and authorization (JWT)
- User roles (Admin, Seller, User)
- Product management
- Order processing
- Shopping cart functionality
- Review system
- Coupon system

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- MySQL/PostgreSQL
- JWT Authentication
- Bcrypt for password hashing
- Joi for validation

## Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Configure environment variables by creating a `.env` file in the root directory (use `.env.example` as a template)

4. Create the database

```bash
# If using MySQL
mysql -u root -p
CREATE DATABASE carzone;
EXIT;
```

5. Run the server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user profile
- GET `/api/auth/logout` - Logout user

### Products

- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get a single product
- POST `/api/products` - Create a new product (Seller, Admin)
- PUT `/api/products/:id` - Update a product (Seller, Admin)
- DELETE `/api/products/:id` - Delete a product (Seller, Admin)

### Orders

- GET `/api/orders` - Get all orders (User gets own orders, Seller gets orders with their products, Admin gets all)
- GET `/api/orders/:id` - Get a single order
- POST `/api/orders` - Create a new order
- PUT `/api/orders/:id` - Update order status (Seller, Admin)

### Reviews

- GET `/api/products/:productId/reviews` - Get reviews for a product
- POST `/api/products/:productId/reviews` - Create a review for a product
- PUT `/api/reviews/:id` - Update a review
- DELETE `/api/reviews/:id` - Delete a review

### Cart

- GET `/api/cart` - Get user's cart
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/:id` - Update cart item quantity
- DELETE `/api/cart/:id` - Remove item from cart
- DELETE `/api/cart` - Clear cart

## Database Schema

The database schema can be found in the `.docs/schema.sql` file.

## License

MIT 