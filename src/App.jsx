import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Public pages
import HomePage from "./pages/public/HomePage";
import ServicesPage from "./pages/public/ServicesPage";
import AboutPage from "./pages/public/AboutPage";
import LoginPage from "./pages/public/LoginPage";

// User pages
import UserDashboard from "./pages/user/UserDashboard";
import MyBookings from "./pages/user/MyBookings";
import BillsPage from './pages/user/BillsPage'
import ProfilePage from './pages/user/ProfilePage'
import HelpPage from './pages/user/HelpPage'

// Owner pages
import OwnerLogin from "./pages/owner/OwnerLogin";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerActiveJobs from "./pages/owner/OwnerActiveJobs";
import OwnerHistory from "./pages/owner/OwnerHistory";
import OwnerPricing from "./pages/owner/OwnerPricing";
import OwnerCalendar from "./pages/owner/OwnerCalendar";

// Protected route — farmer only
const UserRoute = ({ children }) => {
  const { isLoggedIn, isUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn()) return <Navigate to="/login" />;
  if (!isUser()) return <Navigate to="/" />;
  return children;
};

// Protected route — owner only
const OwnerRoute = ({ children }) => {
  const { isLoggedIn, isOwner, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn()) return <Navigate to="/owner/login" />;
  if (!isOwner()) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/owner/login" element={<OwnerLogin />} />

          {/* Farmer protected routes */}
          <Route
            path="/dashboard"
            element={
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <UserRoute>
                <MyBookings />
              </UserRoute>
            }
          />
          <Route
            path="/bills"
            element={
              <UserRoute>
                <BillsPage />
              </UserRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <UserRoute>
                <ProfilePage />
              </UserRoute>
            }
          />
          <Route
            path="/help"
            element={
              <UserRoute>
                <HelpPage />
              </UserRoute>
            }
          />

          {/* Owner protected routes */}
          <Route
            path="/owner/dashboard"
            element={
              <OwnerRoute>
                <OwnerDashboard />
              </OwnerRoute>
            }
          />
          <Route
            path="/owner/bookings"
            element={
              <OwnerRoute>
                <OwnerBookings />
              </OwnerRoute>
            }
          />
          <Route
            path="/owner/active-jobs"
            element={
              <OwnerRoute>
                <OwnerActiveJobs />
              </OwnerRoute>
            }
          />
          <Route
            path="/owner/history"
            element={
              <OwnerRoute>
                <OwnerHistory />
              </OwnerRoute>
            }
          />
          <Route
            path="/owner/pricing"
            element={
              <OwnerRoute>
                <OwnerPricing />
              </OwnerRoute>
            }
          />
          <Route
            path="/owner/calendar"
            element={
              <OwnerRoute>
                <OwnerCalendar />
              </OwnerRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
