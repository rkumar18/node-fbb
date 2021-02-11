const express = require("express");
const route = require("./routes");
const app = express();
const connect = require("./connection/connect");
const config = require("config");
const Sentry = require("@sentry/node"); 
const Tracing = require("@sentry/tracing");
connect();
app.use(express.json());
app.use("/api", route);

Sentry.init({
  dsn: "https://6997bb3efc054dcf9a3e146f2250a01d@o422863.ingest.sentry.io/5632840",
  tracesSampleRate: 1.0,
});




const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});

setTimeout(() => {
  try {
    foo();
  } catch (e) {
    Sentry.captureException(e);
  } finally {
    transaction.finish();
  }
}, 99);

app.listen(config.get("port") || process.env.PORT, () =>
  console.log(`fb-node listening on port ${config.get("port")}`)
);
