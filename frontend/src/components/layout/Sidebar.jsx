

import React from 'react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { path: '/', label: 'Gantt Schedule', icon: '▦' },
  { path: '/jobs', label: 'Work Orders', icon: '☰' },
  { path: '/machines', label: 'Machines', icon: '⚙' },
  { path: '/kpi', label: 'KPIs', icon: '▲' },
  { path: '/floor', label: 'Factory Floor', icon: '◉' },
  { path: '/operator', label: 'Operators', icon: '▶' },
];

export default function Sidebar() {
  return (
    <div style={{ width: '220px', minHeight: '100%', background: '#152476', display: 'flex', flexDirection: 'column', paddingTop: '8px' }}>
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          style={({ isActive }) => ({
            padding: '11px 16px',
            fontSize: '13px',
            color: isActive ? '#ffffff' : '#64748B',
            background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
            borderLeft: isActive ? '3px solid #3B82F6' : '3px solid transparent',
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