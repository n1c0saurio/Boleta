'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Workspace', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Workspace');
  }
};