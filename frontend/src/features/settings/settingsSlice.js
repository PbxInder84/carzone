import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import * as settingsService from '../../db/settingsService';

const initialState = {
  settings: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Get all settings
export const getSettings = createAsyncThunk(
  'settings/getAll',
  async (_, thunkAPI) => {
    try {
      return await settingsService.getAllSettings();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get setting by key
export const getSettingByKey = createAsyncThunk(
  'settings/getByKey',
  async (key, thunkAPI) => {
    try {
      return await settingsService.getSettingByKey(key);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update multiple settings
export const updateMultipleSettings = createAsyncThunk(
  'settings/updateMultiple',
  async (settings, thunkAPI) => {
    try {
      const response = await settingsService.updateSettings(settings);
      toast.success('Settings updated successfully');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update settings';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update single setting
export const updateSingleSetting = createAsyncThunk(
  'settings/updateSingle',
  async ({ key, ...settingData }, thunkAPI) => {
    try {
      const response = await settingsService.updateSetting(key, settingData);
      toast.success(`Setting "${key}" updated successfully`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || `Failed to update "${key}"`;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Initialize default settings
export const initSettings = createAsyncThunk(
  'settings/initialize',
  async (_, thunkAPI) => {
    try {
      const response = await settingsService.initializeSettings();
      toast.success('Settings initialized successfully');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to initialize settings';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete setting
export const deleteSingleSetting = createAsyncThunk(
  'settings/delete',
  async (key, thunkAPI) => {
    try {
      const response = await settingsService.deleteSetting(key);
      toast.success(`Setting "${key}" deleted successfully`);
      return { key, response };
    } catch (error) {
      const message = error.response?.data?.message || error.message || `Failed to delete "${key}"`;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    resetSettings: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all settings
      .addCase(getSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.settings = action.payload;
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get setting by key
      .addCase(getSettingByKey.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSettingByKey.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // This fetches a single setting by key, but we're not storing it separately
        // It's used mainly for specific settings access without changing the main state
      })
      .addCase(getSettingByKey.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update multiple settings
      .addCase(updateMultipleSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMultipleSettings.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        // We'll fetch the settings again after updating to get the latest values
      })
      .addCase(updateMultipleSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update single setting
      .addCase(updateSingleSetting.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSingleSetting.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Update the setting in the local state
        const { key, value, group } = action.payload;
        if (state.settings[group] && state.settings[group][key]) {
          state.settings[group][key].value = value;
        }
      })
      .addCase(updateSingleSetting.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Initialize settings
      .addCase(initSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initSettings.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        // We'll fetch the settings again after initializing
      })
      .addCase(initSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete setting
      .addCase(deleteSingleSetting.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSingleSetting.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Remove the setting from local state
        const { key } = action.payload;
        Object.keys(state.settings).forEach(group => {
          if (state.settings[group] && state.settings[group][key]) {
            delete state.settings[group][key];
          }
        });
      })
      .addCase(deleteSingleSetting.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer; 