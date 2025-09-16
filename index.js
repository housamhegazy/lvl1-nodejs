const express = require("express");
const app = express();
const port = 3000;
//هاستدعي ال مونجوز للربط بين مشروعي والداتابيز
const mongoose = require("mongoose");
//overide method
const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: true }));
//هنا بستدعي السكيما عشان احدد شكل البيانات اللي هارسلها او اعملها استدعاء من قاعدة البيانات
const UserModel = require("./models/customerSchema");
//use ejs to view my data
app.set("view engine", "ejs");
//link this page with public (css & images and javascript)
app.use(express.static("public"));
//import date and time func
const { format, formatDistance, subDays } = require("date-fns");

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
        formatDistance: formatDistance,
        subDays: subDays,
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
  //first get user to mirror it to edit page (to use it whene delete)
  UserModel.findById(req.params.id)
    .then((result) => {
      res.render("user/edit", {
        oneUser: result,
        formatDistance: formatDistance,
        subDays: subDays,
        format: format,
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
        formatDistance: formatDistance,
        subDays: subDays,
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
  const user = new UserModel(req.body);
  user
    .save()
    .then((result) => {
      res.redirect("/user/add.html");
    })
    .catch((err) => {
      console.log(err);
    });
});

//delete user
// app.delete("/edit/:id", (req, res) => {
//   UserModel.findByIdAndDelete(req.params.id)
//     .then(() => {
//       // res.redirect("/");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

app.delete("/edit/:id", async (req, res) => {

  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    // إرسال استجابة JSON بالنجاح بدلاً من res.redirect()
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
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
