'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const currencies = require('@dinero.js/currencies');

// Regular expression for validate password requirements.
const validPassword =
  `^(`
  + `(?=.*[a-z])` // check if it has at least one lowercase letter
  + `(?=.*[A-Z])` // check if it has at least one uppercase letter
  + `(?=.*[0-9])` // check if it has at least one digit
  + `(?=.*[^a-zA-Z0-9\\n\\r])` // it has at least one special character
  + `.*){8,72}` // check if it's between 8 and 72 characters long
  + `$`;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    async matchPassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    ResetPasswordToken() {
      // TODO: should create a unique token that would be send to user's email
      // https://stackoverflow.com/a/27580553
    }

    static VerifyResetPasswordToken() {
      // TODO: should verify the token for allow the user to reset its password
    }

    static associate(models) {

      // All users must have a role.
      User.belongsTo(models.Role, {
        foreignKey: {
          name: 'roleId',
          allowNull: false
        },
        onDelete: 'RESTRICT'
      });

      User.hasMany(models.Workspace, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });

      // Sometimes, a user is the performer or is affected by an action,
      // so a log register its 'id' and 'email' (the latter for reference,
      // just in case the user would be deleted in the future).
      User.hasMany(models.Log, {
        foreignKey: 'userPerformerId'
      });

      User.hasMany(models.Log, {
        foreignKey: 'userAffectedId'
      });
    }
  }

  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre no puede quedar vacío.'
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
      unique: {
        msg: 'Este correo ya está registrado.'
      },
      validate: {
        notEmpty: {
          msg: 'El correo no puede quedar vacío.'
        },
        isEmail: {
          msg: 'El correo ingresado no es válido.'
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
          msg: 'La contraseña no cumple las condiciones solicitadas.'
        }
      }
    },
    passwordConfirmation: {
      type: DataTypes.VIRTUAL,
      validate: {
        match(value) {
          if (this.password !== value) {
            throw new Error('Las contraseñas no coinciden.');
          }
        }
      }
    },
    defaultCurrency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      validate: {
        validCode(value) {
          let noMatch = true;
          for (const currency in currencies) {
            if (currency === value) {
              noMatch = false;
              break;
            };
          }
          if (noMatch) throw new Error('Invalid currency code');
        }
      }
    },
    preferredLocale: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'en',
      validate: {
        isLocale: {
          msg: "Código de lenguaje inválido."
        }
      }
    },
    isAdmin: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getRole.id === 'admin';
      }
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        isBoolean: {
          msg: 'Tipo de dato incorrecto.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  // Hashing the password
  User.beforeSave(async user => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  // Create a default Workspace
  User.afterSave(async user => {
    await user.createWorkspace({
      name: 'Área de trabajo por defecto',
      isDefault: true
    });
  });

  return User;
};