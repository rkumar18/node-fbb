const config = require("../config/default.json");
const jwt = require("jsonwebtoken");
const Models = require("../models");
const { Posts } = Models;

module.exports.addPost = async (req, res) => {
  try {
    const post = await Posts.create(req.body);
    return res.status(200).json({ message: "post added successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.toggleLike = async (req, res) => {
  try {
    // return console.log("Working ");
    const userId = req.user.id;
    const postId = req.params.id;
    if (!postId) throw Error("No post id is given: ");
    const foundPost = await Posts.findById(postId);
    if (!foundPost) throw Error("post not found");
    const likes = foundPost.like;
    // return console.log(likes);
    const userLiked = likes.find((id) => id == userId);

    if (userLiked) {
      const idx = likes.indexOf(userLiked);
      likes.splice(idx, 1);
      await foundPost.save();
      return res.json({ success: true, message: "like removed !!" });
    }
    likes.push(userId);
    const totalLikes = likes.length;
    await foundPost.save();
    res.status(200).json({ success: true, totalLikes, likes });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

module.exports.commentToggler = async (req, res) => {
  try {
    // return console.log("Working ");
    const userId = req.user.id;
    const postId = req.params.id;
    if (!postId) throw Error("No post id is given: ");
    const foundPost = await Posts.findById(postId);
    if (!foundPost) throw Error("post not found");
    const userComment = foundPost.comment;
    // return console.log(userComment);
    const foundComment = userComment.find((id) => id == userId);

    if (foundComment) {
      const idx = userComment.indexOf(foundComment);
      userComment.splice(idx, 1);
      await foundPost.save();
      return res.json({ success: true, message: "like removed !!" });
    }
    userComment.push(userId);
    const totaluserComment = userComment.length;
    await foundPost.save();
    res.status(200).json({ success: true, totaluserComment });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
