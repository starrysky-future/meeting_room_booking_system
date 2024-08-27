import http from "./request";
import type { LoginUser } from "@/views/Login";
import type { SearchParams } from "@/views/UserManage";

export async function login(loginUser: LoginUser) {
  return await http.post("/user/admin/login", loginUser);
}

export async function getList(searchParams: SearchParams) {
  return await http.get("/user/list", {
    params: searchParams,
  });
}

export async function freeze(id: number, isFrozen: boolean) {
  return await http.get("/user/freeze", { params: { id, isFrozen } });
}
