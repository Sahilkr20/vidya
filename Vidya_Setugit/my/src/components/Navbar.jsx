import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Sun, 
  Zap, 
  RefreshCw, 
  Database, 
  Radio, 
  Globe, 
  Sparkles,
  ChevronDown,
  Layers,
  AlertTriangle,
  User,
  LogIn,
  LogOut,
  ShieldCheck,
  Award,
  GraduationCap
} from 'lucide-react';

export default function Navbar({ 
  currentSchool, 
  schools = [], 
  onSelectSchool, 
  onToggleConnectivity, 
  onTriggerSync, 
  syncQueueCount = 0,
  isSyncing = false,
  language,
  onLanguageChange,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onNavigateTab
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showSchoolMenu, setShowSchoolMenu] = useState(false);

  const getStatusBadge = () => {
    if (!currentSchool) return null;
    const status = currentSchool.connectivity_status;
    if (status === 'online') {
      return (
        <span className="badge badge-online">
          <span className="live-pulse-dot"></span>
          {currentSchool.connectivity_type === 'bharatnet_fiber' ? 'BharatNet Fiber' : 'High Speed 4G/5G'} • {currentSchool.bandwidth_kbps > 1000 ? `${(currentSchool.bandwidth_kbps / 1000).toFixed(1)} Mbps` : `${currentSchool.bandwidth_kbps} kbps`}
        </span>
      );
    }
    if (status === 'intermittent') {
      return (
        <span className="badge badge-intermittent">
          <Radio size={13} />
          ISRO VSAT Satellite • {currentSchool.latency_ms}ms Latency
        </span>
      );
    }
    return (
      <span className="badge badge-offline">
        <WifiOff size={13} />
        Offline Edge Cache Active
      </span>
    );
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'teacher':
        return <span style={{ background: 'rgba(249, 115, 22, 0.2)', color: '#fb923c', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800, border: '1px solid rgba(249, 115, 22, 0.3)' }}>Teacher</span>;
      case 'deo':
        return <span style={{ background: 'rgba(192, 132, 252, 0.2)', color: '#c084fc', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800, border: '1px solid rgba(192, 132, 252, 0.3)' }}>DEO</span>;
      case 'panchayat':
        return <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.3)' }}>Panchayat</span>;
      default:
        return <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800, border: '1px solid rgba(56, 189, 248, 0.3)' }}>Student</span>;
    }
  };

  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
      padding: '0 24px',
      height: '74px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Brand & Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 45%, #0284c7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(249, 115, 22, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
          color: '#ffffff',
          fontWeight: 900,
          fontSize: '22px',
          letterSpacing: '-0.02em'
        }}>
          वि
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontFamily: 'var(--font-display)', 
              fontWeight: 900, 
              fontSize: '1.35rem', 
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #ffffff 40%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Vidya Setu
            </span>
            <span style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(234, 88, 12, 0.15))',
              color: '#fb923c',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(249, 115, 22, 0.4)'
            }}>
              विद्या सेतु
            </span>
            {/* Database Indicator */}
            <span style={{
              background: 'rgba(56, 189, 248, 0.1)',
              color: '#38bdf8',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Database size={11} />
              MySQL Online
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, margin: '1px 0 0' }}>
            Smart Rural Education & Resilient Connectivity Infrastructure (NEP 2020)
          </p>
        </div>
      </div>

      {/* Center Telemetry & Quick Navigation Shortcuts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', display: 'none', lgDisplay: 'flex' }}>
        {onNavigateTab && (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => onNavigateTab('teacher_module')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '6px',
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.25)',
                color: '#fb923c',
                fontSize: '0.74rem',
                fontWeight: 700
              }}
            >
              <GraduationCap size={13} />
              Teacher 2.3.1
            </button>
            <button
              onClick={() => onNavigateTab('student_module')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '6px',
                background: 'rgba(2, 132, 199, 0.1)',
                border: '1px solid rgba(2, 132, 199, 0.25)',
                color: '#38bdf8',
                fontSize: '0.74rem',
                fontWeight: 700
              }}
            >
              <Award size={13} />
              Student 2.3.2
            </button>
            <button
              onClick={() => onNavigateTab('braille')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                color: '#f59e0b',
                fontSize: '0.74rem',
                fontWeight: 700
              }}
            >
              <Sparkles size={13} />
              Braille Studio
            </button>
            <button
              onClick={() => onNavigateTab('enterprise')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '6px',
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                color: '#c084fc',
                fontSize: '0.74rem',
                fontWeight: 700
              }}
            >
              <Database size={13} />
              ERP 3.3-3.25
            </button>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* School Switcher */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowSchoolMenu(!showSchoolMenu)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '8px 12px',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: currentSchool?.solar_powered ? '#f59e0b' : '#38bdf8',
              boxShadow: currentSchool?.solar_powered ? '0 0 8px #f59e0b' : '0 0 8px #38bdf8'
            }}></div>
            <span>{currentSchool?.name || 'Select Rural School'}</span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showSchoolMenu && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              width: '340px',
              background: 'rgba(15, 23, 42, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '12px',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7)',
              zIndex: 200,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '10px 14px', fontSize: '0.7rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, borderBottom: '1px solid var(--border-subtle)' }}>
                Connected Rural Clusters
              </div>
              {schools.map(s => (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSchool(s);
                    setShowSchoolMenu(false);
                  }}
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    background: s.id === currentSchool?.id ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.84rem', color: s.id === currentSchool?.id ? '#38bdf8' : '#ffffff' }}>{s.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {s.village}, {s.state} • {s.connectivity_type}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: s.connectivity_status === 'online' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                    color: s.connectivity_status === 'online' ? '#34d399' : '#fb7185'
                  }}>
                    {s.connectivity_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Connectivity Status & Simulator Toggle */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Click to simulate network outage, VSAT satellite, or fiber restore"
          >
            {getStatusBadge()}
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>

          {showStatusMenu && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '290px',
              background: 'rgba(15, 23, 42, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '12px',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7)',
              zIndex: 200,
              padding: '12px'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Simulate Network Connectivity
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={() => {
                    onToggleConnectivity('online');
                    setShowStatusMenu(false);
                  }}
                  style={{
                    background: currentSchool?.connectivity_status === 'online' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: currentSchool?.connectivity_status === 'online' ? '#34d399' : 'var(--text-primary)',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Wifi size={14} color="#10b981" />
                  <span>BharatNet Fiber (Online 5.2 Mbps)</span>
                </button>
                <button
                  onClick={() => {
                    onToggleConnectivity('intermittent');
                    setShowStatusMenu(false);
                  }}
                  style={{
                    background: currentSchool?.connectivity_status === 'intermittent' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: currentSchool?.connectivity_status === 'intermittent' ? '#fbbf24' : 'var(--text-primary)',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Radio size={14} color="#fbbf24" />
                  <span>ISRO VSAT Satellite (350kbps)</span>
                </button>
                <button
                  onClick={() => {
                    onToggleConnectivity('offline');
                    setShowStatusMenu(false);
                  }}
                  style={{
                    background: currentSchool?.connectivity_status === 'offline' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: currentSchool?.connectivity_status === 'offline' ? '#fb7185' : 'var(--text-primary)',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <WifiOff size={14} color="#f43f5e" />
                  <span>Outage Mode (100% Offline Edge Cache)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sync Trigger Button */}
        <button
          onClick={onTriggerSync}
          disabled={isSyncing}
          className="btn-secondary"
          style={{ fontSize: '0.8rem', padding: '7px 12px', position: 'relative' }}
          title="Synchronize offline attendance & quiz queue to Central Cloud"
        >
          <RefreshCw size={13} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
          <span>Sync</span>
          {syncQueueCount > 0 && (
            <span style={{
              background: '#ea580c',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '1px 5px',
              borderRadius: '999px',
              marginLeft: '4px'
            }}>
              {syncQueueCount}
            </span>
          )}
        </button>

        {/* Language selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '3px 6px',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.74rem'
        }}>
          <Globe size={12} color="var(--text-muted)" />
          {['English', 'हिन्दी'].map(lang => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              style={{
                background: language === lang ? 'var(--cyan-500)' : 'transparent',
                color: language === lang ? '#ffffff' : 'var(--text-muted)',
                padding: '3px 6px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: language === lang ? 700 : 500
              }}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* USER AUTHENTICATION SECTION */}
        {currentUser ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '4px 10px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              boxShadow: '0 0 10px rgba(2, 132, 199, 0.4)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.78rem',
              fontWeight: 800
            }}>
              {(currentUser.profile?.full_name || currentUser.username || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#ffffff' }}>
                  {currentUser.profile?.full_name || currentUser.username}
                </span>
                {getRoleBadge(currentUser.profile?.role)}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                {currentUser.profile?.school_name || 'Vidya Setu Member'}
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Logout from session"
              style={{
                background: 'rgba(244, 63, 94, 0.15)',
                color: '#fb7185',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <LogOut size={12} />
              Exit
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          >
            <LogIn size={14} />
            Sign In / Register
          </button>
        )}
      </div>
    </header>
  );
}
