import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import { getAllCategories } from '../../features/categories/categorySlice';
import RangeSlider from '../ui/RangeSlider';
import { filterProducts, resetFilters } from '../../redux/features/productSlice';

const ProductFilters = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { categories, loading: categoriesLoading } = useSelector(state => state.categories);
  const { minPrice, maxPrice } = useSelector(state => state.products);

  // Parse current query params
  const queryParams = new URLSearchParams(location.search);
  
  // State for filters
  const [priceRange, setPriceRange] = useState([
    parseInt(queryParams.get('min_price') || 0),
    parseInt(queryParams.get('max_price') || maxPrice || 1000)
  ]);
  const [selectedCategories, setSelectedCategories] = useState(
    queryParams.get('category_id') ? queryParams.get('category_id').split(',') : []
  );
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    ratings: true,
  });

  // Fetch categories on component mount
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      dispatch(getAllCategories());
    }
  }, [dispatch, categories.length, categoriesLoading]);

  // Update local state when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    setPriceRange([
      parseInt(params.get('min_price') || 0),
      parseInt(params.get('max_price') || maxPrice || 1000)
    ]);
    
    setSelectedCategories(
      params.get('category_id') ? params.get('category_id').split(',') : []
    );
  }, [location.search, maxPrice]);

  // Toggle sections expand/collapse
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    const categoryIdStr = categoryId.toString();
    
    let newSelected;
    if (selectedCategories.includes(categoryIdStr)) {
      newSelected = selectedCategories.filter(id => id !== categoryIdStr);
    } else {
      newSelected = [...selectedCategories, categoryIdStr];
    }
    
    setSelectedCategories(newSelected);
    applyFilters({ category_id: newSelected.join(',') });
  };

  // Handle price range change
  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
  };

  // Apply price filter when done dragging
  const handlePriceChangeComplete = (newRange) => {
    applyFilters({
      min_price: newRange[0],
      max_price: newRange[1]
    });
  };

  // Apply all filters to URL
  const applyFilters = (newFilters) => {
    const params = new URLSearchParams(location.search);
    
    // Handle each filter
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === '' || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    // Keep search term if exists
    if (!params.has('page')) {
      params.set('page', '1');
    }
    
    navigate(`/products?${params.toString()}`);
  };

  // Reset all filters
  const resetFilters = () => {
    const params = new URLSearchParams();
    const searchTerm = queryParams.get('search');
    
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    
    params.set('page', '1');
    navigate(`/products?${params.toString()}`);
    
    setSelectedCategories([]);
    setPriceRange([0, maxPrice || 1000]);
  };

  // Filter applied check
  const isFilterApplied = () => {
    return (
      selectedCategories.length > 0 ||
      (priceRange[0] > 0 || priceRange[1] < (maxPrice || 1000))
    );
  };

  // Apply filters when component mounts or when filter state changes
  useEffect(() => {
    dispatch(filterProducts({
      categories: selectedCategories,
      priceRange: priceRange
    }));
  }, [selectedCategories, priceRange, dispatch]);

  return (
    <div 
      className={`fixed inset-0 z-40 md:relative md:z-0 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 md:hidden ${isOpen ? 'block' : 'hidden'}`} 
        onClick={onClose}
      ></div>
      
      {/* Filter sidebar */}
      <div className="h-full w-80 max-w-full md:w-full md:max-w-xs bg-white/90 backdrop-blur-sm md:backdrop-blur-md shadow-lg md:shadow-md overflow-y-auto border-r border-gray-100 relative z-50 md:z-10 md:rounded-xl p-4">
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaFilter className="mr-2 text-primary-600" />
            Filters
          </h2>
          
          <div className="flex items-center space-x-2">
            {isFilterApplied() && (
              <button
                onClick={resetFilters}
                className="text-xs text-gray-600 hover:text-primary-600 transition-colors px-2 py-1 rounded-md hover:bg-primary-50"
              >
                Reset All
              </button>
            )}
            
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors md:hidden"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        
        {/* Filter sections */}
        <div className="space-y-5">
          {/* Categories section */}
          <div className="border-b border-gray-100 pb-4">
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full mb-2 text-left"
            >
              <h3 className="text-lg font-medium text-gray-800">Categories</h3>
              {expandedSections.categories ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
            </button>
            
            {expandedSections.categories && (
              <div className="space-y-2 mt-3 pl-1 max-h-60 overflow-y-auto custom-scrollbar">
                {categoriesLoading ? (
                  <p className="text-gray-500 text-sm">Loading categories...</p>
                ) : categories.length === 0 ? (
                  <p className="text-gray-500 text-sm">No categories found</p>
                ) : (
                  categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <button
                        onClick={() => handleCategoryChange(category.id)}
                        className={`w-full flex items-center px-2 py-1.5 rounded-md text-sm transition-colors ${
                          selectedCategories.includes(category.id.toString()) 
                            ? 'bg-primary-50 text-primary-700' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className={`w-4 h-4 mr-2 flex-shrink-0 rounded border ${
                          selectedCategories.includes(category.id.toString())
                            ? 'bg-primary-600 border-primary-600 flex items-center justify-center'
                            : 'border-gray-300'
                        }`}>
                          {selectedCategories.includes(category.id.toString()) && (
                            <FaCheck className="text-white text-xs" />
                          )}
                        </div>
                        <span className="truncate">{category.name}</span>
                        <span className="ml-auto text-xs text-gray-500">
                          ({category.product_count || 0})
                        </span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          
          {/* Price range section */}
          <div className="border-b border-gray-100 pb-4">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full mb-2 text-left"
            >
              <h3 className="text-lg font-medium text-gray-800">Price Range</h3>
              {expandedSections.price ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
            </button>
            
            {expandedSections.price && (
              <div className="px-1 mt-3">
                <RangeSlider 
                  min={0}
                  max={maxPrice || 1000}
                  value={priceRange}
                  onChange={handlePriceChange}
                  onChangeComplete={handlePriceChangeComplete}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters; 