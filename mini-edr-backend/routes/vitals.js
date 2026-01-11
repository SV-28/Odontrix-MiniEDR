const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all vitals with patient + encounter info
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
  `SELECT v.vitals_id, v.measured_at, v.systolic_mmHg, v.diastolic_mmHg, 
          v.pulse_bpm, v.temp_c, v.weight_kg, v.height_cm, v.notes,
          p.first_name AS patient_first, p.last_name AS patient_last,
          e.encounter_id, e.encounter_dt
   FROM Vitals v
   JOIN Patients p ON v.patient_id = p.patient_id
   JOIN Encounters e ON v.encounter_id = e.encounter_id
   ORDER BY v.measured_at DESC`
);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching vitals:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// Add new vitals record
router.post("/", async (req, res) => {
  try {
    const { patient_id, encounter_id, systolic_mmHg, diastolic_mmHg, pulse_bpm, temp_c, weight_kg, height_cm, notes } = req.body;

    const [result] = await pool.query(
      `INSERT INTO Vitals 
(patient_id, encounter_id, systolic_mmHg, diastolic_mmHg, pulse_bpm, temp_c, weight_kg, height_cm, notes)
VALUES (?,?,?,?,?,?,?,?,?)`,
      [patient_id, encounter_id, systolic_mmHg, diastolic_mmHg, pulse_bpm, temp_c, weight_kg, height_cm, notes]
    );

    res.json({ id: result.insertId, message: "Vitals added" });
  } catch (err) {
    console.error("Error adding vitals:", err.message);
    res.status(500).json({ error: "Failed to add vitals", details: err.message });
  }
});

module.exports = router;
