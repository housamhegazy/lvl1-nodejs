const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//define the schema (structure of article)
const userSchema = new Schema(
  {
    firstName: {
      type:String,
      required:true
    },
    lastName: {
      type:String,
      required:true
    },
    email: {
      type:String,
      required:true
    },
    phoneNumber: {
      type:String,
      required:true
    },
    age: {
      type:Number,
      required:true
    },
    country: {
      type:String,
      required:true
    },
    gender: {
      type:String,
      required:true
    },
    // <--- الحقل الجديد: ربط الزبون بمعرف المستخدم
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // يربط هذا الحقل بـ 'User' Model
    },
  },

  { timestamps: true } // to know time => createdAt:2025-09-14T20:54:36.324+00:00 || updatedAt : 2025-09-14T20:54:36.324+00:00
);

// create modal based on the schema

const User = mongoose.model("customer", userSchema);

//export the modal

module.exports = User;
