import axiosInstance from "../axios";

export function GetDepartmentTransferList(listMode, depId) {
  return axiosInstance
    .get(
      `/api/StoreTransactionDepartmentList/GetList?ListMode=${listMode}&KitchenDepartmentID=${depId}&fromStore=in`
    )
    .then((response) => {
      console.log("from trns api", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error getting transfer list:", error);
      throw error;
    });
}
export function GetKitcheDepList(listMode, depId) {
  return axiosInstance
    .get(
      `/api/StoreTransactionDepartmentList/GetList?ListMode=${listMode}&KitchenDepartmentID=${depId}&fromStore=from`
    )
    .then((response) => {
      console.log("from trns api", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error getting transfer list:", error);
      throw error;
    });
}
export function GetTransferManagerList(listMode) {
  return axiosInstance
    .get(
      `/api/StoreTransactionDepartmentList/GetManagerList?ListMode=${listMode}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error getting transfer manager list:", error);
      throw error;
    });
}
export function GetDepartmentPurchasingList(depId, listMode) {
  return axiosInstance
    .get(
      `/api/DepartmentPurchasingOrderList/GetList?SectoreKeyId=${depId}&ListMode=${listMode}`
    )
    .then((response) => {
      console.log("from apis", response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error getting purchasing list:", error);
      throw error;
    });
}
export function GetPurOrderDetails(depId, purId) {
  return axiosInstance
    .get(
      `/api/DepartmentPurchasingOrderList/GetDetailList?SectoreKeyId=${depId}&PurId=${purId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error request details:", error);
      throw error;
    });
}

export function GetDepartmentItemsList(depId) {
  return axiosInstance
    .get(
      `/api/DepartmentPurchasingOrderList/GetDepartmentItemsList?SectoreKeyId=${depId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error getting items list:", error);
      throw error;
    });
}
export function GetAllItemsLists() {
  return axiosInstance
    .get(
      `/api/PreperationToStore/GetAllItemsLists`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error getting items list:", error);
      throw error;
    });
}
export function GetDepartmentRunningOrders(depId) {
  return axiosInstance
    .get(
      `/api/StoreTransactionDepartmentList/RunningOrdersTotal?KitchenDepartmentID=${depId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error getting running orders list:", error);
      throw error;
    });
}
export function SalesOrderDetailByDepartment(quatID) {
  return axiosInstance
    .get(`/api/SalesList/SalesOrderDetailByDepartment?QuatID=${quatID}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error getting running orders list:", error);
      throw error;
    });
}
export function GetRunningOrderDetails(depId, orderId) {
  return axiosInstance
    .get(
      `api/StoreTransactionDepartmentList/RunningOrdersDetails?KitchenDepartmentID=${depId}&OrderHeaderId=${orderId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error getting running order details:", error);
      throw error;
    });
}

export function HoldItem(depId, itemId) {
  return axiosInstance
    .post(
      `api/StoreTransactionDepartmentList/RunningOrdersDetailsItemHold?KitchenDepartmentID=${depId}&OrderDetailId=${itemId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error holding item:", error);
      throw error;
    });
}
export function DoneItem(depId, itemId) {
  return axiosInstance
    .post(
      `api/StoreTransactionDepartmentList/RunningOrdersDetailsItemDone?KitchenDepartmentID=${depId}&OrderDetailId=${itemId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error done item:", error);
      throw error;
    });
}

export function ItemDocumentsUpload(detailID, pictPath) {
  return axiosInstance
    .post(
      `/api/SalesList/ItemDocumentsUpload?DetailID=${detailID}&pictPath=${pictPath}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error done item:", error);
      throw error;
    });
}
export function RemoveItemDocumentsUpload(pictID) {
  return axiosInstance
    .delete(
      `/api/SalesList/ItemDocumentsUpload?PictID=${pictID}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error done item:", error);
      throw error;
    });
}

export function RecievePurItem(detailsId) {
  return axiosInstance
    .post(
      `api/DepartmentPurchasingOrderList/MarkItemAsRecive?DetailsID=${detailsId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error recieving item:", error);
      throw error;
    });
}
export function RecievePurOrder(menuId, purId, depId, data) {
  return axiosInstance
    .post(
      `api/DepartmentPurchasingOrderList/ChangeStatusStoreToRecive?MenuId=${menuId}&PurId=${purId}&SectoreKeyId=${depId}`,
      data
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error recieving pur Order:", error);
      throw error;
    });
}
export function EditPurItemDetails(detailsId, data) {
  return axiosInstance
    .post(
      `api/DepartmentPurchasingOrderList/EditItemDetailPurchasing?DetailsID=${detailsId}`,
      data
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error Editing pur item:", error);
      throw error;
    });
}
export function GetDetailsList(trnId) {
  return axiosInstance
    .get(`api/StoreTransaction/GetDetailsLists?trnID=${trnId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error getting details:", error);
      throw error;
    });
}
export function RecieveItem(detailsId) {
  return axiosInstance
    .post(
      `api/StoreTransactionDepartmentList/DepartmentMarkTorecive?StDetailId=${detailsId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error Recieving Item:", error);
      throw error;
    });
}
export function RecieveRequest(menuId, trnId, data) {
  return axiosInstance
    .post(
      `api/StoreTransactionButtons/sendToStoreMarkAsRecive?MenuId=${menuId}&_TrnId=${trnId}`,
      data
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error Recieving Transfer Request:", error);
      throw error;
    });
}
export function MarkAsReadOrder(orderId) {
  return axiosInstance
    .post(
      `/api/SalesList/OrderDetailFirstSeen?OrderId=${orderId}`,
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error Recieving Transfer Request:", error);
      throw error;
    });
}

export function GetFlightsChanged() {
  return axiosInstance
    .get(`/api/RecipeGeneralSelection/FoodMenuItemsFromPos`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}