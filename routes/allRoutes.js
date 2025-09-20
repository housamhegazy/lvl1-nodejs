const express = require('express')
const router = express.Router()
const userController = require("../controller/userController")
const isAuthenticated = require('../middleware/authMiddleware'); // <--- استيراد isAuthenticated


//######################################
//get requists
//######################################



//get users in the home page from database
router.get("/",isAuthenticated,userController.customers_index_get);


//OPEN edit user page
router.get("/edit/:id",isAuthenticated,userController.customers_edit_get);

//get only one user
router.get("/view/:id", isAuthenticated,userController.customers_view_get);



// UPDATE user (تحديث بيانات مستخدم)
router.put("/edit/:id",isAuthenticated, userController.customersUpdate_edit_put);

//delete user

router.delete("/edit/:id",isAuthenticated, userController.customers_delete);

//search
// في index.js، أضف هذا بعد الـ GET routes
router.get("/search",isAuthenticated, userController.customers_search_get);

module.exports = router