'use strict';

const { Model } = require('sequelize');
const { dinero, toSnapshot } = require('dinero.js');
const currencies = require('@dinero.js/currencies');

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Item.belongsTo(models.List, {
        foreignKey: {
          name: 'listId',
          allowNull: false
        },
        onDelete: 'CASCADE'
      });
    }
  }

  Item.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          args: { gt: 0 },
          msg: 'El valor ingresado debe ser un número entero.'
        }
      }
    },
    price: {
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
          this.setDataValue('price', JSON.stringify(value));
        } else {
          this.setDataValue('price', value);
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          args: { gt: 0 },
          msg: 'La cantidad debe ser igual o mayor a 1.'
        }
      }
    },
    inTrash: {
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
    modelName: 'Item',
  });

  return Item;
};