const express = require("express");
const router = express.Router();
const pool = require("../db");

// 📍 Get all tooth findings with patient + encounter info
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
          f.findings_id, 
          f.tooth_code, 
          f.tooth_condition, 
          f.status, 
          f.severity, 
          f.material, 
          f.oral_lesions, 
          f.white_red_patches, 
          f.poor_oral_hygiene, 
          f.notes, 
          f.created_at,
          p.first_name AS patient_first, 
          p.last_name AS patient_last,
          e.encounter_dt
       FROM toothfindings f
       JOIN patients p ON f.patient_id = p.patient_id
       JOIN encounters e ON f.encounter_id = e.encounter_id
       ORDER BY f.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching tooth findings:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// 📍 Add new tooth finding
router.post("/", async (req, res) => {
  try {
    const {
      patient_id,
      encounter_id,
      tooth_code,
      tooth_condition,
      status,
      severity,
      material,
      oral_lesions,
      white_red_patches,
      poor_oral_hygiene,
      notes,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO toothfindings 
       (patient_id, encounter_id, tooth_code, tooth_condition, status, severity, material, 
        oral_lesions, white_red_patches, poor_oral_hygiene, notes)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [
        patient_id,
        encounter_id,
        tooth_code,
        tooth_condition,
        status,
        severity,
        material,
        oral_lesions || "Unknown",
        white_red_patches || "Unknown",
        poor_oral_hygiene || "Unknown",
        notes,
      ]
    );

    res.json({ id: result.insertId, message: "Tooth finding added successfully" });
  } catch (err) {
    console.error("Error adding tooth finding:", err.message);
    res.status(500).json({
      error: "Failed to add tooth finding",
      details: err.message,
    });
  }
});

module.exports = router;
