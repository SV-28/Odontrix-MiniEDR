import React, { useEffect, useState } from "react";
import API from "../api";

export default function PastHistoryList() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/pasthistory");
        setRecords(res.data || []);
      } catch (err) {
        console.error("Failed to fetch past history:", err);
        setError("Could not load past history.");
      }
    };
    fetchHistory();
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="mt-6 bg-white shadow-md rounded-xl p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Past History Records
      </h2>

      {records.length === 0 ? (
        <p className="text-gray-500">No past history recorded.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-blue-50 text-gray-700">
              <tr>
                <th className="border p-2">Patient</th>
                <th className="border p-2">Medical History</th>
                <th className="border p-2">Allergies</th>
                <th className="border p-2">Dental History</th>
                <th className="border p-2">Tobacco</th>
                <th className="border p-2">Alcohol</th>
                <th className="border p-2">Betel-Quid</th>
                <th className="border p-2">Diet (F/V)</th>
                <th className="border p-2">HPV</th>
                <th className="border p-2">Sun Exposure</th>
                <th className="border p-2">Family Cancer</th>
                <th className="border p-2">Immune System</th>
                <th className="border p-2">Duration</th>
                <th className="border p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {records.map((h) => (
                <tr
                  key={h.history_id}
                  className="hover:bg-gray-50 transition-all"
                >
                  <td className="border p-2 font-medium text-gray-800">
                    {h.patient_first} {h.patient_last}
                  </td>
                  <td className="border p-2">{h.medical_history || "-"}</td>
                  <td className="border p-2">{h.allergies || "-"}</td>
                  <td className="border p-2">{h.dental_history || "-"}</td>
                  <td className="border p-2">{h.tobacco_use}</td>
                  <td className="border p-2">{h.alcohol_use}</td>
                  <td className="border p-2">{h.betel_quid_use}</td>
                  <td className="border p-2">{h.diet_fruits_veggies}</td>
                  <td className="border p-2">{h.hpv_infection}</td>
                  <td className="border p-2">{h.chronic_sun_exposure}</td>
                  <td className="border p-2">{h.family_history_cancer}</td>
                  <td className="border p-2">{h.compromised_immune_system}</td>
                  <td className="border p-2">{h.duration}</td>
                  <td className="border p-2">{h.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
