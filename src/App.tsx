import { Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import Landing from "./pages/Landing";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Auth from "./pages/Auth";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </AppShell>
  );
}

export default App;
