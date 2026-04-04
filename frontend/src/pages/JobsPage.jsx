


import React from 'react';
import { jobService } from '../services/api';
import { useTheme } from '../App';

const STATUS_STYLES = {
  IN_PROGRESS: { background: '#DBEAFE', color: '#1E40AF', label: 'In Progress' },
  DELAYED:     { background: '#FEE2E2', color: '#991B1B', label: 'Overdue' },
  COMPLETED:   { background: '#D1FAE5', color: '#065F46', label: 'Completed' },
  QUEUED:      { background: '#FEF9C3', color: '#854D0E', label: 'Queued' },
};

export default function JobsPage() {
  const { dark } = useTheme();
  const [jobs, setJobs] = React.useState([]);
  const [filter, setFilter] = React.useState('ALL');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => { jobService.getAll().then(res => setJobs(res.data)).finally(() => setLoading(false)); }, []);

  const t = {
    card: dark ? '#0d1526' : '#fff',
    border: dark ? '#00e5ff1a' : '#E2E8F0',
    borderSub: dark ? '#00e5ff0f' : '#F1F5F9',
    text: dark ? '#ffffff' : '#1E293B',
    muted: dark ? '#c8d8f055' : '#94A3B8',
    rowAlt: dark ? '#00e5ff04' : '#FAFAFA',
    thBg: dark ? '#080c1a' : '#F8FAFC',
  };

  const filtered = filter === 'ALL' ? jobs : jobs.filter(j => j.status === filter);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}><p style={{ color: '#94A3B8' }}>Loading...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: t.text, margin: 0 }}>Work Orders</h1>
        <p style={{ fontSize: '13px', color: t.muted, margin: '4px 0 0' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div style={{ background: t.card, borderRadius: '12px', border: `1px solid ${t.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.borderSub}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: t.text, margin: 0 }}>All Jobs</p>
            <p style={{ fontSize: '12px', color: t.muted, margin: '2px 0 0' }}>{filtered.length} jobs shown</p>
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
            {filtered.map((job, i) => {
              const isOverdue = job.status === 'DELAYED';
              const s = STATUS_STYLES[job.status] || { background: '#F1F5F9', color: '#64748B', label: job.status };
              return (
                <tr key={job.id} style={{ borderTop: `1px solid ${t.borderSub}`, background: i % 2 === 0 ? t.card : t.rowAlt }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: isOverdue ? '#DC2626' : t.text }}>
                    {job.name} {isOverdue && <span style={{ fontSize: '11px' }}>⚠</span>}
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
                    <span style={{ ...s, padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600', display: 'inline-block' }}>{s.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: t.muted }}>No jobs found for this filter</div>}
      </div>
    </div>
  );
}