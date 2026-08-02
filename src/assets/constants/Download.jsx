import { QueryClient } from "@tanstack/react-query";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

import { AddToDownloads } from "../Api/Layout/LayoutAPI";

const createPDFContentDiv = (content) => {
  const logoUrl = "/images/logo.png";
  const currentDate = new Date().toLocaleDateString();

  return `
    <html>
      <head>
        <style>
          body { margin: 20px; font-family: Arial, sans-serif; min-width: 790px; }
          .header { width:95%; display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 2px solid #000; }
          .header .logo { width: 100px; }
          .header .date { font-size: 14px; color: #555; }
          .print-content { width: 800px; padding: 5px; margin-top: 20px; }
          .previewcontent {
            display: flex;
            padding: 0px 3px;
            gap: 5px;
            overflow-y: hidden;
            align-items: center;
            width: 100%;
            height: 35px;
          }
          .previewcontent h5 {
            font-size: 12px;
            width: 30%;
          }
          .previewcontent span {
            width: 10px;
          }
          .previewcontent p {
            color: #777;
            max-width: calc(100% - 30% - 20px);
            
            text-overflow: ellipsis;
            height: 20px;
            white-space: nowrap;
          }
        </style>
      </head>
      <body>
        <div class="header" >
          <img src="${logoUrl}" alt="Logo" class="logo" />
          <div class="date">Date: ${currentDate}</div>
        </div>
        <div class="print-content">${content}</div>
      </body>
    </html>
  `;
};

export const handleDownloadPDF = async (name) => {
  const contentElement =
    document.getElementById("printable-rightbar") ||
    document.getElementById("printable-section");
  const queryClient = new QueryClient();
  if (!contentElement) {
    toast.error("No printable content found.", { icon: "⚠️", id: 1 });
    return;
  }

  try {
    toast.loading("Generating PDF...", { id: 1 });

    const htmlContent = createPDFContentDiv(contentElement.innerHTML);

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // iframe.onload = async () => {
    //   const canvas = await html2canvas(iframeDoc.body, {
    //     scale: 2,
    //     useCORS: true,
    //   });

    //   const imgData = canvas.toDataURL("image/png");
    //   const doc = new jsPDF("p", "mm", "a4");

    //   const imgWidth = 210;
    //   const pageHeight = 295;
    //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   let heightLeft = imgHeight;

    //   let position = 0;

    //   doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    //   heightLeft -= pageHeight;

    //   while (heightLeft >= 0) {
    //     position -= pageHeight;
    //     doc.addPage();
    //     doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    //     heightLeft -= pageHeight;
    //   }

    //   // doc.save("pdf_name.pdf");
    //   const timestamp = Date.now();
    //   const fileName = `${name}_${timestamp}.pdf`;

    //   const pdfBlob = doc.output("blob");

    //   const formData = new FormData();
    //   formData.append("formFile", pdfBlob, fileName);
    //   formData.append("FileName", fileName);
    //   //console.log(formData.get("formFile"));

    //   AddToDownloads(formData)
    //     .then((res) => {
    //       toast.success("PDF generated successfully.", { icon: "✅", id: 1 });
    //       queryClient.invalidateQueries(["Downloads"]);
    //     })
    //     .catch((err) => {
    //       toast.error("Failed to generate PDF.", { icon: "❌", id: 1 });
    //     });
    // };
    iframe.onload = async () => {
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 1.5, // reduced scale for smaller file size
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.7); // use JPEG with compression
      const doc = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      doc.addImage(
        imgData,
        "JPEG",
        0,
        position,
        imgWidth,
        imgHeight,
        "",
        "FAST"
      ); // 'FAST' compression mode
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position -= pageHeight;
        doc.addPage();
        doc.addImage(
          imgData,
          "JPEG",
          0,
          position,
          imgWidth,
          imgHeight,
          "",
          "FAST"
        );
        heightLeft -= pageHeight;
      }

      const timestamp = Date.now();
      const fileName = `${name}_${timestamp}.pdf`;

      const pdfBlob = doc.output("blob");

      const formData = new FormData();
      formData.append("formFile", pdfBlob, fileName);
      formData.append("FileName", fileName);

      AddToDownloads(formData)
        .then((res) => {
          toast.success("PDF generated successfully.", { icon: "✅", id: 1 });
          queryClient.invalidateQueries(["Downloads"]);
        })
        .catch((err) => {
          toast.error("Failed to generate PDF.", { icon: "❌", id: 1 });
        });
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF.", { icon: "❌", id: 1 });
  }
};
