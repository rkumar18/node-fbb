const { boolean } = require("joi");
const mongoose = require("mongoose");
const user = require("./User");
const requiredString = {
  type: String,
  required: true,
};
const postModel = new mongoose.Schema(
  {
    uploadPic: {
      path: requiredString,
      filename: requiredString,
    },
    title: requiredString,
    body: requiredString,
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


postModel.statics.findByName = function(name) {
  return this.find({ title: new RegExp(name, 'i') });
};

const post = mongoose.model("post", postModel);
module.exports = post;
