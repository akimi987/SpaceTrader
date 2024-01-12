import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./pages/root";
import Index from "./pages/Connexion";
import ErrorPage from "./kmdv/error";
import "./index.css";
import Buy from "./pages/achat";
import Dashboard from "./pages/Dashboard";
import Vaisseaux from "./pages/Vaissaux";
import Vaisseau from "./pages/VaissauModel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "vaisseaux",
            element: <Vaisseaux />,
          },
          {
            path: "vaisseau",
            element: <Vaisseau />,
          },
          {
            path: "buy",
            element: <Buy />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);