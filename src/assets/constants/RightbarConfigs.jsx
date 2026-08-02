// import Logs from "../../Components/LogsComponent/Logs";
import CustomRightBarTab from "../../Components/Rightbar/CustomRightBarTab";
import RightBarPreview from "../../Components/Rightbar/RightBarPreview";
// import PayrollTotalPreview from "../../Pages/HR/Pages/Reports/PayrolReport/Components/PayrollTotalPreview";
// import ManagementRightbar from "../../Pages/Settings/EmployeePage/RightPart/SettingsManagementRightbar";
import DateFormatter from "../Helpers/DateFormatter";
import useDateTime from "../Helpers/GetDateTime";
import PriceFormatter from "../Helpers/PriceFormatter";

const { reversed, longFormat } = DateFormatter();
const { getDateOnly, getTimeOnly } = useDateTime();

const formatRoute = (routeName = "") => {
  const parts = routeName.split("-");

  const ICAO = parts[1] || "";
  const IATA = parts[2] || "";
  return `${IATA} → ${ICAO}`;
};

// Loan RightBar Configurations
export const getLoanRightBarHeaderConfig = (selectedLoan) => [
  {
    title: "Employee",
    value: selectedLoan?.personalLoanTotalPersonalName || "N/A",
  },
  {
    title: "",
    value: "",
  },
  {
    title: "Amount",
    value:
      `EGP ${PriceFormatter(selectedLoan?.personalLoanTotalLoanValue)}` ||
      "N/A",
  },
  {
    title: "Loan Status",
    value: selectedLoan?.personalLoanTotalStatusName || "N/A",
  },
  {
    title: "Months Count",
    value: selectedLoan?.personalLoanTotalLoanMonthCount || "N/A",
  },
];

export const getLoanRightBarPreviewConfig = (selectedLoan) => [
  {
    title: "Loan Information",
    fields: [
      {
        label: "Employee",
        value: selectedLoan?.personalLoanTotalPersonalName || "N/A",
      },
      {
        label: "Department",
        value: selectedLoan?.personalLoanTotalDepartmentName || "N/A",
      },
      {
        label: "Job",
        value: selectedLoan?.personalLoanTotalJopName || "N/A",
      },
      {
        label: "Kind",
        value: selectedLoan?.personalLoanTotalKindName || "N/A",
      },
      {
        label: "Status",
        value: selectedLoan?.personalLoanTotalStatusName || "N/A",
      },
      {
        label: "Amount",
        value: `EGP ${PriceFormatter(selectedLoan?.personalLoanTotalLoanValue)}`,
      },
      {
        label: "Months Count",
        value: selectedLoan?.personalLoanTotalLoanMonthCount || "N/A",
      },
      {
        label: "Creation Date",
        value: longFormat(reversed(selectedLoan?.personalLoanTotalDate)),
      },
      {
        label: "Beginning Date",
        value: longFormat(reversed(selectedLoan?.personalLoanTotalBegDate)),
      },
      {
        label: "End Date",
        value: longFormat(reversed(selectedLoan?.personalLoanTotalEndDate)),
      },
      {
        label: "Reason",
        value: selectedLoan?.personalLoanTotalRemark || "N/A",
      },
      {
        label: "Approved",
        value: selectedLoan?.personalLoanTotalIsApprove
          ? "Approved"
          : "Not Approved",
      },
      {
        label: "Paid",
        value: selectedLoan?.personalLoanTotalIsCash ? "Paid" : "Not Paid",
      },
    ],
  },
];

export const getLoanTabs = (selectedLoan) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedLoan}
        rightBarPreviewConfig={getLoanRightBarPreviewConfig(selectedLoan)}
      />
    ),
  },
  {
    label: "Activity",
    key: "2",
    children: <div className="logs-empty no-content">No Data available.</div>,
  },
];

// Employee In/Out RightBar Configurations
export const getEmployeeInOutRightBarHeaderConfig = (selectedEmployee) => [
  {
    title: "Employee",
    value: selectedEmployee?.personalName || "N/A",
  },
  {
    title: "Job",
    value: selectedEmployee?.personalJopName || "N/A",
  },
  {
    title: "Department",
    value: selectedEmployee?.personalDepartmentName || "N/A",
  },
  {
    title: "Days Count",
    value: selectedEmployee?.daysWithTimeIn || 0,
  },
  {
    title: "Total Duration",
    value: selectedEmployee?.totalDuration || "0H 0M",
  },
];

export const getEmployeeInOutRightBarPreviewConfig = (selectedEmployee) => [
  {
    title: "Employee Information",
    fields: [
      {
        label: "Name",
        value: selectedEmployee?.personalName || "N/A",
      },
      {
        label: "Job Title",
        value: selectedEmployee?.personalJopName || "N/A",
      },
      {
        label: "Department",
        value: selectedEmployee?.personalDepartmentName || "N/A",
      },
      {
        label: "Start Date",
        value: selectedEmployee?.personalApplyDate || "N/A",
      },
      {
        label: "Status",
        value: selectedEmployee?.personalSystemActive ? "Active" : "Inactive",
      },
    ],
  },
];

// Quotation RightBar Configurations
export const getQuotationRightBarHeaderConfig = (selectedQuotation) => [
  {
    title: "Created By",
    value: selectedQuotation?.orderHeaderSalesPerson || "N/A",
  },
  {
    title: "Created Date",
    value:
      `${getDateOnly(selectedQuotation?.orderHeaderCretionDate)} ${getTimeOnly(
        selectedQuotation?.orderHeaderCretionDate
      )}` || "N/A",
  },
  {
    title: "Station",
    value: selectedQuotation?.orderHeaderStationName || "N/A",
  },
  {
    title: "Order Status",
    value: selectedQuotation?.orderHeaderStatusName || "N/A",
  },
  {
    title: "Flight Number",
    value: selectedQuotation?.orderHeaderFlightNumberName || "N/A",
  },
];

export const getQuotationRightBarFooterConfig = (
  selectedQuotation,
  showPrice
) => {
  if (!showPrice) {
    return [];
  }
  return [
    {
      title: "Net Total",
      value: `${selectedQuotation?.orderHeaderCurrencyName} ${PriceFormatter(selectedQuotation?.orderHeaderNetUsd) || 0.0}`,
    },
    {
      title: "Discount",
      value: `${selectedQuotation?.orderHeaderCurrencyName} ${PriceFormatter(selectedQuotation?.orderHeaderDiscount) || 0.0}`,
    },
    {
      title: "Handling",
      value: `${selectedQuotation?.orderHeaderCurrencyName} ${PriceFormatter(selectedQuotation?.orderHeaderHandling) || 0.0}`,
    },
    {
      title: "Airport Fees",
      value: `${selectedQuotation?.orderHeaderCurrencyName} ${PriceFormatter(selectedQuotation?.orderHeaderAirportCost) || 0.0}`,
    },
    {
      title: "Transportation",
      value: `${selectedQuotation?.orderHeaderCurrencyName} ${PriceFormatter(selectedQuotation?.orderHeaderTransportaion) || 0.0
        }`,
    },
    {
      title: "Vat",
      value: `${selectedQuotation?.orderHeaderCurrencyName} ${PriceFormatter(selectedQuotation?.orderHeaderVatUsd) || 0.0}`,
    },
    {
      title: "Gross Total",
      value: `${selectedQuotation?.orderHeaderCurrencyName} ${PriceFormatter(selectedQuotation?.orderHeaderGrossUsd) || 0.0}`,
    },
  ];
};

export const getQuotationRightBarPreviewConfig = (selectedQuotation) => [
  {
    title: "Flight Information",
    fields: [
      {
        label: "Sales",
        value: selectedQuotation?.orderHeaderSalesPerson || "N/A",
      },
      {
        label: "Branch",
        value: selectedQuotation?.orderHeaderBranchName || "N/A",
      },
      {
        label: "Flight Number",
        value: selectedQuotation?.orderHeaderFlightNumberName || "N/A",
      },
      {
        label: "Station",
        value: selectedQuotation?.orderHeaderStationName || "N/A",
      },
      { label: "Pax", value: selectedQuotation?.orderHeaderPaxnum || "N/A" },
      { label: "Crew", value: selectedQuotation?.orderHeaderCrewNum || "N/A" },
    ],
  },
  {
    title: "Client Information",
    fields: [
      {
        label: "Operator",
        value: `${selectedQuotation?.orderHeaderOperatorName || "N/A"}`,
      },
      {
        label: "Agent",
        value: `${selectedQuotation?.orderHeaderAgentName || "N/A"}`,
      },
      {
        label: "Bill To",
        value: selectedQuotation?.orderHeaderBillToName || "N/A",
      },
    ],
  },
  {
    title: "Time (UTC)",
    fields: [
      {
        label: "Arrival Date",
        value:
          getDateOnly(selectedQuotation?.orderHeaderFlightArrivalDatTime) ||
          "N/A",
      },
      {
        label: "Arrival Time",
        value:
          getTimeOnly(selectedQuotation?.orderHeaderFlightArrivalDatTime) ||
          "N/A",
      },
      {
        label: "Departure Date",
        value:
          getDateOnly(selectedQuotation?.orderHeaderDepatrialDateTime) || "N/A",
      },
      {
        label: "Departure Time",
        value:
          getTimeOnly(selectedQuotation?.orderHeaderDepatrialDateTime) || "N/A",
      },
      {
        label: "Delivery Date",
        value:
          getDateOnly(selectedQuotation?.orderHeaderDeliveryDateTime) || "N/A",
      },
      {
        label: "Delivery Time",
        value:
          getTimeOnly(selectedQuotation?.orderHeaderDeliveryDateTime) || "N/A",
      },
    ],
  },
  {
    title: "PIC Information",
    fields: [
      {
        label: "PIC Name",
        value: selectedQuotation?.orderHeaderPicName || "N/A",
      },
      {
        label: "PIC Email",
        value: selectedQuotation?.orderHeaderPicEmail || "N/A",
      },
      {
        label: "Remark",
        value: selectedQuotation?.orderHeaderPicNotes || "N/A",
      },
    ],
  },
];

export const getQuotationCustomRightBarConfig = (showPrice) => {
  const config = [
    { label: "Item", value: "orderDetailsName" },
    { label: "Qty", value: "orderDetailsQty" },
  ];

  if (showPrice) {
    config.push({
      label: "Total",
      value: "orderDetailsGrossUsd",
      render: (item) => `USD ${item.orderDetailsGrossUsd}`,
    });
  }
  return config;
};

export const getQuotationTabs = (
  selectedQuotation,
  data,
  isLoading,
  showPrice
) => [
    {
      label: "Preview",
      key: "1",
      children: (
        <RightBarPreview
          selectedItem={selectedQuotation}
          rightBarPreviewConfig={getQuotationRightBarPreviewConfig(
            selectedQuotation
          )}
        />
      ),
    },
    {
      label: "Items",
      key: "2",
      children: (
        <CustomRightBarTab
          data={data}
          isLoading={isLoading}
          selectedItem={selectedQuotation}
          customRightBarConfig={getQuotationCustomRightBarConfig(showPrice)}
        />
      ),
    },
    {
      label: "Activity",
      key: "3",
      children: <div className="logs-empty no-content">No Data available.</div>,
    },
  ];

// Custody RightBar Configurations
export const getCustodyRightBarHeaderConfig = (selectedCustody) => [
  {
    title: "Employee",
    value: selectedCustody?.personalName || "N/A",
  },
  {
    title: "",
    value: "",
  },
  {
    title: "Currency",
    value: selectedCustody?.cashTransactionCurrencyName || "N/A",
  },
  {
    title: "Custody Status",
    value: selectedCustody?.cashTransactionApprovalText || "N/A",
  },
  {
    title: "Paid",
    value: selectedCustody?.cashTransactionPaidText || "N/A",
  },
];

