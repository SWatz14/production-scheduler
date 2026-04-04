

import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import PlannerDashboard from './pages/PlannerDashboard';
import JobsPage from './pages/JobsPage';
import MachinesPage from './pages/MachinesPage';
import KpiDashboard from './pages/KpiDashboard';
import FloorDashboard from './pages/FloorDashboard';
import OperatorQueue from './pages/OperatorQueue';

export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export default function App() {
  const [dark, setDark] = React.useState(false);
  const [user, setUser] = useState(null);

  return (
    <ThemeContext.Provider value={{ dark, toggleDark: () => setDark(d => !d) }}>
      <BrowserRouter>
        {!user ? (
          <LoginPage onLogin={setUser} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Navbar user={user} onLogOut={() => setUser(null)} />
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <Sidebar />
              <main style={{ flex: 1, overflowY: 'auto', padding: '24px', background: dark ? '#0a0e1a' : '#F1F5F9' }}>
                <Routes>
                  <Route path="/" element={<PlannerDashboard />} />
                  <Route path="/jobs" element={<JobsPage />} />
                  <Route path="/machines" element={<MachinesPage />} />
                  <Route path="/kpi" element={<KpiDashboard />} />
                  <Route path="/floor" element={<FloorDashboard />} />
                  <Route path="/operator" element={<OperatorQueue />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
          </div>
        )}
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}