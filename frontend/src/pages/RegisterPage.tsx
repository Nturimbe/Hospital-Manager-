import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { RegisterRequest } from "../types/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", formData);

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-information">
        <div className="register-info-card">
          <div className="register-cross">
            <span>+</span>
          </div>

          <p className="register-label">PATIENT PORTAL</p>

          <h1>
            Your healthcare,
            <br />
            <span>within reach.</span>
          </h1>

          <p className="register-description">
            Create your patient account to access hospital services
            from one secure and convenient place.
          </p>

          <div className="register-benefits">
            <div className="register-benefit">
              <div className="benefit-icon">01</div>

              <div>
                <strong>Book appointments</strong>
                <p>
                  Schedule visits with available medical
                  professionals.
                </p>
              </div>
            </div>

            <div className="register-benefit">
              <div className="benefit-icon">02</div>

              <div>
                <strong>Stay organized</strong>
                <p>
                  Keep your hospital interactions in one convenient
                  portal.
                </p>
              </div>
            </div>

            <div className="register-benefit">
              <div className="benefit-icon">03</div>

              <div>
                <strong>Secure access</strong>
                <p>
                  Your account is protected through authenticated
                  access.
                </p>
              </div>
            </div>
          </div>

          <p className="register-card-footer">
            Care • Convenience • Connection
          </p>
        </div>
      </section>

      <section className="register-panel">
        <div className="register-content">
          <p className="login-eyebrow">GET STARTED</p>

          <h2>Create patient account</h2>

          <p className="login-subtitle">
            Enter your information below to set up your patient
            portal.
          </p>

          {error && <p className="error-message">{error}</p>}

          {success && (
            <p className="success-message">{success}</p>
          )}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            <div className="name-fields">
              <div className="field-group">
                <label htmlFor="firstName">First name</label>

                <input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      firstName: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="lastName">Last name</label>

                <input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      lastName: event.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    email: event.target.value,
                  })
                }
                required
              />
            </div>

            <div className="name-fields">
              <div className="field-group">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      password: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="confirmPassword">
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create patient account"}
            </button>
          </form>

          <div className="registration-prompt">
            <p>Already have an account?</p>

            <Link to="/login">
              ← Return to sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}