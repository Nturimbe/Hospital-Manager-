import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./AdminManagementPages.css";

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  specialization?: string;
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await api.get<Doctor[]>("/doctors");
        setDoctors(response.data);
      } catch {
        setError("Unable to load doctors.");
      }
    };

    loadDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName =
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase();

    const specialization =
      doctor.specialization?.toLowerCase() || "";

    const query = search.toLowerCase();

    return (
      fullName.includes(query) ||
      specialization.includes(query)
    );
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
              DOCTOR MANAGEMENT
            </p>

            <h1>Hospital doctors</h1>

            <p>
              View medical professionals registered in the
              hospital system.
            </p>
          </div>

          <input
            className="management-search"
            type="search"
            placeholder="Search doctors"
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
              <h2>Doctors</h2>
              <p>{filteredDoctors.length} records displayed</p>
            </div>
          </div>

          {!error && filteredDoctors.length === 0 ? (
            <p className="management-empty">
              No doctors found.
            </p>
          ) : (
            !error && (
              <div className="management-table-wrapper">
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>SPECIALIZATION</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredDoctors.map((doctor) => (
                      <tr key={doctor.id}>
                        <td className="management-primary">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </td>

                        <td>
                          {doctor.email || "Not provided"}
                        </td>

                        <td>
                          {doctor.specialization ||
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