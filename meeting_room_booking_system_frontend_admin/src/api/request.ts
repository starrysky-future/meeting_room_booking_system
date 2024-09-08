import { message } from "antd";
import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 3000,
});

axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers.authorization = "Bearer " + accessToken;
  }
  return config;
});

interface PendingTask {
  config: AxiosRequestConfig;
  resolve: Function;
}
let refreshing = false;
const queue: PendingTask[] = [];

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 请求没有发送成功
    if (!error.response) {
      return Promise.reject(error);
    }

    let { data, config } = error.response;

    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        });
      });
    }

    if (data.code === 401 && !config.url.includes("/user/refresh")) {
      refreshing = true;

      const res = await refreshToken();

      refreshing = false;

      if (res.status === 200) {
        queue.forEach(({ config, resolve }) => {
          resolve(axiosInstance(config));
        });

        return axiosInstance(config);
      } else {
        message.error(res.data);

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } else {
      return error.response;
    }
  }
);

async function refreshToken() {
  const res = await axiosInstance.get(
    "/user/admin/refresh?refreshToken=" + localStorage.getItem("refresh_token")
  );

  localStorage.setItem("access_token", res.data.data.accessToken || "");
  localStorage.setItem("refresh_token", res.data.data.refreshToken || "");
  return res;
}

export default axiosInstance;
