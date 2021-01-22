const express = require("express");
const middlewares = require("../middlewares");
const router = express.Router();
const postController = require("../controller/Post.controller");

router.post("/addpost", middlewares.verifyToken, postController.addPost);

module.exports = router;
