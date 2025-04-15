import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  resetProductState
} from '../../features/products/productSlice';
import { getCategories } from '../../features/categories/categorySlice';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import { getImageUrl } from '../../utils/imageUtils';
import { formatCurrency } from '../../utils/formatters';

const Products = () => {
  const dispatch = useDispatch();
  const { products, totalPages, currentPage, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.products
  );
  const { categories } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    category: '',
    category_id: '',
    stock_quantity: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [useImageUrl, setUseImageUrl] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    dispatch(getProducts({ page: currentPage, limit: pageSize, search: searchTerm }));
    dispatch(getCategories());
    
    return () => {
      dispatch(resetProductState());
    };
  }, [dispatch, currentPage, searchTerm]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && message) {
      toast.success(message);
    }

    dispatch(resetProductState());
  }, [isError, isSuccess, message, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getProducts({ page: 1, limit: pageSize, search: searchTerm }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const openAddModal = () => {
    setIsEdit(false);
    setCurrentProduct({
      id: null,
      name: '',
      description: '',
      price: '',
      category: '',
      category_id: '',
      stock_quantity: '',
      image_url: ''
    });
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setIsEdit(true);
    setCurrentProduct({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      category_id: product.category_id,
      stock_quantity: product.stock_quantity,
      image_url: product.image_url || ''
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setImageFile(files[0]);
    } else {
      setCurrentProduct({ ...currentProduct, [name]: value });
      
      // Update preview if it's the image_url that changed
      if (name === 'image_url' && value && useImageUrl) {
        setImageFile(null); // Clear any existing file upload
      }
    }
  };

  const toggleImageInputMethod = () => {
    setUseImageUrl(!useImageUrl);
    // Clear the opposite input type
    if (!useImageUrl) {
      setImageFile(null);
    } else {
      setCurrentProduct(prev => ({ ...prev, image_url: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Add all fields to the form data
    Object.keys(currentProduct).forEach(key => {
      if (currentProduct[key] !== null && currentProduct[key] !== undefined) {
        // For numeric fields, ensure they're formatted correctly
        if (key === 'price') {
          formData.append(key, parseFloat(currentProduct[key]).toFixed(2));
        } else if (key === 'stock_quantity') {
          formData.append(key, parseInt(currentProduct[key], 10));
        } else {
          formData.append(key, currentProduct[key]);
        }
      }
    });
    
    // Ensure seller_id is included
    if (!formData.get('seller_id') && user && user.id) {
      formData.append('seller_id', user.id);
    }
    
    // Find selected category to get its name
    const selectedCategory = categories.find(
      cat => cat.id === parseInt(currentProduct.category_id, 10)
    );
    
    if (selectedCategory) {
      formData.append('category', selectedCategory.name);
    }
    
    // Add the image file if it exists
    if (imageFile) {
      formData.append('product_image', imageFile);
    }
    
    // Log formData contents for debugging
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    if (isEdit) {
      dispatch(updateProduct({ id: currentProduct.id, formData }));
    } else {
      dispatch(createProduct(formData));
    }
    
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Product Management</h1>
        <button
          onClick={openAddModal}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <form onSubmit={handleSearch} className="flex mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search products..."
              className="border rounded-l-lg px-4 py-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-lg hover:bg-gray-300"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length > 0 ? (
                    products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {product.image_url ? (
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={product.image_url}
                                alt={product.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200"></div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                                ID: {product.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(parseFloat(product.price))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                            {product.productCategory ? product.productCategory.name : product.category}
                          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.stock_quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openEditModal(product)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <FaEdit className="inline" />
                          </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="inline" />
                        </button>
                      </td>
                    </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Showing {products.length > 0 ? ((currentPage - 1) * pageSize + 1) : 0} to{' '}
                {Math.min(currentPage * pageSize, products.length + (currentPage - 1) * pageSize)}{' '}
                of {totalPages * pageSize || 0} results
              </div>
              <div className="flex">
                <button
                  onClick={() => dispatch(getProducts({
                    page: Math.max(1, currentPage - 1),
                    limit: pageSize,
                    search: searchTerm
                  }))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-l-lg bg-white text-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => dispatch(getProducts({
                    page: Math.min(totalPages, currentPage + 1),
                    limit: pageSize,
                    search: searchTerm
                  }))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 border rounded-r-lg bg-white text-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Product Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={currentProduct.name}
                onChange={handleChange}
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price*
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="price"
                name="price"
                value={currentProduct.price}
                onChange={handleChange}
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                Category*
              </label>
              <select
                id="category_id"
                name="category_id"
                value={currentProduct.category_id}
                onChange={handleChange}
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">
                Stock Quantity*
              </label>
              <input
                type="number"
                min="0"
                id="stock_quantity"
                name="stock_quantity"
                value={currentProduct.stock_quantity}
                onChange={handleChange}
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={currentProduct.description}
              onChange={handleChange}
              className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          {/* Image Upload/URL Input Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
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
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={currentProduct.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                {currentProduct.image_url && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img 
                      src={currentProduct.image_url} 
                      alt="Product preview" 
                      className="h-20 w-20 rounded-md object-cover border border-gray-300"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-1 flex items-center">
                {(currentProduct.image_url || imageFile) && (
                  <div className="mr-3">
                    <img
                      src={imageFile ? URL.createObjectURL(imageFile) : currentProduct.image_url}
                      alt="Product preview"
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  </div>
                )}
                <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                  {imageFile ? 'Change Image' : 'Upload Image'}
                  <input
                    type="file"
                    id="product_image"
                    name="product_image"
                    accept="image/*"
                    onChange={handleChange}
                    className="sr-only"
                  />
                </label>
                {imageFile && (
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    className="ml-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products; 