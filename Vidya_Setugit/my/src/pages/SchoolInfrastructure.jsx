import React, { useState } from 'react';
import { 
  Sun, 
  Battery, 
  Cpu, 
  HardDrive, 
  Thermometer, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Wrench, 
  Plus, 
  RefreshCw,
  Zap,
  Radio,
  Clock,
  Phone
} from 'lucide-react';

export default function SchoolInfrastructure({ 
  school, 
  telemetry = [], 
  tickets = [], 
  onCreateTicket,
  onRefresh
}) {
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    equipment_name: 'Solar Inverter & Battery Bank',
    severity: 'medium',
    issue_summary: '',
    description: '',
    reported_by: 'Head Teacher / IT In-charge'
  });

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!newTicket.issue_summary.trim()) return;
    onCreateTicket({
      school: school.id,
      ticket_id: `TKT-${school.district?.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      equipment_name: newTicket.equipment_name,
      severity: newTicket.severity,
      issue_summary: newTicket.issue_summary,
      description: newTicket.description,
      reported_by: newTicket.reported_by,
      status: 'open',
      technician_contact: 'Block Rapid Response IT Van'
    });
    setNewTicket({
      equipment_name: 'Solar Inverter & Battery Bank',
      severity: 'medium',
      issue_summary: '',
      description: '',
      reported_by: 'Head Teacher / IT In-charge'
    });
    setShowNewTicketModal(false);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-solar">
              <Sun size={13} />
              Off-Grid Resilient Power
            </span>
            <span className="badge badge-online">
              <Cpu size={13} />
              Edge IoT Telemetry Online
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Solar Microgrid & Hardware Infrastructure
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Real-time IoT sensors and hardware maintenance monitoring for {school?.name}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={onRefresh}
            className="btn-secondary"
            style={{ fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} />
            Scan IoT Nodes
          </button>
          <button 
            onClick={() => setShowNewTicketModal(true)}
            className="btn-solar"
            style={{ fontSize: '0.82rem' }}
          >
            <Wrench size={14} />
            Log Maintenance Ticket
          </button>
        </div>
      </div>

      {/* Primary Hardware Diagnostic Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Card 1: Solar & Inverter Status */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(249, 115, 22, 0.15)',
                color: '#f97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sun size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff' }}>Solar Microgrid</h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{school?.solar_capacity_kw || 4.2} kWp Rooftop Array</span>
              </div>
            </div>
            <span className="badge badge-solar">Active Generation</span>
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SOLAR PV OUTPUT</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fb923c' }}>
                {school?.solar_output_watts || 2650} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Watts</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>BATTERY SoC</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
                {school?.battery_percentage || 92}% <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>(52.8V)</span>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Estimated Night/Overcast Backup:</span>
              <span style={{ fontWeight: 700, color: '#38bdf8' }}>7.8 Hours Remaining</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${school?.battery_percentage || 92}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #f97316, #10b981)',
                borderRadius: '4px'
              }}></div>
            </div>
          </div>
        </div>

        {/* Card 2: Edge Server Node */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Cpu size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff' }}>Raspberry Pi Edge Server</h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>IP: {school?.edge_server_ip || '192.168.10.1'}</span>
              </div>
            </div>
            <span className="badge badge-online">Operational</span>
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>NVMe SSD CACHE</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
                {school?.edge_storage_used_gb || 138} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>/ 256 GB</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SOC TEMPERATURE</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
                42.5°C <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>(Nominal)</span>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Local Wi-Fi Mesh Bandwidth:</span>
              <span style={{ fontWeight: 700, color: '#34d399' }}>300 Mbps (Classroom LAN)</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${((school?.edge_storage_used_gb || 138) / (school?.edge_storage_total_gb || 256)) * 100}%`,
                height: '100%',
                background: '#38bdf8',
                borderRadius: '4px'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* IoT Sensors Health Table */}
      <div className="card" style={{ padding: '22px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
          Real-time IoT Telemetry & Sensor Nodes
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Automated hardware diagnostics reporting to the District Education Command Dashboard
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Device / Subsystem</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Telemetry Metric</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Health Index</th>
              </tr>
            </thead>
            <tbody>
              {telemetry.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#f8fafc' }}>
                    {item.device_name}
                  </td>
                  <td style={{ padding: '12px', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                    {item.device_category?.replace('_', ' ')}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${item.status === 'healthy' ? 'badge-online' : 'badge-intermittent'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#38bdf8', fontWeight: 500 }}>
                    {item.metric_label}: <strong style={{ color: '#ffffff' }}>{item.metric_value}</strong>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#34d399' }}>{item.health_score || 95}%</span>
                      <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                        <div style={{ width: `${item.health_score || 95}%`, height: '100%', background: '#10b981', borderRadius: '2px' }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance & Redressal Tickets Section */}
      <div className="card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
              Hardware Maintenance & Repair Tickets
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Gram Panchayat & Block IT technical van redressal log
            </p>
          </div>
          <button 
            onClick={() => setShowNewTicketModal(true)}
            className="btn-secondary"
            style={{ fontSize: '0.78rem' }}
          >
            <Plus size={14} />
            New Ticket
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: ticket.status === 'resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                  color: ticket.status === 'resolved' ? '#10b981' : '#f97316',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Wrench size={18} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.78rem', color: '#38bdf8' }}>
                      {ticket.ticket_id}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                      {ticket.equipment_name}
                    </span>
                    <span className={`badge ${ticket.status === 'resolved' ? 'badge-online' : 'badge-intermittent'}`}>
                      {ticket.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {ticket.issue_summary}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    <span>Reported: {ticket.reported_by}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={12} />
                      {ticket.technician_contact}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for New Ticket */}
      {showNewTicketModal && (
        <div className="modal-overlay" onClick={() => setShowNewTicketModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Raise Rural Hardware Maintenance Ticket
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Alert block technician vans to fix broken solar, projector, or internet hardware at {school?.name}.
            </p>

            <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Equipment / Hardware
                </label>
                <select
                  value={newTicket.equipment_name}
                  onChange={(e) => setNewTicket({ ...newTicket, equipment_name: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.86rem'
                  }}
                >
                  <option value="Solar Inverter & Battery Bank">Solar Inverter & Battery Bank</option>
                  <option value="Classroom Smart Projector">Classroom Smart Projector</option>
                  <option value="Raspberry Pi Edge Local Server">Raspberry Pi Edge Local Server</option>
                  <option value="BharatNet Fiber GPON Modem">BharatNet Fiber GPON Modem</option>
                  <option value="RFID Smart Attendance Scanner">RFID Smart Attendance Scanner</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Severity Level
                </label>
                <select
                  value={newTicket.severity}
                  onChange={(e) => setNewTicket({ ...newTicket, severity: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.86rem'
                  }}
                >
                  <option value="critical">Critical (Classroom Halted)</option>
                  <option value="high">High (Backup Failing)</option>
                  <option value="medium">Medium (Routine Servicing)</option>
                  <option value="low">Low (Minor Glitch)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Summary of Fault
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inverter displaying error code E04 / Battery overheating"
                  value={newTicket.issue_summary}
                  onChange={(e) => setNewTicket({ ...newTicket, issue_summary: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.86rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide physical room location or symptoms..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-solar"
                  style={{ padding: '8px 18px' }}
                >
                  Dispatch Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
