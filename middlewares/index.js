const middlewares = {};

middlewares.verifyToken = (req, res, next) => {
  const token = req.header("authorization");
  if (!token) throw Error("no auth token provided");
  try {
    const decode = jwt.verify(token, config.secret);
    req.user = decode.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized !" });
  }
};

module.exports = middlewares;
