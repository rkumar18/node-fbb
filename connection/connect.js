const mongoose = require("mongoose");
var connect = async function () {
  try {
    await mongoose.connect(
      "mongodb+srv://rohit:1230@cluster0.erapo.mongodb.net/testdata?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      }
    );
    console.log("DB Connect Successfully !!");
  } catch (err) {
    return console.log(err);
  }
};
module.exports = connect;
