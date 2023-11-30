'use strict';

const { Model } = require('sequelize');
const { dinero, toSnapshot, add, subtract, multiply, toDecimal } = require('dinero.js');
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
          args: { gt: 0 },
          msg: 'validations.positionInvalid'
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
          'validations.virtualPropertyError'
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
          'validations.virtualPropertyError'
        );
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          args: { gt: 0 },
          msg: 'validations.quantityInvalid'
        }
      }
    },
    inTrash: {
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
    modelName: 'Item',
  });

  // Update total of parent List...

  // After the creation of a Item
  Item.afterCreate(async item => {
    let parentList = await item.getList();

    if (!item.price) {
      // Set Parent List `partialSum` to true
      if (!parentList.partialSum) {
        // only if not already `true`
        parentList.partialSum = true;
        await parentList.save();
      }
    } else if (!parentList.total) {
      // Asign Item `price` directly, multiplied by `quantity`
      const amount = multiply(
        dinero(JSON.parse(item.price)),
        item.quantity
      )
      parentList.total = JSON.stringify(amount);
      await parentList.save();
    } else if (item.price && parentList.total) {
      // Sum List `total` and Item `price` (multiplied by `quantity`)
      const sum = add(
        dinero(JSON.parse(parentList.total)),
        multiply(
          dinero(JSON.parse(item.price)),
          item.quantity
        )
      );
      parentList.total = JSON.stringify(sum);
      await parentList.save();
    }
  });

  // After the deletion of an Item
  Item.afterDestroy(async item => {
    let parentList = await item.getList();

    if (!item.price) {
      const otherItemsWithoutPrice = await Item.count({
        where: {
          listId: item.listId,
          price: null
        }
      });
      // if there're no other `Item` with `price` unassigned,
      // set List `partialSum` to false
      if (otherItemsWithoutPrice === 0) {
        parentList.partialSum = false;
        await parentList.save();
      }
    } else {
      const remainder = subtract(
        dinero(JSON.parse(parentList.total)),
        multiply(
          dinero(JSON.parse(item.price)),
          item.quantity
        )
      );
      parentList.total = JSON.stringify(remainder);
      await parentList.save();
    }
  });

  return Item;
};