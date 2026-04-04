

import React from 'react';
import { machineService } from '../services/api';
import { useTheme } from '../App';

export default function MachinesPage() {
  const { dark } = useTheme();
  const [machines, setMachines] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => { machineService.getAll().then(res => setMachines(res.data)).finally(() => setLoading(false)); }, []);

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

  const statusBadge = (status) => ({
    RUNNING: { background: '#D1FAE5', color: '#065F46' },
    IDLE:    { background: '#FEF9C3', color: '#854D0E' },
    OFFLINE: { background: '#FEE2E2', color: '#991B1B' },
  }[status] || { background: '#F1F5F9', color: '#64748B' });

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}><p style={{ color: '#94A3B8' }}>Loading...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: t.text, margin: 0 }}>Machines</h1>
        <p style={{ fontSize: '13px', color: t.muted, margin: '4px 0 0' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total Machines', value: machines.length, sub: 'Registered' },
          { label: 'Running', value: machines.filter(m => m.status === 'RUNNING').length, sub: 'Active now', color: '#059669' },
          { label: 'Offline / Idle', value: machines.filter(m => m.status !== 'RUNNING').length, sub: 'Not active', color: '#D97706' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ background: t.card, borderRadius: '12px', border: `1px solid ${t.border}`, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ fontSize: '12px', color: t.muted, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{label}</p>
            <p style={{ fontSize: '32px', fontWeight: '700', color: color || t.text, margin: 0, lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: '12px', color: t.muted, margin: 0 }}>{sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {machines.map(machine => {
          const s = statusBadge(machine.status);
          return (
            <div key={machine.id} style={{ background: t.card, borderRadius: '12px', border: `1px solid ${t.border}`, padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: machine.status === 'RUNNING' ? '#10B981' : '#94A3B8', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: t.text, margin: 0 }}>{machine.name}</p>
                    <p style={{ fontSize: '11px', color: t.muted, margin: '2px 0 0' }}>{machine.type} · ID {machine.id}</p>
                  </div>
                </div>
                <span style={{ ...s, padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600' }}>{machine.status}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: t.inner, borderRadius: '8px', padding: '10px 12px' }}>
                  <p style={{ fontSize: '11px', color: t.muted, margin: '0 0 2px', fontWeight: '500' }}>Capacity/Hr</p>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: t.text, margin: 0 }}>{machine.capacityPerHour || '—'}</p>
                </div>
                <div style={{ background: t.inner, borderRadius: '8px', padding: '10px 12px' }}>
                  <p style={{ fontSize: '11px', color: t.muted, margin: '0 0 2px', fontWeight: '500' }}>Shift</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: t.text, margin: 0 }}>
                    {machine.shiftStart ? `${machine.shiftStart.slice(0,5)}–${machine.shiftEnd.slice(0,5)}` : '07:00–15:00'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: t.card, borderRadius: '12px', border: `1px solid ${t.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.borderSub}` }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: t.text, margin: 0 }}>Machine Registry</p>
          <p style={{ fontSize: '12px', color: t.muted, margin: '2px 0 0' }}>{machines.length} machines registered</p>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: t.thBg }}>
              {['Name', 'Type', 'Status', 'Capacity/Hr', 'Shift Hours'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', color: t.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: `1px solid ${t.borderSub}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {machines.map((machine, i) => {
              const s = statusBadge(machine.status);
              return (
                <tr key={machine.id} style={{ borderTop: `1px solid ${t.borderSub}`, background: i % 2 === 0 ? t.card : t.rowAlt }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: t.text }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: machine.status === 'RUNNING' ? '#10B981' : '#94A3B8' }} />
                      {machine.name}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: dark ? '#c8d8f077' : '#64748B' }}>{machine.type || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ ...s, padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600' }}>{machine.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: dark ? '#c8d8f077' : '#64748B' }}>{machine.capacityPerHour || '—'}</td>
                  <td style={{ padding: '12px 16px', color: dark ? '#c8d8f077' : '#64748B' }}>
                    {machine.shiftStart ? `${machine.shiftStart.slice(0,5)} — ${machine.shiftEnd.slice(0,5)}` : '—'}
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

