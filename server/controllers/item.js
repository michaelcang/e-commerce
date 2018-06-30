const mongoose = require("mongoose");
const { item } = require("../models");

module.exports = {
  getAllItems: function(req, res) {
    let params = {}
    if (req.query.category) {
      params.category = req.query.category
    }
    item.find(params, function(err, items) {
      if (err) {
        res.status(400).json({ err });
        return console.log(err);
      }
      res.status(200).json({
        msg: "get items",
        items
      });
    });
  },
  addItem: function(req, res) {
    console.log(req.body.name, req.body.price, req.file);
    let newItem = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      imageUrl: req.file.cloudStoragePublicUrl
    };
    item.create(newItem, (err, newItem) => {
      if (err) {
        res.status(400).json({ err });
        return console.log(err);
      }
      res.status(201).json({
        msg: "add item",
        newItem
      });
    });
  },
  updateItem: function(req, res) {
    let id = req.params.id;
    let updatedItem = req.body;
    item.findByIdAndUpdate(
      id,
      { $set: updatedItem },
      { new: true },
      (err, updatedItem) => {
        if (err) {
          res.status(400).json({ err });
          return console.log(err);
        }
        res.status(201).json({
          msg: "update item successful",
          updatedItem
        });
      }
    );
  },
  deleteItem: function(req, res) {
    let id = req.params.id;
    item.findByIdAndDelete(id, (err, deletedItem) => {
      if (err) {
        res.status(400).json({ err });
        return console.log(err);
      }
      res.status(201).json({
        msg: "delete item successful",
        deletedItem
      });
    });
  }
};
