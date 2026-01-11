const express = require("express");
const router = express.Router();
const pool = require("../db");

// 📍 Get all encounters with patient + dentist names
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
          e.encounter_id, 
          e.encounter_dt, 
          e.enc_visit, 
          e.difficulty_swallowing,
          e.unexplained_bleeding,
          e.notes,
          p.first_name AS patient_first, 
          p.last_name AS patient_last,
          d.first_name AS dentist_first, 
          d.last_name AS dentist_last
       FROM encounters e
       JOIN patients p ON e.patient_id = p.patient_id
       JOIN dentists d ON e.dentist_id = d.dentist_id
       ORDER BY e.encounter_dt DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching encounters:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// 📍 Add a new encounter
router.post("/", async (req, res) => {
  try {
    const {
      patient_id,
      dentist_id,
      app_id,
      enc_visit,
      difficulty_swallowing,
      unexplained_bleeding,
      notes,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO encounters 
        (patient_id, dentist_id, app_id, enc_visit, 
         difficulty_swallowing, unexplained_bleeding, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        dentist_id,
        app_id || null,
        enc_visit,
        difficulty_swallowing || "Unknown",
        unexplained_bleeding || "Unknown",
        notes,
      ]
    );

    res.json({ id: result.insertId, message: "Encounter created successfully" });
  } catch (err) {
    console.error("Error creating encounter:", err.message);
    res.status(500).json({
      error: "Failed to create encounter",
      details: err.message,
    });
  }
});

module.exports = router;
