const express = require("express");
const router = express.Router();
const pool = require("../db");
const axios = require("axios");

// Calculate age from DOB
function calculateAge(dob) {
  const birthYear = new Date(dob).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

// /api/predict/:patientId
router.get("/:id", async (req, res) => {
  const patientId = req.params.id;

  try {
    // --- Patients ---
    const [patient] = await pool.query(
      "SELECT dob, gender FROM Patients WHERE patient_id=?",
      [patientId]
    );

    if (!patient.length) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const age = calculateAge(patient[0].dob);

    // --- Past History ---
    const [history] = await pool.query(
      `SELECT tobacco_use, alcohol_use, betel_quid_use, diet_fruits_veggies,
              hpv_infection, chronic_sun_exposure, family_history_cancer,
              compromised_immune_system
       FROM Past_History WHERE patient_id=?`,
      [patientId]
    );

    // --- Tooth Findings ---
    const [tooth] = await pool.query(
      `SELECT oral_lesions, white_red_patches, poor_oral_hygiene
       FROM ToothFindings WHERE patient_id=? ORDER BY created_at DESC LIMIT 1`,
      [patientId]
    );

    // --- Encounters ---
    const [encounter] = await pool.query(
      `SELECT difficulty_swallowing, unexplained_bleeding
       FROM Encounters WHERE patient_id=? ORDER BY encounter_dt DESC LIMIT 1`,
      [patientId]
    );

    const h = history[0] || {};
    const t = tooth[0] || {};
    const e = encounter[0] || {};

    const features = {
    Age: age || 0,
    Gender: patient[0]?.gender || "Unknown",
    "Tobacco Use": h.tobacco_use || "Unknown",
    "Alcohol Consumption": h.alcohol_use || "Unknown",
    "HPV Infection": h.hpv_infection || "Unknown",
    "Betel Quid Use": h.betel_quid_use || "Unknown",
    "Chronic Sun Exposure": h.chronic_sun_exposure || "Unknown",
    "Poor Oral Hygiene": t.poor_oral_hygiene || "Unknown",
    "Diet (Fruits & Vegetables Intake)": h.diet_fruits_veggies || "Unknown",
    "Family History of Cancer": h.family_history_cancer || "Unknown",
    "Compromised Immune System": h.compromised_immune_system || "Unknown",
    "Oral Lesions": t.oral_lesions || "Unknown",
    "Unexplained Bleeding": e.unexplained_bleeding || "Unknown",
    "Difficulty Swallowing": e.difficulty_swallowing || "Unknown",
    "White or Red Patches in Mouth": t.white_red_patches || "Unknown",
    };


    console.log("Sending features to Flask:", features);

    const response = await axios.post("http://127.0.0.1:8000/predict", features);

    res.json({
      patient_id: patientId,
      features,
      prediction: response.data.prediction,
      probability: response.data.probability,
    });
  } catch (err) {
    console.error("Prediction route error:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
