import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as categoryService from '../../db/categoryService';
import { toast } from 'react-toastify';

const initialState = {
  categories: [],
  category: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all categories
export const getCategories = createAsyncThunk(
  'categories/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await categoryService.getAllCategories();
      return response;
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

// Get single category
export const getCategory = createAsyncThunk(
  'categories/getOne',
  async (id, thunkAPI) => {
    try {
      const response = await categoryService.getCategoryById(id);
      return response;
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

// Create new category
export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, thunkAPI) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      toast.success('Category created successfully');
      return response;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.error) ||
        error.message ||
        error.toString();
      
      toast.error(`Failed to create category: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await categoryService.updateCategory(id, data);
      toast.success('Category updated successfully');
      return response;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.error) ||
        error.message ||
        error.toString();
      
      toast.error(`Failed to update category: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, thunkAPI) => {
    try {
      await categoryService.deleteCategory(id);
      toast.success('Category deleted successfully');
      return id;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.error) ||
        error.message ||
        error.toString();
      
      toast.error(`Failed to delete category: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategoryState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    resetCategory: (state) => {
      state.category = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all categories
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload.data;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get single category
      .addCase(getCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.category = action.payload.data;
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories.push(action.payload.data);
        state.message = 'Category created successfully';
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update category in list if exists
        const index = state.categories.findIndex(cat => cat.id === action.payload.data.id);
        if (index !== -1) {
          state.categories[index] = action.payload.data;
        }
        // Update single category view if needed
        if (state.category && state.category.id === action.payload.data.id) {
          state.category = action.payload.data;
        }
        state.message = 'Category updated successfully';
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload
        );
        state.message = 'Category deleted successfully';
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetCategoryState, resetCategory } = categorySlice.actions;
export default categorySlice.reducer; 