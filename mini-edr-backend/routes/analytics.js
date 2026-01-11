const express = require("express");
const router = express.Router();
const pool = require("../db");

// ----------------------------
//  Dashboard & Analytics Route
// ----------------------------
router.get("/", async (req, res) => {
  try {
    // 🧮 Total patients
    const [[patients]] = await pool.query(`SELECT COUNT(*) AS total FROM patients`);

    // 🗓️ Total appointments
    const [[appointments]] = await pool.query(`SELECT COUNT(*) AS total FROM appointments`);

    // 💊 Treatments by status
    const [[planned]] = await pool.query(`SELECT COUNT(*) AS total FROM Treatment WHERE LOWER(status) = 'planned'`);
    const [[completed]] = await pool.query(`SELECT COUNT(*) AS total FROM Treatment WHERE LOWER(status) = 'completed'`);

    // 🦷 Appointments per dentist
    const [appointmentsByDentist] = await pool.query(`
      SELECT d.first_name, d.last_name, COUNT(a.app_id) AS total_appointments
      FROM appointments a
      JOIN dentists d ON a.dentist_id = d.dentist_id
      GROUP BY d.dentist_id
    `);

    // 📅 Upcoming appointments (Next 7 days)
    const [upcomingAppointments] = await pool.query(`
      SELECT a.app_id, a.app_date, a.app_time,
             p.first_name, p.last_name,
             d.first_name AS dentist_first, d.last_name AS dentist_last
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      JOIN dentists d ON a.dentist_id = d.dentist_id
      WHERE a.app_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
      ORDER BY a.app_date ASC
    `);

    // ✅ Send combined analytics
    res.json({
      totals: {
        patients: patients.total || 0,
        appointments: appointments.total || 0,
        planned_treatments: planned.total || 0,
        completed_treatments: completed.total || 0,
      },
      appointmentsByDentist,
      upcomingAppointments,
    });
  } catch (err) {
    console.error("❌ Error loading analytics:", err.message);
    res.status(500).json({ error: "Failed to load analytics", details: err.message });
  }
});

module.exports = router;
