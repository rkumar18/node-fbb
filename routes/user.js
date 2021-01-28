const express = require("express");
const router = express.Router();
const userController = require("../controller/User.controller");

router.post("/register", userController.register);
// router.post("/confirmEmail", userController.confirmEmail);
router.post("/login", userController.login);
router.get("/profile", userController.profile);
router.patch("/editProfile", userController.editProfile);

module.exports = router;
