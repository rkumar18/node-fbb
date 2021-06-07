const express = require("express");
const middlewares = require("../middlewares");
const router = express.Router();
const postController = require("../controller/Post.controller");
var upload = require("../util/multer");
var postPhoto = upload.single('uploadPic')


router.post("/addpost", middlewares.verifyToken, postPhoto,postController.addPost);
router.post("/like/:id", middlewares.verifyToken, postController.toggleLike);
router.post(
  "/comment/:id",
  middlewares.verifyToken,
  postController.commentToggler
);
router.get("/", postController.getPost);
module.exports = router;
