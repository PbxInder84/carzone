import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaSave, FaTrash, FaImage } from 'react-icons/fa';
import * as productService from '../../../db/productService';
import { getCategories } from '../../../features/categories/categorySlice';
import Spinner from '../../../components/common/Spinner';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories, isLoading: categoriesLoading } = useSelector((state) => state.categories);
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    category_id: '',
    stock_quantity: '0',
    image_url: '',
    seller_id: useSelector((state) => state.auth.user?.id)
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [useImageUrl, setUseImageUrl] = useState(false);
  
  useEffect(() => {
    // Fetch categories
    dispatch(getCategories());
  }, [dispatch]);
  
  useEffect(() => {
    const fetchProductData = async () => {
      if (!isEditMode) return;
      
      setIsLoading(true);
      try {
        const productResponse = await productService.getProductById(id);
        const product = productResponse.data;
        
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          category: product.category || '',
          category_id: product.category_id || '',
          stock_quantity: product.stock_quantity || '',
          image_url: product.image_url || '',
          seller_id: product.seller_id || ''
        });
        
        if (product.image_url) {
          setImagePreview(product.image_url);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
        toast.error('Failed to load product data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductData();
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Update image preview if image_url changes
    if (name === 'image_url' && value && useImageUrl) {
      setImagePreview(value);
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Clear image URL when file is selected
      setFormData(prev => ({ ...prev, image_url: '' }));
      setUseImageUrl(false);
    }
  };

  const toggleImageInputMethod = () => {
    setUseImageUrl(!useImageUrl);
    // Clear the opposite input type
    if (!useImageUrl) {
      setImageFile(null);
      // Keep the image preview if there's a URL
    } else {
      setFormData(prev => ({ ...prev, image_url: '' }));
      if (!imageFile) {
        setImagePreview('');
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Validate form
      if (!formData.name || formData.name.trim() === '') {
        toast.error('Product name is required');
        setIsSaving(false);
        return;
      }
      
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error('Price must be greater than 0');
        setIsSaving(false);
        return;
      }

      if (!formData.seller_id) {
        toast.error('You must be logged in as a seller to create products');
        setIsSaving(false);
        return;
      }

      if (!formData.category_id) {
        toast.error('Category is required');
        setIsSaving(false);
        return;
      }
      
      // Find selected category to get its name
      const selectedCategory = categories.find(
        cat => cat.id === parseInt(formData.category_id, 10)
      );
      
      if (!selectedCategory) {
        toast.error('Invalid category selected');
        setIsSaving(false);
        return;
      }
      
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Add required fields
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('price', parseFloat(formData.price).toFixed(2));
      formDataToSend.append('seller_id', formData.seller_id);
      
      // Add category as a string, not an array
      formDataToSend.append('category', selectedCategory.name);
      formDataToSend.append('category_id', formData.category_id.toString());
      formDataToSend.append('stock_quantity', parseInt(formData.stock_quantity || '0', 10).toString());
      
      // Add optional fields if they exist
      if (formData.description) {
        formDataToSend.append('description', formData.description);
      }
      
      // Handle image (either file or URL)
      if (imageFile) {
        formDataToSend.append('product_image', imageFile);
      } else if (formData.image_url && formData.image_url.trim() !== '') {
        formDataToSend.append('image_url', formData.image_url.trim());
      }
      
      // Log the data being sent (for debugging)
      console.log('Submitting product data:', {
        name: formData.name.trim(),
        price: parseFloat(formData.price).toFixed(2),
        seller_id: formData.seller_id,
        description: formData.description || null,
        category: selectedCategory.name,
        category_id: formData.category_id.toString(),
        stock_quantity: parseInt(formData.stock_quantity || '0', 10).toString(),
        hasImage: !!imageFile,
        image_url: formData.image_url || null
      });

      // Log the FormData to ensure category is formatted correctly
      console.log('FormData details:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value} (type: ${typeof value})`);
      }
      
      let response;
      
      if (isEditMode) {
        response = await productService.updateProduct(id, formDataToSend);
        toast.success('Product updated successfully');
      } else {
        response = await productService.createProduct(formDataToSend);
        toast.success('Product created successfully');
      }
      
      // Redirect back to products list
      navigate('/dashboard/products');
      
    } catch (error) {
      console.error('Error saving product:', error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Failed to save product: ${error.response.data.error}`);
      } else if (error.message) {
        toast.error(`Failed to save product: ${error.message}`);
      } else {
        toast.error('Failed to save product. Please check all required fields.');
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading || categoriesLoading) {
    return <Spinner />;
  }
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left/Middle */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-medium mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={255}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Pricing & Inventory */}
            <div>
              <h2 className="text-lg font-medium mb-4">Pricing & Inventory</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0.01"
                      className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="stock_quantity"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    min="0"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories && categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Right */}
          <div className="space-y-6">
            {/* Product Image */}
            <div>
              <h2 className="text-lg font-medium mb-4">Product Image</h2>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Image Source</span>
                  <button
                    type="button"
                    onClick={toggleImageInputMethod}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    {useImageUrl ? 'Upload Image File Instead' : 'Use Image URL Instead'}
                  </button>
                </div>
                
                {useImageUrl ? (
                  <div>
                    <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      id="image_url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="mx-auto h-48 w-auto object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setImageFile(null);
                          }}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                        >
                          <FaTrash className="text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                          <FaImage className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className="text-sm text-gray-600">
                          <label htmlFor="image-upload" className="cursor-pointer text-primary-600 hover:text-primary-800">
                            <span>Upload an image</span>
                            <input
                              id="image-upload"
                              name="image"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p>or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="space-y-3 pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    {isEditMode ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/dashboard/products')}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 