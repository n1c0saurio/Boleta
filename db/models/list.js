'use strict';

const { Model } = require('sequelize');
const { dinero, toSnapshot, toDecimal } = require('dinero.js');
const currencies = require('@dinero.js/currencies');

let listCountOnWorkspace;

module.exports = (sequelize, DataTypes) => {

  /**
   * Class representing a List where user can add Items on it
   */
  class List extends Model {

    getCurrencyObject(currencyCode) {
      return currencies[currencyCode];
    }

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
        },
        onDelete: 'CASCADE'
      });

      // Cannot exist Items without a List
      List.hasMany(models.Item, {
        foreignKey: 'listId',
        onDelete: 'CASCADE'
      });
    }
  }

  List.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'validations.nameEmpty'
        }
      }
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          // args: { gt: 0, lt: listCountOnWorkspace + 2 },
          msg: 'validations.positionInvalid'
        }
      }
    },
    currency: {
      type: DataTypes.STRING,
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
          msg: 'validations.booleanInvalid'
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
          'validations.virtualPropertyError'
        );
      }
    },
    isArchived: {
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