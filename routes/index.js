// const { Router } = require("express");
const post = require("../models/Post");

const express = require("express");
const router = express.Router();
const userRoutes = require("./user");
const postRoutes = require("./post");

router.use("/user", userRoutes);
router.use("/post", postRoutes);

module.exports = router;
