const express = require("express");
const router = express.Router();
const userController = require("../controller/User.controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", userController.profile);
router.patch("/editProfile", userController.editProfile);
router.post("/sendEmail", userController.sendEmail);
router.post("/confirmEmail/:token", userController.confirmEmail);

module.exports = router;
