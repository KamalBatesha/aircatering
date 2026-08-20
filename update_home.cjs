const fs = require('fs');
const path = 'c:/Users/ahmed/OneDrive/Desktop/Work/ZAS/aircatering/src/pages/home/Home.jsx';
let content = fs.readFileSync(path, 'utf8');

const regexUseAuthStore = /const user = useAuthStore\(\(state\) => state\.user\);/;
if (regexUseAuthStore.test(content) && !content.includes('isGuestSubmitted')) {
    content = content.replace(regexUseAuthStore, 'const user = useAuthStore((state) => state.user);\n  const isGuestSubmitted = !user && !!localStorage.getItem("GUEST_SUBMITTED_ORDER");');
    
    // Disable delete button
    content = content.replace(/disabled=\{user && deleteMutation\.isPending && deleteMutation\.variables == item\.orderDetailsId\}/g, 'disabled={isGuestSubmitted || (user && deleteMutation.isPending && deleteMutation.variables == item.orderDetailsId)}');
    
    // Change Send Order Request button text
    const regexSendOrderButtonText = /\{lang === 'AR' \? 'أرسل طلب' : 'Send Order Request'\}/g;
    content = content.replace(regexSendOrderButtonText, '{isGuestSubmitted ? (lang === "AR" ? "عرض الطلب المرسل" : "View Sent Order") : (lang === "AR" ? "أرسل طلب" : "Send Order Request")}');

    fs.writeFileSync(path, content, 'utf8');
    console.log('Home.jsx updated');
} else {
    console.log('Could not update Home.jsx');
}
