const config = require("../config/default.json");
const jwt = require("jsonwebtoken");
const postmodel = require("../models");

module.exports.addPost = async (req, res) => {
  try {
    const decoded = req.user;
    const postData = req.body;

    res.send("post !");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
