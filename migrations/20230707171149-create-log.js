'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      action: {
        type: Sequelize.STRING
      },
      ip: {
        type: Sequelize.STRING
      },
      device: {
        type: Sequelize.STRING
      },
      userPerformerId: {
        type: Sequelize.INTEGER
      },
      userPerformerEmail: {
        type: Sequelize.STRING
      },
      userAffectedId: {
        type: Sequelize.INTEGER
      },
      userAffectedEmail: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Logs');
  }
};