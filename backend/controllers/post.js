const { Post } = require("../models");
const upload = require("../middleware/multer-config");

exports.createPost = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      // Handle multer errors, if any
      res.status(400).json({
        error: err,
      });
    } else {
      const { caption } = req.body;
      const url = req.protocol + "://" + req.get("host");
      imgUrl = url + "/images/" + req.file.filename;
      Post.create({ caption, imgUrl })
        .then((post) => {
          res.status(201).json({
            message: "Post created successfully",
            post: post,
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    }
  });
};

exports.getAllPosts = (req, res, next) => {
  Post.findAll()
    .then((posts) => {
      res.status(200).json({
        posts: posts,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};
