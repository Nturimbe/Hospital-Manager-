import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./AdminDashboardPage.css";

interface Patient {
  id: number;
}

interface Doctor {
  id: number;
}

interface Appointment {
  id: number;
}

export default function AdminDashboardPage() {
  const [patientCount, setPatientCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [error, setError] = useState("");

  const { name, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [patientsResponse, doctorsResponse, appointmentsResponse] =
          await Promise.all([
            api.get<Patient[]>("/patients"),
            api.get<Doctor[]>("/doctors"),
            api.get<Appointment[]>("/appointments"),
          ]);

        setPatientCount(patientsResponse.data.length);
        setDoctorCount(doctorsResponse.data.length);
        setAppointmentCount(appointmentsResponse.data.length);
      } catch {
        setError("Unable to load dashboard information.");
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-brand-cross">+</div>

          <div className="admin-brand-text">
            <strong>HMS</strong>
            <span>Administration</span>
          </div>
        </div>

        <div className="admin-header-actions">
          <div className="admin-user">
            <strong>{name || "Administrator"}</strong>
            <span>Administrator</span>
          </div>

          <button
            className="admin-logout"
            type="button"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="admin-content">
        <div className="admin-welcome">
          <p className="admin-eyebrow">ADMINISTRATION</p>

          <h1>
            Welcome{name ? `, ${name.split(" ")[0]}` : ""}.
          </h1>

          <p>
            Monitor hospital activity and manage the main areas
            of the hospital system.
          </p>
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-statistics">
          <article className="admin-stat-card">
            <div className="admin-stat-icon">P</div>

            <div>
              <span>Registered patients</span>
              <strong>{patientCount}</strong>
              <p>Patients currently in the system</p>
            </div>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon">D</div>

            <div>
              <span>Doctors</span>
              <strong>{doctorCount}</strong>
              <p>Medical professionals registered</p>
            </div>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon">A</div>

            <div>
              <span>Appointments</span>
              <strong>{appointmentCount}</strong>
              <p>Appointments in the hospital system</p>
            </div>
          </article>
        </div>

        <div className="admin-section-heading">
          <h2>System management</h2>
          <p>Access the main administrative areas.</p>
        </div>

        <div className="admin-actions">
          <article className="admin-action-card">
            <div className="admin-action-number">01</div>

            <h3>Patient management</h3>

            <p>
              Access registered patient information and monitor
              patient activity.
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin/patients")}
            >
              Manage patients
            </button>
          </article>

          <article className="admin-action-card">
            <div className="admin-action-number">02</div>

            <h3>Doctor management</h3>

            <p>
              View doctors registered within the Hospital
              Management System.
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin/doctors")}
            >
              Manage doctors
            </button>
          </article>

          <article className="admin-action-card">
            <div className="admin-action-number">03</div>

            <h3>Appointments</h3>

            <p>
              Monitor appointments scheduled across the hospital.
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin/appointments")}
            >
              View appointments
            </button>
          </article>
        </div>
      </section>
    </main>
  );
}