const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, postController.createPost);
router.post("/:id/like", auth, postController.likePost);
router.put("/:postId/mark-read/:userId", auth, postController.markPostAsRead);
router.get("/", auth, postController.getAllPosts);
router.get("/:id", auth, postController.getOnePost);

module.exports = router;