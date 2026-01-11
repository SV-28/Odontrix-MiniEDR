import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Users, CalendarDays, Stethoscope, Search, Brain, BarChart3, Settings, Mail } from "lucide-react";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-700">Odontrix</h1>
          <p className="text-sm text-gray-500 mt-1">mini EDR system</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          <NavItem to="/register" icon={<Users size={18} />} label="Registration" />
          <NavItem to="/appointments" icon={<CalendarDays size={18} />} label="Appointments" />
          <NavItem to="/records" icon={<Stethoscope size={18} />} label="Clinical Records" />
          <NavItem to="/xrays" icon={<Stethoscope size={18} />} label="X-rays & Scans" />
          <NavItem to="/search" icon={<Search size={18} />} label="Quick Search" />
          <NavItem to="/ai" icon={<Brain size={18} />} label="AI Risk Prediction" />
          <NavItem to="/dashboard" icon={<BarChart3 size={18} />} label="Dashboards & Analytics" />
          <NavItem to="/settings" icon={<Settings size={18} />} label="User Settings" />
          <NavItem to="/contact" icon={<Mail size={18} />} label="Contact Us" />
        </nav>

        <div className="p-4 border-t text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Odontrix | mini-EDR
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

/* Reusable nav item */
function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
          isActive
            ? "bg-blue-100 text-blue-700 font-semibold"
            : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
