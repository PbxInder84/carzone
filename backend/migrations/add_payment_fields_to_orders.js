'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'payment_intent_id', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'payment_status'
    });
    
    await queryInterface.addColumn('Orders', 'payment_date', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'payment_intent_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'payment_intent_id');
    await queryInterface.removeColumn('Orders', 'payment_date');
  }
}; 