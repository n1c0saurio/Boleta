'use strict';

const { Model } = require('sequelize');
const { dinero, toSnapshot, add, subtract, multiply, toDecimal } = require('dinero.js');
const currencies = require('@dinero.js/currencies');

module.exports = (sequelize, DataTypes) => {

  /**
   * Class representing a Item of a shopping list
   */
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      // Cannot exist an Item without a parent List
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

  // Hooks to keep updated the total of the parent List…

  // After the creation of a new Item…
  Item.afterCreate(async item => {
    let parentList = await item.getList();

    // If Item has no price, set parent List `partialSum` to true…
    if (!item.price) {
      // …only if not already `true`
      if (!parentList.partialSum) {
        parentList.partialSum = true;
        await parentList.save();
      }

      // If parent List has no price, asign Item total price directly
    } else if (!parentList.total) {
      const amount = multiply(
        dinero(JSON.parse(item.price)),
        item.quantity
      )
      parentList.total = JSON.stringify(amount);
      await parentList.save();

      // Otherwise, sum Item total price to List's total
    } else if (item.price && parentList.total) {
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

  // After the deletion of an Item…
  Item.afterDestroy(async item => {
    let parentList = await item.getList();

    // If the Item has no price…
    if (!item.price) {
      const otherItemsWithoutPrice = await Item.count({
        where: {
          listId: item.listId,
          price: null
        }
      });
      // and parent List has no other unpriced Item, set `partialSum` to false
      if (otherItemsWithoutPrice === 0) {
        parentList.partialSum = false;
        await parentList.save();
      }

      // Otherwise, update parent List's total
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