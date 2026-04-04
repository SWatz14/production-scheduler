


import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../App';

const menuItems = [
  { path: '/', label: 'Gantt Schedule', icon: '▦' },
  { path: '/jobs', label: 'Work Orders', icon: '☰' },
  { path: '/machines', label: 'Machines', icon: '⚙' },
  { path: '/kpi', label: 'KPIs', icon: '▲' },
  { path: '/floor', label: 'Factory Floor', icon: '◉' },
  { path: '/operator', label: 'Operators', icon: '▶' },
];

export default function Sidebar() {
  const { dark } = useTheme();

  return (
    <div style={{
      width: '220px', minHeight: '100%',
      background: dark ? '#080c18' : '#152476',
      display: 'flex', flexDirection: 'column', paddingTop: '8px',
      borderRight: dark ? '1px solid #00e5ff15' : 'none',
      transition: 'background 0.2s'
    }}>
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          style={({ isActive }) => ({
            padding: '11px 16px',
            fontSize: '13px',
            color: isActive ? '#ffffff' : dark ? '#c8d8f055' : '#64748B',
            background: isActive
              ? dark ? 'rgba(0,229,255,0.08)' : 'rgba(255,255,255,0.08)'
              : 'transparent',
            borderLeft: isActive
              ? dark ? '3px solid #00e5ff' : '3px solid #3B82F6'
              : '3px solid transparent',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.15s'
          })}
        >
          <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' }}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}