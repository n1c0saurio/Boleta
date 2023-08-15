'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('User', [
      {
        id: 'dd291d4d-3e58-4b9c-aae3-3efc3d91ec35',
        firstName: 'Administrador',
        email: 'correo@example.com',
        password: await bcrypt.hash('secret', 10),
        defaultCurrency: 'CLP',
        roleId: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('User', null, {});
  }
};
