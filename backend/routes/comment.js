const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment");

const auth = require("../middleware/auth");

router.post("/:PostId/comment", auth, commentController.createComment);
router.get("/:PostId/comments", auth, commentController.getAllComments);
router.delete("/:id/comments", auth, commentController.deleteComment);

module.exports = router;
