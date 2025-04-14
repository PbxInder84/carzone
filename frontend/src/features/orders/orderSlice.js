import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../db/orderService';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  orders: [],
  userOrders: [],
  currentOrder: null,
  paymentIntent: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all orders (admin)
export const getOrders = createAsyncThunk(
  'orders/getAll',
  async (_, thunkAPI) => {
    try {
      return await orderService.getOrders();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch orders';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user orders
export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, thunkAPI) => {
    try {
      return await orderService.getUserOrders();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch your orders';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get order by ID
export const getOrderById = createAsyncThunk(
  'orders/getById',
  async (id, thunkAPI) => {
    try {
      return await orderService.getOrderById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch order details';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create order
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, thunkAPI) => {
    try {
      return await orderService.createOrder(orderData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create order';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      return await orderService.updateOrderStatus(id, status);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update order status';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create payment intent
export const createPaymentIntent = createAsyncThunk(
  'orders/createPaymentIntent',
  async (orderId, thunkAPI) => {
    try {
      return await orderService.createPaymentIntent(orderId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create payment intent';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Confirm payment
export const confirmPayment = createAsyncThunk(
  'orders/confirmPayment',
  async ({ orderId, paymentData }, thunkAPI) => {
    try {
      return await orderService.confirmPayment(orderId, paymentData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to confirm payment';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Order slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearPaymentIntent: (state) => {
      state.paymentIntent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all orders
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Get user orders
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userOrders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Get order by ID
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentOrder = action.payload;
        toast.success('Order created successfully');
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Update the order in the orders array
        state.orders = state.orders.map((order) => 
          order.id === action.payload.id ? action.payload : order
        );
        
        // Update current order if it's the one being updated
        if (state.currentOrder && state.currentOrder.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
        
        toast.success('Order status updated successfully');
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Create payment intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.paymentIntent = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Confirm payment
      .addCase(confirmPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Update the order in the orders arrays
        if (state.orders.length > 0) {
          state.orders = state.orders.map((order) => 
            order.id === action.payload.id ? action.payload : order
          );
        }
        
        if (state.userOrders.length > 0) {
          state.userOrders = state.userOrders.map((order) => 
            order.id === action.payload.id ? action.payload : order
          );
        }
        
        // Update current order
        if (state.currentOrder && state.currentOrder.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
        
        toast.success('Payment confirmed successfully');
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { reset, clearCurrentOrder, clearPaymentIntent } = orderSlice.actions;
export default orderSlice.reducer; 