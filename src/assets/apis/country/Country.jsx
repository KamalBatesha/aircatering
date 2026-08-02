import axiosInstance from "../axios";

export function GetCountriesCodes() {
  return axiosInstance
    .get("/api/CuntryCityAriaList/CuntrySkyCulinaire")
    .then((response) => {
      console.log("res =>", response.data);

      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching countries:", error);
      throw error;
    });
}

export function GetLocationList() {
  return axiosInstance
    .get("/api/CuntryCityAriaList/CuntryCity")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching location list:", error);
      throw error;
    });
}