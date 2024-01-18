const models = require('../db/models');
const { validationErrorProcesor } = require('./utils');
const { dinero, toSnapshot } = require('dinero.js');
const currencies = require('@dinero.js/currencies');

/**
 * Validate data to create a new List, and
 * create it if validation was successfull
 * @async
 * @param   {formData} formData
 *          Body of a POST request with new list data 
 * @returns {undefined|errors} 
 *          If validations pass returns undefined, if not returns an object
 *          with each wrong field as a key and the error message as its value
 */
exports.newList = async (formData) => {
  try {
    let { count } = await models.List.findAndCountAll({
      where: {
        workspaceId: formData.listWorkspace
      }
    });

    await models.List.create({
      name: formData.listName,
      position: count + 1,
      workspaceId: formData.listWorkspace
    });

  } catch (err) {
    return validationErrorProcesor(err);
  }
}

/**
 * Validate a List deletion
 * @async
 * @param {string} listId 
 * @returns {undefined|errors} 
 *          If validations pass returns undefined, if not returns an object
 *          with each wrong field as a key and the error message as its value
 */
exports.deleteList = async (listId) => {
  try {
    let listToDelete = await models.List.findOne({
      where: {
        'id': listId
      }
    });
    await listToDelete.destroy();

  } catch (err) {
    return validationErrorProcesor(err);
  }
}

/**
 * Validate data to create a new Item, and
 * create it if validation was successfull
 * @async
 * @param   {formData} formData
 *          Body of a POST request with new item data 
 * @returns {undefined|errors} 
 *          If validations pass returns undefined, if not returns an object
 *          with each wrong field as a key and the error message as its value
 */
exports.newItem = async (formData) => {
  try {
    let { count } = await models.Item.findAndCountAll({
      where: {
        listId: formData.listId
      }
    });

    let itemAmount = (formData.itemPrice) ?
      toSnapshot(dinero({
        amount: parseInt(formData.itemPrice),
        currency: currencies[formData.listCurrency]
      })) :
      undefined;

    await models.Item.create({
      name: formData.itemName,
      position: count + 1,
      price: itemAmount,
      quantity: formData.itemQuantity,
      listId: formData.listId
    })
  } catch (err) {
    return validationErrorProcesor(err);
  }
}

/**
 * Validate a Item deletion
 * @async
 * @param {string} itemId 
 * @returns {undefined|errors} 
 *          If validations pass returns undefined, if not returns an object
 *          with each wrong field as a key and the error message as its value
 */
exports.deleteItem = async (itemId) => {
  try {
    let itemToDelete = await models.Item.findOne({
      where: {
        'id': itemId
      }
    });
    await itemToDelete.destroy();

  } catch (err) {
    return validationErrorProcesor(err);
  }
}