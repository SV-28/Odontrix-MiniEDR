import React, { useEffect, useState } from "react";
import API from "../api";

export default function PrescriptionList() {
  const [prescriptions, setPrescriptions] = useState([]); 
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/prescription"); // your backend endpoint
        setPrescriptions(res.data || []); 
      } catch (err) {
        console.error("Failed to fetch prescription:", err);
        setError("Could not load prescription.");
      }
    };
    fetchData();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold">Prescription</h2>
      {prescriptions.length === 0 ? ( 
        <p>No prescription recorded.</p>
      ) : (
        <table border="1" cellPadding="8" className="mt-2">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Dentist</th>
              <th>Encounter</th>
              <th>Treatment</th>
              <th>Drug</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map(pr => ( 
              <tr key={pr.prescription_id}>
                <td>{pr.patient_first} {pr.patient_last}</td>
                <td>{pr.dentist_first ? `${pr.dentist_first} ${pr.dentist_last}` : "N/A"}</td>
                <td>{pr.encounter_dt || "N/A"}</td>
                <td>{pr.treatment_desc || "N/A"}</td>
                <td>{pr.drug_name}</td>
                <td>{pr.dosage}</td>
                <td>{pr.frequency}</td>
                <td>{pr.duration}</td>
                <td>{pr.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
