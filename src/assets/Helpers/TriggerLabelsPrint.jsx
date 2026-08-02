import React from "react";

function TriggerLabelsPrint(contentRef) {
  // Get the content
  const printContent = contentRef.current;
  if (!printContent) return;

  // Create a new window
  const printWindow = window.open("", "_blank", "width=1000,height=600");

  if (!printWindow) {
    alert("Please allow pop-ups for this site to enable printing");
    return;
  }

  // Get your CSS content (you'll need to include your actual CSS here)
//   const cssContent = `
//   <style>
// .product-card {
//   background-color: white;
//   border-radius: 6px;
//   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
//   border: 1px solid #e5e7eb;
//   overflow: hidden;
//   width: 98mm;
//   height: 48mm;
//   box-sizing: border-box;
//   display: flex;
//   flex-direction: column;
// }

// .product-card-content {
//   padding: 6px;
//   flex-grow: 1;
//   overflow: hidden;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// }

// .product-card-header {
//   background-color: #374151;
//   height: 2px;
//   flex-shrink: 0;
// }

// .product-card-brand-section,
// .product-card-description-section {
//   flex-shrink: 0;
// }

// .product-card-brand-section {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   margin-bottom: 4px;
// }

// .product-card-brand-info {
//   display: flex;
//   align-items: center;
//   gap: 3px;
// }

// .product-card-icon {
//   width: 18px;
//   height: 18px;
//   background-color: #374151;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-shrink: 0;
// }

// .product-card-icon-emoji {
//   color: white;
//   font-size: 8px;
// }

// .product-card-brand-name {
//   font-size: 8px;
//   font-weight: 600;
//   color: #4b5563;
//   text-transform: uppercase;
//   letter-spacing: 0.04em;
//   margin: 0;
//   word-break: break-word;
// }

// .product-card-category {
//   font-size: 10px;
//   color: #1f2937;
//   margin: 0;
//   word-break: break-word;
// }

// .product-card-date-badge {
//   background-color: #f9fafb;
//   border-radius: 4px;
//   border: 1px solid #e5e7eb;
//   padding: 4px 6px;
//   flex-shrink: 0;
// }

// .product-card-date-label {
//   font-size: 8px;
//   color: #6b7280;
//   margin: 0 0 1px 0;
// }

// .product-card-date-value {
//   font-size: 10px;
//   font-weight: 600;
//   color: #111827;
//   margin: 0;
// }

// .product-card-title {
//   font-size: 10px;
//   font-weight: bold;
//   color: #111827;
//   margin: 4px 0;
//   word-break: break-word;
//   flex-shrink: 0;
// }

// .product-card-section-title {
//   font-size: 8px;
//   font-weight: 600;
//   color: #374151;
//   margin: 0 0 2px 0;
//   text-transform: uppercase;
//   letter-spacing: 0.04em;
//   word-break: break-word;
// }

// .product-card-description {
//   color: #4b5563;
//   line-height: 1.3;
//   font-size: 8px;
//   margin: 0;
//   word-break: break-word;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   max-height: 2.7em; /* Approx 2-3 lines */
// }

// .product-card-sales-note {
//   background-color: #f9fafb;
//   border-radius: 4px;
//   border: 1px solid #e5e7eb;
//   padding: 6px;
//   flex-shrink: 0;
//   margin-top: 2px;
// }

// .product-card-sales-text {
//   color: #374151;
//   font-size: 9px;
//   margin: 0;
//   word-break: break-word;
// }

// .page-container,
// .page-content,
// .page-header,
// .products-grid {
//   display: block;
//   margin: 0;
//   padding: 0;
// }

// @media print {
//   @page {
//     size: 9.8cm 4.8cm;
//     margin: 0;
//   }

//   html, body {
//     margin: 0;
//     padding: 0;
//     -webkit-print-color-adjust: exact;
//     print-color-adjust: exact;
//   }

//   .print-container {
//     display: block !important;
//     margin: 0 !important;
//     padding: 0 !important;
//   }

//   .product-card {
//     width: 98mm !important;
//     height: 48mm !important;
//     margin: 0 !important;
//     padding: 0 !important;
//     page-break-before: auto;
//     page-break-after: always;
//     page-break-inside: avoid;
//     break-before: auto;
//     break-after: page;
//     break-inside: avoid;
//     box-sizing: border-box;
//     position: relative;
//     display: block !important;
//     background-color: white !important;
//     border: 1px solid #e5e7eb !important;
//     border-radius: 6px !important;
//     overflow: hidden !important;
//     min-height: 48mm !important;
//     max-height: 48mm !important;
//   }

//   .product-card:last-child {
//     page-break-after: avoid;
//     break-after: avoid;
//   }

//   .page-break {
//     page-break-after: always !important;
//     break-after: page !important;
//     height: 0 !important;
//     margin: 0 !important;
//     padding: 0 !important;
//     border: none !important;
//     visibility: hidden !important;
//   }

//   .product-card-header,
//   .product-card-icon,
//   .product-card-date-badge,
//   .product-card-sales-note {
//     -webkit-print-color-adjust: exact;
//     print-color-adjust: exact;
//   }

//   .product-card-header {
//     background-color: #374151 !important;
//   }

//   .product-card-icon {
//     background-color: #374151 !important;
//   }

//   .product-card-date-badge {
//     background-color: #f9fafb !important;
//     border: 1px solid #e5e7eb !important;
//   }

//   .product-card-sales-note {
//     background-color: #f9fafb !important;
//     border: 1px solid #e5e7eb !important;
//   }

//   .product-card-brand-name { color: #4b5563 !important; }
//   .product-card-category { color: #1f2937 !important; }
//   .product-card-title { color: #111827 !important; }
//   .product-card-section-title { color: #374151 !important; }
//   .product-card-description { color: #4b5563 !important; }
//   .product-card-sales-text { color: #374151 !important; }
//   .product-card-date-label { color: #6b7280 !important; }
//   .product-card-date-value { color: #111827 !important; }
//   .product-card-icon-emoji { color: white !important; }
// }
//   </style>
// `;
const cssContent=`
<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 11px;
  font-family: arial, sans-serif;
}
  .product-card {
  background-color: white;
  border-radius: 6px;
  overflow: hidden;
  width: 98mm !important;
  height: 48mm !important;
  box-sizing: border-box;
  border:"1px solid #000";
}

 @media print {
   @page {
     size: 9.8cm 4.8cm;
     margin: 0;
   }

   html, body {
     margin: 0;
     padding: 0;
     -webkit-print-color-adjust: exact;
     print-color-adjust: exact;
   }

   .print-container {
     display: block !important;
     margin: 0 !important;
     padding: 0 !important;
   }

   .product-card {
    //  width: 98mm !important;
    //  height: 48mm !important;
     page-break-before: auto;
     page-break-after: always;
     page-break-inside: avoid;
     break-before: auto;
     break-after: page;
     break-inside: avoid;
     box-sizing: border-box;
     position: relative;
     display: block !important;
     background-color: white !important;
     border-radius: 6px !important;
     overflow: hidden !important;
     min-height: 48mm !important;
     max-height: 48mm !important;
   }

   .product-card:last-child {
     page-break-after: avoid;
     break-after: avoid;
   }

   
 }
</style>`

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Labels</title>
      ${cssContent}
    </head>
    <body>
      ${printContent.innerHTML}
    </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for content to load, then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
}

export default TriggerLabelsPrint;
