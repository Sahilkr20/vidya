import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  Sun, 
  Zap, 
  Database, 
  Users, 
  BookOpen, 
  Radio, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  HardDrive
} from 'lucide-react';

export default function OverviewDashboard({ 
  overview, 
  schools = [], 
  currentSchool, 
  onSelectSchool,
  onNavigateTab,
  onTriggerSync 
}) {
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(249, 115, 22, 0.08) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-solar">
              <Sun size={13} />
              PM-SHRI & BharatNet Aligned
            </span>
            <span className="badge badge-cyan">
              <HardDrive size={13} />
              Zero-Bandwidth Edge Architecture
            </span>
          </div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: '#ffffff',
            marginBottom: '8px',
            lineHeight: 1.25
          }}>
            Smart Rural Education & Connectivity Platform
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
            Empowering remote & tribal classrooms across India with solar-powered micro-edge servers,
            vernacular NCERT curriculum caching, automated attendance, and fault-tolerant cloud sync.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => onNavigateTab('classroom')} 
            className="btn-primary"
            style={{ padding: '10px 18px' }}
          >
            Launch Smart Class
            <ArrowUpRight size={16} />
          </button>
          <button 
            onClick={() => onNavigateTab('infrastructure')} 
            className="btn-solar"
            style={{ padding: '10px 18px' }}
          >
            <Sun size={16} />
            Solar & IoT Grid
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px'
      }}>
        {/* Card 1: Schools & Connectivity */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              CONNECTED HUBS
            </span>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Wifi size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            {overview?.total_schools || schools.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Schools</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#34d399' }}>
            <CheckCircle2 size={13} />
            <span>3 BharatNet Fiber • 1 VSAT Satellite</span>
          </div>
        </div>

        {/* Card 2: Solar Generation */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              SOLAR MICROGRID POWER
            </span>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(249, 115, 22, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f97316'
            }}>
              <Sun size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            {overview?.total_solar_kw || 15.7} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>kW Total</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#fb923c' }}>
            <Zap size={13} />
            <span>Avg Battery SoC: {overview?.avg_battery_health || 88}%</span>
          </div>
        </div>

        {/* Card 3: Bandwidth Saved via Edge */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              EDGE BANDWIDTH SAVED
            </span>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <Database size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            {overview?.edge_bandwidth_saved_gb || 230} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>GB Cached</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#38bdf8' }}>
            <span>94% Zero-Buffer Local Streaming</span>
          </div>
        </div>

        {/* Card 4: Students Active */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              RURAL STUDENTS ENROLLED
            </span>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc'
            }}>
              <Users size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            {overview?.total_students || 1035} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Learners</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#34d399' }}>
            <span>93.4% Midday Meal Verified</span>
          </div>
        </div>
      </div>

      {/* Cluster Network & Infrastructure Status Table */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
              Rural School Infrastructure & Telemetry Matrix
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time telemetry across solar microgrids, edge caching nodes, and connectivity backhauls
            </p>
          </div>
          <button 
            onClick={onTriggerSync}
            className="btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            <RefreshCw size={13} />
            Refresh Telemetry
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Rural School & Location</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>UDISE Code</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Connectivity Type</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Network Status</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Solar & Battery</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Edge Cache</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {schools.map(school => {
                const isSelected = school.id === currentSchool?.id;
                return (
                  <tr 
                    key={school.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: isSelected ? 'rgba(56, 189, 248, 0.07)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>{school.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {school.village}, {school.district}, {school.state}
                      </div>
                    </td>
                    <td style={{ padding: '14px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                      {school.udise_code}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {school.connectivity_type === 'vsat_satellite' ? <Radio size={14} color="#fbbf24" /> : <Wifi size={14} color="#38bdf8" />}
                        {school.connectivity_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className={`badge ${
                        school.connectivity_status === 'online' ? 'badge-online' : 
                        school.connectivity_status === 'intermittent' ? 'badge-intermittent' : 'badge-offline'
                      }`}>
                        {school.connectivity_status}
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sun size={15} color="#f97316" />
                        <div>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{school.battery_percentage}%</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{school.solar_capacity_kw} kWp</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                        {school.edge_storage_used_gb} / {school.edge_storage_total_gb} GB
                      </div>
                      <div style={{ width: '80px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '4px' }}>
                        <div style={{
                          width: `${(school.edge_storage_used_gb / school.edge_storage_total_gb) * 100}%`,
                          height: '100%',
                          background: '#38bdf8',
                          borderRadius: '2px'
                        }}></div>
                      </div>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        onClick={() => onSelectSchool(school)}
                        style={{
                          background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-elevated)',
                          color: isSelected ? '#38bdf8' : 'var(--text-primary)',
                          border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 600
                        }}
                      >
                        {isSelected ? 'Active Hub' : 'Manage'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
