import toast from "react-hot-toast";

export const handlePrint = (type, downloadedPdf) => {
  const printContent =
    document.getElementById("printable-rightbar") ||
    document.getElementById("printable-section");

  const logoUrl = "/images/logo.png";
  const currentDate = new Date().toLocaleDateString("en-GB");
  console.log(printContent);
  if (printContent || type === "empty") {
    const newWindow = window.open("", "", "width=900,height=600");
    if (type === "empty") {
      newWindow.document.write(`
        <html>
          <head>
            <style>
              body { margin: 20px; }
              .header { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 2px solid #000; margin-bottom: 20px; }
              .header .logo { width: 100px; }
              .header .date { font-size: 14px; color: #555; }
              .print-content,.printable-section { width: 800px; padding: 5px; }
              .e-toolbar{
                display: none !important;}
              .e-columnheader{
                width:780px !important;
                display:flex;
                justify-content: space-between;
                border:1px solid gray;
              }
                .e-columnheader td{
                  width:120px !important;
                }
                .e-content .e-table{
                width:780px!important;
               
                }
                .list-header{
                  border:1px solid gray;
                  width:780px !important;
                  padding:5px;
                }
                  ul li{
                    list-style-type: none;
                    padding:5px;
                  }
                    .preview{
                      display:flex !important;
                      gap:5px;
                      align-items: center;
                    }
                 .rowgroup {
                  width:90vw !important;
                  margin-bottom: 10px;
                display:flex !important;
                justify-content: space-between!important;
                
                
                }
                .list-item{
                  min-width:800px !important;
                  display:flex !important;
                  justify-content: space-between!important;
                }
                .helper-icons,.list-icons-conatainer{
                display:none;
                }                 
                .list-item .rows{
                width:120px !important;
                
                overflow: hidden !important;
             
                
               
                }
                .e-hide,.e-spin-hide{
                display: none !important;}
              .previewcontent {
                display: flex;
                padding: 0px 3px;
                gap: 5px;
                overflow-y: hidden;
                align-items: center;
                width: 80%;
                }
                .previewcontent h5 {
                font-size: 12px;
                width: 30%;
                }
                .previewcontent span {
                width: 10px;
                }
                .previewcontent p {
                color: var(--text-color-secondry);
                max-width: calc(100% - 30% - 20px);
                overflow: hidden;
                }
            </style>
          </head>
          <body>
            <div class="header">
                <img src="${logoUrl}" alt="Logo" class="logo" />  
                <div class="date">Date: ${currentDate}</div>
            </div>
            <div>

            <div style='display:flex;justify-content: space-between; align-items: center; padding-top: 5px; margin-bottom: 0; width:200px;'>
            <p>Name</p>
            <p>:</p>
            </div>
            
            <div style='display:flex;justify-content: space-between; align-items: center; padding-top: 5px; margin-bottom: 0; width:200px;'>
            <p>Mobile</p>
            <p>:</p>
            </div>

            <div style='display:flex;justify-content: space-between; align-items: center; padding-top: 5px; margin-bottom: 0; width:200px;'>
            <p>Second Mobile</p>
            <p>:</p>
            </div>

            <div style='display:flex;justify-content: space-between; align-items: center; padding-top: 5px; margin-bottom: 0; width:200px;'>
            <p>Land Number</p>
            <p>:</p>
            </div>

            <div style='display:flex;justify-content: space-between; align-items: center; padding-top: 5px; margin-bottom: 0; width:200px;'>
            <p>Attendance ID</p>
            <p>:</p>
            </div>

            <div style='display:flex;justify-content: space-between; align-items: center; padding-top: 5px; margin-bottom: 0; width:200px;'>
            <p>Email</p>
            <p>:</p>
            </div>

            <div style='display:flex;justify-content: space-between; align-items: center; padding-top: 5px; margin-bottom: 0; width:200px;'>
            <p>Work Email</p>
            <p>:</p>
            </div>

            <div style='display:flex;justify-content: space-between; align-items: center; padding-top: 5px; margin-bottom: 0; width:200px;'>
            <p>Location</p>
            <p>:</p>
            </div>

            <div style='display:flex;justify-content: space-between; align-items: center; padding-top: 5px; margin-bottom: 0; width:200px;'>
            <p>Job</p>
            <p>:</p>
            </div>

            <div style='display:flex;justify-content: space-between; align-items: center; padding-top: 5px; margin-bottom: 0; width:200px;'>
            <p>Department</p>
            <p>:</p>
            </div>

            <div style='display:flex;justify-content: space-between; align-items: center; padding-top: 5px; margin-bottom: 0; width:200px;'>
            <p>Address</p>
            <p>:</p>
            </div>

            <div style='display:flex;justify-content: space-between; align-items: center; padding-top: 5px; margin-bottom: 0; width:200px;'>
            <p>Social Status</p>
            <p>:</p>
            </div>

            <div style='display:flex;justify-content: space-between; align-items: center; padding-top: 5px; margin-bottom: 0; width:200px;'>
            <p>Birth Date</p>
            <p>:</p>
            </div>

            <div style='display:flex;justify-content: space-between; align-items: center; padding-top: 5px; margin-bottom: 0; width:200px;'>
            <p>Apply Date</p>
            <p>:</p>
            </div>
            </div>
          </body>
        </html>
      `);
    } else {
      newWindow.document.write(`
        <html>
          <head>
            <style>
              body { margin: 20px; }
              .header { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 2px solid #000; margin-bottom: 20px; }
              .header .logo { width: 100px; }
              .header .date { font-size: 14px; color: #555; }
              .print-content,.printable-section { width: 800px; padding: 5px; }
              .e-toolbar{
                display: none !important;}
              .e-columnheader{
                width:780px !important;
                display:flex;
                justify-content: space-between;
                border:1px solid gray;
              }
                .e-columnheader td{
                  width:120px !important;
                }
                .e-content .e-table{
                width:780px!important;
               
                }
                .list-header{
                  border:1px solid gray;
                  width:780px !important;
                  padding:5px;
                }
                  ul li{
                    list-style-type: none;
                    padding:5px;
                  }
                    .preview{
                      display:flex !important;
                      gap:5px;
                      align-items: center;
                    }
                 .rowgroup {
                  width:90vw !important;
                  margin-bottom: 10px;
                display:flex !important;
                justify-content: space-between!important;
                
                
                }
                .list-item{
                  min-width:800px !important;
                  display:flex !important;
                  justify-content: space-between!important;
                }
                .helper-icons,.list-icons-conatainer{
                display:none;
                }                 
                .list-item .rows{
                width:120px !important;
                
                overflow: hidden !important;
             
                
               
                }
                .e-hide,.e-spin-hide{
                display: none !important;}
              .previewcontent {
                display: flex;
                padding: 0px 3px;
                gap: 5px;
                overflow-y: hidden;
                align-items: center;
                width: 80%;
                }
                .previewcontent h5 {
                font-size: 12px;
                width: 30%;
                }
                .previewcontent span {
                width: 10px;
                }
                .previewcontent p {
                color: var(--text-color-secondry);
                max-width: calc(100% - 30% - 20px);
                overflow: hidden;
                }
            </style>
          </head>
          <body>
            <div class="header">
                <img src="${logoUrl}" alt="Logo" class="logo" />  
                <div class="date">Date: ${currentDate}</div>
            </div>
             <div class="print-content">${printContent.innerHTML}</div> 
          </body>
        </html>
      `);
    }
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
  } else if (downloadedPdf) {
    const pdfUrl = downloadedPdf.programUserDownloadItemsPath;
    const pdfWindow = window.open(pdfUrl, "_blank");

    pdfWindow.onload = () => {
      pdfWindow.focus();
      pdfWindow.print();
    };
  } else {
    toast.error("No printable content found.", { icon: "⚠️" });
  }
};
