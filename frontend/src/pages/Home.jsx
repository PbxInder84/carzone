import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts } from '../features/products/productSlice';
import { getCategories } from '../features/categories/categorySlice';
import ProductCard from '../components/products/ProductCard';
import Spinner from '../components/layout/Spinner';
import { 
  FaCar, FaTools, FaWrench, FaLightbulb, FaStar, FaChevronDown, 
  FaShieldAlt, FaShippingFast, FaCreditCard, FaTag, FaOilCan,
  FaBolt, FaTachometerAlt, FaCog
} from 'react-icons/fa';
import { useSettings } from '../utils/useSettings';

const Home = () => {
  const dispatch = useDispatch();
  
  const { products, isLoading: productsLoading } = useSelector((state) => state.products);
  const { categories, isLoading: categoriesLoading } = useSelector((state) => state.categories);
  
  // Load settings with useSettings hook
  const { getSetting, isLoading: settingsLoading } = useSettings();
  
  useEffect(() => {
    dispatch(getProducts({ limit: 8, sort_by: 'created_at', sort_dir: 'DESC' }));
    dispatch(getCategories());
  }, [dispatch]);
  
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };
  
  // Function to get an icon based on category name
  const getCategoryIcon = (categoryName) => {
    const name = categoryName ? categoryName.toLowerCase() : '';
    
    if (name.includes('engine') || name.includes('motor')) return <FaTools className="w-8 h-8" />;
    if (name.includes('car') || name.includes('auto') || name.includes('vehicle')) return <FaCar className="w-8 h-8" />;
    if (name.includes('oil') || name.includes('fluid') || name.includes('lubricant')) return <FaOilCan className="w-8 h-8" />;
    if (name.includes('electric') || name.includes('power')) return <FaBolt className="w-8 h-8" />;
    if (name.includes('performance') || name.includes('speed')) return <FaTachometerAlt className="w-8 h-8" />;
    if (name.includes('part') || name.includes('component')) return <FaCog className="w-8 h-8" />;
    if (name.includes('tool') || name.includes('equipment')) return <FaWrench className="w-8 h-8" />;
    
    // Default icon
    return <FaTag className="w-8 h-8" />;
  };
  
  const fallbackCategories = [
    { name: "Engine Parts", icon: <FaTools className="w-8 h-8" /> },
    { name: "Car Accessories", icon: <FaCar className="w-8 h-8" /> },
    { name: "Oil & Fluids", icon: <FaOilCan className="w-8 h-8" /> },
    { name: "Performance", icon: <FaTachometerAlt className="w-8 h-8" /> }
  ];
  
  const displayCategories = !categoriesLoading && categories && categories.length > 0
    ? categories.slice(0, 4).map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: getCategoryIcon(cat.name),
        description: cat.description || `Explore our ${cat.name} collection`
      }))
    : fallbackCategories;
  
  return (
    <div className="pt-0 mt-0">
      {/* Hero Section with 100vh */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-car.jpg" 
            alt="Luxury Car"
            className="w-full h-full object-cover filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 z-10 text-white text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fadeIn">
            Drive in <span className="text-secondary-400">Style</span> <br />
            Upgrade with Confidence
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-200 animate-fadeIn animation-delay-300">
            Premium automotive accessories for every car enthusiast. Transform your driving experience today.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fadeIn animation-delay-500">
            <Link to="/products" className="btn-secondary text-lg px-8 py-3">
              Shop Now
            </Link>
            <Link to="/about" className="btn-outline text-white border-white hover:bg-white/10 text-lg px-8 py-3">
              Explore
            </Link>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <FaShieldAlt className="text-2xl mb-2 text-secondary-400" />
              <span className="text-sm">Quality Guarantee</span>
            </div>
            <div className="flex flex-col items-center">
              <FaShippingFast className="text-2xl mb-2 text-secondary-400" />
              <span className="text-sm">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center">
              <FaCreditCard className="text-2xl mb-2 text-secondary-400" />
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center">
              <FaStar className="text-2xl mb-2 text-secondary-400" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
        
        {/* Scroll Down Button */}
        <button 
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
          aria-label="Scroll down"
        >
          <FaChevronDown className="text-2xl" />
        </button>
      </section>
      
      {/* Categories Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          {/* Decorative elements */}
          <div className="absolute -top-24 right-24 w-64 h-64 bg-secondary-300/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-16 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block text-secondary-600 font-semibold mb-2">SHOP BY CATEGORY</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 text-gray-800">Find Your Perfect Parts</h2>
            <div className="w-24 h-1 bg-secondary-400 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Browse our extensive collection of premium automotive parts and accessories for every make and model
            </p>
          </div>
          
          {categoriesLoading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : (
            <>
              {/* Featured Categories Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {displayCategories.map((category, index) => (
                  <Link 
                    key={index} 
                    to={`/products${category.id ? `?category_id=${category.id}` : ''}`}
                    className="group"
                  >
                    <div className="backdrop-blur-sm bg-white/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 h-full border border-gray-100/50 group-hover:border-secondary-200/50 flex flex-col items-center justify-center relative overflow-hidden group-hover:-translate-y-2">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary-400/80 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                      
                      {/* Decorative corner accent */}
                      <div className="absolute top-0 right-0 w-16 h-16 transform translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500">
                        <div className="absolute inset-0 bg-secondary-400/20 rounded-full blur-md"></div>
                      </div>
                      
                      <div className="relative w-full pt-10 pb-6 px-6">
                        <div className="flex flex-col items-center">
                          <div className="bg-gradient-to-br from-secondary-100 to-secondary-200 text-secondary-700 rounded-full p-5 mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg shadow-sm relative">
                            <div className="absolute inset-0 rounded-full blur-sm bg-secondary-300/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10">
                              {category.icon}
                            </div>
                          </div>
                          
                          <h3 className="font-bold text-xl md:text-2xl mb-3 text-gray-800 group-hover:text-secondary-700 transition-colors duration-300">{category.name}</h3>
                          <p className="text-gray-600 text-center">{category.description}</p>
                          
                          <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            <span className="inline-flex items-center text-white bg-secondary-600 py-2 px-4 rounded-full text-sm font-medium shadow-md">
                              Browse Products
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom shine effect */}
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-secondary-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Browse All Categories Button */}
              <div className="text-center">
                <Link to="/products" className="inline-flex items-center justify-center bg-gray-100 hover:bg-secondary-50 text-secondary-800 py-3 px-6 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all duration-300 group">
                  <span className="font-medium">Browse All Categories</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-secondary-600 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
        
        {/* Part Count Banner */}
        <div className="mt-20">
          <div className="container mx-auto px-4">
            <div className="bg-secondary-600/95 backdrop-blur-lg rounded-xl shadow-xl py-8 px-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-grid-pattern opacity-5"></div>
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary-400/30 rounded-full blur-3xl"></div>
              
              <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Find Parts For Your Vehicle</h3>
                  <p className="text-secondary-100 text-lg">Over 15,000+ parts available for all makes and models</p>
                </div>
                <Link 
                  to="/products"
                  className="whitespace-nowrap bg-white hover:bg-gray-50 text-secondary-800 font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center"
                >
                  Search By Vehicle
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-gray-100"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 relative">
                Featured Products
                <span className="absolute -bottom-2 left-0 h-1 w-24 bg-secondary-400 rounded-full"></span>
              </h2>
              <p className="text-gray-600">Our best selling automotive products and accessories</p>
            </div>
            <Link to="/products" className="mt-4 md:mt-0 group inline-flex items-center text-primary-600 hover:text-primary-800 font-semibold transition-all duration-300">
              View All Products
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {productsLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 8).map((product) => (
                <div 
                  key={product.id} 
                  className="group relative backdrop-blur-sm bg-white/90 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary-400/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10"></div>
                  
                  <div className="relative p-3">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-50/30 to-transparent"></div>
          {/* Decorative elements */}
          <div className="absolute top-12 left-12 w-32 h-32 bg-primary-300/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-12 right-12 w-64 h-64 bg-secondary-300/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block text-primary-600 font-semibold mb-2">WHY CHOOSE US</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 text-gray-800">The CarZone Experience</h2>
            <div className="w-24 h-1 bg-secondary-400 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We take pride in providing the highest quality automotive products and an exceptional shopping experience
            </p>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="backdrop-blur-sm bg-white/60 rounded-xl p-6 text-center border border-gray-100/50 hover:border-primary-200/50 transition-all shadow-sm hover:shadow-md">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-1">15k+</div>
              <div className="text-gray-600">Products</div>
            </div>
            <div className="backdrop-blur-sm bg-white/60 rounded-xl p-6 text-center border border-gray-100/50 hover:border-primary-200/50 transition-all shadow-sm hover:shadow-md">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-1">98%</div>
              <div className="text-gray-600">Satisfaction</div>
            </div>
            <div className="backdrop-blur-sm bg-white/60 rounded-xl p-6 text-center border border-gray-100/50 hover:border-primary-200/50 transition-all shadow-sm hover:shadow-md">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-1">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
            <div className="backdrop-blur-sm bg-white/60 rounded-xl p-6 text-center border border-gray-100/50 hover:border-primary-200/50 transition-all shadow-sm hover:shadow-md">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-1">3.5k+</div>
              <div className="text-gray-600">Reviews</div>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="backdrop-blur-sm bg-white/80 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-400/80 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <div className="inline-block p-5 bg-primary-100/80 rounded-full mb-6 transform transition-transform duration-300 group-hover:scale-110 relative">
                <div className="absolute inset-0 rounded-full blur-sm bg-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <FaShieldAlt className="text-3xl text-primary-600" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-primary-700 transition-colors duration-300">Premium Quality</h3>
              <p className="text-gray-600 mb-4">
                All our products undergo rigorous quality testing to ensure they meet the highest industry standards. We partner with trusted manufacturers to deliver automotive excellence.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>OEM & Aftermarket Parts</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Warranty Protection</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Performance Tested</span>
                </li>
              </ul>
            </div>
            
            <div className="backdrop-blur-sm bg-white/80 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-400/80 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <div className="inline-block p-5 bg-primary-100/80 rounded-full mb-6 transform transition-transform duration-300 group-hover:scale-110 relative">
                <div className="absolute inset-0 rounded-full blur-sm bg-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <FaWrench className="text-3xl text-primary-600" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-primary-700 transition-colors duration-300">Expert Knowledge</h3>
              <p className="text-gray-600 mb-4">
                Our team of automotive specialists brings decades of combined experience to help you find the perfect parts and accessories for your specific vehicle needs.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Certified Mechanics</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Personalized Recommendations</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Technical Support</span>
                </li>
              </ul>
            </div>
            
            <div className="backdrop-blur-sm bg-white/80 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-400/80 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <div className="inline-block p-5 bg-primary-100/80 rounded-full mb-6 transform transition-transform duration-300 group-hover:scale-110 relative">
                <div className="absolute inset-0 rounded-full blur-sm bg-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <FaShippingFast className="text-3xl text-primary-600" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-primary-700 transition-colors duration-300">Premium Service</h3>
              <p className="text-gray-600 mb-4">
                We offer fast shipping, easy returns, and responsive customer service to ensure your complete satisfaction from purchase to installation.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Fast Delivery Options</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>30-Day Hassle-Free Returns</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Live Customer Support</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Customer Testimonial */}
          <div className="mt-16 backdrop-blur-md bg-white/50 rounded-xl overflow-hidden border border-white shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-2 bg-primary-800 text-white p-8 flex items-center">
                <div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-6 w-6 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">What Our Customers Say</h3>
                  <blockquote className="text-lg italic mb-4">
                    "CarZone delivered the exact parts I needed for my restoration project. Their expert advice saved me time and money. I wouldn't shop anywhere else for automotive parts."
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold">JM</span>
                    </div>
                    <div>
                      <div className="font-bold">James Mitchell</div>
                      <div className="text-sm text-primary-200">Car Enthusiast</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3 p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">The CarZone Difference</h3>
                  <p className="text-gray-600">
                    Our commitment to quality extends beyond our products to every aspect of your shopping experience.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="bg-primary-100 rounded-full p-2 mr-3 text-primary-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Vehicle-Specific Fitment</h4>
                      <p className="text-sm text-gray-600">Our parts are guaranteed to fit your vehicle's make and model</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary-100 rounded-full p-2 mr-3 text-primary-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Price Match Guarantee</h4>
                      <p className="text-sm text-gray-600">Find it cheaper elsewhere? We'll match the price plus 10% off</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary-100 rounded-full p-2 mr-3 text-primary-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Loyalty Rewards</h4>
                      <p className="text-sm text-gray-600">Earn points with every purchase that can be redeemed for discounts</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary-100 rounded-full p-2 mr-3 text-primary-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Installation Guides</h4>
                      <p className="text-sm text-gray-600">Detailed installation instructions and videos for DIY projects</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-24 bg-primary-800 text-white relative overflow-hidden">
        {/* Background with parallax effect */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/cta-background.jpg" 
            alt="Car Parts"
            className="w-full h-full object-cover opacity-20 filter blur-md scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-black/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-secondary-500/10 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-tl from-secondary-500/10 to-transparent"></div>
          <div className="absolute -left-24 bottom-1/4 w-48 h-48 rounded-full bg-primary-600/30 blur-3xl"></div>
          <div className="absolute -right-24 top-1/4 w-64 h-64 rounded-full bg-secondary-600/20 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 max-w-2xl">
              <div className="relative">
                <div className="absolute -left-4 -top-4 w-24 h-24 rounded-full bg-secondary-400/20 blur-lg animate-pulse"></div>
                <span className="inline-block h-1 w-12 bg-secondary-400 rounded-full mb-4 relative z-10"></span>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight relative z-10">
                  Ready to <span className="text-secondary-400">Transform</span> Your Vehicle?
                </h2>
                <p className="text-gray-200 md:text-xl mb-8 max-w-lg">
                  {getSetting('site_description', 'Join thousands of satisfied customers who have upgraded their vehicles with premium CarZone parts and accessories.')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10 flex items-center">
                  <div className="bg-secondary-500/20 p-3 rounded-full mr-4">
                    <FaShippingFast className="text-secondary-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Free Shipping</h3>
                    <p className="text-gray-300 text-sm">On orders over $99</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10 flex items-center">
                  <div className="bg-secondary-500/20 p-3 rounded-full mr-4">
                    <FaShieldAlt className="text-secondary-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Warranty</h3>
                    <p className="text-gray-300 text-sm">1-year minimum</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/products" 
                  className="group bg-secondary-500 hover:bg-secondary-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-secondary-500/30 transition-all duration-300 flex items-center"
                >
                  Shop Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link 
                  to="/contact"
                  className="group border-2 border-white/80 text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center"
                >
                  Get Advice
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* 3D Card Effect */}
            <div className="lg:w-1/2 perspective-1000">
              <div className="relative transform-style-3d transition-transform duration-500 hover:rotate-y-5 hover:rotate-x-5 group">
                {/* Card Background */}
                <div className="bg-gradient-to-br from-primary-700 to-primary-900 p-8 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden transform-style-3d hover:shadow-primary-400/10 transition-all duration-500">
                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/10 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-secondary-400/20 to-transparent rounded-full blur-lg"></div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="flex flex-col h-full relative z-10">
                    {/* Floating Badge */}
                    <div className="absolute -right-3 -top-3 bg-secondary-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                      Limited Time
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2 flex items-center">
                      <span className="text-secondary-400 mr-2">{getSetting('special_discount', '20%')}</span> 
                      OFF Selected Items
                    </h3>
                    
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      {categoriesLoading ? (
                        <Spinner />
                      ) : (
                        categories.slice(0, 4).map((category, index) => (
                          <div 
                            key={index} 
                            className="flex items-center bg-white/5 backdrop-blur-sm p-3 rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/5 cursor-pointer transform-style-3d hover:shadow-lg hover:-translate-y-1"
                          >
                            <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-2 rounded-full mr-3">
                              {getCategoryIcon(category.name)}
                            </div>
                            <div className="text-sm">
                              <div className="font-semibold text-white">{category.name}</div>
                              <div className="text-xs text-gray-300">Save up to {30 - index * 5}%</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="mt-auto">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold text-gray-200">Offer ends in:</div>
                        <div className="text-secondary-300 text-sm">Limited stock available</div>
                      </div>
                      
                      <div className="flex gap-2 mb-4">
                        <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/5 text-center w-16">
                          <div className="text-2xl font-bold text-white">03</div>
                          <div className="text-xs text-gray-300">Days</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/5 text-center w-16">
                          <div className="text-2xl font-bold text-white">08</div>
                          <div className="text-xs text-gray-300">Hours</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/5 text-center w-16">
                          <div className="text-2xl font-bold text-white">27</div>
                          <div className="text-xs text-gray-300">Mins</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/5 text-center w-16">
                          <div className="text-2xl font-bold text-white">45</div>
                          <div className="text-xs text-gray-300">Secs</div>
                        </div>
                      </div>
                      
                      <Link 
                        to="/products" 
                        className="block w-full bg-secondary-500 hover:bg-secondary-600 text-center text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-secondary-500/30 transition-all duration-300 group"
                      >
                        Shop Limited-Time Deals
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 inline-block transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* 3D Shadow */}
                <div className="absolute inset-0 bg-black/30 blur-xl -z-10 translate-z-[-20px] scale-[0.95] rounded-2xl opacity-70"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 