'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

// Regular expression for validate password requirements.
const validPassword =
  `^(`
  + `(?=.*[a-z])` // check if it has at least one lowercase letter
  + `(?=.*[A-Z])` // check if it has at least one uppercase letter
  + `(?=.*[0-9])` // check if it has at least one digit
  + `(?=.*[^a-zA-Z0-9\\n\\r])` // check if it has at least one special character
  + `.*){8,72}` // check if it's between 8 and 72 characters long
  + `$`;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {

      // All users must have a role.
      User.belongsTo(models.Role, {
        foreignKey: {
          allowNull: false
        }
      });

      // Sometimes, a user is the performer or is affected by an action,
      // so a log register its 'id' and 'email' (the latter for reference,
      // just in case the user would be deleted in the future).
      User.hasMany(models.Log);
    }
  }

  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre no puede quedar vacío."
        }
      },
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
        if (this.lastName) {
          return `${this.firstName} ${this.lastName}`;
        } else {
          return this.firstName;
        }
      },
      set(value) {
        throw new Error(
          'This property is created dynamically, and cannot be set manually.'
        );
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "El correo no puede quedar vacío."
        },
        isEmail: {
          msg: "El correo ingresado no es válido."
        }
      },
      set(value) {
        this.setDataValue('email', value.toLowerCase().trim());
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: [validPassword],
          msg: "La contraseña debe tener entre 8 y 72 caracteres, y al menos "
            + "una minúscula, una mayúscula, un dígito y un caracter especial."
        }
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

  // Hashing the password
  User.afterValidate(async user => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  return User;
};