import apiClient from './apiClient';

// Get all settings
export const getAllSettings = async () => {
  try {
    console.log('Fetching all settings...');
    const response = await apiClient.get('/settings');
    console.log('Settings response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching settings:', error.response?.data || error.message);
    throw error;
  }
};

// Get a specific setting by key
export const getSettingByKey = async (key) => {
  try {
    console.log(`Fetching setting by key: ${key}`);
    const response = await apiClient.get(`/settings/${key}`);
    console.log('Setting response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error.response?.data || error.message);
    throw error;
  }
};

// Update multiple settings at once (admin only)
export const updateSettings = async (settings) => {
  try {
    console.log('Updating multiple settings:', settings);
    const response = await apiClient.put('/settings', { settings });
    console.log('Update settings response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error.response?.data || error.message);
    throw error;
  }
};

// Update a single setting (admin only)
export const updateSetting = async (key, settingData) => {
  try {
    console.log(`Updating setting ${key}:`, settingData);
    const response = await apiClient.put(`/settings/${key}`, settingData);
    console.log('Update setting response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error.response?.data || error.message);
    throw error;
  }
};

// Delete a setting (admin only)
export const deleteSetting = async (key) => {
  try {
    console.log(`Deleting setting: ${key}`);
    const response = await apiClient.delete(`/settings/${key}`);
    console.log('Delete setting response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting setting ${key}:`, error.response?.data || error.message);
    throw error;
  }
};

// Initialize default settings (admin only)
export const initializeSettings = async () => {
  try {
    console.log('Initializing default settings...');
    const response = await apiClient.post('/settings/init');
    console.log('Initialize settings response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error initializing settings:', error.response?.data || error.message);
    throw error;
  }
}; 