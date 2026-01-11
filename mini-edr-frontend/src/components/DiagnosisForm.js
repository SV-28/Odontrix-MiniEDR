import React, { useState, useEffect } from "react";
import API from "../api";

export default function DiagnosisForm({ onAdded }) {
  const [form, setForm] = useState({
    patient_id: "",
    encounter_id: "",
    diagnosis_desc: "",
    diagnosis_date: "",
    notes: "",
  });
  const [patients, setPatients] = useState([]);
  const [encounters, setEncounters] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [p, e] = await Promise.all([
        API.get("/patients"),
        API.get("/encounters"),
      ]);
      setPatients(p.data);
      setEncounters(e.data);
    };
    loadData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/diagnosis", form);
    alert("Diagnosis added!");
    setForm({
      patient_id: "",
      encounter_id: "",
      diagnosis_desc: "",
      diagnosis_date: "",
      notes: "",
    });
    if (onAdded) onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2 className="form-title">Add Diagnosis</h2>

      <div className="grid grid-cols-2 gap-4">
        <select
          name="patient_id"
          className="input-box"
          value={form.patient_id}
          onChange={handleChange}
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.patient_id} value={p.patient_id}>
              {p.first_name} {p.last_name}
            </option>
          ))}
        </select>

        <select
          name="encounter_id"
          className="input-box"
          value={form.encounter_id}
          onChange={handleChange}
        >
          <option value="">Select Encounter</option>
          {encounters.map((e) => (
            <option key={e.encounter_id} value={e.encounter_id}>
              {e.encounter_id}
            </option>
          ))}
        </select>
      </div>

      <textarea
        name="diagnosis_desc"
        placeholder="Diagnosis Description"
        className="input-box"
        value={form.diagnosis_desc}
        onChange={handleChange}
      ></textarea>

      <input
        type="date"
        name="diagnosis_date"
        className="input-box"
        value={form.diagnosis_date}
        onChange={handleChange}
      />

      <textarea
        name="notes"
        placeholder="Notes"
        className="input-box"
        value={form.notes}
        onChange={handleChange}
      ></textarea>

      <button type="submit" className="primary-btn">
        Save
      </button>
    </form>
  );
}
