const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all patients
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM patients ORDER BY patient_id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching patients:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// Get single patient by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM patients WHERE patient_id = ?", [req.params.id]);
    res.json(rows[0] || {});
  } catch (err) {
    console.error("Error fetching patient:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// Add new patient
router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, dob, email, gender, phone, address, marital_status, occupation } = req.body;
    const [result] = await pool.query(
      `INSERT INTO patients (first_name, last_name, dob, email, gender, phone, address, marital_status, occupation)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [first_name, last_name, dob, email, gender, phone, address, marital_status, occupation]
    );
    res.json({ id: result.insertId, message: "Patient created" });
  } catch (err) {
    console.error("Error adding patient:", err.message);
    res.status(500).json({ error: "Failed to add patient", details: err.message });
  }
});

module.exports = router;
