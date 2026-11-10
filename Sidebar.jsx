import React from 'react';
import { 
  LayoutDashboard, 
  Tv, 
  Sun, 
  BookOpen, 
  UserCheck, 
  GraduationCap, 
  Users, 
  HardDrive, 
  Video, 
  FileText, 
  Bot, 
  Target, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Database,
  BatteryCharging,
  Cpu,
  Wifi,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  onSelectTab, 
  school, 
  activeRole, 
  onToggleRole 
}) {
  const roleSpecificItems = [
    {
      id: 'teacher_module',
      label: 'Teacher Module (2.3.1)',
      labelHi: 'शिक्षक मॉड्यूल',
      icon: GraduationCap,
      badge: 'Teacher',
      forRole: 'teacher',
      color: '#f97316'
    },
    {
      id: 'student_module',
      label: 'Student Module (2.3.2)',
      labelHi: 'विद्यार्थी मॉड्यूल',
      icon: Award,
      badge: 'Student',
      forRole: 'student',
      color: '#38bdf8'
    }
  ];

  const platformItems = [
    { id: 'enterprise', label: 'Operations Hub (3.3-3.25)', labelHi: 'प्रशासनिक व संचालन केंद्र', icon: Database, badge: 'Full ERP', color: '#c084fc' },
    { id: 'braille', label: 'Braille Learning Studio', labelHi: 'ब्रेल शिक्षण केंद्र', icon: Sparkles, badge: 'Inclusive', color: '#f59e0b' },
    { id: 'overview', label: 'Cluster Overview', labelHi: 'क्लस्टर डैशबोर्ड', icon: LayoutDashboard, color: '#38bdf8' },
    { id: 'classroom', label: 'Smart Classroom', labelHi: 'स्मार्ट क्लासरूम', icon: Tv, badge: 'Live', color: '#ef4444' },
    { id: 'infrastructure', label: 'Solar & IoT Grid', labelHi: 'सोलर व हार्डवेयर ग्रिड', icon: Sun, color: '#facc15' },
    { id: 'curriculum', label: 'Curriculum Repository', labelHi: 'पाठ्यक्रम भंडार', icon: BookOpen, color: '#38bdf8' },
    { id: 'attendance', label: 'Smart Attendance', labelHi: 'उपस्थिति व पोषण', icon: UserCheck, color: '#10b981' },
    { id: 'community', label: 'Panchayat & Village Hub', labelHi: 'ग्राम पंचायत व समुदाय', icon: Users, color: '#f97316' },
  ];

  return (
    <aside style={{
      width: '280px',
      background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 16, 30, 0.98) 100%)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '18px 14px',
      flexShrink: 0,
      gap: '16px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Dynamic Role Switcher (Conditional Rendering) */}
        <div style={{
          background: 'rgba(7, 11, 20, 0.8)',
          borderRadius: '10px',
          padding: '4px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          gap: '4px',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)'
        }}>
          <button
            onClick={() => onToggleRole('teacher')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '8px',
              background: activeRole === 'teacher' ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'transparent',
              color: activeRole === 'teacher' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: activeRole === 'teacher' ? 700 : 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeRole === 'teacher' ? '0 2px 10px rgba(249, 115, 22, 0.4)' : 'none'
            }}
          >
            <GraduationCap size={14} />
            Teacher Mode
          </button>
          <button
            onClick={() => onToggleRole('student')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '8px',
              background: activeRole === 'student' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
              color: activeRole === 'student' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: activeRole === 'student' ? 700 : 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeRole === 'student' ? '0 2px 10px rgba(2, 132, 199, 0.4)' : 'none'
            }}
          >
            <Award size={14} />
            Student Mode
          </button>
        </div>

        {/* Section: Academic Role Modules */}
        <div>
          <div style={{ 
            fontSize: '0.68rem', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            color: '#38bdf8',
            padding: '6px 10px 4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={11} />
            Core Academic Modules
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
            {roleSpecificItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const isRecommended = item.forRole === activeRole;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: isActive 
                      ? 'linear-gradient(90deg, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0.05))' 
                      : isRecommended 
                      ? 'rgba(255, 255, 255, 0.04)' 
                      : 'transparent',
                    color: isActive ? '#38bdf8' : isRecommended ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: isActive || isRecommended ? 700 : 500,
                    fontSize: '0.82rem',
                    border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                    boxShadow: isActive ? '0 0 15px rgba(56, 189, 248, 0.15)' : 'none',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = isRecommended ? 'rgba(255, 255, 255, 0.04)' : 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={16} color={isActive ? '#38bdf8' : item.color} />
                    <span>{item.label}</span>
                  </div>
                  <span style={{
                    background: item.forRole === 'teacher' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(2, 132, 199, 0.2)',
                    color: item.forRole === 'teacher' ? '#fb923c' : '#38bdf8',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '999px',
                    border: `1px solid ${item.forRole === 'teacher' ? 'rgba(249, 115, 22, 0.3)' : 'rgba(2, 132, 199, 0.3)'}`
                  }}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Platform Infrastructure & ERP */}
        <div>
          <div style={{ 
            fontSize: '0.68rem', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            color: 'var(--text-muted)',
            padding: '8px 10px 4px',
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '4px'
          }}>
            Infrastructure & Operations Hub
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
            {platformItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '9px',
                    background: isActive 
                      ? 'linear-gradient(90deg, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0.04))' 
                      : 'transparent',
                    color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.8rem',
                    border: isActive ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                    boxShadow: isActive ? '0 0 12px rgba(56, 189, 248, 0.15)' : 'none',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={15} color={isActive ? '#38bdf8' : item.color} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{
                      background: item.badge === 'Full ERP' 
                        ? 'rgba(192, 132, 252, 0.2)' 
                        : item.badge === 'Inclusive' 
                        ? 'rgba(245, 158, 11, 0.2)' 
                        : 'rgba(16, 185, 129, 0.2)',
                      color: item.badge === 'Full ERP' ? '#c084fc' : item.badge === 'Inclusive' ? '#f59e0b' : '#34d399',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '999px',
                      border: '1px solid currentColor'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mini Edge Node & Solar Telemetry Widget */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(19, 29, 51, 0.9), rgba(11, 17, 32, 0.95))',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: '12px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={14} color="#38bdf8" />
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.04em' }}>
              RPI 5 EDGE HUB
            </span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="live-pulse-dot"></span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#34d399' }}>ONLINE</span>
          </span>
        </div>

        {/* BATTERY & SOLAR STATUS */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BatteryCharging size={12} color="#fbbf24" /> Solar Battery
            </span>
            <strong style={{ color: '#fbbf24' }}>{school?.battery_percentage || 92}%</strong>
          </div>
          <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${school?.battery_percentage || 92}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #10b981)', borderRadius: '3px' }}></div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          <span>IP: {school?.edge_server_ip || '192.168.10.1'}</span>
          <span>NVMe: {school?.edge_storage_used_gb || 138}GB</span>
        </div>
      </div>
    </aside>
  );
}
