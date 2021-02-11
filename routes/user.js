const express = require("express");
const router = express.Router();
const userController = require("../controller/User.controller");
// const verifyToken = require("../middlewares").verifyToken

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile",userController.profile);
router.get("/repos/:username", userController.cacheMiddleware,userController.github);
router.patch("/editProfile", userController.editProfile);
router.post("/sendEmail", userController.sendEmail);
router.post("/confirmEmail/:token", userController.confirmEmail);

module.exports = router;
