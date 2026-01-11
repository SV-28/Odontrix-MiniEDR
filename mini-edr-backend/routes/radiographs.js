const express = require("express");
const multer = require("multer");
const router = express.Router();
const pool = require("../db");

// Multer setup (store file in memory, save to DB as blob)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all radiographs (without image data to avoid large payloads)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.radiograph_id, r.x_rays, r.tooth_code, r.taken_at, r.radiographic_diagnosis, r.image_type,
              p.first_name AS patient_first, p.last_name AS patient_last,
              d.first_name AS dentist_first, d.last_name AS dentist_last,
              e.encounter_dt
       FROM radiographs r
       JOIN patients p ON r.patient_id = p.patient_id
       LEFT JOIN dentists d ON r.dentist_id = d.dentist_id
       LEFT JOIN encounters e ON r.encounter_id = e.encounter_id
       ORDER BY r.taken_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching radiographs:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// Get a single image blob by ID
router.get("/:id/image", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT image_data, image_type FROM radiographs WHERE radiograph_id = ?",
      [req.params.id]
    );
    if (!rows.length || !rows[0].image_data) {
      return res.status(404).send("Image not found");
    }
    res.setHeader("Content-Type", rows[0].image_type);
    res.send(rows[0].image_data);
  } catch (err) {
    console.error("Error fetching image:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// Add new radiograph (with optional image upload)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { patient_id, dentist_id, encounter_id, x_rays, tooth_code, radiographic_diagnosis } = req.body;

    const [result] = await pool.query(
      `INSERT INTO radiographs (patient_id, dentist_id, encounter_id, x_rays, tooth_code, radiographic_diagnosis, image_data, image_type)
       VALUES (?,?,?,?,?,?,?,?)`,
      [
        patient_id,
        dentist_id || null,
        encounter_id || null,
        x_rays,
        tooth_code || null,
        radiographic_diagnosis || null,
        req.file ? req.file.buffer : null,
        req.file ? req.file.mimetype : null
      ]
    );

    res.json({ id: result.insertId, message: "Radiograph added" });
  } catch (err) {
    console.error("Error adding radiograph:", err.message);
    res.status(500).json({ error: "Failed to add radiograph", details: err.message });
  }
});

module.exports = router;
