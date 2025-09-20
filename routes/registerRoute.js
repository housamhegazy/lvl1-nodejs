const express = require('express')
const router = express.Router()
// <--- جديد: استيراد User Model
const User = require('../models/userSchema'); // تأكد من المسار الصحيح لملف userSchema.js


// مسار عرض صفحة تسجيل الدخول

router.get('/login', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/'); // إذا كان مسجل دخول، أعد توجيه للصفحة الرئيسية
    }
    res.render('login', { message: req.query.message || null });
});


// مسار معالجة تسجيل الدخول (POST)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.redirect('/login?message=البريد الإلكتروني أو كلمة المرور غير صحيحة.');
        }

        const isMatch = await user.comparePassword(password); // استخدام method المقارنة
        if (!isMatch) {
            return res.redirect('/login?message=البريد الإلكتروني أو كلمة المرور غير صحيحة.');
        }

        req.session.userId = user._id; // تخزين معرف المستخدم في الجلسة
        req.session.username = user.fullName; // تخزين الاسم الكامل
        res.redirect('/'); // تسجيل دخول ناجح
    } catch (err) {
        console.error('Login error:', err);
        res.redirect('/login?message=حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة لاحقا.');
    }
});


// مسار عرض صفحة تسجيل حساب جديد (Register)

router.get('/register', (req, res) => {
     if (req.session.userId) {
        return res.redirect('/'); // إذا كان مسجل دخول، أعد توجيه للصفحة الرئيسية
    }
    res.render('register', { message: req.query.message || null });
});


// مسار معالجة إنشاء حساب جديد (POST)
router.post('/register', async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.redirect('/register?message=كلمات المرور غير متطابقة.');
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.redirect('/register?message=هذا البريد الإلكتروني مسجل بالفعل.');
        }

        const newUser = new User({ fullName, email, password });
        await newUser.save();

        // تسجيل الدخول تلقائيًا بعد التسجيل
        req.session.userId = newUser._id;
        req.session.username = newUser.fullName;
        res.redirect('/'); // إعادة توجيه للصفحة الرئيسية أو لوحة التحكم
    } catch (err) {
        console.error('Registration error:', err);
        if (err.code === 11000) { // Duplicate key error (للتأكد من unique email)
            return res.redirect('/register?message=هذا البريد الإلكتروني مسجل بالفعل.');
        }
        res.redirect('/register?message=حدث خطأ أثناء التسجيل، يرجى المحاولة لاحقا.');
    }
});

// مسار تسجيل الخروج
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Could not log out.');
        }
        res.clearCookie('connect.sid'); // مسح الكوكيز
        res.redirect('/login?message=تم تسجيل الخروج بنجاح.');
    });
});

module.exports = router