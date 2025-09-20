// models/userSchema.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // لاستخدام bcrypt لتشفير كلمات المرور

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true // إزالة المسافات البيضاء من البداية والنهاية
    },
    email: {
        type: String,
        required: true,
        unique: true, // يجب أن يكون البريد الإلكتروني فريدًا
        lowercase: true, // تخزين البريد الإلكتروني بأحرف صغيرة
        trim: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'] // التحقق من تنسيق البريد الإلكتروني
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // حد أدنى لطول كلمة المرور
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware لـ Mongoose: تشفير كلمة المرور قبل حفظ المستخدم
// 'pre' hook يتم تشغيله قبل عملية save
userSchema.pre('save', async function(next) {
    // فقط قم بتشفير كلمة المرور إذا تم تعديلها أو كانت جديدة
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10); // توليد salt (عدد مرات التشفير)
        this.password = await bcrypt.hash(this.password, salt); // تشفير كلمة المرور
        next();
    } catch (err) {
        next(err); // تمرير الخطأ إلى next middleware
    }
});

// إضافة method لمقارنة كلمة المرور المدخلة بكلمة المرور المشفرة
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;