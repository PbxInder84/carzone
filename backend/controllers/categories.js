const { ProductCategory } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await ProductCategory.findAll({
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res, next) => {
  try {
    const category = await ProductCategory.findByPk(req.params.id);

    if (!category) {
      return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin/Seller)
exports.createCategory = async (req, res, next) => {
  try {
    // Handle image - prioritize file upload over URL
    if (req.file) {
      // Set the image URL for the category from uploaded file
      req.body.image_url = `/uploads/categories/${req.file.filename}`;
    } else if (req.body.image_url) {
      // Use the provided image URL if no file was uploaded
      console.log('Using provided image URL:', req.body.image_url);
    }

    // Log the request body to debug
    console.log('Creating category with data:', req.body);

    const category = await ProductCategory.create(req.body);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (err) {
    console.error('Error creating category:', err);
    next(err);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin/Seller)
exports.updateCategory = async (req, res, next) => {
  try {
    let category = await ProductCategory.findByPk(req.params.id);

    if (!category) {
      return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
    }

    // Handle image - prioritize file upload over URL
    if (req.file) {
      // Set the image URL for the category from uploaded file
      req.body.image_url = `/uploads/categories/${req.file.filename}`;
    } else if (req.body.image_url) {
      // Use the provided image URL if no file was uploaded and it's different from the current one
      if (req.body.image_url !== category.image_url) {
        console.log('Using provided image URL:', req.body.image_url);
      }
    }

    // Log the request body for debugging
    console.log('Updating category with data:', req.body);

    // Update category
    await ProductCategory.update(req.body, {
      where: { id: req.params.id }
    });

    // Get updated category
    const updatedCategory = await ProductCategory.findByPk(req.params.id);

    res.status(200).json({
      success: true,
      data: updatedCategory
    });
  } catch (err) {
    console.error('Error updating category:', err);
    next(err);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin/Seller)
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await ProductCategory.findByPk(req.params.id);

    if (!category) {
      return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get products by category
// @route   GET /api/categories/:id/products
// @access  Public
exports.getCategoryProducts = async (req, res, next) => {
  try {
    const category = await ProductCategory.findByPk(req.params.id, {
      include: ['products']
    });

    if (!category) {
      return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      count: category.products.length,
      data: category.products
    });
  } catch (err) {
    next(err);
  }
}; 