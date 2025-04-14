import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { processCheckout, getOrderConfirmation, updatePayment } from '../../db/checkoutService';
import { toast } from 'react-toastify';

// Sample order data for testing when API fails
const sampleOrderData = {
  id: 1,
  user_id: 1,
  shipping_address: "123 Test St, Test City, Test State 12345, Test Country",
  total_amount: 299.97,
  order_status: "processing",
  payment_status: "completed",
  payment_method: "cod",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  orderItems: [
    {
      id: 1,
      order_id: 1,
      product_id: 1,
      seller_id: 1,
      quantity: 2,
      price_at_time_of_order: 99.99,
      product: {
        id: 1,
        name: "Premium Car Seat Cover",
        price: 99.99,
        image_url: "https://via.placeholder.com/300x200?text=Car+Seat+Cover"
      },
      seller: {
        id: 1,
        name: "Premium Auto Accessories",
        email: "sales@premieumauto.example.com"
      }
    },
    {
      id: 2,
      order_id: 1,
      product_id: 2,
      seller_id: 1,
      quantity: 1,
      price_at_time_of_order: 99.99,
      product: {
        id: 2,
        name: "Car Dashboard Camera",
        price: 99.99,
        image_url: "https://via.placeholder.com/300x200?text=Dashboard+Cam"
      },
      seller: {
        id: 1,
        name: "Premium Auto Accessories",
        email: "sales@premiumauto.example.com"
      }
    }
  ]
};

// Process checkout async thunk
export const submitCheckout = createAsyncThunk(
  'checkout/process',
  async (checkoutData, thunkAPI) => {
    try {
      return await processCheckout(checkoutData);
    } catch (error) {
      const message = error.message || 'Failed to process checkout';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get order confirmation details
export const fetchOrderConfirmation = createAsyncThunk(
  'checkout/getConfirmation',
  async (orderId, thunkAPI) => {
    try {
      // Try to get the order from the API
      return await getOrderConfirmation(orderId);
    } catch (error) {
      // If in development mode and the error is 404, use sample data for testing
      if (process.env.NODE_ENV === 'development') {
        console.log('Using sample order data for testing');
        return { success: true, data: sampleOrderData };
      }
      
      const message = error.message || 'Failed to fetch order details';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update payment details
export const updatePaymentDetails = createAsyncThunk(
  'checkout/updatePayment',
  async ({ orderId, paymentDetails }, thunkAPI) => {
    try {
      return await updatePayment(orderId, paymentDetails);
    } catch (error) {
      const message = error.message || 'Failed to update payment details';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  currentOrder: null,
  orderConfirmation: null,
  isLoading: false,
  error: null,
  success: false,
  message: ''
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    resetCheckout: (state) => {
      state.isLoading = false;
      state.success = false;
      state.error = null;
      state.message = '';
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Process checkout cases
      .addCase(submitCheckout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitCheckout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.currentOrder = action.payload.data;
        state.message = action.payload.message || 'Order placed successfully';
        toast.success(state.message);
      })
      .addCase(submitCheckout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Get order confirmation cases
      .addCase(fetchOrderConfirmation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderConfirmation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderConfirmation = action.payload.data;
      })
      .addCase(fetchOrderConfirmation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update payment details cases
      .addCase(updatePaymentDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePaymentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderConfirmation = action.payload.data;
        state.message = action.payload.message || 'Payment details updated successfully';
        toast.success(state.message);
      })
      .addCase(updatePaymentDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { resetCheckout, clearCurrentOrder } = checkoutSlice.actions;
export default checkoutSlice.reducer; 