export const getCustodyRightBarPreviewConfig = (selectedCustody) => [
  {
    title: "Custody Information",
    fields: [
      {
        label: "Custody number",
        value: selectedCustody?.cashTransactionNo || "N/A",
      },
      {
        label: "Date",
        value: `${getDateOnly(selectedCustody?.cashTransactionDate)} ${getTimeOnly(
          selectedCustody?.cashTransactionDate
        )}`,
      },
      {
        label: "Document number",
        value: selectedCustody?.cashTransactionDocumentNo || "N/A",
      },
      {
        label: "Employee",
        value: selectedCustody?.personalName || "N/A",
      },
      {
        label: "Currency",
        value: selectedCustody?.cashTransactionCurrencyName || "N/A",
      },
      {
        label: "Status",
        value: selectedCustody?.cashTransactionApprovalText || "N/A",
      },
      {
        label: "Approval Date",
        value: `${getDateOnly(
          selectedCustody?.cashTransactionApprovalDate
        )} ${getTimeOnly(selectedCustody?.cashTransactionApprovalDate)}`,
      },
      {
        label: "Paid",
        value: selectedCustody?.cashTransactionPaidText || "N/A",
      },
      {
        label: "Paying Date",
        value: `${getDateOnly(
          selectedCustody?.cashTransactionPaidDate
        )} ${getTimeOnly(selectedCustody?.cashTransactionPaidDate)}`,
      },
      {
        label: "Remark",
        value: selectedCustody?.cashTransactionRemark || "N/A",
      },
    ],
  },
];

export const custodyCustomRightBarConfig = [
  { label: "Item", value: "purReqDetailsItemName" },
  {
    label: "Qty",
    render: (item, all) =>
      all?.purReqStatusId >= 6
        ? item.purReqDetailsPurchasingQty
        : item.purReqDetailsOperationQty,
  },
  {
    label: "Total",
    render: (item, all) =>
      all?.purReqStatusId >= 6
        ? `EGP ${PriceFormatter(item.purReqDetailsTotal)}`
        : `EGP ${PriceFormatter(item.purReqDetailsOperationTotal)}`,
  },
];

export const getCustodyRightBarFooterConfig = (selectedCustody, pathname) => {
  let config = [
    {
      title: "Difference",
      value: `EGP ${PriceFormatter(selectedCustody?.cashTransactionDifference) || 0.0}`,
    },
  ];
  if (pathname?.includes("Return")) {
    config.unshift(
      {
        title: "Custody Amount",
        value: `EGP ${PriceFormatter(selectedCustody?.cashTransactionOrgAmount) || 0.0}`,
      },
      {
        title: "Sub Total",
        value: `EGP ${PriceFormatter(selectedCustody?.cashTransactionSubTotal) || 0.0}`,
      },
      {
        title: "Vat",
        value: `EGP ${PriceFormatter(selectedCustody?.cashTransactionVat) || 0.0}`,
      },
      {
        title: "Discount",
        value: `EGP ${PriceFormatter(selectedCustody?.cashTransactionDiscount) || 0.0}`,
      },
      {
        title: "Delivery",
        value: `EGP ${PriceFormatter(selectedCustody?.cashTransactionDelivery) || 0.0}`,
      },

      {
        title: "Total",
        value: `EGP ${PriceFormatter(selectedCustody?.cashTransactionPurTotal) || 0.0}`,
      }
    );
  }
  return config;
};
export const getCustodyTabs = (selectedCustody, CustodyDetails) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedCustody}
        rightBarPreviewConfig={getCustodyRightBarPreviewConfig(selectedCustody)}
      />
    ),
  },
  {
    label: "Activity",
    key: "2",
    children: <div className="logs-empty no-content">No Data available.</div>,
  },
  {
    label: "Items",
    key: "3",
    children: (
      <CustomRightBarTab
        data={CustodyDetails?.[0]?.purchasingDetails}
        selectedItem={selectedCustody}
        customRightBarConfig={custodyCustomRightBarConfig}
      />
    ),
  },
];

// Purchasing Order RightBar Configurations
export const getPurchasingRightBarHeaderConfig = (selectedPurchasingOrder) => [
  {
    title: "Creator",
    value: selectedPurchasingOrder?.purReqCreator || "N/A",
  },
  {
    title: "Date",
    value:
      `${getDateOnly(selectedPurchasingOrder?.purReqDateTime)} ${getTimeOnly(
        selectedPurchasingOrder?.purReqDateTime
      )}` || "N/A",
  },
  {
    title: "Branch",
    value: selectedPurchasingOrder?.purReqBranchName || "N/A",
  },
  {
    title: "Status",
    value: selectedPurchasingOrder?.purReqStatusName || "N/A",
  },
  { title: "Group", value: selectedPurchasingOrder?.purReqGroup || "N/A" },
];

export const getPurchasingRightBarFooterConfig = (selectedPurchasingOrder) => [
  {
    title: "Sub Total",
    value: `EGP ${PriceFormatter(selectedPurchasingOrder?.purReqSubTotal) || 0}`,
  },
  {
    title: "Discount",
    value: `EGP ${PriceFormatter(selectedPurchasingOrder?.purReqDiscount) || 0}`,
  },
  {
    title: "Vat",
    value: `EGP ${PriceFormatter(selectedPurchasingOrder?.purReqVat) || 0}`,
  },
  {
    title: "Total",
    value: `EGP ${selectedPurchasingOrder?.purReqStatusId >= 6
      ? PriceFormatter(selectedPurchasingOrder?.purReqValue)
      : PriceFormatter(selectedPurchasingOrder?.purReqOperationValue) || 0
      }`,
  },
];

export const getPurchasingRightBarPreviewConfig = (selectedPurchasingOrder) => [
  {
    title: "Purchasing Information",
    fields: [
      {
        label: "Group",
        value: selectedPurchasingOrder?.purReqGroup || "N/A",
      },
      {
        label: "Creator",
        value: selectedPurchasingOrder?.purReqCreator || "N/A",
      },
      {
        label: "Status",
        value: selectedPurchasingOrder?.purReqStatusName || "N/A",
      },
      {
        label: "Store",
        value: selectedPurchasingOrder?.purReqStoreName || "N/A",
      },
      {
        label: "Sector",
        value: selectedPurchasingOrder?.purReqSectoreName || "N/A",
      },
      {
        label: "Paying type",
        value: selectedPurchasingOrder?.purReqTypeName || "N/A",
      },
    ],
  },
];


export const getPurRightBarPreviewConfig = (selectedPurchasingOrder) => [
  {
    title: "Purchasing Information",
    fields: [
      {
        label: "Paying type",
        value: selectedPurchasingOrder?.itemPacking || "N/A",
      },
      {
        label: "Unit Name",
        value: selectedPurchasingOrder?.itemUnitName || "N/A",
      },
      {
        label: "Minimum Value",
        value: selectedPurchasingOrder?.itemMinQty || 0,
      },
      {
        label: "Maximum Value",
        value: selectedPurchasingOrder?.itemMaxQty || 0,
      },
    ],
  },
];

export const getFoodCodingRightBarPreviewConfig = (selectedCodingItem) => [
  {
    title: "Food Information",
    fields: [
      {
        label: "Unit Name",
        value: selectedCodingItem?.foodMenuItemUnitName || "N/A",
      }

    ],
  },
];

export const purchasingCustomRightBarConfig = [
  { label: "Item", value: "purReqDetailsItemName" },
  {
    label: "Qty",
    render: (item, selectedPurchasingOrder) =>
      selectedPurchasingOrder?.purReqStatusId >= 6
        ? item?.purReqDetailsPurchasingQty
        : item?.purReqDetailsOperationQty,
  },
  {
    label: "Total",
    render: (item, selectedPurchasingOrder) =>
      `EGP ${selectedPurchasingOrder?.purReqStatusId >= 6
        ? PriceFormatter(item?.purReqDetailsTotal)
        : PriceFormatter(item?.purReqDetailsOperationTotal)
      }`,
  },
];

export const getPurchasingTabs = (selectedPurchasingOrder) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedPurchasingOrder}
        rightBarPreviewConfig={getPurchasingRightBarPreviewConfig(
          selectedPurchasingOrder
        )}
      />
    ),
  },
  {
    label: "Activity",
    key: "2",
    children: <div className="logs-empty no-content">No Data available.</div>,
  },
  {
    label: "Order Items",
    key: "3",
    children: (
      <CustomRightBarTab
        data={selectedPurchasingOrder?.purchasingDetails}
        selectedItem={selectedPurchasingOrder}
        customRightBarConfig={purchasingCustomRightBarConfig}
      />
    ),
  },
];

export const getPurTabs = (selectedPurchasingOrder) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedPurchasingOrder}
        rightBarPreviewConfig={getPurRightBarPreviewConfig(
          selectedPurchasingOrder
        )}
      />
    ),
  },
];

export const getFoodCodingTabs = (selectedCodingItem) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedCodingItem}
        rightBarPreviewConfig={getFoodCodingRightBarPreviewConfig(
          selectedCodingItem
        )}
      />
    ),
  },
];

// Transaction RightBar Header
export const getTransactionRightBarHeaderConfig = (selectedCashTransaction) => [
  {
    title: "Created By",
    value: selectedCashTransaction?.cashTransactionUserData || "N/A",
  },
  {
    title: "Created Date",
    value:
      `${getDateOnly(selectedCashTransaction?.cashTransactionDate)} ${getTimeOnly(
        selectedCashTransaction?.cashTransactionDate
      )}` || "N/A",
  },
  {
    title: "Approved By",
    value: selectedCashTransaction?.cashTransactionApprovalUser || "N/A",
  },
  {
    title: "Order Status",
    value: selectedCashTransaction?.cashTransactionApprovalText || "N/A",
  },
  {
    title: "Amount",
    value:
      `${PriceFormatter(
        selectedCashTransaction?.cashTransactionLmount || 0
      )} ${selectedCashTransaction?.cashTransactionCurrencyName}` || "N/A",
  },
];

// Transaction RightBar Footer
export const getTransactionRightBarFooterConfig = (
  selectedCashTransaction,
  detailsItems,
  pathname
) => {
  if (
    (pathname?.includes("ReturnCustody") || pathname?.includes("PittyCash")) &&
    detailsItems &&
    detailsItems[0]?.cashtrnDetailsList
  ) {
    const list = detailsItems[0].cashtrnDetailsList;
    const subTotal = list.reduce(
      (acc, item) => acc + (item.cashTransactionDetailTotal || 0),
      0
    );
    const discount = list.reduce(
      (acc, item) => acc + (item.cashTransactionDetailDiscount || 0),
      0
    );
    const vat = list.reduce(
      (acc, item) => acc + (item.cashTransactionDetailVat || 0),
      0
    );
    const netTotal = list.reduce(
      (acc, item) => acc + (item.cashTransactionDetailNetTotal || 0),
      0
    );
    const currency = selectedCashTransaction?.cashTransactionCurrencyName || "";

    //  <div style={{ display: "flex", flexDirection: "column" }}>
    //    <div className="data-group">
    //      <p>Orignal Taken</p>
    //      <p>
    //        : EGP{" "}
    //        {PriceFormatter(
    //          selectedCashTransaction.cashTransactionOrgCustodyAmount
    //        )}
    //      </p>
    //    </div>
    //    <div className="data-group">
    //      <p>Remaining</p>
    //      <p>
    //        : EGP{" "}
    //        {PriceFormatter(
    //          selectedCashTransaction.cashTransactionOrgCustodyAmount -
    //            selectedCashTransaction.cashTransactionLmount
    //        )}
    //      </p>
    //    </div>
    //  </div>;

    const config = [];
    config.push(
      {
        title: "Sub Total",
        value: `${currency} ${PriceFormatter(subTotal)}`,
      },
      {
        title: "Discount",
        value: `${currency} ${PriceFormatter(discount)}`,
      },
      {
        title: "VAT",
        value: `${currency} ${PriceFormatter(vat)}`,
      },
      {
        title: "Net Total",
        value: `${currency} ${PriceFormatter(netTotal)}`,
      }
    );
    if (pathname?.includes("ReturnCustody")) {
      config.unshift({
        title: "Original Taken",
        value: `EGP ${PriceFormatter(
          selectedCashTransaction.cashTransactionOrgCustodyAmount
        )}`,
      });
      config.push({
        title: "Remaining",
        value: `EGP ${PriceFormatter(
          selectedCashTransaction.cashTransactionOrgCustodyAmount -
          selectedCashTransaction.cashTransactionLmount
        )}`,
      });
    }
    return config;
  }

  return [
    {
      title: "Total",
      value: `${selectedCashTransaction?.cashTransactionCurrencyName || ""
        } ${PriceFormatter(selectedCashTransaction?.cashTransactionLmount || 0)}`,
    },
  ];
};

