# CareZone Car Accessories E-commerce Platform

A full-stack web application for buying and selling car accessories online. The platform supports multiple user roles including admin, seller, and regular users.

## Features

### User Roles
- **Admin**: Full control over the system. Can manage users, sellers, products, and orders.
- **Seller**: Can create and manage their own products, view orders for their products, and manage shipping status.
- **User (Customer)**: Can browse products, add to cart, place orders, track orders, and leave reviews.

### Key Functionalities
- User authentication and authorization
- Product browsing and searching with filters
- Shopping cart management
- Order processing and tracking
- Product reviews and ratings
- Seller dashboard for product management
- Admin dashboard for overall system management
- Responsive design for mobile and desktop

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Formik & Yup for form validation
- Axios for API requests

### Backend
- Node.js with Express.js
- Sequelize ORM
- MySQL/PostgreSQL database
- JWT for authentication
- Bcrypt for password hashing

## Project Structure

```
├── backend/               # Node.js & Express backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Custom middlewares
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
│
├── frontend/              # React.js frontend
│   ├── public/            # Static files
│   └── src/               # Source files
│       ├── app/           # Redux store
│       ├── components/    # UI components
│       ├── features/      # Redux slices
│       └── pages/         # Page components
│
└── .docs/                 # Documentation files
    └── schema.sql         # Database schema
```

## Getting Started

### Prerequisites
- Node.js >= 14.x
- npm >= 6.x
- MySQL or PostgreSQL

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/carzone.git
cd carzone
```

2. Set up backend
```bash
cd backend
npm install
cp .env.example .env  # Create and configure your .env file
npm run dev
```

3. Set up frontend
```bash
cd frontend
npm install
npm start
```

4. Create and set up the database
```bash
# Create database using your database client
# Then run the schema from .docs/schema.sql
```

The backend server will run on http://localhost:5000 and the frontend development server on http://localhost:3000.

## API Documentation

The API documentation for the backend endpoints can be found in the [backend README](./backend/README.md).

## License

MIT 