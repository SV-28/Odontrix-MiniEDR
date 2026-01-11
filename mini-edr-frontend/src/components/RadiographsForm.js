import React, { useState, useEffect } from "react";
import API from "../api";

export default function RadiographsForm({ onAdded }) {
  const [form, setForm] = useState({
    patient_id: "",
    dentist_id: "",
    encounter_id: "",
    x_rays: "",
    tooth_code: "",
    radiographic_diagnosis: "",
  });
  const [file, setFile] = useState(null);

  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [encounters, setEncounters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [p, d, e] = await Promise.all([
        API.get("/patients"),
        API.get("/dentists"),
        API.get("/encounters"),
      ]);
      setPatients(p.data);
      setDentists(d.data);
      setEncounters(e.data);
    };
    fetchData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    if (file) data.append("image", file);

    await API.post("/radiographs", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Radiograph added!");
    setForm({
      patient_id: "",
      dentist_id: "",
      encounter_id: "",
      x_rays: "",
      tooth_code: "",
      radiographic_diagnosis: "",
    });
    setFile(null);
    if (onAdded) onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2 className="form-title">Upload Radiograph</h2>

      <div className="grid grid-cols-2 gap-4">
        <select
          name="patient_id"
          className="input-box"
          value={form.patient_id}
          onChange={handleChange}
          required
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

      <select
        name="encounter_id"
        className="input-box"
        value={form.encounter_id}
        onChange={handleChange}
      >
        <option value="">Select Encounter (optional)</option>
        {encounters.map((e) => (
          <option key={e.encounter_id} value={e.encounter_id}>
            {e.encounter_dt} - {e.patient_first} {e.patient_last}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-4">
        <select
          name="x_rays"
          className="input-box"
          value={form.x_rays}
          onChange={handleChange}
          required
        >
          <option value="">Select X-Ray Type</option>
          <option>Periapical</option>
          <option>Bitewing</option>
          <option>OPG</option>
          <option>Occlusal</option>
          <option>CBCT</option>
          <option>Cephalometric</option>
        </select>

        <input
          name="tooth_code"
          placeholder="Tooth Code (optional)"
          className="input-box"
          value={form.tooth_code}
          onChange={handleChange}
        />
      </div>

      <textarea
        name="radiographic_diagnosis"
        placeholder="Radiographic Diagnosis"
        className="input-box"
        value={form.radiographic_diagnosis}
        onChange={handleChange}
      ></textarea>

      <div className="border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition">
        <label className="text-gray-600 text-sm">Attach Radiograph Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 w-full"
        />
      </div>

      <button type="submit" className="primary-btn">
        Save
      </button>
    </form>
  );
}
