const Models = require("../models");
const { Users } = Models;
const jwt = require("jsonwebtoken");
const config = require("../config/default.json");
const userFunc = {};
const md5 = require("md5");

userFunc.register = async (req, res) => {
  try {
    const Email = req.body.email;
    const isUserExist = await Users.findOne({ email: Email });
    console.log(req.body);
    if (!isUserExist) {
      const user = new Users(req.body);
      const password = md5(user.password);
      user.confirmPassword = password;
      user.password = password;
      await user.save();
      return res.status(200).json({ message: "user added successfully" });
    } else {
      return res.status(404).json({ message: "Alreay exist" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// userFunc.confirmEmail = async (req, res) => {
//   try {
//   } catch (error) {}
// };

userFunc.login = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await Users.findOne({ email: email });
    if (!user) throw new Error("Not found !!");
    const enteredPass = md5(req.body.password);
    if (user.password !== enteredPass) throw new Error("Invalid cred. !");
    const payload = {
      user: { id: user.id },
    };
    const token = jwt.sign(payload, require("config").get("secret"), {
      expiresIn: "1d",
    });
    res.status(200).json({ message: "login successfully", token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

userFunc.profile = async (req, res) => {
  try {
    const token = req.header("authorization");
    if (!token) throw Error("no auth token provided");
    const decode = jwt.verify(token, config.secret);
    const user = decode.user;
    const userProfile = await Users.findById(user.id);
    res.status(200).json({ message: "user data", userProfile });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = userFunc;
