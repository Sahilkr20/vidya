import React, { useState } from 'react';
import { 
  UserCheck, 
  Users, 
  Utensils, 
  Radio, 
  CheckCircle2, 
  Clock, 
  Award, 
  CloudOff, 
  CloudCheck,
  RefreshCw,
  Search,
  Zap
} from 'lucide-react';

export default function StudentAttendance({ 
  students = [], 
  school, 
  onMarkAttendance, 
  onTriggerSync 
}) {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [search, setSearch] = useState('');
  const [rfidSimulated, setRfidSimulated] = useState(null);

  const isOnline = school?.connectivity_status === 'online';

  const filteredStudents = students.filter(s => {
    if (selectedGrade !== 'all' && s.grade !== Number(selectedGrade)) return false;
    if (search.trim() && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.roll_number.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const presentCount = students.filter(s => s.attendance_percentage > 90).length;
  const middayMealCount = presentCount;

  const handleSimulateScan = (student) => {
    onMarkAttendance({
      student_id: student.id,
      school_id: school.id,
      status: 'present',
      is_cloud_synced: isOnline
    });
    setRfidSimulated(student.name);
    setTimeout(() => setRfidSimulated(null), 3000);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-cyan">
              <UserCheck size={13} />
              PM-POSHAN & Smart RFID Attendance
            </span>
            <span className={`badge ${isOnline ? 'badge-online' : 'badge-offline'}`}>
              {isOnline ? 'Direct Cloud Sync' : 'Offline Edge Queue Active'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Smart Attendance & Midday Meal Nutrition Log
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Biometric / RFID student check-in with automatic offline queueing during connectivity cuts
          </p>
        </div>

        <button 
          onClick={onTriggerSync}
          className="btn-secondary"
          style={{ fontSize: '0.82rem' }}
        >
          <RefreshCw size={14} />
          Sync Offline Roster to Cloud
        </button>
      </div>

      {/* RFID Tap Alert Banner */}
      {rfidSimulated && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid #10b981',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#ffffff',
          animation: 'fadeIn 0.2s'
        }}>
          <Radio size={20} color="#34d399" />
          <div>
            <strong>Smart RFID Gate Scan Recorded: </strong>
            <span>{rfidSimulated} marked present. {isOnline ? 'Synced to State Portal.' : 'Saved to Local Edge Server (Will sync once link restores).'}</span>
          </div>
        </div>
      )}

      {/* Quick Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL ENROLLED</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            {students.length * 36} <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Students</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Classes 6 to 10 • Gender Ratio 52% F / 48% M
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>TODAY'S VERIFIED ATTENDANCE</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
            94.2% <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Present</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#10b981', marginTop: '4px' }}>
            Smart RFID gate verification active
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>MIDDAY MEAL (PM POSHAN)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fb923c', marginTop: '4px' }}>
            {middayMealCount * 34} <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Meals Served</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Menu: Dal-Chawal & Boiled Eggs/Fruit
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>OFFLINE SYNC STATUS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: isOnline ? '#38bdf8' : '#fb7185', marginTop: '4px' }}>
            {isOnline ? 'Real-Time' : 'Edge Queued'}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {isOnline ? 'BharatNet Fiber Link Active' : 'Cached locally on Raspberry Pi'}
          </div>
        </div>
      </div>

      {/* Roster Table with RFID simulation */}
      <div className="card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Filter Class:</span>
            {['all', 6, 7, 8].map(g => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                style={{
                  background: selectedGrade === g ? 'var(--cyan-500)' : 'var(--bg-surface)',
                  color: selectedGrade === g ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: selectedGrade === g ? 700 : 500
                }}
              >
                {g === 'all' ? 'All Classes' : `Class ${g}`}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Filter by student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '6px 10px 6px 32px',
                color: '#ffffff',
                fontSize: '0.8rem'
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Roll & Student Name</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Class</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Guardian</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>RFID Card Tag</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Attendance Rate</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Gamified Points</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Smart Gate Tap</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{student.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{student.roll_number}</div>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                    Class {student.grade}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                    {student.guardian_name}
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'monospace', color: '#38bdf8', fontSize: '0.78rem' }}>
                    {student.rfid_card_id}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontWeight: 700, color: student.attendance_percentage > 90 ? '#34d399' : '#fbbf24' }}>
                      {student.attendance_percentage}%
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb923c', fontWeight: 600 }}>
                      <Award size={15} />
                      <span>{student.learning_points} Pts</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleSimulateScan(student)}
                      style={{
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Radio size={13} />
                      Simulate Tap
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
