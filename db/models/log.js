'use strict';

const { Model } = require('sequelize');
const { actions } = require('../../validators/validators');

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
      // Thats why this model have two optional FK.
    }
  }

  Log.init({
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlphanumeric: true,
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