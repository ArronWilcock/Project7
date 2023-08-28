const { Post, User, Comment } = require("../models");

exports.createComment = (req, res, next) => {
  comment = new Comment({
    comment: req.body.comment,
    UserId: req.body.userId,
    PostId: req.params.PostId,
  });
  comment
    .save()
    .then(() => {
      res.status(201).json({
        message: "Comment saved successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message || error,
      });
    });
};

exports.getAllComments = (req, res, next) => {
  Comment.findAll({
    order: [["createdAt", "DESC"]],
    where: { PostId: req.params.PostId }, // Use where clause to specify the post ID
    include: [{ model: User, attributes: ["firstName", "lastName"] }],
  })
    .then((comments) => {
      res.status(200).json({
        comments: comments,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};
exports.deleteComment = async (req, res, next) => {
  const commentId = parseInt(req.params.id, 10);

  try {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "comment not found",
      });
    }

    // Then, delete the post itself
    await Comment.destroy({ where: { id: commentId } });

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || error,
    });
  }
};
