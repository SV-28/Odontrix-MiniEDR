import React, { useState, useEffect } from "react";
import API from "../api";

export default function PastHistoryForm({ onAdded }) {
  const [form, setForm] = useState({
    patient_id: "",
    medical_history: "",
    allergies: "",
    dental_history: "",
    tobacco_use: "Unknown",
    alcohol_use: "Unknown",
    betel_quid_use: "Unknown",
    diet_fruits_veggies: "Unknown",
    hpv_infection: "Unknown",
    chronic_sun_exposure: "Unknown",
    family_history_cancer: "Unknown",
    compromised_immune_system: "Unknown",
    duration: "",
    notes: "",
  });

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const res = await API.get("/patients");
        setPatients(res.data);
      } catch (err) {
        console.error("Error loading patients:", err);
      }
    };
    loadPatients();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/pasthistory", form);
    alert("Past history saved!");
    setForm({
      patient_id: "",
      medical_history: "",
      allergies: "",
      dental_history: "",
      tobacco_use: "Unknown",
      alcohol_use: "Unknown",
      betel_quid_use: "Unknown",
      diet_fruits_veggies: "Unknown",
      hpv_infection: "Unknown",
      chronic_sun_exposure: "Unknown",
      family_history_cancer: "Unknown",
      compromised_immune_system: "Unknown",
      duration: "",
      notes: "",
    });
    if (onAdded) onAdded();
  };

  const yesNoOptions = ["Yes", "No", "Unknown"];
  const dietOptions = ["Adequate", "Inadequate", "Unknown"];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 border border-gray-100 max-w-3xl mx-auto"
    >
      <h2 className="text-xl font-bold text-blue-700 mb-4">
        Add Past History
      </h2>

      {/* Patient Selection */}
      <div className="mb-4">
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

      {/* History fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <textarea
          name="medical_history"
          placeholder="Medical History"
          value={form.medical_history}
          onChange={handleChange}
          className="input-box h-20"
        ></textarea>
        <textarea
          name="allergies"
          placeholder="Allergies"
          value={form.allergies}
          onChange={handleChange}
          className="input-box h-20"
        ></textarea>
      </div>

      <textarea
        name="dental_history"
        placeholder="Dental History"
        value={form.dental_history}
        onChange={handleChange}
        className="input-box w-full mb-6"
      ></textarea>

      {/* Risk Factors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[
          { name: "tobacco_use", label: "Tobacco Use" },
          { name: "alcohol_use", label: "Alcohol Use" },
          { name: "betel_quid_use", label: "Betel-Quid Use" },
          { name: "diet_fruits_veggies", label: "Diet (Fruits & Veggies)", options: dietOptions },
          { name: "hpv_infection", label: "HPV Infection" },
          { name: "chronic_sun_exposure", label: "Chronic Sun Exposure" },
          { name: "family_history_cancer", label: "Family History of Cancer" },
          { name: "compromised_immune_system", label: "Compromised Immune System" },
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
              {(f.options || yesNoOptions).map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Duration + Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          name="duration"
          placeholder="Duration (e.g. 5 years)"
          value={form.duration}
          onChange={handleChange}
          className="input-box"
        />
        <textarea
          name="notes"
          placeholder="Additional Notes"
          value={form.notes}
          onChange={handleChange}
          className="input-box h-16"
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
}
