import React, { useEffect, useState } from "react";
import API from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [perDentist, setPerDentist] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  // -----------------------------
  // Fetch analytics data from backend
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/analytics");
        console.log("📊 Analytics data:", res.data);

        setSummary(res.data.totals || {});
        setPerDentist(res.data.appointmentsByDentist || []);
        setUpcoming(res.data.upcomingAppointments || []);
      } catch (err) {
        console.error("❌ Error loading analytics:", err);
      }
    };

    fetchData();
  }, []);

  // -----------------------------
  // UI rendering
  // -----------------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Clinic Dashboard & Analytics
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Patients"
          value={summary.patients}
          color="bg-blue-100"
        />
        <StatCard
          label="Total Appointments"
          value={summary.appointments}
          color="bg-yellow-100"
        />
        <StatCard
          label="Planned Treatments"
          value={summary.planned_treatments}
          color="bg-purple-100"
        />
        <StatCard
          label="Completed Treatments"
          value={summary.completed_treatments}
          color="bg-green-100"
        />
      </div>

      {/* Appointments by Dentist */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Appointments per Dentist
        </h2>

        {perDentist && perDentist.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={perDentist.map((d) => ({
                dentist_name: `${d.first_name} ${d.last_name}`,
                total_appointments: d.total_appointments,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dentist_name" />
              <YAxis allowDecimals={false} />
              {/* ✅ Tooltip for bar hover */}
              <Tooltip formatter={(value) => [`${value} Appointments`, "Total"]} />
              <Bar dataKey="total_appointments" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center">
            No appointment data available
          </p>
        )}
      </div>

      {/* Upcoming appointments */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Upcoming Appointments (Next 7 Days)
        </h2>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Patient</th>
              <th className="px-4 py-2">Dentist</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-4 text-gray-500"
                >
                  No upcoming appointments
                </td>
              </tr>
            ) : (
              upcoming.map((a) => (
                <tr key={a.app_id} className="border-t">
                  <td className="px-4 py-2">
                    {a.app_date?.substring(0, 10)}
                  </td>
                  <td className="px-4 py-2">{a.app_time}</td>
                  <td className="px-4 py-2">
                    {a.first_name} {a.last_name}
                  </td>
                  <td className="px-4 py-2">
                    {a.dentist_first} {a.dentist_last}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -----------------------------
// Reusable Stat Card component
// -----------------------------
function StatCard({ label, value, color }) {
  return (
    <div className={`${color} p-5 rounded-xl text-center shadow`}>
      <p className="text-gray-600 mb-1">{label}</p>
      <h2 className="text-3xl font-bold text-gray-800">
        {value !== undefined ? value : 0}
      </h2>
    </div>
  );
}
