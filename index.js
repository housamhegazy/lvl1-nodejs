const express = require("express");
const app = express();
const port = 3000;
//هاستدعي ال مونجوز للربط بين مشروعي والداتابيز
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
//mydata is the file of data in mongoo database
const Mydata = require("./models/myDataSchema");
//use ejs to view my data
app.set("view engine", "ejs");
//link this page with public (css & images and javascript)
app.use(express.static('public'))

//auto refresh
// 1. استيراد وحدة 'path' للتعامل مع مسارات الملفات
const path = require("path");

// 2. استيراد وتكوين LiveReload Server
const livereload = require("livereload"); // استيراد وحدة livereload
const liveReloadServer = livereload.createServer(); // إنشاء سيرفر LiveReload

// 3. تحديد مجلدات للمراقبة
// liveReloadServer.watch() تخبر LiveReload بمراقبة التغييرات في المجلد المحدد.
// path.join(__dirname, 'public') يبني مسارًا مطلقًا لمجلد 'public'
// بحيث يتم تحديث المتصفح عندما تتغير أي ملفات داخل هذا المجلد (مثل HTML، CSS، JS).
liveReloadServer.watch(path.join(__dirname, 'public'));

// 4. استيراد وتكوين Middleware لربط Express بـ LiveReload
const connectLivereload = require("connect-livereload"); // استيراد Middleware
// app.use(connectLivereload()) يضيف Middleware إلى تطبيق Express الخاص بك.
// هذا Middleware يقوم بحقن شفرة JavaScript صغيرة في صفحاتك لتوصيل المتصفح
// بسيرفر LiveReload، مما يسمح بالتحديثات التلقائية.
app.use(connectLivereload());

// 5. تحديث المتصفح عند الاتصال الأولي (لتجنب مشاكل التخزين المؤقت)
// liveReloadServer.server.once("connection", ...) يستمع لحدث الاتصال الأول بسيرفر LiveReload.
// setTimeout(...) يؤخر عملية التحديث قليلاً (100 مللي ثانية)
// livereloadServer.refresh("/") يطلب من سيرفر LiveReload تحديث المسار الجذر ("/") في المتصفحات المتصلة.
// هذا يضمن أن يتم تحديث الصفحة فورًا بمجرد اتصال LiveReload.
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

//end livereload


//######################################
//go to index.ejs page
//######################################
app.get("/", (req, res) => {
    res.render("index");
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
