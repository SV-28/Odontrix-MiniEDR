import React, { useEffect, useState } from "react";
import API from "../api";

export default function ToothFindingsList() {
  const [findings, setFindings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFindings = async () => {
      try {
        const res = await API.get("/toothfindings");
        setFindings(res.data || []);
      } catch (err) {
        console.error("Failed to fetch tooth findings:", err);
        setError("Could not load tooth findings.");
      }
    };
    fetchFindings();
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="mt-6 bg-white shadow-md rounded-xl p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Tooth Findings
      </h2>

      {findings.length === 0 ? (
        <p className="text-gray-500">No tooth findings recorded.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-blue-50 text-gray-700">
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Patient</th>
                <th className="border p-2">Tooth Code</th>
                <th className="border p-2">Condition</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Severity</th>
                <th className="border p-2">Material</th>
                <th className="border p-2">Oral Lesions</th>
                <th className="border p-2">White/Red Patches</th>
                <th className="border p-2">Poor Oral Hygiene</th>
                <th className="border p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((f) => (
                <tr key={f.findings_id} className="hover:bg-gray-50 transition-all">
                  <td className="border p-2 text-gray-700">
                    {f.created_at ? new Date(f.created_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="border p-2 font-medium text-gray-800">
                    {f.patient_first} {f.patient_last}
                  </td>
                  <td className="border p-2">{f.tooth_code}</td>
                  <td className="border p-2">{f.tooth_condition || "-"}</td>
                  <td className="border p-2">{f.status || "-"}</td>
                  <td className="border p-2">{f.severity || "-"}</td>
                  <td className="border p-2">{f.material || "-"}</td>

                  {/* Risk Indicators */}
                  <td
                    className={`border p-2 font-medium ${
                      f.oral_lesions === "Yes"
                        ? "text-red-600"
                        : f.oral_lesions === "No"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {f.oral_lesions}
                  </td>
                  <td
                    className={`border p-2 font-medium ${
                      f.white_red_patches === "Yes"
                        ? "text-red-600"
                        : f.white_red_patches === "No"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {f.white_red_patches}
                  </td>
                  <td
                    className={`border p-2 font-medium ${
                      f.poor_oral_hygiene === "Yes"
                        ? "text-red-600"
                        : f.poor_oral_hygiene === "No"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {f.poor_oral_hygiene}
                  </td>

                  <td className="border p-2 text-gray-600">{f.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