// Transaction RightBar Preview
export const getTransactionRightBarPreviewConfig = (
  selectedCashTransaction
) => [
    {
      title: "Cash Transaction Information",
      fields: [
        {
          label: "Date",
          value: getDateOnly(selectedCashTransaction?.cashTransactionDate),
        },
        {
          label: "Creator",
          value: selectedCashTransaction?.cashTransactionUserData || "N/A",
        },
        {
          label: "Amount",
          value: PriceFormatter(
            selectedCashTransaction?.cashTransactionLmount || 0
          ),
        },
        {
          label: "Currency",
          value: selectedCashTransaction?.cashTransactionCurrencyName || "N/A",
        },
        {
          label: "Safe",
          value: selectedCashTransaction?.cashTransactionCashCodeName || "N/A",
        },
        ...(selectedCashTransaction?.cashTransactionCashTransactionKindId === 27
          ? [
            {
              label: "Partner",
              value:
                selectedCashTransaction?.cashTransactionPartnerName || "N/A",
            },
          ]
          : []),
        {
          label: "Status",
          value: selectedCashTransaction?.cashTransactionApprovalText || "N/A",
        },
        {
          label: "Approval Date",
          value: getDateOnly(
            selectedCashTransaction?.cashTransactionApprovalDate
          ),
        },
        {
          label: "Approved By",
          value: selectedCashTransaction?.cashTransactionApprovalUser || "N/A",
        },
        {
          label: "Paid",
          value: selectedCashTransaction?.cashTransactionPaidText || "N/A",
        },
        {
          label: "Paying Date",
          value: getDateOnly(selectedCashTransaction?.cashTransactionPaidDate),
        },
        {
          label: "Remark",
          value: selectedCashTransaction?.cashTransactionRemark || "N/A",
        },
      ],
    },
  ];

// Transaction RightBar Tabs
export const getTransactionTabs = (selectedCashTransaction) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedCashTransaction}
        rightBarPreviewConfig={getTransactionRightBarPreviewConfig(
          selectedCashTransaction
        )}
      />
    ),
  },
  {
    label: "Activity",
    key: "2",
    children: <div className="logs-empty no-content">No Data available.</div>,
  },
];

// Report RightBar Config

export const getReportRightBarHeaderConfig = (selectedReport) => {
  if (!selectedReport) return [];
  return [
    { title: "Item Name", value: selectedReport?.purItemName || "N/A" },
    { title: "Item Group", value: selectedReport?.itemGroup || "N/A" },
    { title: "Packing", value: selectedReport?.purItemsPackingName || "N/A" },
    {
      title: "Unit",
      value: `${selectedReport?.str_PurItemConvertValue} ${selectedReport?.purItemsUnitName}`,
    },
  ];
};

export const reportCustomRightBarConfig = [
  {
    label: "Date",
    value: "storeTransactionTotalDate",
    render: (item) => reversed(item?.storeTransactionTotalDate),
  },
  {
    label: "In Qty.",
    value: "inQty",
  },
  {
    label: "Out Qty.",
    value: "outQty",
  },
];
export const inReportCustomRightBarConfig = [
  {
    label: "Date",
    value: "storeTransactionTotalDate",
    render: (item) => reversed(item?.storeTransactionTotalDate),
  },
  {
    label: "Transaction No.",
    value: "storeTransactionTotalNo",
  },
];

export const getReportRightBarPreviewConfig = (detailsItems) => [
  {
    title: "Transactions",
    fields:
      detailsItems?.map((item) => ({
        label: reversed(item?.storeTransactionTotalDate),
        value: `In: ${item?.inQty} | Out: ${item?.outQty}`,
      })) || [],
  },
];

export const getReportRightBarFooterConfig = (selectedReport) => [
  {
    title: "Balance",
    value: selectedReport?.balance ?? "0",
  },
];

export const getReportTabs = (
  selectedReport,
  allItems,
  isLoadingAllItems,
  inItems,
  isLoadingInItems,
  outItems,
  isLoadingOutItems
) => [
    {
      label: "All",
      key: "1",
      children: (
        <CustomRightBarTab
          data={allItems}
          isLoading={isLoadingAllItems}
          selectedItem={selectedReport}
          customRightBarConfig={reportCustomRightBarConfig}
        />
      ),
    },
    {
      label: "In",
      key: "2",
      children: (
        <CustomRightBarTab
          data={inItems}
          isLoading={isLoadingInItems}
          selectedItem={selectedReport}
          customRightBarConfig={inReportCustomRightBarConfig}
        />
      ),
    },
    {
      label: "Out",
      key: "3",
      children: (
        <CustomRightBarTab
          data={outItems}
          isLoading={isLoadingOutItems}
          selectedItem={selectedReport}
          customRightBarConfig={inReportCustomRightBarConfig}
        />
      ),
    },
  ];

// Kitchen Requests RightBar Configs

export const getKitchenRequestPreviewConfig = (selectedKitchenRequest) => [
  {
    title: "Kitchen Request Information",
    fields: [
      {
        label: "From Store",
        value: selectedKitchenRequest?.fromStoreName || "N/A",
      },
      {
        label: "From Sector",
        value: selectedKitchenRequest?.fromSectoreName || "N/A",
      },
      { label: "To Store", value: selectedKitchenRequest?.storeName || "N/A" },
      {
        label: "To Sector",
        value: selectedKitchenRequest?.sectoreName || "N/A",
      },
      {
        label: "Date",
        value: reversed(getDateOnly(selectedKitchenRequest?.creationDate)),
      },
      {
        label: "Time",
        value: getTimeOnly(selectedKitchenRequest?.creationTime),
      },
      { label: "Status", value: selectedKitchenRequest?.statusName || "N/A" },
    ],
  },
];

export const kitchenRequestCustomRightBarConfig = [
  { label: "Item", value: "storeTransactionDetailsItemName" },
  { label: "Qty", value: "storeTransactionDetailRequestQty" },
];

export const getPurRightBarHeaderConfig = (selectedPurItem) => {
  if (!selectedPurItem) return [];
  return [
    { title: "Item Name", value: selectedPurItem?.itemName || "N/A" },
    { title: "Item Group", value: selectedPurItem?.itemGroupName || "N/A" },
    { title: "Sub Group", value: selectedPurItem?.purItemSubGroupName || "N/A" },
    {
      title: "Brand",
      value: selectedPurItem?.purItemBrandName || "N/A",
    },
  ];
};

export const getFinanceRightBarHeaderConfig = (selectedCodingItem) => {
  if (!selectedCodingItem) return [];
  return [
    { title: "supplier sName", value: selectedCodingItem?.suppliersName || "N/A" },

  ];
};

export const getFoodItemCodingRightBarHeaderConfig = (selectedCodingItem) => {
  if (!selectedCodingItem) return [];
  return [
    { title: "Item Name", value: selectedCodingItem?.foodMenuItemName || "N/A" },
    { title: "Grand Group", value: selectedCodingItem?.foodMenuGrandGroupName || "N/A" },
    { title: "Group", value: selectedCodingItem?.foodMenuItemGroupName || "N/A" },
    {
      title: "Sub Group",
      value: selectedCodingItem?.foodMenuItemSubGroupName || "N/A",
    },
  ];
};

export const getOperationCodingRightBarHeaderConfig = (selectedCodingItem) => [
  {
    title: "Name",
    value: selectedCodingItem
      ? selectedCodingItem?.flightNumberName ||
      selectedCodingItem?.registrationName ||
      selectedCodingItem?.agentName ||
      selectedCodingItem?.suppName ||
      selectedCodingItem?.airCraftTypeName ||
      selectedCodingItem?.operatorName ||
      selectedCodingItem?.customerName ||
      selectedCodingItem?.foodMenuItemName ||
      selectedCodingItem?.foodMenuGrandGroupName ||
      selectedCodingItem?.foodMenuGroupName ||
      selectedCodingItem?.foodMenuSubGroupName ||
      selectedCodingItem?.foodMenuUnitName ||
      selectedCodingItem?.foodMenuItemAddsName ||
      selectedCodingItem?.billToname
      : "Select an item",
  },
  selectedCodingItem?.customerMail && {
    title: "Email",
    value: selectedCodingItem?.customerMail || "N/A",
  },

  selectedCodingItem?.customerMobile && {
    title: "Mobile",
    value: selectedCodingItem?.customerMobile || "N/A",
  },
  selectedCodingItem?.customerAddress && {
    title: "Address",
    value: selectedCodingItem?.customerAddress || "N/A",
  },
  (selectedCodingItem && (Object.keys(selectedCodingItem)?.includes("customerApproveOk") || Object.keys(selectedCodingItem)?.includes("foodMenuItemIsApproved") || Object.keys(selectedCodingItem)?.includes("suppApproveOk"))) && {
    title: "Approved",
    value: (selectedCodingItem?.customerApproveOk ? "Yes" : selectedCodingItem?.foodMenuItemIsApproved ? "Yes" : selectedCodingItem?.suppApproveOk ? "Yes" : "No") || "N/A",
  },
]

export const getKitchenRequestHeaderConfig = (selectedKitchenRequest) => [
  {
    title: "Created By",
    value: selectedKitchenRequest?.createdBy || "N/A",
  },
  {
    title: "Created Date",
    value:
      `${getDateOnly(selectedKitchenRequest?.creationDate)} ${getTimeOnly(
        selectedKitchenRequest?.creationTime
      )}` || "N/A",
  },
  {
    title: "Store Name",
    value: selectedKitchenRequest?.fromSectoreName || "N/A",
  },
  {
    title: "Order Status",
    value: selectedKitchenRequest?.statusName || "N/A",
  },
  {
    title: "From Store",
    value: selectedKitchenRequest?.orderHeaderFlightNumberName || "N/A",
  },
];

export const getKitchenRequestTabs = (
  selectedKitchenRequest,
  data,
  isLoading
) => [
    {
      label: "Preview",
      key: "1",
      children: (
        <RightBarPreview
          selectedItem={selectedKitchenRequest}
          rightBarPreviewConfig={getKitchenRequestPreviewConfig(
            selectedKitchenRequest
          )}
        />
      ),
    },
    {
      label: "Items",
      key: "2",
      children: (
        <CustomRightBarTab
          data={data || selectedKitchenRequest?._TrnDetailList}
          isLoading={isLoading}
          selectedItem={selectedKitchenRequest}
          customRightBarConfig={kitchenRequestCustomRightBarConfig}
        />
      ),
    },
  ];

// Employee Request RightBar Configurations

export const getEmployeeRequestPreviewConfig = (selectedEmployeeRequest) => [
  {
    title: "Employee Request Information",
    fields: [
      {
        label: "Employee",
        value: selectedEmployeeRequest?.personalName || "N/A",
      },
      {
        label: "To Store",
        value: selectedEmployeeRequest?.storeName || "N/A",
      },
      {
        label: "To Sector",
        value: selectedEmployeeRequest?.sectoreName || "N/A",
      },
      {
        label: "Date",
        value: reversed(getDateOnly(selectedEmployeeRequest?.creationDate)),
      },
      {
        label: "Time",
        value: getTimeOnly(selectedEmployeeRequest?.creationTime),
      },
      {
        label: "Status",
        value: selectedEmployeeRequest?.statusName || "N/A",
      },
    ],
  },
];

