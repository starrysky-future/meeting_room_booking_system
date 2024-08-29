import { createBrowserRouter, RouteObject } from "react-router-dom";
import { ErrorPage } from "@/views/ErrorPage";
import { Login } from "@/views/Login";
import { Main } from "@/views/Main";
import { UserManage } from "@/views/UserManage";
import { Menu } from "@/views/Menu";
import { MeetingRoomManage } from "@/views/MeetingRoomManage";
import { BookingManage } from "@/views/BookingManage";
import { Statistics } from "@/views/Statistics";
import { ModifyMenu } from "@/views/ModifyMenu";
import { InfoModify } from "@/views/InfoModify";
import { PasswordModify } from "@/views/PasswordModify";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Main></Main>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Menu></Menu>,
        children: [
          {
            path: "meeting_room_manage",
            element: <MeetingRoomManage />,
          },
          {
            path: "user_manage",
            element: <UserManage />,
          },

          {
            path: "booking_manage",
            element: <BookingManage />,
          },
          {
            path: "statistics",
            element: <Statistics />,
          },
        ],
      },
      {
        path: "/user",
        element: <ModifyMenu></ModifyMenu>,
        children: [
          {
            path: "info_modify",
            element: <InfoModify />,
          },
          {
            path: "password_modify",
            element: <PasswordModify />,
          },
        ],
      },
    ],
  },

  {
    path: "login",
    element: <Login />,
  },
];

export default createBrowserRouter(routes);
