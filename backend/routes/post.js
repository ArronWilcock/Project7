const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, postController.createPost);
router.post("/:postId/mark-read/:userId", auth, postController.markPostAsRead);
router.post("/:postId/like/:userId", auth, postController.likePost);
router.get("/", auth, postController.getAllPosts);
router.get("/by-user/:id", auth, postController.getAllPostsByUser);
router.get("/:id", auth, postController.getOnePost);
router.delete("/:id", auth, postController.deletePost);

module.exports = router;
