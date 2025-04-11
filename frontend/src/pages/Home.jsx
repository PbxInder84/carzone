import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts } from '../features/products/productSlice';
import ProductCard from '../components/products/ProductCard';
import Spinner from '../components/layout/Spinner';
import { FaCar, FaTools, FaWrench, FaLightbulb, FaStar, FaChevronDown, FaShieldAlt, FaShippingFast, FaCreditCard } from 'react-icons/fa';

const Home = () => {
  const dispatch = useDispatch();
  
  const { products, isLoading } = useSelector((state) => state.products);
  
  useEffect(() => {
    dispatch(getProducts({ limit: 8, sort_by: 'created_at', sort_dir: 'DESC' }));
  }, [dispatch]);
  
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };
  
  const categories = [
    {
      id: 'interior',
      name: 'Interior Accessories',
      icon: <FaCar className="text-4xl text-primary-600 group-hover:text-white transition duration-300" />,
      description: 'Enhance your car\'s interior with premium accessories.'
    },
    {
      id: 'exterior',
      name: 'Exterior Accessories',
      icon: <FaWrench className="text-4xl text-primary-600 group-hover:text-white transition duration-300" />,
      description: 'Make your car stand out with our exterior upgrades.'
    },
    {
      id: 'electronics',
      name: 'Electronics',
      icon: <FaLightbulb className="text-4xl text-primary-600 group-hover:text-white transition duration-300" />,
      description: 'Smart electronic solutions for a modern driving experience.'
    },
    {
      id: 'tools',
      name: 'Tools & Equipment',
      icon: <FaTools className="text-4xl text-primary-600 group-hover:text-white transition duration-300" />,
      description: 'Quality tools for maintenance and repairs.'
    }
  ];
  
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
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-black/70" />
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={`/products?category=${category.id}`}
                className="bg-white p-6 rounded-lg shadow-md group hover:bg-primary-600 transition duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  {category.icon}
                  <h3 className="text-xl font-semibold my-4 group-hover:text-white transition duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 group-hover:text-white transition duration-300">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-800 font-semibold">
              View All
            </Link>
          </div>
          
          {isLoading ? (
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
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
                <FaStar className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                All our products are carefully selected to ensure the highest quality standards.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
                <FaStar className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Advice</h3>
              <p className="text-gray-600">
                Our team of car enthusiasts is always ready to help you find the perfect accessories.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
                <FaStar className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">
                Enjoy quick delivery with our efficient shipping services to get your products faster.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-primary-900 to-secondary-800 overflow-hidden relative">
        {/* Animated background circle */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-secondary-500/20 blur-3xl animate-pulse"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Left content */}
            <div className="md:w-7/12">
              <div className="inline-block bg-secondary-500 rounded-full px-4 py-1 text-xs text-white font-medium mb-4">
                LIMITED TIME OFFER
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-400">Transform</span> Your Drive?
              </h2>
              <p className="text-gray-200 md:text-lg mb-8 max-w-md">
                Premium accessories with 2-day shipping and 30-day returns
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/products" 
                  className="bg-white text-primary-800 font-bold px-8 py-3 rounded-lg hover:bg-secondary-100 transition-colors duration-300"
                >
                  Shop Now
                </Link>
                <Link 
                  to="/contact"
                  className="border-2 border-white/80 text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  Get Advice
                </Link>
              </div>
            </div>
            
            {/* Right content */}
            <div className="md:w-4/12 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 mt-8 md:mt-0">
              <div className="flex items-start gap-4">
                <div className="bg-secondary-100 rounded-lg p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-secondary-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Premium Interior Collection</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-white">$199</span>
                    <span className="text-sm text-gray-300 line-through">$249</span>
                    <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded">20% OFF</span>
                  </div>
                  <Link 
                    to="/products/interior-collection" 
                    className="inline-flex items-center text-secondary-300 hover:text-secondary-200 font-medium"
                  >
                    View Collection
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 