export const employeeRequestCustomRightBarConfig = [
  { label: "Item", value: "storeTransactionDetailsItemName" },
  { label: "Qty", value: "storeTransactionDetailRequestQty" },
];

export const getEmployeeRequestHeaderConfig = (selectedEmployeeRequest) => [
  {
    title: "Created By",
    value: selectedEmployeeRequest?.createdBy || "N/A",
  },
  {
    title: "Created Date",
    value:
      `${getDateOnly(selectedEmployeeRequest?.creationDate)} ${getTimeOnly(
        selectedEmployeeRequest?.creationTime
      )}` || "N/A",
  },
  {
    title: "Store",
    value: selectedEmployeeRequest?.storeName || "N/A",
  },
  {
    title: "Order Status",
    value: selectedEmployeeRequest?.statusName || "N/A",
  },
  {
    title: "personal Name",
    value: selectedEmployeeRequest?.personalName || "N/A",
  },
];

export const getEmployeeRequestTabs = (
  selectedEmployeeRequest,
  detailsItems
) => [
    {
      label: "Preview",
      key: "1",
      children: (
        <RightBarPreview
          selectedItem={selectedEmployeeRequest}
          rightBarPreviewConfig={getEmployeeRequestPreviewConfig(
            selectedEmployeeRequest
          )}
        />
      ),
    },
    {
      label: "Items",
      key: "2",
      children: (
        <CustomRightBarTab
          data={detailsItems?.[0]?._TrnDetailList || []}
          selectedItem={selectedEmployeeRequest}
          customRightBarConfig={employeeRequestCustomRightBarConfig}
        />
      ),
    },
  ];

// Employee RightBar Configurations

export const getEmployeeRightBarPreviewConfig = (selectedEmployee) => [
  {
    title: "Personal Information",
    fields: [
      { label: "Name", value: selectedEmployee?.personalName || "N/A" },
      { label: "Phone", value: selectedEmployee?.personalMoble || "N/A" },
      {
        label: "Second Phone",
        value: selectedEmployee?.personalSecondMoble || "N/A",
      },
      { label: "Land Number", value: selectedEmployee?.personalPhone || "N/A" },
      {
        label: "Attendance ID",
        value: selectedEmployee?.personalAttCode || "N/A",
      },
      { label: "Email", value: selectedEmployee?.personalMail || "N/A" },
      {
        label: "Work Email",
        value: selectedEmployee?.personalWorkMail || "N/A",
      },
      {
        label: "Location",
        value: selectedEmployee?.personalLocationName || "N/A",
      },
      { label: "Job", value: selectedEmployee?.personalJopName || "N/A" },
      {
        label: "Department",
        value: selectedEmployee?.personalDepartmentName || "N/A",
      },
      { label: "Address", value: selectedEmployee?.personalAddress || "N/A" },
      {
        label: "Social Status",
        value: selectedEmployee?.personalSocialName || "N/A",
      },
      // {
      //   label: "Birth Date",
      //   value:
      //     longFormat(dateFormat(selectedEmployee?.personalBerthDate)) || "N/A",
      // },
      // {
      //   label: "Apply Date",
      //   value:
      //     longFormat(dateFormat(selectedEmployee?.personalApplyDate)) || "N/A",
      // },
    ],
  },
];

export const getEmployeeRightBarHeaderConfig = (selectedEmployee) => [
  {
    title: "Created By",
    value: selectedEmployee?.personalCreatedBy || "N/A",
  },
  {
    title: "Created Date",
    value:
      `${getDateOnly(selectedEmployee?.personalCreatedDate)} ${getTimeOnly(
        selectedEmployee?.personalCreatedDate
      )}` || "N/A",
  },
  {
    title: "Job",
    value: selectedEmployee?.personalDepartmentName || "N/A",
  },
  {
    title: "Status",
    value: selectedEmployee?.personalStatusName || "N/A",
  },
  {
    title: "Branch",
    value: selectedEmployee?.personalBranchName || "N/A",
  },
];

export const getEmployeeRightBarTabs = (
  selectedEmployee,
  levelTwoActive,
  isEmployeeAccess
) => [
    // {
    //   label: "Preview",
    //   key: "1",
    //   children: isEmployeeAccess ? (
    //     <ManagementRightbar />
    //   ) : (
    //     <RightBarPreview
    //       selectedItem={selectedEmployee}
    //       rightBarPreviewConfig={getEmployeeRightBarPreviewConfig(
    //         selectedEmployee
    //       )}
    //     />
    //   ),
    // },
    // {
    //   label: "Activity",
    //   key: "2",
    //   children: (
    //     <Logs id={selectedEmployee?.personalId} menuId={levelTwoActive} />
    //   ),
    // },
  ];

// Credit Purchasing Configurations

export const getCreditPurRightBarHeaderConfig = (selectedCreditPurchasing) => [
  {
    title: "Purchasing No.",
    value:
      (selectedCreditPurchasing?.cashTransactionNo || "") +
      (selectedCreditPurchasing?.cashTransactionIsZas
        ? " ---> Sales Order"
        : "") || "N/A",
  },
  {
    title: "Date",
    value: getDateOnly(selectedCreditPurchasing?.cashTransactionDate) || "N/A",
  },
  {
    title: "Supplier",
    value: selectedCreditPurchasing?.suppliersName || "N/A",
  },
  {
    title: "Kind",
    value:
      selectedCreditPurchasing?.cashTransactionCashTransactionKindName || "N/A",
  },
  {
    title: "Remaining",
    value:
      `${selectedCreditPurchasing?.currencyName} ${PriceFormatter(
        selectedCreditPurchasing?.remaning || 0
      )}` || "N/A",
  },
];

export const getCreditPurRightBarPreviewConfig = (selectedCreditPurchasing) => [
  {
    title: "Credit Purchasing Information",
    fields: [
      {
        label: "Purchasing No.",
        value: selectedCreditPurchasing?.cashTransactionNo || "N/A",
      },
      {
        label: "Date",
        value:
          getDateOnly(selectedCreditPurchasing?.cashTransactionDate) || "N/A",
      },
      {
        label: "Supplier",
        value: selectedCreditPurchasing?.suppliersName || "N/A",
      },
      {
        label: "Kind",
        value:
          selectedCreditPurchasing?.cashTransactionCashTransactionKindName ||
          "N/A",
      },
      {
        label: "Status",
        value: selectedCreditPurchasing?.cashTransactionApprovalText || "N/A",
      },
      {
        label: "Amount",
        value: `${selectedCreditPurchasing?.currencyName} ${PriceFormatter(
          selectedCreditPurchasing?.remaning || 0
        )}`,
      },
      {
        label: "Approval Date",
        value:
          `${getDateOnly(
            selectedCreditPurchasing?.cashTransactionApprovalDate
          )} ${getTimeOnly(
            selectedCreditPurchasing?.cashTransactionApprovalDate
          )}` || "N/A",
      },
      {
        label: "Wait List",
        value: selectedCreditPurchasing?.cashTransactionIsWaitList
          ? "Yes"
          : "No",
      },
    ],
  },
];

export const getCreditPurCustomRightBarConfig = () => [
  {
    label: "Item",
    value: "cashTransactionDetailExpensesCashItemName",
  },
  {
    label: "Qty.",
    value: "cashTransactionDetailQty",
  },
  {
    label: "Total",
    value: "cashTransactionDetailTotal",
    render: (item) => `EGP ${PriceFormatter(item?.cashTransactionDetailTotal)}`,
  },
];

export const getCreditPurRightBarFooterConfig = (
  selectedCreditPurchasing,
  detailsItems,
  gmApproval
) => {
  let config = [];
  if (detailsItems && detailsItems[0]?.cashtrnDetailsList) {
    const list = detailsItems[0].cashtrnDetailsList;
    const subTotal = list.reduce(
      (acc, item) => acc + (item.cashTransactionDetailTotal || 0),
      0
    );
    const discount = list.reduce(
      (acc, item) => acc + (item.cashTransactionDetailDiscount || 0),
      0
    );
    const vat = list.reduce(
      (acc, item) => acc + (item.cashTransactionDetailVat || 0),
      0
    );
    const netTotal = list.reduce(
      (acc, item) => acc + (item.cashTransactionDetailNetTotal || 0),
      0
    );
    const currency = selectedCreditPurchasing?.currencyName || "";
    if (gmApproval) {
      config = [
        {
          title: "Remaining",
          value:
            `${selectedCreditPurchasing?.currencyName} ${PriceFormatter(
              selectedCreditPurchasing?.remaning || 0
            )}` || "N/A",
        },
      ];
    } else {
      config = [
        {
          title: "Sub Total",
          value: `${currency} ${PriceFormatter(subTotal)}`,
        },
        {
          title: "Discount",
          value: `${currency} ${PriceFormatter(discount)}`,
        },
        {
          title: "VAT",
          value: `${currency} ${PriceFormatter(vat)}`,
        },
        {
          title: "Net Total",
          value: `${currency} ${PriceFormatter(netTotal)}`,
        },
      ];
    }
  }
  return config;
};

export const getCreditPurRightBarTabs = (
  selectedCreditPurchasing,
  detailsItems,
  isLoading
) => [
    {
      label: "Preview",
      key: "1",
      children: (
        <RightBarPreview
          selectedItem={selectedCreditPurchasing}
          rightBarPreviewConfig={getCreditPurRightBarPreviewConfig(
            selectedCreditPurchasing
          )}
        />
      ),
    },
    {
      label: "Items",
      key: "2",
      children: (
        <CustomRightBarTab
          data={detailsItems?.[0]?.cashtrnDetailsList || []}
          selectedItem={selectedCreditPurchasing}
          customRightBarConfig={getCreditPurCustomRightBarConfig()}
          isLoading={isLoading}
        />
      ),
    },
    {
      label: "Activity",
      key: "3",
      children: <div className="logs-empty no-content">No Data available.</div>,
    },
  ];

// Main INV Request Configurations

export const getMainInvRequestRightBarHeaderConfig = (selectedRequest) => [
  {
    title: "Created By",
    value: selectedRequest?.createdBy || "N/A",
  },
  {
    title: "Created Date",
    value:
      `${getDateOnly(selectedRequest?.creationDate)} ${getTimeOnly(
        selectedRequest?.creationTime
      )}` || "N/A",
  },
  {
    title: "Store Name",
    value: selectedRequest?.storeName || "N/A",
  },
  {
    title: "Status",
    value: selectedRequest?.statusName || "N/A",
  },
  {
    title: "Sector",
    value: selectedRequest?.sectoreName || "N/A",
  },
];

export const getMainInvRequestRightBarPreviewConfig = (selectedRequest) => [
  {
    title: "Request Information",
    fields: [
      { label: "From Store", value: selectedRequest?.fromStoreName || "N/A" },
      {
        label: "From Sector",
        value: selectedRequest?.fromSectoreName || "N/A",
      },
      { label: "Status", value: selectedRequest?.statusName || "N/A" },
      { label: "Creator", value: selectedRequest?.createdBy || "N/A" },
      {
        label: "Date",
        value: selectedRequest?.creationDate
          ? reversed(getDateOnly(selectedRequest?.creationDate))
          : "N/A",
      },
      {
        label: "Time",
        value: getTimeOnly(selectedRequest?.creationTime) || "N/A",
      },
    ],
  },
];

export const mainInvRequestCustomRightBarConfig = [
  { label: "Item", value: "storeTransactionDetailsItemName" },
  { label: "Qty", value: "storeTransactionDetailRequestQty" },
];

