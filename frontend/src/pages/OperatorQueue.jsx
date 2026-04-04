




import React from 'react';
import { jobService, machineService } from '../services/api';
import { useTheme } from '../App';

export default function OperatorQueue() {
  const { dark } = useTheme();
  const [jobs, setJobs] = React.useState([]);
  const [machines, setMachines] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([jobService.getByStatus('QUEUED'), machineService.getAll()])
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

  const priorityBadge = (p) => {
    if (p === 1) return { background: '#FEE2E2', color: '#991B1B', label: 'High' };
    if (p === 2) return { background: '#FEF9C3', color: '#854D0E', label: 'Medium' };
    return { background: '#F1F5F9', color: '#64748B', label: 'Low' };
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}><p style={{ color: '#94A3B8' }}>Loading...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: t.text, margin: 0 }}>Operator Queue</h1>
        <p style={{ fontSize: '13px', color: t.muted, margin: '4px 0 0' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { label: 'Jobs Queued', value: jobs.length, sub: 'Waiting to start', color: '#D97706' },
          { label: 'High Priority', value: jobs.filter(j => j.priority === 1).length, sub: 'Need immediate attention', color: '#DC2626' },
          { label: 'Total Hours', value: jobs.reduce((sum, j) => sum + (j.estimatedHours || 0), 0).toFixed(1) + 'h', sub: 'Estimated workload', color: '#1D4ED8' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ background: t.card, borderRadius: '12px', border: `1px solid ${t.border}`, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ fontSize: '12px', color: t.muted, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{label}</p>
            <p style={{ fontSize: '32px', fontWeight: '700', color, margin: 0, lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: '12px', color: t.muted, margin: 0 }}>{sub}</p>
          </div>
        ))}
      </div>

      {jobs.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {jobs.map(job => {
            const pri = priorityBadge(job.priority);
            return (
              <div key={job.id} style={{ background: t.card, borderRadius: '12px', border: `1px solid ${t.border}`, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: t.text, margin: '0 0 2px' }}>{job.name}</p>
                    <p style={{ fontSize: '11px', color: t.muted, margin: 0 }}>Job #{job.id}</p>
                  </div>
                  <span style={{ ...pri, padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600' }}>{pri.label}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ background: t.inner, borderRadius: '8px', padding: '10px 12px' }}>
                    <p style={{ fontSize: '11px', color: t.muted, margin: '0 0 3px', fontWeight: '500' }}>Machine</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getMachineStatus(job) === 'RUNNING' ? '#10B981' : '#94A3B8', flexShrink: 0 }} />
                      <p style={{ fontSize: '12px', fontWeight: '600', color: t.text, margin: 0 }}>{getMachineName(job)}</p>
                    </div>
                  </div>
                  <div style={{ background: t.inner, borderRadius: '8px', padding: '10px 12px' }}>
                    <p style={{ fontSize: '11px', color: t.muted, margin: '0 0 3px', fontWeight: '500' }}>Est. Hours</p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#D97706', margin: 0, lineHeight: 1 }}>{job.estimatedHours}h</p>
                  </div>
                </div>
                {job.deadline && (
                  <div style={{ background: t.inner, borderRadius: '8px', padding: '8px 12px' }}>
                    <p style={{ fontSize: '11px', color: t.muted, margin: '0 0 2px', fontWeight: '500' }}>Deadline</p>
                    <p style={{ fontSize: '12px', color: t.text, fontWeight: '500', margin: 0 }}>
                      {new Date(job.deadline).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ background: t.card, borderRadius: '12px', border: `1px solid ${t.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.borderSub}` }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: t.text, margin: 0 }}>Queue List</p>
          <p style={{ fontSize: '12px', color: t.muted, margin: '2px 0 0' }}>{jobs.length} jobs pending</p>
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
              const pri = priorityBadge(job.priority);
              return (
                <tr key={job.id} style={{ borderTop: `1px solid ${t.borderSub}`, background: i % 2 === 0 ? t.card : t.rowAlt }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: t.text }}>{job.name}</td>
                  <td style={{ padding: '12px 16px', color: dark ? '#c8d8f077' : '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getMachineStatus(job) === 'RUNNING' ? '#10B981' : '#94A3B8' }} />
                      {getMachineName(job)}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ ...pri, padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600' }}>{pri.label}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: dark ? '#c8d8f077' : '#64748B' }}>{job.estimatedHours}h</td>
                  <td style={{ padding: '12px 16px', color: dark ? '#c8d8f055' : '#64748B' }}>
                    {job.deadline ? new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#FEF9C3', color: '#854D0E', padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600' }}>Queued</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {jobs.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: t.muted }}>Queue is empty — no jobs waiting</div>}
      </div>
    </div>
  );
}