import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  FileText,
  FlaskRound,
  ClipboardList,
  FileSearch,
  Stethoscope,
  Pill,
  HeartPulse,
} from "lucide-react";

import EncountersForm from "../components/EncountersForm";
import EncountersList from "../components/EncountersList";
import VitalsForm from "../components/VitalsForm";
import VitalsList from "../components/VitalsList";
import ToothFindingsForm from "../components/ToothFindingsForm";
import ToothFindingsList from "../components/ToothFindingsList";
import PastHistoryForm from "../components/PastHistoryForm";
import PastHistoryList from "../components/PastHistoryList";
import LabTestsForm from "../components/LabTestsForm";
import LabTestsList from "../components/LabTestsList";
import DiagnosisForm from "../components/DiagnosisForm";
import DiagnosisList from "../components/DiagnosisList";
import TreatmentForm from "../components/TreatmentForm";
import TreatmentList from "../components/TreatmentList";
import PrescriptionsForm from "../components/PrescriptionsForm";
import PrescriptionsList from "../components/PrescriptionsList";

export default function ClinicalRecords() {
  const location = useLocation();

  const tabs = [
    { to: "/records/encounters", label: "Encounters", icon: <ClipboardList size={18} /> },
    { to: "/records/vitals", label: "Vitals", icon: <HeartPulse size={18} /> },
    { to: "/records/tooth", label: "Tooth Findings", icon: <FileSearch size={18} /> },
    { to: "/records/history", label: "Past History", icon: <Activity size={18} /> },
    { to: "/records/lab", label: "Lab Tests", icon: <FlaskRound size={18} /> },
    { to: "/records/diagnosis", label: "Diagnosis", icon: <Stethoscope size={18} /> },
    { to: "/records/treatment", label: "Treatment", icon: <FileText size={18} /> },
    { to: "/records/prescriptions", label: "Prescriptions", icon: <Pill size={18} /> },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Clinical Records</h1>

      {/* Tab Navigation */}
      <nav className="flex flex-wrap gap-3 border-b pb-3 mb-6">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
              }`
            }
          >
            {tab.icon}
            {tab.label}
          </NavLink>
        ))}
      </nav>

      {/* Animated Content Container */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Routes location={location} key={location.pathname}>
              <Route
                path="encounters"
                element={
                  <>
                    <EncountersForm /> <EncountersList />
                  </>
                }
              />
              <Route
                path="vitals"
                element={
                  <>
                    <VitalsForm /> <VitalsList />
                  </>
                }
              />
              <Route
                path="tooth"
                element={
                  <>
                    <ToothFindingsForm /> <ToothFindingsList />
                  </>
                }
              />
              <Route
                path="history"
                element={
                  <>
                    <PastHistoryForm /> <PastHistoryList />
                  </>
                }
              />
              <Route
                path="lab"
                element={
                  <>
                    <LabTestsForm /> <LabTestsList />
                  </>
                }
              />
              <Route
                path="diagnosis"
                element={
                  <>
                    <DiagnosisForm /> <DiagnosisList />
                  </>
                }
              />
              <Route
                path="treatment"
                element={
                  <>
                    <TreatmentForm /> <TreatmentList />
                  </>
                }
              />
              <Route
                path="prescriptions"
                element={
                  <>
                    <PrescriptionsForm /> <PrescriptionsList />
                  </>
                }
              />
              <Route
                path="/"
                element={
                  <p className="text-gray-500 text-center">
                    Select a clinical record type.
                  </p>
                }
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
