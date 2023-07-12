'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {

      // A role can't be deleted if there're users associated with it
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