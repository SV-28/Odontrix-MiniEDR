import React, { useState, useEffect } from "react";
import API from "../api";

export default function PrescriptionsForm({ onAdded }) {
  const [form, setForm] = useState({
    patient_id: "",
    dentist_id: "",
    encounter_id: "",
    treatment_id: "",
    drug_name: "",
    dosage: "",
    frequency: "",
    duration: "",
    notes: "",
  });
  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [encounters, setEncounters] = useState([]);
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [p, d, e, t] = await Promise.all([
        API.get("/patients"),
        API.get("/dentists"),
        API.get("/encounters"),
        API.get("/treatment"),
      ]);
      setPatients(p.data);
      setDentists(d.data);
      setEncounters(e.data);
      setTreatments(t.data);
    };
    loadData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/prescription", form);
    alert("Prescription saved!");
    setForm({
      patient_id: "",
      dentist_id: "",
      encounter_id: "",
      treatment_id: "",
      drug_name: "",
      dosage: "",
      frequency: "",
      duration: "",
      notes: "",
    });
    if (onAdded) onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2 className="form-title">Add Prescription</h2>

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
          name="dentist_id"
          className="input-box"
          value={form.dentist_id}
          onChange={handleChange}
        >
          <option value="">Select Dentist</option>
          {dentists.map((d) => (
            <option key={d.dentist_id} value={d.dentist_id}>
              {d.first_name} {d.last_name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
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

        <select
          name="treatment_id"
          className="input-box"
          value={form.treatment_id}
          onChange={handleChange}
        >
          <option value="">Select Treatment</option>
          {treatments.map((t) => (
            <option key={t.treatment_id} value={t.treatment_id}>
              {t.treatment_desc}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          name="drug_name"
          placeholder="Drug Name"
          className="input-box"
          value={form.drug_name}
          onChange={handleChange}
        />
        <input
          name="dosage"
          placeholder="Dosage"
          className="input-box"
          value={form.dosage}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          name="frequency"
          placeholder="Frequency"
          className="input-box"
          value={form.frequency}
          onChange={handleChange}
        />
        <input
          name="duration"
          placeholder="Duration"
          className="input-box"
          value={form.duration}
          onChange={handleChange}
        />
      </div>

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
