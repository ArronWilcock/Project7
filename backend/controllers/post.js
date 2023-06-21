const { Post } = require("../models/post");

// Create a post
exports.createPost = (req, res, next) => {
  let parsedPost = JSON.parse(req.body.post);
  const url = req.protocol + "://" + req.get("host");
  imageUrl = url + "/images/" + req.file.filename;

  let post = Post.create({
    caption: parsedPost.caption,
    imageUrl,
    userId: parsedPost.userId,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  post
    .save()
    .then(() => {
      res.status(201).json({
        message: "Post saved successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message || error,
      });
    });
};

exports.getAllPosts = (req, res, next) => {
    Post.findAll()
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  };
