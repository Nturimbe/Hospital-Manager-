import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./NewPatientPage.css";

export default function NewPatientPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/patients", {
        firstName,
        lastName,
        email,
        phoneNumber,
        dateOfBirth,
      });

      navigate("/receptionist");
    } catch {
      setError(
        "Unable to register patient. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="new-patient-page">
      <header className="new-patient-header">
        <div className="new-patient-brand">
          <div className="new-patient-brand-cross">
            +
          </div>

          <div className="new-patient-brand-text">
            <strong>HMS</strong>
            <span>Receptionist Portal</span>
          </div>
        </div>

        <Link
          to="/receptionist"
          className="new-patient-back"
        >
          ← Back to dashboard
        </Link>
      </header>

      <section className="new-patient-content">
        <div className="new-patient-introduction">
          <p className="new-patient-eyebrow">
            PATIENT REGISTRATION
          </p>

          <h1>Register new patient</h1>

          <p>
            Enter the patient's information below to add
            them to the hospital system.
          </p>
        </div>

        {error && (
          <p className="new-patient-error">
            {error}
          </p>
        )}

        <div className="new-patient-card">
          <form
            className="new-patient-form"
            onSubmit={handleSubmit}
          >
            <div className="new-patient-field">
              <label htmlFor="firstName">
                First name
              </label>

              <input
                id="firstName"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
                required
              />
            </div>

            <div className="new-patient-field">
              <label htmlFor="lastName">
                Last name
              </label>

              <input
                id="lastName"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
                required
              />
            </div>

            <div className="new-patient-field full-width">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            <div className="new-patient-field">
              <label htmlFor="phoneNumber">
                Phone number
              </label>

              <input
                id="phoneNumber"
                type="tel"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(event) =>
                  setPhoneNumber(event.target.value)
                }
                required
              />
            </div>

            <div className="new-patient-field">
              <label htmlFor="dateOfBirth">
                Date of birth
              </label>

              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(event) =>
                  setDateOfBirth(event.target.value)
                }
                required
              />
            </div>

            <div className="new-patient-submit-area">
              <button
                className="new-patient-submit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Registering..."
                  : "Register patient"}
              </button>
            </div>
          </form>
        </div>

        <div className="new-patient-note">
          <div className="new-patient-note-cross">
            +
          </div>

          <p>
            Please confirm the patient's information is
            correct before submitting the registration.
          </p>
        </div>
      </section>
    </main>
  );
}