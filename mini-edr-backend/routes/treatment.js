const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all treatments with patient + dentist + diagnosis info
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.treatment_id, t.tooth_code, t.description, t.status, t.planned_date, t.performed_date, t.notes,
              p.first_name AS patient_first, p.last_name AS patient_last,
              d.first_name AS dentist_first, d.last_name AS dentist_last,
              dx.provisional_diagnosis, dx.final_diagnosis,
              e.encounter_dt
       FROM treatment t
       JOIN patients p ON t.patient_id = p.patient_id
       LEFT JOIN dentists d ON t.dentist_id = d.dentist_id
       LEFT JOIN encounters e ON t.encounter_id = e.encounter_id
       LEFT JOIN diagnosis dx ON t.diagnosis_id = dx.diagnosis_id
       ORDER BY t.treatment_id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching treatments:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// Add new treatment
router.post("/", async (req, res) => {
  try {
    const { patient_id, dentist_id, encounter_id, diagnosis_id, tooth_code, description, status, planned_date, performed_date, notes } = req.body;

    const [result] = await pool.query(
      `INSERT INTO treatment (patient_id, dentist_id, encounter_id, diagnosis_id, tooth_code, description, status, planned_date, performed_date, notes)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [patient_id, dentist_id || null, encounter_id || null, diagnosis_id || null, tooth_code || null, description, status || "planned", planned_date || null, performed_date || null, notes || null]
    );

    res.json({ id: result.insertId, message: "Treatment added" });
  } catch (err) {
    console.error("Error adding treatment:", err.message);
    res.status(500).json({ error: "Failed to add treatment", details: err.message });
  }
});

module.exports = router;
