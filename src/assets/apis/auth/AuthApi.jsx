import axios from "axios";
import axiosInstance from "../axios";

export function Register(data) {
  return axiosInstance
    .post("/api/Authonticate/RegisterSkyCulinaire", { ...data }, {})
    .then((response) => {
      console.log("res =>", response.data);

      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error to register:", error);
      throw error;
    });
}

export function AuthLoginERP(data) {
  return axiosInstance
    .post("/api/Authonticate/login", { ...data }, {})
    .then(async (response) => {
      //console.log(response);
      sessionStorage.setItem("localAuthActivity", Date.now().toString());
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
      throw error;
    });
}

export function VerifyOtp(email = null, phone = null, otp) {
  return axiosInstance
    .post(`/api/Authonticate/ActivateAccount`, {
      Usermail: email,
      phone: phone,
      code: otp,
      // ?Usermail=${email ? encodeURIComponent(email) : ""}&phone=${phone ? phone?.replace("+", "%2B") : ""}&code=${otp}
    })
    .then(async (response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error verifying OTP:", error);
      throw error;
    });
}

export function resendOtp(data) {
  return axiosInstance
    .post(`/api/Authonticate/ResendCode`, { ...data }, {})
    .then(async (response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error resend OTP:", error);
      throw error;
    });
}

export function LoginAuth(data) {
  return axiosInstance
    .post("/api/Authonticate/LoginSkyCulinaire", { ...data }, {})
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
      throw error;
    });
}

export function updateAccessToken() {
  return axiosInstance
    .post("/api/Authonticate/LoginRefresh")
    .then((res) => {
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching newToken:", error);
      throw error;
    });
}

export function addAddress(data) {
  return axiosInstance
    .post("/api/Sales/GeneralList/CustomerList/PostMyAddress", data, {})
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error sending address:", error);
      throw error;
    });
}

export function getMyAddress() {
  return axiosInstance
    .get("/api/Sales/GeneralList/CustomerList/GetMyAddress",)
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetch address:", error);
      throw error;
    });
}

export function updateMyAddress(data) {
  return axiosInstance
    .patch("/api/Sales/GeneralList/CustomerList/PatchMyAddress", data, {})
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error updating address:", error);
      throw error;
    });
}

export function UpdateMyPassword(data) {
  return axiosInstance
    .post("/api/Authonticate/ChangeUserProfile", { ...data }, {})
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error upadeting data:", error);
      throw error;
    });
}

export function GetMyInfo() {
  return axiosInstance
    .get("/api/Sales/GeneralList/CustomerList/CustomerIndevedualInfo")
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching info:", error);
      throw error;
    });
}

export function GetMySettings() {
  return axiosInstance
    .get(`/api/AirCatering/GetCustomerProfileSettings`)
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching info :", error);
      throw error;
    });
}

export function UpdateMyInfo(data) {
  return axiosInstance
    .patch("/api/Sales/GeneralList/CustomerList/CustomerInfo", { ...data }, {})
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error upadeting data:", error);
      throw error;
    });
}

export function UpdateMySettings(data) {
  return axiosInstance
    .patch("/api/AirCatering/UpdateCustomerProfileSettings", data)
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error updating settings :", error);
      throw error;
    });
}

export function SubscribeNewsletter(status) {
  return axiosInstance
    .patch(`/api/Sales/GeneralList/CustomerList/CustomerSubscription?IsSubscribe=${status}`, {})
    .then(async (response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error subscribing:", error);
      throw error;
    });
}

export function ForgetPassword(email) {
  return axiosInstance
    .post(`/api/AirCatering/ForgotPasswordIdentityAirCatering`, { email })
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("error:", error);
      throw error;
    });
}

export function reEnterPassword(email, token, password) {
  return axiosInstance
    .post(`/api/AirCatering/ResetPasswordIdentityAirCatering`, {
      email: email,
      token: token,
      newPassword: password
    }
      , {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          withCredentials: true,
          // Authorization: `Bearer ${token}`,
        },
      })
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("error:", error);
      throw error;
    });
}

export function AuthLogout() {
  // const userName = JSON.parse(localStorage.getItem("user"))?.userName;
  return axiosInstance
    .post("/api/Authonticate/Logout")
    .then(async (response) => {
      localStorage.removeItem("user");
      onlineOrderToast.success("Logout Successfully", { id: 1 });
      window.location.reload();
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
      throw error;
    });
}

export function GetMyInformations(token) {
  return axiosInstance
    .get(`/api/HR/Coding/HrLkpPersonals/withToken?TokenId=${token}`)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching my infos:", error);
      throw error;
    });
}