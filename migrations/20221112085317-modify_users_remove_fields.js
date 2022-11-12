'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(
        'users', // table name
        'salt', // new field name
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {

  }
};
