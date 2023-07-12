'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    // Regular expression for validate password requirements.
    validPassword =
      '^' +
      `(?=.*[a-zç])` + // contains at least one lowercase letter
      `(?=.*[A-ZÇ])` + // contains at least one uppercase letter
      `(?=.*\d)` + // contains at least one number
      `(?=.*[¡!¿?'"@#$€%^&*()_[\]{},.·;:~<>|/\\+=-])` + // contains special character
      `[A-Za-zçÇ\d¡!¿?'"@#$€%^&*()_[\]{},.·;:~<>|/\\+=-]{8,}` + // min 8 character
      '$';

    static associate(models) {

      // All users must have a role.
      User.belongsTo(models.Role, {
        foreignKey: {
          allowNull: false
        }
      });

      // Sometimes, a user is the performer or is affected by an action.
      User.hasMany(models.Log);
    }
  }

  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('firstName', value.toString().trim());
      }
    },
    lastName: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('lastName', value.toString().trim());
      }
    },
    displayName: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.lastName ?
          `${this.firstName} ${this.lastName}`
          : this.firstName;
      },
      set(value) {
        throw new Error(
          'Value of displayName is created dinamically, do not set it manually'
        );
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      set(value) {
        this.setDataValue('email', value.toLowerCase().trim());
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: [validPassword]
      },
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 10));
      }
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};