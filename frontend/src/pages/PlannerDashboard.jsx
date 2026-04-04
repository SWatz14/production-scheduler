// This file contains the main dashboard component for the production scheduling application. 
// It displays key performance indicators, a Gantt chart of scheduled jobs, and a table of work orders. 
// It also includes functionality to create new jobs, update job statuses, and run the scheduling algorithm.
//  The component uses React hooks for state management and side effects, and 
// it interacts with the backend API through the imported services.


import React, { useEffect, useState } from 'react';
import { jobService, machineService, schedulerService } from '../services/api';
import { useTheme } from '../App';

const STATUS_STYLES = {
  IN_PROGRESS: { background: '#DBEAFE', color: '#1E40AF', label: 'In Progress' },
  DELAYED:     { background: '#FEE2E2', color: '#991B1B', label: 'Overdue' },
  COMPLETED:   { background: '#D1FAE5', color: '#065F46', label: 'Completed' },
  QUEUED:      { background: '#FEF9C3', color: '#854D0E', label: 'Queued' },
};

function KpiCard({ label, value, sub, color, dark }) {
  return (
    <div style={{ background: dark ? '#0d1526' : '#fff', borderRadius: '12px', border: `1px solid ${dark ? '#00e5ff1a' : '#E2E8F0'}`, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <p style={{ fontSize: '12px', color: dark ? '#c8d8f055' : '#94A3B8', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{label}</p>
      <p style={{ fontSize: '32px', fontWeight: '700', color: color || (dark ? '#ffffff' : '#1E293B'), margin: 0, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: '12px', color: dark ? '#c8d8f044' : '#94A3B8', margin: 0 }}>{sub}</p>}
    </div>
  );
}

function GanttChart({ jobs, machines, dark }) {
  const hours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
  const totalHours = 8;

  const getBlockStyle = (job, machineIndex) => {
    const startOffset = (machineIndex * 1.2) % totalHours;
    const width = Math.min((job.estimatedHours / totalHours) * 100, 40);
    const left = (startOffset / totalHours) * 100;
    const fills = {
      IN_PROGRESS: { bg: '#BFDBFE', border: '#3B82F6', text: '#1E40AF' },
      DELAYED:     { bg: '#FECACA', border: '#EF4444', text: '#991B1B' },
      COMPLETED:   { bg: '#A7F3D0', border: '#10B981', text: '#065F46' },
      QUEUED:      { bg: '#FEF08A', border: '#EAB308', text: '#854D0E' },
    };
    return { width, left, ...(fills[job.status] || fills.QUEUED) };
  };

  const uniqueMachines = machines.filter((m, i, self) => i === self.findIndex(t => t.id === m.id));
  const machineJobs = uniqueMachines.map(machine => ({ machine, jobs: jobs.filter(j => j.machine?.id === machine.id) }));

  const card = dark ? '#0d1526' : '#fff';
  const border = dark ? '#00e5ff1a' : '#E2E8F0';
  const borderSub = dark ? '#00e5ff0f' : '#F1F5F9';
  const textPrimary = dark ? '#ffffff' : '#1E293B';
  const textMuted = dark ? '#c8d8f055' : '#94A3B8';
  const rowAlt = dark ? '#00e5ff04' : '#FAFAFA';

  return (
    <div style={{ background: card, borderRadius: '12px', border: `1px solid ${border}`, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${borderSub}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', fontWeight: '600', color: textPrimary, margin: 0 }}>Gantt Schedule</p>
          <p style={{ fontSize: '12px', color: textMuted, margin: '2px 0 0' }}>Shift 07:00 — 15:00</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['IN_PROGRESS', 'QUEUED', 'DELAYED', 'COMPLETED'].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: STATUS_STYLES[s].background, border: `1px solid ${STATUS_STYLES[s].color}` }} />
              <span style={{ fontSize: '11px', color: textMuted }}>{STATUS_STYLES[s].label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '700px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', borderBottom: `1px solid ${borderSub}` }}>
            <div style={{ padding: '8px 16px', fontSize: '11px', color: textMuted, fontWeight: '500' }}>Machine</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 8px', borderLeft: `1px solid ${borderSub}` }}>
              {hours.map(h => <span key={h} style={{ fontSize: '11px', color: textMuted }}>{h}</span>)}
            </div>
          </div>
          {machineJobs.map(({ machine, jobs: mJobs }, mi) => (
            <div key={machine.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', borderBottom: `1px solid ${borderSub}`, background: mi % 2 === 0 ? card : rowAlt }}>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: machine.status === 'RUNNING' ? '#10B981' : '#94A3B8', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: textPrimary, fontWeight: '500' }}>{machine.name}</span>
              </div>
              <div style={{ position: 'relative', height: '48px', borderLeft: `1px solid ${borderSub}` }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{ position: 'absolute', left: `${(i / 8) * 100}%`, top: 0, bottom: 0, width: '1px', background: borderSub }} />
                ))}
                {mJobs.map((job, ji) => {
                  const { width, left, bg, border: blk, text } = getBlockStyle(job, ji);
                  return (
                    <div key={job.id} title={job.name} style={{ position: 'absolute', left: `${left}%`, width: `${width}%`, top: '8px', height: '32px', background: bg, border: `1px solid ${blk}`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600', color: text, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', padding: '0 6px', cursor: 'default' }}>
                      {job.name.length > 12 ? job.name.slice(0, 12) + '…' : job.name}
                    </div>
                  );
                })}
                {mJobs.length === 0 && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
                    <span style={{ fontSize: '11px', color: dark ? '#c8d8f022' : '#CBD5E1' }}>No jobs scheduled</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function JobModal({ machines, onClose, onSave, dark }) {
  const [form, setForm] = useState({ name: '', priority: 1, estimatedHours: 1, deadline: '', machineId: '', status: 'QUEUED' });

  const handleSubmit = () => {
    if (!form.name || !form.deadline) return;
    const machine = machines.find(m => m.id === parseInt(form.machineId));
    onSave({ name: form.name, priority: parseInt(form.priority), estimatedHours: parseFloat(form.estimatedHours), deadline: new Date(form.deadline).toISOString(), machine: machine || null, status: form.status });
  };

  const inputStyle = { width: '100%', padding: '9px 12px', fontSize: '13px', border: `1px solid ${dark ? '#00e5ff22' : '#E2E8F0'}`, borderRadius: '8px', color: dark ? '#c8d8f0' : '#1E293B', background: dark ? '#080c18' : '#fff', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '12px', fontWeight: '500', color: dark ? '#c8d8f077' : '#64748B', display: 'block', marginBottom: '5px' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: dark ? '#0d1526' : '#fff', borderRadius: '16px', padding: '28px', width: '480px', border: dark ? '1px solid #00e5ff22' : 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: dark ? '#ffffff' : '#1E293B', margin: 0 }}>New Work Order</h2>
            <p style={{ fontSize: '12px', color: dark ? '#c8d8f055' : '#94A3B8', margin: '4px 0 0' }}>Add a new job to the schedule</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', color: dark ? '#c8d8f055' : '#94A3B8', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Job Name *</label>
            <input style={inputStyle} placeholder="e.g. Bracket Assembly" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Priority</label>
              <select style={inputStyle} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value={1}>High (1)</option>
                <option value={2}>Medium (2)</option>
                <option value={3}>Low (3)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Estimated Hours</label>
              <input style={inputStyle} type="number" min="0.5" step="0.5" value={form.estimatedHours} onChange={e => setForm({ ...form, estimatedHours: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Deadline *</label>
            <input style={inputStyle} type="datetime-local" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Assign Machine</label>
            <select style={inputStyle} value={form.machineId} onChange={e => setForm({ ...form, machineId: e.target.value })}>
              <option value="">Unassigned</option>
              {machines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Initial Status</label>
            <select style={inputStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="QUEUED">Queued</option>
              <option value="IN_PROGRESS">In Progress</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '9px 20px', fontSize: '13px', borderRadius: '8px', border: `1px solid ${dark ? '#00e5ff22' : '#E2E8F0'}`, background: 'transparent', color: dark ? '#c8d8f077' : '#64748B', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} style={{ padding: '9px 20px', fontSize: '13px', borderRadius: '8px', border: 'none', background: '#1F4E79', color: '#fff', cursor: 'pointer', fontWeight: '500' }}>Create Job</button>
        </div>
      </div>
    </div>
  );
}

function StatusDropdown({ job, onUpdate, dark }) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const btnRef = React.useRef(null);
  const statuses = ['QUEUED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'];

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropUp(window.innerHeight - rect.bottom < 160);
    }
    setOpen(!open);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span ref={btnRef} onClick={handleToggle} style={{ ...STATUS_STYLES[job.status], padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', userSelect: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {STATUS_STYLES[job.status]?.label || job.status}
        <span style={{ fontSize: '9px' }}>▼</span>
      </span>
      {open && (
        <div style={{ position: 'absolute', ...(dropUp ? { bottom: '100%', marginBottom: '4px' } : { top: '100%', marginTop: '4px' }), right: 0, background: dark ? '#0d1526' : '#fff', border: `1px solid ${dark ? '#00e5ff22' : '#E2E8F0'}`, borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
          {statuses.map(s => (
            <div key={s} onClick={() => { onUpdate(job.id, s); setOpen(false); }}
              style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: STATUS_STYLES[s]?.color || '#1E293B', background: job.status === s ? (dark ? '#00e5ff08' : '#F8FAFC') : 'transparent', fontWeight: job.status === s ? '600' : '400' }}
              onMouseEnter={e => e.currentTarget.style.background = dark ? '#00e5ff08' : '#F8FAFC'}
              onMouseLeave={e => e.currentTarget.style.background = job.status === s ? (dark ? '#00e5ff08' : '#F8FAFC') : 'transparent'}>
              {STATUS_STYLES[s]?.label || s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PlannerDashboard() {
  const { dark } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [algorithm, setAlgorithm] = useState('EDD');
  const [filter, setFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleResult, setScheduleResult] = useState(null);
  const [toast, setToast] = useState(null);

  const t = {
    card: dark ? '#0d1526' : '#fff',
    border: dark ? '#00e5ff1a' : '#E2E8F0',
    borderSub: dark ? '#00e5ff0f' : '#F1F5F9',
    text: dark ? '#ffffff' : '#1E293B',
    muted: dark ? '#c8d8f055' : '#94A3B8',
    rowAlt: dark ? '#00e5ff04' : '#FAFAFA',
    thBg: dark ? '#080c1a' : '#F8FAFC',
  };

  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const loadData = () => Promise.all([jobService.getAll(), machineService.getAll()])
    .then(([j, m]) => { setJobs(j.data); setMachines(m.data); })
    .catch(console.error)
    .finally(() => setLoading(false));

  useEffect(() => { loadData(); }, []);

  const handleCreateJob = (jobData) => {
    jobService.create(jobData).then(() => { loadData(); setShowModal(false); showToast('Job created successfully'); }).catch(() => showToast('Failed to create job', 'error'));
  };

  const handleUpdateStatus = (jobId, newStatus) => {
    if (!jobs.find(j => j.id === jobId)) return;
    jobService.updateStatus(jobId, newStatus)
      .then(() => { setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j)); showToast(`Status updated to ${STATUS_STYLES[newStatus]?.label}`); })
      .catch(() => showToast('Failed to update status', 'error'));
  };

  const handleRunSchedule = () => {
    setScheduling(true);
    schedulerService.generateSchedule(jobs.map(j => ({ id: j.id, name: j.name, priority: j.priority, deadline: j.deadline, estimated_hours: j.estimatedHours, machine_id: j.machine?.id || null })), algorithm)
      .then(res => { setScheduleResult(res.data); showToast(`Schedule generated — ${res.data.at_risk_count} at risk, ${res.data.overdue_count} overdue`); })
      .catch(() => showToast('Scheduling engine not reachable', 'error'))
      .finally(() => setScheduling(false));
  };

  const filteredJobs = filter === 'ALL' ? jobs : jobs.filter(j => j.status === filter);
  const otif = jobs.length > 0 ? Math.round((jobs.filter(j => j.status !== 'DELAYED').length / jobs.length) * 100) : 0;

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}><p style={{ color: '#94A3B8' }}>Loading dashboard...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 999, background: toast.type === 'error' ? '#FEE2E2' : '#D1FAE5', border: `1px solid ${toast.type === 'error' ? '#FCA5A5' : '#6EE7B7'}`, color: toast.type === 'error' ? '#991B1B' : '#065F46', padding: '12px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '500', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          {toast.type === 'error' ? '✕ ' : '✓ '}{toast.message}
        </div>
      )}

      {showModal && <JobModal machines={machines} onClose={() => setShowModal(false)} onSave={handleCreateJob} dark={dark} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: t.text, margin: 0 }}>Planner Dashboard</h1>
          <p style={{ fontSize: '13px', color: t.muted, margin: '4px 0 0' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={algorithm} onChange={e => setAlgorithm(e.target.value)} style={{ fontSize: '13px', border: `1px solid ${t.border}`, borderRadius: '8px', padding: '8px 12px', background: t.card, color: t.text }}>
            <option value="EDD">Earliest Due Date (EDD)</option>
            <option value="SPT">Shortest Processing Time (SPT)</option>
          </select>
          <button onClick={handleRunSchedule} disabled={scheduling} style={{ background: scheduling ? '#94A3B8' : '#1F4E79', color: '#fff', fontSize: '13px', padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: scheduling ? 'not-allowed' : 'pointer', fontWeight: '500' }}>
            {scheduling ? 'Running...' : 'Run schedule'}
          </button>
          <button onClick={() => setShowModal(true)} style={{ background: '#059669', color: '#fff', fontSize: '13px', padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500' }}>+ New job</button>
          <button style={{ background: t.card, fontSize: '13px', padding: '8px 18px', borderRadius: '8px', border: '1.5px solid #1F4E79', cursor: 'pointer', color: '#1F4E79', fontWeight: '500' }}>Publish to floor</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <KpiCard label="Total Jobs" value={jobs.length} sub="This shift" dark={dark} />
        <KpiCard label="In Progress" value={jobs.filter(j => j.status === 'IN_PROGRESS').length} sub="Currently running" color="#1D4ED8" dark={dark} />
        <KpiCard label="Overdue" value={jobs.filter(j => j.status === 'DELAYED').length} sub="Needs attention" color={jobs.filter(j => j.status === 'DELAYED').length > 0 ? '#DC2626' : t.text} dark={dark} />
        <KpiCard label="OTIF Rate" value={`${otif}%`} sub="On-time in full" color={otif >= 80 ? '#059669' : '#D97706'} dark={dark} />
      </div>

      {scheduleResult && (
        <div style={{ background: dark ? '#0d1526' : '#EFF6FF', border: `1px solid ${dark ? '#00e5ff22' : '#BFDBFE'}`, borderRadius: '12px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1E40AF', margin: '0 0 4px' }}>Schedule generated using {scheduleResult.algorithm}</p>
              <p style={{ fontSize: '12px', color: '#3B82F6', margin: 0 }}>
                {scheduleResult.total_jobs} jobs scheduled —<span style={{ color: '#D97706' }}> {scheduleResult.at_risk_count} at risk </span>—<span style={{ color: '#DC2626' }}> {scheduleResult.overdue_count} overdue</span>
              </p>
            </div>
            <button onClick={() => setScheduleResult(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '18px' }}>×</button>
          </div>
        </div>
      )}

      <GanttChart jobs={jobs} machines={machines} dark={dark} />

      <div style={{ background: t.card, borderRadius: '12px', border: `1px solid ${t.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.borderSub}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: t.text, margin: 0 }}>Work Orders</p>
            <p style={{ fontSize: '12px', color: t.muted, margin: '2px 0 0' }}>{filteredJobs.length} jobs shown</p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'QUEUED', 'IN_PROGRESS', 'DELAYED', 'COMPLETED'].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: '5px 12px', fontSize: '11px', borderRadius: '100px', border: '1px solid', cursor: 'pointer', fontWeight: '500', borderColor: filter === s ? '#1F4E79' : t.border, background: filter === s ? '#1F4E79' : t.card, color: filter === s ? '#fff' : t.muted }}>
                {s === 'ALL' ? 'All' : STATUS_STYLES[s]?.label || s}
              </button>
            ))}
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: t.thBg }}>
              {['Job Name', 'Machine', 'Priority', 'Est. Hours', 'Deadline', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', color: t.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: `1px solid ${t.borderSub}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job, i) => {
              const isOverdue = job.status === 'DELAYED';
              return (
                <tr key={job.id} style={{ borderTop: `1px solid ${t.borderSub}`, background: i % 2 === 0 ? t.card : t.rowAlt }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: isOverdue ? '#DC2626' : t.text }}>
                    {job.name}{isOverdue && <span style={{ marginLeft: '6px', fontSize: '11px' }}>⚠</span>}
                  </td>
                  <td style={{ padding: '12px 16px', color: dark ? '#c8d8f077' : '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: job.machine?.status === 'RUNNING' ? '#10B981' : '#94A3B8' }} />
                      {job.machine?.name || 'Unassigned'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3].map(p => <div key={p} style={{ width: '8px', height: '8px', borderRadius: '2px', background: p <= job.priority ? '#F59E0B' : (dark ? '#1a2540' : '#E2E8F0') }} />)}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: dark ? '#c8d8f077' : '#64748B' }}>{job.estimatedHours}h</td>
                  <td style={{ padding: '12px 16px', color: isOverdue ? '#DC2626' : (dark ? '#c8d8f055' : '#64748B'), fontWeight: isOverdue ? '600' : '400' }}>
                    {job.deadline ? new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <StatusDropdown job={job} onUpdate={handleUpdateStatus} dark={dark} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredJobs.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: t.muted }}>No jobs found for this filter</div>}
      </div>
    </div>
  );
}

    