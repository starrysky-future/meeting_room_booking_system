import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Login } from "../views/Login";
import UpdatePassword from "../views/UpdatePassword";
import ErrorPage from "../views/ErrorPage";
import { Register } from "../views/Register";

const routes = [
  {
    path: "/",
    element: <div>index</div>,
    errorElement: <ErrorPage />,
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
