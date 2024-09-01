import { createBrowserRouter, RouteObject } from "react-router-dom";
import { Login } from "@/views/Login";
import { UpdatePassword } from "@/views/UpdatePassword";
import { ErrorPage } from "@/views/ErrorPage";
import { Register } from "@/views/Register";
import { Main } from "@/views/Main/index";
import { MeetingRoomList } from "@/views/MeetingRoomList";
import { BookingHistory } from "@/views/BookingHistory";
import { Menu } from "@/views/Menu";

import { UpdateInfo } from "@/views/updateInfo";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "update_info",
        element: <UpdateInfo />,
      },
      {
        path: "/",
        element: <Menu />,
        children: [
          {
            path: "/",
            element: <MeetingRoomList />,
          },
          {
            path: "meeting_room_list",
            element: <MeetingRoomList />,
          },
          {
            path: "booking_history",
            element: <BookingHistory />,
          },
        ],
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "update_password",
    element: <UpdatePassword />,
  },
];

export default createBrowserRouter(routes);
