import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getProducts } from '../features/products/productSlice';
import { getCategories } from '../features/categories/categorySlice';
import ProductCard from '../components/products/ProductCard';
import Spinner from '../components/layout/Spinner';
import { FaFilter, FaSortAmountDown, FaSortAmountUpAlt, FaTimes, FaArrowRight, FaShoppingBag, FaTags, FaDollarSign, FaSlidersH } from 'react-icons/fa';

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, isLoading, totalPages, currentPage } = useSelector((state) => state.products);
  const { categories, isLoading: categoriesLoading } = useSelector((state) => state.categories);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  
  // Parse query params on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    const categoryIdParam = params.get('category_id');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else if (categoryIdParam) {
      setSelectedCategory(categoryIdParam);
    }
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    // Fetch categories
    dispatch(getCategories());
  }, [location.search, dispatch]);
  
  // Fetch products when filters change
  useEffect(() => {
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
    
    dispatch(getProducts(filters));
  }, [dispatch, selectedCategory, searchTerm, sortBy, sortDirection, priceRange]);
  
  
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
  
  // Get active category name
  const getActiveCategoryName = () => {
    if (!selectedCategory) return null;
    const category = categories.find(c => c.id.toString() === selectedCategory);
    return category ? category.name : null;
  };
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-16 pb-12">
      {/* Hero Section */}
      <div className="bg-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        <div className="absolute -right-20 top-10 w-64 h-64 bg-secondary-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 bottom-10 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {getActiveCategoryName() 
                ? `${getActiveCategoryName()} Products` 
                : searchTerm 
                  ? `Search Results for "${searchTerm}"` 
                  : "Browse Our Products"}
            </h1>
            <p className="text-lg text-gray-100 mb-8">
              Discover our premium collection of automotive parts and accessories designed to enhance your driving experience.
            </p>
            
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">      
        {/* Filter Results Summary */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {isLoading ? 'Finding products...' : `${products.length} Products Found`}
            </h2>
            {(selectedCategory || searchTerm || priceRange.min || priceRange.max) && (
              <div className="text-sm text-gray-600 mt-1 flex flex-wrap items-center gap-2">
                <span>Filters:</span>
                {selectedCategory && (
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs inline-flex items-center">
                    {getActiveCategoryName()}
                    <button 
                      onClick={() => setSelectedCategory('')}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs inline-flex items-center">
                    Search: {searchTerm}
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                {(priceRange.min || priceRange.max) && (
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs inline-flex items-center">
                    Price: ${priceRange.min || '0'} - ${priceRange.max || '∞'}
                    <button 
                      onClick={() => setPriceRange({ min: '', max: '' })}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                <button 
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-800 text-xs underline"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
          
          {/* Mobile Filter Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center bg-white px-4 py-2 rounded-lg text-primary-700 border border-primary-200 shadow-sm hover:bg-primary-50 transition-all duration-300"
            >
              <FaFilter className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {/* Desktop Sort */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-gray-700">Sort By:</span>
            <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-3 py-2 text-gray-700 focus:outline-none appearance-none bg-transparent"
              >
                <option value="created_at">Date Added</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
                <option value="popularity">Popularity</option>
              </select>
              <button
                onClick={toggleSortDirection}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-300 border-l border-gray-200"
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
            <div className="backdrop-blur-sm bg-white/90 rounded-xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
              <div className="bg-primary-50 px-5 py-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-primary-800 flex items-center">
                    <FaSlidersH className="mr-2" /> 
                    Filter Options
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    <FaTimes className="mr-1" /> Clear
                  </button>
                </div>
              </div>
              
              <div className="p-5 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800 flex items-center">
                    <FaTags className="mr-2 text-primary-600" /> Categories
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
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
                              ? 'bg-primary-100 text-primary-800' 
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                          onClick={() => handleCategoryChange(category.id.toString())}
                        >
                          <input
                            type="checkbox"
                            id={`category-${category.id}`}
                            checked={selectedCategory === category.id.toString()}
                            onChange={() => {}}
                            className="mr-3 accent-primary-600"
                          />
                          <label 
                            htmlFor={`category-${category.id}`} 
                            className="cursor-pointer flex-grow"
                          >
                            {category.name}
                          </label>
                          <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
                            {category.product_count || '0'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No categories found</p>
                    )}
                  </div>
                </div>
                
                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800 flex items-center">
                    <FaDollarSign className="mr-2 text-primary-600" /> Price Range
                  </h3>
                  <div className="flex space-x-2 items-center">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        name="min"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={handlePriceChange}
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-700"
                      />
                    </div>
                    <div className="text-gray-500">to</div>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        name="max"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={handlePriceChange}
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-700"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Mobile Only: Sort Options */}
                <div className="md:hidden">
                  <h3 className="font-semibold mb-3 text-gray-800 flex items-center">
                    <FaSortAmountDown className="mr-2 text-primary-600" /> Sort Options
                  </h3>
                  <div className="flex items-center">
                    <select
                      value={sortBy}
                      onChange={handleSortChange}
                      className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-700"
                    >
                      <option value="created_at">Date Added</option>
                      <option value="price">Price</option>
                      <option value="name">Name</option>
                      <option value="popularity">Popularity</option>
                    </select>
                    <button
                      onClick={toggleSortDirection}
                      className="ml-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      title={sortDirection === 'ASC' ? 'Ascending' : 'Descending'}
                    >
                      {sortDirection === 'ASC' ? <FaSortAmountUpAlt /> : <FaSortAmountDown />}
                    </button>
                  </div>
                </div>
                
                {/* Apply Filter Button (Mobile) */}
                <div className="md:hidden pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-300 flex items-center justify-center"
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
                <Spinner />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="backdrop-blur-sm bg-white/90 rounded-xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingBag className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">No Products Found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any products matching your current filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg transition duration-300 inline-flex items-center"
                >
                  <FaTimes className="mr-2" /> Clear All Filters
                </button>
              </div>
            )}
            
            {/* Pagination - Placeholder for future implementation */}
            {products.length > 0 && !isLoading && totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <div className="inline-flex rounded-md shadow-sm">
                  <button 
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50"
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {/* Page numbers would go here */}
                  <button 
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50"
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products; 