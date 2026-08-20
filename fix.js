const fs = require('fs');
const path = 'c:/Users/ahmed/OneDrive/Desktop/Work/ZAS/aircatering/src/components/CreateOrderModal.jsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/setFieldTouched\(([^,]+),\s*true,\s*false\)/g, 'setFieldTouched($1, true)');
fs.writeFileSync(path, content);
console.log('Fixed file.');
