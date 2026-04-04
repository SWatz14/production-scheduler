


import React from 'react';
import { jobService, machineService } from '../services/api';
import { useTheme } from '../App';

const STATUS_STYLES = {
  IN_PROGRESS: { background: '#DBEAFE', color: '#1E40AF', label: 'In Progress' },
  DELAYED:     { background: '#FEE2E2', color: '#991B1B', label: 'Overdue' },
  COMPLETED:   { background: '#D1FAE5', color: '#065F46', label: 'Completed' },
  QUEUED:      { background: '#FEF9C3', color: '#854D0E', label: 'Queued' },
};

export default function FloorDashboard() {
  const { dark } = useTheme();
  const [jobs, setJobs] = React.useState([]);
  const [machines, setMachines] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([jobService.getByStatus('IN_PROGRESS'), machineService.getAll()])
      .then(([j, m]) => { setJobs(j.data); setMachines(m.data); })
      .finally(() => setLoading(false));
  }, []);

  const t = {
    card: dark ? '#0d1526' : '#fff',
    border: dark ? '#00e5ff1a' : '#E2E8F0',
    borderSub: dark ? '#00e5ff0f' : '#F1F5F9',
    text: dark ? '#ffffff' : '#1E293B',
    muted: dark ? '#c8d8f055' : '#94A3B8',
    rowAlt: dark ? '#00e5ff04' : '#FAFAFA',
    thBg: dark ? '#080c1a' : '#F8FAFC',
    inner: dark ? '#080c1a' : '#F8FAFC',
  };

  const getMachineName = (job) => { if (job.machine?.name) return job.machine.name; return machines.find(m => m.id === job.machineId || m.id === job.machine?.id)?.name || 'Unassigned'; };
  const getMachineStatus = (job) => { if (job.machine?.status) return job.machine.status; return machines.find(m => m.id === job.machineId || m.id === job.machine?.id)?.status || ''; };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}><p style={{ color: '#94A3B8' }}>Loading...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: t.text, margin: 0 }}>Floor Dashboard</h1>
          <p style={{ fontSize: '13px', color: t.muted, margin: '4px 0 0' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: '100px', padding: '5px 12px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#065F46' }}>Live</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { label: 'Active Jobs', value: jobs.length, sub: 'Currently running', color: '#1D4ED8' },
          { label: 'Machines Running', value: machines.filter(m => m.status === 'RUNNING').length, sub: `Of ${machines.length} total`, color: '#059669' },
          { label: 'Machines Idle/Offline', value: machines.filter(m => m.status !== 'RUNNING').length, sub: 'Not active', color: '#D97706' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ background: t.card, borderRadius: '12px', border: `1px solid ${t.border}`, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ fontSize: '12px', color: t.muted, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{label}</p>
            <p style={{ fontSize: '32px', fontWeight: '700', color, margin: 0, lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: '12px', color: t.muted, margin: 0 }}>{sub}</p>
          </div>
        ))}
      </div>

      <div style={{ background: t.card, borderRadius: '12px', border: `1px solid ${t.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.borderSub}` }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: t.text, margin: 0 }}>Active Jobs</p>
          <p style={{ fontSize: '12px', color: t.muted, margin: '2px 0 0' }}>{jobs.length} jobs in progress on the floor</p>
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
            {jobs.map((job, i) => {
              const isOverdue = job.status === 'DELAYED';
              const s = STATUS_STYLES[job.status] || { background: '#F1F5F9', color: '#64748B', label: job.status };
              return (
                <tr key={job.id} style={{ borderTop: `1px solid ${t.borderSub}`, background: i % 2 === 0 ? t.card : t.rowAlt }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: isOverdue ? '#DC2626' : t.text }}>
                    {job.name} {isOverdue && <span style={{ fontSize: '11px' }}>⚠</span>}
                  </td>
                  <td style={{ padding: '12px 16px', color: dark ? '#c8d8f077' : '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getMachineStatus(job) === 'RUNNING' ? '#10B981' : '#94A3B8' }} />
                      {getMachineName(job)}
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
                    <span style={{ ...s, padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600', display: 'inline-block' }}>{s.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {jobs.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: t.muted }}>No active jobs on the floor</div>}
      </div>

      <div style={{ background: t.card, borderRadius: '12px', border: `1px solid ${t.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.borderSub}` }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: t.text, margin: 0 }}>Machine Status</p>
          <p style={{ fontSize: '12px', color: t.muted, margin: '2px 0 0' }}>Real-time machine availability</p>
        </div>
        <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {machines.map(machine => {
            const activeJob = jobs.find(j => j.machine?.id === machine.id);
            const statusBg = machine.status === 'RUNNING' ? { background: '#D1FAE5', color: '#065F46' } : machine.status === 'IDLE' ? { background: '#FEF9C3', color: '#854D0E' } : { background: '#FEE2E2', color: '#991B1B' };
            return (
              <div key={machine.id} style={{ background: t.inner, borderRadius: '10px', padding: '14px', border: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: machine.status === 'RUNNING' ? '#10B981' : '#94A3B8', flexShrink: 0 }} />
                  <p style={{ fontSize: '13px', fontWeight: '600', color: t.text, margin: 0 }}>{machine.name}</p>
                </div>
                <span style={{ ...statusBg, padding: '3px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: '600', display: 'inline-block', marginBottom: '6px' }}>{machine.status}</span>
                {activeJob
                  ? <p style={{ fontSize: '11px', color: t.muted, margin: '4px 0 0' }}>Running: <span style={{ color: t.text, fontWeight: '500' }}>{activeJob.name}</span></p>
                  : <p style={{ fontSize: '11px', color: t.muted, margin: '4px 0 0' }}>No active job</p>
                }
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}