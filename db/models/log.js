'use strict';

const { Model } = require('sequelize');


// List of actions that can be recorded in a log
const actions = {
  signUp: {
    key: 'signUp',
    name: 'Registro'
  },
  loggin: {
    key: 'loggin',
    name: 'Inicio de sesión'
  },
  logout: {
    key: 'logout',
    name: 'Cierre de sesión'
  },
  failedLoggin: {
    key: 'failedLoggin',
    name: 'Acceso fallido'
  },
  failedSignUp: {
    key: 'failedSignUp',
    name: 'Registro fallido'
  },
  userBlocked: {
    key: 'userBlocked',
    name: 'Usuario bloqueado'
  },
  userUnblocked: {
    key: 'userUnblocked',
    name: 'Usuario desbloqueado'
  },
  roleUpdated: {
    key: 'roleUpdated',
    name: 'Rol actualizado'
  },
  accountDeleted: {
    key: 'accountDeleted',
    name: 'Cuenta eliminada'
  },
  error404: {
    key: 'error404',
    name: 'Error 404'
  }
};

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {

    static associate(models) {

      // Sometimes a user performs an action that can be recorded.
      Log.belongsTo(models.User, {
        as: 'Performer',
        foreignKey: 'userPerformerId'
      });

      // Sometimes a user is affected by an action that can be recorded.
      Log.belongsTo(models.User, {
        as: 'Affected',
        foreignKey: 'userAffectedId'
      });

      // And sometimes, both things can happen,
      // e.g.: an administrator blocked a certain user.
      // Thats why this model have that two optional FK.
    }
  }

  Log.init({
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAValidAction(value) {
          let noMatch = true;
          for (const action in actions) {
            if (action.key === keyName) noMatch = false;
          }
          if (noMatch) throw new Error('Invalid action name');
        }
      }
    },
    displayName: {
      type: DataTypes.VIRTUAL,
      get() {
        return actions[this.action].name
      },
      set(value) {
        throw new Error(
          'Value of displayName is created dinamically, do not set it manually'
        );
      }
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIP: true
      },
      set(value) {
        this.setDataValue(value.trim());
      }
    },
    device: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue(value.trim());
      }
    },
    userPerformerEmail: {
      type: DataTypes.STRING
    },
    userAffectedEmail: {
      type: DataTypes.STRING
    },
    notes: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue(value.trim());
      }
    }
  }, {
    sequelize,
    modelName: 'Log',
  });

  return Log;
};