const express = require("express");
const app = express();
const port = 3000;
//هاستدعي ال مونجوز للربط بين مشروعي والداتابيز
const mongoose = require("mongoose");

app.use(express.urlencoded({ extended: true }));
//هنا بستدعي السكيما عشان احدد شكل البيانات اللي هارسلها او اعملها استدعاء من قاعدة البيانات
const UserModel = require("./models/customerSchema");
//use ejs to view my data
app.set("view engine", "ejs");
//link this page with public (css & images and javascript)
app.use(express.static("public"));

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
//get data in the home page from database
app.get("/", async (req, res) => {
  UserModel.find()
    .then((result) => {
      res.render("index", { arr: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
//go to another pages
app.get("/user/add.html", (req, res) => {
  res.render("user/add");
});

app.get("/user/view.html", (req, res) => {
  res.render("user/view");
});

app.get("/user/edit.html", (req, res) => {
  res.render("user/edit");
});

//######################################
//post requists to database
//######################################
//"/user/add.html" المسار ده لازم يكون نفس المسار اللي في الاكشن في الفورم
app.post("/user/add.html", (req, res) => {
  console.log(req.body);
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