export const getMainInvRequestTabs = (selectedRequest) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedRequest}
        rightBarPreviewConfig={getMainInvRequestRightBarPreviewConfig(
          selectedRequest
        )}
      />
    ),
  },
  {
    label: "Items",
    key: "2",
    children: (
      <CustomRightBarTab
        data={selectedRequest?._TrnDetailList}
        selectedItem={selectedRequest}
        customRightBarConfig={mainInvRequestCustomRightBarConfig}
      />
    ),
  },
];

//  Payroll Configurations

export const getPayrollRightBarHeaderConfig = (selectedEmployeeTransaction) => [
  {
    title: "Employee",
    value: selectedEmployeeTransaction?.personalName || "N/A",
  },
  {
    title: "Created Date",
    value:
      `${getDateOnly(selectedEmployeeTransaction?.personalApplyDate)} ${getTimeOnly(
        selectedEmployeeTransaction?.personalApplyDate
      )}` || "N/A",
  },
  {
    title: "Jop Name",
    value: selectedEmployeeTransaction?.jopName || "N/A",
  },
  {
    title: "Currency",
    value: selectedEmployeeTransaction?.currencyName || "N/A",
  },
  {
    title: "Department",
    value: selectedEmployeeTransaction?.departmentName || "N/A",
  },
];

// Payroll RightBar Config

export const getPayrollRightBarPreviewConfig = (
  selectedEmployeeTransaction
) => [
    {
      title: "Employee Details",
      fields: [
        {
          label: "Attendance ID",
          value: selectedEmployeeTransaction?.personalAttCode || "N/A",
        },
        {
          label: "Department",
          value: selectedEmployeeTransaction?.departmentName || "N/A",
        },
        { label: "Job", value: selectedEmployeeTransaction?.jopName || "N/A" },
      ],
    },
    {
      title: "Salary Information",
      fields: [
        {
          label: "Month Salary",
          value: selectedEmployeeTransaction
            ? `${selectedEmployeeTransaction?.currencyName} ${PriceFormatter(
              selectedEmployeeTransaction?.monthSalary
            )}`
            : "N/A",
        },
        {
          label: "Day Salary",
          value: selectedEmployeeTransaction
            ? `${selectedEmployeeTransaction?.currencyName} ${PriceFormatter(
              selectedEmployeeTransaction?.daySalary
            )}`
            : "N/A",
        },
        {
          label: "Hour Salary",
          value: selectedEmployeeTransaction
            ? `${selectedEmployeeTransaction?.currencyName} ${PriceFormatter(
              selectedEmployeeTransaction?.hourSalary
            )}`
            : "N/A",
        },
      ],
    },
    {
      title: "Work Data",
      fields: [
        {
          label: "Total Work Days",
          value: selectedEmployeeTransaction?.totalWorkday ?? "N/A",
        },
        {
          label: "Working Days",
          value: selectedEmployeeTransaction?.dayTransactionWorkingDay ?? "N/A",
        },
        {
          label: "Official Vacation",
          value:
            selectedEmployeeTransaction?.dayTransactionOfficialVacation ?? "N/A",
        },
        {
          label: "Annual Vacation",
          value:
            selectedEmployeeTransaction?.dayTransactionYerlyVacation ?? "N/A",
        },
        {
          label: "Weekly Off",
          value: selectedEmployeeTransaction?.dayTransactionWfreeDay ?? "N/A",
        },
        {
          label: "Sick Days",
          value: selectedEmployeeTransaction?.dayTransactionSick ?? "N/A",
        },
      ],
    },
    {
      title: "Additional",
      fields: [
        {
          label: "Overtime Days",
          value: selectedEmployeeTransaction?.dayTransactionOverTime ?? "N/A",
        },
        {
          label: "Extra Days",
          value:
            selectedEmployeeTransaction?.dayTransactionExtraDayToPay ?? "N/A",
        },
        {
          label: "Permission Absence Days",
          value:
            selectedEmployeeTransaction?.dayTransactionAbsentWpermestion ?? "N/A",
        },
        {
          label: "Bonus",
          value: selectedEmployeeTransaction
            ? `${selectedEmployeeTransaction?.currencyName} ${PriceFormatter(
              selectedEmployeeTransaction?.dayTransactionBounuses
            )}`
            : "N/A",
        },
        {
          label: "Allowance",
          value: selectedEmployeeTransaction
            ? `${selectedEmployeeTransaction?.currencyName} ${PriceFormatter(
              selectedEmployeeTransaction?.dayTransactionAllawance
            )}`
            : "N/A",
        },
        {
          label: "Add to Salary",
          value: selectedEmployeeTransaction
            ? `${selectedEmployeeTransaction?.currencyName} ${PriceFormatter(
              selectedEmployeeTransaction?.addToSalary
            )}`
            : "N/A",
        },
      ],
    },
    {
      title: "Deductions",
      fields: [
        {
          label: "Non-Permission Absence Days",
          value:
            selectedEmployeeTransaction?.dayTransactionAbsentWoutPermestion ??
            "N/A",
        },
        {
          label: "Deduction Days",
          value: selectedEmployeeTransaction?.dayTransactionDeductionDay ?? "N/A",
        },
        {
          label: "Deduction Amount",
          value:
            selectedEmployeeTransaction?.dayTransactionDeductionAmount ?? "N/A",
        },
        {
          label: "Deduct  From Salary",
          value:
            PriceFormatter(selectedEmployeeTransaction?.deductFromSalary) ??
            "N/A",
        },
      ],
    },
  ];
export const getPayrollRightBarFooterConfig = (selectedEmployeeTransaction) => [
  {
    title: "Date",
    value:
      `${selectedEmployeeTransaction?.mon} ${selectedEmployeeTransaction && "/"}
          ${selectedEmployeeTransaction?.year}` || "N/A",
  },
  {
    title: "SubTotal",
    value: `USD ${selectedEmployeeTransaction?.currencyName || ""} ${new Intl.NumberFormat(
      "en-US",
      {
        maximumFractionDigits: 3,
        minimumFractionDigits: 2,
      }
    ).format(selectedEmployeeTransaction?.total1 || 0)}`,
  },
  {
    title: "Total Deductions",
    value: `USD ${selectedEmployeeTransaction?.currencyName || ""} ${new Intl.NumberFormat(
      "en-US",
      {
        maximumFractionDigits: 3,
        minimumFractionDigits: 2,
      }
    ).format(selectedEmployeeTransaction?.total2 || 0)}`,
  },
  {
    title: "Total Dues",
    value: `USD ${selectedEmployeeTransaction?.currencyName || ""} ${new Intl.NumberFormat(
      "en-US",
      {
        maximumFractionDigits: 3,
        minimumFractionDigits: 2,
      }
    ).format(selectedEmployeeTransaction?.total || 0)}`,
  },
];

export const getPayrollTabs = (selectedEmployeeTransaction) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedEmployeeTransaction}
        rightBarPreviewConfig={getPayrollRightBarPreviewConfig(
          selectedEmployeeTransaction
        )}
      />
    ),
  },
  {
    label: "Logs",
    key: "2",
    children: <div className="logs-empty no-content">No Data available.</div>,
  },
  // {
  //   label: "Total Preview",
  //   key: "3",
  //   children: <PayrollTotalPreview />,
  // },
];

// ZAS Flights RightBar
export const getFlightRightBarPreviewConfig = (selectedZasClient) => [
  {
    title: "CAD Information",
    fields: [
      {
        label: "ZAS Reference",
        value: selectedZasClient?.flightPermitRefrance,
      },
      { label: "CAD Permit", value: selectedZasClient?.flightPermitNumber },
      {
        label: "CAD Date",
        value: `${getDateOnly(selectedZasClient?.flightJobOrderCreateDate)} ${getTimeOnly(selectedZasClient?.flightJobOrderCreateDate)}`,
      },
    ],
  },
  {
    title: "Aircraft Information",
    fields: [
      { label: "A/C Type", value: selectedZasClient?.flightAreCraftTypeName },
      { label: "MTOW", value: selectedZasClient?.flightMaxTakeOffWight },
      { label: "Registration", value: selectedZasClient?.flightRegsiterNumber },
      { label: "Flight Type", value: selectedZasClient?.flightFlighTypeName },
      { label: "Purpose", value: selectedZasClient?.flightPerpusName },
    ],
  },
  {
    title: "Client Information",
    fields: [
      { label: "Agent", value: selectedZasClient?.flightAgentName },
      { label: "Operator", value: selectedZasClient?.flightOperatorName },
      { label: "Invoice To", value: selectedZasClient?.flightInvoicingToName },
      {
        label: "Fuel Invoice To",
        value: selectedZasClient?.flightFuelInvoiceTo,
      },
      {
        label: "Payment Method",
        value: selectedZasClient?.flightPaymentMethodName,
      },
    ],
  },
  {
    title: "Route",
    fields: [
      {
        label: "Route From",
        value: formatRoute(selectedZasClient?.flightRouteFromName),
      },
      {
        label: "Station",
        value: formatRoute(selectedZasClient?.flightRouteStationName),
      },
      {
        label: "Route To",
        value: formatRoute(selectedZasClient?.flightRouteToName),
      },
    ],
  },
  {
    title: "Schedule Time (UTC)",
    fields: [
      {
        label: "STA",
        value: `${getDateOnly(selectedZasClient?.flightStimatedArrivalTime)} ${getTimeOnly(selectedZasClient?.flightStimatedArrivalTime)}`,
      },
      {
        label: "STD",
        value: `${getDateOnly(selectedZasClient?.flightStimatedTakeOffTime)} ${getTimeOnly(selectedZasClient?.flightStimatedTakeOffTime)}`,
      },
    ],
  },
  {
    title: "ATA Time (UTC)",
    fields: [
      {
        label: "ATA",
        value: `${getDateOnly(selectedZasClient?.flightEta)} ${getTimeOnly(selectedZasClient?.flightEta)}`,
      },
      {
        label: "Touch Down",
        value: `${getDateOnly(selectedZasClient?.flightAcctualArrivalTime)} ${getTimeOnly(selectedZasClient?.flightAcctualArrivalTime)}`,
      },
      {
        label: "Chocks On",
        value: `${getDateOnly(selectedZasClient?.flightAtashoks)} ${getTimeOnly(selectedZasClient?.flightAtashoks)}`,
      },
    ],
  },
  {
    title: "ATD Time (UTC)",
    fields: [
      {
        label: "ATD",
        value: `${getDateOnly(selectedZasClient?.flightEtd)} ${getTimeOnly(selectedZasClient?.flightEtd)}`,
      },
      {
        label: "Chocks Off",
        value: `${getDateOnly(selectedZasClient?.flightAtdshocks)} ${getTimeOnly(selectedZasClient?.flightAtdshocks)}`,
      },
      {
        label: "Airborne",
        value: `${getDateOnly(selectedZasClient?.flightAcctualTakeOffTime)} ${getTimeOnly(selectedZasClient?.flightAcctualTakeOffTime)}`,
      },
    ],
  },
  {
    title: "PIC Information",
    fields: [
      { label: "Name", value: selectedZasClient?.flightPicName },
      { label: "Email", value: selectedZasClient?.flightPicEmail },
      { label: "Remarks", value: selectedZasClient?.flightPicNotes },
    ],
  },
];

export const getZasFlightsRightBarHeaderConfig = (selectedZasClient) => [
  {
    title: "Created By",
    value: selectedZasClient?.flightCreatedByUserName || "N/A",
  },
  {
    title: "Created Date",
    value: `${getDateOnly(selectedZasClient?.flightCreationDate)} ${getTimeOnly(
      selectedZasClient?.flightCreationDate
    )}`,
  },
  {
    title: "Trip Number",
    value: selectedZasClient?.flightZasRefrance || "N/A",
  },
  {
    title: "Flight Status",
    value: selectedZasClient?.flightStatusName || "N/A",
  },
  { title: "Flight Number", value: selectedZasClient?.flightNumber || "N/A" },
];

