import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaTrash, FaUpload, FaImage } from 'react-icons/fa';
import * as categoryService from '../../../db/categoryService';
import Spinner from '../../../components/common/Spinner';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!isEditMode) return;
      
      setIsLoading(true);
      try {
        const response = await categoryService.getCategoryById(id);
        const category = response.data;
        
        setFormData({
          name: category.name || '',
          description: category.description || '',
          icon: category.icon || '',
        });
        
        if (category.image) {
          setImagePreview(category.image);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
        toast.error('Failed to load category data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      if (!formData.name) {
        toast.error('Category name is required');
        setIsSaving(false);
        return;
      }
      
      let response;
      
      // Create or update category
      if (isEditMode) {
        response = await categoryService.updateCategory(id, formData);
        toast.success('Category updated successfully');
      } else {
        response = await categoryService.createCategory(formData);
        toast.success('Category created successfully');
      }
      
      // Upload image if selected
      if (imageFile && response.data && response.data.id) {
        await categoryService.uploadCategoryImage(response.data.id, imageFile);
      }
      
      // Redirect back to categories management
      navigate('/dashboard/categories');
      
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
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
          {isEditMode ? 'Edit Category' : 'Add New Category'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left/Middle */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-medium mb-4">Category Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name <span className="text-red-500">*</span>
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
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                    Icon Class (Font Awesome)
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="icon"
                      name="icon"
                      value={formData.icon}
                      onChange={handleChange}
                      placeholder="e.g. fa-car"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {formData.icon && (
                      <div className="ml-3 flex items-center text-gray-500">
                        <i className={`fas ${formData.icon} text-xl`}></i>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a Font Awesome icon class name (e.g. fa.car, fa-tools)
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Right */}
          <div className="space-y-6">
            {/* Category Image */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Category Image</h2>
              
              <div className="text-center">
                {imagePreview ? (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Category Preview"
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
            
            {/* Action Buttons */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <FaSave className="mr-2 -ml-1" />
                  {isSaving ? 'Saving...' : 'Save Category'}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/categories')}
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this category?')) {
                        categoryService.deleteCategory(id)
                          .then(() => {
                            toast.success('Category deleted successfully');
                            navigate('/dashboard/categories');
                          })
                          .catch(error => {
                            console.error('Error deleting category:', error);
                            toast.error('Failed to delete category');
                          });
                      }
                    }}
                    className="inline-flex justify-center items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaTrash className="mr-2 -ml-1" />
                    Delete Category
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

export default CategoryForm; 