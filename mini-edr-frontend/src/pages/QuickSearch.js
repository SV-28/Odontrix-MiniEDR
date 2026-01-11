import React, { useState } from "react";
import API from "../api";
import {
  Search,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  FileSearch,
  Activity,
  Beaker,
  Stethoscope,
  FileText,
  Pill,
  Image as ImageIcon,
} from "lucide-react";

export default function QuickSearch() {
  const [form, setForm] = useState({ id: "", first_name: "", last_name: "" });
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearch = async () => {
    setError("");
    setData(null);
    try {
      const params = new URLSearchParams(
        Object.entries(form).filter(([_, v]) => v)
      ).toString();

      const res = await API.get(`/search?${params}`);
      setData(res.data);
    } catch (err) {
      console.error("Search error:", err);
      setError("No patient found or server error.");
    }
  };

  const clearSearch = () => {
    setForm({ id: "", first_name: "", last_name: "" });
    setData(null);
    setError("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        <Search size={22} /> Quick Search
      </h1>

      {/* Search Bar */}
      <div className="bg-white shadow-md rounded-xl p-5 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Patient ID</label>
          <input
            type="text"
            name="id"
            value={form.id}
            onChange={handleChange}
            placeholder="Enter ID"
            className="border rounded-md p-2 w-44"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="Enter first name"
            className="border rounded-md p-2 w-44"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Enter last name"
            className="border rounded-md p-2 w-44"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
        <button onClick={clearSearch} className="text-gray-500 hover:underline">
          Clear
        </button>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {/* Results */}
      {data && (
        <div className="mt-8 space-y-8">
          <h2 className="text-xl font-semibold text-gray-800">
            {data.patient.first_name} {data.patient.last_name}
          </h2>

          {/* 1️⃣ Appointments */}
          {data.appointments?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-2">
                <CalendarDays size={20} /> Appointments
              </h3>
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Complaint</th>
                  </tr>
                </thead>
                <tbody>
                  {data.appointments.map((a) => (
                    <tr key={a.app_id} className="border-t">
                      <td>{a.app_date}</td>
                      <td>{a.app_time}</td>
                      <td>{a.complaint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 2️⃣ Encounters */}
          {data.encounters?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-2">
                <ClipboardList size={20} /> Encounters
              </h3>
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th>Date</th>
                    <th>Visit</th>
                    <th>Difficulty Swallowing</th>
                    <th>Unexplained Bleeding</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.encounters.map((e) => (
                    <tr key={e.encounter_id} className="border-t">
                      <td>{e.encounter_dt}</td>
                      <td>{e.enc_visit}</td>
                      <td>{e.difficulty_swallowing}</td>
                      <td>{e.unexplained_bleeding}</td>
                      <td>{e.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3️⃣ Vitals */}
          {data.vitals?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-2">
                <HeartPulse size={20} /> Vitals
              </h3>
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th>Measured At</th>
                    <th>BP</th>
                    <th>Pulse</th>
                    <th>Temp</th>
                    <th>Weight</th>
                    <th>Height</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.vitals.map((v) => (
                    <tr key={v.vitals_id} className="border-t">
                      <td>{v.measured_at}</td>
                      <td>{v.systolic_mmHg}/{v.diastolic_mmHg}</td>
                      <td>{v.pulse_bpm}</td>
                      <td>{v.temp_c}</td>
                      <td>{v.weight_kg}</td>
                      <td>{v.height_cm}</td>
                      <td>{v.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 4️⃣ Tooth Findings */}
          {data.findings?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-2">
                <FileSearch size={20} /> Tooth Findings
              </h3>
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th>Tooth</th>
                    <th>Condition</th>
                    <th>Status</th>
                    <th>Severity</th>
                    <th>Material</th>
                    <th>Oral Lesions</th>
                    <th>White/Red Patches</th>
                    <th>Poor Hygiene</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.findings.map((f) => (
                    <tr key={f.findings_id} className="border-t">
                      <td>{f.tooth_code}</td>
                      <td>{f.tooth_condition}</td>
                      <td>{f.status}</td>
                      <td>{f.severity}</td>
                      <td>{f.material}</td>
                      <td>{f.oral_lesions}</td>
                      <td>{f.white_red_patches}</td>
                      <td>{f.poor_oral_hygiene}</td>
                      <td>{f.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 5️⃣ Past History */}
          {data.history?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-2">
                <Activity size={20} /> Past History
              </h3>
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th>Medical</th>
                    <th>Allergies</th>
                    <th>Tobacco</th>
                    <th>Alcohol</th>
                    <th>Betel</th>
                    <th>Diet</th>
                    <th>HPV</th>
                    <th>Sun Exposure</th>
                    <th>Family Cancer</th>
                    <th>Immune System</th>
                  </tr>
                </thead>
                <tbody>
                  {data.history.map((h) => (
                    <tr key={h.history_id} className="border-t">
                      <td>{h.medical_history}</td>
                      <td>{h.allergies}</td>
                      <td>{h.tobacco_use}</td>
                      <td>{h.alcohol_use}</td>
                      <td>{h.betel_quid_use}</td>
                      <td>{h.diet_fruits_veggies}</td>
                      <td>{h.hpv_infection}</td>
                      <td>{h.chronic_sun_exposure}</td>
                      <td>{h.family_history_cancer}</td>
                      <td>{h.compromised_immune_system}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 6️⃣ Lab Tests */}
          {data.labtests?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-2">
                <Beaker size={20} /> Lab Tests
              </h3>
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th>Test</th>
                    <th>Result</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.labtests.map((l) => (
                    <tr key={l.labtest_id} className="border-t">
                      <td>{l.test_name}</td>
                      <td>{l.result_value}</td>
                      <td>{l.result_dt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 7️⃣ Diagnoses */}
          {data.diagnoses?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-2">
                <Stethoscope size={20} /> Diagnoses
              </h3>
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th>ID</th>
                    <th>Encounter</th>
                    <th>Dentist</th>
                    <th>Provisional</th>
                    <th>Final</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.diagnoses.map((d) => (
                    <tr key={d.diagnosis_id} className="border-t">
                      <td>{d.diagnosis_id}</td>
                      <td>{d.encounter_id}</td>
                      <td>{d.dentist_id}</td>
                      <td>{d.provisional_diagnosis}</td>
                      <td>{d.final_diagnosis}</td>
                      <td>{d.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 8️⃣ Treatments */}
          {data.treatments?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-2">
                <FileText size={20} /> Treatments
              </h3>
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th>ID</th>
                    <th>Encounter</th>
                    <th>Dentist</th>
                    <th>Diagnosis ID</th>
                    <th>Tooth</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Planned</th>
                    <th>Performed</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.treatments.map((t) => (
                    <tr key={t.treatment_id} className="border-t">
                      <td>{t.treatment_id}</td>
                      <td>{t.encounter_id}</td>
                      <td>{t.dentist_id}</td>
                      <td>{t.diagnosis_id}</td>
                      <td>{t.tooth_code}</td>
                      <td>{t.description}</td>
                      <td>{t.status}</td>
                      <td>{t.planned_date}</td>
                      <td>{t.performed_date}</td>
                      <td>{t.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 9️⃣ Prescriptions */}
          {data.prescription?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-2">
                <Pill size={20} /> Prescriptions
              </h3>
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th>Drug</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Quantity</th>
                    <th>Start</th>
                    <th>End</th>
                  </tr>
                </thead>
                <tbody>
                  {data.prescription.map((p) => (
                    <tr key={p.prescription_id} className="border-t">
                      <td>{p.drug_name}</td>
                      <td>{p.dosage}</td>
                      <td>{p.frequency}</td>
                      <td>{p.duration_days}</td>
                      <td>{p.quantity}</td>
                      <td>{p.start_date}</td>
                      <td>{p.end_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 🔟 Radiographs */}
          {data.radiographs?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-2">
                <ImageIcon size={20} /> Radiographs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data.radiographs.map((r) => (
                  <div
                    key={r.radiograph_id}
                    className="border rounded-lg p-3 shadow-sm bg-white"
                  >
                    <h4 className="font-semibold text-blue-600 mb-2">
                      {r.image_type || "Radiograph"}
                    </h4>
                    {r.imageBase64 ? (
                      <img
                        src={`data:image/png;base64,${r.imageBase64}`}
                        alt={r.radiographic_diagnosis}
                        className="rounded-lg shadow-sm w-full h-60 object-contain"
                      />
                    ) : (
                      <p className="text-gray-400">No image available</p>
                    )}
                    <p className="text-sm text-gray-700 mt-2">
                      <strong>Diagnosis:</strong> {r.radiographic_diagnosis || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Taken on: {new Date(r.taken_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
