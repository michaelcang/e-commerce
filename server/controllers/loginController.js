const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { user } = require("../models");

module.exports = {
  register: function(req, res) {
    let hash = "";
    let username = req.body.username;
    if (req.body.password !== "") {
      let salt = bcrypt.genSaltSync(7);
      hash = bcrypt.hashSync(req.body.password, salt);
    }
    let userInfo = {
      username,
      password: hash,
      role: 'admin'
    };
    user.findOne({ username }).then(found => {
      if (found) {
        res.status(400).send({ err: { message: "username is used" } });
      } else {
        user
          .create(userInfo)
          .then(newUser => {
            let role = newUser.role
            let token = jwt.sign({ username, role }, process.env.SECRET_KEY);
            res.status(201).json({
              msg: "successfully create new user",
              token,
              role
            });
          })
          .catch(err => {
            res.send(err.errors);
          });
      }
    });
  },
  login: function(req, res) {
    let username = req.body.username;
    let role = req.body.role;
    let token = jwt.sign({ username, role }, process.env.SECRET_KEY);
    res.status(200).json({
      message: "successfully sign in",
      token,
      username,
      role
    });
  }
};