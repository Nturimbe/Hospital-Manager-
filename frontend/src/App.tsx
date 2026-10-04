import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PatientHomePage from "./pages/PatientHomePage";
import BookAppointmentPage from "./pages/BookAppointmentPage";
import ReceptionistPage from "./pages/ReceptionistPage";
import NewPatientPage from "./pages/NewPatientPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import MedicalRecordsPage from "./pages/MedicalRecordsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminPatientsPage from "./pages/AdminPatientsPage";
import AdminDoctorsPage from "./pages/AdminDoctorsPage";
import AdminAppointmentsPage from "./pages/AdminAppointmentsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={["Patient"]}>
            <PatientHomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/book-appointment"
        element={
          <ProtectedRoute allowedRoles={["Patient"]}>
            <BookAppointmentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/receptionist"
        element={
          <ProtectedRoute allowedRoles={["Receptionist"]}>
            <ReceptionistPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/receptionist/patients/new"
        element={
          <ProtectedRoute allowedRoles={["Receptionist"]}>
            <NewPatientPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={["Doctor"]}>
            <DoctorDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/medical-records"
        element={
          <ProtectedRoute allowedRoles={["Doctor"]}>
            <MedicalRecordsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/patients"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminPatientsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDoctorsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminAppointmentsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <div>
            <h1>404</h1>
            <p>Page not found.</p>
          </div>
        }
      />
    </Routes>
  );
}

export default App;