export const getZasFlightsTabs = (selectedZasClient) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedZasClient}
        rightBarPreviewConfig={getFlightRightBarPreviewConfig(
          selectedZasClient
        )}
      />
    ),
  },
];

// Month Summary RightBar Configurations
export const getMonthSummaryRightBarHeaderConfig = (selectedSummary) => [
  {
    title: "Employee",
    value: selectedSummary?.personalName || "N/A",
  },
  {
    title: "Department",
    value: selectedSummary?.departmentName || "N/A",
  },
  {
    title: "Job",
    value: selectedSummary?.jopName || "N/A",
  },
  {
    title: "Working Days",
    value: selectedSummary?.dayTransactionWorkingDay,
  },
  {
    title: "Net Work Day",
    value: selectedSummary?.vNetWorkDay,
  },
];

export const getMonthSummaryRightBarPreviewConfig = (selectedSummary) => [
  {
    title: "Summary Information",
    fields: [
      {
        label: "Employee",
        value: selectedSummary?.personalName || "N/A",
      },
      {
        label: "Department",
        value: selectedSummary?.departmentName || "N/A",
      },
      {
        label: "Job",
        value: selectedSummary?.jopName || "N/A",
      },
      {
        label: "Working Day",
        value: selectedSummary?.dayTransactionWorkingDay,
      },
      {
        label: "Free Day",
        value: selectedSummary?.dayTransactionWfreeDay,
      },
      {
        label: "Yearly Vacation",
        value: selectedSummary?.dayTransactionYerlyVacation,
      },
      {
        label: "Official Vacation",
        value: selectedSummary?.dayTransactionOfficialVacation,
      },
      {
        label: "Over Time",
        value: selectedSummary?.dayTransactionOverTime,
      },
      {
        label: "Extra Day To Pay",
        value: selectedSummary?.dayTransactionExtraDayToPay,
      },
      {
        label: "Total Workday",
        value: selectedSummary?.totalWorkday,
      },
      {
        label: "Absent With Permission",
        value: selectedSummary?.dayTransactionAbsentWpermestion,
      },
      {
        label: "Absent Without Permission",
        value: selectedSummary?.dayTransactionAbsentWoutPermestion,
      },
      {
        label: "Non Work Day",
        value: selectedSummary?.nonWorkDay,
      },
      {
        label: "Fire Before End",
        value: selectedSummary?.fireBeforEnd,
      },
      {
        label: "Deduction Day",
        value: selectedSummary?.dayTransactionDeductionDay,
      },
      {
        label: "Sick",
        value: selectedSummary?.dayTransactionSick,
      },
      {
        label: "Net Work Day",
        value: selectedSummary?.vNetWorkDay,
      },
    ],
  },
];

export const getMonthSummaryTabs = (selectedSummary) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedSummary}
        rightBarPreviewConfig={getMonthSummaryRightBarPreviewConfig(
          selectedSummary
        )}
      />
    ),
  },
  {
    label: "Activity",
    key: "2",
    children: <div className="logs-empty no-content">No Data available.</div>,
  },
];

// Items RightBar Configurations
export const getItemRightBarHeaderConfig = (selectedPurItem) => {
  if (!selectedPurItem) return [];
  return [
    { title: "Item Name", value: selectedPurItem?.purItemName || "N/A" },
    { title: "Item Group", value: selectedPurItem?.purItemGroupName || "N/A" },
    {
      title: "Packaging",
      value: selectedPurItem?.purItemPackagingName || "N/A",
    },
    {
      title: "Unit",
      value: `${selectedPurItem?.purItemUnitName}`,
    },
  ];
};

export const getPurchasingSupplierRightBarHeaderConfig = (selectedPurSupplier) => {
  if (!selectedPurSupplier) return [];
  return [
    { title: "Supplier Name", value: selectedPurSupplier?.suppliersName || "N/A" },
    { title: "Phone", value: selectedPurSupplier?.suppliersMobile || "N/A" },
    {
      title: "Address",
      value: selectedPurSupplier?.suppliersAddress || "N/A",
    },
    {
      title: "Phone (Landline)",
      value: `${selectedPurSupplier?.suppliersPhone}`,
    },
  ];
};

export const itemCustomRightBarConfig = [
  {
    label: "Date",
    value: "storeTransactionTotalDate",
    render: (item) => reversed(item?.storeTransactionTotalDate),
  },
  {
    label: "In Qty.",
    value: "inQty",
  },
  {
    label: "Out Qty.",
    value: "outQty",
  },
];

export const getItemRightBarPreviewConfig = (selectedPurItem) => [
  {
    title: "Item Information",
    fields: [
      {
        label: "Item Name",
        value: selectedPurItem?.purItemName || "N/A",
      },
      {
        label: "Group",
        value: selectedPurItem?.purItemGroupName || "N/A",
      },
      {
        label: "Sub Group",
        value: selectedPurItem?.purItemSubGroupName || "N/A",
      },
      {
        label: "Brand",
        value: selectedPurItem?.purItemBrandName || "N/A",
      },
      {
        label: "Unit",
        value: selectedPurItem?.purItemUnitName || "N/A",
      },
      {
        label: "Price",
        value: selectedPurItem?.purItemPrice || "N/A",
      },
      {
        label: "Supplier Name",
        value: selectedPurItem?.purItemSupplierName || "N/A",
      },
      {
        label: "Kind",
        value: selectedPurItem?.purItemKindName || "N/A",
      },
      {
        label: "Convert Value",
        value: selectedPurItem?.purItemConvertValue || "N/A",
      },
    ],
  },
];

export const getPurchasingSupplierRightBarPreviewConfig = (selectedPurSupplier) => [
  {
    title: "Supplier Information",
    fields: [
      {
        label: "Credit Limit",
        value: selectedPurSupplier?.supplierCashAmount || "N/A",
      },
      {
        label: "Commercial Registration",
        value: selectedPurSupplier?.suppliersTaxfile || "N/A",
      },
      {
        label: "Tax Card",
        value: selectedPurSupplier?.suppliersTaxCard || "N/A",
      },
    ],
  },
  {
    title: "Bank Information",
    fields: [
      {
        label: "Bnak Name",
        value: selectedPurSupplier?.suppliersBankName || "N/A",
      },
      {
        label: "Bnak Address",
        value: selectedPurSupplier?.suppliersBankBranchAddress || "N/A",
      },
      {
        label: "Bank Branch",
        value: selectedPurSupplier?.suppliersBankBranch || "N/A",
      },
      {
        label: "Swift Code",
        value: selectedPurSupplier?.suppliersBankSwiftCode || "N/A",
      },
      {
        label: "Sort Code",
        value: selectedPurSupplier?.suppliersBankSortCode || "N/A",
      },
      {
        label: "Beneficiary Name",
        value: selectedPurSupplier?.suppliersBankBeneficiaryName || "N/A",
      },
    ],
  },
  {
    title: "Sales Man Information",
    fields: [
      {
        label: "Name",
        value: selectedPurSupplier?.suppliersSalesManName || "N/A",
      },
      {
        label: "Email",
        value: selectedPurSupplier?.suppliersSalesManMail || "N/A",
      },
      {
        label: "Phone",
        value: selectedPurSupplier?.suppliersSalesManMobil || "N/A",
      }
    ],
  },
  {
    title: "Sales Representative Information",
    fields: [
      {
        label: "Name",
        value: selectedPurSupplier?.suppliersRepresentativeName || "N/A",
      },
      {
        label: "Email",
        value: selectedPurSupplier?.suppliersRepresentativeMail || "N/A",
      },
      {
        label: "Phone",
        value: selectedPurSupplier?.suppliersRepresentativeMobil || "N/A",
      }
    ],
  },
  {
    title: "General Manager Information",
    fields: [
      {
        label: "Name",
        value: selectedPurSupplier?.suppliersGeneralManagerName || "N/A",
      },
      {
        label: "Email",
        value: selectedPurSupplier?.suppliersGeneralManagerMail || "N/A",
      },
      {
        label: "Phone",
        value: selectedPurSupplier?.suppliersGeneralManagerMobil || "N/A",
      }
    ],
  },
];

export const getItemRightBarFooterConfig = (selectedPurItem) => [
  {
    title: "Balance",
    value: selectedPurItem?.balance ?? "0",
  },
];

export const getItemTabs = (selectedPurItem) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedPurItem}
        rightBarPreviewConfig={getItemRightBarPreviewConfig(selectedPurItem)}
      />
    ),
  },
  {
    label: "Activity",
    key: "2",
    children: <div className="logs-empty no-content">No Data available.</div>,
  },
];

export const getPurSupplierTabs = (selectedPurSupplier) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedPurSupplier}
        rightBarPreviewConfig={getPurchasingSupplierRightBarPreviewConfig(selectedPurSupplier)}
      />
    ),
  }
];

// Food Item RightBar Configurations
export const getFoodItemRightBarHeaderConfig = (selectedFoodItem) => {
  if (!selectedFoodItem) return [];
  return [
    { title: "Item Name", value: selectedFoodItem?.foodMenuItemName || "N/A" },
    {
      title: "Item Group",
      value: selectedFoodItem?.foodMenuItemGroupName || "N/A",
    },
    {
      title: "Item Sub Group",
      value: selectedFoodItem?.foodMenuItemSubGroupName || "N/A",
    },
    {
      title: "Unit",
      value: `${selectedFoodItem?.foodMenuItemUnitName} ${selectedFoodItem?.foodMenuItemUnitValue}`,
    },
  ];
};

export const foodItemCustomRightBarConfig = [
  {
    label: "item",
    value: "foodMenuItemRecibePurItemItemName",
  },
  {
    label: "Qty.",
    value: "foodMenuItemRecibeQty",
  },
  {
    label: "Unit",
    value: "foodMenuItemRecibePurItemUnitName",
  },
];

export const getFoodItemRightBarPreviewConfig = (selectedFoodItem) => [
  {
    title: "Item Information",
    fields: [
      {
        label: "Item Name",
        value: selectedFoodItem?.purItemName || "N/A",
      },
      {
        label: "Group",
        value: selectedFoodItem?.purItemGroupName || "N/A",
      },
      {
        label: "Sub Group",
        value: selectedFoodItem?.purItemSubGroupName || "N/A",
      },
      {
        label: "Brand",
        value: selectedFoodItem?.purItemBrandName || "N/A",
      },
      {
        label: "Unit",
        value: selectedFoodItem?.purItemUnitName || "N/A",
      },
      {
        label: "Price",
        value: selectedFoodItem?.purItemPrice || "N/A",
      },
      {
        label: "Supplier Name",
        value: selectedFoodItem?.purItemSupplierName || "N/A",
      },
      {
        label: "Kind",
        value: selectedFoodItem?.purItemKindName || "N/A",
      },
      {
        label: "Convert Value",
        value: selectedFoodItem?.purItemConvertValue || "N/A",
      },
    ],
  },
];

export const getFoodItemRightBarFooterConfig = (selectedFoodItem) => [
  // {
  //   title: "Balance",
  //   value: selectedFoodItem?.balance ?? "0",
  // },
];

export const getFoodItemTabs = (selectedFoodItem, data, isLoading) => [
  {
    label: "Ricpe",
    key: "1",
    children: (
      <CustomRightBarTab
        data={data}
        isLoading={isLoading}
        selectedItem={selectedFoodItem}
        customRightBarConfig={foodItemCustomRightBarConfig}
      />
    ),
  },
];

// In Out Transaction Report RightBar Configurations
export const getInOutTransactionReportRightBarHeaderConfig = (
  selectedTransaction
) => [
    {
      title: "Employee",
      value: selectedTransaction?.personalName || "N/A",
    },
    {
      title: "Job",
      value: selectedTransaction?.jopName || "N/A",
    },
    {
      title: "Date",
      value: getDateOnly(selectedTransaction?.attendDate) || "N/A",
    },
    {
      title: "Attend Time",
      value: selectedTransaction?.attendTime || "N/A",
    },
    {
      title: "Leave Time",
      value: selectedTransaction?.leaveTime || "N/A",
    },
    {
      title: "Total Hours",
      value: selectedTransaction?.totalHours || "N/A",
    },
  ];

