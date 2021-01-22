const express = require("express");
const route = require("./routes");
const app = express();
const connect = require("./connection/connect");
const config = require("config");
connect();
app.use(express.json());
app.use("/api", route);

app.listen(config.get("port") || process.env.PORT, () =>
  console.log(`fb-node listening on port ${config.get("port")}`)
);
