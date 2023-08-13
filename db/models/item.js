'use strict';

const { Model } = require('sequelize');
const { dinero, toSnapshot, add, multiply, toDecimal } = require('dinero.js');
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
    // Return an object with two properties: unit price and currency code
    displayUnitPrice: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.price && this.quantity > 1) {
          return toDecimal(dinero(JSON.parse(this.price)),
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
    // Return an object with two properties: total price and currency code
    displayTotalPrice: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.price) {
          const subtotal = multiply(
            dinero(JSON.parse(this.price)),
            this.quantity
          );
          return toDecimal(subtotal,
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

  // Update total of parent List...

  // After the creation of a Item
  Item.afterCreate(async item => {
    let list = await item.getList();

    if (!item.price) {
      // if `price` null, set list `partialSum` to true
      if (!list.partialSum) {
        // only if not setted already
        list.partialSum = true;
        list.save();
      }
    } else if (!list.total) {
      // if `total` is null, asign `price`
      const amount = multiply(
        dinero(JSON.parse(item.price)),
        item.quantity
      )
      list.total = JSON.stringify(amount);
      list.save();
    } else if (item.price && list.total) {
      // if there's `price` and `total`, sum both and update total
      const sum = add(
        dinero(JSON.parse(list.total)),
        multiply(
          dinero(JSON.parse(item.price)),
          item.quantity
        )
      );
      list.total = JSON.stringify(sum);
      list.save();
    }
  });

  return Item;
};