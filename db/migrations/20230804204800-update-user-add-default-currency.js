'use strict';

const { Sequelize } = require('../models');

const columnAndTypes = [
  {
    name: 'defaultCurrency',
    type: (Sequelize) => {
      return {
        type: Sequelize.STRING(3),
        allowNull: false
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