import { SearchMeetingRoomParams } from "@/views/MeetingRoomList";
import http from "./request";
import type { LoginUser } from "@/views/Login";
import type { RegisterUser } from "@/views/Register";
import type { UpdatePassword } from "@/views/UpdatePassword";
import type { UserInfo } from "@/views/updateInfo";
import { CreateBooking } from "@/views/MeetingRoomList/CreateBookingModal";
import dayjs from "dayjs";
import { SearchBooking } from "@/views/BookingHistory";

// 登录注册
export async function login(loginUser: LoginUser) {
  return await http.post("/user/login", loginUser);
}

export async function register(registerUser: RegisterUser) {
  return await http.post("/user/register", registerUser);
}

export async function registerCaptcha(address: string) {
  return await http.get("/user/register/captcha", {
    params: {
      address,
    },
  });
}

// 用户信息修改
export async function updatePassword(updatePassword: UpdatePassword) {
  return await http.post("/user/updatePassword", updatePassword);
}

export async function updatePasswordCaptcha(address: string) {
  return await http.get("/user/updatePassword/captcha", {
    params: {
      address,
    },
  });
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

// 会议室模块
export async function searchMeetingRoomList(
  searchMeetingRoomParams: SearchMeetingRoomParams
) {
  return await http.get("/meeting-room/list", {
    params: searchMeetingRoomParams,
  });
}

export async function bookingAdd(createBooking: CreateBooking) {
  const rangeStartDateStr = dayjs(createBooking.rangeStartDate).format(
    "YYYY-MM-DD"
  );
  const rangeStartTimeStr = dayjs(createBooking.rangeStartTime).format("HH:mm");
  const startTime = dayjs(
    rangeStartDateStr + " " + rangeStartTimeStr
  ).valueOf();

  const rangeEndDateStr = dayjs(createBooking.rangeEndDate).format(
    "YYYY-MM-DD"
  );
  const rangeEndTimeStr = dayjs(createBooking.rangeEndTime).format("HH:mm");
  const endTime = dayjs(rangeEndDateStr + " " + rangeEndTimeStr).valueOf();

  return await http.post("/booking/add", {
    meetingRoomId: createBooking.meetingRoomId,
    startTime,
    endTime,
    note: createBooking.note,
  });
}

// 预定历史
export async function bookingList(
  searchBooking: SearchBooking,
  pageNo: number,
  pageSize: number
) {
  let bookingTimeRangeStart;
  let bookingTimeRangeEnd;

  if (searchBooking.rangeStartDate && searchBooking.rangeStartTime) {
    const rangeStartDateStr = dayjs(searchBooking.rangeStartDate).format(
      "YYYY-MM-DD"
    );
    const rangeStartTimeStr = dayjs(searchBooking.rangeStartTime).format(
      "HH:mm"
    );
    bookingTimeRangeStart = dayjs(
      rangeStartDateStr + " " + rangeStartTimeStr
    ).valueOf();
  }

  if (searchBooking.rangeEndDate && searchBooking.rangeEndTime) {
    const rangeEndDateStr = dayjs(searchBooking.rangeEndDate).format(
      "YYYY-MM-DD"
    );
    const rangeEndTimeStr = dayjs(searchBooking.rangeEndTime).format("HH:mm");
    bookingTimeRangeEnd = dayjs(
      rangeEndDateStr + " " + rangeEndTimeStr
    ).valueOf();
  }

  return await http.get("/booking/list", {
    params: {
      username: searchBooking.username,
      meetingRoomName: searchBooking.meetingRoomName,
      meetingRoomPosition: searchBooking.meetingRoomPosition,
      bookingTimeRangeStart,
      bookingTimeRangeEnd,
      pageNo: pageNo,
      pageSize: pageSize,
    },
  });
}

export async function unbind(id: number) {
  return await http.get("/booking/unbind/" + id);
}
