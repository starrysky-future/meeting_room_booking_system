import http from "./request";
import type { LoginUser } from "@/views/Login";
import type { RegisterUser } from "@/views/Register";
import type { UpdatePassword } from "@/views/UpdatePassword";
import type { UserInfo } from "@/views/main//updateInfo";

export async function login(loginUser: LoginUser) {
  return await http.post("/user/login", loginUser);
}

export async function register(registerUser: RegisterUser) {
  return await http.post("/user/register", registerUser);
}

export async function registerCaptcha(address: string) {
  return await http.get("/user/register/captcha?address=" + address);
}

export async function updatePassword(updatePassword: UpdatePassword) {
  return await http.post("/user/updatePassword", updatePassword);
}

export async function updatePasswordCaptcha(address: string) {
  return await http.get("/user/updatePassword/captcha?address=" + address);
}

export async function getUserInfo() {
  return await http.get("/user/info");
}

export async function updateUserInfo(userInfo: UserInfo) {
  return await http.post("/user/updateUserInfo", userInfo);
}

export async function updateUserInfoCaptcha() {
  return await http.get("/user/updateUserInfo/captcha");
}
