'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class list extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  list.init({
    name: DataTypes.STRING,
    order: DataTypes.INTEGER,
    total: DataTypes.STRING,
    isArchived: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'list',
  });
  return list;
};