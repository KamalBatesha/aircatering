export const salesOrderStatusColors = {
  "Quatation Placed": "var(--status-warning)", // 🟠
  "Sent To Kitchen": "var(--status-progress)", // 🔵
  "Kitchen Reply": "var(--status-progress)", // 🔵
  "Pending to Start": "var(--status-progress)", // 🔵
  Started: "var(--status-progress)", // 🔵
  "Sales Confiremd": "var(--status-progress)", // 🔵
  "Finished & Ready For Packing": "var(--status-success)", // 🟢
  "Ready For Pick Up": "var(--status-success)", // 🟢
  "Quality Control": "var(--status-success)", //  🟢
  "Under Gm Approval": "var(--status-success)", // 🟢
  Delivered: "var(--status-success)", // 🟢
  "Pending Cancel Approval": "var(--status-danger)", // 🔴
  Canceled: "var(--status-danger)", // 🔴
};

export const purchasingStatusColors = {
  "Request Placed": "var(--status-warning)",
  "Request Approved": "var(--status-progress)",
  "PO Created": "var(--status-success)",
  "Under Review": "var(--status-danger)",
};

export const inventoryStatusColors = {
  "Stock Low": "var(--status-warning)",
  "Out Of Stock": "var(--status-danger)",
  "In Stock": "var(--status-success)",
};
export const employeeStatusColors = {
  Active: "var(--status-success)",
  "On Hold": "var(--status-warning)",
  "UnPayed Vecation": "var(--status-danger)",
  Resigned: "var(--status-neutral)",
  Suspended: "var(--status-neutral)",
};
