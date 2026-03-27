import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// User Pages
import UserDashboard from "./pages/UserDashboard";
import Workouts from "./pages/Workouts";
import DietPlan from "./pages/DietPlan";
import WeeklyReport from "./pages/WeeklyReport";
import Library from "./pages/Library";

// Trainer Pages
import TrainerDashboard from "./pages/TrainerDashboard";
import ManageClients from "./pages/ManageClients";
import ClientDetails from "./pages/ClientDetails";
import CreateWorkout from "./pages/CreateWorkout";
import CreateDietPlan from "./pages/CreateDietPlan";
import TrainerProfile from "./pages/TrainerProfile";

// Auth Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import TrainerManagement from "./pages/admin/TrainerManagement";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import AdminFeedback from "./pages/admin/AdminFeedback";

// Context
import { AdminProvider } from "./contexts/AdminContext";
import { FeedbackProvider } from "./contexts/FeedbackContext";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public home / landing */}
        <Route path="/" element={<Landing />} />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER ROUTES */}
        <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/workouts" element={<ProtectedRoute allowedRoles={['user']}><Workouts /></ProtectedRoute>} />
        <Route path="/user/diet" element={<ProtectedRoute allowedRoles={['user']}><DietPlan /></ProtectedRoute>} />
        <Route path="/user/report" element={<ProtectedRoute allowedRoles={['user']}><WeeklyReport /></ProtectedRoute>} />
        <Route path="/user/library" element={<ProtectedRoute allowedRoles={['user']}><Library /></ProtectedRoute>} />

        {/* TRAINER ROUTES */}
        <Route path="/trainer/dashboard" element={<ProtectedRoute allowedRoles={['trainer']}><TrainerDashboard /></ProtectedRoute>} />
        <Route path="/trainer/clients" element={<ProtectedRoute allowedRoles={['trainer']}><ManageClients /></ProtectedRoute>} />
        <Route path="/trainer/client/:clientId" element={<ProtectedRoute allowedRoles={['trainer']}><ClientDetails /></ProtectedRoute>} />
        <Route path="/trainer/workout/create" element={<ProtectedRoute allowedRoles={['trainer']}><CreateWorkout /></ProtectedRoute>} />
        <Route path="/trainer/diet/create" element={<ProtectedRoute allowedRoles={['trainer']}><CreateDietPlan /></ProtectedRoute>} />
        <Route path="/trainer/profile" element={<ProtectedRoute allowedRoles={['trainer']}><TrainerProfile /></ProtectedRoute>} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="trainers" element={<TrainerManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="feedback" element={<AdminFeedback />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* 404 / fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