export const getInOutTransactionReportRightBarPreviewConfig = (
  selectedTransaction
) => [
    {
      title: "Transaction Information",
      fields: [
        { label: "Employee", value: selectedTransaction?.personalName || "N/A" },
        { label: "Job", value: selectedTransaction?.jopName || "N/A" },
        {
          label: "Date",
          value: getDateOnly(selectedTransaction?.attendDate) || "N/A",
        },
        { label: "Attend Time", value: selectedTransaction?.attendTime || "N/A" },
        { label: "Leave Time", value: selectedTransaction?.leaveTime || "N/A" },
        { label: "Total Hours", value: selectedTransaction?.totalHours || "N/A" },
        { label: "Time In Min", value: selectedTransaction?.timeInMin || "N/A" },
        {
          label: "Working",
          value: selectedTransaction?.trnWorking ? "Yes" : "No",
        },
        {
          label: "Work Free Day",
          value: selectedTransaction?.trnWorkFreeDay ? "Yes" : "No",
        },
        { label: "Sick", value: selectedTransaction?.trnSick ? "Yes" : "No" },
        {
          label: "Absent With Permission",
          value: selectedTransaction?.trnAbsentWithPermetion ? "Yes" : "No",
        },
        {
          label: "Absent Without Permission",
          value: selectedTransaction?.trnAbsentWithoutPermetion ? "Yes" : "No",
        },
        {
          label: "Official Vacation",
          value: selectedTransaction?.trnOfficialVacation ? "Yes" : "No",
        },
        {
          label: "Extra Day To Pay",
          value: selectedTransaction?.trnExtraDayToPay ? "Yes" : "No",
        },
      ],
    },
  ];

export const getInOutTransactionReportTabs = (selectedTransaction) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedTransaction}
        rightBarPreviewConfig={getInOutTransactionReportRightBarPreviewConfig(
          selectedTransaction
        )}
      />
    ),
  },
  {
    label: "Activity",
    key: "2",
    children: <div className="logs-empty no-content">No Data available.</div>,
  },
];

// In Out Report For All RightBar Configurations
export const getInOutReportForAllRightBarHeaderConfig = (selectedEmployee) => [
  {
    title: "Employee",
    value: selectedEmployee?.personalName || "N/A",
  },
  {
    title: "Department",
    value: selectedEmployee?.departmentName || "N/A",
  },
  {
    title: "Job",
    value: selectedEmployee?.jopName || "N/A",
  },
  {
    title: "Working Days",
    value: selectedEmployee?.dayTransactionWorkingDay || "0",
  },
  {
    title: "Work Hours",
    value: selectedEmployee?.dayTransactionWHours || "0",
  },
];

export const getInOutReportForAllRightBarPreviewConfig = (selectedEmployee) => [
  {
    title: "Employee Information",
    fields: [
      {
        label: "Employee Name",
        value: selectedEmployee?.personalName || "N/A",
      },
      {
        label: "Department",
        value: selectedEmployee?.departmentName || "N/A",
      },
      {
        label: "Job",
        value: selectedEmployee?.jopName || "N/A",
      },
      {
        label: "Working Per Day",
        value: selectedEmployee?.personalWorkingPerDay || "N/A",
      },
    ],
  },
  {
    title: "Work Data",
    fields: [
      {
        label: "Working Days",
        value: selectedEmployee?.dayTransactionWorkingDay || "0",
      },
      {
        label: "Work Hours",
        value: selectedEmployee?.dayTransactionWHours || "0",
      },
      {
        label: "Overtime Days",
        value: selectedEmployee?.dayTransactionOverTime || "0",
      },
      {
        label: "Overtime Hours",
        value: selectedEmployee?.dayTransactionOHours || "0",
      },
    ],
  },
  {
    title: "Vacations & Absences",
    fields: [
      {
        label: "Work Free Days",
        value: selectedEmployee?.dayTransactionWfreeDay || "0",
      },
      {
        label: "Sick Days",
        value: selectedEmployee?.dayTransactionSick || "0",
      },
      {
        label: "Sick Days (Company Pay)",
        value: selectedEmployee?.dayTransactionSickCompanyPay || "0",
      },
      {
        label: "Absent With Permission",
        value: selectedEmployee?.dayTransactionAbsentWpermestion || "0",
      },
      {
        label: "Absent Without Permission",
        value: selectedEmployee?.dayTransactionAbsentWoutPermestion || "0",
      },
      {
        label: "Official Vacation",
        value: selectedEmployee?.dayTransactionOfficialVacation || "0",
      },
      {
        label: "Yearly Vacation",
        value: selectedEmployee?.dayTransactionYerlyVacation || "0",
      },
    ],
  },
  {
    title: "Additional Days & Deductions",
    fields: [
      {
        label: "Extra Day To Pay",
        value: selectedEmployee?.dayTransactionExtraDayToPay || "0",
      },
      {
        label: "Deduction Days",
        value: selectedEmployee?.dayTransactionDeductionDay || "0",
      },
      {
        label: "Deduction Days (Company Pay)",
        value: selectedEmployee?.dayTransactionDeductionDayCompanyPay || "0",
      },
      {
        label: "Deduction Amount",
        value: selectedEmployee?.dayTransactionDeductionAmount || "0",
      },
      {
        label: "Deduction Amount (Company Pay)",
        value: selectedEmployee?.dayTransactionDeductionAmountCompanyPay || "0",
      },
    ],
  },
  {
    title: "Allowances & Bonuses",
    fields: [
      {
        label: "Allowance",
        value: selectedEmployee?.dayTransactionAllawance || "0",
      },
      {
        label: "Bonuses",
        value: selectedEmployee?.dayTransactionBounuses || "0",
      },
    ],
  },
];

export const getInOutReportForAllTabs = (selectedEmployee) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedEmployee}
        rightBarPreviewConfig={getInOutReportForAllRightBarPreviewConfig(
          selectedEmployee
        )}
      />
    ),
  },
  {
    label: "Activity",
    key: "2",
    children: <div className="logs-empty no-content">No Data available.</div>,
  },
];

// RightBar Header Config
export const getCvApplicationRightBarHeaderConfig = (selectedPerson) => [
  {
    title: "Personal Name",
    value: selectedPerson?.personalName || "N/A",
  },
  {
    title: "Created Date",
    value: selectedPerson?.createdDate
      ? `${new Date(selectedPerson.createdDate).toLocaleDateString()} ${new Date(selectedPerson.createdDate).toLocaleTimeString()}`
      : "N/A",
  },
  {
    title: "Phone",
    value: selectedPerson?.personalPhone || "N/A",
  },
  {
    title: "Status",
    value: selectedPerson?.personalCvStatusName || "N/A",
  },
  {
    title: "City",
    value: selectedPerson?.personalCityName || "N/A",
  },
];

// RightBar Preview Config
export const geCvApplicationRightBarPreviewConfig = (selectedPerson) => [
  {
    title: "Personal Information",
    fields: [
      {
        label: "Full Name",
        value: `${selectedPerson?.personalCvFirstName || ""} ${selectedPerson?.personalCvMedilName || ""} ${selectedPerson?.personalCvLastName || ""}`,
      },
      {
        label: "Phone",
        value: selectedPerson?.personalPhone || "N/A",
      },
      {
        label: "Email",
        value: selectedPerson?.personalMail || "N/A",
      },
      {
        label: "Gender",
        value: selectedPerson?.personalGenderName || "N/A",
      },
      {
        label: "Social Status",
        value: selectedPerson?.personalSocialName || "N/A",
      },
      {
        label: "Department",
        value: selectedPerson?.personalDepartmentName || "N/A",
      },
      {
        label: "Job",
        value: selectedPerson?.personalJopName || "N/A",
      },
      {
        label: "Address",
        value: `${selectedPerson?.personalStreet || ""}, ${selectedPerson?.personalCityName || ""}`,
      },
      {
        label: "CV Note",
        value: selectedPerson?.personalCvCoverNote || "N/A",
      },
    ],
  },
  {
    title: "Online Profiles",
    fields: [
      {
        label: "LinkedIn",
        value: selectedPerson?.personalCvLinkedInProfile || "N/A",
      },
      {
        label: "GitHub",
        value: selectedPerson?.personalCvGithubProfile || "N/A",
      },
    ],
  },
  {
    title: "Education",
    fields:
      selectedPerson?.peronalCvsEducations?.map((edu, index) => ({
        label: `Education ${index + 1}`,
        value: `${edu.peronalCvEducationInstitution} - Degree: ${edu.peronalCvEducationDegree}, Year: ${edu.peronalCvEducationGraduationYear}`,
      })) || [],
  },
  {
    title: "Work Experience",
    fields:
      selectedPerson?.personalCvsWorkExperiences?.map((exp, index) => ({
        label: `Experience ${index + 1}`,
        value: `${exp.personalCvsWorkExperienceCompanyName} - ${exp.personalCvsWorkExperienceRole} (${exp.personalCvsWorkExperienceYear} years)`,
      })) || [],
  },
];

// Tabs Configuration
export const getCvApplicationTabs = (selectedPerson) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedPerson}
        rightBarPreviewConfig={geCvApplicationRightBarPreviewConfig(
          selectedPerson
        )}
      />
    ),
  },
];

// Additions/Deductions RightBar Configurations

export const getAdditionRightBarHeaderConfig = (selectedAdditionRecord) => {
  if (!selectedAdditionRecord) return [];
  return [
    {
      title: "Employee",
      value: selectedAdditionRecord?.personalAddPersonalName || "N/A",
    },
    {
      title: "Date",
      value: getDateOnly(selectedAdditionRecord?.personalAddDate) || "N/A",
    },
    {
      title: "Reason",
      value: selectedAdditionRecord?.personalAddCodeAddName || "N/A",
    },
    {
      title: "Value",
      value: `EGP ${PriceFormatter(
        selectedAdditionRecord?.personalAddCodeAddId
          ? selectedAdditionRecord?.personalAddValue
          : selectedAdditionRecord?.personalAddEntryValue
      )}`,
    },
  ];
};

export const getAdditionRightBarPreviewConfig = (selectedAdditionRecord) => {
  if (!selectedAdditionRecord) return [];
  return [
    {
      title: "Record Information",
      fields: [
        {
          label: "Date",
          value: getDateOnly(selectedAdditionRecord?.personalAddDate),
        },
        {
          label: "Reason",
          value: selectedAdditionRecord?.personalAddCodeAddName || "N/A",
        },
        {
          label: "Days",
          value: selectedAdditionRecord?.personalAddDay || "N/A",
        },
        {
          label: "Value",
          value: `EGP ${PriceFormatter(
            selectedAdditionRecord?.personalAddCodeAddId
              ? selectedAdditionRecord?.personalAddValue
              : selectedAdditionRecord?.personalAddEntryValue
          )}`,
        },
        {
          label: "Remark",
          value: selectedAdditionRecord?.personalAddRemark || "N/A",
        },
      ],
    },
  ];
};

export const getAdditionTabs = (selectedAdditionRecord) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedAdditionRecord}
        rightBarPreviewConfig={getAdditionRightBarPreviewConfig(
          selectedAdditionRecord
        )}
      />
    ),
  },
  {
    label: "Activity",
    key: "2",
    children: <div className="logs-empty no-content">No Data available.</div>,
  },
];

