import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSave, FaTimes, FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Spinner from '../../components/layout/Spinner';
import SettingsGroup from '../../components/settings/SettingsGroup';
import { 
  getSettings, 
  updateMultipleSettings, 
  initSettings 
} from '../../features/settings/settingsSlice';

const titleCaseGroup = (group) => {
  return group.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const groupDescriptions = {
  general: 'Basic information about your store',
  appearance: 'Customize the look and feel of your store',
  contact: 'Contact information displayed to customers',
  commerce: 'Shipping, tax, and payment settings',
  features: 'Enable or disable site features',
};

const Settings = () => {
  const dispatch = useDispatch();
  
  const { settings, isLoading, isError, message } = useSelector(
    (state) => state.settings
  );
  
  const [localSettings, setLocalSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  // Update local settings when Redux settings change
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setLocalSettings(settings);
    }
  }, [settings]);

  // Validate settings
  const validateSettings = () => {
    const newErrors = {};
    let isValid = true;

    // Loop through all settings
    Object.keys(localSettings).forEach(group => {
      const groupSettings = localSettings[group];
      
      Object.keys(groupSettings).forEach(key => {
        const setting = groupSettings[key];
        const value = setting.value;
        
        // Required validation
        if (value === undefined || value === null || value === '') {
          newErrors[key] = 'This field is required';
          isValid = false;
        }
        
        // Type-specific validation
        switch (setting.type) {
          case 'number':
            if (isNaN(parseFloat(value))) {
              newErrors[key] = 'Must be a valid number';
              isValid = false;
            }
            break;
          case 'json':
            if (typeof value === 'string') {
              try {
                JSON.parse(value);
              } catch (error) {
                newErrors[key] = 'Must be valid JSON';
                isValid = false;
              }
            }
            break;
          case 'color':
            if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
              newErrors[key] = 'Must be a valid hex color';
              isValid = false;
            }
            break;
          default:
            // No additional validation for other types
            break;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle setting change
  const handleSettingChange = (key, value, type) => {
    setHasChanges(true);
    
    // Find which group contains this key
    let targetGroup = null;
    Object.keys(localSettings).forEach(group => {
      if (localSettings[group] && localSettings[group][key]) {
        targetGroup = group;
      }
    });
    
    if (targetGroup) {
      setLocalSettings({
        ...localSettings,
        [targetGroup]: {
          ...localSettings[targetGroup],
          [key]: {
            ...localSettings[targetGroup][key],
            value: value
          }
        }
      });
      
      // Clear any error for this field
      if (errors[key]) {
        setErrors({
          ...errors,
          [key]: undefined
        });
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate settings
    if (!validateSettings()) {
      toast.error('Please fix the errors before saving');
      return;
    }
    
    setSaving(true);
    
    try {
      // Prepare settings for update
      const settingsToUpdate = {};
      
      // Log local settings before preparing update
      console.log('Local settings before update:', localSettings);
      
      Object.keys(localSettings).forEach(group => {
        const groupSettings = localSettings[group];
        
        Object.keys(groupSettings).forEach(key => {
          // Handling JSON values
          let value = groupSettings[key].value;
          const type = groupSettings[key].type;
          
          // Make sure JSON values are properly formatted
          if (type === 'json' && typeof value === 'object') {
            // It's already an object, no need to parse
            settingsToUpdate[key] = value;
          } else if (type === 'json' && typeof value === 'string') {
            try {
              // Try to parse string to ensure it's valid JSON
              const parsedValue = JSON.parse(value);
              settingsToUpdate[key] = parsedValue;
            } catch (error) {
              console.error(`Invalid JSON for key ${key}:`, value);
              // Use the original value if parsing fails
              settingsToUpdate[key] = value;
            }
          } else {
            // For other types, just use the value directly
            settingsToUpdate[key] = value;
          }
        });
      });
      
      // Log what we're about to send to the API
      console.log('Settings to update:', settingsToUpdate);
      
      // Dispatch update action
      const result = await dispatch(updateMultipleSettings(settingsToUpdate)).unwrap();
      console.log('Update settings result:', result);
      
      // Refresh settings to ensure we have the latest data
      await dispatch(getSettings());
      
      setHasChanges(false);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Settings update error:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Unknown error occurred';
      toast.error(`Failed to save settings: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    dispatch(getSettings());
    setHasChanges(false);
    setErrors({});
  };
  
  // Handle initialization of default settings
  const handleInitialize = async () => {
    if (window.confirm('This will reset all settings to default values. Are you sure?')) {
      try {
        setSaving(true);
        await dispatch(initSettings()).unwrap();
        await dispatch(getSettings());
        toast.success('Settings initialized successfully');
      } catch (error) {
        toast.error('Failed to initialize settings: ' + error.message);
      } finally {
        setSaving(false);
      }
    }
  };

  if (isLoading && !Object.keys(localSettings).length) {
    return <Spinner />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Site Settings</h1>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleInitialize}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            disabled={saving}
          >
            <FaSync className="mr-2" /> Initialize Default Settings
          </button>
        </div>
      </div>
      
      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium">Error loading settings</h3>
          <p>{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {Object.keys(localSettings).length > 0 ? (
          <>
            {Object.keys(localSettings).map((group) => (
              <SettingsGroup
                key={group}
                title={titleCaseGroup(group)}
                description={groupDescriptions[group] || ''}
                settings={localSettings[group]}
                onSettingChange={handleSettingChange}
                isDisabled={saving}
                errors={errors}
                defaultExpanded={true}
              />
            ))}
            
            <div className="p-6 flex justify-end space-x-3 sticky bottom-0 bg-white shadow-md rounded-lg">
              <button
                type="button"
                onClick={handleReset}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center"
                disabled={saving || !hasChanges}
              >
                <FaTimes className="mr-2" /> Reset
              </button>
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center"
                disabled={saving || !hasChanges}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Save Settings
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 mb-4">No settings found. Initialize default settings to get started.</p>
            <button
              type="button"
              onClick={handleInitialize}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
              disabled={saving}
            >
              <FaSync className="mr-2" /> Initialize Settings
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Settings; 