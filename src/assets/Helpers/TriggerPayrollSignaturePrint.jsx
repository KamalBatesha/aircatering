function TriggerPayrollSignaturePrint(contentRef) {
  // Get the content
  const printContent = contentRef.current;
  if (!printContent) return;

  // Create a new window
  const printWindow = window.open("", "_blank", "width=1000,height=600");

  if (!printWindow) {
    alert("Please allow pop-ups for this site to enable printing");
    return;
  }

  const cssContent = `
<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: arial, sans-serif;
}

body {
  direction: ltr;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
}

th, td {
  border: 1px solid #000;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

@media print {
  @page {
    size: A4 landscape;
    margin-block: 10mm;
  }

  html, body {
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  table {
    page-break-inside: auto;
  }

  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  th {
    background-color: #f5f5f5 !important;
  }
}
</style>`;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payroll Signature</title>
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

export default TriggerPayrollSignaturePrint;
