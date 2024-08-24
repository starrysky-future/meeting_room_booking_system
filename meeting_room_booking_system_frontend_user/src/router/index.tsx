import { createBrowserRouter, RouteObject } from "react-router-dom";
import { Login } from "@/views/Login";
import { UpdatePassword } from "@/views/UpdatePassword";
import { ErrorPage } from "@/views/ErrorPage";
import { Register } from "@/views/Register";
import { Main } from "@/views/Main/index";
import { UpdateInfo } from "@/views/Main/updateInfo";

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
