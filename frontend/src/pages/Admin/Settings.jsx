import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Spinner from '../../components/common/Spinner';

const Settings = () => {
  const [settings, setSettings] = useState({
    site_name: '',
    logo_url: '',
    primary_color: '#2563eb',
    secondary_color: '#475569',
    banner_image: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    social_media: {
      facebook: '',
      twitter: '',
      instagram: ''
    },
    tax_rate: 0,
    shipping_fee: 0,
    free_shipping_threshold: 0,
    currency: 'USD',
    features_enabled: {
      reviews: true,
      wishlists: true,
      comparison: true,
      live_chat: false,
      newsletter: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Fetch site settings from DB or API
      // For this example, we'll use a mock fetch that returns after a delay
      setTimeout(() => {
        setSettings({
          site_name: 'CarZone',
          logo_url: '/assets/images/logo.png',
          primary_color: '#2563eb',
          secondary_color: '#475569',
          banner_image: '/assets/images/banner.jpg',
          contact_email: 'support@carzone.com',
          contact_phone: '+1-555-123-4567',
          address: '123 Auto Street, Vehicle City, CA 90000',
          social_media: {
            facebook: 'https://facebook.com/carzone',
            twitter: 'https://twitter.com/carzone',
            instagram: 'https://instagram.com/carzone'
          },
          tax_rate: 7.5,
          shipping_fee: 15.00,
          free_shipping_threshold: 150.00,
          currency: 'USD',
          features_enabled: {
            reviews: true,
            wishlists: true,
            comparison: true,
            live_chat: false,
            newsletter: true
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setSettings({
        ...settings,
        features_enabled: {
          ...settings.features_enabled,
          [name]: checked
        }
      });
    } else if (name.includes('social_media.')) {
      const socialKey = name.split('.')[1];
      setSettings({
        ...settings,
        social_media: {
          ...settings.social_media,
          [socialKey]: value
        }
      });
    } else if (type === 'number') {
      setSettings({
        ...settings,
        [name]: parseFloat(value)
      });
    } else {
      setSettings({
        ...settings,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Save settings to DB or API
      // For this example, we'll simulate a successful save after a delay
      setTimeout(() => {
        toast.success('Settings saved successfully');
        setSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Site Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium mb-4">General Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                name="site_name"
                value={settings.site_name}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL
              </label>
              <input
                type="text"
                name="logo_url"
                value={settings.logo_url}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <div className="flex">
                <input
                  type="color"
                  name="primary_color"
                  value={settings.primary_color}
                  onChange={handleInputChange}
                  className="h-10 w-10 border rounded mr-2"
                />
                <input
                  type="text"
                  name="primary_color"
                  value={settings.primary_color}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <div className="flex">
                <input
                  type="color"
                  name="secondary_color"
                  value={settings.secondary_color}
                  onChange={handleInputChange}
                  className="h-10 w-10 border rounded mr-2"
                />
                <input
                  type="text"
                  name="secondary_color"
                  value={settings.secondary_color}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image URL
              </label>
              <input
                type="text"
                name="banner_image"
                value={settings.banner_image}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 w-full"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h2 className="text-lg font-medium mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                value={settings.contact_email}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                name="contact_phone"
                value={settings.contact_phone}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 w-full"
                rows="2"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h2 className="text-lg font-medium mb-4">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                name="social_media.facebook"
                value={settings.social_media.facebook}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <input
                type="url"
                name="social_media.twitter"
                value={settings.social_media.twitter}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                name="social_media.instagram"
                value={settings.social_media.instagram}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h2 className="text-lg font-medium mb-4">Shipping & Taxes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                name="tax_rate"
                value={settings.tax_rate}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 w-full"
                step="0.1"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Fee
              </label>
              <input
                type="number"
                name="shipping_fee"
                value={settings.shipping_fee}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 w-full"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Free Shipping Threshold
              </label>
              <input
                type="number"
                name="free_shipping_threshold"
                value={settings.free_shipping_threshold}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 w-full"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h2 className="text-lg font-medium mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="reviews"
                name="reviews"
                checked={settings.features_enabled.reviews}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="reviews" className="ml-2 text-sm text-gray-700">
                Enable Reviews
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="wishlists"
                name="wishlists"
                checked={settings.features_enabled.wishlists}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="wishlists" className="ml-2 text-sm text-gray-700">
                Enable Wishlists
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="comparison"
                name="comparison"
                checked={settings.features_enabled.comparison}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="comparison" className="ml-2 text-sm text-gray-700">
                Enable Product Comparison
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="live_chat"
                name="live_chat"
                checked={settings.features_enabled.live_chat}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="live_chat" className="ml-2 text-sm text-gray-700">
                Enable Live Chat
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={settings.features_enabled.newsletter}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
                Enable Newsletter
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => fetchSettings()}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center"
            disabled={saving}
          >
            <FaTimes className="mr-2" /> Reset
          </button>
          <button
            type="submit"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center"
            disabled={saving}
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
      </form>
    </div>
  );
};

export default Settings; 