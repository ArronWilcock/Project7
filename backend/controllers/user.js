const { User, Comment, Post } = require("../models");
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
          success: true,
          message: "User added successfully",
        });
      })
      .catch((error) => {
        res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      });
  });
};

exports.login = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email",
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              success: false,
              message: "Incorrect password",
            });
          }
          const token = jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
          });
          res.status(200).json({
            success: true,
            userId: user.id,
            token: token,
          });
        })
        .catch(() => {
          res.status(500).json({
            success: false,
            message: "Internal server error",
          });
        });
    })
    .catch(() => {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    });
};

exports.deleteAccount = async (req, res, next) => {
  const userId = req.params.id;

  try {
    // First, find all posts associated with the user
    const userPosts = await Post.findAll({ where: { UserId: userId } });

    // Delete all comments associated with the user's posts
    for (const post of userPosts) {
      await Comment.destroy({ where: { PostId: post.id } });
    }

    // Delete all comments where the user is the commenter
    await Comment.destroy({ where: { UserId: userId } });

    // Then, delete the user's posts and the user itself
    await Post.destroy({ where: { UserId: userId } });
    await User.destroy({ where: { id: userId } });

    res.status(200).json({
      message:
        "User account, associated posts, and comments deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || error,
    });
  }
};

exports.getOneUser = (req, res, next) => {
  User.findOne({
    where: { id: req.params.id }, // Use where clause to specify the post ID
  })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
