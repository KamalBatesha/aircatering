import React from "react";

function TriggerEmployeeLabelsPrint(contentRef) {
  // Get the content
  const printContent = contentRef.current;
  if (!printContent) return;

  // Create a new window
  const printWindow = window.open("", "_blank", "width=1000,height=600");

  if (!printWindow) {
		alert("Please allow pop-ups for this site to enable printing");
    return;
  }

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

export default TriggerEmployeeLabelsPrint;
