import TestPage from './pages/TestPage'
import ErrorPage from './pages/ErrorPage'
import CaregiverPage from './pages/CaregiverPage'
import PatientPage from './pages/PatientPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<TestPage />} />
        <Route path="/caregiver" element={<CaregiverPage />} />
        <Route path="/patient" element={<PatientPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
