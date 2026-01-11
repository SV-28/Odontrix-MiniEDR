import React, { useState, useEffect } from "react";
import API from "../api";

export default function VitalsForm({ onAdded }) {
  const [form, setForm] = useState({
    patient_id: "", encounter_id: "", systolic_mmHg: "", diastolic_mmHg: "", pulse_bpm: "",
    temp_c: "", weight_kg: "", height_cm: "", notes: ""
  });
  const [patients, setPatients] = useState([]);
  const [encounters, setEncounters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const p = await API.get("/patients");
      const e = await API.get("/encounters");
      setPatients(p.data); setEncounters(e.data);
    };
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/vitals", form);
    alert("Vitals recorded!");
    setForm({ patient_id: "", encounter_id: "", systolic_mmHg: "", diastolic_mmHg: "", pulse_bpm: "", temp_c: "", weight_kg: "", height_cm: "", notes: "" });
    if (onAdded) onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2 className="form-title">Add Vitals</h2>

      <div className="grid grid-cols-2 gap-4">
        <select name="patient_id" className="input-box" value={form.patient_id} onChange={handleChange}>
          <option value="">Select Patient</option>
          {patients.map(p => <option key={p.patient_id} value={p.patient_id}>{p.first_name} {p.last_name}</option>)}
        </select>

        <select name="encounter_id" className="input-box" value={form.encounter_id} onChange={handleChange}>
          <option value="">Select Encounter</option>
          {encounters.map(e => <option key={e.encounter_id} value={e.encounter_id}>{e.encounter_id}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <input name="systolic_mmHg" placeholder="Systolic" className="input-box" value={form.systolic_mmHg} onChange={handleChange} />
        <input name="diastolic_mmHg" placeholder="Diastolic" className="input-box" value={form.diastolic_mmHg} onChange={handleChange} />
        <input name="pulse_bpm" placeholder="Pulse (bpm)" className="input-box" value={form.pulse_bpm} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <input name="temp_c" placeholder="Temp (°C)" className="input-box" value={form.temp_c} onChange={handleChange} />
        <input name="weight_kg" placeholder="Weight (kg)" className="input-box" value={form.weight_kg} onChange={handleChange} />
        <input name="height_cm" placeholder="Height (cm)" className="input-box" value={form.height_cm} onChange={handleChange} />
      </div>

      <textarea name="notes" placeholder="Notes" className="input-box" value={form.notes} onChange={handleChange}></textarea>

      <button type="submit" className="primary-btn">Save</button>
    </form>
  );
}
