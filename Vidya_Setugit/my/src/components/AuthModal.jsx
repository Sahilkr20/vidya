import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  School as SchoolIcon, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, schools = [] }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Login state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // Register state
  const [registerForm, setRegisterForm] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    role: 'teacher',
    phone_number: '',
    school_id: schools[0]?.id || 1,
    designation: ''
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser(loginForm);
      setSuccessMsg(data.message || 'Login successful!');
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 500);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await registerUser(registerForm);
      setSuccessMsg(data.message || 'Registration successful!');
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 600);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login Handler
  const handleQuickDemoLogin = async (username, roleLabel) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser({ username, password: 'vidya123' });
      setSuccessMsg(`Welcome, ${roleLabel}!`);
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 400);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '520px', padding: '0', overflow: 'hidden' }}
      >
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(249, 115, 22, 0.1) 100%)',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-solar">
                <ShieldCheck size={12} />
                MySQL Auth
              </span>
              <span className="badge badge-cyan">
                vidyasetu_db
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
              {activeTab === 'login' ? 'Sign In to Vidya Setu' : 'Register New Stakeholder'}
            </h2>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Connected to MySQL Server on localhost:3306
            </p>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-muted)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '4px'
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(null); }}
            style={{
              flex: 1,
              padding: '10px',
              background: activeTab === 'login' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'login' ? '#38bdf8' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.86rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <LogIn size={15} />
            Sign In (लॉग इन)
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(null); }}
            style={{
              flex: 1,
              padding: '10px',
              background: activeTab === 'register' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'register' ? '#38bdf8' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.86rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={15} />
            Register (नया खाता)
          </button>
        </div>

        <div style={{ padding: '24px', maxHeight: '72vh', overflowY: 'auto' }}>
          {/* Status Banners */}
          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid #f43f5e',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#fb7185',
              fontSize: '0.82rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#34d399',
              fontSize: '0.82rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1-Click Quick Demo Login Personas */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.05)',
            border: '1px dashed rgba(56, 189, 248, 0.25)',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={13} />
              Quick 1-Click Demo Personas (Pre-seeded in MySQL):
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('teacher_ramesh', 'Master Ji Ramesh')}
                disabled={loading}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '7px 10px',
                  textAlign: 'left',
                  fontSize: '0.76rem',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>👨‍🏫</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Ramesh Meena</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Rural Teacher</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('deo_sharma', 'DEO Dr. Sharma')}
                disabled={loading}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '7px 10px',
                  textAlign: 'left',
                  fontSize: '0.76rem',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🏛️</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Dr. S.K. Sharma</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>District Officer</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('sarpanch_khedla', 'Sarpanch Balwant Singh')}
                disabled={loading}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '7px 10px',
                  textAlign: 'left',
                  fontSize: '0.76rem',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🌾</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Balwant Singh</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Gram Pradhan</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student_pooja', 'Pooja Gurjar')}
                disabled={loading}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '7px 10px',
                  textAlign: 'left',
                  fontSize: '0.76rem',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>👧</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Pooja Gurjar</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Class 8 Student</div>
                </div>
              </button>
            </div>
          </div>

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Username or Email
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. teacher_ramesh"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '10px 12px 10px 38px',
                      color: '#ffffff',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '10px 40px 10px 38px',
                      color: '#ffffff',
                      fontSize: '0.86rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  marginTop: '8px'
                }}
              >
                {loading ? 'Authenticating in MySQL...' : 'Sign In (लॉग इन करें)'}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Full Name (पूरा नाम)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meenakshi Kumari"
                  value={registerForm.full_name}
                  onChange={(e) => setRegisterForm({ ...registerForm, full_name: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.84rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. meenakshi_teacher"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Password (Min 6 chars)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Educational Stakeholder Role
                </label>
                <select
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.84rem'
                  }}
                >
                  <option value="teacher">👨‍🏫 Rural School Teacher / In-Charge</option>
                  <option value="deo">🏛️ District Education Officer (DEO)</option>
                  <option value="panchayat">🌾 Gram Panchayat / Village Representative</option>
                  <option value="student">👧 Student / Learner</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Affiliated Rural School
                </label>
                <select
                  value={registerForm.school_id}
                  onChange={(e) => setRegisterForm({ ...registerForm, school_id: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.84rem'
                  }}
                >
                  {schools.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.village}, {s.district})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98XXX-XXXXX"
                    value={registerForm.phone_number}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone_number: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-solar"
                style={{
                  width: '100%',
                  padding: '12px',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  marginTop: '10px'
                }}
              >
                {loading ? 'Creating Account in MySQL...' : 'Create Account & Sign In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
