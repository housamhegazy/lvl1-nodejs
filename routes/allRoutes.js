const express = require('express')
const router = express.Router()
const { format, formatDistanceToNow } = require("date-fns");
const UserModel = require("../models/customerSchema");

// middleware that is specific to this router

//######################################
//get requists
//######################################
//get users in the home page from database
router.get("/", (req, res) => {
  UserModel.find()
    .then((result) => {
      res.render("index", {
        arr: result,
        formatDistanceToNow: formatDistanceToNow,
        format: format,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});


//OPEN edit user page
router.get("/edit/:id", (req, res) => {
  //first get user to mirror it to edit page (to use it whene delete or update data)
  UserModel.findById(req.params.id)
    .then((result) => {
      res.render("user/edit", {
        oneUser: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//get only one user
router.get("/view/:id", (req, res) => {
  UserModel.findById(req.params.id)
    .then((result) => {
      res.render("user/view", {
        oneUser: result,
        formatDistanceToNow: formatDistanceToNow,
        format: format,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//######################################
//post requists to database
//######################################


// UPDATE user (تحديث بيانات مستخدم)
router.put("/edit/:id", async (req, res) => {
  // <--- مسار تحديث المستخدم (يستخدم PUT)
  try {
    const { id } = req.params;
    const updateData = req.body; // البيانات المرسلة من الفورم في الواجهة الأمامية
    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }); // new: true لإرجاع المستند المحدث، runValidators: true لتشغيل validations

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err.message);
    // ✅ أضف response في catch لتجنب تعليق الطلب
    res.status(500).json({ message: "Server error during update" });
  }
});

//delete user

router.delete("/edit/:id", async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // إرسال استجابة JSON بالنجاح بدلاً من res.redirect()
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid User ID format" });
    }
    res.status(500).json({ message: "Server Error" });
  }
});

//search
// في index.js، أضف هذا بعد الـ GET routes
router.get("/search", (req, res) => {
  const searchValue = req.query.searchname.trim(); // الحصول على قيمة البحث من استعلام URL
  if (!searchValue) {
    // إذا لم يكن هناك استعلام، ارجع إلى الصفحة الرئيسية
    return res.redirect("/");
  }

  // البحث عن المستخدمين بناءً على الاسم أو البريد الإلكتروني
  // $or mongoo db operators 
  UserModel.find({
    $or: [
      { firstName: { $regex: searchValue, $options: "i" } },
      { lastName: { $regex: searchValue, $options: "i" } },
      { email: { $regex: searchValue, $options: "i" } },
      { phoneNumber: { $regex: searchValue, $options: "i" } },
      { country: { $regex: searchValue, $options: "i" } },
    ],
  })
    .then((searchResults) => {
      res.render("user/search", { searchResults, searchValue }); // توجيه إلى الصفحة الجديدة
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error searching users");
    });
});


module.exports = router