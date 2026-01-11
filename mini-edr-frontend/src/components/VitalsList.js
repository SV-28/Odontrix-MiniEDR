import React, { useEffect, useState } from "react";
import API from "../api";

export default function VitalsList() {
  const [vitals, setVitals] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const res = await API.get("/vitals");
        setVitals(res.data || []);
        console.log("Fetched vitals:", res.data);
      } catch (err) {
        console.error("Failed to fetch vitals:", err);
        setError("Could not load vitals.");
      }
    };
    fetchVitals();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold">Vitals</h2>
      {vitals.length === 0 ? (
        <p>No vitals recorded.</p>
      ) : (
        <table border="1" cellPadding="8" className="mt-2">
          <thead>
            <tr>
              <th>Measured At</th>
              <th>Patient</th>
              <th>Encounter</th>
              <th>BP</th>
              <th>Pulse</th>
              <th>Temp</th>
              <th>Weight</th>
              <th>Height</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {vitals.map(v => (
              <tr key={v.vitals_id}>
                <td>{v.measured_at}</td>
                <td>{v.patient_first} {v.patient_last}</td>
                <td>{v.encounter_id}</td>
                <td>{v.systolic_mmHg}/{v.diastolic_mmHg}</td>
                <td>{v.pulse_bpm}</td>
                <td>{v.temp_c}</td>
                <td>{v.weight_kg}</td>
                <td>{v.height_cm}</td>
                <td>{v.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
