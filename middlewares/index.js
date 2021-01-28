const config = require("config");
const jwt = require("jsonwebtoken");
const middlewares = {};

middlewares.verifyToken = (req, res, next) => {
  const token = req.header("authorization");
  if (!token) throw Error("no auth token provided");
  try {
    const decode = jwt.verify(token, config.get("secret"));
    req.user = decode.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized !" });
  }
};

// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const msg = {
//   to: "rkrrko3@gmail.com", // Change to your recipient
//   from: "rohitkumar@apptunix.com", // Change to your verified sender
//   subject: "Sending with SendGrid is Fun",
//   text: "and easy to do anywhere, even with Node.js",
//   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// };

// sgMail
//   .send(msg)
//   .then(() => {
//     console.log("Email sent");
//   })
//   .catch((error) => {
//     console.error(error);
//   });

module.exports = middlewares;
