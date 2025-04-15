import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import reviewService from './reviewService';

const initialState = {
  productReviews: [],
  userReviews: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  canReview: false,
};

// Get reviews for a product
export const getProductReviews = createAsyncThunk(
  'reviews/getProductReviews',
  async (productId, thunkAPI) => {
    try {
      return await reviewService.getProductReviews(productId);
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

// Get user's reviews
export const getUserReviews = createAsyncThunk(
  'reviews/getUserReviews',
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await reviewService.getUserReviews(userId, token);
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

// Create new review
export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ productId, reviewData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await reviewService.createReview(productId, reviewData, token);
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

// Update review
export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await reviewService.updateReview(reviewId, reviewData, token);
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

// Delete review
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await reviewService.deleteReview(reviewId, token);
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

// Check if user can review a product
export const checkCanReview = createAsyncThunk(
  'reviews/checkCanReview',
  async (productId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await reviewService.checkCanReview(productId, token);
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

export const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get product reviews
      .addCase(getProductReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.productReviews = action.payload.data;
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get user reviews
      .addCase(getUserReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userReviews = action.payload.data;
      })
      .addCase(getUserReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Create review
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success('Review submitted successfully!');
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReview.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success('Review updated successfully!');
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success('Review deleted successfully!');
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      
      // Check if user can review
      .addCase(checkCanReview.pending, (state) => {
        state.isLoading = true;
        state.canReview = false;
      })
      .addCase(checkCanReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.canReview = action.payload.canReview;
      })
      .addCase(checkCanReview.rejected, (state) => {
        state.isLoading = false;
        state.canReview = false;
      });
  },
});

export const { reset } = reviewSlice.actions;
export default reviewSlice.reducer; 