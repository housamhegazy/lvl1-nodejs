// middleware/authMiddleware.js
//التحقق مما إذا كان المستخدم مسجل الدخول (Authenticated)
//  أم لا قبل السماح له بالوصول إلى مسارات أو موارد معينة في التطبيق.
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    // يمكنك هنا أيضًا جلب بيانات المستخدم كاملة إذا أردت
    // req.user = await User.findById(req.session.userId);
    next();
  } else {
    // req.flash('error_msg', 'الرجاء تسجيل الدخول أولا.'); // إذا كنت تستخدم connect-flash
    res.redirect("/login?message=الرجاء تسجيل الدخول أولا.");
  }
}

module.exports = isAuthenticated;
