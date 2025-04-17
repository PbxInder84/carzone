import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProducts } from '../features/products/productSlice';
import { getCategories } from '../features/categories/categorySlice';
import ProductCard from '../components/products/ProductCard';
import FeaturedProduct from '../components/products/FeaturedProduct';
import ProductSlider from '../components/products/ProductSlider';
import Spinner from '../components/layout/Spinner';
import { FaFilter, FaSortAmountDown, FaSortAmountUpAlt, FaTimes, FaArrowRight, 
  FaShoppingBag, FaTags, FaDollarSign, FaSlidersH, FaStar, FaFire, 
  FaArrowUp, FaSearch, FaChevronDown } from 'react-icons/fa';
import { resetFilteredProducts, setFilters } from '../features/products/productSlice';
import { getImageUrl } from '../utils/imageUtils';
import { formatCurrency, formatNumber } from '../utils/formatters';

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, isLoading, totalPages, currentPage } = useSelector((state) => state.products);
  const { categories, isLoading: categoriesLoading } = useSelector((state) => state.categories);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [initialSearchDone, setInitialSearchDone] = useState(false);
  const [categoryProductCounts, setCategoryProductCounts] = useState({});
  
  const productGridRef = useRef(null);
  
  // Parse query params on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    const categoryIdParam = params.get('category_id');
    const priceMinParam = params.get('price_min');
    const priceMaxParam = params.get('price_max');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else if (categoryIdParam) {
      setSelectedCategory(categoryIdParam);
    }
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    if (priceMinParam) {
      setPriceRange(prev => ({ ...prev, min: priceMinParam }));
    }
    
    if (priceMaxParam) {
      setPriceRange(prev => ({ ...prev, max: priceMaxParam }));
    }
    
    // Fetch categories
    dispatch(getCategories());
  }, [location.search, dispatch]);
  
  // Calculate category product counts
  useEffect(() => {
    if (!isLoading && products && products.length > 0) {
      // Get counts of products in each category
      const counts = {};
      products.forEach(product => {
        if (product.category_id) {
          counts[product.category_id] = (counts[product.category_id] || 0) + 1;
        }
      });
      
      setCategoryProductCounts(counts);
    }
  }, [products, isLoading]);
  
  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = () => {
      const filters = {
        limit: 24,
        sort_by: sortBy,
        sort_dir: sortDirection
      };
      
      if (selectedCategory) {
        filters.category_id = selectedCategory;
      }
      
      if (searchTerm) {
        filters.search = searchTerm;
      }
      
      if (priceRange.min) {
        filters.price_min = priceRange.min;
      }
      
      if (priceRange.max) {
        filters.price_max = priceRange.max;
      }
      
      console.log("Applying filters:", filters);
      dispatch(getProducts(filters));
      
      // Update URL with filters
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category_id', selectedCategory);
      if (searchTerm) params.set('search', searchTerm);
      if (priceRange.min) params.set('price_min', priceRange.min);
      if (priceRange.max) params.set('price_max', priceRange.max);
      
      const newUrl = `${location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      if (initialSearchDone) {
        navigate(newUrl, { replace: true });
      } else {
        setInitialSearchDone(true);
      }
    };
    
    // Use a timeout to debounce the API calls
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [dispatch, selectedCategory, searchTerm, sortBy, sortDirection, priceRange, navigate, location.pathname, initialSearchDone]);
  
  // Handle back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
  };
  
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('created_at');
    setSortDirection('DESC');
    setPriceRange({ min: '', max: '' });
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const scrollToProducts = () => {
    productGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Get active category name
  const getActiveCategoryName = () => {
    if (!selectedCategory) return null;
    const category = categories.find(c => c.id.toString() === selectedCategory);
    return category ? category.name : null;
  };
  
  // Get product count for a category
  const getCategoryProductCount = (categoryId) => {
    // If we're filtering by a specific category, and this is that category
    if (selectedCategory && selectedCategory === categoryId.toString()) {
      return products.length;
    }
    
    // Otherwise use our counted data
    return categoryProductCounts[categoryId] || 0;
  };
  
  // Debug function to check filter state
  const logFilterState = () => {
    console.log("Current filters:", {
      searchTerm,
      selectedCategory,
      priceRange,
      sortBy,
      sortDirection
    });
  };
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 min-h-screen pt-0 pb-12">
      {/* Hero Section - Full 100vh height */}
      <div className="bg-gray-800 dark:bg-gray-800 text-white relative h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-700"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        <div className="absolute -right-20 top-10 w-64 h-64 bg-highlight-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 bottom-10 w-64 h-64 bg-highlight-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-12 relative z-10 flex-grow flex flex-col justify-center">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fadeIn">
              {getActiveCategoryName() 
                ? `${getActiveCategoryName()} Products` 
                : searchTerm 
                  ? `Search Results for "${searchTerm}"` 
                  : "Browse Our Products"}
            </h1>
            
          </div>
          
          {/* Featured Products Slider - Hero Section */}
          {!isLoading && products.length > 0 && (
            <div className="max-w-5xl mx-auto mt-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4 text-white flex items-center">
                  <FaFire className="mr-2 text-highlight-500" /> Popular Products
                </h2>
                {products.some(product => product.featured) ? (
                  <ProductSlider 
                    products={products.filter(product => product.featured)} 
                    autoSlideInterval={4000}
                  />
                ) : (
                  <ProductSlider 
                    products={[products[0]]} 
                    autoSlideInterval={4000}
                  />
                )}
              </div>
            </div>
          )}
          
          {/* Scroll down indicator - Position at bottom */}
          <div className="flex justify-center mt-auto pt-8">
            <button 
              onClick={scrollToProducts}
              className="text-white/80 hover:text-white flex flex-col items-center transition-colors duration-300 group animate-bounce"
              aria-label="Scroll to products"
            >
              <span className="text-sm mb-2">View All Products</span>
              <FaChevronDown className="group-hover:text-highlight-500" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8" ref={productGridRef}>      
        {/* Filter Results Summary */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4 sticky top-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 p-3 rounded-lg shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {isLoading ? 'Finding products...' : `${products.length} Products Found`}
            </h2>
            {(selectedCategory || searchTerm || priceRange.min || priceRange.max) && (
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex flex-wrap items-center gap-2">
                <span>Filters:</span>
                {selectedCategory && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-highlight-500 px-2 py-1 rounded-full text-xs inline-flex items-center">
                    {getActiveCategoryName() || `Category ${selectedCategory}`}
                    <button 
                      onClick={() => setSelectedCategory('')}
                      className="ml-1 text-highlight-500 hover:text-highlight-600"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-highlight-500 px-2 py-1 rounded-full text-xs inline-flex items-center">
                    Search: {searchTerm}
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="ml-1 text-highlight-500 hover:text-highlight-600"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                {(priceRange.min || priceRange.max) && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-highlight-500 px-2 py-1 rounded-full text-xs inline-flex items-center">
                    Price: {formatCurrency(priceRange.min || 0, true)} - {priceRange.max ? formatCurrency(priceRange.max, true) : '∞'}
                    <button 
                      onClick={() => setPriceRange({ min: '', max: '' })}
                      className="ml-1 text-highlight-500 hover:text-highlight-600"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                <button 
                  onClick={clearFilters}
                  className="text-highlight-500 hover:text-highlight-600 text-xs underline"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
          
          {/* Debug Button - Only in development */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={logFilterState}
              className="text-xs text-gray-400 hover:text-highlight-500"
            >
              Debug Filters
            </button>
          )}
          
          {/* Mobile Filter Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center bg-white dark:bg-gray-800 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-highlight-500 dark:hover:border-highlight-500 transition-all duration-300"
            >
              <FaFilter className="mr-2 text-highlight-500" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {/* Desktop Sort */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-gray-700 dark:text-gray-300">Sort By:</span>
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-highlight-500 dark:hover:border-highlight-500 transition-all duration-300">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none appearance-none bg-transparent"
              >
                <option value="created_at">Date Added</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
                <option value="popularity">Popularity</option>
              </select>
              <button
                onClick={toggleSortDirection}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-highlight-500/10 dark:hover:bg-highlight-500/10 text-gray-700 dark:text-gray-200 hover:text-highlight-500 dark:hover:text-highlight-500 transition-colors duration-300 border-l border-gray-200 dark:border-gray-700"
                title={sortDirection === 'ASC' ? 'Ascending' : 'Descending'}
              >
                {sortDirection === 'ASC' ? <FaSortAmountUpAlt /> : <FaSortAmountDown />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-1/4 lg:w-1/5`}>
            <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-32 overflow-hidden transition-all duration-300">
              <div className="bg-gray-100 dark:bg-gray-700 px-5 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                    <FaSlidersH className="mr-2 text-highlight-500" /> 
                    Filter Options
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-highlight-500 hover:text-highlight-600 flex items-center"
                  >
                    <FaTimes className="mr-1" /> Clear
                  </button>
                </div>
              </div>
              
              <div className="p-5 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                    <FaTags className="mr-2 text-highlight-500" /> Categories
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {categoriesLoading ? (
                      <div className="flex justify-center py-3">
                        <Spinner />
                      </div>
                    ) : categories.length > 0 ? (
                      categories.map(category => (
                        <div 
                          key={category.id} 
                          className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                            selectedCategory === category.id.toString() 
                              ? 'border-l-4 border-highlight-500 pl-2 text-highlight-500 dark:text-highlight-400' 
                              : 'border-l-4 border-transparent pl-2 hover:border-highlight-500 hover:pl-3 text-gray-700 dark:text-gray-200'
                          }`}
                          onClick={() => handleCategoryChange(category.id.toString())}
                        >
                          <input
                            type="checkbox"
                            id={`category-${category.id}`}
                            checked={selectedCategory === category.id.toString()}
                            onChange={() => {}}
                            className="mr-3 accent-highlight-500"
                          />
                          <label 
                            htmlFor={`category-${category.id}`} 
                            className="cursor-pointer flex-grow"
                          >
                            {category.name}
                          </label>
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full px-2 py-1">
                            {getCategoryProductCount(category.id)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No categories found</p>
                    )}
                  </div>
                </div>
                
                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                    <FaDollarSign className="mr-2 text-highlight-500" /> Price Range
                  </h3>
                  <div className="flex space-x-2 items-center">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                      <input
                        type="number"
                        name="min"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={handlePriceChange}
                        className="w-full pl-7 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-highlight-500 dark:focus:border-highlight-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight-500/50 text-gray-700 dark:text-gray-200"
                      />
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">to</div>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                      <input
                        type="number"
                        name="max"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={handlePriceChange}
                        className="w-full pl-7 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-highlight-500 dark:focus:border-highlight-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight-500/50 text-gray-700 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Mobile Only: Sort Options */}
                <div className="md:hidden">
                  <h3 className="font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                    <FaSortAmountDown className="mr-2 text-highlight-500" /> Sort Options
                  </h3>
                  <div className="flex items-center">
                    <select
                      value={sortBy}
                      onChange={handleSortChange}
                      className="flex-grow p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-highlight-500 dark:focus:border-highlight-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight-500/50 text-gray-700 dark:text-gray-200"
                    >
                      <option value="created_at">Date Added</option>
                      <option value="price">Price</option>
                      <option value="name">Name</option>
                      <option value="popularity">Popularity</option>
                    </select>
                    <button
                      onClick={toggleSortDirection}
                      className="ml-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-highlight-500/10 dark:hover:bg-highlight-500/10 hover:text-highlight-500 dark:hover:text-highlight-500 transition-colors duration-300"
                      title={sortDirection === 'ASC' ? 'Ascending' : 'Descending'}
                    >
                      {sortDirection === 'ASC' ? <FaSortAmountUpAlt /> : <FaSortAmountDown />}
                    </button>
                  </div>
                </div>
                
                {/* Apply Filter Button (Mobile) */}
                <div className="md:hidden pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full py-3 bg-highlight-500 hover:bg-highlight-600 text-white rounded-lg transition-colors duration-300 flex items-center justify-center"
                  >
                    Apply Filters <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="md:w-3/4 lg:w-4/5">
            {isLoading ? (
              <div className="flex justify-center items-center py-24">
                <Spinner size="lg" />
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Pagination - Placeholder for future implementation */}
                {products.length > 0 && !isLoading && totalPages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <div className="inline-flex rounded-md shadow-sm">
                      <button 
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-highlight-500 dark:hover:border-highlight-500 rounded-l-lg transition-all duration-300"
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      {/* Page numbers would go here */}
                      <button 
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-highlight-500 dark:hover:border-highlight-500 rounded-r-lg transition-all duration-300"
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 border border-highlight-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingBag className="text-gray-400 dark:text-gray-500 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">No Products Found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  We couldn't find any products matching your current filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-highlight-500 hover:bg-highlight-600 text-white border border-highlight-500 px-5 py-2 rounded-lg transition duration-300 inline-flex items-center"
                >
                  <FaTimes className="mr-2" /> Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-highlight-500 hover:bg-highlight-600 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-300 animate-fadeIn"
          aria-label="Back to top"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default Products;