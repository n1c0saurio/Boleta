'use strict';

/** @type {import('sequelize-cli').Migration} */

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('Workspace', [
      {
        id: uuidv4(),
        name: 'Default workspace',
        isDefault: true,
        userId: 'dd291d4d-3e58-4b9c-aae3-3efc3d91ec35',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Workspace', null, {});
  }
};
