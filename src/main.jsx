import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./pages/root";
import Index from "./pages/index";
import ErrorPage from "./error-page";
import "./index.css";
import Achat from "./pages/achat";
import Accueil from "./pages/Accueil";
import Vaisseaux from "./pages/Vaisseaux";

import InfoVaissaux from "./pages/InfoVaissaux";

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
            path: "Accueil",
            element: <Accueil />,
          },
          {
            path: "vaisseaux",
            element: <Vaisseaux />,
          },
          {
            path: "vaisseau",
            element: <InfoVaissaux />,
          },
          {
            path: "achat",
            element: <Achat />,
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