import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaFileImport, FaUpload, FaCheck, FaTimes } from 'react-icons/fa';
import * as bulkImportService from '../../db/bulkImportService';

const BulkImport = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [jsonData, setJsonData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [importResults, setImportResults] = useState(null);
  
  // Sample templates
  const productTemplate = {
    name: "Product Name",
    description: "Product description goes here",
    price: 1999.99,
    stock_quantity: 10,
    category_id: 1,
    image_url: "https://example.com/image.jpg",
    featured: false
  };
  
  const categoryTemplate = {
    name: "Category Name",
    description: "Category description goes here",
    is_active: true
  };
  
  const validateJson = (data, type) => {
    try {
      const parsedData = JSON.parse(data);
      
      if (!Array.isArray(parsedData)) {
        return { 
          isValid: false, 
          message: "Data must be a JSON array" 
        };
      }
      
      if (parsedData.length === 0) {
        return { 
          isValid: false, 
          message: "Array cannot be empty" 
        };
      }
      
      // Basic validation based on type
      const requiredFields = type === 'products' 
        ? ['name', 'price', 'category_id'] 
        : ['name'];
      
      const missingFields = [];
      parsedData.forEach((item, index) => {
        requiredFields.forEach(field => {
          if (!item[field] && item[field] !== 0) {
            missingFields.push(`Item at index ${index} is missing required field: ${field}`);
          }
        });
        
        // Additional product-specific validations
        if (type === 'products') {
          if (item.price && (isNaN(Number(item.price)) || Number(item.price) < 0)) {
            missingFields.push(`Item at index ${index} has invalid price`);
          }
          if (item.stock_quantity && (isNaN(Number(item.stock_quantity)) || Number(item.stock_quantity) < 0)) {
            missingFields.push(`Item at index ${index} has invalid stock quantity`);
          }
        }
      });
      
      if (missingFields.length > 0) {
        return {
          isValid: false,
          message: "Validation errors",
          errors: missingFields
        };
      }
      
      return {
        isValid: true,
        message: `Ready to import ${parsedData.length} ${type}`,
        data: parsedData
      };
    } catch (error) {
      return {
        isValid: false,
        message: "Invalid JSON format",
        error: error.message
      };
    }
  };
  
  const handleImport = async () => {
    const result = validateJson(jsonData, activeTab);
    setValidationResult(result);
    
    if (!result.isValid) {
      return;
    }
    
    setIsImporting(true);
    setImportResults(null);
    
    try {
      // Import data based on active tab using bulk import API
      let importResult;
      
      if (activeTab === 'products') {
        importResult = await bulkImportService.bulkImportProducts(result.data);
        toast.success(`Successfully imported ${importResult.successful} products`);
      } else {
        importResult = await bulkImportService.bulkImportCategories(result.data);
        toast.success(`Successfully imported ${importResult.successful} categories`);
      }
      
      // Display detailed results
      setImportResults(importResult);
      
      // Only clear the textarea if all imports were successful
      if (importResult.failed === 0) {
        setJsonData('');
        setValidationResult(null);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error(`Import failed: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };
  
  const setTemplate = () => {
    const template = activeTab === 'products' ? [productTemplate] : [categoryTemplate];
    setJsonData(JSON.stringify(template, null, 2));
    setValidationResult(null);
    setImportResults(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaFileImport className="mr-2 text-primary-600" />
            Bulk Import
          </h1>
          <p className="mt-2 text-gray-600">
            Import multiple products or categories at once using JSON format
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'products'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-primary-600'
            }`}
            onClick={() => {
              setActiveTab('products');
              setValidationResult(null);
              setImportResults(null);
            }}
          >
            Products
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'categories'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-primary-600'
            }`}
            onClick={() => {
              setActiveTab('categories');
              setValidationResult(null);
              setImportResults(null);
            }}
          >
            Categories
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 font-medium">
                JSON Data ({activeTab})
              </label>
              <button
                onClick={setTemplate}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                Load Template
              </button>
            </div>
            <textarea
              rows="12"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-primary-500 font-mono text-sm"
              placeholder={`Paste your ${activeTab} JSON data here...`}
              value={jsonData}
              onChange={(e) => {
                setJsonData(e.target.value);
                setValidationResult(null);
                setImportResults(null);
              }}
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Format: JSON array of objects containing required fields for {activeTab}.
            </p>
          </div>
          
          {/* Validation Results */}
          {validationResult && (
            <div className={`mb-6 p-4 rounded-lg ${
              validationResult.isValid 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center mb-2">
                {validationResult.isValid ? (
                  <FaCheck className="text-green-500 mr-2" />
                ) : (
                  <FaTimes className="text-red-500 mr-2" />
                )}
                <h3 className={`font-medium ${
                  validationResult.isValid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {validationResult.message}
                </h3>
              </div>
              
              {validationResult.errors && validationResult.errors.length > 0 && (
                <ul className="list-disc list-inside text-sm text-red-700 mt-2">
                  {validationResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          {/* Import Results */}
          {importResults && (
            <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Import Results</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-gray-600">Total Items</p>
                  <p className="text-xl font-semibold text-gray-800">{importResults.totalItems}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-gray-600">Successful</p>
                  <p className="text-xl font-semibold text-green-600">{importResults.successful}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-gray-600">Failed</p>
                  <p className="text-xl font-semibold text-red-600">{importResults.failed}</p>
                </div>
              </div>
              
              {importResults.errors && importResults.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Error Details:</h4>
                  <div className="max-h-40 overflow-y-auto">
                    <ul className="list-disc list-inside text-sm text-red-700">
                      {importResults.errors.map((error, index) => (
                        <li key={index}>
                          <span className="font-medium">{error.name}</span>: {error.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={handleImport}
              disabled={isImporting || !jsonData.trim()}
              className={`px-4 py-2 rounded-lg flex items-center ${
                isImporting || !jsonData.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              <FaUpload className="mr-2" />
              {isImporting ? 'Importing...' : `Import ${activeTab}`}
            </button>
          </div>
        </div>
        
        {/* Help Section */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Required Fields</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Products:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li><span className="font-mono text-primary-600">name</span> - Product name (string)</li>
                <li><span className="font-mono text-primary-600">price</span> - Product price (number)</li>
                <li><span className="font-mono text-primary-600">category_id</span> - Category ID (number)</li>
                <li><span className="font-mono text-gray-500">description</span> - Product description (optional)</li>
                <li><span className="font-mono text-gray-500">stock_quantity</span> - Stock quantity (optional)</li>
                <li><span className="font-mono text-gray-500">image_url</span> - Image URL (optional)</li>
                <li><span className="font-mono text-gray-500">featured</span> - Featured product (optional)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Categories:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li><span className="font-mono text-primary-600">name</span> - Category name (string)</li>
                <li><span className="font-mono text-gray-500">description</span> - Category description (optional)</li>
                <li><span className="font-mono text-gray-500">is_active</span> - Active status (optional)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkImport; 