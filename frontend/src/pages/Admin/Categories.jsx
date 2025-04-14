import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaTags, 
  FaFilter, 
  FaSearch, 
  FaFileExport, 
  FaSort,
  FaImage
} from 'react-icons/fa';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  resetCategoryState
} from '../../features/categories/categorySlice';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import CategoryForm from './Categories/CategoryForm';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.categories
  );
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin' || user?.data?.role === 'admin';
  const isSeller = user?.role === 'seller' || user?.data?.role === 'seller';
  const canManageCategories = isAdmin || isSeller;

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(getCategories());
    return () => {
      dispatch(resetCategoryState());
    };
  }, [dispatch]);

  // Handle notifications
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && message) {
      toast.success(message);
    }

    dispatch(resetCategoryState());
  }, [isError, isSuccess, message, dispatch]);

  // Filter and sort categories when data changes
  useEffect(() => {
    let result = [...categories];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        category => 
          category.name.toLowerCase().includes(lowerCaseSearch) ||
          (category.description && category.description.toLowerCase().includes(lowerCaseSearch))
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle null/undefined values
        if (aValue === null || aValue === undefined) aValue = '';
        if (bValue === null || bValue === undefined) bValue = '';
        
        // String comparison for strings
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        // Date comparison for dates
        if (sortConfig.key === 'created_at' || sortConfig.key === 'updated_at') {
          return sortConfig.direction === 'asc' 
            ? new Date(aValue) - new Date(bValue)
            : new Date(bValue) - new Date(aValue);
        }
        
        // Default comparison
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    setFilteredCategories(result);
  }, [categories, searchTerm, sortConfig]);

  const openAddModal = () => {
    setCurrentCategory(null);
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setCurrentCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCategory(null);
    setIsSubmitting(false);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (currentCategory) {
        // EDIT MODE
        let id, data;
        
        // Check if formData is an object with formData and id properties (from the updated form)
        if (formData.formData && formData.id) {
          id = formData.id;
          data = formData.formData;
        } else {
          // For backward compatibility with simple object submission
          id = formData.id;
          data = formData;
        }
        
        await dispatch(updateCategory({ id, data }));
      } else {
        // CREATE MODE
        await dispatch(createCategory(formData));
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting category:', error);
      toast.error('There was an error saving the category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id, name) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete the category "${name}"?`,
      buttons: [
        {
          label: 'Yes, Delete',
          onClick: async () => {
            try {
              await dispatch(deleteCategory(id)).unwrap();
              toast.success('Category deleted successfully');
            } catch (error) {
              console.error('Error deleting category:', error);
              toast.error('Failed to delete category');
            }
          }
        },
        {
          label: 'Cancel',
          onClick: () => {}
        }
      ]
    });
  };

  // Export categories to CSV
  const exportToCSV = () => {
    // Format the categories data for CSV
    const csvData = filteredCategories.map(category => ({
      ID: category.id,
      Name: category.name,
      Description: category.description || '',
      Created: new Date(category.created_at).toLocaleDateString(),
      Updated: category.updated_at ? new Date(category.updated_at).toLocaleDateString() : ''
    }));

    // Convert to CSV
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','));
    const csv = [headers, ...rows].join('\n');

    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `categories-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center">
            <FaTags className="mr-2 text-primary-600" /> Category Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and organize product categories
          </p>
        </div>
        
        {canManageCategories && (
          <div className="flex space-x-2">
            {filteredCategories.length > 0 && (
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center text-sm"
              >
                <FaFileExport className="mr-1" /> Export
              </button>
            )}
            <button
              onClick={openAddModal}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaPlus className="mr-2" /> Add Category
            </button>
          </div>
        )}
      </div>

      {/* Search and filter bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-64 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center ml-auto">
            <span className="text-sm text-gray-600 mr-2">
              {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
            </span>
          </div>
        </div>
      </div>

      {/* Categories table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredCategories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      ID
                      {sortConfig.key === 'id' && (
                        <FaSort className={`ml-1 text-xs ${sortConfig.direction === 'asc' ? 'text-gray-400' : 'text-gray-600'}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Image
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortConfig.key === 'name' && (
                        <FaSort className={`ml-1 text-xs ${sortConfig.direction === 'asc' ? 'text-gray-400' : 'text-gray-600'}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('description')}
                  >
                    <div className="flex items-center">
                      Description
                      {sortConfig.key === 'description' && (
                        <FaSort className={`ml-1 text-xs ${sortConfig.direction === 'asc' ? 'text-gray-400' : 'text-gray-600'}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center">
                      Created At
                      {sortConfig.key === 'created_at' && (
                        <FaSort className={`ml-1 text-xs ${sortConfig.direction === 'asc' ? 'text-gray-400' : 'text-gray-600'}`} />
                      )}
                    </div>
                  </th>
                  {canManageCategories && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{category.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.image_url ? (
                        <img 
                          src={category.image_url} 
                          alt={category.name}
                          className="h-10 w-10 object-cover rounded-md border border-gray-200"
                        />
                      ) : (
                        <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200">
                          <FaImage className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {category.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(category.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    {canManageCategories && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(category)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                          title="Edit Category"
                        >
                          <FaEdit className="inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Category"
                        >
                          <FaTrash className="inline" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 px-6 text-center">
            <div className="flex flex-col items-center">
              <FaTags className="text-gray-400 text-5xl mb-4" />
              <h3 className="text-xl font-medium text-gray-900">No categories found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm 
                  ? `No categories matching "${searchTerm}"`
                  : canManageCategories 
                    ? 'Get started by adding a new category' 
                    : 'There are no categories available yet'}
              </p>
              {canManageCategories && !searchTerm && (
                <button
                  onClick={openAddModal}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  <FaPlus className="mr-2" /> Add First Category
                </button>
              )}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={handleCloseModal}
        title={currentCategory ? 'Edit Category' : 'Add Category'}
        size="md"
      >
        <CategoryForm
          category={currentCategory}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Categories; 