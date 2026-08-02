// /api/SalesOrderNotes / AddNote
// src\assets\Api\axios\axios.jsx
import axiosInstance from "../../apis/axios";
export function AddNewNote(menuId, dep, data) {
  console.log("menuId ==> ", menuId);
  return axiosInstance
    .post(
      `api/SalesOrderNotes/AddNote?MenuId=${menuId}&_department=${dep}`,
      data,
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
export function GetNotes(menuId, flightId) {
  // /api/SalesOrderNotes/OrderNotes
  return axiosInstance
    .get(`api/SalesOrderNotes/OrderNotes?MenuId=${menuId}&OrderID=${flightId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}
