import React, { useState } from "react";
import API from "../api";

export default function PatientForm({ onAdded }) {
  const [form, setForm] = useState({
    first_name: "", last_name: "", dob: "", email: "", phone: "",
    address: "", gender: "", marital_status: "", occupation: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/patients", form);
    alert("Patient registered successfully!");
    setForm({ first_name: "", last_name: "", dob: "", email: "", phone: "", address: "", gender: "", marital_status: "", occupation: "" });
    if (onAdded) onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2 className="form-title">Register Patient</h2>

      <div className="grid grid-cols-2 gap-4">
        <input name="first_name" placeholder="First Name" className="input-box" value={form.first_name} onChange={handleChange} />
        <input name="last_name" placeholder="Last Name" className="input-box" value={form.last_name} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input type="date" name="dob" className="input-box" value={form.dob} onChange={handleChange} />
        <input name="email" placeholder="Email" className="input-box" value={form.email} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <select name="gender" className="input-box" value={form.gender} onChange={handleChange}>
          <option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option>
        </select>
        <input name="phone" placeholder="Phone" className="input-box" value={form.phone} onChange={handleChange} />
      </div>

      <input name="address" placeholder="Address" className="input-box" value={form.address} onChange={handleChange} />

      <div className="grid grid-cols-2 gap-4">
        <select name="marital_status" className="input-box" value={form.marital_status} onChange={handleChange}>
          <option value="">Select Marital Status</option><option>Single</option><option>Married</option><option>Divorced</option>
        </select>
        <input name="occupation" placeholder="Occupation" className="input-box" value={form.occupation} onChange={handleChange} />
      </div>

      <button type="submit" className="primary-btn">Save</button>
    </form>
  );
}
