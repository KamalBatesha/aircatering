import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;

// import { createBrowserHistory } from "history";
const navigate = (await import("react-router-dom")).useNavigate;

// const SERVER_URL = baseURL;
const SERVER_URL = baseURL;

// const history = createBrowserHistory();

const axiosInstance = axios.create({
  baseURL: `${SERVER_URL}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
    withCredentials: true,
  },
});
export const uploadAxiosInstance = axios.create({
  baseURL: `${SERVER_URL}`,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "*/*",
    withCredentials: true,
  },
});
uploadAxiosInstance.interceptors.request.use(
  (config) => {
    let user = localStorage.getItem("user") ? localStorage.getItem("user") : "";
    if (user) {
      user = JSON.parse(user);
      // token = `B`
    }
    config.headers = {
      Accept: "*/*",
      withCredentials: true,
      Authorization: `Bearer ${user.encodedPayload}`,
    };
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.request.use(
  (config) => {
    let user = localStorage.getItem("user") ? localStorage.getItem("user") : "";
    if (user) {
      user = JSON.parse(user);
      // token = `B`
    }
    console.log("user", user);


    config.headers = {
      Accept: "*/*",
      withCredentials: true,
      Authorization: `Bearer ${user.encodedPayload}`,
      ContentType: "application/json",
    };

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401, not a retry, and not the refresh endpoint itself
    if (error && error.response?.status === 401 && !originalRequest._retry && originalRequest.url && !originalRequest.url.includes("LoginRefresh")) {

      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint directly using base axios
        const refreshResponse = await axios.post(`${baseURL}/api/Authonticate/LoginRefresh`, {}, { withCredentials: true });
        const data = refreshResponse.data;

        localStorage.setItem("user", JSON.stringify(data));
        originalRequest.headers['Authorization'] = 'Bearer ' + data.encodedPayload;

        processQueue(null, data.encodedPayload);
        isRefreshing = false;
        console.log("refresh-token");


        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        if (localStorage.getItem("user")) {
          localStorage.removeItem("user");
          // Dispatch event so the app can clean up Zustand state and redirect
          window.dispatchEvent(new Event("auth:logout"));
        }
        return Promise.reject(refreshError);
      }
    }

    // Fallback for other errors
    if (error.response && error.response?.status === 500) {
      return Promise.reject(error.response);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
