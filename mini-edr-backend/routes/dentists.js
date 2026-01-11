const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all dentists
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT dentist_id, first_name, last_name, specialization FROM dentists"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching dentists:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

module.exports = router;
