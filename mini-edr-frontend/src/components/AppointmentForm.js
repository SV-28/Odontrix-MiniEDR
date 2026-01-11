import React, { useState, useEffect } from "react";
import API from "../api";

export default function AppointmentForm({ onAdded }) {
  const [form, setForm] = useState({
    patient_id: "", dentist_id: "", app_date: "", app_time: "", complaint: "", visit_type: ""
  });
  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const p = await API.get("/patients");
      const d = await API.get("/dentists");
      setPatients(p.data); setDentists(d.data);
    };
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/appointments", form);
    alert("Appointment saved!");
    setForm({ patient_id: "", dentist_id: "", app_date: "", app_time: "", complaint: "", visit_type: "" });
    if (onAdded) onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2 className="form-title">New Appointment</h2>

      <div className="grid grid-cols-2 gap-4">
        <select name="patient_id" className="input-box" value={form.patient_id} onChange={handleChange}>
          <option value="">Select Patient</option>
          {patients.map((p) => <option key={p.patient_id} value={p.patient_id}>{p.first_name} {p.last_name}</option>)}
        </select>

        <select name="dentist_id" className="input-box" value={form.dentist_id} onChange={handleChange}>
          <option value="">Select Dentist</option>
          {dentists.map((d) => <option key={d.dentist_id} value={d.dentist_id}>{d.first_name} {d.last_name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input type="date" name="app_date" className="input-box" value={form.app_date} onChange={handleChange} />
        <input type="time" name="app_time" className="input-box" value={form.app_time} onChange={handleChange} />
      </div>

      <select name="visit_type" className="input-box" value={form.visit_type} onChange={handleChange}>
        <option value="">Select Visit Type</option>
        <option>New</option><option>Follow-up</option>
      </select>

      <textarea name="complaint" placeholder="Chief complaint" className="input-box" value={form.complaint} onChange={handleChange}></textarea>

      <button type="submit" className="primary-btn">Save</button>
    </form>
  );
}
