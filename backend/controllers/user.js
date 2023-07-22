const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then(() => {
        res.status(201).json({
          message: "User added successfully",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  });
};
exports.login = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: new Error(),
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error(),
            });
          }
          // Here the JWT is generated using the jwt.sign method with a payload of the users unique identifier
          // and assigning a secret key used to sign the jwt which expires in 24 hours
          const token = jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
          });
          res.status(200).json({
            userId: user.id,
            token: token,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

exports.deleteAccount = (req, res, next) => {
  const userId = req.params.id;

  User.destroy({ where: { id: userId } })
    .then(() => {
      res.status(200).json({
        message: "User account deleted successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message || error,
      });
    });
};
