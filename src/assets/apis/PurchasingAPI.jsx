import axiosInstance from "./axios.jsx";

export function GetPurchasingList(stateId, filter, search, page, pageSize) {
  return axiosInstance
    .get(`/api/Purchasing/PurchasingList/PurchaseTotalList`, {
      params: {
        ListMode: stateId,
        FilterMode: filter,
        search,
        page,
        pageSize,
      },
    })
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching purchasing list:", error);
      throw error;
    });
}
export function GetPurchasingListWithDate(
  listMode,
  begDate,
  endDate,
  filter,
  search,
  page,
  pageSize
) {
  return axiosInstance
    .get(`/api/Purchasing/PurchasingList/PurchaseTotalListWithDuration`, {
      params: {
        FDate: begDate,
        TDate: endDate,
        ListMode: listMode,
        FilterMode: filter,
        search,
        page,
        pageSize,
      },
    })
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching purchasing list:", error);
      throw error;
    });
}

export function UnderPayingList(search, page, pageSize) {
  return axiosInstance
    .get(
      `/api/Purchasing/PurchasingList/UnPayedPurchasing?search=${search}&page=${page}&pageSize=${pageSize}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching under paying purchasing list:", error);
      throw error;
    });
}
export function GetSuppliers() {
  return axiosInstance
    .get(`/api/Suppliers/GenLkpSupplier/List`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching suppliers:", error);
      throw error;
    });
}
export function GetSuppliersFinance() {
  return axiosInstance
    .get(`/api/Suppliers/GenLkpSupplier/FinanceList`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching suppliers:", error);
      throw error;
    });
}

export function GetDetailsItems(purId) {
  return axiosInstance
    .get(`/api/Purchasing/PurchasingList/PurchaseOrder?PurId=${purId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching purchasing details items:", error);
      throw error;
    });
}

export function UpdateActionListItem(menuId, purId, data) {
  console.log(
    "update api called ",
    menuId,
    purId,
    data,
    `/api/Purchasing/PurchasingList/UpdateActionOrder?MenuId=${menuId}&PurId=${purId}`
  );
  return axiosInstance
    .patch(
      `/api/Purchasing/PurchasingList/UpdateActionOrder?MenuId=${menuId}&PurId=${purId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.log("Error updating purchasing list item:", error);
      throw error;
    });
}
export function UpdateActualListItem(menuId, purId, data) {
  console.log(
    "update actual api called ",
    menuId,
    purId,
    data,
    `/api/Purchasing/PurchasingList/UpdateActualOrder?MenuId=${menuId}&PurId=${purId}`
  );

  return axiosInstance
    .patch(
      `/api/Purchasing/PurchasingList/UpdateActualOrder?MenuId=${menuId}&PurId=${purId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.log("Error updating purchasing list item:", error);
      throw error;
    });
}
export function SendToManager(menuId, purId) {
  return axiosInstance
    .post(
      `/api/PurchasingButtons/ChangeStatusSendToManager?MenuId=${menuId}&PurId=${purId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.log("Error sending to manager:", error);
      throw error;
    });
}

export function GetOrderSuppliers(purId) {
  return axiosInstance
    .get(`/api/Purchasing/PurchasingList/PurchaseOrderSuppliers?PurId=${purId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching order suppliers:", error);
      throw error;
    });
}
export function GetAllOrderSuppliers(purId) {
  return axiosInstance
    .get(
      `/api/Purchasing/PurchasingList/PurchaseOrderSuppliersAllList?PurId=${purId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching order suppliers:", error);
      throw error;
    });
}
export function GetSupplierItems(purId, suppId, invNumber) {
  return axiosInstance
    .get(
      `api/Purchasing/PurchasingList/PurchaseOrderWithSupplier?PurId=${purId}&SuppId=${suppId}&invNumber=${invNumber}
`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching order suppliers:", error);
      throw error;
    });
}
export function SaveToOrder(menuId, purId, data) {
  return axiosInstance
    .post(
      `api/PurchasingButtons/SaveVatDiscountToOrder?MenuId=${menuId}&PurId=${purId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error saving to order:", error);
      throw error;
    });
}
export function CalcItem(menuId, purId, data) {
  return axiosInstance
    .post(
      `api/PurchasingButtons/CalcItem?MenuId=${menuId}&PurId=${purId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error Calc Item:", error);
      throw error;
    });
}
export function SplitItem(menuId, purId, data) {
  return axiosInstance
    .post(
      `api/PurchasingButtons/SplitItem?MenuId=${menuId}&PurId=${purId}`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error Split Item:", error);
      throw error;
    });
}
export function ReturnToFinance(menuId, purId) {
  return axiosInstance
    .post(
      `api/PurchasingButtons/ChangeStatusReturnToFinance?MenuId=${menuId}&PurId=${purId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error returning to finance:", error);
      throw error;
    });
}
export function SendToStore(menuId, purId) {
  return axiosInstance
    .post(
      `api/PurchasingButtons/ChangeStatusSendToStore?MenuId=${menuId}&PurId=${purId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error returning to finance:", error);
      throw error;
    });
}
export function MarkAsReviewPur(menuId, purId) {
  return axiosInstance
    .post(
      `api/PurchasingButtons/ChangeStatusSendToReview?MenuId=${menuId}&PurId=${purId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error returning to finance:", error);
      throw error;
    });
}
export function SendBackToPurchasing(menuId, purId) {
  return axiosInstance
    .post(
      `/api/PurchasingButtons/ChangeStatusSendBackToPurchasing?MenuId=${menuId}&PurId=${purId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error returning to finance:", error);
      throw error;
    });
}
export function SendToQC(menuId, purId) {
  return axiosInstance
    .post(
      `/api/PurchasingButtons/ChangeStatusSendToQC?MenuId=${menuId}&PurId=${purId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error returning to finance:", error);
      throw error;
    });
}

