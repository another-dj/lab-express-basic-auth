"use strict";

const mongoose = require("mongoose");
//const Schema = mongoose.schema;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  hashpassword: {
    type: String,
    required: true
  },
  name: {
    type: String
  }
});

const user = mongoose.model("User", userSchema);
module.exports = user;
