

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../App';

const USERS = [
  { username: 'scheduler', password: 'password', role: 'planner', name: 'Stanley' },
  { username: 'operator', password: 'password', role: 'operator', name: 'Watemi' },
];

export default function LoginPage({ onLogin }) {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const user = USERS.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
      navigate(user.role === 'operator' ? '/operator' : '/');
    } else {
      setError('Invalid username or password');
    }
  };

  const t = {
    bg: dark ? '#0a0e1a' : '#F1F5F9',
    card: dark ? '#0d1526' : '#ffffff',
    border: dark ? '#00e5ff1a' : '#E2E8F0',
    text: dark ? '#ffffff' : '#1E293B',
    muted: dark ? '#c8d8f055' : '#94A3B8',
    input: dark ? '#080c18' : '#ffffff',
    inputBorder: dark ? '#00e5ff22' : '#E2E8F0',
    inputText: dark ? '#c8d8f0' : '#1E293B',
    inner: dark ? '#080c18' : '#F8FAFC',
  };

  return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '16px', padding: '40px', width: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '52px', height: '52px', background: '#1F4E79', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: '24px' }}>▦</div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: t.text, margin: '0 0 6px' }}>Production Scheduler</h1>
          <p style={{ fontSize: '13px', color: t.muted, margin: 0 }}>Sign in to your account</p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '500', color: t.muted, display: 'block', marginBottom: '6px' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Enter your username"
              style={{ width: '100%', padding: '10px 12px', fontSize: '13px', border: `1px solid ${t.inputBorder}`, borderRadius: '8px', background: t.input, color: t.inputText, boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '500', color: t.muted, display: 'block', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 12px', fontSize: '13px', border: `1px solid ${t.inputBorder}`, borderRadius: '8px', background: t.input, color: t.inputText, boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          {error && (
            <p style={{ fontSize: '12px', color: '#DC2626', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '8px 12px', margin: 0 }}>
              ✕ {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            style={{ background: '#1F4E79', color: '#fff', fontSize: '14px', fontWeight: '600', padding: '11px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '4px' }}
          >
            Sign In
          </button>
        </div>

        {/* Demo credentials */}
        <div style={{ marginTop: '24px', padding: '14px', background: t.inner, borderRadius: '10px', border: `1px solid ${t.border}` }}>
          <p style={{ fontSize: '11px', color: t.muted, margin: '0 0 8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo Credentials</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={{ fontSize: '12px', color: t.muted, margin: 0 }}>
              <span style={{ color: t.text, fontWeight: '600' }}>planner</span> / password → Planner Dashboard
            </p>
            <p style={{ fontSize: '12px', color: t.muted, margin: 0 }}>
              <span style={{ color: t.text, fontWeight: '600' }}>operator</span> / password → Operator Queue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
