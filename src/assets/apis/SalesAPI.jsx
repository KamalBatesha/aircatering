import toast from "react-hot-toast";
import axiosInstance from "./axios.jsx";

export function GetQuotaionList(
  begDate,
  endDate,
  search,
  page = 1,
  pageSize = 50,
  listMode
) {
  return axiosInstance
    .get(
      `/api/SalesList/GetQuotationList?FDate=${begDate}&TDate=${endDate}&Search=${search}&Page=${page}&PageSize=${pageSize}&ListMode=${listMode}`
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
export function GetManagerQuotaionList(
  type,
  begDate,
  endDate,
  search,
  page = 1,
  pageSize = 50
) {
  return axiosInstance
    .get(
      `/api/SalesList/GetManagerQuotationList?ListMode=${type}&FDate=${begDate}&TDate=${endDate}&Search=${search}&Page=${page}&PageSize=${pageSize}`
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
export function GetOrderList(
  ListMode,
  FDate,
  TDate,
  Search,
  Page,
  PageSize
) {
  return axiosInstance
    .get(
      `/api/SalesList/GetOrderList`,
      { params: { ListMode, FDate, TDate, Search, Page, PageSize } }
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

export function GetAllOrderList(
  listMode,
  begDate,
  endDate,
) {
  return axiosInstance
    .get(
      `/api/SalesList/GetOrderList?ListMode=${listMode}&FDate=${begDate}&TDate=${endDate}`
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
export function GetExpiredGmApprovalList(
  begDate,
  endDate,
  search,
  page = 1,
  pageSize = 50
) {
  return axiosInstance
    .get(
      `/api/SalesList/GetExpiredGmApprovalList?FDate=${begDate}&TDate=${endDate}&search=${search}&page=${page}&pageSize=${pageSize}`
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
export function GetClosedGmApprovalList(
  begDate,
  endDate,
  search,
  page = 1,
  pageSize = 50
) {
  return axiosInstance
    .get(
      `/api/SalesList/GetClosedGmApprovalList?FDate=${begDate}&TDate=${endDate}&search=${search}&page=${page}&pageSize=${pageSize}`
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
export function GetKitchenOrderList(depId, begDate, endDate, search, page = 1, pageSize = 50) {
  return axiosInstance
    .get(
      `/api/SalesList/GetKitchenOrderList?FDate=${begDate}&TDate=${endDate}&KitchenDepartmentID=${depId}&search=${search}&page=${page}&pageSize=${pageSize}`
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

export function GetKitchenIndvedualRunningOrderList(depId, isStella = false) {
  return axiosInstance
    .get(
      `/api/StoreTransactionDepartmentList/RunningOrdersIndevedualTotal?KitchenDepartmentID=${depId}&menuTypeId=${isStella ? 4 : 3}`
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

export function GetKitchenIndvedualOrderList(depId, begDate, endDate, isStella = false) {
  return axiosInstance
    .get(
      `/api/SalesList/GetKitchenIndvedualOrderList?FDate=${begDate}&TDate=${endDate}&KitchenDepartmentID=${depId}&menuTypeId=${isStella ? 4 : 3}`
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

export function GetCanceldList(search, page = 1, pageSize = 50) {
  return axiosInstance
    .get(
      `/api/SalesList/GetCanceldList?search=${search}&page=${page}&pageSize=${pageSize}`
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
export function GetArchiveList(
  begDate,
  endDate,
  search,
  page = 1,
  pageSize = 50
) {
  return axiosInstance
    .get(
      `/api/SalesList/GetCancelArchiveList?FDate=${begDate}&TDate=${endDate}&search=${search}&page=${page}&pageSize=${pageSize}`
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
export function GetQuotaionDetails(orderId) {
  if (!orderId) {
    return Promise.resolve(null);
  }
  return axiosInstance
    .get(`/api/SalesList/SalesOrderDetail?QuatID=${orderId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function GetSuppliersDetails(orderId) {
  return axiosInstance
    .get(`/api/SalesList/SalesOrderSuppliers?HeaderId=${orderId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function GetAgentsList() {
  return axiosInstance
    .get(`api/SalesGeneralSelections/AgentList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetAirCraftList() {
  return axiosInstance
    .get(
      `api/SalesGeneralSelections/AirCraftType
`
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
export function GetBelongToList() {
  return axiosInstance
    .get(
      `api/SalesGeneralSelections/BelongtoList
`
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
export function GetCustomerList() {
  return axiosInstance
    .get(
      `api/SalesGeneralSelections/CustomerList
`
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
export function GetPaymentInvoices(paymentType) {
  return axiosInstance
    .get(`api/CreditNotes/PaymentInvoices?InvoiceType=${paymentType}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetCreditNoteTypeList() {
  return axiosInstance
    .get("api/CreditNotes/TypeList")
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetFlightNumbersList() {
  return axiosInstance
    .get(
      `api/SalesGeneralSelections/FlightNumbersList
`
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
export function GetFoodPackingList() {
  return axiosInstance
    .get(
      `api/SalesGeneralSelections/FoodPackingList
`
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
export function GetFoodSupplierList() {
  return axiosInstance
    .get(
      `api/SalesGeneralSelections/FoodSupplierList
`
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
export function GetOperatorsList() {
  return axiosInstance
    .get(
      `api/SalesGeneralSelections/OperatorList
`
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
export function GetBillToList() {
  return axiosInstance
    .get(
      `api/SalesGeneralSelections/BillToList
`
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
export function GetInvoiceToList() {
  return axiosInstance
    .get(
      `/api/SalesGeneralSelections/InvoiceToList`
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
export function GetOrderByList() {
  return axiosInstance
    .get(
      `api/SalesGeneralSelections/OrderbyList
`
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
export function GetRegisterationList() {
  return axiosInstance
    .get(
      `api/SalesGeneralSelections/RegistrationsList
`
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
export function GetStationsList() {
  return axiosInstance
    .get(
      `api/SalesGeneralSelections/StationsList`
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
export function GetCancelReasonList() {
  return axiosInstance
    .get(
      `api/SalesGeneralSelections/CancelResonList
`
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

export function GetHeaderPriceList() {
  return axiosInstance
    .get(
      `api/SalesGeneralSelections/HeaderPriceList
`
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

export function GetPackingList() {
  return axiosInstance
    .get(
      `api/SalesGeneralSelections/FoodPackingList
`
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
export function GetKindList() {
  return axiosInstance
    .get(`/api/PurchaseItemItemKindControllert`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function GetPackagingList() {
  return axiosInstance
    .get(
      `/api/PurchaseItemPackaging
`
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
export function GetSuppleirLastPrice(suppId, itemId) {
  return axiosInstance
    .get(
      `api/SalesList/SupplierItemLastPrice?SuppID=${suppId}&ItemID=${itemId}`
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
export function OrderByList() {
  return axiosInstance
    .get(`api/SalesGeneralSelections/OrderbyList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function SaluteList() {
  return axiosInstance
    .get(`api/SalesGeneralSelections/SaluteList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function CrewInfoList(saluteId) {
  return axiosInstance
    .get(`api/SalesGeneralSelections/CrowList?SaluteId=${saluteId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function AddCrewInfo(menuId, data) {
  return axiosInstance
    .post(`api/CrewData?MenuId=${menuId}`, data)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SaveOrderHeader(menuId, data) {
  return axiosInstance
    .post(`api/SalesList/SaveOrderHeader?MenuId=${menuId}`, data)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SaveZasOrderHeader(menuId, data) {
  return axiosInstance
    .post(
      `/api/SalesOrderFromZas/SaveOrderHeaderFromZas?MenuId=${menuId}`,
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
export function UpdateOrderHeader(menuId, orderId, data) {
  console.log("update order header", menuId, orderId, data);
  return axiosInstance
    .patch(
      `api/SalesList/UpdateOrderHeader?MenuId=${menuId}&OrderId=${orderId}`,
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
export function UpdateOrderDetails(menuId, data) {
  return axiosInstance
    .post(`api/SalesList/SaveOrderDeatils?MenuId=${menuId}`, data)
    .then((response) => {
      console.log("response200", response);
      if (response.status === 200) {
        return response.data || response;
      }
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function CancelOrder(menuId, quotId, requestReason, remark) {
  return axiosInstance
    .post(
      `api/SalesButtons/CancelOrder?MenuId=${600}&QuatID=${quotId}&ResonID=${requestReason}&CancelingJustification=${remark}`
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
export function DeleteOrder(menuId, quotId, requestReason, remark) {
  return axiosInstance
    .post(
      `/api/SalesButtons/ReqDeleteOrder?MenuId=${599}&QuatID=${quotId}&ResonID=${requestReason}&CancelingJustification=${remark}`
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

export function SendToKitchen(menuId, quotId) {
  return axiosInstance
    .post(`api/SalesButtons/SendToKitchen?MenuId=${menuId}&QuatID=${quotId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function DeleteDetailsItem(menuId, detailsId) {
  return axiosInstance
    .delete(
      `api/SalesList/DeleteOrderItem?MenuId=${menuId}&DetailId=${detailsId}`
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

//POS APIS
export function GetGrandGroupList() {
  return axiosInstance
    .get(`api/SalesGeneralSelections/GrandGroupList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetMainGroupList(grandId) {
  return axiosInstance
    .get(`api/SalesGeneralSelections/MainGroupList?GrandId=${grandId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function GetSubGroupList(mainId) {
  console.log("from sub group api", mainId);
  return axiosInstance
    .get(`api/SalesGeneralSelections/SubGroupList?MainGroupId=${mainId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetSubGroupWithItemsList(mainId) {
  console.log("from sub group api", mainId);
  return axiosInstance
    .get(
      `/api/SalesGeneralSelections/SubGroupWithItemList?MainGroupId=${mainId}`
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

export function GetItemsList(subGroupId, menuTypeId) {
  return axiosInstance
    .get(
      `api/SalesGeneralSelections/FlightItemList?SubGroupId=${subGroupId}${menuTypeId ? "&MenuTypeID=" + menuTypeId : ""}`
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
export function GetItemDetails(headerId, itemId) {
  return axiosInstance
    .get(
      `api/SalesList/SelectAirPortItemPrices?HeaderId=${headerId}&ItemId=${itemId}`
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
export function GetItemDetailsPos(
  headerId,
  itemId,
  NationaltyType,
  LocalRate,
  CurrencyId
) {
  return axiosInstance
    .get(
      `api/SalesList/SelectOrderItemPrices?HeaderId=${headerId}&ItemId=${itemId}&NationaltyType=${NationaltyType || "null"}&LocalRate=${LocalRate || "null"}&CurrencyId=${CurrencyId || "null"}`
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
export function GetConfirmationOptions() {
  return axiosInstance
    .get(`api/SalesGeneralSelections/ConfirmationList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function ConfirmAllItems(orderId) {
  return axiosInstance
    .post(`api/SalesList/AllItemConfirmation?HeaderId=${orderId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function ExpirationApprovel(menuId, quotId, approvalDate) {
  return axiosInstance
    .post(
      `/api/SalesButtons/ExpirationApprioval?MenuId=${menuId}&QuatID=${quotId}&ApprovalDate=${approvalDate}`
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

export function GetExpirationList(menuId = 0, search = '', page = 1) {
  return axiosInstance
    .get(`/api/SalesButtons/ExpirationList?MenuId=${menuId}&search=${search}&page=${page}&pageSize=50`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function ExpirationReturnToGM(menuId) {
  return axiosInstance
    .post(
      `/api/SalesButtons/ExpirationReturnToGM?MenuId=${menuId}`
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
export function firstSeenIndividual(id) {
  return axiosInstance
    .post(`/api/SalesList/OrderFirstSeen?OrderId=${id}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function StartOrder(menuId, quotId, arrivalOk, departureOk) {
  return axiosInstance
    .post(
      `api/SalesButtons/StartedOrder?MenuId=${menuId}&QuatID=${quotId}&ArrivalOk=${arrivalOk}&DepartureOk=${departureOk}`
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
export function ReadyForPacking(menuId, quotId) {
  return axiosInstance
    .post(
      `api/SalesButtons/FinishedReadyForPacking?MenuId=${menuId}&QuatID=${quotId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      if (error?.response?.status === 499) {
        toast.error(error?.response?.data || "Failed to Ready For Packing");
      }
      throw error;
    });
}
export function ReadyForPickUp(menuId, quotId) {
  return axiosInstance
    .post(`api/SalesButtons/ReadyForPickUp?MenuId=${menuId}&QuatID=${quotId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function ReadyForPickUpIndividual(menuId, quotId) {
  return axiosInstance
    .post(
      `/api/SalesButtons/IndevidualReadyForPickUp?MenuId=${menuId}&QuatID=${quotId}`
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
export function ReadyToDelivred(menuId, quotId) {
  return axiosInstance
    .post(`api/SalesButtons/ReadyToDelivred?MenuId=${menuId}&QuatID=${quotId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function ReadyToDelivredIndividual(menuId, quotId) {
  return axiosInstance
    .post(
      `/api/SalesButtons/IndevidualReadyToDelivred?MenuId=${menuId}&QuatID=${quotId}`
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
export function SalesConfirmOrder(menuId, quotId, orderType) {
  return axiosInstance
    .post(
      `api/SalesButtons/ConfirmOrder?MenuId=${menuId}&QuatID=${quotId}&aradepstatus=${orderType}`
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
export function SendBackToQuotation(menuId, quotId) {
  return axiosInstance
    .post(
      `/api/SalesButtons/SendBackToQutation?MenuId=${menuId}&QuatID=${quotId}`
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
export function SendBackToSales(menuId, quotId) {
  return axiosInstance
    .post(`/api/SalesButtons/SendBackToSales?MenuId=${menuId}&QuatID=${quotId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SendBackToCM(menuId, quotId) {
  return axiosInstance
    .post(`/api/SalesButtons/SendBackToCM?MenuId=${menuId}&QuatID=${quotId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function StopTheOrder(menuId, quotId) {
  return axiosInstance
    .post(
      `/api/SalesButtons/SendBackPindingToStart?MenuId=${menuId}&QuatID=${quotId}`
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
export function BackToKitchenManager(menuId, quotId) {
  return axiosInstance
    .post(`/api/SalesButtons/PindingToStart?MenuId=${menuId}&QuatID=${quotId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function BackToQC(menuId, quotId) {
  return axiosInstance
    .post(`/api/SalesButtons/SendBackToQC?MenuId=${menuId}&QuatID=${quotId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function BackToPickup(menuId, quotId) {
  return axiosInstance
    .post(
      `/api/SalesButtons/SendBackToPickup?MenuId=${menuId}&QuatID=${quotId}`
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
export function ItemConfirmation(menuId, data) {
  return axiosInstance
    .post(`api/SalesList/ItemConfirmation?MenuId=${menuId}`, data)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function KitchenReply(menuId, quotId) {
  return axiosInstance
    .post(`api/SalesButtons/KitchenReply?MenuId=${menuId}&QuatID=${quotId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SendToCatringManager(menuId, quotId) {
  return axiosInstance
    .post(
      `/api/SalesButtons/SendCatringManager?MenuId=${menuId}&QuatID=${quotId}`
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
export function BackToDelivered(menuId, quotId) {
  return axiosInstance
    .post(
      `/api/SalesButtons/SendBackToDedliverd?MenuId=${menuId}&QuatID=${quotId}`
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
export function PendingToStart(menuId, quotId, branchId) {
  return axiosInstance
    .post(
      `api/SalesButtons/PindingToStart?MenuId=${menuId}&QuatID=${quotId}&BranchId=${branchId}`
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

export function BranchesList() {
  return axiosInstance
    .get(`api/UserBranchesList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SendToGM(menuId, quotId) {
  return axiosInstance
    .post(`api/SalesButtons/SendToGM?MenuId=${menuId}&QuatID=${quotId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SendToGMFromQutation(menuId, quotId) {
  return axiosInstance
    .post(
      `api/SalesButtons/SendToGMFromQutation?MenuId=${menuId}&QuatID=${quotId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function ApproveOrder(menuId, quotIds) {
  return axiosInstance
    .post(`api/SalesButtons/ApproveOrder?MenuId=${menuId}`, quotIds)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function CancelApproveOrder(menuId, quotId) {
  return axiosInstance
    .post(`api/SalesButtons/ApproveCanceled?MenuId=${menuId}&QuatID=${quotId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function DeleteApproveOrder(menuId, quotId) {
  return axiosInstance
    .post(`/api/SalesButtons/ApproveDeleted?MenuId=${menuId}&QuatID=${quotId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function ReviewOrder(menuId, quotId) {
  return axiosInstance
    .post(`api/SalesButtons/FinanceReview?MenuId=${menuId}&QuatID=${quotId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

// SALES DASHBOARD
export function GetSalesDashboard(BegDate, EndDate) {
  return axiosInstance
    .get(
      `api/SalesDashBoard/GetSalesDashBoard?BegDate=${BegDate}&EndDate=${EndDate}&ListMode=all`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function GetSalesDateDashboard(BegDate, EndDate) {
  return axiosInstance
    .get(
      `api/SalesDashBoard/GetSalesDashBoardWithDate?BegDate=${BegDate}&EndDate=${EndDate}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

// END SALES DASHBOARD

export function AssignEmp(menuId, data) {
  console.log("add emp data", data);
  return axiosInstance
    .post(`api/SalesList/AssignPersonal?MenuId=${menuId}`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function DeleteAssignEmp(menuId, data) {
  console.log("remove emp data", data);

  return axiosInstance
    .delete(
      `api/SalesList/AssignPersonal?MenuId=${menuId}
`,
      data
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function EmployeeList() {
  return axiosInstance
    .get(`api/SalesList/EmployeeData`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function AssigndEmployeeJops() {
  return axiosInstance
    .get(`/api/SalesGeneralSelections/AssigndEmployeeJops`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function DocumentTypeList() {
  return axiosInstance
    .get(`/api/SalesGeneralSelections/OrderDocuments`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function OrderAssignedEmployees(menuId, quotId) {
  return axiosInstance
    .get(`api/SalesList/AssignPersonal?MenuId=${menuId}&HeaderID=${quotId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function StarSalesOrder(menuId, orderId) {
  console.log(
    "sales star added",
    `/api/SalesButtons/salesOrderdStare?MenuId=${menuId}&OrderId=${orderId}`
  );
  return axiosInstance
    .post(
      `/api/SalesButtons/salesOrderdStare?MenuId=${menuId}&OrderId=${orderId}`
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
export function TrashSalesOrder(menuId, orderId) {
  console.log(
    "sales Trash added",
    `api/SalesButtons/salesOrderdTrash?MenuId=${menuId}&OrderId=${orderId}`
  );
  return axiosInstance
    .post(
      `api/SalesButtons/salesOrderdTrash?MenuId=${menuId}&OrderId=${orderId}`
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
export function MergeItems(menuId, orderId, groupName, data) {
  return axiosInstance
    .post(
      `api/SalesOrderMergeItem/MergeItems?MenuId=${menuId}&QuatID=${orderId}&GroupName=${groupName}`,
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
export function UpdateMergeItems(menuId, mergedItemID, mergedGroup) {
  return axiosInstance
    .patch(
      `api/SalesOrderMergeItem/MergeItemsGroup?MenuId=${menuId}&MergedItemID=${mergedItemID}&MergedGroup=${mergedGroup}`
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
export function GetPrintingLabels(orderId) {
  return axiosInstance
    .get(`api/SalesList/PrintLablesList?QId=${orderId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetQuotationById(orderId) {
  return axiosInstance
    .get(`api/SalesList/GetQuotationListID?QutID=${orderId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function GetAllIndividualItems() {
  return axiosInstance
    .get(`/api/OnlineOrders/GeneralSelection/GrandGroupList?menuTypeId=${3}`)
    .then(async (response) => {
      //console.log(response);
      return response?.data;
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
}

export function GetIndividualQuotationById(orderId) {
  return axiosInstance
    .get(`/api/SalesList/GetIndividualQuotationListID?QutID=${orderId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetSplitedQuotationById(orderId) {
  return axiosInstance
    .get(`/api/SalesSplitOrder/GetOrgOrderList?OrgOrderID=${orderId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function splitQuotationById(orderId, numberSplit) {
  return axiosInstance
    .post(
      `/api/SalesSplitOrder/SplitOrder?OrgOrderID=${orderId}&NumberSplit=${numberSplit}`
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
export function moveSplitQuotation(orderDetailsId, orderId, qty) {
  return axiosInstance
    .post(
      `/api/SalesSplitOrder/SplitOrderDetail?DetailID=${orderDetailsId}&MoveToOrderID=${orderId}&QtyToSplit=${qty}`
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
export function GetRecalculatById(orderId) {
  return axiosInstance
    .post(`api/SalesList/ReCalcOrder?OrderId=${orderId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

// INDIVIDUAL ORDER
export function GetIndividualList(search = "", page = 1, pageSize = 50, listMode = "", isStella = false) {
  const url = listMode == "ALL" ? `/api/SalesList/GetIndividualQuotationList?menuTypeId=${isStella ? 4 : 3}` : `/api/SalesList/GetIndividualQuotationList?Search=${search}&Page=${page}&PageSize=${pageSize}&online=${listMode}&menuTypeId=${isStella ? 4 : 3}`
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
export function GetNewIndividualList(listMode = "K", OrderHeaderFisrtSeen = false, isStella = false) {
  const url = `/api/SalesList/GetIndividualQuotationList?OrderHeaderFisrtSeen=${OrderHeaderFisrtSeen}&online=${listMode}&menuTypeId=${isStella ? 4 : 3}`
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
export function GetIndividualById(orderId) {
  return axiosInstance
    .get(`/api/SalesList/GetIndividualQuotationListID?QutID=${orderId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function SaveIndividualOrder(menuId, data) {
  return axiosInstance
    .post(`/api/SalesList/SaveIndividualOrderHeader?MenuId=${menuId}`, data)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function UpdateIndividualHeader(menuId, orderId, data) {
  console.log("update order header", menuId, orderId, data);
  return axiosInstance
    .patch(
      `api/SalesList/UpdateIndividualOrderHeader?MenuId=${menuId}&OrderId=${orderId}`,
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

// GROUND ORDER
export function GetGroundList(search = "", page = 1, pageSize = 50) {
  return axiosInstance
    .get(`/api/SalesList/GetGroundQuotationList?Search=${search}&Page=${page}&PageSize=${pageSize}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetAllGroundList() {
  return axiosInstance
    .get(`/api/SalesList/GetGroundQuotationList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function GetGroundById(orderId) {
  return axiosInstance
    .get(`/api/SalesGroundList/GetGroundQuotationListID?QutID=${orderId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function UpdateGroundHeader(menuId, orderId, data) {
  console.log("update order header", menuId, orderId, data);
  return axiosInstance
    .patch(
      `api/SalesList/UpdategroundOrderHeader?MenuId=${menuId}&OrderId=${orderId}`,
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

export function SaveGroundOrder(menuId, data) {
  return axiosInstance
    .post(`/api/SalesList/SaveGroundOrderHeader?MenuId=${menuId}`, data)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function GetZasClientFlights(BegDate, EndDate, selectMode, isModifiedDate = false) {
  return axiosInstance
    .get(
      `/api/Flights?FDate=${BegDate}&TDate=${EndDate}&selectMode=${selectMode}${isModifiedDate ? "&ByModifiedDate=true" : ""}`
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
export function GetZasClientCounter(BegDate, EndDate) {
  return axiosInstance
    .get(`/api/Flights/Counter?FDate=${BegDate}&TDate=${EndDate}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

// FLIGHT DOCUMENTATION
export function UploadFlightDocs(formData, orderID, menuId, documentID) {
  const url = `api/SalesList/UploadDocument?OrderID=${orderID}&MenuId=${menuId}&DocumentID=${documentID}`;

  return axiosInstance
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("Document Uploaded Successfully:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error Uploading Document:", error);
      throw error;
    });
}

export function GetFlightDocsList(orderID, mode, docTypeID) {
  return axiosInstance
    .get(
      `/api/SalesList/SalesOrderDocumentList?OrderID=${orderID}&_Mode=${mode}&DocID=${docTypeID}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function GetFlightDoc(fileId) {
  return axiosInstance
    .get(`/api/SalesList/OpenOrderDocFile?FileID=${fileId}`, {
      responseType: "blob",
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function DeleteFlightDoc(fileId, menuId) {
  return axiosInstance
    .delete(
      `/api/SalesList/DeleteUploadDocument?FileID=${fileId}&MenuId=${menuId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function SendMailQuo(formData, orderID, menuId) {
  const url = `/api/SalesList/SendMail?MenuId=${menuId}&OrderID=${orderID}`;

  return axiosInstance
    .post(url, formData)
    .then((response) => {
      console.log("Send Quotation Successfully:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error Send Quotation:", error);
      throw error;
    });
}

export function AddSupplier(menuId, supplierID, currencyID, formData) {
  const url = `api/SalesList/AsignItemsToSupplier?MenuId=${menuId}&SupplierID=${supplierID}&CurrencyID=${currencyID}`;

  return axiosInstance
    .post(url, formData)
    .then((response) => {
      console.log("Adding Supplier Successfully:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error Adding Supplier:", error);
      throw error;
    });
}
export function DeleteSupplier(formData, menuId) {
  const url = `api/SalesList/AsignItemsToSupplier?MenuId=${menuId}`;

  return axiosInstance
    .delete(url, {
      headers: {
        "Content-Type": "application/json",
      },
      data: formData,
    })
    .then((response) => {
      console.log("Deleting Supplier Successfully:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error Deleting Supplier:", error);
      throw error;
    });
}

export function GetPosSignature(orderId) {
  return axiosInstance
    .get(`api/HandlingSignsture/GetHandlingSignature?OrderId=${orderId}`, {
      responseType: "blob", // Fetch the response as a Blob
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function GetPosSignatureZas(orderId) {
  return axiosInstance
    .get(`api/HandlingSignsture/GetHandlingSignatureStaf?OrderId=${orderId}`, {
      responseType: "blob",
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

// Arrival - PIC
export function GetPosSignatureArrival(orderId) {
  return axiosInstance
    .get(
      `api/HandlingSignsture/GetHandlingArrivalSignature?OrderId=${orderId}`,
      {
        responseType: "blob",
      }
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

// Arrival - Staff
export function GetPosSignatureArrivalStaff(orderId) {
  return axiosInstance
    .get(
      `/api/HandlingSignsture/GetHandlingSignatureArrivalStaf?OrderId=${orderId}`,
      {
        responseType: "blob",
      },
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function GetPrintService(flightId) {
  return axiosInstance
    .get(`api/ServiceButtons/PrintOrderService?FlifgtID=${flightId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function UploadPosSignature(formData, orderId) {
  const url = `api/HandlingSignsture/SetHandlingSignature?OrderId=${orderId}`;

  return axiosInstance
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("File uploaded successfully:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error uploading signature:", error);
      throw error;
    });
}
export function UploadPosArrivalSignature(formData, orderId) {
  const url = `/api/HandlingSignsture/SetHandlingArrivalSignature?OrderId=${orderId}`;

  return axiosInstance
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("File uploaded successfully:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error uploading signature:", error);
      throw error;
    });
}

export function UploadPosSignatureStaff(formData, orderId) {
  const url = `/api/HandlingSignsture/SetHandlingSignatureStaf?OrderId=${orderId}`;

  return axiosInstance
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("File uploaded successfully:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error uploading signature:", error);
      throw error;
    });
}
export function UploadPosArrivalSignatureStaff(formData, orderId) {
  const url = `/api/HandlingSignsture/SetHandlingSignatureArrivalStaf?OrderId=${orderId}`;

  return axiosInstance
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("File uploaded successfully:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error uploading signature:", error);
      throw error;
    });
}

export function GetSalesUnits(page, pageSize) {
  let url = "/api/Sales/Coding/FoodMenuItemUnit";
  if (page && pageSize) {
    url += `?page=${page}&pageSize=${pageSize}`;
  }
  return axiosInstance
    .get(url)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching coding Units:", error);
      throw error;
    });
}
export function ReceivedItem(orderDetailId, notes) {
  return axiosInstance
    .post(
      `/api/StoreTransaction/DeliveryDetailsItemDone?OrderDetailId=${orderDetailId}&notes=${notes}`,
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching:", error);
      throw error;
    });
}
export function DoneItem(orderDetailId, notes) {
  return (
    axiosInstance
      // /api/StoreTransaction/QCDetailsItemDone
      .post(
        `/api/StoreTransaction/QCDetailsItemDone?OrderDetailId=${orderDetailId}&notes=${notes}`,
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching:", error);
        throw error;
      })
  );
}
export function HoldItem(orderDetailId, notes) {
  return (
    axiosInstance
      // /api/StoreTransaction/QcDetailsItemHold
      .post(
        `/api/StoreTransaction/QcDetailsItemHold?OrderDetailId=${orderDetailId}&notes=${notes}`,
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching:", error);
        throw error;
      })
  );
}
export function NotReceivedItem(orderDetailId, notes) {
  return axiosInstance
    .post(
      `/api/StoreTransaction/DeliveryDetailsItemHold?OrderDetailId=${orderDetailId}&notes=${notes}`,
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching:", error);
      throw error;
    });
}
export function ReviewedItem(orderDetailId, notes) {
  return axiosInstance
    .post(
      `/api/StoreTransaction/KMDetailsItemDone?OrderDetailId=${orderDetailId}&notes=${notes}`,
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching:", error);
      throw error;
    });
}

export function AddNoteToItems(menuId, data) {
  return axiosInstance
    .post(`api/SalesOrderNotes/AddDetailNote?MenuId=${menuId}`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function DeleteNoteToItems(menuId, data) {
  return axiosInstance
    .delete(`api/SalesOrderNotes/DeleteDetailNote?MenuId=${menuId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
