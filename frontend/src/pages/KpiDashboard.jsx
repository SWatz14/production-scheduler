


import React from 'react';
import { jobService, machineService } from '../services/api';
import { useTheme } from '../App';

const STATUS_STYLES = {
  IN_PROGRESS: { background: '#DBEAFE', color: '#1E40AF', label: 'In Progress' },
  DELAYED:     { background: '#FEE2E2', color: '#991B1B', label: 'Overdue' },
  COMPLETED:   { background: '#D1FAE5', color: '#065F46', label: 'Completed' },
  QUEUED:      { background: '#FEF9C3', color: '#854D0E', label: 'Queued' },
};

function KpiCard({ label, value, sub, color, t }) {
  return (
    <div style={{ background: t.card, borderRadius: '12px', border: `1px solid ${t.border}`, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <p style={{ fontSize: '12px', color: t.muted, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{label}</p>
      <p style={{ fontSize: '32px', fontWeight: '700', color: color || t.text, margin: 0, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: '12px', color: t.muted, margin: 0 }}>{sub}</p>}
    </div>
  );
}

export default function KpiDashboard() {
  const { dark } = useTheme();
  const [jobs, setJobs] = React.useState([]);
  const [machines, setMachines] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([jobService.getAll(), machineService.getAll()])
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
    barBg: dark ? '#1a2540' : '#F1F5F9',
  };

  const total = jobs.length;
  const completed = jobs.filter(j => j.status === 'COMPLETED').length;
  const inProgress = jobs.filter(j => j.status === 'IN_PROGRESS').length;
  const queued = jobs.filter(j => j.status === 'QUEUED').length;
  const delayed = jobs.filter(j => j.status === 'DELAYED').length;
  const otif = total > 0 ? Math.round(((total - delayed) / total) * 100) : 0;

  const machineStats = machines.map(machine => {
    const mJobs = jobs.filter(j => j.machine?.id === machine.id);
    const active = mJobs.filter(j => j.status === 'IN_PROGRESS').length;
    const util = mJobs.length > 0 ? Math.round((active / mJobs.length) * 100) : 0;
    const totalHours = mJobs.reduce((sum, j) => sum + (j.estimatedHours || 0), 0);
    return { machine, util, totalHours, jobCount: mJobs.length, active };
  });

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}><p style={{ color: '#94A3B8' }}>Loading...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: t.text, margin: 0 }}>KPI Dashboard</h1>
        <p style={{ fontSize: '13px', color: t.muted, margin: '4px 0 0' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <KpiCard label="Total Jobs" value={total} sub="This shift" t={t} />
        <KpiCard label="In Progress" value={inProgress} sub="Currently running" color="#1D4ED8" t={t} />
        <KpiCard label="Overdue" value={delayed} sub="Needs attention" color={delayed > 0 ? '#DC2626' : t.text} t={t} />
        <KpiCard label="OTIF Rate" value={`${otif}%`} sub="On-time in full" color={otif >= 80 ? '#059669' : '#D97706'} t={t} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <KpiCard label="Completed" value={completed} sub="Finished this shift" color="#059669" t={t} />
        <KpiCard label="Queued" value={queued} sub="Waiting to start" color="#D97706" t={t} />
      </div>

      <div style={{ background: t.card, borderRadius: '12px', border: `1px solid ${t.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.borderSub}` }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: t.text, margin: 0 }}>Job Status Breakdown</p>
          <p style={{ fontSize: '12px', color: t.muted, margin: '2px 0 0' }}>Distribution across all statuses</p>
        </div>
        <div style={{ padding: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['IN_PROGRESS', 'QUEUED', 'COMPLETED', 'DELAYED'].map(s => {
            const count = jobs.filter(j => j.status === s).length;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const style = STATUS_STYLES[s];
            return (
              <div key={s} style={{ flex: 1, minWidth: '120px', background: t.inner, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: t.muted, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 8px' }}>{style.label}</p>
                <p style={{ fontSize: '28px', fontWeight: '700', color: style.color, margin: '0 0 6px', lineHeight: 1 }}>{count}</p>
                <div style={{ height: '4px', background: t.barBg, borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: style.color, borderRadius: '2px' }} />
                </div>
                <p style={{ fontSize: '11px', color: t.muted, margin: '4px 0 0' }}>{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: t.card, borderRadius: '12px', border: `1px solid ${t.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.borderSub}` }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: t.text, margin: 0 }}>Machine Utilization</p>
          <p style={{ fontSize: '12px', color: t.muted, margin: '2px 0 0' }}>Jobs and hours per machine this shift</p>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: t.thBg }}>
              {['Machine', 'Status', 'Jobs', 'Active', 'Total Hours', 'Utilization'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', color: t.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: `1px solid ${t.borderSub}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {machineStats.map(({ machine, util, totalHours, jobCount, active }, i) => {
              const statusStyle = machine.status === 'RUNNING' ? { background: '#D1FAE5', color: '#065F46' } : machine.status === 'IDLE' ? { background: '#FEF9C3', color: '#854D0E' } : { background: '#FEE2E2', color: '#991B1B' };
              return (
                <tr key={machine.id} style={{ borderTop: `1px solid ${t.borderSub}`, background: i % 2 === 0 ? t.card : t.rowAlt }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: t.text }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: machine.status === 'RUNNING' ? '#10B981' : '#94A3B8' }} />
                      {machine.name}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ ...statusStyle, padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600' }}>{machine.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: dark ? '#c8d8f077' : '#64748B' }}>{jobCount}</td>
                  <td style={{ padding: '12px 16px', color: active > 0 ? '#1D4ED8' : t.muted, fontWeight: active > 0 ? '600' : '400' }}>{active}</td>
                  <td style={{ padding: '12px 16px', color: dark ? '#c8d8f077' : '#64748B' }}>{totalHours.toFixed(1)}h</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, height: '6px', background: t.barBg, borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${util}%`, background: util > 70 ? '#059669' : util > 30 ? '#D97706' : '#94A3B8', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '12px', color: dark ? '#c8d8f077' : '#64748B', minWidth: '36px', fontWeight: '500' }}>{util}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
