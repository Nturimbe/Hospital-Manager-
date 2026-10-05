import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./ReceptionistPage.css";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export default function ReceptionistPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await api.get<Patient[]>("/patients");
        setPatients(response.data);
      } catch {
        setError("Unable to load patients.");
      }
    };

    loadPatients();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="receptionist-page">
      <header className="receptionist-header">
        <div className="receptionist-brand">
          <div className="receptionist-brand-cross">+</div>

          <div className="receptionist-brand-text">
            <strong>HMS</strong>
            <span>Receptionist Portal</span>
          </div>
        </div>

        <div className="receptionist-header-actions">
          <div className="receptionist-user">
            <strong>Receptionist</strong>
            <span>Receptionist</span>
          </div>

          <button
            className="receptionist-logout"
            type="button"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="receptionist-content">
        <div className="receptionist-welcome">
          <div>
            <p className="receptionist-eyebrow">
              RECEPTIONIST PORTAL
            </p>

            <h1>Welcome back!</h1>

            <p>
              Register patients and access patient information
              from the hospital system.
            </p>
          </div>

          <Link
            to="/receptionist/patients/new"
            className="register-patient-button"
          >
            + Register new patient
          </Link>
        </div>

        <div className="patient-list-card">
          <div className="patient-list-heading">
            <h2>Patients</h2>
            <p>Registered patients in the hospital system</p>
          </div>

          {error && (
            <p className="receptionist-error">
              {error}
            </p>
          )}

          {!error && patients.length === 0 ? (
            <p className="patient-empty">
              No patients found.
            </p>
          ) : (
            !error && (
              <div className="patient-table-wrapper">
                <table className="patient-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>PHONE</th>
                    </tr>
                  </thead>

                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td className="patient-name">
                          {patient.firstName}{" "}
                          {patient.lastName}
                        </td>

                        <td>{patient.email}</td>

                        <td>
                          {patient.phoneNumber ||
                            "Not provided"}
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