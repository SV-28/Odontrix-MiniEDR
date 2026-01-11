import React, { useEffect, useState } from "react";
import API from "../api";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/appointments");
        setAppointments(res.data || []); // ensure it's always an array
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Could not load appointments. Please try again.");
      }
    };
    fetchAppointments();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold">Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table border="1" cellPadding="8" className="mt-2">
          <thead>
            <tr>
              <th>Date</th><th>Time</th><th>Patient</th><th>Dentist</th><th>Complaint</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.app_id}>
                <td>{a.app_date}</td>
                <td>{a.app_time}</td>
                <td>{a.patient_first} {a.patient_last}</td>
                <td>
                  {a.dentist_first} {a.dentist_last}
                  {a.specialization ? ` (${a.specialization})` : ""}
                </td>
                <td>{a.complaint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
