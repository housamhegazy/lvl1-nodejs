const express = require('express')
const router = express.Router()
const { format, formatDistanceToNow } = require("date-fns");
const UserModel = require("../models/customerSchema");


//go to another pages
router.get("", (req, res) => {
  res.render("user/add");
});

//######################################
//post requists to database
//######################################
//"/user/add.html" المسار ده لازم يكون نفس المسار اللي في الاكشن في الفورم
router.post("", (req, res) => {
  UserModel.create(req.body)
    .then((result) => {
      res.redirect("/user/add.html");
    })
    .catch((err) => {
      console.log(err);
    });
});


module.exports = router