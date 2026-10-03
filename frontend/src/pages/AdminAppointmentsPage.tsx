import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./AdminManagementPages.css";

interface Appointment {
  id: number;
  patientName?: string;
  doctorName?: string;
  appointmentDate: string;
  reason?: string;
  status?: string;
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(
    []
  );

  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response =
          await api.get<Appointment[]>("/appointments");

        setAppointments(response.data);
      } catch {
        setError("Unable to load appointments.");
      }
    };

    loadAppointments();
  }, []);

  return (
    <main className="management-page">
      <header className="management-header">
        <div className="management-brand">
          <div className="management-cross">+</div>

          <div className="management-brand-text">
            <strong>HMS</strong>
            <span>Administration</span>
          </div>
        </div>

        <Link to="/admin" className="management-back">
          ← Back to dashboard
        </Link>
      </header>

      <section className="management-content">
        <div className="management-title-row">
          <div>
            <p className="management-eyebrow">
              APPOINTMENT MANAGEMENT
            </p>

            <h1>Hospital appointments</h1>

            <p>
              Monitor appointments scheduled across the hospital.
            </p>
          </div>
        </div>

        {error && (
          <p className="management-error">{error}</p>
        )}

        <div className="management-table-card">
          <div className="management-table-heading">
            <div>
              <h2>Appointments</h2>
              <p>
                {appointments.length} appointments displayed
              </p>
            </div>
          </div>

          {!error && appointments.length === 0 ? (
            <p className="management-empty">
              No appointments found.
            </p>
          ) : (
            !error && (
              <div className="management-table-wrapper">
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>PATIENT</th>
                      <th>DOCTOR</th>
                      <th>DATE & TIME</th>
                      <th>REASON</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="management-primary">
                          {appointment.patientName || "Patient"}
                        </td>

                        <td>
                          {appointment.doctorName || "Doctor"}
                        </td>

                        <td>
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleString()}
                        </td>

                        <td>
                          {appointment.reason || "Not provided"}
                        </td>

                        <td>
                          <span className="management-status">
                            {appointment.status || "Scheduled"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
}