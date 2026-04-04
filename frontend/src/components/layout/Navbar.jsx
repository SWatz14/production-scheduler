

import React from 'react';
import { useTheme } from '../../App';

export default function Navbar({user, onLogOut}) {
  const { dark, toggleDark } = useTheme();

  return (
    <div className="h-14 bg-blue-900 flex items-center justify-between px-6">
      <span className="text-white font-bold text-base">
        Production Scheduler
      </span>
      <div className="flex gap-2 items-center">
        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
          Planner view
        </span>
        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
          Operator view
        </span>
        <button
          onClick={toggleDark}
          style={{
            background: dark ? '#ffffff22' : '#ffffff22',
            border: '1px solid #ffffff44',
            borderRadius: '100px',
            padding: '4px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {dark ? '☀ Light' : '🌙 Dark'}
        </button>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#fff', fontSize: '13px' }}>{user.name}</span>  
            <button onClick={onLogOut} style={{ color: '#fff', fontSize: '13px', border: '1px solid #ffffff44', borderRadius: '100px', padding: '4px 10px', cursor: 'pointer' }}>
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
