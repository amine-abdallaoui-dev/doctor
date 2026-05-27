import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import PublicLayout from "@/components/layout/PublicLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Home from "@/pages/Home";
import Doctors from "@/pages/Doctors";
import DoctorProfile from "@/pages/DoctorProfile";
import Booking from "@/pages/Booking";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import PatientDashboard from "@/pages/patient/Dashboard";
import PatientAppointments from "@/pages/patient/Appointments";
import PatientRecords from "@/pages/patient/Records";
import PatientProfile from "@/pages/patient/Profile";
import PatientFavorites from "@/pages/patient/Favorites";
import DoctorDashboard from "@/pages/doctor/Dashboard";
import DoctorAppointments from "@/pages/doctor/Appointments";
import DoctorPatients from "@/pages/doctor/Patients";
import DoctorReviews from "@/pages/doctor/Reviews";
import DoctorSchedule from "@/pages/doctor/Schedule";
import DoctorEarnings from "@/pages/doctor/Earnings";
import DoctorProfilePage from "@/pages/doctor/Profile";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminDoctors from "@/pages/admin/Doctors";
import AdminAppointments from "@/pages/admin/Appointments";
import AdminSpecialties from "@/pages/admin/Specialties";
import AdminPayments from "@/pages/admin/Payments";
import AdminReviews from "@/pages/admin/Reviews";
import AdminBlog from "@/pages/admin/Blog";
import AdminSettings from "@/pages/admin/Settings";
import NotFound from "@/pages/NotFound";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/contexts/AuthContext";

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:slug" element={<DoctorProfile />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Patient Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["patient"]}><DashboardLayout role="patient" /></ProtectedRoute>}>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/appointments" element={<PatientAppointments />} />
        <Route path="/patient/records" element={<PatientRecords />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route path="/patient/favorites" element={<PatientFavorites />} />
      </Route>

      {/* Doctor Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["doctor"]}><DashboardLayout role="doctor" /></ProtectedRoute>}>
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/patients" element={<DoctorPatients />} />
        <Route path="/doctor/reviews" element={<DoctorReviews />} />
        <Route path="/doctor/schedule" element={<DoctorSchedule />} />
        <Route path="/doctor/earnings" element={<DoctorEarnings />} />
        <Route path="/doctor/profile" element={<DoctorProfilePage />} />
      </Route>

      {/* Admin Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]}><DashboardLayout role="admin" /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/doctors" element={<AdminDoctors />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/specialties" element={<AdminSpecialties />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
  );
}

export default App;
