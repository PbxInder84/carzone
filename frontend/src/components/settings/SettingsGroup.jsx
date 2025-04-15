import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import SettingField from './SettingField';

/**
 * Component to display a group of related settings
 */
const SettingsGroup = ({ 
  title, 
  description, 
  settings, 
  onSettingChange, 
  isCollapsible = true,
  isDisabled = false,
  errors = {},
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const toggleExpanded = () => {
    if (isCollapsible) {
      setIsExpanded(!isExpanded);
    }
  };
  
  const sortedSettings = Object.values(settings).sort((a, b) => {
    return a.label.localeCompare(b.label);
  });
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div 
        className={`p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 ${isCollapsible ? 'cursor-pointer' : ''}`}
        onClick={toggleExpanded}
      >
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {isCollapsible && (
          <div className="text-gray-500">
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="p-6 space-y-6">
          {sortedSettings.map((setting) => {
            // Get the value from the setting object
            const value = setting.value;
            const key = setting.key || `setting-${Math.random().toString(36).substr(2, 9)}`;
            
            return (
              <div key={key} className="space-y-1">
                {setting.type !== 'boolean' && (
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                    {setting.label}
                  </label>
                )}
                
                <SettingField
                  setting={{
                    ...setting,
                    key: key // Ensure the key is always available
                  }}
                  value={value}
                  onChange={onSettingChange}
                  disabled={isDisabled}
                  errorMessage={errors[key]}
                />
                
                {setting.description && setting.type !== 'boolean' && (
                  <p className="mt-1 text-sm text-gray-500">{setting.description}</p>
                )}
                
                {errors[key] && (
                  <p id={`${key}-error`} className="mt-1 text-sm text-red-600">
                    {errors[key]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

SettingsGroup.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  settings: PropTypes.object.isRequired,
  onSettingChange: PropTypes.func.isRequired,
  isCollapsible: PropTypes.bool,
  isDisabled: PropTypes.bool,
  errors: PropTypes.object,
  defaultExpanded: PropTypes.bool
};

export default SettingsGroup; 