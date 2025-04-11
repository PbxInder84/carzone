import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaTrash, FaUpload, FaImage } from 'react-icons/fa';
import * as productService from '../../../db/productService';
import * as categoryService from '../../../db/categoryService';
import Spinner from '../../../components/common/Spinner';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sale_price: '',
    category: '',
    stock_quantity: '',
    is_featured: false,
    status: 'active'
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesResponse = await categoryService.getMockCategories();
        setCategories(categoriesResponse.data);
        
        // If in edit mode, fetch product data
        if (isEditMode) {
          const productResponse = await productService.getProductById(id);
          const product = productResponse.data;
          
          setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            sale_price: product.sale_price || '',
            category: product.category || '',
            stock_quantity: product.stock_quantity || '',
            is_featured: product.is_featured || false,
            status: product.status || 'active'
          });
          
          if (product.image) {
            setImagePreview(product.image);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Validate form
      if (!formData.name || !formData.price || !formData.category) {
        toast.error('Please fill in all required fields');
        setIsSaving(false);
        return;
      }
      
      // Convert form data types
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        stock_quantity: parseInt(formData.stock_quantity, 10)
      };
      
      let response;
      
      // Create or update product
      if (isEditMode) {
        response = await productService.updateProduct(id, productData);
        toast.success('Product updated successfully');
      } else {
        response = await productService.createProduct(productData);
        toast.success('Product created successfully');
      }
      
      // Upload image if selected
      if (imageFile && response.data && response.data.id) {
        await productService.uploadProductImage(response.data.id, imageFile);
      }
      
      // Redirect back to products list
      navigate('/dashboard/products');
      
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
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
                      min="0"
                      step="0.01"
                      className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="sale_price"
                      name="sale_price"
                      value={formData.sale_price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    id="stock_quantity"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    min="0"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
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
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Product Image</h2>
              
              <div className="text-center">
                {imagePreview ? (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Product Preview"
                      className="h-48 w-auto mx-auto object-contain border rounded"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full flex items-center justify-center bg-gray-200 rounded mb-4">
                    <FaImage className="text-gray-400 text-4xl" />
                  </div>
                )}
                
                <div>
                  <label htmlFor="image" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <FaUpload className="mr-2 -ml-1 text-gray-500" />
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </div>
              </div>
            </div>
            
            {/* Status & Visibility */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Status & Visibility</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                    Featured Product
                  </label>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <FaSave className="mr-2 -ml-1" />
                  {isSaving ? 'Saving...' : 'Save Product'}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/products')}
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this product?')) {
                        productService.deleteProduct(id)
                          .then(() => {
                            toast.success('Product deleted successfully');
                            navigate('/dashboard/products');
                          })
                          .catch(error => {
                            console.error('Error deleting product:', error);
                            toast.error('Failed to delete product');
                          });
                      }
                    }}
                    className="inline-flex justify-center items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaTrash className="mr-2 -ml-1" />
                    Delete Product
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 