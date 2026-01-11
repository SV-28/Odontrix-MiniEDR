import React, { useState } from "react";
import API from "../api";

export default function AiPrediction() {
  const [patientId, setPatientId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await API.get(`/predict/${patientId}`);
      setResult(res.data);
    } catch (err) {
      console.error("Error:", err);
      alert("Prediction failed or patient not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        AI Oral Cancer Risk Prediction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <input
          type="number"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter Patient ID"
          className="border p-2 rounded-md w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700"
        >
          {loading ? "Running Prediction..." : "Run Prediction"}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-white p-4 rounded-md shadow-md max-w-md">
          <h3 className="text-lg font-semibold mb-2">
            Patient #{result.patient_id}
          </h3>
          <p>
            <strong>Prediction:</strong>{" "}
            <span
              className={
                result.prediction === "High Risk"
                  ? "text-red-600"
                  : result.prediction === "Medium Risk"
                  ? "text-yellow-600"
                  : "text-green-600"
              }
            >
              {result.prediction}
            </span>
          </p>
          <p>
            <strong>Probability:</strong>{" "}
            {Math.round(result.probability * 100)}%
          </p>
        </div>
      )}
    </div>
  );
}
