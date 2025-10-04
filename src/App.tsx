import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import Landing from "./pages/Landing";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Auth from "./pages/Auth";
import DashboardEmployer from "./pages/DashboardEmployer";
import ProtectedRoute from "./routes/ProtectedRoute"; // ← add this

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/auth" element={<Auth />} />

        {/* Protect this route for employers only */}
        <Route
          path="/dashboard/employer"
          element={
            <ProtectedRoute role="employer">
              <DashboardEmployer />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AppShell>
  );
}

export default App;
