import { createRoot } from "react-dom/client";
import router from "./router";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";

const root = createRoot(document.getElementById("root")!);

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
