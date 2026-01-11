import React, { useEffect, useState } from "react";
import API from "../api";

export default function TreatmentList() {
  const [treatments, setTreatments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/treatment");
        setTreatments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch treatments:", err);
        setError("Could not load treatments.");
      }
    };
    fetchData();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold">Treatments</h2>
      {treatments.length === 0 ? (
        <p>No treatments recorded.</p>
      ) : (
        <table border="1" cellPadding="8" className="mt-2">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Dentist</th>
              <th>Encounter</th>
              <th>Diagnosis</th>
              <th>Tooth</th>
              <th>Description</th>
              <th>Status</th>
              <th>Planned Date</th>
              <th>Performed Date</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map(t => (
              <tr key={t.treatment_id}>
                <td>{t.patient_first} {t.patient_last}</td>
                <td>{t.dentist_first ? `${t.dentist_first} ${t.dentist_last}` : "N/A"}</td>
                <td>{t.encounter_dt || "N/A"}</td>
                <td>{t.final_diagnosis || t.provisional_diagnosis || "N/A"}</td>
                <td>{t.tooth_code}</td>
                <td>{t.description}</td>
                <td>{t.status}</td>
                <td>{t.planned_date || "—"}</td>
                <td>{t.performed_date || "—"}</td>
                <td>{t.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
