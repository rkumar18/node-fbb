const Models = require("../models");
const { Users } = Models;
const jwt = require("jsonwebtoken");
const config = require("config");
const md5 = require("md5");
const sgMail = require("@sendgrid/mail");
const fromMail = config.get("fromEmail");
const AWS = require("aws-sdk");
const redis = require("redis");
const port_redis = 6379;
const client = redis.createClient(port_redis);
const fetch = require("node-fetch");
const setResponse = (username, repos) => {
  return `<h2>${username} has ${repos} Git repos</h2>`;
};

module.exports.profile = async (req, res) => {
  const token = req.header("authorization");
  if (!token) throw Error("no auth token provided");
  try {
    if (token) {
      try {
        const decode = jwt.verify(token, config.secret);
        const user = decode.user;
        const userProfile = await Users.findById(user.id);
        res.status(200).json({ message: "user data", userProfile });
      } catch (error) {
        // console.log("In Catch !!! ----->>>>", error.message);
        const refreshToken = req.header("refreshToken");
        const decodeUser = jwt.verify(refreshToken, config.get("refreshToken"));
        const key = decodeUser.id;
        console.log(key);

        // const accessToken = await getNewToken(key);
        getNewToken(key).then((accessToken) => {
          console.log("Hereeeeee", accessToken);
          const decode = jwt.verify(accessToken, config.get("secret"));
          const user = decode.user;
          Users.findById(user.id, (err, userData) => {
            if (err) return res.json({ message: err.message });
            res.status(200).json({ message: "new token ", userData });
          });
        });
      }
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getNewToken = async (userId) => {
  // try {
  const promise = new Promise((resolve, reject) => {
    let token;
    const key = userId;
    client.get(key, async (err, refresh_redis_token) => {
      if (err) throw Error(err.message);
      if (!refresh_redis_token) return { message: "Login Again !" };
      const decode = jwt.verify(
        refresh_redis_token,
        config.get("refreshToken")
      );
      const user = decode.user;
      await Users.findById(user.id, (err, _userProfile) => {
        if (err) throw new Error(err.message);
        if (user.id == _userProfile.id) {
          client.DEL(key);
          const payload = {
            user: { id: user.id },
          };
          const newToken = jwt.sign(payload, require("config").get("secret"), {
            expiresIn: "1m",
          });
          const _refreshToken = jwt.sign(
            payload,
            require("config").get("refreshToken"),
            {
              expiresIn: "5m",
            }
          );
          client.setex(key, 300, _refreshToken);
          console.log("Im running second", newToken); ///---------------------------new auth token
          token = newToken;
          resolve(newToken);
        }
      });
    });
  });

  return promise;
  // } catch (error) {
  //   return error.message;
  // }
};

module.exports.cacheMiddleware = (req, res, next) => {
  const { username } = req.params;
  client.get(username, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      return res.send(setResponse(username, data));
    }
    next();
  });
};

module.exports.register = async (req, res) => {
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

// module.exports.confirmEmail = async (req, res) => {
//   try {
//   } catch (error) {}
// };

module.exports.login = async (req, res) => {
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
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign(
      payload,
      require("config").get("refreshToken"),
      {
        expiresIn: "5m",
      }
    );
    const key = user.id;
    client.setex(key, 300, refreshToken);
    res
      .status(200)
      .header("refreshToken", refreshToken)
      .json({ message: "login successfully", data: { token, refreshToken } });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// ​
module.exports.github = async (req, res) => {
  try {
    console.log("Fetching ...");
    const { username } = req.params;
    const _ = await fetch(`https://api.github.com/users/${username}`);
    const data = await _.json();
    client.setex(username, 3600, data.public_repos);
    res.send(setResponse(username, data.public_repos));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.editProfile = async (req, res) => {
  try {
    if (req.body.password) throw Error("password not allowed");
    const token = req.header("authorization");
    if (!token) throw Error("no auth token provided");
    const decode = jwt.verify(token, config.secret);
    const user = decode.user;

    await Users.findOneAndUpdate({ _id: user.id }, req.body);
    res.status(200).json({ message: "user data" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports.sendEmail = async (req, res) => {
  try {
    const token = req.header("authorization");
    if (!token) throw Error("no auth token provided");
    const decode = jwt.verify(token, config.secret);
    const user = decode.user;
    const userData = await Users.findById(user.id);

    sgMail.setApiKey(
      "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"
    );
    const msg = {
      to: userData.email,
      from: fromMail,
      subject: "Confirm Email",
      html: "",
    };
    console.log(userData.email);
    const payload = {
      user: { id: user.id },
    };
    const emailToken = jwt.sign(payload, config.get("emailSecret"), {
      expiresIn: "10m",
    });

    let url = `http://localhost:3000/api/user/confirmEmail/:token`;
    msg.html = `<p><a href=${url}/${emailToken}><strong>Click here</strong></a> link for confirm email</p>`;

    sgMail.send(msg, (error, result) => {
      if (error) {
        console.log(error);
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        console.log(result);
        return res.status(200).json({
          success: true,
          message: "confirmation link send on your email",
          msg,
        });
      }
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports.confirmEmail = async (req, res) => {
  try {
    const token = req.header("authorization");
    if (!token) throw Error("no auth token provided");
    const decode = jwt.verify(token, config.secret);
    const user = decode.user;
    const link = req.params.token;
    const linkDecode = jwt.verify(link, config.get(""));
    const verifiedUser = await user.findOneAndUpdate(
      { _id: user.id },
      { isVerified: true }
    );

    res.status(200).json({ success: true, message: "you are verified user" });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

module.exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.header;
    jwt.verify(
      refreshToken,
      require("config").get("refreshToken"),
      (err, payload) => {
        if (err) throw error.message("token malware");
        const id = payload.id;
      }
    );
    const newRefreshToken = jwt.sign(
      id,
      require("config").get("refreshToken"),
      {
        expiresIn: "5m",
      }
    );

    res.status(200).json({ refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401);
  }
};
