const express = require("express");
const app = express();
const port = 3000;
//هاستدعي ال مونجوز للربط بين مشروعي والداتابيز
const mongoose = require("mongoose");
//overide method حتى استطيع استخدام delete , put
const methodOverride = require("method-override");
// ✅ إضافة middleware لتحليل JSON (لـ PUT و POST مع fetch/JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//هنا بستدعي السكيما عشان احدد شكل البيانات اللي هارسلها او اعملها استدعاء من قاعدة البيانات
const UserModel = require("./models/customerSchema");
//use ejs to view my data
app.set("view engine", "ejs");
//link this page with public (css & images and javascript)
app.use(express.static("public"));
//import date and time func
const { format, formatDistanceToNow } = require("date-fns");

app.use(methodOverride("_method"));

//auto refresh
const path = require("path");
const livereload = require("livereload"); // استيراد وحدة livereload
const liveReloadServer = livereload.createServer(); // إنشاء سيرفر LiveReload

liveReloadServer.watch(path.join(__dirname, "public"));
const connectLivereload = require("connect-livereload"); // استيراد Middleware
app.use(connectLivereload());
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
//end livereload

//######################################
//get requists
//######################################
//get users in the home page from database
app.get("/", (req, res) => {
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
//go to another pages
app.get("/user/add.html", (req, res) => {
  res.render("user/add");
});

//OPEN edit user page
app.get("/edit/:id", (req, res) => {
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
app.get("/view/:id", (req, res) => {
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
//"/user/add.html" المسار ده لازم يكون نفس المسار اللي في الاكشن في الفورم
app.post("/user/add.html", (req, res) => {
  UserModel.create(req.body)
    .then((result) => {
      res.redirect("/user/add.html");
    })
    .catch((err) => {
      console.log(err);
    });
});

// UPDATE user (تحديث بيانات مستخدم)
app.put("/edit/:id", async (req, res) => {
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

app.delete("/edit/:id", async (req, res) => {
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
app.get("/search", (req, res) => {
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
//###################################### 
// link between my project and mongooDB
//######################################
mongoose
  .connect(
    "mongodb+srv://geohousam_db:sHSV85O1kMDD5njC@hegazystart2025.kx8h76l.mongodb.net/all-data?retryWrites=true&w=majority&appName=hegazystart2025"
  )
  .then(() => {
    //express
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
