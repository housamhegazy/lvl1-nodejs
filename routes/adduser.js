const express = require('express')
const router = express.Router()
const { format, formatDistanceToNow } = require("date-fns");
const UserModel = require("../models/customerSchema");

//go to another pages
router.get("/user/add.html", (req, res) => {
  res.render("user/add");
});
//"/user/add.html" المسار ده لازم يكون نفس المسار اللي في الاكشن في الفورم
router.post("/user/add.html", (req, res) => {
  UserModel.create(req.body)
    .then((result) => {
      res.redirect("/user/add.html");
    })
    .catch((err) => {
      console.log(err);
    });
});


module.exports = router