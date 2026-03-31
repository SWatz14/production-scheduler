

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import PlannerDashboard from './pages/PlannerDashboard';
import JobsPage from './pages/JobsPage';
import MachinesPage from './pages/MachinesPage';
import KpiDashboard from './pages/KpiDashboard';
import FloorDashboard from './pages/FloorDashboard';
import OperatorQueue from './pages/OperatorQueue';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{display:'flex', flexDirection:'column', height:'100vh'}}>
        <Navbar />
        <div style={{display:'flex', flex:1, overflow:'hidden'}}>
          <Sidebar />
          <main style={{flex:1, overflowY:'auto', padding:'24px', background:'#F1F5F9'}}>
            <Routes>
              <Route path="/" element={<PlannerDashboard />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/machines" element={<MachinesPage />} />
              <Route path="/kpi" element={<KpiDashboard />} />
              <Route path="/floor" element={<FloorDashboard />} />
              <Route path="/operator" element={<OperatorQueue />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}