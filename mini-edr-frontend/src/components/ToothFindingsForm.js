import React, { useState, useEffect } from "react";
import API from "../api";

export default function ToothFindingsForm({ onAdded }) {
  const [form, setForm] = useState({
    patient_id: "",
    encounter_id: "",
    tooth_code: "",
    tooth_condition: "",
    status: "",
    severity: "",
    material: "",
    oral_lesions: "Unknown",
    white_red_patches: "Unknown",
    poor_oral_hygiene: "Unknown",
    notes: "",
  });

  const [patients, setPatients] = useState([]);
  const [encounters, setEncounters] = useState([]);
  const yesNoOptions = ["Yes", "No", "Unknown"];

  // Load patient and encounter data
  useEffect(() => {
    const loadData = async () => {
      try {
        const resPatients = await API.get("/patients");
        const resEncounters = await API.get("/encounters");
        setPatients(resPatients.data);
        setEncounters(resEncounters.data);
      } catch (err) {
        console.error("Error loading dropdowns:", err);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/toothfindings", form);
      alert("Tooth finding added successfully!");
      setForm({
        patient_id: "",
        encounter_id: "",
        tooth_code: "",
        tooth_condition: "",
        status: "",
        severity: "",
        material: "",
        oral_lesions: "Unknown",
        white_red_patches: "Unknown",
        poor_oral_hygiene: "Unknown",
        notes: "",
      });
      if (onAdded) onAdded();
    } catch (err) {
      console.error("Error saving tooth finding:", err);
      alert("Failed to add tooth finding.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 border border-gray-100 max-w-3xl mx-auto"
    >
      <h2 className="text-xl font-bold text-blue-700 mb-4">
        Record Tooth Findings
      </h2>

      {/* Patient & Encounter Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Patient
          </label>
          <select
            name="patient_id"
            value={form.patient_id}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.patient_id} value={p.patient_id}>
                {p.first_name} {p.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Encounter
          </label>
          <select
            name="encounter_id"
            value={form.encounter_id}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Encounter</option>
            {encounters.map((e) => (
              <option key={e.encounter_id} value={e.encounter_id}>
                {new Date(e.encounter_dt).toLocaleString()} —{" "}
                {e.patient_first} {e.patient_last}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tooth Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          name="tooth_code"
          placeholder="Tooth Code (e.g. 36, 47)"
          value={form.tooth_code}
          onChange={handleChange}
          className="input-box"
        />
        <input
          name="tooth_condition"
          placeholder="Condition (e.g. Caries, Fracture)"
          value={form.tooth_condition}
          onChange={handleChange}
          className="input-box"
        />
        <input
          name="status"
          placeholder="Status (e.g. Treated, Untreated)"
          value={form.status}
          onChange={handleChange}
          className="input-box"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          name="severity"
          placeholder="Severity (e.g. Mild, Moderate, Severe)"
          value={form.severity}
          onChange={handleChange}
          className="input-box"
        />
        <input
          name="material"
          placeholder="Material Used (if applicable)"
          value={form.material}
          onChange={handleChange}
          className="input-box"
        />
      </div>

      {/* Oral Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[
          { name: "oral_lesions", label: "Oral Lesions" },
          { name: "white_red_patches", label: "White/Red Patches" },
          { name: "poor_oral_hygiene", label: "Poor Oral Hygiene" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700">
              {f.label}
            </label>
            <select
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {yesNoOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          name="notes"
          placeholder="Additional observations or findings..."
          value={form.notes}
          onChange={handleChange}
          className="mt-1 w-full h-20 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700"
      >
        Save Findings
      </button>
    </form>
  );
}
