import React, { useEffect, useState } from "react";
import API from "../api";

export default function DiagnosisList() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/diagnosis");
        setDiagnoses(res.data || []);
      } catch (err) {
        console.error("Failed to fetch diagnosis:", err);
        setError("Could not load diagnoses.");
      }
    };
    fetchData();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold">Diagnosis</h2>
      {diagnoses.length === 0 ? (
        <p>No diagnoses recorded.</p>
      ) : (
        <table border="1" cellPadding="8" className="mt-2">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Dentist</th>
              <th>Encounter</th>
              <th>Provisional Diagnosis</th>
              <th>Final Diagnosis</th>
            </tr>
          </thead>
          <tbody>
            {diagnoses.map(d => (
              <tr key={d.diagnosis_id}>
                <td>{d.patient_first} {d.patient_last}</td>
                <td>{d.dentist_first ? `${d.dentist_first} ${d.dentist_last}` : "N/A"}</td>
                <td>{d.encounter_dt || "N/A"}</td>
                <td>{d.provisional_diagnosis}</td>
                <td>{d.final_diagnosis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
