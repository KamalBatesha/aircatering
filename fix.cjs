const fs = require('fs');

let content = fs.readFileSync('src/components/CreateOrderModal.jsx', 'utf8');

// 1. Remove FormObserver from CreateOrderModal.jsx
content = content.replace(/<FormObserver values=\{values\} touched=\{touched\} setTouched=\{setTouched\} setBankSelected=\{setIsBankSelected\} \/>/g, '');
const formObserverDef = /const FormObserver = \(\{ values, setBankSelected, touched, setTouched \}\) => \{[\s\S]*?return null;\n\};\n/g;
content = content.replace(formObserverDef, '');

// 2. Simple CustomLookup
content = content.replace(/onChange=\{\(val\) => setFieldValue\((['"])(.*?)(['"]), val\)\}/g, 'onChange={(val) => { setFieldValue($1$2$3, val); setFieldTouched($1$2$3, true, true); }}');

// 3. Simple input text
content = content.replace(/onChange=\{\(e\) => setFieldValue\((['"])(.*?)(['"]), e\.target\.value\)\}/g, 'onChange={(e) => { setFieldValue($1$2$3, e.target.value); setFieldTouched($1$2$3, true, true); }}');

// 4. FreeTextLookup (id, name)
content = content.replace(/onChange=\{\(id, name\) => \{\s*setFieldValue\((['"])(.*?)(['"]), id\);\s*setFieldValue\((['"])(.*?)(['"]), name\);\s*\}\}/g, 
`onChange={(id, name) => {
                                       setFieldValue($1$2$3, id);
                                       setFieldTouched($1$2$3, true, true);
                                       setFieldValue($4$5$6, name);
                                       setFieldTouched($4$5$6, true, true);
                                    }}`);

// 5. CustomLookup for station
content = content.replace(/onChange=\{\(val\) => \{\s*setFieldValue\("station", val\);\s*const found = stations\?\.find\(\s*\(s\) => s\.stationId === val,\s*\);\s*setFieldValue\("isStationHasVisa", !!found\?\.hasVisaPayment\);\s*if \(found\?\.stationDefualtPriceHeaderId\) \{\s*setFieldValue\(\s*"priceList",\s*found\.stationDefualtPriceHeaderId,\s*\);\s*\}\s*\}\}/g, 
`onChange={(val) => {
                                       setFieldValue("station", val);
                                       setFieldTouched("station", true, true);
                                       const found = stations?.find(
                                          (s) => s.stationId === val,
                                       );
                                       setFieldValue("isStationHasVisa", !!found?.hasVisaPayment);
                                       if (found?.stationDefualtPriceHeaderId) {
                                          setFieldValue(
                                             "priceList",
                                             found.stationDefualtPriceHeaderId,
                                          );
                                          setFieldTouched("priceList", true, true);
                                       }
                                    }}`);

// 6. orderHeaderFlightType
content = content.replace(/onChange=\{\(e\) => setFieldValue\("orderHeaderFlightType", e\.target\.value\)\}/g, 'onChange={(e) => { setFieldValue("orderHeaderFlightType", e.target.value); setFieldTouched("orderHeaderFlightType", true, true); }}');

// 7. Numeric pax fields
content = content.replace(/onChange=\{\(e\) => setFieldValue\((['"])(.*?)(['"]), Math\.max\(0, parseInt\(e\.target\.value\) \|\| 0\)\)\}/g, 'onChange={(e) => { setFieldValue($1$2$3, Math.max(0, parseInt(e.target.value) || 0)); setFieldTouched($1$2$3, true, true); }}');

// 8. Date fields inside the CustomDatePicker components.
// Instead of modifying the deep logic, I'll replace the exact calls.
content = content.replace(/setFieldValue\("arrivalDate", updated\);/g, 'setFieldValue("arrivalDate", updated);\n                                                   setFieldTouched("arrivalDate", true, true);');
content = content.replace(/setFieldValue\("departureDate", updated\);/g, 'setFieldValue("departureDate", updated);\n                                                   setFieldTouched("departureDate", true, true);');
content = content.replace(/setFieldValue\("arrivalDeliveryDate", updated\);/g, 'setFieldValue("arrivalDeliveryDate", updated);\n                                                   setFieldTouched("arrivalDeliveryDate", true, true);');
content = content.replace(/setFieldValue\("departureDeliveryDate", updated\);/g, 'setFieldValue("departureDeliveryDate", updated);\n                                                   setFieldTouched("departureDeliveryDate", true, true);');


fs.writeFileSync('src/components/CreateOrderModal.jsx', content);
