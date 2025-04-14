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
    image_url: '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [useImageUrl, setUseImageUrl] = useState(false);
  
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
          image_url: category.image_url || '',
        });
        
        if (category.image_url) {
          setImagePreview(category.image_url);
          setUseImageUrl(true);
        } else if (category.image) {
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
      setFormData(prev => ({ ...prev, image_url: '' }));
      setUseImageUrl(false);
    }
  };

  const toggleImageInputMethod = () => {
    setUseImageUrl(!useImageUrl);
    if (!useImageUrl) {
      setImageFile(null);
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
      if (!formData.name) {
        toast.error('Category name is required');
        setIsSaving(false);
        return;
      }
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      
      if (formData.description) {
        formDataToSend.append('description', formData.description);
      }
      
      if (formData.icon) {
        formDataToSend.append('icon', formData.icon);
      }
      
      if (imageFile) {
        formDataToSend.append('category_image', imageFile);
      } else if (formData.image_url && formData.image_url.trim() !== '') {
        formDataToSend.append('image_url', formData.image_url.trim());
      }
      
      let response;
      
      if (isEditMode) {
        response = await categoryService.updateCategory(id, formDataToSend);
        toast.success('Category updated successfully');
      } else {
        response = await categoryService.createCategory(formDataToSend);
        toast.success('Category created successfully');
      }
      
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
                    Icon (CSS class or code)
                  </label>
                  <input
                    type="text"
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="e.g., FaCar (for rendering icons in UI)"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Right */}
          <div className="space-y-6">
            {/* Category Image */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Category Image</h2>
              
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
                  <div className="text-center">
                    {imagePreview ? (
                      <div className="mb-4">
                        <img
                          src={imagePreview}
                          alt="Category Preview"
                          className="h-48 w-auto mx-auto object-contain border rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setImageFile(null);
                          }}
                          className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                          Remove Image
                        </button>
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
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
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
                    {isEditMode ? 'Update Category' : 'Create Category'}
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/dashboard/categories')}
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

export default CategoryForm; 