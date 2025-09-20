const { format, formatDistanceToNow } = require("date-fns");
const UserModel = require("../models/customerSchema");
const userSchema = require("../models/userSchema");

// -----------------------------------------------------------------
// مسار الصفحة الرئيسية (محمية)
// -----------------------------------------------------------------
// <--- تم تعديل المسار الرئيسي ليستخدم isAuthenticated
//users:any name - index:rendered file - get:used method

const customers_index_get = async (req, res) => {
  try {
    // 1.  لجلب الزبائن المسجله تحت اسم المستخدم يتم جلب معرف المستخدم المسجل دخوله من الجلسة
    const currentUserId = req.session.userId;
    //get all customers
    const customers = await UserModel.find({ owner: currentUserId }).sort({
      createdAt: -1,
    });

    // 3. تمرير كل هذه البيانات إلى قالب EJS
    res.render("index", {
      arr: customers, // قائمة الزبائن التي جلبتها للتو
      formatDistanceToNow: formatDistanceToNow,
      format: format,
    });
  } catch (err) {
    console.error("Error in customers_index_get:", err);
    res.status(500).send("Error loading data for home page.");
  }
};

const customers_edit_get = (req, res) => {
  // 1. جلب معرف المستخدم المسجل دخوله من الجلسة
  const currentUserId = req.session.userId;

  // 2. البحث عن الزبون بالاي دي والاونر اي دي
  // (يجب أن يكون المسار محميًا بـ isAuthenticated لضمان وجود req.session.userId)
  //first get user to mirror it to edit page (to use it whene delete or update data)
  UserModel.findOne({ _id: req.params.id, owner: currentUserId })
    .then((result) => {
      if (!result) {
        // إذا لم يتم العثور على الزبون أو إذا لم يكن المستخدم هو المالك
        return res
          .status(404)
          .send("Customer not found or you do not have permission to edit it.");
      }
      res.render("user/edit", {
        oneCustomer: result,
        // يمكنك أيضًا تمرير loggedInUsername إذا لم يكن متاحًا عبر res.locals
        // username: req.session.username
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const customers_view_get = (req, res) => {
  const currentUserId = req.session.userId;
  UserModel.findOne({ _id: req.params.id, owner: currentUserId })
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
};

const customersUpdate_edit_put = async (req, res) => {
  const currentUserId = req.session.userId;
  // <--- مسار تحديث المستخدم (يستخدم PUT)
  try {
    const { id } = req.params;
    const updateData = req.body; // البيانات المرسلة من الفورم في الواجهة الأمامية
    const updatedUser = await UserModel.findOneAndUpdate({ _id: req.params.id, owner: currentUserId }, updateData, {
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
};

const customers_delete = async (req, res) => {
  const currentUserId = req.session.userId;
  try {
    const deletedUser = await UserModel.findOneAndDelete({ _id: req.params.id, owner: currentUserId });
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
};

const customers_search_get = (req, res) => {
  const currentUserId = req.session.userId;
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
     owner: currentUserId 
  })
    .then((searchResults) => {
      res.render("user/search", { searchResults, searchValue }); // توجيه إلى الصفحة الجديدة
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error searching users");
    });
};

module.exports = {
  customers_index_get,
  customers_edit_get,
  customers_view_get,
  customersUpdate_edit_put,
  customers_delete,
  customers_search_get,
};
