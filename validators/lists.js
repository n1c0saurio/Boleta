const models = require('../db/models');
const { dinero, toSnapshot } = require('dinero.js');
const currencies = require('@dinero.js/currencies');

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
    let errors = {}
    if (err.errors) {
      err.errors.forEach(error => {
        console.log(`${error.path}: ${error.message}`);
        errors[error.path] = error.message;
      });
    } else {
      // TODO: log this
      console.log(err);
    }
    return errors;
  }
}

exports.newItem = async (formData) => {
  try {
    let { count } = await models.Item.findAndCountAll({
      where: {
        listId: formData.listId
      }
    });
    await models.Item.create({
      name: formData.itemName,
      position: count + 1,
      price: toSnapshot(dinero({
        amount: parseInt(formData.itemPrice),
        currency: currencies[formData.listCurrency]
      })),
      quantity: formData.itemQuantity,
      listId: formData.listId
    })
  } catch (err) {
    // TODO: modularize
    let errors = {}
    if (err.errors) {
      err.errors.forEach(error => {
        console.log(`${error.path}: ${error.message}`);
        errors[error.path] = error.message;
      });
    } else {
      // TODO: log this
      console.log(err);
    }
    return errors;
  }
}