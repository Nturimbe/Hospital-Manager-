import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { AuthResponse, LoginRequest } from "../types/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post<AuthResponse>("/auth/login", formData);
      login(response.data);

      switch (response.data.role) {
        case "Patient":
          navigate("/patient");
          break;
        case "Receptionist":
          navigate("/receptionist");
          break;
        case "Doctor":
          navigate("/doctor");
          break;
        case "Admin":
          navigate("/admin");
          break;
        default:
          navigate("/login");
      }
    } catch {
      setError("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="brand-mark">
          <span>+</span>
        </div>

        <p className="brand-label">HOSPITAL MANAGEMENT SYSTEM</p>

        <h1>
          Better care starts
          <br />
          with better <span>connection.</span>
        </h1>

        <p className="hero-description">
          One secure platform connecting patients, medical professionals,
          appointments and essential hospital services.
        </p>

        <div className="hero-features">
          <div className="feature-card">
            <strong>Patient Care</strong>
            <span>Simple and organized patient management</span>
          </div>

          <div className="feature-card">
            <strong>Appointments</strong>
            <span>Easy scheduling for patients and staff</span>
          </div>

          <div className="feature-card">
            <strong>Medical Records</strong>
            <span>Secure access to essential health information</span>
          </div>
        </div>

        <p className="hero-footer">
          Secure • Reliable • Patient Focused
        </p>
      </section>

      <section className="login-panel">
        <div className="login-content">
          <div className="mobile-brand">
            <span>+</span> HMS
          </div>

          <p className="login-eyebrow">SECURE PORTAL</p>
          <h2>Welcome back</h2>
          <p className="login-subtitle">
            Enter your details to access your hospital portal.
          </p>

          {error && <p className="error-message">{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
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

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
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

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in to your account"}
            </button>
          </form>

          <div className="registration-prompt">
            <p>New to the patient portal?</p>
            <Link to="/register">Create patient account →</Link>
          </div>

          <p className="security-note">
            Your information is protected and securely managed.
          </p>
        </div>
      </section>
    </main>
  );
}