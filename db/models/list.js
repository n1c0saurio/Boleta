'use strict';

const { Model } = require('sequelize');
const { dinero, toSnapshot, toDecimal } = require('dinero.js');
const currencies = require('@dinero.js/currencies');

let listCountOnWorkspace;

module.exports = (sequelize, DataTypes) => {
  class List extends Model {

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      List.belongsTo(models.Workspace, {
        foreignKey: {
          name: 'workspaceId',
          allowNull: false
        }
      });

      // Cannot exist Items without a List
      List.hasMany(models.Item, {
        foreignKey: 'listId'
      });
    }
  }

  List.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre no puede quedar vacío.'
        }
      }
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          // args: { gt: 0, lt: listCountOnWorkspace + 2 },
          msg: 'El valor ingresado debe ser un número entero.'
        }
      }
    },
    total: {
      type: DataTypes.STRING,
      validate: {
        // Validate if it's a dinero.js snapshot or a stringified version of it
        validAmount(value) {
          try {
            (typeof value === 'string') ?
              dinero(JSON.parse(value)) :
              dinero(value);
          } catch (error) {
            // TODO: Log possible errors
          }
          // TODO: validate currency
        }
      },
      // Always save a stringified version of a dinero.js snapshot
      set(value) {
        if (typeof value === 'object') {
          this.setDataValue('total', toSnapshot(value));
        } else {
          this.setDataValue('total', value);
        }
      }
    },
    partialSum: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        isBoolean: {
          msg: 'Tipo de dato incorrecto'
        }
      }
    },
    // Return an object with two properties: unit price and currency code
    displayTotal: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.total) {
          return toDecimal(dinero(JSON.parse(this.total)),
            ({ value, currency }) => {
              return {
                amount: value,
                currency: currency.code
              };
            }
          );
        } else {
          return null;
        }
      },
      set(value) {
        throw new Error(
          'This property is created dynamically, and cannot be set manually.'
        );
      }
    },
    isArchived: {
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
    modelName: 'List',
  });

  // List.beforeValidate(async (list) => {
  //   const { count } = await List.findAndCountAll({
  //     where: {
  //       workspaceId: list.workspaceId
  //     }
  //   });
  //   listCountOnWorkspace = count;
  // });

  return List;
};