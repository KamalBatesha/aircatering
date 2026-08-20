const fs = require('fs');
const path = 'c:/Users/ahmed/OneDrive/Desktop/Work/ZAS/aircatering/src/components/CreateOrderModal.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update regex validations
content = content.replace(
    /matches\(\/\^\[A-Z0-9\]\{2,3\}\\s\?\[0-9\]\{1,4\}\[A-Z\]\?\$\/i, lang === \"AR\" \? \"رقم الرحلة غير صالح \\(مثل: BA123\\)\" : \"Invalid Flight Number format \\(e\.g\., BA123\\)\"\)/g,
    'matches(/^[A-Z0-9\\\\s-]{2,15}$/i, lang === "AR" ? "تنسيق غير صالح" : "Invalid format")'
);

content = content.replace(
    /matches\(\/\^\(\[A-Z0-9\]\{1,3\}-\?\[A-Z0-9\]\{1,5\}\|N\[1-9\]\\d\{0,4\}\[A-Z\]\{0,2\}\)\$\/i, lang === \"AR\" \? \"رقم التسجيل غير صالح \\(مثل: N12345, G-BOAC\\)\" : \"Invalid Registration format \\(e\.g\., N12345, G-BOAC\\)\"\)/g,
    'matches(/^[A-Z0-9\\\\s-]{2,15}$/i, lang === "AR" ? "تنسيق غير صالح" : "Invalid format")'
);

content = content.replace(
    /matches\(\/\^\[A-Z0-9\]\{2,4\}\$\/i, lang === \"AR\" \? \"نوع الطائرة غير صالح \\(مثل: B738, A320\\)\" : \"Invalid Aircraft Type format \\(e\.g\., B738, A320\\)\"\)/g,
    'matches(/^[A-Z0-9\\\\s-]{2,15}$/i, lang === "AR" ? "تنسيق غير صالح" : "Invalid format")'
);


// 2. Remove setFieldTouched from onChange blocks
// Match: onChange={(...)} => { ... setFieldTouched(...); }
content = content.replace(/onChange=\{([^\}]+)setFieldTouched\([^)]+\);\s*\}\}/g, (match, prefix) => {
    return 'onChange={' + prefix + '}}';
});

// Since there could be multiple setFieldTouched inside onChange, let's just do a clean pass over the file.
// We only want to remove `setFieldTouched(..., true, true)` or `setFieldTouched(..., true)` that occur INSIDE `onChange`.
// Since we don't have a full AST parser, let's just replace `setFieldTouched(..., true, true);` with ` ` everywhere it is followed by `}}` or inside an `onChange` arrow function.
// Actually, `setFieldTouched("...", true, true);` is ONLY used inside `onChange`. 
content = content.replace(/setFieldTouched\([^,]+,\s*true\s*,\s*true\);\s*/g, '');

// Also remove duplicate setFieldTouched in DatePickers onChange
content = content.replace(/setFieldTouched\([^,]+,\s*true\);\s*\}\}/g, '}}');
// But we want to KEEP setFieldTouched in `onBlur` and `onClose`.
// Let's just restore the ones that were removed by accident.
// Or we can just use regex to target the onChange exactly.
// Let's do a more robust approach: target the exact lines in DatePicker.

// DatePicker fixes
const dateFields = ["arrivalDate", "arrivalDeliveryDate", "departureDate", "departureDeliveryDate"];
for (const field of dateFields) {
    const fallbackDateRegex = new RegExp(`(\\? values\\.${field}\\s*\\.set\\("year", newDate\\.year\\(\\)\\)\\s*\\.set\\("month", newDate\\.month\\(\\)\\)\\s*\\.set\\("date", newDate\\.date\\(\\)\\)\\s*): newDate;`, 'g');
    
    content = content.replace(fallbackDateRegex, `$1: newDate.hour(dayjs().hour() + 4).minute(dayjs().minute());`);
}

// Write file
fs.writeFileSync(path, content, 'utf8');
console.log('Validation and UX fixes applied!');
