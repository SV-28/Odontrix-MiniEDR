import React, { useEffect, useState } from "react";
import API from "../api";

export default function LabTestsList() {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await API.get("/labtests");
        setTests(res.data || []);
      } catch (err) {
        console.error("Failed to fetch lab tests:", err);
        setError("Could not load lab tests.");
      }
    };
    fetchTests();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold">Lab Tests</h2>
      {tests.length === 0 ? (
        <p>No lab tests recorded.</p>
      ) : (
        <table border="1" cellPadding="8" className="mt-2">
          <thead>
            <tr>
              <th>Date</th>
              <th>Patient</th>
              <th>Encounter</th>
              <th>Test</th>
              <th>Result</th>
              <th>Units</th>
              <th>Reference</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {tests.map(t => (
              <tr key={t.labtest_id}>
                <td>{t.result_dt}</td>
                <td>{t.patient_first} {t.patient_last}</td>
                <td>{t.encounter_dt || "N/A"}</td>
                <td>{t.test_name}</td>
                <td>{t.result_value}</td>
                <td>{t.units}</td>
                <td>{t.reference_range}</td>
                <td>{t.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
