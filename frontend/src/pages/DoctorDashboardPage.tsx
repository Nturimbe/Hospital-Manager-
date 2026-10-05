import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./DoctorDashboardPage.css";

interface Appointment {
  id: number;
  patientName?: string;
  appointmentDate: string;
  reason?: string;
  status?: string;
}

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await api.get<Appointment[]>("/appointments");
        setAppointments(response.data);
      } catch {
        setError("Unable to load appointments.");
      }
    };

    loadAppointments();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="doctor-page">
      <header className="doctor-header">
        <div className="doctor-brand">
          <div className="doctor-brand-cross">+</div>

          <div className="doctor-brand-text">
            <strong>HMS</strong>
            <span>Doctor Portal</span>
          </div>
        </div>

        <div className="doctor-header-actions">
          <div className="doctor-user">
            <strong>Doctor</strong>
            <span>Doctor</span>
          </div>

          <button
            className="doctor-logout"
            type="button"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="doctor-content">
        <div className="doctor-welcome">
          <div>
            <p className="doctor-eyebrow">DOCTOR PORTAL</p>

            <h1>Welcome back!</h1>

            <p>
              Review your appointments and access patient medical
              records from your dashboard.
            </p>
          </div>
        </div>

        <div className="doctor-summary">
          <div className="doctor-summary-card">
            <span>Today's appointments</span>
            <strong>{appointments.length}</strong>
            <p>Patients currently on your schedule</p>
          </div>

          <div className="doctor-summary-card">
            <span>Medical records</span>
            <strong>EMR</strong>
            <p>Review and manage patient records</p>
          </div>
        </div>

        <div className="doctor-appointments-card">
          <div className="doctor-card-heading">
            <div>
              <h2>Appointments</h2>
              <p>Your current patient appointment schedule</p>
            </div>

            <button
              className="doctor-records-button"
              type="button"
              onClick={() => navigate("/doctor/medical-records")}
            >
              View medical records
            </button>
          </div>

          {error && <p className="doctor-error">{error}</p>}

          {!error && appointments.length === 0 ? (
            <p className="doctor-empty">
              No appointments are currently scheduled.
            </p>
          ) : (
            !error && (
              <div className="doctor-table-wrapper">
                <table className="doctor-table">
                  <thead>
                    <tr>
                      <th>PATIENT</th>
                      <th>DATE & TIME</th>
                      <th>REASON</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="doctor-patient-name">
                          {appointment.patientName || "Patient"}
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
                          <span className="doctor-status">
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