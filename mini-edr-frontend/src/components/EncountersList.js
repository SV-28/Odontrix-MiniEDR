import React, { useEffect, useState } from "react";
import API from "../api";

export default function EncountersList() {
  const [encounters, setEncounters] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEncounters = async () => {
      try {
        const res = await API.get("/encounters");
        setEncounters(res.data || []);
      } catch (err) {
        console.error("Failed to fetch encounters:", err);
        setError("Could not load encounters.");
      }
    };
    fetchEncounters();
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="mt-6 bg-white shadow-md rounded-xl p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Encounter Records
      </h2>

      {encounters.length === 0 ? (
        <p className="text-gray-500">No encounters recorded.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-blue-50 text-gray-700">
              <tr>
                <th className="border p-2">Date & Time</th>
                <th className="border p-2">Patient</th>
                <th className="border p-2">Dentist</th>
                <th className="border p-2">Visit Type</th>
                <th className="border p-2">Difficulty Swallowing</th>
                <th className="border p-2">Unexplained Bleeding</th>
                <th className="border p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {encounters.map((e) => (
                <tr key={e.encounter_id} className="hover:bg-gray-50">
                  <td className="border p-2 text-gray-700">
                    {e.encounter_dt
                      ? new Date(e.encounter_dt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="border p-2 font-medium text-gray-800">
                    {e.patient_first} {e.patient_last}
                  </td>
                  <td className="border p-2 text-gray-700">
                    {e.dentist_first} {e.dentist_last}
                  </td>
                  <td className="border p-2">{e.enc_visit || "-"}</td>
                  <td
                    className={`border p-2 font-medium ${
                      e.difficulty_swallowing === "Yes"
                        ? "text-red-600"
                        : e.difficulty_swallowing === "No"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {e.difficulty_swallowing}
                  </td>
                  <td
                    className={`border p-2 font-medium ${
                      e.unexplained_bleeding === "Yes"
                        ? "text-red-600"
                        : e.unexplained_bleeding === "No"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {e.unexplained_bleeding}
                  </td>
                  <td className="border p-2 text-gray-600">
                    {e.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
