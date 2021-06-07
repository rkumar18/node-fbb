const config = require("config");
const jwt = require("jsonwebtoken");
const Models = require("../models");
const { Posts } = Models;
const aws = require("aws-sdk");
const s3 = new aws.S3();
const fs = require("fs");

module.exports.addPost = async (req, res) => {
  try {
    aws.config.setPromisesDependency();
    aws.config.update({
      accessKeyId: config.get('ACCESSKEYID'),
      secretAccessKey: config.get('SECRETACCESSKEY')
    });
    var params = {
      ACL: 'public-read',
      Bucket : config.get('AWS_BUCKET_NAME'),
      Body: fs.createReadStream(req.file.path),
      Key: `fb-posts/${req.file.originalname}`
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.log('Error occured while trying to upload to S3 bucket', err);
      }
      console.log(data);
    });
    const {filename,path} = req.file;
    console.log({filename, path});
    const _post = new Posts({...req.body,uploadPic:{filename, path} });
    await post.save();
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
      return res.json({ success: true, message: "comment removed !!" });
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

module.exports.getPost = async(req, res) => {
  try {

    let post = await Models.Posts.findByName(req.body.name);
    res.status(200).json({data: post})
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}
