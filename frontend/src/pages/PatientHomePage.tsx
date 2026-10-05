import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./PatientHomePage.css";

export default function PatientHomePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="patient-dashboard">
      <header className="patient-header">
        <div className="patient-brand">
          <div className="patient-brand-cross">+</div>

          <div>
            <strong>HMS</strong>
            <span>Patient Portal</span>
          </div>
        </div>

        <div className="patient-header-actions">
          <div className="patient-profile">
            <div className="patient-avatar">
              "P"
            </div>

            <div>
              <strong>Patient</strong>
              <span>Patient</span>
            </div>
          </div>

          <button
            className="patient-logout"
            type="button"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="patient-dashboard-content">
        <div className="patient-welcome">
          <div>
            <p className="patient-eyebrow">PATIENT PORTAL</p>

            <h1>Welcome back!</h1>

            <p>
              Manage your appointments and access your hospital
              services from one place.
            </p>
          </div>

          <div className="patient-status">
            <span className="status-dot"></span>
            Account active
          </div>
        </div>

        <section className="patient-actions-section">
          <div className="section-heading">
            <div>
              <p>QUICK ACCESS</p>
              <h2>What would you like to do?</h2>
            </div>
          </div>

          <div className="patient-action-grid">
            <Link
              to="/patient/book-appointment"
              className="patient-action-card primary-action"
            >
              <div className="action-icon">+</div>

              <div className="action-text">
                <h3>Book an appointment</h3>

                <p>
                  Schedule a visit with an available medical
                  professional.
                </p>

                <span>Schedule appointment →</span>
              </div>
            </Link>

            <div className="patient-action-card">
              <div className="action-icon secondary-icon">
                01
              </div>

              <div className="action-text">
                <h3>My appointments</h3>

                <p>
                  View and keep track of your scheduled hospital
                  appointments.
                </p>

                <span className="coming-soon">
                  Appointment history
                </span>
              </div>
            </div>

            <div className="patient-action-card">
              <div className="action-icon secondary-icon">
                02
              </div>

              <div className="action-text">
                <h3>Medical information</h3>

                <p>
                  Access important information connected to your
                  hospital care.
                </p>

                <span className="coming-soon">
                  Patient information
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="patient-help-card">
          <div>
            <p className="patient-eyebrow">
              NEED ASSISTANCE?
            </p>

            <h2>We're here to help.</h2>

            <p>
              Contact the hospital reception if you need help
              with your account or appointment.
            </p>
          </div>

          <div className="help-cross">+</div>
        </section>
      </section>
    </main>
  );
}