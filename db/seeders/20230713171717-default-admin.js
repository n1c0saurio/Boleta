'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Using the model instead `Sequelize` to apply more flexible logic.
    const admin = await User.findOne({ where: { roleId: 'admin' } });
    if (!admin) {
      // If there aren't any user with administrator role
      // in the database, create a default one.
      await User.create({
        firstName: 'Administrador',
        email: 'correo@example.com',
        password: await bcrypt.hash('secret', 10),
        defaultCurrency: 'CLP',
        roleId: 'admin'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('User', null, {});
  }
};
