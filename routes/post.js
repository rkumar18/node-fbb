const express = require("express");
const middlewares = require("../middlewares");
const router = express.Router();
const postController = require("../controller/Post.controller");

router.post("/addpost", middlewares.verifyToken, postController.addPost);
router.post("/like/:id", middlewares.verifyToken, postController.toggleLike);
// router.post(
//   "/comment/:id",
//   middlewares.verifyToken,
//   postController.commentToggler
// );
module.exports = router;
