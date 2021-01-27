const config = require("../config/default.json");
const jwt = require("jsonwebtoken");
const Models = require("../models");
const { Posts } = Models;

module.exports.addPost = async (req, res) => {
  try {
    // const decoded = req.user;
    // const postData = req.body;
    const post = await Posts.create(req.body);
    // console.log("rcyvh");
    return res.status(200).json({ message: "post added successfully" });

    // res.send("post !");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const foundPost = await Posts.findById(postId);
    if (!foundPost) throw Error("post not found");
    const likes = foundPost.like;
    const isLiked = likes.find((item) => item.id == userId);
    if (isLiked) {
      likes.pop(isLiked);
    }
    likes.push(userId);
    const totalLikes = likes.length;
    res.status(200).json({ message: "likes", totalLikes });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
