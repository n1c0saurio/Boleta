'use strict';

const { Sequelize } = require('../models');

const columnAndTypes = [
  {
    name: 'currency',
    type: (Sequelize) => {
      return {
        type: Sequelize.STRING(3),
      }
    }
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      columnAndTypes.map(c => {
        return queryInterface.addColumn(
          'List',
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
          'List',
          c.name
        );
      })
    );
  }
}