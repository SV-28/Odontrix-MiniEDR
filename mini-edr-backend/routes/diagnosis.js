const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all diagnoses with patient + dentist info
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT d.diagnosis_id, d.provisional_diagnosis, d.final_diagnosis,
              p.first_name AS patient_first, p.last_name AS patient_last,
              dent.first_name AS dentist_first, dent.last_name AS dentist_last,
              e.encounter_dt
       FROM diagnosis d
       JOIN patients p ON d.patient_id = p.patient_id
       LEFT JOIN dentists dent ON d.dentist_id = dent.dentist_id
       LEFT JOIN encounters e ON d.encounter_id = e.encounter_id
       ORDER BY d.diagnosis_id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching diagnoses:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// Add new diagnosis
router.post("/", async (req, res) => {
  try {
    const { patient_id, dentist_id, encounter_id, provisional_diagnosis, final_diagnosis } = req.body;

    const [result] = await pool.query(
      `INSERT INTO diagnosis (patient_id, dentist_id, encounter_id, provisional_diagnosis, final_diagnosis)
       VALUES (?,?,?,?,?)`,
      [patient_id, dentist_id || null, encounter_id || null, provisional_diagnosis, final_diagnosis]
    );

    res.json({ id: result.insertId, message: "Diagnosis added" });
  } catch (err) {
    console.error("Error adding diagnosis:", err.message);
    res.status(500).json({ error: "Failed to add diagnosis", details: err.message });
  }
});

module.exports = router;
