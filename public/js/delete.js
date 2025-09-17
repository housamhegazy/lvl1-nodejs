export async function deleteUser(userId){
  console.log("done");
  if (confirm("هل أنت متأكد من حذف هذا العميل؟")) {
    try {
      const response = await fetch(`/edit/${userId}`, {
        // الرابط هنا يجب أن يطابق مسار DELETE في الخادم
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json(); // توقع استجابة JSON
        alert(result.message || "Customer deleted successfully!");
        window.location.href = "/"; // أعد توجيه المستخدم إلى الصفحة الرئيسية بعد النجاح
      } else {
        const error = await response.json();
        alert(`فشل حذف العميل: ${error.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Network error or unexpected issue:", error);
      alert("حدث خطأ أثناء محاولة حذف العميل. يرجى المحاولة مرة أخرى.");
    }
  }
};
