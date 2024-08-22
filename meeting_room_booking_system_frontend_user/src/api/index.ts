import axios from "axios";
import type { LoginUser } from "../views/Login";
import type { RegisterUser } from "../views/Register";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 3000,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return error.response;
  }
);

export async function login(loginUser: LoginUser) {
  return await axiosInstance.post("/user/login", loginUser);
}

export async function register(registerUser: RegisterUser) {
  return await axiosInstance.post("/user/register", registerUser);
}

export async function registerCaptcha(address: string) {
  return await axiosInstance.get("/user/register/captcha?address=" + address);
}
