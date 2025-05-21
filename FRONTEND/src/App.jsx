import { Route, Routes } from "react-router-dom";
import "./css/App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { RoleProvider } from "./contexts/RoleContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./contexts/ProtectedRoute"; // Import ProtectedRoute

// Role-based Dashboard Pages
import StudentDashboard from "./pages/dashboards/student/StudentDashboard";
import LecturerDashboard from "./pages/dashboards/lecturer/LecturerDashboard";
import RegistrarDashboard from "./pages/dashboards/registrar/RegistrarDashboard";

// Role-specific Pages
import StudentIssues from "./pages/dashboards/student/StudentIssues";
import StudentNotifications from "./pages/dashboards/student/StudentNotifications";
import StudentProfile from "./pages/dashboards/student/StudentProfile";

import LecturerIssues from "./pages/dashboards/lecturer/LecturerIssues";
import LecturerNotifications from "./pages/dashboards/lecturer/LecturerNotifications";
import LecturerProfile from "./pages/dashboards/lecturer/LecturerProfile";


import RegistrarIssues from "./pages/dashboards/registrar/RegistrarIssues";
import RegistrarNotifications from "./pages/dashboards/registrar/RegistrarNotifications";
import Allocate from "./pages/dashboards/registrar/Allocate";
import RegistrarProfile from "./pages/dashboards/registrar/RegistrarProfile";

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />

            {/* Protected Routes (Only logged-in users can access) */}
            <Route element={<ProtectedRoute />}>
              {/* Role-based Dashboards */}
              <Route path="/dashboards/student/student-dashboard" element={<StudentDashboard />} />
              <Route path="/dashboards/lecturer/lecturer-dashboard" element={<LecturerDashboard />} />
              <Route path="/dashboards/registrar/registrar-dashboard" element={<RegistrarDashboard />} />

              {/* Role-specific Issues*/}
              <Route path="/dashboards/student/issues" element={<StudentIssues />} />
              <Route path="/dashboards/lecturer/issues" element={<LecturerIssues />} />
              <Route path="/dashboards/registrar/issues" element={<RegistrarIssues />} />
              <Route path="/registrar/issues/:id"element={<Allocate/>} />

              {/* Role-specific Notifications */}
              <Route path="/dashboards/student/notifications" element={<StudentNotifications />} />
              <Route path="/dashboards/lecturer/notifications" element={<LecturerNotifications />} />
              <Route path="/dashboards/registrar/notifications" element={<RegistrarNotifications />} />

              {/* Role-specific Profiles */}
              <Route path="/dashboards/student/profile" element={<StudentProfile />} />
              <Route path="/dashboards/lecturer/profile" element={<LecturerProfile />} />

              <Route path="/dashboards/registrar/profile" element={<RegistrarProfile/>}/>
              
            </Route>
          </Routes>
        </main>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;
