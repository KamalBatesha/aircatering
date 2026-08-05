const fs = require('fs');
let code = fs.readFileSync('e:/work/New folder/airCatering/src/components/CreateOrderModal.jsx', 'utf8');

// The goal is to copy the sx block from slotProps.textField to the top-level of DatePicker/TimePicker
// We can just add it right after <DatePicker or <TimePicker

code = code.replace(/<(DatePicker|TimePicker)([^>]*)>([\s\S]*?)slotProps=\{\{\s*textField:\s*\{\s*size:\s*"small",\s*fullWidth:\s*true,\s*error:\s*([^,]+),\s*sx:\s*\{\s*backgroundColor:\s*([^,]+),\s*"&\s*\.MuiOutlinedInput-root":\s*\{\s*borderRadius:\s*"50px",\s*height:\s*"30px",\s*fontSize:\s*"12px",\s*"&\s*fieldset":\s*\{\s*borderRadius:\s*"50px"\s*\}\s*\}\s*\},?\s*\}\s*\}\}/g, 
function(match, p1, p2, p3, errorBlock, bgBlock) {
    return "<" + p1 + p2 + " sx={{ backgroundColor: " + bgBlock + ", '& .MuiOutlinedInput-root': { borderRadius: '50px', height: '30px', fontSize: '12px', '& fieldset': { borderRadius: '50px' } } }} >" + p3 + "slotProps={{ textField: { size: 'small', fullWidth: true, error: " + errorBlock + " } }}";
});

fs.writeFileSync('e:/work/New folder/airCatering/src/components/CreateOrderModal.jsx', code);
