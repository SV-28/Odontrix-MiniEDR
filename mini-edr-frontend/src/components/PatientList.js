import React, { useEffect, useState } from "react";
import API from "../api";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get("/patients");
        setPatients(res.data);
      } catch (err) {
        console.error("Failed to fetch patients", err);
        setError("Could not load patients");
      }
    };
    fetchPatients();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold">All Patients</h2>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <table border="1" cellPadding="8" className="mt-2">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>DOB</th><th>Email</th><th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.patient_id}>
                <td>{p.patient_id}</td>
                <td>{p.first_name} {p.last_name}</td>
                <td>{p.dob}</td>
                <td>{p.email}</td>
                <td>{p.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