// User Log RightBar Configurations
export const getUserLogRightBarHeaderConfig = (selectedUser) => [
  {
    title: "Name",
    value: selectedUser?.personalName || "N/A",
  },
  {
    title: "Department",
    value: selectedUser?.departmentName || "N/A",
  },
  {
    title: "Last Login",
    value: selectedUser?.lastLogin
      ? `${getDateOnly(selectedUser?.lastLogin)} ${getTimeOnly(selectedUser?.lastLogin)}`
      : "N/A",
  },
  {
    title: "Last Logout",
    value: selectedUser?.lastLogOut
      ? `${getDateOnly(selectedUser?.lastLogOut)} ${getTimeOnly(selectedUser?.lastLogOut)}`
      : "N/A",
  },
  {
    title: "From IP",
    value: selectedUser?.fromIp || "N/A",
  },
];

export const getUserLogRightBarPreviewConfig = (selectedUser) => [
  {
    title: "User Log Information",
    fields: [
      {
        label: "Name",
        value: selectedUser?.personalName || "N/A",
      },
      {
        label: "Department",
        value: selectedUser?.departmentName || "N/A",
      },
      {
        label: "Email Confirmed",
        value: selectedUser?.emailConfirmed ? "Yes" : "No",
      },
      {
        label: "Last Login",
        value: selectedUser?.lastLogin
          ? `${getDateOnly(selectedUser?.lastLogin)} ${getTimeOnly(selectedUser?.lastLogin)}`
          : "N/A",
      },
      {
        label: "Last Logout",
        value: selectedUser?.lastLogOut
          ? `${getDateOnly(selectedUser?.lastLogOut)} ${getTimeOnly(selectedUser?.lastLogOut)}`
          : "N/A",
      },
      {
        label: "From IP",
        value: selectedUser?.fromIp || "N/A",
      },
    ],
  },
];

export const getUserLogRightBarTabs = (selectedUser) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedUser}
        rightBarPreviewConfig={getUserLogRightBarPreviewConfig(selectedUser)}
      />
    ),
  },
];

// Cheque Book RightBar Configurations
export const getChequeBookRightBarHeaderConfig = (selectedChequeBook) => [
  {
    title: "Cheque Book No.",
    value: selectedChequeBook?.checkSerialsTotalCoverNo || "N/A",
  },
  {
    title: "Bank",
    value: selectedChequeBook?.checkSerialsTotalBankName || "N/A",
  },
  {
    title: "Account Name",
    value: selectedChequeBook?.checkSerialsTotalBankAccName || "N/A",
  },
  {
    title: "Created By",
    value: selectedChequeBook?.checkSerialsTotalCreatedBy || "N/A",
  },
  {
    title: "Created Date",
    value: selectedChequeBook?.checkSerialsTotalCreatedDate
      ? `${getDateOnly(selectedChequeBook?.checkSerialsTotalCreatedDate)} ${getTimeOnly(selectedChequeBook?.checkSerialsTotalCreatedDate)}`
      : "N/A",
  },
];

export const getChequeBookRightBarPreviewConfig = (selectedChequeBook) => [
  {
    title: "Cheque Book Information",
    fields: [
      {
        label: "Cheque Book No.",
        value: selectedChequeBook?.checkSerialsTotalCoverNo || "N/A",
      },
      {
        label: "Bank",
        value: selectedChequeBook?.checkSerialsTotalBankName || "N/A",
      },
      {
        label: "Account Name",
        value: selectedChequeBook?.checkSerialsTotalBankAccName || "N/A",
      },
      {
        label: "Created By",
        value: selectedChequeBook?.checkSerialsTotalCreatedBy || "N/A",
      },
      {
        label: "Created Date",
        value: selectedChequeBook?.checkSerialsTotalCreatedDate
          ? `${getDateOnly(selectedChequeBook?.checkSerialsTotalCreatedDate)} ${getTimeOnly(selectedChequeBook?.checkSerialsTotalCreatedDate)}`
          : "N/A",
      },
      {
        label: "Date",
        value: selectedChequeBook?.checkSerialsTotalDate
          ? getDateOnly(selectedChequeBook?.checkSerialsTotalDate)
          : "N/A",
      },
      {
        label: "From Cheque No.",
        value: selectedChequeBook?.checkSerialsTotalBegNo || "N/A",
      },
      {
        label: "To Cheque No.",
        value: selectedChequeBook?.checkSerialsTotalEndNo || "N/A",
      },
    ],
  },
];

export const getChequeBookRightBarTabs = (selectedChequeBook) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedChequeBook}
        rightBarPreviewConfig={getChequeBookRightBarPreviewConfig(
          selectedChequeBook
        )}
      />
    ),
  },
  {
    label: "Activity",
    key: "2",
    children: <div className="logs-empty no-content">No Data available.</div>,
  },
];

// Taste Order Configurations
export const getTasteOrderPreviewConfig = (selectedTasteOrder) => [
  {
    title: "Taste Order Information",
    fields: [
      {
        label: "Kind Name",
        value: selectedTasteOrder?.tasteFoodRequestHeaderKindName || "N/A",
      },
      {
        label: "Creator",
        value: selectedTasteOrder?.tasteFoodRequestHeaderCreatorName || "N/A",
      },
      {
        label: "Status",
        value: selectedTasteOrder?.tasteFoodRequestHeaderStatusName || "N/A",
      },
      {
        label: "Created Date",
        value: selectedTasteOrder?.tasteFoodRequestHeaderDateTime
          ? getDateOnly(selectedTasteOrder?.tasteFoodRequestHeaderDateTime)
          : "N/A",
      },
      {
        label: "Created Time",
        value: selectedTasteOrder?.tasteFoodRequestHeaderDateTime
          ? getTimeOnly(selectedTasteOrder?.tasteFoodRequestHeaderDateTime)
          : "N/A",
      },
    ],
  },
];

export const getTasteOrderHeaderConfig = (selectedTasteOrder) => [
  {
    title: "Created By",
    value: selectedTasteOrder?.tasteFoodRequestHeaderCreatorName || "N/A",
  },
  {
    title: "Created Date",
    value:
      `${getDateOnly(selectedTasteOrder?.tasteFoodRequestHeaderDateTime)} ${getTimeOnly(
        selectedTasteOrder?.tasteFoodRequestHeaderDateTime
      )}` || "N/A",
  },
  {
    title: "Kind Name",
    value: selectedTasteOrder?.tasteFoodRequestHeaderKindName || "N/A",
  },
  {
    title: "Order Status",
    value: selectedTasteOrder?.tasteFoodRequestHeaderStatusName || "N/A",
  },
  {
    title: "Branch",
    value: selectedTasteOrder?.tasteFoodRequestHeaderBranchName || "N/A",
  },
];

export const tasteOrderCustomRightBarConfig = [
  { label: "Item", value: "tasteFoodRequestDetailsItemName" },
  { label: "Qty", value: "tasteFoodRequestDetailsSkyQty" },
];

export const getTasteOrderTabs = (selectedTasteOrder, data, isLoading) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedTasteOrder}
        rightBarPreviewConfig={getTasteOrderPreviewConfig(selectedTasteOrder)}
      />
    ),
  },
  {
    label: "Items",
    key: "2",
    children: (
      <CustomRightBarTab
        data={data?.tasteFoodRequestDetails || []}
        isLoading={isLoading}
        selectedItem={selectedTasteOrder}
        customRightBarConfig={tasteOrderCustomRightBarConfig}
      />
    ),
  },
  {
    label: "Activity",
    key: "3",
    children: <div className="logs-empty no-content">No Data available.</div>,
  },
];

// Car Job Order Configurations
export const getCarJobOrderHeaderConfig = (selectedCarJobOrder) => [
  {
    title: "Job Order No.",
    value: selectedCarJobOrder?.carJopOrderNumber || "N/A",
  },
  {
    title: "Car Name",
    value: selectedCarJobOrder?.carJopOrderCarName || "N/A",
  },
  {
    title: "Driver",
    value: selectedCarJobOrder?.carJopOrderDriverName || "N/A",
  },
  {
    title: "Creator",
    value:
      selectedCarJobOrder?.carJopOrderCreatorName ||
      selectedCarJobOrder?.carJopOrderCreatedBy ||
      "N/A",
  },
  {
    title: "Status",
    value: selectedCarJobOrder?.carJopOrderStatusName || "N/A",
  },
];

export const getCarJobOrderPreviewConfig = (selectedCarJobOrder) => [
  {
    title: "Job Order Information",
    fields: [
      { label: "Order ID", value: selectedCarJobOrder?.carJopOrderId || "N/A" },
      {
        label: "Plate Number",
        value: selectedCarJobOrder?.carJopOrderCarName || "N/A",
      },
      {
        label: "Reason",
        value: selectedCarJobOrder?.carJopOrderReasonName || "N/A",
      },
      {
        label: "Driver",
        value: selectedCarJobOrder?.carJopOrderDriverName || "N/A",
      },
      {
        label: "Assigned Employees",
        value:
          selectedCarJobOrder?._AssignedEmployees
            ?.map((emp) => emp.carJopOrderAssignedEmployeeEmployeeName)
            .join(", ") || "N/A",
      },
      { label: "Notes", value: selectedCarJobOrder?.jopOrderNotes?.length || "0" },
    ],
  },
];

export const getCarJobOrderTabs = (selectedCarJobOrder) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedCarJobOrder}
        rightBarPreviewConfig={getCarJobOrderPreviewConfig(selectedCarJobOrder)}
      />
    ),
  },
  {
    label: "Activity",
    key: "2",
    children: <div className="logs-empty no-content">No Data available.</div>,
  },
];

// Car Delivery Configurations
export const getCarDeliveryHeaderConfig = (selectedDelivery) => [
  {
    title: "Job Order No.",
    value: selectedDelivery?.carJopOrderNumber || "N/A",
  },
  {
    title: "Car Plate",
    value: selectedDelivery?.carJopOrderCarName || "N/A",
  },
  {
    title: "Driver",
    value: selectedDelivery?.carJopOrderDriverName || "N/A",
  },
  {
    title: "Status",
    value: selectedDelivery?.carJopOrderStatusName || "N/A",
  },
  {
    title: "Creator",
    value: selectedDelivery?.carJopOrderCreatorName || "N/A",
  },
];

export const getCarDeliveryPreviewConfig = (selectedDelivery) => [
  {
    title: "Job Order Information",
    fields: [
      {
        label: "Job Order ID",
        value: selectedDelivery?.carJopOrderId || "N/A",
      },
      {
        label: "Car Plate",
        value: selectedDelivery?.carJopOrderCarName || "N/A",
      },
      {
        label: "Driver",
        value: selectedDelivery?.carJopOrderDriverName || "N/A",
      },
      {
        label: "Assigned Employees",
        value:
          selectedDelivery?._AssignedEmployees
            ?.map((emp) => emp.carJopOrderAssignedEmployeeEmployeeName)
            .join(", ") || "N/A",
      },
      { label: "Notes", value: selectedDelivery?.carJopOrderNote || "N/A" },
    ],
  },
  ...(selectedDelivery?._CrTrnSalesOrder?.map((order, index) => ({
    title: `Sales Order ${index + 1}`,
    fields: [
      { label: "Order ID", value: order.header.orderHeaderId || "N/A" },
      { label: "Agent", value: order.header.orderHeaderAgentName || "N/A" },
      { label: "Bill to", value: order.header.orderHeaderBillToName || "N/A" },
      {
        label: "Customer",
        value: order.header.orderHeaderCutomerName || "N/A",
      },
      {
        label: "Flight Number",
        value: order.header.orderHeaderFlightNumberName || "N/A",
      },
      {
        label: "Operator",
        value: order.header.orderHeaderOperatorName || "N/A",
      },
    ],
  })) || []),
];

export const getCarDeliveryTabs = (selectedDelivery) => [
  {
    label: "Preview",
    key: "1",
    children: (
      <RightBarPreview
        selectedItem={selectedDelivery}
        rightBarPreviewConfig={getCarDeliveryPreviewConfig(selectedDelivery)}
      />
    ),
  },
  {
    label: "Activity",
    key: "2",
    children: <div className="logs-empty no-content">No Data available.</div>,
  },
];
