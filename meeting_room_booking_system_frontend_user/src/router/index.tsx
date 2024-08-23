import { createBrowserRouter, RouteObject } from "react-router-dom";
import { Login } from "@/views/Login";
import { UpdatePassword } from "@/views/UpdatePassword";
import { ErrorPage } from "@/views/ErrorPage";
import { Register } from "@/views/Register";
import { Index } from "@/views/main/index";
import { UpdateInfo } from "@/views/main/updateInfo";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
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
