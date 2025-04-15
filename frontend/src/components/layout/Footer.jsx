import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCar, FaCreditCard, FaShippingFast, FaHeadset, FaChevronRight } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gradient-to-b from-primary-800 to-primary-900 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-secondary-600/10 blur-3xl"></div>
        <div className="absolute -left-24 bottom-12 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      {/* Newsletter Section */}
      <div className="relative border-b border-primary-700/50">
        <div className="container mx-auto px-4 py-10">
          <div className="backdrop-blur-sm bg-primary-800/40 rounded-xl p-8 shadow-xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary-400/50 to-transparent"></div>
            <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-secondary-400/20 blur-2xl"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-2 text-white">Stay Updated</h3>
                <p className="text-gray-300">Subscribe to our newsletter for new products, deals, and automotive tips.</p>
              </div>
              <div className="md:w-1/2 w-full">
                <form className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="flex-grow px-4 py-3 rounded-lg bg-primary-900/50 border border-primary-700 focus:border-secondary-400 focus:ring-1 focus:ring-secondary-400 text-white placeholder-gray-400 outline-none backdrop-blur-sm"
                  />
                  <button 
                    type="submit" 
                    className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-secondary-500/30 whitespace-nowrap flex items-center justify-center"
                  >
                    Subscribe
                    <FaChevronRight className="ml-2" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-primary-700/50 p-2 rounded-lg border border-primary-600/50">
                <FaCar className="text-secondary-400 text-2xl" />
              </div>
              <div className="flex items-baseline">
                <span className="text-white text-2xl font-extrabold tracking-tight">Car</span>
                <span className="text-secondary-400 text-2xl font-extrabold tracking-tight">Zone</span>
              </div>
            </div>
            <p className="mb-6 text-gray-300 leading-relaxed">
              Your one-stop shop for premium car accessories and parts. Enhance your driving experience with our curated collection of quality automotive products.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-700/50 hover:bg-primary-700 border border-primary-600/50 text-gray-300 hover:text-secondary-400 transition-all duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-700/50 hover:bg-primary-700 border border-primary-600/50 text-gray-300 hover:text-secondary-400 transition-all duration-300"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-700/50 hover:bg-primary-700 border border-primary-600/50 text-gray-300 hover:text-secondary-400 transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-700/50 hover:bg-primary-700 border border-primary-600/50 text-gray-300 hover:text-secondary-400 transition-all duration-300"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-secondary-400 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-secondary-400 transition-all duration-300 flex items-center group">
                  <FaChevronRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-secondary-400" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-secondary-400 transition-all duration-300 flex items-center group">
                  <FaChevronRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-secondary-400" />
                  <span>Products</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-secondary-400 transition-all duration-300 flex items-center group">
                  <FaChevronRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-secondary-400" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-secondary-400 transition-all duration-300 flex items-center group">
                  <FaChevronRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-secondary-400" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-secondary-400 transition-all duration-300 flex items-center group">
                  <FaChevronRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-secondary-400" />
                  <span>Blog</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white relative inline-block">
              Categories
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-secondary-400 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products?category=interior" className="text-gray-300 hover:text-secondary-400 transition-all duration-300 flex items-center group">
                  <FaChevronRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-secondary-400" />
                  <span>Interior Accessories</span>
                </Link>
              </li>
              <li>
                <Link to="/products?category=exterior" className="text-gray-300 hover:text-secondary-400 transition-all duration-300 flex items-center group">
                  <FaChevronRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-secondary-400" />
                  <span>Exterior Accessories</span>
                </Link>
              </li>
              <li>
                <Link to="/products?category=electronics" className="text-gray-300 hover:text-secondary-400 transition-all duration-300 flex items-center group">
                  <FaChevronRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-secondary-400" />
                  <span>Electronics</span>
                </Link>
              </li>
              <li>
                <Link to="/products?category=performance" className="text-gray-300 hover:text-secondary-400 transition-all duration-300 flex items-center group">
                  <FaChevronRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-secondary-400" />
                  <span>Performance Parts</span>
                </Link>
              </li>
              <li>
                <Link to="/products?category=tools" className="text-gray-300 hover:text-secondary-400 transition-all duration-300 flex items-center group">
                  <FaChevronRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-secondary-400" />
                  <span>Tools & Equipment</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-secondary-400 rounded-full"></span>
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start space-x-3">
                <div className="mt-1 bg-primary-700/50 p-2 rounded-lg border border-primary-600/50 text-secondary-400">
                  <FaMapMarkerAlt />
                </div>
                <span className="text-gray-300">
                  123 Auto Avenue, Car City, CC 12345
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="bg-primary-700/50 p-2 rounded-lg border border-primary-600/50 text-secondary-400">
                  <FaPhone />
                </div>
                <span className="text-gray-300">+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="bg-primary-700/50 p-2 rounded-lg border border-primary-600/50 text-secondary-400">
                  <FaEnvelope />
                </div>
                <span className="text-gray-300">info@carzone.com</span>
              </li>
            </ul>
            
            {/* We Accept */}
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">We Accept</h4>
              <div className="flex flex-wrap gap-2">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-md">
                  <img src="/images/visa.svg" alt="Visa" className="h-6" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-md">
                  <img src="/images/mastercard.svg" alt="Mastercard" className="h-6" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-md">
                  <img src="/images/paypal.svg" alt="PayPal" className="h-6" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-md">
                  <img src="/images/amex.svg" alt="American Express" className="h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 mb-8">
          <div className="backdrop-blur-sm bg-primary-800/30 p-4 rounded-xl border border-primary-700/50 flex items-center">
            <div className="mr-4 bg-secondary-400/20 p-2 rounded-lg text-secondary-400">
              <FaShippingFast className="text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Free Shipping</h4>
              <p className="text-xs text-gray-400">On orders over $99</p>
            </div>
          </div>
          <div className="backdrop-blur-sm bg-primary-800/30 p-4 rounded-xl border border-primary-700/50 flex items-center">
            <div className="mr-4 bg-secondary-400/20 p-2 rounded-lg text-secondary-400">
              <FaCreditCard className="text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Secure Payment</h4>
              <p className="text-xs text-gray-400">100% secure checkout</p>
            </div>
          </div>
          <div className="backdrop-blur-sm bg-primary-800/30 p-4 rounded-xl border border-primary-700/50 flex items-center">
            <div className="mr-4 bg-secondary-400/20 p-2 rounded-lg text-secondary-400">
              <FaHeadset className="text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-white">24/7 Support</h4>
              <p className="text-xs text-gray-400">Dedicated customer service</p>
            </div>
          </div>
          <div className="backdrop-blur-sm bg-primary-800/30 p-4 rounded-xl border border-primary-700/50 flex items-center">
            <div className="mr-4 bg-secondary-400/20 p-2 rounded-lg text-secondary-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-white">Easy Returns</h4>
              <p className="text-xs text-gray-400">30-day return policy</p>
            </div>
          </div>
        </div>
        
        <hr className="border-primary-700/50 my-8" />
        
        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} CarZone. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link to="/privacy-policy" className="text-gray-400 text-sm hover:text-secondary-400 transition-all duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="text-gray-400 text-sm hover:text-secondary-400 transition-all duration-300">
              Terms & Conditions
            </Link>
            <Link to="/shipping-policy" className="text-gray-400 text-sm hover:text-secondary-400 transition-all duration-300">
              Shipping Policy
            </Link>
            <Link to="/sitemap" className="text-gray-400 text-sm hover:text-secondary-400 transition-all duration-300">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 