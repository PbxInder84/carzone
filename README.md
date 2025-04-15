# Carzone - Car Accessories E-commerce Platform

An e-commerce platform for car accessories built with the MERN stack (MySQL, Express, React, Node.js).

## Features

- User authentication and authorization with JWT
- Admin dashboard for managing products, categories, orders, and users
- Seller dashboard for managing products and orders
- Customer shopping cart and checkout process
- Product reviews and ratings
- Responsive design using Tailwind CSS

## Tech Stack

- **Frontend**: React, Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MySQL (v5.7 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```powershell
   git clone https://github.com/your-username/carzone.git
   cd carzone
   ```

2. Install the dependencies:
   ```powershell
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. Create a `.env` file in the root directory based on the `.env.example` template:
   ```powershell
   Copy-Item .env.example .env
   # Then edit the .env file with your specific configurations
   ```

4. Create the database:
   ```powershell
   # Connect to MySQL (Windows)
   mysql -u root -p
   
   # Create the database
   CREATE DATABASE carzone;
   
   # Exit MySQL
   exit
   ```

5. Initialize the database schema:
   ```powershell
   # Run the database migration
   mysql -u root -p carzone < .docs/schema.sql
   ```

6. Start the development server:
   ```powershell
   # Run both frontend and backend concurrently
   npm run dev
   
   # Run backend only
   npm run server
   
   # Run frontend only
   npm run client
   ```

## Development Setup

### Database Sync (Development Only)

To automatically sync your Sequelize models with the database during development:

1. Set `SYNC_DB=true` in your `.env` file.

   > **Warning**: This will modify your database schema to match your models. Use with caution in development environments.

2. Start the development server: `npm run dev`

### Running with Mock Data

1. When the backend is not running or still in development, the frontend can use mock data by detecting 404 errors from API calls.

2. This enables frontend developers to work independently from the backend team.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/logout` - Logout the current user
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create a new user (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/role` - Update user role (admin only)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/image` - Upload product image

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   ```powershell
   # Check if MySQL service is running
   Get-Service -Name "MySQL*"
   
   # Start MySQL service if stopped
   Start-Service -Name "MySQL*"
   ```

2. **Port Already in Use**:
   ```powershell
   # Find process using port 5000 (backend)
   netstat -ano | findstr :5000
   
   # Kill the process using the identified PID
   Stop-Process -Id <PID> -Force
   ```

3. **Node Module Issues**:
   ```powershell
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -r -fo node_modules
   npm install
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [JWT](https://jwt.io/) 