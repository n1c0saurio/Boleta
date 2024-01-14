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

  /**
   * Class representing a registered user
   * @extends Model
   */
  class User extends Model {

    /**
     * Compare an unencripted password with the current user's encripted one
     * @param   {string} password
     *          Unencripted password for comparison
     * @returns {boolean}
     *          True if passwords match, otherwise false
     */
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

      // All users can have workspaces, and must have at least one.
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
          msg: 'validations.firstNameEmpty'
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
          'validations.virtualPropertyError'
        );
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'validations.emailAlreadyRegistered'
      },
      validate: {
        notEmpty: {
          msg: 'validations.emailEmpty'
        },
        isEmail: {
          msg: 'validations.emailInvalid'
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
          msg: 'validations.passwordInvalid'
        }
      }
    },
    passwordConfirmation: {
      type: DataTypes.VIRTUAL,
      validate: {
        match(value) {
          if (this.password !== value) {
            throw new Error('validations.passwordConfirmationInvalid');
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
          if (noMatch) throw new Error('validations.currencyInvalid');
        }
      }
    },
    preferredLocale: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'en',
      validate: {
        isLocale: {
          msg: "validations.preferredLocaleInvalid"
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
          msg: 'validations.booleanInvalid'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  // Hash the password automatically whenever it gets updated
  User.beforeSave(async user => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  // Create the mandatory default Workspace when a User is succesfully created
  User.afterSave(async user => {
    await user.createWorkspace({
      name: 'dashboard:workspace.defaultName',
      isDefault: true
    });
  });

  return User;
};