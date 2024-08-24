import { createBrowserRouter, RouteObject } from "react-router-dom";
import { ErrorPage } from "@/views/ErrorPage";
import { Login } from "@/views/Login";
import { Main } from "@/views/Main";
import { UserManage } from "@/views/Main/UserManage";
import { Menu } from "@/views/Main/Menu";

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
