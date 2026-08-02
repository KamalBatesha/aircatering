import toast from "react-hot-toast";
import axiosInstance from "./axios.jsx";
//  GetCustomerInvoices,
// GetCustomerInvoicesById,
// /api/CashTransactionReports/CustomerTotalBalanceList
// /api/CashTransactionReports/CustomerTotalBalanceList?CustID=4

const buildPagedUrl = (baseUrl, search = "", page, pageSize) => {
  let url = `${baseUrl}?search=${encodeURIComponent(search || "")}`;

  if (page) {
    url += `&page=${page}`;
  }
  if (pageSize) {
    url += `&pageSize=${pageSize}`;
  }

  return url;
};

export function GetCustomerInvoices(search = "", page = 1, pageSize = 50) {
  return axiosInstance
    .get(
      `/api/CashTransactionReports/CustomerTotalBalanceList?search=${search}&page=${page}&pageSize=${pageSize}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetCreditNotes(begDate, endDate) {
  return axiosInstance
    .get(`/api/CreditNotes/List?begDate=${begDate}&endDate=${endDate}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function GetCashTrnDetailsReport(
  CahcodeID,
  CurrencyID,
  FDate,
  TDate,
  search,
  page,
  pageSize
) {
  const params = {
    CahcodeID,
    CurrencyID,
    FDate,
    TDate,
  };

  if (search !== undefined) params.search = search;
  if (page !== undefined) params.page = page;
  if (pageSize !== undefined) params.pageSize = pageSize;

  return axiosInstance
    .get(
      `/api/Finance/Reports/GetTreasuryBalanceByLoginUser/CashTrnDetailsReport`,
      { params }
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}
export function GetBankStatementReport(
  search,
  page,
  pageSize,
  BankId,
  BankAccId,
  FDate,
  TDate
) {
  return axiosInstance
    .get(
      `/api/CashTransactionReports/BankStatmentReport?search=${search}&page=${page}&pageSize=${pageSize}&BankId=${BankId}&BankAccId=${BankAccId}&FDate=${FDate}&TDate=${TDate}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function GetExpensesDetailReport(
  CashGroupId,
  CashCode,
  CashItem,
  Suppid,
  FDate,
  TDate
) {
  return axiosInstance
    .get(
      `/api/CashTransactionReports/ExpencesReport?CashGroupId=${CashGroupId}&CashCode=${CashCode}&CashItem=${CashItem}&Suppid=${Suppid}&FDate=${FDate}&TDate=${TDate}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function GetManuPricingList(
  groups,
  priceList,
  search = "",
  page = 1,
  pageSize = 50
) {
  return axiosInstance
    .get(
      `/api/SalesReport/MenuItemPriceList?Groupints=${groups}&headerInt=${priceList}&search=${search}&page=${page}&pageSize=${pageSize}`
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}
export function GetSalesByItemList(
  FDate,
  TDate,
  search = "",
  page = 1,
  pageSize = 50,
  clientID = 0
) {
  return axiosInstance
    .get(
      `/api/SalesReport/SalesitrmStaticbyDate?FDate=${FDate}&ToDate=${TDate}&search=${search}&page=${page}&pageSize=${pageSize}&CustID=${clientID}`
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}
export function GetAllSalesByItemList(FDate, TDate) {
  return axiosInstance
    .get(
      `/api/SalesReport/SalesitrmStaticbyDate?FDate=${FDate}&ToDate=${TDate}`
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function GetCustodyBalanceByCurrency(
  currencyID,
  search = "",
  page = "",
  pageSize = ""
) {
  return axiosInstance
    .get(
      `/api/CashTransactionReports/CustodyBalanceListByCurrency?currencyID=${currencyID}${search && (`&search=${search}`)}${page && (`&page=${page}`)}${pageSize && (`&pageSize=${pageSize}`)}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function GetCustomerInvoicesById(
  custId,
  search = "",
  page = 1,
  pageSize = 50
) {
  // /api/CashTransactionReports/CustomerInvoiceBalanceList
  return axiosInstance
    .get(
      `/api/CashTransactionReports/CustomerInvoiceBalanceList?CustID=${custId}&search=${search}&page=${page}&pageSize=${pageSize}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function GetPayCustody(search = "", page = 1, pageSize = 50, isPaid) {
  return axiosInstance
    .get(
      `/api/CustodyList?search=${search}&page=${page}&pageSize=${pageSize}${isPaid !== undefined && isPaid !== null ? `&IsPaid=${isPaid}` : ""}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetReturnCustody() {
  return axiosInstance
    .get("/api/ReturnCustody")
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetReturnCustodyPaginated(
  page,
  pageSize,
  search,
  listMode,
  FDate,
  TDate
) {
  return axiosInstance
    .get(
      `/api/ReturnCustody?page=${page}&pageSize=${pageSize}&search=${search}&ListMode=${listMode}&FDate=${FDate}&TDate=${TDate}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function PayCustody(menuId, CustodyId) {
  return axiosInstance
    .post(
      `/api/CustodyList/PayedCustody?MenuId=${menuId}&CustodyId=${CustodyId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function ReturnCustody(menuId, CustodyId) {
  return axiosInstance
    .post(`/api/ReturnCustody/CloseCustody?MenuId=${menuId}&trnId=${CustodyId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SendToGm(menuId, CustodyId) {
  return axiosInstance
    .post(`/api/ReturnCustody/SendToGM?MenuId=${menuId}&CustodyId=${CustodyId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function PreparingToApprove(data) {
  return axiosInstance
    .post(`/api/Finance/CashTransactionButtons/PrepairingToApprove`, data)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function PurchaseToApprove(data) {
  return axiosInstance
    .post(`/api/Purchasing/PurchasingList/PurchasToApprove`, data)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function GetCashTransactionLists() {
  return axiosInstance
    .get(`/api/Finance/CashTransactionLists/GetToApprovalList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function GetCashTransactionList(listMode, begDate, endDate, dateFilter) {
  return axiosInstance
    .get(
      `/api/Finance/CashTransactionLists/GetCashTransactionList?ListMode=${listMode}&FDate=${begDate}&TDate=${endDate}${dateFilter !== undefined ? `&DateFilter=${dateFilter}` : ""}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetCashTransactionPaginated(
  listMode,
  begDate,
  endDate,
  dateFilter,
  page,
  pageSize,
  search,
  status,
  isStar,
  currency
) {
  let url = `/api/Finance/CashTransactionLists/GetCashTransactionList?ListMode=${listMode}&FDate=${begDate}&TDate=${endDate}`;

  if (page) url += `&page=${page}`;
  if (pageSize) url += `&pageSize=${pageSize}`;
  if (dateFilter !== undefined) url += `&DateFilter=${dateFilter}`;
  if (search) url += `&search=${search}`;
  if (status) url += `&status=${status}`;
  if (isStar) url += `&IsStar=${isStar}`;
  if (currency) {
    const currencyNameToId = { EGP: 1, USD: 2, EUR: 3 };
    const currencyId = currencyNameToId[currency];
    if (currencyId) url += `&currencyId=${currencyId}`;
  }

  return axiosInstance
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function CashTransactionDetails(trnId) {
  return axiosInstance
    .get(
      `/api/Finance/CashTransactionLists/GetSelectedCashTransaction?trnId=${trnId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SelectedCollectionInvoices(trnId) {
  return axiosInstance
    .get(`/api/InvoiceCollectionList/SelectedCollectionInvoices?TrnID=${trnId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function CashTransactionReportById(trnId) {
  return axiosInstance
    .get(
      `/api/Finance/CashTransactionLists/GetCashTransactionByID?TrnID=${trnId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function CurrencyList() {
  return axiosInstance
    .get(`/api/Finance/CurrencyList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function CompanyList() {
  return axiosInstance
    .get(`/api/Company`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function PartnerList() {
  return axiosInstance
    .get(`/api/Finance/GeneralSelection/GetPartnersList`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function CurrencyListSales() {
  return axiosInstance
    .get(`api/Finance/CurrencyList/SalesView`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function SupplierList(search, page, pageSize) {
  return axiosInstance
    .get(
      buildPagedUrl(
        `/api/Suppliers/GenLkpSupplier/List`,
        search,
        page,
        pageSize
      )
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SafeList() {
  return axiosInstance
    .get(`/api/CashCodeList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SafeAllList() {
  return axiosInstance
    .get(`/api/CashCodeList/AllList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SafeBalance(safeId) {
  return axiosInstance
    .get(`/api/Finance/Reports/GetTreasuryBalanceCurrency?vCashcode=${safeId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SafeBalanceByLogin() {
  return axiosInstance
    .get(`/api/Finance/Reports/GetTreasuryBalanceByLoginUser`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SafeBankBalanceByLogin() {
  // /api/CashTransactionReports/BankBalanceList
  return axiosInstance
    .get(`/api/CashTransactionReports/BankBalanceList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function ToSafeList() {
  return axiosInstance
    .get(`/api/CashCodeNotInUserList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function NewPittyCash(menuId, data) {
  console.log("from new pitty", menuId, data);
  return axiosInstance
    .post(
      `/api/Finance/CashTransactionActions/SavePittyCash?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function ExpenseLockup() {
  return axiosInstance
    .get(`/api/Finance/ExpenceLockupList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function ExpenseGroup() {
  return axiosInstance
    .get(`/api/Finance/GeneralSelection/GetExpensesCashGroupList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function ExpenseSubGroup(groupId) {
  return axiosInstance
    .get(
      `/api/Finance/GeneralSelection/GetExpensesCashSubGroupList?CashGroupId=${groupId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function ExpenseItems(subGroupId) {
  return axiosInstance
    .get(
      `api/Finance/GeneralSelection/GetExpensesCashCodeItemList?ExCashCodeId=${subGroupId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function InvoiceStatics(search, page = 1, pageSize = 50) {
  return axiosInstance
    .get(
      `api/SalesReport/InvoiceStaticReport?search=${search}&page=${page}&pageSize=${pageSize}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function UpdateItem(menuId, data) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionActions/UpdateCashDetail?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function UpdatePittyCashHeader(menuId, data) {
  return axiosInstance
    .patch(
      `api/Finance/CashTransactionActions/UpdatePittyCashTotal?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function SendToGM(trnsId, menuId) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionButtons/SendToGM?trnId=${trnsId}&MenuID=${menuId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function Unapprove(trnsId) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionButtons/CashTransactionGMNotApprove?trnId=${trnsId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function Approve(trnsId, date) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionButtons/CashTransactionGMApprove?trnId=${trnsId}&approveDate=${date}`
    )
    .then((response) => {
      //console.log(response);
      return response.data || response.status;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SendBackToApprove(trnsId) {
  return axiosInstance
    .post(
      `/api/Finance/CashTransactionButtons/SendBackToApprove?trnId=${trnsId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data || response.status;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function CashTransactionsApprove(data, date) {
  return axiosInstance
    .post(
      `/api/Finance/CashTransactionButtons/CashTransactionGMApproveList?approveDate=${date}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function PurOrdersApprove(menuId, persId, data) {
  return axiosInstance
    .post(
      `/api/PurchasingButtons/ChangeStatusGMApprovalCashList?MenuId=${menuId}&PersId=${persId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function Pay(trnsId) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionButtons/CashTransactionPayed?trnId=${trnsId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.log("responseQWE ==> ", error);
      if (error.response.status === 499) {
        toast.error(error.response.data || "too early to pay", { id: 2 });
        console.log("response ==> ", error);
        throw new Error("Data modified by another user");
      }
      //console.log(error);
      throw error;
    });
}
export function Recieve(trnsId) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionButtons/CashTransactionRecived?trnId=${trnsId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetBankList() {
  return axiosInstance
    .get(`api/Finance/GeneralSelection/GetBankList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetBankAccList(bankId) {
  return axiosInstance
    .get(`api/Finance/GeneralSelection/GetBankAccList?BankId=${bankId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetExpensesList() {
  return axiosInstance
    .get(`api/Finance/GeneralSelection/GetBankExpensesList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function NewCashToBank(menuId, data) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionActions/SaveCashToBank?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function UpdateCashToBank(menuId, data) {
  return axiosInstance
    .patch(
      `api/Finance/CashTransactionActions/UpdateCashToBank?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function NewCashFromBank(menuId, data) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionActions/SaveCashFromBank?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function UpdateCashFromBank(menuId, data) {
  return axiosInstance
    .patch(
      `api/Finance/CashTransactionActions/UpdateCashFromBank?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function NewBankExpenses(menuId, data) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionActions/SaveCashBankExpenses?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function UpdateBankExpenses(menuId, data) {
  return axiosInstance
    .patch(
      `api/Finance/CashTransactionActions/UpdateCashBankExpenses?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function NewCustody(menuId, data) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionActions/SaveCustodyTotal?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function UpdateCustody(menuId, data) {
  return axiosInstance
    .patch(
      `api/Finance/CashTransactionActions/UpdateCustodyTotal?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function NewAddFromPartner(menuId, data) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionActions/SaveAddFromPartnetTotal?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function UpdateAddFromPartner(menuId, data) {
  return axiosInstance
    .patch(
      `api/Finance/CashTransactionActions/UpdateAddFromPartnetTotal?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function NewAddFromCompany(menuId, data) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionActions/SaveAddFromCompanyTotal?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function UpdateAddFromCompany(menuId, data) {
  return axiosInstance
    .patch(
      `api/Finance/CashTransactionActions/UpdateAddFromCompanyTotal?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function NewCustomerUnderPayment(menuId, data) {
  return axiosInstance
    .post(
      `/api/Finance/CashTransactionActions/SaveCustomerUnderPayment?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function UpdateCustomerUnderPayment(menuId, data) {
  return axiosInstance
    .patch(
      `/api/Finance/CashTransactionActions/UpdateCustomerUnderPayment?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function NewReturnToCompany(menuId, data) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionActions/SavePayToCompanyTotal?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function UpdateReturnToCompany(menuId, data) {
  return axiosInstance
    .patch(
      `api/Finance/CashTransactionActions/UpdatePayToCompanyTotal?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function NewReturnToPartner(menuId, data) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionActions/SaveReturnToPartnetTotal?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function UpdateReturnToPartner(menuId, data) {
  return axiosInstance
    .patch(
      `api/Finance/CashTransactionActions/UpdateReturnToPartnetTotal?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function NewTrnFromSafe(menuId, data) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionActions/SaveTransfaireFromTreasury?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function PayrollSaveTransfaireFromTreasury(menuId, data) {
  return axiosInstance
    .post(
      `/api/Finance/CashTransactionActions/PayrollSaveTransfaireFromTreasury?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function NewCurrancyTrns(menuId, data) {
  return axiosInstance
    .post(
      `/api/Finance/CashTransactionActions/SaveCurrencyTransfaire?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetCurrancyTrns(menuId) {
  return axiosInstance
    .get(
      `api/Finance/CashTransactionActions/SaveTransfaireFromTreasury?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function UpdateTrnFromSafe(menuId, data) {
  return axiosInstance
    .patch(
      `api/Finance/CashTransactionActions/UpdateTransfaireFromTreasury?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetAllInvoicesTotals({ begDate, endDate }) {
  // /api/SalesInvoice/GetInvoiceList
  // api/InvoiceCollectionList/RemainingInvoiceList
  return axiosInstance
    .get(
      `api/InvoiceCollectionList/AllInvoiceTotals?FDate=${begDate}&TDate=${endDate}`
    )
    .then((response) => {
      console.log("responseAllInvoiceTotals ==> ", response);
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetAllInvoices({ begDate, endDate }) {
  // /api/SalesInvoice/GetInvoiceList
  // api/InvoiceCollectionList/RemainingInvoiceList
  return axiosInstance
    .get(
      `api/InvoiceCollectionList/AllInvoiceList?FDate=${begDate}&TDate=${endDate}`
    )
    .then((response) => {
      console.log("responseqwe123 ==> ", response);
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetRemainingInvoices({
  begDate,
  endDate,
  search = "",
  page = 1,
  pageSize = 50,
}) {
  // /api/SalesInvoice/GetInvoiceList
  // api/InvoiceCollectionList/RemainingInvoiceList
  return axiosInstance
    .get(
      `api/InvoiceCollectionList/RemainingInvoiceList?FDate=${begDate}&TDate=${endDate}&search=${search}&page=${page}&pageSize=${pageSize}`
    )
    .then((response) => {
      console.log("responseRemainingInvoiceList ==> ", response);
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function CollectInvoice(data) {
  console.log(data);
  return axiosInstance
    .post(`api/InvoiceCollectionButtons/OneInvoicePayment`, data)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function ClientsList() {
  return axiosInstance
    .get(`api/GeneralSelection/InvoiceCollectionGeneralSelection/CustomerList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetPaymentList() {
  return axiosInstance
    .get(
      `/api/GeneralSelection/InvoiceCollectionGeneralSelection/CashTransactionType`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function ClientInvoicesList(clientId) {
  return axiosInstance
    .get(
      `api/InvoiceCollectionList/RemainingInvoiceCustomerList?CustId=${clientId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetCreditPurchasing(
  search = "",
  page = 1,
  pageSize = 50,
  isPaid
) {
  const url = `/api/Finance/CashTransactionLists/GetCreditPurchasingList?search=${search}&page=${page}&pageSize=${pageSize}${isPaid !== undefined && isPaid !== null ? `&IsPaid=${isPaid}` : ""}`;
  return axiosInstance
    .get(url)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetCreditPurchasingPayments({ begDate, endDate, dateFilter, status }) {
  return axiosInstance
    .get(
      `/api/Finance/CashTransactionLists/GetCashTransactionList?status=${status}&ListMode=20&FDate=${begDate}&TDate=${endDate}${dateFilter !== undefined ? `&DateFilter=${dateFilter}` : ""}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function PaySelectedInvoices(menuId, data) {
  console.log("data from api", data);
  console.log(
    `api/InvoiceCollectionButtons/SelectedInvoicePayment?MenuId=${menuId}`
  );
  return axiosInstance
    .post(
      `api/InvoiceCollectionButtons/SelectedInvoicePayment?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function AddCreditNote(data) {
  return axiosInstance
    .post(`api/CreditNotes`, data)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetPersonalLoans(persId) {
  return axiosInstance
    .get(
      `api/Finance/CashTransactionLists/GetPersonalLoanList?PersonalId=${persId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function PayPersonalLoans(menuId, data) {
  console.log(data);
  return axiosInstance
    .post(
      `api/Finance/CashTransactionActions/SavePayPersonalLoanTotal?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function NewCreditPurchasing(menuId, data) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionActions/SaveCreditPurchasingTotal?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function UpdateCreditPurchasing(menuId, data) {
  return axiosInstance
    .patch(
      `api/Finance/CashTransactionActions/UpdateCreditPurchasingTotal?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function GetCreditPurchasingPaymentList(orgCreditPurchasingID) {
  return axiosInstance
    .get(
      `/api/CreditPurchasing/PayCreditPurchasing/GetPaymentList?OrgCreditPurchasingID=${orgCreditPurchasingID}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function SaveNewPayment(menuId, data) {
  return axiosInstance
    .post(
      `/api/CreditPurchasing/PayCreditPurchasing/SaveNewPayment?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function ChequeReturnOnly(trnId, approveDate) {
  return axiosInstance
    .post(
      `/api/Finance/CashTransactionButtons/CashTransactionChequeReturn?trnId=${trnId}&approveDate=${approveDate}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function UpdatePayment(menuId, data) {
  return axiosInstance
    .patch(
      `/api/CreditPurchasing/PayCreditPurchasing/UpdatePayment?MenuId=${menuId}&trnID=${data.cashTransactionId}`,
      data
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function DeletePayment(menuId, paymentId) {
  return axiosInstance
    .delete(
      `/api/CreditPurchasing/PayCreditPurchasing/Payment?MenuId=${menuId}&CashtrnID=${paymentId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function GetCurrencyList() {
  return axiosInstance
    .get("/api/Finance/CurrencyList")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function GetFinanceDashboard(BegDate, EndDate, CurrencyId) {
  return axiosInstance
    .get(
      `/api/FinanceDashBoard/GetCustodyDashBoard?BegDate=${BegDate}&EndDate=${EndDate}&_Currecncy=${CurrencyId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function GetCustodyDashboard(CurrencyId) {
  return axiosInstance
    .get(
      `api/FinanceDashBoard/GetCustodyPersonalDashBoard?_Currecncy=${CurrencyId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function StarFinanceItem(menuId, trnId) {
  console.log("id sent", menuId, trnId);
  return axiosInstance
    .post(
      `/api/Finance/CashTransactionButtons/CashTransactiongStare?MenuId=${menuId}&CashTrnId=${trnId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function TrashFinanceItem(menuId, trnId) {
  console.log("id sent", menuId, trnId);
  return axiosInstance
    .post(
      `/api/Finance/CashTransactionButtons/CashTransactionTrash?MenuId=${menuId}&CashTrnId=${trnId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function NewOtherIncome(menuId, data) {
  return axiosInstance
    .post(
      `api/Finance/CashTransactionActions/SaveOtherInCome?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function GetChequeBooks(search = "", page = 1, pageSize = 50, bankId) {
  return axiosInstance
    .get(
      `/api/ChequeTransaction/ChequeTotalList?search=${search}&page=${page}&pageSize=${pageSize}${bankId !== undefined && bankId !== null ? `&BankId=${bankId}` : ""}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function NewChequeBook(data) {
  return axiosInstance
    .post(`/api/ChequeTransaction/ChequeTotalList`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function GetChequesList(totalId) {
  return axiosInstance
    .get(`/api/ChequeTransaction/ChequeDetail?TotalId=${totalId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function GetAllChequesList(totalId) {
  return axiosInstance
    .get(`/api/ChequeTransaction/ChequeDetailAllList?TotalId=${totalId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function DocChequeFile(trnId) {
  return axiosInstance
    .get(`/api/ChequeTransaction/DocFile?TrnId=${trnId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function UploadChequeDocument(menuId, trnId, data) {
  return axiosInstance
    .post(
      `/api/ChequeTransaction/UploadDocument?MenuId=${menuId}&TrnId=${trnId}`,
      data
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function AddNewChequeList(totalId) {
  return axiosInstance
    .post(`/api/ChequeTransaction/ChequeDetail?TotalId=${totalId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function GetChequebookList(bankId, bankAccId) {
  return axiosInstance
    .get(
      `/api/ChequeTransaction/BankAccountChequeList?BankId=${bankId}&BankAccId=${bankAccId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function UpdateOtherIncome(menuId, data) {
  return axiosInstance
    .patch(
      `api/Finance/CashTransactionActions/UpdateSaveOtherInCome?MenuId=${menuId}`,
      data
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function GetReasonList() {
  return axiosInstance
    .get(`/api/Finance/GeneralSelection/GetResoneList`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function DeleteCashDetail(menuId, data) {
  return axiosInstance
    .delete(
      `/api/Finance/CashTransactionActions/DeleteCashDetail?MenuId=${menuId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      }
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function DeleteFinanceItem(menuId, trnId) {
  console.log("id sent", menuId, trnId);
  return axiosInstance
    .post(
      `/api/Finance/CashTransactionButtons/CashTransactionDelete?MenuId=${menuId}&CashTrnId=${trnId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function DebtDetailsList(kindID, FDate, TDate) {
  return axiosInstance
    .get(
      `/api/CashTransactionReports/CashKindStaticReportBySupp?KindID=${kindID}&FDate=${FDate}&TDate=${TDate}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function DebtDetailsListReport(FDate, TDate) {
  return axiosInstance
    .get(
      `/api/CashTransactionReports/CashKindStaticReportByKind?FDate=${FDate}&TDate=${TDate}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function AssignTempPay(trnId) {
  return axiosInstance
    .post(`/api/Finance/CashTransactionLists/assignTempPay?trnId=${trnId}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function getMyGroundHandlerList() {
  return axiosInstance
    .get(`/api/AirCatering/GetClientGroundHandler`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}