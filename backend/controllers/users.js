const { User } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    // Build query
    const { 
      role,
      search,
      sortBy = 'created_at',
      sortDir = 'DESC',
      page = 1,
      limit = 10
    } = req.query;

    // Pagination
    const offset = (page - 1) * limit;
    
    // Filter options
    const whereClause = {};
    
    // Filter by role
    if (role) {
      whereClause.role = role;
    }
    
    // Search by name or email
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    // Define sort options
    const order = [[sortBy, sortDir]];

    // Find users
    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order
    });

    // Calculate pagination values
    const totalPages = Math.ceil(users.count / limit);

    res.status(200).json({
      success: true,
      count: users.count,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        per_page: parseInt(limit)
      },
      data: users.rows
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin or Owner)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is admin or owner
    if (req.user.id.toString() !== req.params.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this route', 403));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create user (admin only)
// @route   POST /api/users
// @access  Private (Admin)
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    
    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin or Owner)
exports.updateUser = async (req, res, next) => {
  try {
    let user = await User.findByPk(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is admin or owner
    if (req.user.id.toString() !== req.params.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this user', 403));
    }

    // If user is not admin, they can't update their role
    if (req.user.role !== 'admin' && req.body.role) {
      delete req.body.role;
    }

    // Update user
    await User.update(req.body, {
      where: { id: req.params.id }
    });

    // Get updated user
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin or Owner)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is admin or owner
    if (req.user.id.toString() !== req.params.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this user', 403));
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    
    if (!role || !['admin', 'seller', 'user'].includes(role)) {
      return next(new ErrorResponse('Please provide a valid role', 400));
    }
    
    let user = await User.findByPk(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    // Update user role
    await User.update({ role }, {
      where: { id: req.params.id }
    });

    // Get updated user
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (err) {
    next(err);
  }
}; 