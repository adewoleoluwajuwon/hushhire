import { Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import Landing from "./pages/Landing";
import Jobs from "./pages/Jobs";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="jobs" element={<Jobs />} />
      </Routes>
    </AppShell>
  );
}

export default App;
