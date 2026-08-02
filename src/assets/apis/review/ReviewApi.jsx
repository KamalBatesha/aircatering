import axiosInstance from "../axios";

export function Review(data) {
    return axiosInstance
    .post("/api/SalesOrderReview/NewReview",data, {})
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error reviewing", error);
      throw error;
    });
}

export function GetReviews() {
    return axiosInstance
    .get("/api/SalesOrderReview/UserReviews")
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error reviewing", error);
      throw error;
    });
}

export function Reviewed(id) {
    return axiosInstance
    .post(`/api/OnLineOrdersButton/ReviewOrder?OrderID=${id}`, {}, {})
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error reviewing", error);
      throw error;
    });
}