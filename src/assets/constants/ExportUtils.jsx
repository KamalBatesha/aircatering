import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/**
 * Extracts a nested value from an object based on a dot-separated string path.
 * Example: resolveField(obj, "supplier.name")
 */
const resolveField = (obj, path) => {
  if (!path) return "";
  return path.split(".").reduce((o, i) => o?.[i], obj);
};

/**
 * Exports data to an Excel file.
 * @param {Array} data - The array of data objects.
 * @param {Array} columns - The array of column definitions ({ field, header }).
 * @param {String} fileName - The name of the downloaded file.
 */
export const exportToExcel = (data, columns, fileName = "Export") => {
  const exportData = data.map((row) => {
    const rowData = {};
    columns.forEach((col) => {
      const value = resolveField(row, col.field);
      rowData[col.header || col.field] = value !== undefined && value !== null ? String(value) : "";
    });
    return rowData;
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Exports data to a PDF file using jspdf-autotable.
 * @param {Array} data - The array of data objects.
 * @param {Array} columns - The array of column definitions ({ field, header }).
 * @param {String} fileName - The name of the downloaded file.
 */
export const exportToPDF = (data, columns, fileName = "Export") => {
  const doc = new jsPDF();

  const head = [columns.map((col) => col.header || col.field)];
  const body = data.map((row) => {
    return columns.map((col) => {
      const value = resolveField(row, col.field);
      return value !== undefined && value !== null ? String(value) : "";
    });
  });

  autoTable(doc, {
    head: head,
    body: body,
  });

  doc.save(`${fileName}.pdf`);
};

/**
 * Prints data by rendering it as an HTML table in a new window and triggering the print dialog.
 * @param {Array} data - The array of data objects.
 * @param {Array} columns - The array of column definitions ({ field, header }).
 * @param {String} fileName - The title of the print document.
 */
export const printList = (data, columns, fileName) => {
  let iframe = document.getElementById("print-iframe");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "print-iframe";
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);
  }

  const logoUrl = "/images/logo.png";
  const currentDate = new Date().toLocaleDateString("en-GB");

  const headersHtml = columns
    .map(
      (col) =>
        `<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">${col.header || col.field}</th>`
    )
    .join("");

  const rowsHtml = data
    .map((row) => {
      const cellsHtml = columns
        .map((col) => {
          const value = resolveField(row, col.field);
          return `<td style="border: 1px solid #ddd; padding: 8px;">${value !== undefined && value !== null ? String(value) : ""}</td>`;
        })
        .join("");
      return `<tr>${cellsHtml}</tr>`;
    })
    .join("");

  const iframeDoc = iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(`
    <html>
      <head>
        <title>${fileName ?? ""}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid #000; }
          .header .logo { width: 100px; }
          .header .date { font-size: 14px; color: #555; }
          h3 { text-align: center; margin-block: 10px;}
          table { width: 100%; border-collapse: collapse; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${logoUrl}" alt="Logo" class="logo" />  
          <div class="date">Date: ${currentDate}</div>
        </div>
        <h3>${fileName}</h3>
        <table>
          <thead>
            <tr>${headersHtml}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
    </html>
  `);

  iframeDoc.close();
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }, 250);
};
