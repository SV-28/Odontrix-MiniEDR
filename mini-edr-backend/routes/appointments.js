const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all appointments with patient + dentist names
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.app_id, a.app_date, a.app_time, a.visit, a.complaint, 
              p.first_name AS patient_first, p.last_name AS patient_last,
              d.dentist_id, d.first_name AS dentist_first, d.last_name AS dentist_last, d.specialization
       FROM appointments a
       JOIN patients p ON a.patient_id = p.patient_id
       JOIN dentists d ON a.dentist_id = d.dentist_id
       ORDER BY a.app_date DESC, a.app_time`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching appointments:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// Create new appointment
router.post("/", async (req, res) => {
  try {
    const { patient_id, dentist_id, app_date, app_time, visit, complaint } = req.body;

    const [result] = await pool.query(
      `INSERT INTO appointments (patient_id, dentist_id, app_date, app_time, visit, complaint) 
       VALUES (?,?,?,?,?,?)`,
      [patient_id, dentist_id, app_date, app_time, visit, complaint]
    );

    res.json({ id: result.insertId, message: "Appointment created" });
  } catch (err) {
    console.error("Error creating appointment:", err.message);
    res.status(500).json({ error: "Failed to create appointment", details: err.message });
  }
});

module.exports = router;
