const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all lab tests with patient + encounter info
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.labtest_id, l.test_name, l.result_value, l.units, l.reference_range, 
              l.result_dt, l.notes,
              p.first_name AS patient_first, p.last_name AS patient_last,
              e.encounter_dt
       FROM labtests l
       JOIN patients p ON l.patient_id = p.patient_id
       LEFT JOIN encounters e ON l.encounter_id = e.encounter_id
       ORDER BY l.result_dt DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching lab tests:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// Add new lab test
router.post("/", async (req, res) => {
  try {
    const { patient_id, encounter_id, test_name, result_value, units, reference_range, notes } = req.body;

    const [result] = await pool.query(
      `INSERT INTO labtests (patient_id, encounter_id, test_name, result_value, units, reference_range, notes) 
       VALUES (?,?,?,?,?,?,?)`,
      [patient_id, encounter_id, test_name, result_value, units, reference_range, notes]
    );

    res.json({ id: result.insertId, message: "Lab test added" });
  } catch (err) {
    console.error("Error adding lab test:", err.message);
    res.status(500).json({ error: "Failed to add lab test", details: err.message });
  }
});

module.exports = router;
