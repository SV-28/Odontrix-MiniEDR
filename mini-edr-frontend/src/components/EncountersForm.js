import React, { useState, useEffect } from "react";
import API from "../api";

export default function EncountersForm({ onAdded }) {
  const [form, setForm] = useState({
    patient_id: "",
    dentist_id: "",
    app_id: "",
    enc_visit: "",
    encounter_dt: "",
    difficulty_swallowing: "Unknown",
    unexplained_bleeding: "Unknown",
    notes: "",
  });

  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const yesNoOptions = ["Yes", "No", "Unknown"];

  // Load dropdown options
  useEffect(() => {
    const loadData = async () => {
      try {
        const resPatients = await API.get("/patients");
        const resDentists = await API.get("/dentists");
        setPatients(resPatients.data);
        setDentists(resDentists.data);
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
      await API.post("/encounters", form);
      alert("Encounter saved successfully!");
      setForm({
        patient_id: "",
        dentist_id: "",
        app_id: "",
        enc_visit: "",
        encounter_dt: "",
        difficulty_swallowing: "Unknown",
        unexplained_bleeding: "Unknown",
        notes: "",
      });
      if (onAdded) onAdded();
    } catch (err) {
      console.error("Error saving encounter:", err);
      alert("Failed to save encounter.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 border border-gray-100 max-w-3xl mx-auto"
    >
      <h2 className="text-xl font-bold text-blue-700 mb-4">
        Record Encounter
      </h2>

      {/* Patient and Dentist Selection */}
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
            Dentist
          </label>
          <select
            name="dentist_id"
            value={form.dentist_id}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Dentist</option>
            {dentists.map((d) => (
              <option key={d.dentist_id} value={d.dentist_id}>
                {d.first_name} {d.last_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Encounter Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Encounter Type
          </label>
          <input
            name="enc_visit"
            placeholder="e.g. Routine Checkup"
            value={form.enc_visit}
            onChange={handleChange}
            className="mt-1 input-box w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Encounter Date
          </label>
          <input
            type="datetime-local"
            name="encounter_dt"
            value={form.encounter_dt}
            onChange={handleChange}
            className="mt-1 input-box w-full"
          />
        </div>
      </div>

      {/* New Oral Symptom Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Difficulty Swallowing
          </label>
          <select
            name="difficulty_swallowing"
            value={form.difficulty_swallowing}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {yesNoOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unexplained Bleeding
          </label>
          <select
            name="unexplained_bleeding"
            value={form.unexplained_bleeding}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {yesNoOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Notes</label>
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
        Save Encounter
      </button>
    </form>
  );
}
