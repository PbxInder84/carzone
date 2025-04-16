import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useSiteSettings } from '../layout/SettingsContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { siteInfo, contact } = useSiteSettings();
  
  return (
    <footer className="bg-gradient-to-r from-slate-800 to-primary-600 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Information */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold tracking-tight font-poppins">
                {siteInfo?.name || 'CarZone'}
              </span>
            </div>
            <p className="text-gray-100 text-sm mb-4">
              {siteInfo?.description || 'Premium automotive parts and accessories'}
            </p>
            <div className="flex space-x-3">
              <a href={contact?.socialMedia?.facebook || '#'} className="h-8 w-8 rounded-full bg-primary-700 hover:bg-highlight-500 flex items-center justify-center transition duration-300">
                <FaFacebookF className="text-white text-sm" />
              </a>
              <a href={contact?.socialMedia?.twitter || '#'} className="h-8 w-8 rounded-full bg-primary-700 hover:bg-highlight-500 flex items-center justify-center transition duration-300">
                <FaTwitter className="text-white text-sm" />
              </a>
              <a href={contact?.socialMedia?.instagram || '#'} className="h-8 w-8 rounded-full bg-primary-700 hover:bg-highlight-500 flex items-center justify-center transition duration-300">
                <FaInstagram className="text-white text-sm" />
              </a>
              <a href="https://github.com/" className="h-8 w-8 rounded-full bg-primary-700 hover:bg-highlight-500 flex items-center justify-center transition duration-300">
                <FaGithub className="text-white text-sm" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-poppins">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-100 hover:text-highlight-500 transition duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-100 hover:text-highlight-500 transition duration-300">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-100 hover:text-highlight-500 transition duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-100 hover:text-highlight-500 transition duration-300">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Policies */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-poppins">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-gray-100 hover:text-highlight-500 transition duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-gray-100 hover:text-highlight-500 transition duration-300">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-gray-100 hover:text-highlight-500 transition duration-300">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-gray-100 hover:text-highlight-500 transition duration-300">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-poppins">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-gray-200 mr-3 mt-1" />
                <span className="text-gray-100">{contact?.address || 'Rajpura, Panjab, India - 140401'}</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-gray-200 mr-3" />
                <span className="text-gray-100">{contact?.phone || '+1-555-123-4567'}</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-gray-200 mr-3" />
                <span className="text-gray-100">{contact?.email || 'support@carzone.com'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar with Copyright */}
        <div className="border-t border-primary-700 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-200 mb-2 md:mb-0">
            &copy; {currentYear} {siteInfo?.name || 'CarZone'}. All rights reserved.
          </p>
          <div className="flex space-x-4 text-xs text-gray-200">
            <span>Designed with ❤️ for auto enthusiasts</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 