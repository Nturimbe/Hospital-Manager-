import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./AdminManagementPages.css";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

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

  const filteredPatients = patients.filter((patient) => {
    const fullName =
      `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const email = patient.email.toLowerCase();
    const query = search.toLowerCase();

    return fullName.includes(query) || email.includes(query);
  });

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
              PATIENT MANAGEMENT
            </p>

            <h1>Registered patients</h1>

            <p>
              View patients currently registered in the hospital
              system.
            </p>
          </div>

          <input
            className="management-search"
            type="search"
            placeholder="Search patients"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {error && (
          <p className="management-error">{error}</p>
        )}

        <div className="management-table-card">
          <div className="management-table-heading">
            <div>
              <h2>Patients</h2>
              <p>{filteredPatients.length} records displayed</p>
            </div>
          </div>

          {!error && filteredPatients.length === 0 ? (
            <p className="management-empty">
              No patients found.
            </p>
          ) : (
            !error && (
              <div className="management-table-wrapper">
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>PHONE</th>
                      <th>DATE OF BIRTH</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td className="management-primary">
                          {patient.firstName} {patient.lastName}
                        </td>

                        <td>{patient.email}</td>

                        <td>
                          {patient.phoneNumber || "Not provided"}
                        </td>

                        <td>
                          {patient.dateOfBirth
                            ? new Date(
                                patient.dateOfBirth
                              ).toLocaleDateString()
                            : "Not provided"}
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