'use strict';

const { Model } = require('sequelize');
const { dinero, toSnapshot } = require('dinero.js');
const currencies = require('@dinero.js/currencies');

let listCountOnWorkspace = 0;

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
      // List.hasMany(models.Item, {
      //   foreignKey: {
      //     name: 'listId',
      //     allowNull: false
      //   }
      // });
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
      defaultValue: () => {
        return listCountOnWorkspace + 1;
      },
      validate: {
        isInt: {
          // TODO: add explanation note
          args: { gt: 0, lt: listCountOnWorkspace + 2 },
          msg: 'El valor ingresado debe ser un número entero.'
        }
      }
    },
    total: {
      type: DataTypes.STRING,
      validate: {
        // Validate if it's a dinero.js object or a stringified version of it
        validAmount(value) {
          if (!value instanceof dinero || !dinero(value)) {
            throw new Error('El monto es invalido.');
          }
          // TODO: validate currency
        }
      },
      // Always save a stringified version of a dinero.js object
      set(value) {
        if (value instanceof dinero) {
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

  List.beforeValidate(async () => {
    const { count } = await this.findAndCountAll({
      where: {
        workspaceId: this.workspaceId
      }
    });
    listCountOnWorkspace = count;
  })

  return List;
};