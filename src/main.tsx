import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Homepage from "./pages/homepage/Homepage.tsx";
import Navbar from "./components/navbar/Navbar.tsx";
import History from "./pages/history/History.tsx";
import Track from "./pages/track/Track.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/history" element={<History />} />
        <Route path="/track" element={<Track />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
