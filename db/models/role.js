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
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'ID no puede quedar vacío.'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Nombre no puede quedar vacío.'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Descripción no puede quedar vacía.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Role',
  });

  return Role;
};