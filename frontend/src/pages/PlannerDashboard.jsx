//

import React, { useEffect, useState } from 'react';
import { jobService, machineService } from '../services/api';

const STATUS_STYLES = {
  IN_PROGRESS: { background: '#DBEAFE', color: '#1E40AF', label: 'In Progress' },
  DELAYED:     { background: '#FEE2E2', color: '#991B1B', label: 'Overdue' },
  COMPLETE:    { background: '#D1FAE5', color: '#065F46', label: 'Complete' },
  QUEUED:      { background: '#FEF9C3', color: '#854D0E', label: 'Queued' },
};

const MACHINE_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#F97316', '#EC4899'
];

function KpiCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }}>
      <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
        {label}
      </p>
      <p style={{ fontSize: '32px', fontWeight: '700', color: color || '#1E293B', margin: 0, lineHeight: 1 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>{sub}</p>}
    </div>
  );
}

function GanttChart({ jobs, machines }) {
  const hours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
  const totalHours = 8;

  const getBlockStyle = (job, machineIndex) => {
    const startOffset = (machineIndex * 1.2) % totalHours;
    const width = Math.min((job.estimatedHours / totalHours) * 100, 40);
    const left = (startOffset / totalHours) * 100;
    const status = job.status;
    const fills = {
      IN_PROGRESS: { bg: '#BFDBFE', border: '#3B82F6', text: '#1E40AF' },
      DELAYED:     { bg: '#FECACA', border: '#EF4444', text: '#991B1B' },
      COMPLETE:    { bg: '#A7F3D0', border: '#10B981', text: '#065F46' },
      QUEUED:      { bg: '#FEF08A', border: '#EAB308', text: '#854D0E' },
    };
    return { width, left, ...(fills[status] || fills.QUEUED) };
  };

  const uniqueMachines = machines.filter(
    (m, index, self) => index === self.findIndex(t => t.id === m.id)
);
const machineJobs = uniqueMachines.map(machine => ({
    machine,
    jobs: jobs.filter(j => j.machine?.id === machine.id)
}));

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', margin: 0 }}>Gantt Schedule</p>
          <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0' }}>Shift 07:00 — 15:00</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['IN_PROGRESS', 'QUEUED', 'DELAYED', 'COMPLETE'].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: STATUS_STYLES[s].background, border: `1px solid ${STATUS_STYLES[s].color}` }} />
              <span style={{ fontSize: '11px', color: '#64748B' }}>{STATUS_STYLES[s].label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '700px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ padding: '8px 16px', fontSize: '11px', color: '#94A3B8', fontWeight: '500' }}>Machine</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 8px', borderLeft: '1px solid #F1F5F9' }}>
              {hours.map(h => (
                <span key={h} style={{ fontSize: '11px', color: '#94A3B8' }}>{h}</span>
              ))}
            </div>
          </div>

          {machineJobs.map(({ machine, jobs: mJobs }, mi) => (
            <div key={machine.id} style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr',
              borderBottom: '1px solid #F8FAFC',
              background: mi % 2 === 0 ? '#fff' : '#FAFAFA'
            }}>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: machine.status === 'RUNNING' ? '#10B981' : '#94A3B8', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#1E293B', fontWeight: '500' }}>{machine.name}</span>
              </div>
              <div style={{ position: 'relative', height: '48px', borderLeft: '1px solid #F1F5F9' }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{ position: 'absolute', left: `${(i / 8) * 100}%`, top: 0, bottom: 0, width: '1px', background: '#F1F5F9' }} />
                ))}
                {mJobs.map((job, ji) => {
                  const { width, left, bg, border, text } = getBlockStyle(job, ji);
                  return (
                    <div key={job.id} title={job.name} style={{
                      position: 'absolute',
                      left: `${left}%`,
                      width: `${width}%`,
                      top: '8px',
                      height: '32px',
                      background: bg,
                      border: `1px solid ${border}`,
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: text,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      padding: '0 6px',
                      cursor: 'default'
                    }}>
                      {job.name.length > 12 ? job.name.slice(0, 12) + '…' : job.name}
                    </div>
                  );
                })}
                {mJobs.length === 0 && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
                    <span style={{ fontSize: '11px', color: '#CBD5E1' }}>No jobs scheduled</span>
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

export default function PlannerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [algorithm, setAlgorithm] = useState('EDD');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    Promise.all([jobService.getAll(), machineService.getAll()])
      .then(([jobsRes, machinesRes]) => {
        setJobs(jobsRes.data);
        setMachines(machinesRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = filter === 'ALL' ? jobs : jobs.filter(j => j.status === filter);
  const onTime = jobs.filter(j => j.status !== 'DELAYED').length;
  const otif = jobs.length > 0 ? Math.round((onTime / jobs.length) * 100) : 0;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #E2E8F0', borderTop: '3px solid #3B82F6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#94A3B8', fontSize: '14px' }}>Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1E293B', margin: 0 }}>Planner Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={algorithm}
            onChange={e => setAlgorithm(e.target.value)}
            style={{ fontSize: '13px', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 12px', background: '#fff', color: '#1E293B', cursor: 'pointer' }}>
            <option value="EDD">Earliest Due Date (EDD)</option>
            <option value="SPT">Shortest Processing Time (SPT)</option>
          </select>
          <button style={{ background: '#1F4E79', color: '#fff', fontSize: '13px', padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
            Run schedule
          </button>
          <button style={{ background: '#fff', fontSize: '13px', padding: '8px 18px', borderRadius: '8px', border: '1.5px solid #1F4E79', cursor: 'pointer', color: '#1F4E79', fontWeight: '500' }}>
            Publish to floor
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <KpiCard label="Total Jobs" value={jobs.length} sub="This shift" />
        <KpiCard label="In Progress" value={jobs.filter(j => j.status === 'IN_PROGRESS').length} sub="Currently running" color="#1D4ED8" />
        <KpiCard label="Overdue" value={jobs.filter(j => j.status === 'DELAYED').length} sub="Needs attention" color={jobs.filter(j => j.status === 'DELAYED').length > 0 ? '#DC2626' : '#1E293B'} />
        <KpiCard label="OTIF Rate" value={`${otif}%`} sub="On-time in full" color={otif >= 80 ? '#059669' : '#D97706'} />
      </div>

      <GanttChart jobs={jobs} machines={machines} />

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', margin: 0 }}>Work Orders</p>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0' }}>{filteredJobs.length} jobs shown</p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'QUEUED', 'IN_PROGRESS', 'DELAYED', 'COMPLETE'].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: '5px 12px',
                fontSize: '11px',
                borderRadius: '100px',
                border: '1px solid',
                cursor: 'pointer',
                fontWeight: '500',
                borderColor: filter === s ? '#1F4E79' : '#E2E8F0',
                background: filter === s ? '#1F4E79' : '#fff',
                color: filter === s ? '#fff' : '#64748B'
              }}>
                {s === 'ALL' ? 'All' : STATUS_STYLES[s]?.label || s}
              </button>
            ))}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Job Name', 'Machine', 'Priority', 'Est. Hours', 'Deadline', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #F1F5F9' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job, i) => {
              const style = STATUS_STYLES[job.status] || STATUS_STYLES.QUEUED;
              const isOverdue = job.status === 'DELAYED';
              return (
                <tr key={job.id} style={{ borderTop: '1px solid #F8FAFC', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: isOverdue ? '#DC2626' : '#1E293B' }}>
                    {job.name}
                    {isOverdue && <span style={{ marginLeft: '6px', fontSize: '11px' }}>⚠</span>}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: job.machine?.status === 'RUNNING' ? '#10B981' : '#94A3B8' }} />
                      {job.machine?.name || 'Unassigned'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3].map(p => (
                        <div key={p} style={{ width: '8px', height: '8px', borderRadius: '2px', background: p <= job.priority ? '#F59E0B' : '#E2E8F0' }} />
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748B' }}>{job.estimatedHours}h</td>
                  <td style={{ padding: '12px 16px', color: isOverdue ? '#DC2626' : '#64748B', fontWeight: isOverdue ? '600' : '400' }}>
                    {job.deadline ? new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ ...style, padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600' }}>
                      {style.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredJobs.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
            No jobs found for this filter
          </div>
        )}
      </div>
    </div>
  );
}

    