'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('Role', [
      {
        id: 'admin',
        name: 'Administrador',
        description:
          'Acceso a todas las funcionalidades que el sistema provea.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'enduser',
        name: 'Usuario regular',
        description: 'Administrar sus propias listas de compra,' +
          'edición básica de su propia cuenta de usuario',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Role', null, {});
  }
};
