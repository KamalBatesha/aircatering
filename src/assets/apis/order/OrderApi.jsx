import axiosInstance from "../axios";

export function SaveIndividualOrder(data) {
  return axiosInstance
    .post(`/api/SalesList/SaveIndividualOrderOnLine`, data)
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SaveIndividualOrderItems(data) {
  return axiosInstance
    .post(`/api/SalesList/SaveOrderDeatilsOnLine`, data)
    .then((response) => {
      console.log(response);

      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function getMyOrders(status = "") {
  return axiosInstance
    .get(`/api/AirCatering/GetQuotationListAirCatering?status=${status}`)
    .then((response) => {
      console.log(response);

      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function getOrderById(QutID) {
  return axiosInstance
    .get(`/api/AirCatering/GetQuotationListIDAirCatering?QutID=${QutID}`)
    .then((response) => {
      console.log(response);

      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function getOrderDetails(quotId) {
  return axiosInstance
    .get(`/api/AirCatering/GetQuotationListIDAirCatering?QutID=${quotId}`)
    .then((response) => {
      console.log(response);

      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function CancelOrder(quotId) {
  return axiosInstance
    .post(
      `api/SalesButtons/CancelOrder?MenuId=${600}&QuatID=${quotId}&ResonID=${1}&CancelingJustification=client cancel order`
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
export function CheckOut(orderId) {
  return axiosInstance
    .post(
      `/api/AirCatering/SendOrderToSky?MenuId=0&QutId=${orderId}`
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

export function getMyAgent() {
  return axiosInstance
    .get(`/api/AirCatering/GetClientAgents`)
    .then((response) => {
      console.log(response);

      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function getMyOperators() {
  return axiosInstance
    .get(`/api/AirCatering/GetClientOperators`)
    .then((response) => {
      console.log(response);

      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function getMyRegistrations() {
  return axiosInstance
    .get(`/api/AirCatering/GetClientRegistrations`)
    .then((response) => {
      console.log(response);

      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function getMyFlightNumbers() {
  return axiosInstance
    .get(`/api/AirCatering/GetClientFlightNumbers`)
    .then((response) => {
      console.log(response);

      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function getMyBillTo() {
  return axiosInstance
    .get(`/api/AirCatering/GetClientBillTo`)
    .then((response) => {
      console.log(response);

      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function getMyAirCrafts() {
  return axiosInstance
    .get(`/api/AirCatering/GetClientAirCraft`)
    .then((response) => {
      console.log(response);

      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function GetCustomerProfileSettings() {
  return axiosInstance
    .get(`/api/AirCatering/GetCustomerProfileSettings`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function UpdateCustomerProfileSettings(data) {
  return axiosInstance
    .patch(`/api/AirCatering/UpdateCustomerProfileSettings`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function finalConfirmation(orderHeaderId) {
  return axiosInstance
    .post(`/api/AirCatering/ClientApproveQuotation?orderHeaderId=${orderHeaderId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function SubmitClientDecision(data) {
  return axiosInstance
    .post(`/api/AirCatering/SubmitClientDecision`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

// orderHeaderAddPercent: 0
// orderHeaderCurrencyID: 1
// orderHeaderCurrencyName: "EGP"
// orderHeaderCutomerId: 24
// orderHeaderDeliveryDateTime: "2025-12-11T13:04:56.405"
// orderHeaderDiscountPercent: 0
// orderHeaderEmailAddress: "Test"
// orderHeaderHasTransportaion: false
// orderHeaderId: 0
// orderHeaderMobileNumber: "test"
// orderHeaderOrderdByNotes: ""
// orderHeaderPriceListId: 0
// orderHeaderRemarks: null
// orderHeaderTransportationPercent: 0.05
// orderHeaderWhatsAppNumber: ""

export function SaveOrderAgainAirCatering(data) {
  return axiosInstance
    .post(`/api/AirCatering/SaveOrderAgainAirCatering?MenuId=0`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function CancelOrderAirCatering({ quatId, reason }) {
  return axiosInstance
    .post(`/api/AirCatering/CancelOrderAirCatering?QuatID=${quatId}&CancelingJustification=${encodeURIComponent(reason)}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function AddOrderToArchive(orderHeaderId) {
  return axiosInstance
    .post(`/api/AirCatering/AddOrderToArchive?orderHeaderId=${orderHeaderId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function RestoreFromArchive(orderHeaderId) {
  return axiosInstance
    .post(`/api/AirCatering/RestoreFromArchive?orderHeaderId=${orderHeaderId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function CreateReminder(orderHeaderId) {
  return axiosInstance
    .post(`/api/AirCatering/CreateReminder?orderHeaderId=${orderHeaderId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}