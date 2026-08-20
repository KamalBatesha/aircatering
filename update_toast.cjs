const fs = require('fs');
const path = 'c:/Users/ahmed/OneDrive/Desktop/Work/ZAS/aircatering/src/components/CreateOrderModal.jsx';
let content = fs.readFileSync(path, 'utf8');

const oldOnError = /onError: \(\w+\) => \{[\s\S]*?actions\.setSubmitting\(false\);\s*\}/m;

const newOnError = `onError: (error) => {
                  const errorMsg = error?.response?.data?.message?.toLowerCase() || "";
                  console.log("error", errorMsg);
                  if (errorMsg === "email already registered") { onlineOrderToast.error(lang == "EN" ? "email is already registered" : "البريد الإلكتروني مسجل بالفعل", { id: "creatingOrder" }); }
                  else if (errorMsg === "mobile number already registered.") { onlineOrderToast.error(lang == "EN" ? "mobile number is already registered" : "رقم الهاتف مسجل بالفعل", { id: "creatingOrder" }); }
                  else if (errorMsg === "company website already registered.") { onlineOrderToast.error(lang == "EN" ? "company website is already registered" : "الموقع الإلكتروني مسجل بالفعل", { id: "creatingOrder" }); }
                  else if (errorMsg.includes("you have already registered and placed an order with us")) { 
                      onlineOrderToast.error(
                          lang == "EN" 
                              ? "You have already registered and placed an order with us. Please log in to your account to access your order details." 
                              : "لقد قمت بالتسجيل مسبقاً وطلب أوردر معنا. يرجى تسجيل الدخول إلى حسابك للوصول إلى تفاصيل طلبك.", 
                          { id: "creatingOrder", duration: 30000 }
                      ); 
                  }
                  else { onlineOrderToast.error(lang == "EN" ? (error?.response?.data?.message || "Failed to send request") : "فشل إرسال الطلب", { id: "creatingOrder" }); }
                  actions.setSubmitting(false);
               }`;

if (oldOnError.test(content)) {
    content = content.replace(oldOnError, newOnError);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully updated onError');
} else {
    console.log('Could not find onError');
}
