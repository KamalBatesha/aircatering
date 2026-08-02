import dayjs from "dayjs";

export const advancedSearchConfig = {
  "/HR/Coding/departments": ["Department ID", "Department Name"],
  "/HR/Coding/locations": ["Location ID", "Location Name"],
  "/HR/Coding/jobs": ["Job Title", "Job Type"],
  "/HR/Coding/educations": ["Education Level", "Institution Name"],
  "/HR/employees": ["Name", "Department", "Job Title", "Email"],
  "/HR/transaction/DailyTransaction": [
    "Name",
    "Department",
    "Job Title",
    "Email",
  ],
  "/Finance/Reports/CashTransactionReport": ["Transaction", "Document", "Date", "Remark"],
  "/Finance/Reports/CustodyBalanceReport": ["Name"],
  "/Finance/Reports/BankStatementReport": ["Transaction", "Date", "Remark"],
  "/Finance/Reports/ExpensesDetailReport": ["Supplier", "Date", "Group", "Sub Group", "Item"],
  "/Finance/Reports/InvoiceSummaryReport": ["Date"],
  "/Finance/Reports/CustomerBalance": ["Customer"],
  "/GM/Reports/MenuPricingList": ["Group", "Sub Group", "Item", "Price List", "Unit"],
  "/GM/Reports/SalesByItem": ["Grand Group", "Group", "Item", "Unit"],
  "/CateringManager/Reports/*": ["Name", "Packing", "Unit"],
  "/KitchenOperation/Reports/*": ["Name", "Packing", "Unit"],
  "/Payroll/*": ["Name", "Department", "Job Title", "Email"],
  "/HR/*": ["Name", "Department", "Job Title", "Email"],
  "/HR/employees/Pending": ["Name", "Department", "Job Title", "Email"],
  "/HR/employees/History": ["Name", "Department", "Job Title", "Email"],
  "/HR/Schedule/EmployeeSchedule": ["Name", "Department", "Job Title"],
  "/HR/InOut/EmployeesLogs": ["Name", "Department", "Job Title", "Email"],
  "/HR/Requests/LoanRequests": ["Name", "Department", "Job Title"],
  "/HR/Reports/InOutReportForAll": ["Name", "Department", "Job Title"],
  "/HR/InOut/Employees": ["Name", "Department", "Job Title"],
  "/HR/InOut/InList": ["Name", "Department", "Job Title"],
  "/HR/InOut/OutList": ["Name", "Department", "Job Title"],
  "/HR/InOut/All": ["Name", "Department", "Job Title"],
  "/HR/InOut/clockedIn": ["Name", "Department", "Job Title"],
  "/HR/InOut/clockedOut": ["Name", "Department", "Job Title"],
  "/Sales/*": ["Quotation No.", "Sales Person", "Flight No.", "Trip No.", "Operator", "Station"],
  "/QCT/QualityControl/OrderList": ["Quotation No.", "Sales Person", "Flight No.", "Trip No."],
  "/PD/Pickups/OrderList": ["Quotation No.", "Sales Person", "Flight No.", "Trip No."],
  "/InvoiceCollection/SalesOrders/*": ["Quotation No.", "Sales Person", "Flight No.", "Trip No."],
  "/InvoiceCollection/SalesInvoice/InvoiceList": ["Invoice No.", "Quotation No.", "Client"],
  "/InvoiceCollection/SalesInvoice/CreditNotes": ["Invoice No.", "Created By", "Note No.", "Customer", "Type"],
  "/InvoiceCollection/SalesInvoice/CollectionList": ["Transaction No.", "Created By", "Remark"],
  "/Sales/Orders/OrderList": [
    "Quotation No.",
    "Sales Person",
    "Flight No.",
    "Trip No.",
    "Operator",
    "Station",
  ],
  "/Sales/Orders/GMApproval": [
    "Quotation No.",
    "Sales Person",
    "Flight No.",
    "Trip No.",
  ],
  "/Operation/*": ["Quotation No.", "Sales Person", "Flight No.", "Operator", "Station"],
  "/CateringManager/KitchenOrders/KitchenOrders": [
    "Quotation No.",
    "Sales Person",
    "Flight No.",
  ],
  "/Cars/Logistics/Ride": [
    "Plate No.",
    "Reason",
    "Driver Name",
    "Date",
  ],
  "/CateringManager/GroundKitchenOrders/GroundKitchenOrders": [
    "Quotation No.",
    "Bill To",
  ],
  "/CateringManager/Inventory/*": ["Requesting Store", "Creator"],
  "/CateringManager/Taste/*": ["Kind Name", "Creator"],
  "/KitchenOperation/Taste/*": ["Kind Name", "Creator"],
  "/KitchenOperation/GroundOrders/OrderList": ["Quotation No.", "Sales Person", "Flight No."],
  "/KitchenOperation/Orders/OrderList": [
    "Quotation No.",
    "Sales Person",
    "Bill To",
  ],
  "/KitchenOperation/Orders/History": [
    "Quotation No.",
    "Sales Person",
    "Flight No.",
  ],
  "/KitchenOperation/Orders/IndividualOrders": [
    "Quotation No.",
    "Client Name",
    "Date",
  ],
  "/Operation/Quotations/IndividualOrders": [
    "Quotation No.",
    "Client Name",
    "Date",
  ],
  "/Sales/Quotations/IndividualQuotation": ["Quotation No.", "Sales Person", "Client Name",
    "Date"],

  "/PD/Pickups/IndividualOrders": [
    "Quotation No.",
    "Client Name",
    "Date",
  ],
  "/Operation/Quotations/GroundOrders": [
    "Quotation No.",
    "Sales Person",
    "Flight No.",
  ],
  "/GroundSales/Quotations/QuotationList": [
    "Quotation No.",
    "Sales Person",
    "Bill To",
  ],
  "/Operation/ZasFlight/FlightList": [
    "Trip No.",
    "ZAS Reference",
    "Flight No.",
    "Agent",
    "Operator",
  ],
  "/Operation/ZasFlight/RequestedFlight": [
    "Trip No.",
    "ZAS Reference",
    "Flight No.",
    "Agent",
    "Operator",
  ],
  "/Operation/ZasFlight/UnrequestedFlight": [
    "Trip No.",
    "ZAS Reference",
    "Flight No.",
    "Agent",
    "Operator",
  ],
  "/HR/Cvs/ApplicantsList": [
    "Serial No.",
    "Personal Name",
    "Phone",
    "Email",
    "City",
  ],
  "/Inventory/Main/*": ["Name", "Store", "Group"],
  "/Inventory/KitchenInventory/MainInvRequests": ["Name", "Store", "Group"],
  "/Inventory/KitchenInventory/DepartmentsRequests": ["Name", "Store", "Group"],
  "/GroundSales/Orders/OrderList": ["Quotation No.", "Sales Person", "Bill To"],
  "/KD/AllDepartments/Orders": ["Quotation No.", "Sales Person", "Flight No."],
  "/KD/*/RunningOrders": ["Quotation No.", "Sales Person", "Flight No."],
  "/KD/Taste/RunningOrders": ["Name", "Kind Name"],
  "/KD/*/TransferRequests": ["Creator", "Request No.", "Store", "Date"],
  "/KD/*/PurchasingRequests": ["Request No.", "Store", "Group", "Date"],
  "/KD/*/IndividualOrders": ["Name", "Status", "Date", "Order Number"],
  "/Purchasing/Orders/*": ["Request No.", "Group"],
  "/Purchasing/PurchasingHistory": ["Request No.", "Group"],
  "/CateringManager/Purchasing/PurchasingOrders": ["Request No.", "Group"],
  "/CateringManager/Purchasing/History": ["Request No.", "Group"],
  "/Finance/CreditPurchasing/*": ["Purchasing No.", "Supplier"],
  "/Inventory/Main/Report": ["ItemName"],
  "/Inventory/KitchenInventory/Report": ["ItemName"],
  "/Accounting/Reports/BalanceSheet": ["Name"],
  "/Sales/Coding/*": ["Name"],
  "/CateringManager/Purchasing/MinAndMaxControl": ["Name"],
  "/Finance/Loan/ToPay": ["Loan No.", "Employee"],
  "/Purchasing/PurchasingItems/Items": [
    "Item",
    "SubGroup",
    "Brand",
    "Supplier",
  ],
  "/CateringManager/Recipe/FoodItems": ["Name", "Group", "SubGroup", "Unit"],
  "/CateringManager/Recipe/ManufacturedItems": [
    "Name",
    "Group",
    "Brand",
    "Supplier",
  ],
  "/Custody/Custody/*": ["Transaction No.", "Creator", "Currency"],
  "/GM/CashTransaction/*": ["Transaction No.", "Creator", "Currency"],
  "/GM/SalesCoding/*": ["Name"],
  "/Finance/CashTransaction/*": ["Transaction No.", "Creator", "Currency"],
  "/Finance/Sales/Orders": ["Quotation No.", "Sales Person", "Flight No."],
  "/Finance/Custody/*": ["Employee", "Document No.", "Custody No."],
  "/Finance/Sales/Invoices": ["Quotation No.", "Sales Person", "Flight No."],
  "/Finance/InvoiceCollection/Invoices": ["Invoice No.", "Client"],
  "/GM/Approving/Loan": ["Loan No.", "Employee"],
  // "/GM/Approving/PittyCash": ["Transaction No.", "Creator"],
  // "/GM/Approving/Custody": ["Transaction No.", "Creator"],
  // "/GM/Approving/ReturnCustody": ["Transaction No.", "Creator"],
  // "/GM/Approving/CashToBank": ["Transaction No.", "Creator"],
  // "/GM/Approving/CashFromBank": ["Transaction No.", "Creator"],
  // "/GM/Approving/BankExpenses": ["Transaction No.", "Creator"],
  // "/GM/Approving/TransferFromSafe": ["Transaction No.", "Creator"],
  // "/GM/Approving/TransferToSafe": ["Transaction No.", "Creator"],
  // "/GM/Approving/Payroll": ["Transaction No.", "Creator"],
  // "/GM/Approving/AddFromPartner": ["Transaction No.", "Creator"],
  "/GM/Approving/*": [
    "Quotation No.",
    "Sales Person",
    "Flight No.",
    "Request No.",
    "Purchasing No.",
    "Transaction No.",
    "Creator",
  ],
  "/GM/Sales/*": ["Quotation No.", "Sales Person", "Flight No."],
  "/GM/Sales/Invoices": ["Quotation No.", "Sales Person", "Flight No."],
  "/GM/InvoiceCollection/Invoices": ["Invoice No.", "Client"],
  "/GM/Purchasing/PurchasingOrders": ["Request No.", "Group", "Cerator"],
  "/GM/users/Log": ["Employee Name", "Department"],
  Search_Log: ["Action By", "Department", "Changes"],
};
export function getDateRange(activeDate) {
  const activeMonth = dayjs(`${activeDate}-01`, "MM-YYYY-DD");

  const fromDate = activeMonth
    .subtract(1, "month")
    .date(26)
    .format("YYYY-MM-DD");

  const toDate = activeMonth.date(25).format("YYYY-MM-DD");

  return { fromDate, toDate };
}
export function removeNullableFields(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value != null)
  );
}
const getDefaultDateRange = () => {
  const today = dayjs();
  const dayOfMonth = today.date();

  let fromDate, toDate;

  if (dayOfMonth >= 26) {
    fromDate = today.date(26).format("YYYY-MM-DD");
    toDate = today.add(1, "month").date(25).format("YYYY-MM-DD");
  } else {
    fromDate = today.subtract(1, "month").date(26).format("YYYY-MM-DD");
    toDate = today.date(25).format("YYYY-MM-DD");
  }

  return { fromDate, toDate };
};
export function isValidEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
}

export const getStarredMenu = [
  {
    menuText: "HRManagement",
    children: [
      {
        menuText: "Departments",
        menuBlazorPath: "/HR/Coding/departments",
        menuId: 148,
      },
      {
        menuText: "Jops",
        menuBlazorPath: "/HR/Coding/jobs",
        menuId: 143,
      },
      {
        menuText: "Employees",
        menuBlazorPath: "/HR/employees",
        menuId: 149,
      },
      {
        menuText: "Daily Transaction",
        menuBlazorPath: "/HR/transaction/DailyTransaction",
        menuId: 152,
      },
    ],
  },
  {
    menuText: "Sales",
    children: [
      {
        menuText: "Anything",
        menuBlazorPath: "/HR/Coding/departments",
        menuId: 148,
      },
    ],
  },
];
export const getTrashedMenu = [];
