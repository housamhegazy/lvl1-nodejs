// middleware/setLocals.js
const User = require('../models/userSchema'); // استيراد User Model إذا كنت تريد جلب كامل بيانات المستخدم

async function setLocals(req, res, next) {
    // إذا كان هناك معرف مستخدم في الجلسة
    if (req.session.userId) {
        // قم بتخزين معرف المستخدم واسمه في res.locals
        // هذا سيجعله متاحًا تلقائيًا في جميع ملفات EJS
        res.locals.loggedInUserId = req.session.userId;
        res.locals.loggedInUsername = req.session.username;

        // (اختياري) يمكنك جلب كائن المستخدم الكامل من قاعدة البيانات إذا احتجت إليه
        // User.findById(req.session.userId).then(user => {
        //     res.locals.loggedInUser = user; // سيكون متاحًا كـ loggedInUser في EJS
        //     next();
        // }).catch(err => {
        //     console.error("Error fetching user for locals:", err);
        //     res.locals.loggedInUser = null; // في حالة الخطأ، لا تضع المستخدم
        //     next();
        // });
        next();
    } else {
        // إذا لم يكن هناك مستخدم مسجل دخول، قم بتعيينهم على null
        res.locals.loggedInUserId = null;
        res.locals.loggedInUsername = null;
        res.locals.loggedInUser = null;
        next();
    }
}

module.exports = setLocals;