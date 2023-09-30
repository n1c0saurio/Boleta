'use strict';

const { Sequelize } = require('../models');

const columnAndTypes = [
  {
    name: 'preferredLocale',
    type: (Sequelize) => {
      return {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'en'
      }
    }
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      columnAndTypes.map(c => {
        return queryInterface.addColumn(
          'User',
          c.name,
          c.type(Sequelize)
        );
      })
    );
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all(
      columnAndTypes.map(c => {
        return queryInterface.removeColumn(
          'User',
          c.name
        );
      })
    );
  }
}