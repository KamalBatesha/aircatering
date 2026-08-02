import axiosInstance from "../axios";

export function GetNotifications() {
  return axiosInstance
    .get("/api/NotificationList")
    .then((response) => {
      //console.log(response);
      return response.data.json || response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

export function UpdateNotification(id) {
  return axiosInstance
    .post(`/api/NotificationList/ChangeStatus?NotificationID=${id}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
