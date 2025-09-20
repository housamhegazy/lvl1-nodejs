const express = require("express");
const app = express();
//process.env.PORT: ده معناه اللينك اللي هاحصل عليه من الموقع 
const port = process.env.PORT || 3000;
//هاستدعي ال مونجوز للربط بين مشروعي والداتابيز
const mongoose = require("mongoose");
//overide method حتى استطيع استخدام delete , put
const methodOverride = require("method-override");
const session = require('express-session');
// ليمنع انهاء الجلسه وتسجيل الخروج باستمرار عند تغيير اي كود اثناء تطوير الموقع 
const MongoStore = require('connect-mongo'); // <--- استيراد connect-mongo
const path = require("path");
const livereload = require("livereload"); // استيراد وحدة livereload  
const connectLivereload = require("connect-livereload"); // استيراد Middleware
// <--- استيراد Middleware التحقق
const isAuthenticated = require('./middleware/authMiddleware');
//get user informations in all site
const setLocals = require('./middleware/setLocals'); // <--- جديد: استيراد setLocals

// استدعاء كل ال routes
const allRoutes = require("./routes/allRoutes");
const addUserRoute = require("./routes/adduser");
const resgisterRoute = require("./routes/registerRoute")
// Middlewares
// ✅ إضافة middleware لتحليل JSON (لـ PUT و POST مع fetch/JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//import date and time func
app.use(methodOverride("_method"));
// إعداد express-session (يجب أن يكون هنا قبل أي مسارات تستخدم الجلسة)
app.use(session({
    secret: 'a_very_secret_key_for_your_app',
    resave: false,
    saveUninitialized: false,
     store: MongoStore.create({ // <--- جديد: تكوين مخزن الجلسات
        mongoUrl: "mongodb+srv://geohousam_db:sHSV85O1kMDD5njC@hegazystart2025.kx8h76l.mongodb.net/all-data?retryWrites=true&w=majority&appName=hegazystart2025",
        collectionName: 'sessions', // اسم الكولكشن الذي سيتم تخزين الجلسات فيه في MongoDB
        ttl: 1000 * 60 * 60 * 24 / 1000 // مدة صلاحية الجلسة بالثواني (يوم واحد)
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24  
    }
}));

app.use(setLocals);
//link this page with public (css & images and javascript)
app.use(express.static("public"));
//auto refresh

const liveReloadServer = livereload.createServer(); // إنشاء سيرفر LiveReload

liveReloadServer.watch(path.join(__dirname, "public"));

app.use(connectLivereload());
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
//end livereload

//use ejs to view my data
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'))

  // ربط الـ routers
// لاحظ أن isAuthenticated تم تمريرها للمسار الرئيسي
app.use("", allRoutes);
app.use("/user/add.html",isAuthenticated, addUserRoute);
app.use("",resgisterRoute)

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

