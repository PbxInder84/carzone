import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-900 text-white pt-10 pb-5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-white">Care</span>
              <span className="text-secondary-400">Zone</span>
            </h3>
            <p className="mb-4 text-gray-300">
              Your one-stop shop for premium car accessories. Enhance your driving experience with our curated collection of quality products.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-secondary-400 transition duration-300">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-secondary-400 transition duration-300">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-secondary-400 transition duration-300">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-secondary-400 transition duration-300">
                <FaYoutube />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-secondary-400 transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-secondary-400 transition duration-300">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-secondary-400 transition duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-secondary-400 transition duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-secondary-400 transition duration-300">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=interior" className="text-gray-300 hover:text-secondary-400 transition duration-300">
                  Interior Accessories
                </Link>
              </li>
              <li>
                <Link to="/products?category=exterior" className="text-gray-300 hover:text-secondary-400 transition duration-300">
                  Exterior Accessories
                </Link>
              </li>
              <li>
                <Link to="/products?category=electronics" className="text-gray-300 hover:text-secondary-400 transition duration-300">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=performance" className="text-gray-300 hover:text-secondary-400 transition duration-300">
                  Performance Parts
                </Link>
              </li>
              <li>
                <Link to="/products?category=tools" className="text-gray-300 hover:text-secondary-400 transition duration-300">
                  Tools & Equipment
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="mt-1 text-secondary-400" />
                <span className="text-gray-300">
                  123 Auto Avenue, Car City, CC 12345
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-secondary-400" />
                <span className="text-gray-300">+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-secondary-400" />
                <span className="text-gray-300">info@carezone.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-primary-700 my-8" />
        
        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} CareZone. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-gray-400 text-sm hover:text-secondary-400 transition duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="text-gray-400 text-sm hover:text-secondary-400 transition duration-300">
              Terms & Conditions
            </Link>
            <Link to="/shipping-policy" className="text-gray-400 text-sm hover:text-secondary-400 transition duration-300">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 