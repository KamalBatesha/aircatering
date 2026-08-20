const fs = require('fs');
const path = 'c:/Users/ahmed/OneDrive/Desktop/Work/ZAS/aircatering/src/components/Menu.jsx';
let content = fs.readFileSync(path, 'utf8');

let newContent = content;

if (!newContent.includes('isGuestSubmitted = !user')) {
    newContent = newContent.replace(/const user = useAuthStore\(\(state\) => state\.user\);/, 'const user = useAuthStore((state) => state.user);\n  const isGuestSubmitted = !user && !!localStorage.getItem("GUEST_SUBMITTED_ORDER");');
}

const addItemsRegex = /function handleAddItems\(item, qty\) \{/;
newContent = newContent.replace(addItemsRegex, 'function handleAddItems(item, qty) {\n    if (isGuestSubmitted) {\n      onlineOrderToast.error(lang === "AR" ? "لا يمكن تعديل الطلب بعد إرساله" : "Cannot modify order after sending");\n      return;\n    }');

fs.writeFileSync(path, newContent, 'utf8');
console.log('Menu.jsx updated with add block');
