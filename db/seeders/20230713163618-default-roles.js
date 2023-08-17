'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Role } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Using the model instead `Sequelize` to apply more flexible logic.

    // If there are not Administrator role in the database, create it.
    await Role.findOrCreate({
      where: {
        id: 'admin'
      },
      defaults: {
        id: 'admin',
        name: 'Administrador',
        description:
          'Acceso a todas las funcionalidades que el sistema provea.',
      }
    });

    // If there are not Regular User role in the database, create it.
    await Role.findOrCreate({
      where: {
        id: 'enduser'
      },
      defaults: {
        id: 'enduser',
        name: 'Usuario regular',
        description: 'Administrar sus propias listas de compra,' +
          'edición básica de su propia cuenta de usuario.',
      }
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Role', null, {});
  }
};
