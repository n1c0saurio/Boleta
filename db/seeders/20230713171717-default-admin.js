'use strict';

/** @type {import('sequelize-cli').Migration} */

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('User', [
      {
        id: uuidv4(),
        firstName: 'Administrador',
        email: 'correo@example.com',
        password: await bcrypt.hash('secret', 10),
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
