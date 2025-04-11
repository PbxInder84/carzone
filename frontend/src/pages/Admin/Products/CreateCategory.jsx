import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import { createCategory, getCategoryById, updateCategory } from '../../../db/categoryService';
import Spinner from '../../../components/layout/Spinner';

const CreateCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          setIsLoading(true);
          const response = await getCategoryById(id);
          const category = response.data;
          
          setFormData({
            name: category.name,
            description: category.description || '',
          });
          
          if (category.image) {
            setPreviewUrl(category.image);
          }
          
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          toast.error('Failed to fetch category details');
          navigate('/admin/categories');
        }
      };
      
      fetchCategory();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (isEditMode) {
        await updateCategory(id, formData);
        toast.success('Category updated successfully');
      } else {
        await createCategory(formData);
        toast.success('Category created successfully');
      }
      
      navigate('/admin/categories');
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Edit Category' : 'Create New Category'}
          </h1>
          <Link to="/dashboard/categories" className="flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" /> Back to Categories
          </Link>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Category Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category name"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category description"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
              Category Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {previewUrl && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                <img 
                  src={previewUrl} 
                  alt="Category preview" 
                  className="h-32 w-32 object-cover rounded-md border border-gray-300"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Link
              to="/dashboard/categories"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory; 