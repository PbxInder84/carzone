const { Product, User, Review, ProductCategory } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    // Build query
    const { 
      category, 
      category_id, 
      min_price, 
      max_price, 
      search,
      seller_id,
      sort_by = 'created_at',
      sort_dir = 'DESC',
      page = 1,
      limit = 10
    } = req.query;

    // Pagination
    const offset = (page - 1) * limit;
    
    // Filter options
    const whereClause = {};
    
    // Filter by category
    if (category) {
      whereClause.category = category;
    }
    
    // Filter by category_id
    if (category_id) {
      whereClause.category_id = category_id;
    }
    
    // Filter by seller
    if (seller_id) {
      whereClause.seller_id = seller_id;
    }
    
    // Filter by price range
    if (min_price || max_price) {
      whereClause.price = {};
      if (min_price) whereClause.price[Op.gte] = min_price;
      if (max_price) whereClause.price[Op.lte] = max_price;
    }
    
    // Search by name or description
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Define sort options
    const order = [[sort_by, sort_dir]];

    // Find products
    const products = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email']
        },
        {
          model: ProductCategory,
          as: 'productCategory',
          attributes: ['id', 'name']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order
    });

    // Calculate pagination values
    const totalPages = Math.ceil(products.count / limit);

    res.status(200).json({
      success: true,
      count: products.count,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        per_page: parseInt(limit)
      },
      data: products.rows
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email']
        },
        {
          model: ProductCategory,
          as: 'productCategory',
          attributes: ['id', 'name']
        },
        {
          model: Review,
          as: 'reviews',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Seller or Admin)
exports.createProduct = async (req, res, next) => {
  try {
    // Add seller to request body if not present
    if (!req.body.seller_id) {
      req.body.seller_id = req.user.id;
    }

    // Check if seller exists
    const seller = await User.findByPk(req.user.id);
    
    if (!seller) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Ensure the user is a seller or admin
    if (seller.role !== 'seller' && seller.role !== 'admin') {
      return next(new ErrorResponse('Only sellers and admins can create products', 403));
    }

    // Handle image - prioritize file upload over URL
    if (req.file) {
      // Set the image URL for the product from uploaded file
      req.body.image_url = `/uploads/products/${req.file.filename}`;
    } else if (req.body.image_url) {
      // Use the provided image URL if no file was uploaded
      // Keep the image_url as is - it's already in the req.body
      console.log('Using provided image URL:', req.body.image_url);
    }

    // Ensure category is a string
    if (req.body.category && (Array.isArray(req.body.category) || typeof req.body.category === 'object')) {
      console.log('Converting category from array/object to string:', req.body.category);
      if (Array.isArray(req.body.category)) {
        // If it's an array, take the last non-empty element
        const validElements = req.body.category.filter(item => item && item.trim());
        req.body.category = validElements.length > 0 ? validElements[validElements.length - 1] : '';
      } else {
        // If it's an object, convert to string representation or empty string
        req.body.category = String(req.body.category) || '';
      }
    }

    // Log the request body to debug
    console.log('Creating product with data:', req.body);

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error('Error creating product:', err);
    next(err);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Owner Seller or Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findByPk(req.params.id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is product owner or admin
    if (product.seller_id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this product', 403));
    }

    // Handle image - prioritize file upload over URL
    if (req.file) {
      // Set the image URL for the product from uploaded file
      req.body.image_url = `/uploads/products/${req.file.filename}`;
    } else if (req.body.image_url) {
      // Use the provided image URL if no file was uploaded and it's different from the current one
      if (req.body.image_url !== product.image_url) {
        console.log('Using provided image URL:', req.body.image_url);
      }
    }

    // Log the request body for debugging
    console.log('Updating product with data:', req.body);

    // Ensure category is a string
    if (req.body.category && (Array.isArray(req.body.category) || typeof req.body.category === 'object')) {
      console.log('Converting category from array/object to string:', req.body.category);
      if (Array.isArray(req.body.category)) {
        // If it's an array, take the last non-empty element
        const validElements = req.body.category.filter(item => item && item.trim());
        req.body.category = validElements.length > 0 ? validElements[validElements.length - 1] : '';
      } else {
        // If it's an object, convert to string representation or empty string
        req.body.category = String(req.body.category) || '';
      }
    }

    // Update product
    await Product.update(req.body, {
      where: { id: req.params.id }
    });

    // Get updated product
    const updatedProduct = await Product.findByPk(req.params.id);

    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (err) {
    console.error('Error updating product:', err);
    next(err);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Owner Seller or Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is product owner or admin
    if (product.seller_id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this product', 403));
    }

    // Delete product
    await product.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 