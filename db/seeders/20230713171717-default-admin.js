'use strict';

/** @type {import('sequelize-cli').Migration} */

require('dotenv').config();
const { User } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Using the model instead `Sequelize` to apply more flexible logic.
    const admin = await User.findOne({ where: { roleId: 'admin' } });
    if (!admin) {
      // If there aren't any user with administrator role
      // in the database, create a default one.
      await User.create({
        firstName: 'Administrador',
        email: process.env.ADMIN_EMAIL || 'mail@example.com',
        password: process.env.ADMIN_PASS || 'Secret_4321',
        defaultCurrency: 'CLP',
        roleId: 'admin'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('User', null, {});
  }
};
