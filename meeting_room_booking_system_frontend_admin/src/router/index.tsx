import { createBrowserRouter, RouteObject } from "react-router-dom";
import { ErrorPage } from "@/views/ErrorPage";
import { Login } from "@/views/Login";
import { Main } from "@/views/Main";
import { UserManage } from "@/views/UserManage";
import { Menu } from "@/views/Menu";
import { MeetingRoomManage } from "@/views/MeetingRoomManage";
import { BookingManage } from "@/views/BookingManage";
import { Statistics } from "@/views/Statistics";

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
            path: "user_manage",
            element: <UserManage />,
          },
          {
            path: "meeting_room_manage",
            element: <MeetingRoomManage />,
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
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
];

export default createBrowserRouter(routes);
