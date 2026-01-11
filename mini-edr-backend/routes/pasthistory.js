const express = require("express");
const router = express.Router();
const pool = require("../db");

// 📍 GET all past history records (with patient info)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT h.history_id, h.medical_history, h.allergies, h.dental_history,
              h.tobacco_use, h.alcohol_use, h.betel_quid_use, 
              h.diet_fruits_veggies, h.hpv_infection, h.chronic_sun_exposure,
              h.family_history_cancer, h.compromised_immune_system,
              h.duration, h.notes,
              p.first_name AS patient_first, p.last_name AS patient_last
       FROM Past_History h
       JOIN Patients p ON h.patient_id = p.patient_id
       ORDER BY h.history_id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching past history:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// 📍 POST new past history record
router.post("/", async (req, res) => {
  try {
    const {
      patient_id,
      medical_history,
      allergies,
      dental_history,
      tobacco_use,
      alcohol_use,
      betel_quid_use,
      diet_fruits_veggies,
      hpv_infection,
      chronic_sun_exposure,
      family_history_cancer,
      compromised_immune_system,
      duration,
      notes,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO Past_History 
      (patient_id, medical_history, allergies, dental_history,
       tobacco_use, alcohol_use, betel_quid_use, diet_fruits_veggies,
       hpv_infection, chronic_sun_exposure, family_history_cancer,
       compromised_immune_system, duration, notes)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        patient_id,
        medical_history,
        allergies,
        dental_history,
        tobacco_use,
        alcohol_use,
        betel_quid_use,
        diet_fruits_veggies,
        hpv_infection,
        chronic_sun_exposure,
        family_history_cancer,
        compromised_immune_system,
        duration,
        notes,
      ]
    );

    res.json({ id: result.insertId, message: "Past history added successfully" });
  } catch (err) {
    console.error("Error adding past history:", err.message);
    res.status(500).json({ error: "Failed to add past history", details: err.message });
  }
});

module.exports = router;
