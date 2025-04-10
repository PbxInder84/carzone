# CareZone Car Accessories E-commerce Frontend

This is the frontend for the CareZone Car Accessories E-commerce platform built with React.js and Tailwind CSS.

## Features

- User authentication (Login, Register)
- Product browsing and searching
- Shopping cart functionality
- Order management
- User dashboard
- Seller dashboard
- Admin dashboard
- Responsive design

## Tech Stack

- React.js
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Formik & Yup for form validation
- Axios for API requests
- React Icons

## Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Configure environment variables by creating a `.env` file in the root directory (if needed)

4. Start the development server

```bash
npm start
```

## Project Structure

```
src/
├── app/                # Redux store configuration
├── components/         # Reusable components
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   ├── products/       # Product-related components
│   └── ...
├── features/           # Redux slices and related logic
│   ├── auth/           # Authentication feature
│   ├── cart/           # Cart feature 
│   ├── products/       # Products feature
│   └── ...
├── pages/              # Page components
├── utils/              # Utility functions
├── App.js              # Main App component
└── index.js            # Entry point
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## License

MIT
