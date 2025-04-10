const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ProductCategory = sequelize.define(
  'ProductCategory',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Product_Categories'
  }
);

module.exports = ProductCategory; 