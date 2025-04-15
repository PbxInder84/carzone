import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSettings } from '../../features/settings/settingsSlice';
import { useSettings } from '../../utils/useSettings';

// Create a context for site settings
const SettingsContext = createContext(null);

/**
 * Provider component that makes site settings available throughout the app
 */
export const SettingsProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { settings, isLoading } = useSelector(state => state.settings);
  const { getSetting } = useSettings({ autoLoad: false });
  
  // Fetch settings on mount
  useEffect(() => {
    // Only fetch if we don't already have settings
    if (!settings || Object.keys(settings).length === 0) {
      dispatch(getSettings());
    }
  }, [dispatch, settings]);
  
  // Memoize the context value to prevent unnecessary renders
  const contextValue = useMemo(() => {
    return {
      settings,
      isLoading,
      getSetting,
      theme: {
        primaryColor: getSetting('primary_color', '#2563eb'),
        secondaryColor: getSetting('secondary_color', '#475569')
      },
      siteInfo: {
        name: getSetting('site_name', 'CarZone'),
        description: getSetting('site_description', 'Premium automotive parts and accessories'),
        logoUrl: getSetting('logo_url', '/assets/images/logo.png'),
        bannerImage: getSetting('banner_image', '/assets/images/banner.jpg')
      },
      contact: {
        email: getSetting('contact_email', 'support@carzone.com'),
        phone: getSetting('contact_phone', '+1-555-123-4567'),
        address: getSetting('address', '123 Auto Street, Vehicle City, CA 90000'),
        socialMedia: getSetting('social_media', {
          facebook: 'https://facebook.com/carzone',
          twitter: 'https://twitter.com/carzone',
          instagram: 'https://instagram.com/carzone'
        })
      },
      commerce: {
        currency: getSetting('currency', 'USD'),
        taxRate: getSetting('tax_rate', 7.5),
        shippingFee: getSetting('shipping_fee', 15),
        freeShippingThreshold: getSetting('free_shipping_threshold', 150)
      },
      features: getSetting('features_enabled', {
        reviews: true,
        wishlists: true,
        comparison: true,
        live_chat: false,
        newsletter: true
      })
    };
  }, [settings, isLoading, getSetting]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * Custom hook for accessing site settings
 */
export const useSiteSettings = () => {
  const context = useContext(SettingsContext);
  
  if (!context) {
    throw new Error('useSiteSettings must be used within a SettingsProvider');
  }
  
  return context;
}; 