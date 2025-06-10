// import dependencies
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import components
import TestPage from './pages/TestPage'
import ErrorPage from './pages/ErrorPage'
import CaregiverPage from './pages/CaregiverPage'
import PatientPage from './pages/PatientPage'
import Navbar from "@/components/system/Navbar"
import Sidebar from "@/components/system/Sidebar"

function App() {
  const handleCreateItem = async (itemData) => {
    console.log('Create item:', itemData);
  };

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <Navbar/>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar onCreateItem={handleCreateItem} />
          <main className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/test" element={<TestPage />} />
              <Route path="/caregiver/*" element={<CaregiverPage />} />
              <Route path="/patient/*" element={<PatientPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;