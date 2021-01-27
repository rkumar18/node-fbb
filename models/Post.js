const { boolean } = require("joi");
const mongoose = require("mongoose");
const user = require("./User");
const requiredString = {
  type: String,
  required: true,
};
const postModel = new mongoose.Schema(
  {
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

const post = mongoose.model("post", postModel);
module.exports = post;
