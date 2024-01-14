'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  /**
   * Class representing Roles users can have
   * @extends Model
   */
  class Role extends Model {

    static associate(models) {

      // A role can't be deleted if there're users associated with it
      Role.hasMany(models.User, {
        foreignKey: 'roleId',
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
          msg: 'validations.idEmpty'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'validations.nameEmpty'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'validations.descriptionEmpty'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Role',
  });

  return Role;
};