const express = require('express')
const router = express.Router()
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
   // 1. جلب معرف المستخدم من الجلسة
  const ownerId = req.session.userId; 

  // 2. دمج معرف المستخدم مع بيانات النموذج
  const newCustomerData = { ...req.body, owner: ownerId }; 
  UserModel.create(newCustomerData)
    .then((result) => {
      res.redirect("/user/add.html");
    })
    .catch((err) => {
      console.log(err);
    });
});


module.exports = router