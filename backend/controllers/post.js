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

exports.getAllPostsByUser = (req, res, next) => {
  Post.findAll({
    where: { UserId: req.params.id },
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

exports.markPostAsRead = (req, res, next) => {
  let { postId, userId } = req.params; // Assuming postId and userId are passed as parameters in the request

  // Parse postId and userId as integers
  postId = parseInt(postId, 10);
  userId = parseInt(userId, 10);

  console.log("postId:", postId);
  console.log("userId:", userId);

  Post.findByPk(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Check if the user has already marked the post as read
      if (post.readByUsers.includes(userId.toString())) {
        return res
          .status(409)
          .json({ error: "Post is already marked as read by this user" });
      }

      let { readByUsers } = post;

      readByUsers = [...readByUsers, userId.toString()];
      post.update({ readByUsers }).then((post) => {
        console.log("Updated readByUsers array:", post.readByUsers);

        // Save the updated post
        post
          .save()
          .then((updatedPost) => {
            console.log("Updated post:", updatedPost);
            res
              .status(200)
              .json({ message: "Post marked as read successfully!" });
          })
          .catch((error) => {
            console.error("Error while saving updated post:", error);
            res.status(500).json({ error: "Failed to mark post as read" });
          });
      });
    })
    .catch((error) => {
      console.error("Error while marking post as read:", error);
      res.status(500).json({ error: error });
    });
};

exports.likePost = (req, res, next) => {
  let { postId, userId } = req.params; // Assuming postId and userId are passed as parameters in the request
  let { like } = req.body;

  // Parse postId as integer
  postId = parseInt(postId, 10);

  console.log("postId:", postId);
  console.log("userId:", userId);

  Post.findByPk(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      let { usersLiked, usersDisliked, likes, dislikes } = post;

      if (like === 1) {
        usersDisliked = usersDisliked.filter((id) => id !== userId);

        if (!usersLiked.includes(userId)) {
          resetLike(usersLiked, userId, usersDisliked);
          usersLiked = [...usersLiked, userId];
        }
      } else if (like === -1) {
        usersLiked = usersLiked.filter((id) => id !== userId);

        if (!usersDisliked.includes(userId)) {
          resetLike(usersLiked, userId, usersDisliked);
          usersDisliked = [...usersDisliked, userId];
        }
      } else if (like === 0) {
        usersLiked = usersLiked.filter((id) => id !== userId);
        usersDisliked = usersDisliked.filter((id) => id !== userId);
      }

      likes = usersLiked.length;
      dislikes = usersDisliked.length;

      post
        .update({ usersLiked, usersDisliked, likes, dislikes })
        .then((post) => {
          console.log("Updated post:", post);

          // Save the updated post
          post
            .save()
            .then((updatedPost) => {
              console.log("Updated post:", updatedPost);
              res
                .status(200)
                .json({ message: "Post liked/disliked successfully!" });
            })
            .catch((error) => {
              console.error("Error while saving updated post:", error);
              res.status(500).json({ error: "Failed to like/dislike post" });
            });
        });
    })
    .catch((error) => {
      console.error("Error while liking/disliking post:", error);
      res.status(500).json({ error: error });
    });
};

function resetLike(usersLiked, userId, usersDisliked) {
  const likesIndex = usersLiked.indexOf(userId.toString());
  const dislikesIndex = usersDisliked.indexOf(userId.toString());

  if (likesIndex !== -1) {
    usersLiked.splice(likesIndex, 1);
  }

  if (dislikesIndex !== -1) {
    usersDisliked.splice(dislikesIndex, 1);
  }
}
