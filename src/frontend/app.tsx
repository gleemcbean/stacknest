import React from "react";
import { createRoot } from "react-dom/client";
import "./sass/_globals.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

const root = createRoot(document.body);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>
);
