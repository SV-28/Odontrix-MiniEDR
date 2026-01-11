import React, { useEffect, useState } from "react";
import API from "../api";

export default function RadiographsList() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRadiographs = async () => {
      try {
        const res = await API.get("/radiographs");
        setRecords(res.data || []);
      } catch (err) {
        console.error("Failed to fetch radiographs:", err);
        setError("Could not load radiographs.");
      }
    };
    fetchRadiographs();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold">Radiographs</h2>
      {records.length === 0 ? (
        <p>No radiographs uploaded.</p>
      ) : (
        <table border="1" cellPadding="8" className="mt-2">
          <thead>
            <tr>
              <th>Date</th>
              <th>Patient</th>
              <th>Dentist</th>
              <th>X-ray Type</th>
              <th>Tooth</th>
              <th>Diagnosis</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.radiograph_id}>
                <td>{r.taken_at}</td>
                <td>{r.patient_first} {r.patient_last}</td>
                <td>{r.dentist_first ? `${r.dentist_first} ${r.dentist_last}` : "N/A"}</td>
                <td>{r.x_rays}</td>
                <td>{r.tooth_code}</td>
                <td>{r.radiographic_diagnosis}</td>
                <td>
                  <img 
                    src={`http://localhost:5050/api/radiographs/${r.radiograph_id}/image`} 
                    alt="Radiograph" 
                    style={{ width: "100px" }} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
