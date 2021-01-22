const express = require("express");
const route = require("./routes");
const app = express();
const connect = require("./connection/connect");
const config = require("config");
connect();
app.use("/api", route);

app.get("/", (req, res, next) => res.end("Hello this is heroku app"));

app.listen(config.get("port") || process.env.PORT, () =>
  console.log(`fb-node listening on port ${config.get("port")}`)
);
