'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    static associate(models) {

      Log.belongsTo(models.User, {
        as: 'Performer',
        foreignKey: 'userPerformerId'
      });

      Log.belongsTo(models.User, {
        as: 'Affected',
        foreignKey: 'userAffectedId'
      });
    }
  }

  Log.init({
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    device: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userPerformerEmail: {
      type: DataTypes.STRING
    },
    userAffectedEmail: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Log',
  });

  return Log;
};