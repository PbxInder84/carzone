import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import productReducer from '../features/products/productSlice';
import categoryReducer from '../features/categories/categorySlice';
import userReducer from '../features/users/userSlice';
import checkoutReducer from '../features/checkout/checkoutSlice';
import settingsReducer from '../features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    categories: categoryReducer,
    users: userReducer,
    checkout: checkoutReducer,
    settings: settingsReducer,
  },
}); 