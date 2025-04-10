import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts } from '../features/products/productSlice';
import ProductCard from '../components/products/ProductCard';
import Spinner from '../components/layout/Spinner';
import { FaCar, FaTools, FaWrench, FaLightbulb, FaStar } from 'react-icons/fa';

const Home = () => {
  const dispatch = useDispatch();
  
  const { products, isLoading } = useSelector((state) => state.products);
  
  useEffect(() => {
    dispatch(getProducts({ limit: 8, sort_by: 'created_at', sort_dir: 'DESC' }));
  }, [dispatch]);
  
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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Premium Car Accessories for Every Driver
              </h1>
              <p className="text-lg mb-8">
                Upgrade your driving experience with our curated collection of high-quality car accessories.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn-secondary">
                  Shop Now
                </Link>
                <Link to="/about" className="btn-outline text-white border-white hover:bg-primary-700">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Stylish Car"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
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
      <section className="py-16 bg-secondary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Upgrade Your Car?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Explore our wide range of car accessories and find the perfect additions to enhance your driving experience.
          </p>
          <Link to="/products" className="btn-primary bg-white text-secondary-600 hover:bg-gray-100">
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 