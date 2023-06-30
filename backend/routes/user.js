const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.delete("/:id", auth, userController.deleteAccount);
module.exports = router;
