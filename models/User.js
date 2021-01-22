const mongoose = require("mongoose");
const requiredString = {
  type: String,
  required: true,
};

const userModel = new mongoose.Schema({
  firstName: requiredString,
  lastName: requiredString,
  email: requiredString,
  password: requiredString,
  confirmPassword: requiredString,
  phone: requiredString,
  address: requiredString,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
});

const user = mongoose.model("user", userModel);
module.exports = user;