export function GetPayTypes() {
  return axiosInstance
    .get(`/api/Purchasing/GeneralList/CashType?airCatering=true`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching Cash types:", error);
      throw error;
    });
}
export function GetStationsList() {
  return axiosInstance
    .get(`/api/AirCatering/stationsWithPayment-info`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching stations list:", error);
      throw error;
    });
}

export function DeleteSupplierData(purId, suppId, invNumber) {
  return axiosInstance
    .delete(
      `api/PurchasingButtons/PurchaseOrderSupplierAdding?PurId=${purId}&SuppId=${suppId}&InvoiceNumber=${invNumber}`
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

export function UploadInvoice(menuId, purId, suppId, invNumber, file) {
  const formData = new FormData();
  formData.append("fileName", file.name); // Assuming you want to send the file name
  formData.append("formFile", file); // The actual file

  console.log(
    "upload called",
    menuId,
    purId,
    suppId,
    invNumber,
    file,
    formData
  );

  return axiosInstance
    .post(
      `api/Purchasing/PurchasingList/InvoiceDocumentsUpload?MenuId=${menuId}&PurId=${purId}&SuppId=${suppId}&invoiceNo=${invNumber}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

export function ShowInvoiceFile(purId, suppId, invNumber) {
  return axiosInstance
    .get(
      `api/Purchasing/PurchasingList/OpenInvoicelDocFile?PurId=${purId}&SuppId=${suppId}&invoiceNo=${invNumber}`,
      {
        responseType: "blob", // Important: Tells Axios to expect a file (binary data)
      }
    )
    .then((response) => {
      return response.data; // Returns the file as a Blob
    })
    .catch((error) => {
      console.log("error fetching file", error);
      throw error;
    });
}

// PURCHASING DASHBOARD
export function GetPurchasingDashboard(BegDate, EndDate) {
  return axiosInstance
    .get(
      `/api/PurchasingDashBoard/GetPurchaseDashBoard?BegDate=${BegDate}&EndDate=${EndDate}&ListMode=all`
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

export function GetPurchasingTotalDashboard(BegDate, EndDate) {
  return axiosInstance
    .get(
      `/api/PurchasingDashBoard/GetPurchaseDashBoardTotal?BegDate=${BegDate}&EndDate=${EndDate}`
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

export function GetPurchasingDatesDashboard(BegDate, EndDate) {
  return axiosInstance
    .get(
      `/api/PurchasingDashBoard/GetPurchaseDashBoardWithMonth?BegDate=${BegDate}&EndDate=${EndDate}`
      // `/api/PurchasingDashBoard/GetPurchaseDashBoardWithMonth?BegDate=2025-01-01&EndDate=2025-12-31`
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

export function GetManufactureList(search = "", page = 1, pageSize = 50) {
  return axiosInstance
    .get(
      `/api/RecipeGeneralSelection/ManufactureItems?search=${search}&page=${page}&pageSize=${pageSize}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching purchasing list:", error);
      throw error;
    });
}

export function GetRecipeManufacture(itemId) {
  return axiosInstance
    .get(`/api/Purchasing/PurchasingList/PurchaseOrder?PurId=${itemId}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching purchasing details items:", error);
      throw error;
    });
}

export function GetFoodMenuItems(
  grandGroupId,
  menuTypeID,
  closedRecibe,
  search = "",
  page = 1,
  pageSize = 50
) {
  return axiosInstance
    .get(
      `/api/RecipeGeneralSelection/FoodMenuItems?MenuTypeID=${menuTypeID}&GrandGroupId=${grandGroupId}&closedRecibe=${closedRecibe}&search=${search}&page=${page}&pageSize=${pageSize}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching purchasing details items:", error);
      throw error;
    });
}

export function GetFoodItemRecipe(itemID) {
  return axiosInstance
    .get(`/api/ItemsRecipe/SelectedFoodItemRecipe?ItemID=${itemID}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching purchasing details items:", error);
      throw error;
    });
}

export function GetFoodItemRecipeFromPos() {
  return axiosInstance
    .get(`/api/RecipeGeneralSelection/FoodMenuItemsFromPos`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function GetFoodItemRecipeFromPosToGM() {
  return axiosInstance
    .get(`/api/RecipeGeneralSelection/FoodMenuItemsFromPosToGM`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function GetManufactureItemRecipe(itemID) {
  return axiosInstance
    .get(`/api/ItemsRecipe/SelectedManufactureItemRecipe?ItemID=${itemID}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching purchasing details items:", error);
      throw error;
    });
}

export function StarPurOrder(menuId, purId) {
  console.log("id sent", menuId, purId);
  return axiosInstance
    .post(
      `/api/PurchasingButtons/PurchasingStare?MenuId=${menuId}&PurId=${purId}`
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
export function TrashPurOrder(menuId, purId) {
  console.log("id sent trash", menuId, purId);
  return axiosInstance
    .post(
      `/api/PurchasingButtons/PurchasingTrash?MenuId=${menuId}&PurId=${purId}`
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

// END PURCHASING DASHBOARD

export function GetPurProgress() {
  return axiosInstance
    .get(`/api/PurchasingBar`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function AddDetailPurchaseNote(purDetailId, detailNote) {
  return axiosInstance
    .post(
      `/api/Purchasing/PurchasingList/DetailNote?PurDetailId=${purDetailId}&detailNote=${detailNote}`
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

export function DeletePurchaseNote(purDetailNoteId) {
  return axiosInstance
    .delete(
      `/api/Purchasing/PurchasingList/DetailNote?PurDetailNoteId=${purDetailNoteId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
