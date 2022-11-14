'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('users', 'username', {
        type: Sequelize.STRING,
        allowNull: false,
      })
    ]);
  },

  async down (queryInterface, Sequelize) {

  }
};
