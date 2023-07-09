'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {

      Role.hasMany(models.User, {
        onDelete: 'RESTRICT'
      });
    }
  }

  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
  });

  return Role;
};