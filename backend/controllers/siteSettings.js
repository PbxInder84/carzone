const { SiteSettings } = require('../models');
const logger = require('../utils/logger');
const asyncHandler = require('../middlewares/async');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public/Private (depends on is_public flag)
exports.getSettings = asyncHandler(async (req, res) => {
  const isAdmin = req.user && req.user.role === 'admin';
  const query = isAdmin ? {} : { is_public: true };

  const settings = await SiteSettings.findAll({ where: query });

  // Convert settings to a more usable format
  const formattedSettings = {};
  settings.forEach(setting => {
    let value = setting.value;

    // Parse value based on type
    switch (setting.type) {
      case 'number':
        value = parseFloat(value);
        break;
      case 'boolean':
        value = value === 'true';
        break;
      case 'json':
        try {
          value = JSON.parse(value);
        } catch (error) {
          logger.error(`Error parsing JSON setting: ${setting.key}`, error);
          value = {};
        }
        break;
    }

    // Group settings by their group
    if (!formattedSettings[setting.group]) {
      formattedSettings[setting.group] = {};
    }
    
    formattedSettings[setting.group][setting.key] = {
      value,
      label: setting.label,
      type: setting.type,
      description: setting.description,
      isPublic: setting.is_public
    };
  });

  res.status(200).json({
    success: true,
    data: formattedSettings
  });
});

// @desc    Get setting by key
// @route   GET /api/settings/:key
// @access  Public/Private (depends on is_public flag)
exports.getSetting = asyncHandler(async (req, res) => {
  const setting = await SiteSettings.findOne({
    where: { key: req.params.key }
  });

  if (!setting) {
    return res.status(404).json({
      success: false,
      message: `Setting with key ${req.params.key} not found`
    });
  }

  // Check if user can access this setting
  if (!setting.is_public && (!req.user || req.user.role !== 'admin')) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this setting'
    });
  }

  let value = setting.value;

  // Parse value based on type
  switch (setting.type) {
    case 'number':
      value = parseFloat(value);
      break;
    case 'boolean':
      value = value === 'true';
      break;
    case 'json':
      try {
        value = JSON.parse(value);
      } catch (error) {
        logger.error(`Error parsing JSON setting: ${setting.key}`, error);
        value = {};
      }
      break;
  }

  res.status(200).json({
    success: true,
    data: {
      key: setting.key,
      value: value,
      type: setting.type,
      group: setting.group,
      label: setting.label,
      description: setting.description,
      isPublic: setting.is_public
    }
  });
});

// @desc    Update settings (batch update)
// @route   PUT /api/settings
// @access  Private (Admin only)
exports.updateSettings = asyncHandler(async (req, res) => {
  const { settings } = req.body;

  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Settings object is required'
    });
  }

  const results = {
    success: [],
    failed: []
  };

  // Process each setting in the batch
  for (const [key, value] of Object.entries(settings)) {
    try {
      // Find the setting
      const setting = await SiteSettings.findOne({ where: { key } });

      if (!setting) {
        results.failed.push({
          key,
          error: 'Setting not found'
        });
        continue;
      }

      // Format the value based on type
      let formattedValue = value;
      if (setting.type === 'json' && typeof value === 'object') {
        formattedValue = JSON.stringify(value);
      } else if (typeof value !== 'string') {
        formattedValue = String(value);
      }

      // Update the setting
      await setting.update({ value: formattedValue });
      
      results.success.push({
        key,
        value: formattedValue
      });
    } catch (error) {
      logger.error(`Error updating setting: ${key}`, error);
      results.failed.push({
        key,
        error: error.message
      });
    }
  }

  res.status(200).json({
    success: true,
    message: `Updated ${results.success.length} settings, failed ${results.failed.length} settings`,
    data: results
  });
});

// @desc    Create or update a single setting
// @route   PUT /api/settings/:key
// @access  Private (Admin only)
exports.updateSetting = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value, type, group, label, description, is_public } = req.body;

  if (value === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Value is required'
    });
  }

  // Format the value based on type
  let formattedValue = value;
  const settingType = type || 'string';
  
  if (settingType === 'json' && typeof value === 'object') {
    formattedValue = JSON.stringify(value);
  } else if (typeof value !== 'string') {
    formattedValue = String(value);
  }

  const [setting, created] = await SiteSettings.findOrCreate({
    where: { key },
    defaults: {
      value: formattedValue,
      type: settingType,
      group: group || 'general',
      label: label || key,
      description: description || '',
      is_public: is_public !== undefined ? is_public : false
    }
  });

  if (!created) {
    // Update existing setting
    const updateData = { value: formattedValue };
    
    // Only update these fields if provided
    if (type) updateData.type = type;
    if (group) updateData.group = group;
    if (label) updateData.label = label;
    if (description !== undefined) updateData.description = description;
    if (is_public !== undefined) updateData.is_public = is_public;
    
    await setting.update(updateData);
  }

  res.status(200).json({
    success: true,
    message: created ? 'Setting created' : 'Setting updated',
    data: setting
  });
});

