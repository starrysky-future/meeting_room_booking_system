import http from "./request";
import type { LoginUser } from "@/views/Login";
import type { SearchUserParams } from "@/views/UserManage";
import type {
  SearchMeetingRoomParams,
  CreateOrUpdateMeetingRoom,
} from "@/views/MeetingRoomManage";
import type { SearchBookingParams } from "@/views/BookingManage";
import dayjs from "dayjs";
import { UserInfo } from "@/views/InfoModify";
import { UpdatePassword } from "@/views/PasswordModify";

export async function login(loginUser: LoginUser) {
  return await http.post("/user/admin/login", loginUser);
}

// 用户管理
export async function getUserList(searchParams: SearchUserParams) {
  return await http.get("/user/list", {
    params: searchParams,
  });
}

export async function freeze(id: number, isFrozen: boolean) {
  return await http.get("/user/freeze", { params: { id, isFrozen } });
}

export async function getUserInfo() {
  return await http.get("/user/info");
}

export async function updateInfo(data: UserInfo) {
  return await http.post("/user/admin/updateUserInfo", data);
}

export async function updateUserInfoCaptcha() {
  return await http.get("/user/updateUserInfo/captcha");
}

export async function updatePasswordCaptcha(email: string) {
  return await http.get("/user/updatePassword/captcha", {
    params: {
      address: email,
    },
  });
}

export async function updatePassword(data: UpdatePassword) {
  return await http.post("/user/admin/updatePassword", data);
}

// 会议室管理
export async function getMeetingRoomList(
  searchParams: SearchMeetingRoomParams
) {
  return await http.get("/meeting-room/list", {
    params: searchParams,
  });
}

export async function deleteMeetingRoom(id: number) {
  return await http.delete(`/meeting-room/${id}`);
}

export async function createMeetingRoom(
  createMeetingRoom: CreateOrUpdateMeetingRoom
) {
  return await http.post("/meeting-room/create", createMeetingRoom);
}

export async function updateMeetingRoom(
  updateMeetingRoom: CreateOrUpdateMeetingRoom
) {
  return await http.post("/meeting-room/update", updateMeetingRoom);
}

export async function findMeetingRoom(id: number) {
  return await http.get("/meeting-room/" + id);
}

// 预定管理
export async function getBookingList(searchBookingParams: SearchBookingParams) {
  let bookingTimeRangeStart;
  let bookingTimeRangeEnd;

  if (
    searchBookingParams.rangeStartDate &&
    searchBookingParams.rangeStartTime
  ) {
    const rangeStartDateStr = dayjs(searchBookingParams.rangeStartDate).format(
      "YYYY-MM-DD"
    );
    const rangeStartTimeStr = dayjs(searchBookingParams.rangeStartTime).format(
      "HH:mm"
    );
    bookingTimeRangeStart = dayjs(
      rangeStartDateStr + " " + rangeStartTimeStr
    ).valueOf();
  }

  if (searchBookingParams.rangeEndDate && searchBookingParams.rangeEndTime) {
    const rangeEndDateStr = dayjs(searchBookingParams.rangeEndDate).format(
      "YYYY-MM-DD"
    );
    const rangeEndTimeStr = dayjs(searchBookingParams.rangeEndTime).format(
      "HH:mm"
    );
    bookingTimeRangeEnd = dayjs(
      rangeEndDateStr + " " + rangeEndTimeStr
    ).valueOf();
  }

  return await http.get("/booking/list", {
    params: {
      searchBookingParams,
    },
  });
}

export async function apply(id: number) {
  return await http.get("/booking/apply/" + id);
}

export async function reject(id: number) {
  return await http.get("/booking/reject/" + id);
}

export async function unbind(id: number) {
  return await http.get("/booking/unbind/" + id);
}
