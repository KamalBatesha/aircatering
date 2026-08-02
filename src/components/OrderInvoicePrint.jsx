import React, { useRef } from "react";
import { FaFilePdf } from "react-icons/fa";

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatFullDate(dateInput = new Date()) {
  if (dateInput === null || dateInput === undefined) {
    return "";
  }
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    weekday: "long", // Tuesday
    month: "long", // November
    day: "numeric", // 18
    year: "numeric", // 2025
    hour12: false,
  });
}

function formatCustomDate(dateInput) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const options = { weekday: "long", month: "long", day: "numeric" };
  const line1 = date.toLocaleDateString("en-US", options); // Wednesday, November 12

  const year = date.getFullYear(); // 2025

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const time = `${hours}:${minutes}`; // 00:00

  return `${line1},${year}\n${time}`;
}

function groupDetailsByType(details = []) {
  const groups = {};
  details.forEach((item) => {
    let key = "Items";
    if (item.orderDetailsIsArrival) key = "Arrival";
    else if (item.orderDetailsIsDepartur) key = "Departure";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}

const PRINT_CSS = `
    <style>
      /* Force printing of background colors in most browsers */
      * {
       -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
         margin: 0;
        padding: 0;
        font-size: 16px ;
         }
      @media print {
        html, body { margin: 0mm; font-family: Arial, sans-serif; }
        .print-page-wrapper {
          page-break-after: always !important;
          break-after: page !important;
        }
        .print-page-wrapper:last-child {
          page-break-after: avoid !important;
          break-after: avoid !important;
        }
        .invoice_print{
        // margin-top: 250px !important;
        page-break-inside: auto !important;
        break-inside: auto !important;
        page-break-before: always !important;
        margin-top: auto !important;
        }
      }

          @media print {
      body {
        margin: 0;
        padding-bottom: 140px;
      }

      footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
      }
    }

        
table { border-collapse: collapse; width: 100%; text-align: left; page-break-inside: auto; }
      th { border: 1px solid #fff; padding: 10px;color: #fff; }
      thead th , tfoot td { background-color: #B88E52 !important;font-weight: semi-bold !important; }
      .border-coffie {
      border-right:2px solid #B88E52;
      }
      tbody tr td{
      border-bottom:1px dashed #B88E52;
      padding: 9px 0 !important;
      margin:9px 0 !important;
      }
      tbody tr:nth-child(16n + 10) {
    page-break-before: avoid;
    page-break-after: always;
    page-break-inside: avoid;
    }
        tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    </style>
`;

// ─── component ────────────────────────────────────────────────────────────────

export default function OrderInvoicePrint({ header, details = [], lang }) {
  const printRef = useRef(null);

  function handlePrint() {
    let iframe = document.getElementById("ac-invoice-iframe");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "ac-invoice-iframe";
      Object.assign(iframe.style, { position: "absolute", width: "0", height: "0", border: "none" });
      document.body.appendChild(iframe);
    }
    const html = `<!doctype html><html><head><meta charset="utf-8"/>${PRINT_CSS}</head><body>${printRef.current.innerHTML}</body></html>`;
    const doc = iframe.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
    setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); }, 250);
  }

  const grouped = groupDetailsByType(details);
  const subtotal = details.reduce((sum, d) => {
    const unitPrice = parseFloat(d.OrderDetailsCurrencyPrice || d.orderDetailsPriceUsd || 0);
    return sum + unitPrice * (d.orderDetailsQty || 1);
  }, 0);

  const currency = "USD";

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handlePrint}
        disabled={!header?.orderHeaderId}
        className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm shadow-sm transition-all whitespace-nowrap ${!header?.orderHeaderId
            ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70"
            : "bg-primary hover:opacity-90 text-white cursor-pointer"
          }`}
      >
        <FaFilePdf size={14} />
        {lang === "EN" ? "Export Invoice" : "تصدير الفاتورة"}
      </button>

      {/* Hidden Print Template */}
      <div ref={printRef} style={{ display: "none" }}>
        <div className="print-page-wrapper">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <header style={{ width: "100%", position: "relative" }}>
              <img
                src="/images/skyculinaire-panner.png"
                alt="skyculinaire panner"
                style={{ width: "100%" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "40px",
                  color: "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "center",
                    width: "fit-content",
                  }}
                >
                  <h1 style={{ fontSize: "25px", fontWeight: "bold" }}>
                    I N V O I C E
                  </h1>
                  <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {header?.orderHreaderInvoiceNumber}
                  </h2>
                </div>
                <p
                  style={{
                    fontSize: "20px",
                    marginLeft: "20px",
                    marginTop: "15px",
                    fontWeight: "bold",
                  }}
                >
                  {formatFullDate(header?.orderHeaderInvoiceCreateDate || header?.orderHeaderCretionDate)}
                </p>
              </div>
            </header>

            <div style={{ flex: "1", padding: "15px", display: "flex" }}>
              <div
                className="border-coffie"
                style={{ flex: "1", padding: "15px" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: "10px",
                    }}
                  >
                    <p style={{ fontWeight: "bold" }}>No of PAX </p>
                    <p>{header?.orderHeaderPaxnum}</p>
                    <p style={{ fontWeight: "bold" }}>No of Crow</p>
                    <p>{header?.orderHeaderCrewNum}</p>
                    <p style={{ fontWeight: "bold" }}>Items Count</p>
                    <p>{details?.length}</p>
                  </div>
                  <p style={{ fontWeight: "bold" }}>Arrival Date & Time</p>
                  <p>
                    {formatCustomDate(
                      header?.orderHeaderFlightArrivalDatTime
                    )}
                  </p>
                  <p style={{ fontWeight: "bold" }}>Order Date & Time</p>
                  <p>
                    {formatCustomDate(
                      header?.orderHeaderCretionDate
                    )}
                  </p>
                  <p style={{ fontWeight: "bold" }}>Delivery Date & Time</p>
                  <p>
                    {formatCustomDate(
                      header?.orderHeaderDeliveryDateTime
                    )}
                  </p>
                  <p style={{ fontWeight: "bold", color: "#B88E52" }}>
                    {header?.orderHeaderOrderNumber}
                  </p>
                </div>
              </div>
              <div style={{ flex: "3", padding: "15px" }}>
                <div style={{ display: "flex", gap: "80px", alignItems: "end" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto auto 1fr",
                      rowGap: "10px",
                      columnGap: "20px",
                    }}
                  >
                    <p style={{ fontWeight: "bold" }}>Station</p>
                    <p>:</p>
                    <p>{header?.orderHeaderStationName}</p>
                    <p style={{ fontWeight: "bold" }}>Flight Number</p>
                    <p>:</p>
                    <p>
                      {header?.orderHeaderFlightNumberName}
                    </p>
                    <p style={{ fontWeight: "bold" }}>A/C Reg </p>
                    <p>:</p>
                    <p>{header?.orderHeaderAcregName}</p>
                    <p style={{ fontWeight: "bold" }}>A/C Type </p>
                    <p>:</p>
                    <p>{header?.orderHeaderActypeName}</p>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto auto 1fr",
                      gap: "10px",
                    }}
                  >
                    {header?.orderHeaderClientrefranceNo && (
                      <>
                        <p style={{ fontWeight: "bold" }}>
                          Client referance number
                        </p>
                        <p>:</p>
                        <p>
                          {header?.orderHeaderClientrefranceNo}
                        </p>
                      </>
                    )}
                    <p style={{ fontWeight: "bold" }}>Bill To</p>
                    <p>:</p>
                    <p>{header?.orderHeaderBillToName}</p>
                    <p style={{ fontWeight: "bold" }}>Agent </p>
                    <p>:</p>
                    <p>{header?.orderHeaderAgentName}</p>
                    <p style={{ fontWeight: "bold" }}>Operator</p>
                    <p>:</p>
                    <p>{header?.orderHeaderOperatorName}</p>
                  </div>
                </div>

                <table
                  style={{
                    borderCollapse: "collapse",
                    marginTop: "10px",
                    width: "100%",
                  }}
                >
                  <colgroup>
                    <col style={{ width: "40%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "22.5%" }} />
                    <col style={{ width: "22.5%" }} />
                  </colgroup>
                  <thead>
                    <tr style={{ backgroundColor: "#b88e52" }}>
                      <th style={{ padding: "10px", backgroundColor: "#b88e52" }}>
                        Item Name{" "}
                      </th>
                      <th style={{ padding: "10px", backgroundColor: "#b88e52" }}>
                        Quantity{" "}
                      </th>
                      <th style={{ padding: "10px", backgroundColor: "#b88e52" }}>
                        Unit Price
                      </th>
                      <th style={{ padding: "10px", backgroundColor: "#b88e52" }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ paddingBottom: "650px !important" }}>
                    {Object.keys(grouped).map((key) => (
                      <React.Fragment key={key}>
                        <tr>
                          <td colSpan={6} style={{ fontWeight: "900" }}>
                            {key}
                          </td>
                        </tr>
                        {grouped[key].map((item, idx) => {
                          const unitPrice = parseFloat(item.OrderDetailsCurrencyPrice || item.orderDetailsPriceUsd || 0);
                          const qty = item.orderDetailsQty || 1;
                          const lineTotal = unitPrice * qty;
                          return (
                            <tr key={idx}>
                              <td>{item?.orderDetailsName || item?.OrderDetailsName}</td>
                              <td>{qty}</td>
                              <td>{unitPrice > 0 ? unitPrice.toFixed(2) : "—"}</td>
                              <td>{lineTotal > 0 ? lineTotal.toFixed(2) : "—"}</td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      lineHeight: "1.3",
                    }}
                  >
                    <p>
                      {" "}
                      Thank you for your business. It’s a pleasure to work with
                      you.
                    </p>
                    <p> Payment within 30 days with registration of the</p>
                    <p>left your invoice</p>
                    <p>Sincerely Yours,</p>
                  </div>
                  <table style={{ width: "60%" }}>
                    <colgroup>
                      <col style={{ width: "30%" }} />
                      <col style={{ width: "35%" }} />
                      <col style={{ width: "35%" }} />
                    </colgroup>
                    <tbody>
                      <tr style={{ borderBottom: "0", borderTop: "0" }}>
                        <td style={{ borderBottom: "0", borderTop: "0" }}>
                          Subtotal
                        </td>
                        <td
                          style={{
                            borderBottom: "0",
                            borderTop: "0",
                            textAlign: "center",
                          }}
                        >
                          {currency}
                        </td>
                        <td style={{ borderBottom: "0", borderTop: "0" }}>
                          {header?.orderHeaderNetUsd || subtotal.toFixed(2)}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "0", borderTop: "0" }}>
                        <td style={{ borderBottom: "0", borderTop: "0" }}>
                          Transportation
                        </td>
                        <td
                          style={{
                            borderBottom: "0",
                            borderTop: "0",
                            textAlign: "center",
                          }}
                        >
                          {currency}
                        </td>
                        <td style={{ borderBottom: "0", borderTop: "0" }}>
                          {header?.orderHeaderTransportaion || header?.orderHeaderTransportationUsd || 0}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "0", borderTop: "0" }}>
                        <td style={{ borderBottom: "0", borderTop: "0" }}>
                          Airport Fees
                        </td>
                        <td
                          style={{
                            borderBottom: "0",
                            borderTop: "0",
                            textAlign: "center",
                          }}
                        >
                          {currency}
                        </td>
                        <td style={{ borderBottom: "0", borderTop: "0" }}>
                          {header?.orderHeaderAirportCost || header?.orderHeaderAirportFeesUsd || 0}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "0", borderTop: "0" }}>
                        <td style={{ borderBottom: "0", borderTop: "0" }}>
                          Handling
                        </td>
                        <td
                          style={{
                            borderBottom: "0",
                            borderTop: "0",
                            textAlign: "center",
                          }}
                        >
                          {currency}
                        </td>
                        <td style={{ borderBottom: "0", borderTop: "0" }}>
                          {header?.orderHeaderHandling || header?.orderHeaderHandlingFeesUsd || 0}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "0", borderTop: "0" }}>
                        <td style={{ borderBottom: "0", borderTop: "0" }}>
                          Discount
                        </td>
                        <td
                          style={{
                            borderBottom: "0",
                            borderTop: "0",
                            textAlign: "center",
                          }}
                        >
                          {currency}
                        </td>
                        <td style={{ borderBottom: "0", borderTop: "0" }}>
                          {header?.orderHeaderDiscount || header?.orderHeaderDiscountValueUsd || 0}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "0", borderTop: "0" }}>
                        <td
                          style={{
                            borderBottom: "0",
                            borderTop: "0",
                            fontWeight: "900",
                          }}
                        >
                          Grand Total
                        </td>
                        <td
                          style={{
                            borderBottom: "0",
                            borderTop: "0",
                            fontWeight: "900",
                            textAlign: "center",
                          }}
                        >
                          {currency}
                        </td>
                        <td
                          style={{
                            borderBottom: "0",
                            borderTop: "0",
                            fontWeight: "900",
                          }}
                        >
                          {header?.orderHeaderGrossFinalUsd || header?.orderHeaderGrossUsd || subtotal.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <footer style={{ position: "fixed", bottom: "-3px" }}>
              <img
                src="/images/skyculinaire-footer.png"
                alt="skyculinaire footer"
                style={{ width: "100%" }}
              />
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
