'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
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