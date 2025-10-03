import { Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import Landing from "./pages/Landing";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </AppShell>
  );
}

export default App;
