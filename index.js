const express = require("express");
const app = express();
//process.env.PORT: ده معناه اللينك اللي هاحصل عليه من الموقع 
const port = process.env.PORT || 3000;
//هاستدعي ال مونجوز للربط بين مشروعي والداتابيز
const mongoose = require("mongoose");
//overide method حتى استطيع استخدام delete , put
const methodOverride = require("method-override");
// ✅ إضافة middleware لتحليل JSON (لـ PUT و POST مع fetch/JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//هنا بستدعي السكيما عشان احدد شكل البيانات اللي هارسلها او اعملها استدعاء من قاعدة البيانات
const allRoutes = require("./routes/allRoutes");
const addUserRoute = require("./routes/adduser");
//use ejs to view my data
app.set("view engine", "ejs");
//link this page with public (css & images and javascript)
app.use(express.static("public"));
//import date and time func
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

app.use("", allRoutes);
app.use("/user/add.html", addUserRoute);
