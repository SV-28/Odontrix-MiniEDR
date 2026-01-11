const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all prescriptions with patient + dentist + treatment info
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT pr.prescription_id, pr.drug_name, pr.dosage, pr.frequency, pr.duration, pr.notes,
              p.first_name AS patient_first, p.last_name AS patient_last,
              d.first_name AS dentist_first, d.last_name AS dentist_last,
              t.description AS treatment_desc,
              e.encounter_dt
       FROM prescriptions pr
       JOIN patients p ON pr.patient_id = p.patient_id
       LEFT JOIN dentists d ON pr.dentist_id = d.dentist_id
       LEFT JOIN encounters e ON pr.encounter_id = e.encounter_id
       LEFT JOIN treatment t ON pr.treatment_id = t.treatment_id
       ORDER BY pr.prescription_id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching prescriptions:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// Add a new prescription
router.post("/", async (req, res) => {
  try {
    const { patient_id, dentist_id, encounter_id, treatment_id, drug_name, dosage, frequency, duration, notes } = req.body;

    const [result] = await pool.query(
      `INSERT INTO prescriptions (patient_id, dentist_id, encounter_id, treatment_id, drug_name, dosage, frequency, duration, notes)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [patient_id, dentist_id || null, encounter_id || null, treatment_id || null, drug_name, dosage, frequency, duration, notes]
    );

    res.json({ id: result.insertId, message: "Prescription added" });
  } catch (err) {
    console.error("Error adding prescription:", err.message);
    res.status(500).json({ error: "Failed to add prescription", details: err.message });
  }
});

module.exports = router;
