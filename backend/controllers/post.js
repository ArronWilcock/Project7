const { Post, User } = require("../models");

exports.createPost = (req, res, next) => {
  let post = null;
  let parsedPost = null;
  let imgUrl = null;
  if (req.file) {
    parsedPost = JSON.parse(req.body.post);
    // logic to retrieve the entire URL for the image file
    const url = req.protocol + "://" + req.get("host");
    imgUrl = url + "/images/" + req.file.filename;
  } else {
    parsedPost = req.body;
  }
  post = new Post({
    caption: parsedPost.caption,
    imgUrl,
    likes: 0,
    dislikes: 0,
    UserId: parsedPost.userId,
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
  Post.findAll({
    order: [["createdAt", "DESC"]],
    include: [{ model: User, attributes: ["firstName", "lastName"] }],
  })
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

exports.getOnePost = (req, res, next) => {
  Post.findOne({
    where: { id: req.params.id }, // Use where clause to specify the post ID
    include: [{ model: User, attributes: ["firstName", "lastName"] }],
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

exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    const usersLiked = [...post.usersLiked]; // Make a copy of the usersLiked array
    const usersDisliked = [...post.usersDisliked]; // Make a copy of the usersDisliked array
    const userId = req.body.userId;
    const like = req.body.like;

    if (like === 1 && !usersLiked.includes(userId)) {
      usersLiked.push(userId);
      removeUserFromDisliked(usersDisliked, userId); // Call a new helper function
    } else if (like === -1 && !usersDisliked.includes(userId)) {
      usersDisliked.push(userId);
      removeUserFromLiked(usersLiked, userId); // Call a new helper function
    } else if (like === 0 && (usersLiked.includes(userId) || usersDisliked.includes(userId))) {
      removeUserFromLiked(usersLiked, userId); // Call a new helper function
      removeUserFromDisliked(usersDisliked, userId); // Call a new helper function
    }

    post.likes = usersLiked.length;
    post.dislikes = usersDisliked.length;

    await post.save();

    res.status(200).json({
      message: "Post updated successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || error,
    });
  }
};

// New helper function to remove a user from the liked array
function removeUserFromLiked(usersLiked, userId) {
  const index = usersLiked.indexOf(userId);
  if (index !== -1) {
    usersLiked.splice(index, 1);
  }
}

// New helper function to remove a user from the disliked array
function removeUserFromDisliked(usersDisliked, userId) {
  const index = usersDisliked.indexOf(userId);
  if (index !== -1) {
    usersDisliked.splice(index, 1);
  }
}
