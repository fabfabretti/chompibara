import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router";

import Homepage from "./pages/homepage/Homepage.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
import History from "./pages/history/History.tsx";
import Track from "./pages/track/Track.tsx";
import Profile from "./pages/profile/Profile.tsx";
import Stats from "./pages/stats/Stats.tsx";
import Exercise from "./pages/exercise/Exercise.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/history" element={<History />} />
        <Route path="/track" element={<Track />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/exercise" element={<Exercise />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
