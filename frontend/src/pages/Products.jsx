import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getProducts } from '../features/products/productSlice';
import { getCategories } from '../features/categories/categorySlice';
import ProductCard from '../components/products/ProductCard';
import Spinner from '../components/layout/Spinner';
import { FaFilter, FaSearch, FaSortAmountDown, FaSortAmountUpAlt, FaTimes } from 'react-icons/fa';

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, isLoading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  
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
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
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
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the useEffect above
  };
  
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
  
  return (
    <div className="page-container">
      <h1 className="page-title">Our Products</h1>
      
      {/* Search Bar (Desktop) */}
      <div className="mb-8 max-w-2xl mx-auto hidden md:block">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search products..."
            className="input-field rounded-r-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-2 rounded-r hover:bg-primary-700 transition duration-300 flex items-center"
          >
            <FaSearch className="mr-2" /> Search
          </button>
        </form>
      </div>
      
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center bg-gray-100 py-3 rounded-lg text-gray-700"
        >
          <FaFilter className="mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters (Desktop always visible, Mobile conditional) */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-1/4`}>
          <div className="card sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
              >
                <FaTimes className="mr-1" /> Clear All
              </button>
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-700">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedCategory === category.id.toString()}
                      onChange={() => handleCategoryChange(category.id.toString())}
                      className="mr-2"
                    />
                    <label htmlFor={`category-${category.id}`} className="text-gray-700">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-700">Price Range</h3>
              <div className="flex space-x-2">
                <div>
                  <input
                    type="number"
                    name="min"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={handlePriceChange}
                    className="input-field text-sm py-1"
                  />
                </div>
                <div className="flex items-center">-</div>
                <div>
                  <input
                    type="number"
                    name="max"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                    className="input-field text-sm py-1"
                  />
                </div>
              </div>
            </div>
            
            {/* Sort Options */}
            <div>
              <h3 className="font-semibold mb-2 text-gray-700">Sort By</h3>
              <div className="flex items-center">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="input-field mr-2"
                >
                  <option value="created_at">Date Added</option>
                  <option value="price">Price</option>
                  <option value="name">Name</option>
                  <option value="popularity">Popularity</option>
                </select>
                <button
                  onClick={toggleSortDirection}
                  className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                  title={sortDirection === 'ASC' ? 'Ascending' : 'Descending'}
                >
                  {sortDirection === 'ASC' ? <FaSortAmountUpAlt /> : <FaSortAmountDown />}
                </button>
              </div>
            </div>
            
            {/* Mobile Only: Close Filters Button */}
            <div className="mt-6 md:hidden">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-2 bg-gray-100 rounded-lg text-gray-700"
              >
                Close Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="md:w-3/4">
          {isLoading ? (
            <Spinner />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any products matching your filters.
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products; 