import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import ViewRecords from "./components/ViewRecords";
import ViewRecord from "./components/ViewRecord";
import EditRecord from "./components/EditRecord";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/records" element={<ViewRecords />} />
        <Route path="/view/:id" element={<ViewRecord />} />
        <Route path="/edit/:id" element={<EditRecord />} />
      </Routes>
    </Router>
  );
}

