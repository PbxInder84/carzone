import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes, FaUpload, FaImage, FaLink } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Spinner from '../../../components/common/Spinner';

const CategoryForm = ({ 
  category = null, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}) => {
  const isEditMode = !!category?.id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    image_url: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [useImageUrl, setUseImageUrl] = useState(false);

  useEffect(() => {
    // If category is provided, populate form
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || '',
        image_url: category.image_url || ''
      });

      // If there's an image URL, set the preview
      if (category.image_url) {
        setImagePreview(category.image_url);
        setUseImageUrl(true);
      }
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    // Create FormData for submission
    const formDataToSend = new FormData();
    
    // Add basic fields
    formDataToSend.append('name', formData.name.trim());
    
    if (formData.description) {
      formDataToSend.append('description', formData.description);
    }
    
    if (formData.icon) {
      formDataToSend.append('icon', formData.icon);
    }
    
    // Handle image (either file or URL)
    if (imageFile) {
      formDataToSend.append('category_image', imageFile);
    } else if (formData.image_url && formData.image_url.trim() !== '') {
      formDataToSend.append('image_url', formData.image_url.trim());
    }
    
    // If in edit mode, we need to handle the ID
    if (isEditMode && category.id) {
      // For edit mode, pass the entire FormData with ID
      onSubmit({ formData: formDataToSend, id: category.id });
    } else {
      // For create mode, just pass the FormData
      onSubmit(formDataToSend);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Main form fields */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Enter category name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Enter category description (optional)"
            />
          </div>
          
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
              Icon (CSS class or code)
            </label>
            <input
              type="text"
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="e.g., FaCar (optional)"
            />
            <p className="mt-1 text-xs text-gray-500">
              Used for visual representation in the UI
            </p>
          </div>
        </div>

        {/* Right column - Image upload */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>
            
            <div className="flex justify-between mb-3">
              <button 
                type="button" 
                onClick={toggleImageInputMethod}
                className={`px-3 py-1 text-xs rounded-md ${!useImageUrl ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                <FaUpload className="inline mr-1" /> Upload File
              </button>
              <button 
                type="button" 
                onClick={toggleImageInputMethod}
                className={`px-3 py-1 text-xs rounded-md ${useImageUrl ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                <FaLink className="inline mr-1" /> Use URL
              </button>
            </div>
            
            {useImageUrl ? (
              <div>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Category preview" 
                      className="max-h-40 mx-auto object-contain border rounded p-1"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                {imagePreview ? (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Category Preview"
                      className="h-40 w-auto mx-auto object-contain border rounded-md p-1"
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
                  <div className="h-40 w-full flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-md">
                    <FaImage className="text-gray-400 text-4xl" />
                  </div>
                )}
                
                <div className="mt-2">
                  <label htmlFor="category_image" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <FaUpload className="mr-2 -ml-1 text-gray-500" />
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </label>
                  <input
                    type="file"
                    id="category_image"
                    name="category_image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-5 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FaTimes className="mr-2 -ml-1" /> Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <FaSave className="mr-2 -ml-1" /> {isEditMode ? 'Update Category' : 'Create Category'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm; 