// @desc    Delete a setting
// @route   DELETE /api/settings/:key
// @access  Private (Admin only)
exports.deleteSetting = asyncHandler(async (req, res) => {
  const setting = await SiteSettings.findOne({
    where: { key: req.params.key }
  });

  if (!setting) {
    return res.status(404).json({
      success: false,
      message: `Setting with key ${req.params.key} not found`
    });
  }

  await setting.destroy();

  res.status(200).json({
    success: true,
    message: 'Setting deleted',
    data: {}
  });
});

// @desc    Initialize default settings
// @route   POST /api/settings/init
// @access  Private (Admin only)
exports.initializeSettings = asyncHandler(async (req, res) => {
  const defaultSettings = [
    {
      key: 'site_name',
      value: 'CarZone',
      type: 'string',
      group: 'general',
      label: 'Site Name',
      description: 'The name of the website',
      is_public: true
    },
    {
      key: 'site_description',
      value: 'Premium automotive parts and accessories',
      type: 'string',
      group: 'general',
      label: 'Site Description',
      description: 'A short description of the website',
      is_public: true
    },
    {
      key: 'logo_url',
      value: '/assets/images/logo.png',
      type: 'string',
      group: 'appearance',
      label: 'Logo URL',
      description: 'URL of the site logo',
      is_public: true
    },
    {
      key: 'primary_color',
      value: '#2563eb',
      type: 'color',
      group: 'appearance',
      label: 'Primary Color',
      description: 'Primary color for the site theme',
      is_public: true
    },
    {
      key: 'secondary_color',
      value: '#475569',
      type: 'color',
      group: 'appearance',
      label: 'Secondary Color',
      description: 'Secondary color for the site theme',
      is_public: true
    },
    {
      key: 'banner_image',
      value: '/assets/images/banner.jpg',
      type: 'string',
      group: 'appearance',
      label: 'Banner Image',
      description: 'URL of the main banner image',
      is_public: true
    },
    {
      key: 'contact_email',
      value: 'support@carzone.com',
      type: 'string',
      group: 'contact',
      label: 'Contact Email',
      description: 'Primary contact email address',
      is_public: true
    },
    {
      key: 'contact_phone',
      value: '+1-555-123-4567',
      type: 'string',
      group: 'contact',
      label: 'Contact Phone',
      description: 'Primary contact phone number',
      is_public: true
    },
    {
      key: 'address',
      value: '123 Auto Street, Vehicle City, CA 90000',
      type: 'string',
      group: 'contact',
      label: 'Address',
      description: 'Physical address',
      is_public: true
    },
    {
      key: 'social_media',
      value: JSON.stringify({
        facebook: 'https://facebook.com/carzone',
        twitter: 'https://twitter.com/carzone',
        instagram: 'https://instagram.com/carzone'
      }),
      type: 'json',
      group: 'contact',
      label: 'Social Media',
      description: 'Social media links',
      is_public: true
    },
    {
      key: 'tax_rate',
      value: '7.5',
      type: 'number',
      group: 'commerce',
      label: 'Tax Rate',
      description: 'Default tax rate percentage',
      is_public: true
    },
    {
      key: 'shipping_fee',
      value: '15.00',
      type: 'number',
      group: 'commerce',
      label: 'Shipping Fee',
      description: 'Default shipping fee amount',
      is_public: true
    },
    {
      key: 'free_shipping_threshold',
      value: '150.00',
      type: 'number',
      group: 'commerce',
      label: 'Free Shipping Threshold',
      description: 'Order amount to qualify for free shipping',
      is_public: true
    },
    {
      key: 'currency',
      value: 'INR',
      type: 'string',
      group: 'commerce',
      label: 'Currency',
      description: 'Default currency code',
      is_public: true
    },
    {
      key: 'features_enabled',
      value: JSON.stringify({
        reviews: true,
        wishlists: true,
        comparison: true,
        live_chat: false,
        newsletter: true
      }),
      type: 'json',
      group: 'features',
      label: 'Enabled Features',
      description: 'Features enabled on the site',
      is_public: true
    },
  ];

  const results = {
    created: 0,
    updated: 0,
    failed: 0
  };

  for (const setting of defaultSettings) {
    try {
      const [_, created] = await SiteSettings.findOrCreate({
        where: { key: setting.key },
        defaults: setting
      });

      if (created) {
        results.created++;
      } else {
        results.updated++;
      }
    } catch (error) {
      logger.error(`Error initializing setting: ${setting.key}`, error);
      results.failed++;
    }
  }

  res.status(200).json({
    success: true,
    message: `Settings initialization complete. Created: ${results.created}, Updated: ${results.updated}, Failed: ${results.failed}`,
    data: results
  });
}); 