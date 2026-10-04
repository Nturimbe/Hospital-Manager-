import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./MedicalRecordsPage.css";

interface MedicalRecord {
  id: number;
  patientName?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  createdAt?: string;
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const { name } = useAuth();

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const response =
          await api.get<MedicalRecord[]>("/medical-records");

        setRecords(response.data);
      } catch {
        setError("Unable to load medical records.");
      }
    };

    loadRecords();
  }, []);

  const filteredRecords = records.filter((record) => {
    const patient = record.patientName?.toLowerCase() || "";
    const diagnosis = record.diagnosis?.toLowerCase() || "";
    const query = search.toLowerCase();

    return patient.includes(query) || diagnosis.includes(query);
  });

  return (
    <main className="records-page">
      <header className="records-header">
        <div className="records-brand">
          <div className="records-cross">+</div>

          <div className="records-brand-text">
            <strong>HMS</strong>
            <span>Doctor Portal</span>
          </div>
        </div>

        <div className="records-doctor">
          <strong>{name || "Doctor"}</strong>
          <span>Medical Records</span>
        </div>
      </header>

      <section className="records-content">
        <Link to="/doctor" className="records-back">
          ← Back to dashboard
        </Link>

        <div className="records-introduction">
          <div>
            <p className="records-eyebrow">
              ELECTRONIC MEDICAL RECORDS
            </p>

            <h1>Patient medical records</h1>

            <p>
              Review patient diagnoses, treatment information,
              and clinical notes.
            </p>
          </div>

          <div className="records-search">
            <input
              type="search"
              placeholder="Search patient or diagnosis"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </div>

        {error && <p className="records-error">{error}</p>}

        {!error && filteredRecords.length === 0 ? (
          <div className="records-empty">
            <div className="records-empty-cross">+</div>
            <h2>No medical records found</h2>
            <p>
              Patient medical records will appear here when
              they are available.
            </p>
          </div>
        ) : (
          !error && (
            <div className="records-grid">
              {filteredRecords.map((record) => (
                <article
                  className="medical-record-card"
                  key={record.id}
                >
                  <div className="record-card-header">
                    <div>
                      <span>PATIENT</span>
                      <h2>
                        {record.patientName ||
                          "Patient"}
                      </h2>
                    </div>

                    <div className="record-badge">
                      EMR
                    </div>
                  </div>

                  <div className="record-information">
                    <div>
                      <span>Diagnosis</span>
                      <p>
                        {record.diagnosis ||
                          "Not provided"}
                      </p>
                    </div>

                    <div>
                      <span>Treatment</span>
                      <p>
                        {record.treatment ||
                          "Not provided"}
                      </p>
                    </div>

                    <div className="record-notes">
                      <span>Clinical notes</span>
                      <p>
                        {record.notes ||
                          "No clinical notes available."}
                      </p>
                    </div>
                  </div>

                  {record.createdAt && (
                    <p className="record-date">
                      Recorded{" "}
                      {new Date(
                        record.createdAt
                      ).toLocaleDateString()}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )
        )}
      </section>
    </main>
  );
}