const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const OrderCoupon = sequelize.define(
  'OrderCoupon',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coupon_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount_applied: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    tableName: 'Order_Coupons'
  }
);

module.exports = OrderCoupon; 