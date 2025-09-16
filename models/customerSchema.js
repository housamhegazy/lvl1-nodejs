const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//define the schema (structure of article)
const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    age: Number,
    country: String,
    gender: String,
  },
  { timestamps: true } // to know time => createdAt:2025-09-14T20:54:36.324+00:00 || updatedAt : 2025-09-14T20:54:36.324+00:00
);

// create modal based on the schema

const User = mongoose.model("customer", userSchema);

//export the modal

module.exports = User;
