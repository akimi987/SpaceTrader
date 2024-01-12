import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import "./index.css";
import connexion from "./pages/Connexion";
import Buy from "./pages/achat";
import Dashboard from "./pages/Accueil";
import Vaisseaux from "./pages/Vaissaux";
import Vaisseau from "./pages/InfoVaissaux";
import Connexion from "./pages/Connexion";

/*  */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Connexion />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/vaisseaux" element={<Vaisseaux />}></Route>
        <Route path="/vaisseau" element={<Vaisseau />}></Route>
        <Route path="/buy" element={<Buy />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

/*  */

