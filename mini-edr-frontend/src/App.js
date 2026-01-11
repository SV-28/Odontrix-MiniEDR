import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";

import PatientForm from "./components/PatientForm";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentList from "./components/AppointmentList";
import ClinicalRecords from "./pages/ClinicalRecords";
import XrayScans from "./pages/XrayScans";
import QuickSearch from "./pages/QuickSearch";
import Dashboard from "./pages/Dashboard";
import AiPrediction from "./components/AiPrediction";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* All routes share same layout */}
        <Route element={<AppLayout />}>
          <Route path="/register" element={<PatientForm />} />
          <Route
            path="/appointments"
            element={
              <>
                <AppointmentForm />
                <AppointmentList />
              </>
            }
          />
          <Route path="/records/*" element={<ClinicalRecords />} />
          <Route path="/xrays" element={<XrayScans />} />
          <Route path="/search" element={<QuickSearch />} />
          <Route path="/ai" element={<AiPrediction />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<div>User Settings</div>} />
          <Route path="/contact" element={<div>Contact Us</div>} />
          <Route path="/" element={<div>Welcome to Odontrix Dashboard</div>} />
        </Route>
      </Routes>
    </Router>
  );
}
