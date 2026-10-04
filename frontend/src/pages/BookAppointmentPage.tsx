import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./BookAppointmentPage.css";

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialization?: string;
}

export default function BookAppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [reason, setReason] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      await api.post("/appointments", {
        doctorId: Number(doctorId),
        appointmentDate,
        reason,
      });

      setMessage("Appointment booked successfully.");

      setDoctorId("");
      setAppointmentDate("");
      setReason("");
    } catch {
      setError(
        "Unable to book appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="appointment-page">
      <header className="appointment-header">
        <div className="appointment-brand">
          <div className="appointment-brand-cross">+</div>

          <div className="appointment-brand-text">
            <strong>HMS</strong>
            <span>Patient Portal</span>
          </div>
        </div>

        <Link
          to="/patient"
          className="appointment-back-link"
        >
          ← Back to dashboard
        </Link>
      </header>

      <section className="appointment-content">
        <div className="appointment-introduction">
          <p className="appointment-eyebrow">
            APPOINTMENTS
          </p>

          <h1>Book an appointment</h1>

          <p>
            Select a doctor, choose your preferred date and
            time, and briefly tell us the reason for your
            visit.
          </p>
        </div>

        {message && (
          <p className="appointment-success">
            {message}
          </p>
        )}

        {error && (
          <p className="appointment-error">
            {error}
          </p>
        )}

        <div className="appointment-card">
          <form
            className="appointment-form"
            onSubmit={handleSubmit}
          >
            <div className="appointment-field">
              <label htmlFor="doctor">
                Doctor
              </label>

              <select
                id="doctor"
                value={doctorId}
                onChange={(event) =>
                  setDoctorId(event.target.value)
                }
                required
              >
                <option value="">
                  Select a doctor
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    Dr. {doctor.firstName}{" "}
                    {doctor.lastName}
                    {doctor.specialization
                      ? ` - ${doctor.specialization}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="appointment-field">
              <label htmlFor="appointmentDate">
                Date and time
              </label>

              <input
                id="appointmentDate"
                type="datetime-local"
                value={appointmentDate}
                onChange={(event) =>
                  setAppointmentDate(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="appointment-field full-width">
              <label htmlFor="reason">
                Reason for visit
              </label>

              <textarea
                id="reason"
                placeholder="Briefly describe the reason for your appointment..."
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                required
              />
            </div>

            <div className="appointment-submit-area">
              <button
                className="appointment-submit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Booking..."
                  : "Book appointment"}
              </button>
            </div>
          </form>
        </div>

        <div className="appointment-note">
          <div className="appointment-note-cross">
            +
          </div>

          <p>
            Appointment availability depends on the
            selected doctor and hospital schedule.
          </p>
        </div>
      </section>
    </main>
  );
}