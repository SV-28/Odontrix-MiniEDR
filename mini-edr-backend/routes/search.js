const express = require("express");
const router = express.Router();
const pool = require("../db");

// 🔍 Search by patient_id OR first/last name
router.get("/", async (req, res) => {
  const { id, first_name, last_name } = req.query;

  try {
    console.log("Incoming search params:", req.query);
    let patient = [];

    // ✅ Search logic refined
    if (id) {
      const [rows] = await pool.query(
        "SELECT * FROM Patients WHERE patient_id = ?",
        [id]
      );
      patient = rows;
    } else if (first_name && !last_name) {
      console.log("Searching by first name:", first_name);
      const [rows] = await pool.query(
        "SELECT * FROM Patients WHERE LOWER(first_name) LIKE LOWER(?)",
        [`%${first_name}%`]
      );
      console.log("Search result rows:", rows.length);
      patient = rows;
    
      patient = rows;
    } else if (!first_name && last_name) {
      const [rows] = await pool.query(
        "SELECT * FROM Patients WHERE last_name LIKE ?",
        [`%${last_name}%`]
      );
      patient = rows;
    } else if (first_name && last_name) {
      const [rows] = await pool.query(
        "SELECT * FROM Patients WHERE first_name LIKE ? OR last_name LIKE ?",
        [`%${first_name}%`, `%${last_name}%`]
      );
      patient = rows;
    }

    if (!patient.length) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const patientId = patient[0].patient_id;

    // 🗓 Appointments
    const [appointments] = await pool.query(
      `SELECT app_id, app_date, app_time, complaint
       FROM appointments
       WHERE patient_id = ?
       ORDER BY app_date DESC`,
      [patientId]
    );

    // 🦷 Encounters
    const [encounters] = await pool.query(
      `SELECT
         encounter_id, encounter_dt, enc_visit,
         difficulty_swallowing, unexplained_bleeding, notes
       FROM encounters
       WHERE patient_id = ?
       ORDER BY encounter_dt DESC`,
      [patientId]
    );

    // ❤️ Vitals
    const [vitals] = await pool.query(
      `SELECT
         vitals_id, measured_at,
         systolic_mmHg, diastolic_mmHg, pulse_bpm, temp_c,
         weight_kg, height_cm, notes
       FROM vitals
       WHERE patient_id = ?
       ORDER BY measured_at DESC`,
      [patientId]
    );

    // 🦷 Tooth Findings (risk factors)
    const [findings] = await pool.query(
      `SELECT
         findings_id, tooth_code, tooth_condition, status,
         severity, material,
         oral_lesions, white_red_patches, poor_oral_hygiene,
         notes, created_at
       FROM toothfindings
       WHERE patient_id = ?
       ORDER BY created_at DESC`,
      [patientId]
    );

    // 🩺 Past History (risk factors)
    const [history] = await pool.query(
      `SELECT
         history_id, medical_history, allergies, dental_history,
         tobacco_use, alcohol_use, betel_quid_use, diet_fruits_veggies,
         hpv_infection, chronic_sun_exposure, family_history_cancer,
         compromised_immune_system, duration, notes
       FROM past_history
       WHERE patient_id = ?`,
      [patientId]
    );

    // 🧪 Lab Tests
    const [labtests] = await pool.query(
      `SELECT
         labtest_id, test_name, result_value, result_dt
       FROM labtests
       WHERE patient_id = ?
       ORDER BY result_dt DESC`,
      [patientId]
    );

    // ⚕️ Diagnoses
    const [diagnoses] = await pool.query(
      `SELECT
         diagnosis_id, encounter_id, dentist_id, provisional_diagnosis, final_diagnosis
       FROM diagnosis
       WHERE patient_id = ?`,
      [patientId]
    );

    // 💊 Treatments
    const [treatments] = await pool.query(
      `SELECT
         treatment_id, dentist_id, encounter_id, diagnosis_id, tooth_code, description, status, planned_date, performed_date, notes
       FROM treatment
       WHERE patient_id = ?
       ORDER BY performed_date DESC`,
      [patientId]
    );

    // 🧾 Prescriptions
    const [prescription] = await pool.query(
      `SELECT
        encounter_id, drug_name, dosage, frequency, duration_days, quantity, instructions, start_date, end_date
       FROM prescription
       WHERE patient_id = ?`,
      [patientId]
    );

    // 🩻 Radiographs (convert image blob to base64)
    const [radiographsRaw] = await pool.query(
      `SELECT
         radiograph_id, x_rays, tooth_code, taken_at,
         radiographic_diagnosis, image_type
       FROM radiographs
       WHERE patient_id = ?
       ORDER BY taken_at DESC`,
      [patientId]
    );

    // Convert each radiograph to base64 string for frontend
    const radiographs = radiographsRaw.map((r) => ({
      ...r,
      imageBase64: r.x_rays
        ? Buffer.from(r.x_rays, "binary").toString("base64")
        : null,
    }));

    // ✅ Return all data to frontend
    res.json({
      patient: patient[0],
      appointments,
      encounters,
      vitals,
      findings,
      history,
      labtests,
      diagnoses,
      treatments,
      prescription,
      radiographs,
    });
  } catch (err) {
    console.error("Error in search:", err.message);
    res.status(500).json({ error: "Search failed", details: err.message });
  }
});

module.exports = router;
