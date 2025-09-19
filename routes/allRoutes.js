const express = require('express')
const router = express.Router()
const userController = require("../controller/userController")

// middleware that is specific to this router

//######################################
//get requists
//######################################
//get users in the home page from database
router.get("/", userController.users_index_get);


//OPEN edit user page
router.get("/edit/:id",userController.user_edit_get);

//get only one user
router.get("/view/:id", userController.user_view_get);



// UPDATE user (تحديث بيانات مستخدم)
router.put("/edit/:id", userController.userUpdate_edit_put);

//delete user

router.delete("/edit/:id", userController.user_delete);

//search
// في index.js، أضف هذا بعد الـ GET routes
router.get("/search", userController.user_search_get);

module.exports = router