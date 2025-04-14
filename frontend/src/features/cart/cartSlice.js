import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../db/apiClient';

const initialState = {
  cartItems: [],
  cartTotal: 0,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get cart items
export const getCartItems = createAsyncThunk(
  'cart/getItems',
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get('/cart');
      return response.data;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.error) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add item to cart
export const addToCart = createAsyncThunk(
  'cart/addItem',
  async (cartData, thunkAPI) => {
    try {
      const response = await apiClient.post('/cart', cartData);
      return response.data;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.error) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async (cartData, thunkAPI) => {
    try {
      const response = await apiClient.put(`/cart/${cartData.id}`, { 
        quantity: cartData.quantity 
      });
      
      return response.data;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.error) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (id, thunkAPI) => {
    try {
      await apiClient.delete(`/cart/${id}`);
      return id;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.error) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, thunkAPI) => {
    try {
      await apiClient.delete('/cart');
      return;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.error) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart Items
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cartItems = action.payload.data;
        state.cartTotal = action.payload.total;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Check if the item already exists, replace it or add new
        const itemExists = state.cartItems.findIndex(
          (item) => item.id === action.payload.data.id
        );
        
        if (itemExists >= 0) {
          state.cartItems[itemExists] = action.payload.data;
        } else {
          state.cartItems.push(action.payload.data);
        }
        
        // Recalculate total
        state.cartTotal = state.cartItems.reduce((total, item) => {
          return total + (item.quantity * item.product.price);
        }, 0);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Update the item in cart
        const index = state.cartItems.findIndex(
          (item) => item.id === action.payload.data.id
        );
        
        if (index >= 0) {
          state.cartItems[index] = action.payload.data;
        }
        
        // Recalculate total
        state.cartTotal = state.cartItems.reduce((total, item) => {
          return total + (item.quantity * item.product.price);
        }, 0);
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Remove item from cart
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== action.payload
        );
        
        // Recalculate total
        state.cartTotal = state.cartItems.reduce((total, item) => {
          return total + (item.quantity * item.product.price);
        }, 0);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cartItems = [];
        state.cartTotal = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer; 