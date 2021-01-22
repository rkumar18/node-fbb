const express = require("express");
const router = express.Router();
const userController = require("../controller/User.controller");

router.post("/register", userController.register);
// router.post("/confirmEmail", userController.confirmEmail);
router.post("/login", userController.login);
router.post("/profile", userController.profile);

module.exports = router;
