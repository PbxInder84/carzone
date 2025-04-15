import React from 'react';
import PropTypes from 'prop-types';
import { HexColorPicker } from 'react-colorful';

/**
 * Component to render appropriate input for different setting types
 */
const SettingField = ({ 
  setting, 
  value, 
  onChange, 
  disabled = false,
  className = '',
  errorMessage = null
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    
    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'number') {
      newValue = parseFloat(value);
    }
    
    onChange(name, newValue, setting.type);
  };
  
  const handleJsonChange = (e, property) => {
    try {
      // Parse current value if it's a string
      let currentValue = value;
      if (typeof currentValue === 'string') {
        currentValue = JSON.parse(currentValue);
      } else if (!currentValue) {
        currentValue = {};
      }
      
      // Create a new object with the updated property
      const updatedValue = {
        ...currentValue,
        [property]: e.target.value
      };
      
      // Pass the updated JSON object
      onChange(setting.key, updatedValue, 'json');
    } catch (error) {
      console.error('Error updating JSON value', error);
    }
  };
  
  const handleColorChange = (color) => {
    onChange(setting.key, color, 'color');
  };
  
  // Ensure setting.key exists, use a fallback if not
  const settingKey = setting.key || `setting-${Math.random().toString(36).substr(2, 9)}`;
  
  switch (setting.type) {
    case 'string':
      return (
        <input
          type="text"
          id={settingKey}
          name={settingKey}
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${className} ${errorMessage ? 'border-red-500' : ''}`}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${settingKey}-error` : undefined}
        />
      );
      
    case 'number':
      return (
        <input
          type="number"
          id={settingKey}
          name={settingKey}
          value={value || 0}
          onChange={handleChange}
          disabled={disabled}
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${className} ${errorMessage ? 'border-red-500' : ''}`}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${settingKey}-error` : undefined}
          step="any"
        />
      );
      
    case 'boolean':
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            id={settingKey}
            name={settingKey}
            checked={value === true}
            onChange={handleChange}
            disabled={disabled}
            className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 ${className} ${errorMessage ? 'border-red-500' : ''}`}
            aria-invalid={!!errorMessage}
            aria-describedby={errorMessage ? `${settingKey}-error` : undefined}
          />
          <label htmlFor={settingKey} className="ml-2 text-sm text-gray-700">
            {setting.label}
          </label>
        </div>
      );
      
    case 'color':
      return (
        <div>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md border border-gray-300"
              style={{ backgroundColor: value }}
              aria-hidden="true"
            />
            <input
              type="text"
              id={settingKey}
              name={settingKey}
              value={value || ''}
              onChange={handleChange}
              disabled={disabled}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${className} ${errorMessage ? 'border-red-500' : ''}`}
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? `${settingKey}-error` : undefined}
            />
          </div>
          <div className="mt-2">
            <HexColorPicker 
              color={value} 
              onChange={handleColorChange} 
              className="w-full max-w-xs rounded-md shadow" 
            />
          </div>
        </div>
      );
      
    case 'json':
      try {
        let jsonValue = {};
        if (typeof value === 'string' && value.trim()) {
          jsonValue = JSON.parse(value);
        } else if (typeof value === 'object' && value !== null) {
          jsonValue = value;
        }
        
        return (
          <div className="space-y-3">
            {Object.keys(jsonValue).map((key) => (
              <div key={`${settingKey}-${key}`} className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  value={jsonValue[key] || ''}
                  onChange={(e) => handleJsonChange(e, key)}
                  disabled={disabled}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${className} ${errorMessage ? 'border-red-500' : ''}`}
                  aria-invalid={!!errorMessage}
                  aria-describedby={errorMessage ? `${settingKey}-error` : undefined}
                />
              </div>
            ))}
          </div>
        );
      } catch (error) {
        return (
          <div className="border border-red-300 bg-red-50 p-3 rounded-md">
            <p className="text-sm text-red-500">Invalid JSON format</p>
            <textarea
              id={settingKey}
              name={settingKey}
              value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
              onChange={handleChange}
              disabled={disabled}
              className={`mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${className} ${errorMessage ? 'border-red-500' : ''}`}
              rows={5}
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? `${settingKey}-error` : undefined}
            />
          </div>
        );
      }
      
    default:
      return (
        <input
          type="text"
          id={settingKey}
          name={settingKey}
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${className} ${errorMessage ? 'border-red-500' : ''}`}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${settingKey}-error` : undefined}
        />
      );
  }
};

SettingField.propTypes = {
  setting: PropTypes.shape({
    key: PropTypes.string,
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  errorMessage: PropTypes.string
};

export default SettingField; 