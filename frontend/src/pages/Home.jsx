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
  FaBolt, FaTachometerAlt, FaCog, FaArrowRight, FaHeadset, FaRedo
} from 'react-icons/fa';
import { useSettings } from '../utils/useSettings';
import { useSiteSettings } from '../components/layout/SettingsContext';
import { formatCurrency } from '../utils/formatters';

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
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-800/70 backdrop-blur-md" />
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 z-10 text-white text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fadeIn font-poppins">
            Drive in <span className="text-highlight-500">Style</span> <br />
            Upgrade with Confidence
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-200 animate-fadeIn animation-delay-300">
            Premium automotive accessories for every car enthusiast. Transform your driving experience today.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fadeIn animation-delay-500">
            <Link to="/products" className="btn-primary text-lg px-8 py-3">
              Shop Now
            </Link>
            <Link to="/about" className="btn-outline text-white border-white hover:bg-white/10 text-lg px-8 py-3">
              Explore
            </Link>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <FaShieldAlt className="text-2xl mb-2 text-highlight-500" />
              <span className="text-sm">Quality Guarantee</span>
            </div>
            <div className="flex flex-col items-center">
              <FaShippingFast className="text-2xl mb-2 text-highlight-500" />
              <span className="text-sm">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center">
              <FaCreditCard className="text-2xl mb-2 text-highlight-500" />
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center">
              <FaStar className="text-2xl mb-2 text-highlight-500" />
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
      <section className="py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-poppins text-white">
            Shop by Category
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categoriesLoading ? (
              <div className="col-span-4 flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              displayCategories.map((category, index) => (
                <Link key={index} to={`/products${category.id ? `?category_id=${category.id}` : ''}`}>
                  <div className="bg-white rounded-card shadow-card hover:shadow-lg transition-shadow p-6 text-center h-full flex flex-col items-center justify-center border border-soft-200">
                    <div className="bg-slate-100 text-highlight-500 rounded-full p-3 mb-4">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 font-poppins text-slate-800">{category.name}</h3>
                    <p className="text-slate-600 text-sm mt-auto">this is category {index + 1}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold font-poppins text-white">Featured Products</h2>
            <Link to="/products" className="text-primary-400 hover:text-highlight-500 font-semibold flex items-center">
              View All <FaArrowRight className="ml-2 text-sm" />
            </Link>
          </div>
          
          {productsLoading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-poppins text-white">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-card shadow-card text-center">
              <div className="inline-block p-4 bg-slate-900 rounded-full mb-4">
                <FaStar className="text-3xl text-highlight-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins text-slate-800">Premium Quality</h3>
              <p className="text-slate-400">
                All our products are carefully selected to ensure the highest quality standards.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-card shadow-card text-center">
              <div className="inline-block p-4 bg-slate-900 rounded-full mb-4">
                <FaHeadset className="text-3xl text-highlight-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins text-slate-800">Expert Support</h3>
              <p className="text-slate-400">
                Our team of automotive experts is available 24/7 to assist you with any questions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-card shadow-card text-center">
              <div className="inline-block p-4 bg-slate-900 rounded-full mb-4">
                <FaRedo className="text-3xl text-highlight-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins text-slate-800">Easy Returns</h3>
              <p className="text-slate-400">
                Not satisfied? Return your products within 30 days for a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Promo Section */}
      <section className="py-16 bg-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold mb-4 font-poppins">Ready to Transform Your Car?</h2>
              <p className="text-xl text-gray-300 mb-6">
                Join thousands of satisfied customers who upgraded their vehicles with us.
              </p>
              <Link to="/products" className="btn-primary inline-block px-8 py-3">
                Shop Now
              </Link>
            </div>
            <div className="w-full md:w-1/3 bg-slate-700 p-6 rounded-card">
              <h3 className="text-2xl font-bold mb-4 text-highlight-500 font-poppins">Special Offer</h3>
              <p className="mb-4 text-gray-300">
                Get <span className="text-highlight-500 font-bold">15% OFF</span> on your first order
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Use code: <span className="font-mono font-bold">FIRST15</span>
              </p>
              <div className="border-t border-slate-600 pt-4 text-sm text-gray-400">
                *Offer valid for new customers only
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Customer Testimonials */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">What Our Customers Say</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Don't just take our word for it. Here's what our customers have to say about their experience with us.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-highlight-500 text-white rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 mr-1" />
                  ))}
                </div>
              </div>
              <p className="text-slate-400 italic mb-4">"The quality of the parts I received was exceptional. Everything fit perfectly, and the shipping was faster than expected. Definitely my go-to source for car parts now!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Customer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-600">Bangalore, Karnataka</h4>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-highlight-500 text-white rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < 4 ? "text-yellow-400 mr-1" : "text-gray-300 mr-1"} />
                  ))}
                </div>
              </div>
              <p className="text-slate-400 italic mb-4">"I was skeptical about ordering car accessories online, but the customer service team was incredibly helpful. They guided me through the selection process and even followed up after delivery."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Customer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-600">Delhi, NCR</h4>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-highlight-500 text-white rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 mr-1" />
                  ))}
                </div>
              </div>
              <p className="text-slate-400 italic mb-4">"The performance upgrade kit I purchased has completely transformed my driving experience. The installation instructions were clear, and the results exceeded my expectations. Worth every rupee!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="Customer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-600">Mumbai, Maharashtra</h4>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/testimonials" className="inline-flex items-center text-highlight-500 hover:text-highlight-400 font-medium">
              Read More Customer Stories
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Frequently Asked Questions</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Have questions? We've got answers to the most common questions our customers ask.</p>
          </div>
          
          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            {/* FAQ Item 1 */}
            <div className="py-5">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className="text-lg font-semibold text-slate-800">How long does shipping take?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24" className="text-highlight-500">
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-600 mt-3 group-open:animate-fadeIn">
                  Standard shipping usually takes 3-5 business days across major Indian cities. For remote areas, it may take 5-7 business days. We offer express shipping options at checkout for faster delivery.
                </p>
              </details>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="py-5">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className="text-lg font-semibold text-slate-800">What is your return policy?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24" className="text-highlight-500">
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-600 mt-3 group-open:animate-fadeIn">
                  We offer a 30-day return policy on most products. If you're not satisfied with your purchase, you can return it within 30 days for a full refund or exchange. Please note that the items must be in their original condition and packaging.
                </p>
              </details>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="py-5">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className="text-lg font-semibold text-slate-800">Are the products compatible with all car models?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24" className="text-highlight-500">
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-600 mt-3 group-open:animate-fadeIn">
                  Each product listing includes compatibility information. You can use our vehicle finder tool to check if a product fits your specific car make and model. If you're unsure, our customer service team is always available to assist you.
                </p>
              </details>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="py-5">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className="text-lg font-semibold text-slate-800">Do you offer installation services?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24" className="text-highlight-500">
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-600 mt-3 group-open:animate-fadeIn">
                  Yes, we partner with certified mechanics across major Indian cities. During checkout, you can select the installation service option, and our team will coordinate with a local partner in your area. Additional charges may apply based on the complexity of installation.
                </p>
              </details>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/faq" className="inline-flex items-center text-highlight-500 hover:text-highlight-400 font-medium">
              View All FAQs
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 