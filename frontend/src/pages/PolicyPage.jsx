import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useSiteSettings } from '../components/layout/SettingsContext';

const PolicyPage = ({ type }) => {
  const { siteInfo } = useSiteSettings();
  
  const getPolicy = () => {
    switch(type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          content: `
            <h2>Privacy Policy for ${siteInfo.name}</h2>
            <p>Last updated: ${new Date().toLocaleDateString()}</p>
            
            <h3>1. Information We Collect</h3>
            <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.</p>
            
            <h3>2. How We Use Your Information</h3>
            <p>We use personal information collected via our website for a variety of business purposes including to process your orders, manage your account, and send you marketing communications.</p>
            
            <h3>3. Cookies and Tracking Technologies</h3>
            <p>We may use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            
            <h3>4. Data Security</h3>
            <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.</p>
            
            <h3>5. Third-Party Websites</h3>
            <p>Our website may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site.</p>
            
            <h3>6. Changes to This Privacy Policy</h3>
            <p>We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.</p>
            
            <h3>7. Contact Us</h3>
            <p>If you have any questions about this privacy policy, please contact us at: ${siteInfo.contact?.email || 'support@carzone.com'}</p>
          `
        };
        
      case 'terms':
        return {
          title: 'Terms & Conditions',
          content: `
            <h2>Terms and Conditions for ${siteInfo.name}</h2>
            <p>Last updated: ${new Date().toLocaleDateString()}</p>
            
            <h3>1. Agreement to Terms</h3>
            <p>By accessing or using our website, you agree to be bound by these Terms and Conditions and our Privacy Policy.</p>
            
            <h3>2. User Accounts</h3>
            <p>When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your password and for all activities that occur under your account.</p>
            
            <h3>3. Products and Purchases</h3>
            <p>All products are subject to availability. We reserve the right to discontinue any products at any time. Prices for our products are subject to change without notice.</p>
            
            <h3>4. Intellectual Property</h3>
            <p>Our website and its entire contents, features, and functionality are owned by us and are protected by international copyright, trademark, patent, and other intellectual property laws.</p>
            
            <h3>5. Limitation of Liability</h3>
            <p>In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, arising out of, or in connection with, the use of our website.</p>
            
            <h3>6. Governing Law</h3>
            <p>These Terms shall be governed by the laws of the jurisdiction in which we operate, without regard to its conflict of law principles.</p>
            
            <h3>7. Changes to These Terms</h3>
            <p>We reserve the right to modify these terms at any time. If we make changes, we will notify you by updating the date at the top of these terms.</p>
          `
        };
        
      case 'shipping':
        return {
          title: 'Shipping Policy',
          content: `
            <h2>Shipping Policy for ${siteInfo.name}</h2>
            <p>Last updated: ${new Date().toLocaleDateString()}</p>
            
            <h3>1. Processing Time</h3>
            <p>Orders are typically processed within 1-2 business days from the date of purchase.</p>
            
            <h3>2. Shipping Methods and Delivery Time</h3>
            <p>We offer standard shipping (3-5 business days) and express shipping (1-2 business days) options. Actual delivery times may vary based on your location.</p>
            
            <h3>3. Shipping Costs</h3>
            <p>Standard shipping costs $15.00 for all orders. Free shipping is available on orders over $150.00.</p>
            
            <h3>4. International Shipping</h3>
            <p>We currently ship to select international destinations. International shipping costs and delivery times vary by location.</p>
            
            <h3>5. Order Tracking</h3>
            <p>Once your order ships, you will receive a shipping confirmation email with tracking information.</p>
            
            <h3>6. Damaged Items</h3>
            <p>If your package arrives damaged, please contact us immediately for assistance.</p>
            
            <h3>7. Lost Packages</h3>
            <p>In the rare event that your package is lost during transit, please contact our customer service team.</p>
          `
        };
        
      case 'sitemap':
        return {
          title: 'Sitemap',
          content: `
            <h2>Sitemap for ${siteInfo.name}</h2>
            <p>Last updated: ${new Date().toLocaleDateString()}</p>
            
            <h3>Main Pages</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
            
            <h3>Account Pages</h3>
            <ul>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
              <li><a href="/profile">My Profile</a></li>
              <li><a href="/orders">My Orders</a></li>
            </ul>
            
            <h3>Product Categories</h3>
            <ul>
              <li><a href="/products?category=interior">Interior Accessories</a></li>
              <li><a href="/products?category=exterior">Exterior Accessories</a></li>
              <li><a href="/products?category=performance">Performance Parts</a></li>
              <li><a href="/products?category=lighting">Lighting</a></li>
              <li><a href="/products?category=audio">Audio & Electronics</a></li>
            </ul>
            
            <h3>Policy Pages</h3>
            <ul>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/terms-conditions">Terms & Conditions</a></li>
              <li><a href="/shipping-policy">Shipping Policy</a></li>
            </ul>
          `
        };
        
      default:
        return {
          title: 'Policy',
          content: '<p>Content not available</p>'
        };
    }
  };
  
  const policy = getPolicy();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-800">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{policy.title}</h1>
        
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: policy.content }}
        />
      </div>
    </div>
  );
};

export default PolicyPage; 