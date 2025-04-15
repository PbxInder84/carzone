import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSettings, getSettingByKey } from '../features/settings/settingsSlice';

/**
 * Custom hook for accessing site settings with optional auto-loading
 * 
 * @param {Object} options - Hook options
 * @param {boolean} options.autoLoad - Automatically load settings on mount
 * @param {string} options.specificKey - Get a specific setting by key
 * @param {string} options.group - Filter settings by group name
 * @returns {Object} - Settings data and utility functions
 */
export const useSettings = ({ autoLoad = true, specificKey = null, group = null } = {}) => {
  const dispatch = useDispatch();
  const { settings, isLoading, isError, message } = useSelector((state) => state.settings);
  const [specificSetting, setSpecificSetting] = useState(null);
  
  // Define these functions with useCallback to avoid dependency issues
  const loadAllSettings = useCallback(async () => {
    await dispatch(getSettings());
  }, [dispatch]);
  
  const loadSpecificSetting = useCallback(async (key) => {
    try {
      const resultAction = await dispatch(getSettingByKey(key));
      if (getSettingByKey.fulfilled.match(resultAction)) {
        setSpecificSetting(resultAction.payload);
      }
    } catch (error) {
      console.error('Error loading specific setting:', error);
    }
  }, [dispatch]);
  
  // Load settings on mount if autoLoad is true
  useEffect(() => {
    if (autoLoad) {
      if (specificKey) {
        loadSpecificSetting(specificKey);
      } else {
        loadAllSettings();
      }
    }
  }, [autoLoad, specificKey, loadAllSettings, loadSpecificSetting]);
  
  // Helper to get a setting value by key with a fallback
  const getSetting = (key, fallback = null) => {
    if (specificKey === key && specificSetting) {
      return specificSetting.value || fallback;
    }
    
    // Look through all setting groups for the key
    for (const groupName in settings) {
      if (settings[groupName] && settings[groupName][key]) {
        return settings[groupName][key].value;
      }
    }
    
    return fallback;
  };
  
  // Get all settings in a specific group
  const getGroupSettings = (groupName) => {
    return settings[groupName] || {};
  };
  
  // Get all setting groups
  const getGroups = () => {
    return Object.keys(settings);
  };
  
  // Filter settings if group is provided
  const filteredSettings = group && settings 
    ? { [group]: settings[group] || {} } 
    : settings;
  
  return {
    settings: filteredSettings,
    isLoading,
    isError,
    message,
    getSetting,
    getGroupSettings,
    getGroups,
    loadAllSettings,
    loadSpecificSetting,
    specificSetting
  };
}; 