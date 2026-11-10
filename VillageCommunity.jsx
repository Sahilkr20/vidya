import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Award, 
  MessageSquare, 
  HeartHandshake, 
  CheckCircle,
  Plus,
  Landmark,
  Sparkles
} from 'lucide-react';

export default function VillageCommunity({ school, notices = [] }) {
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);
  const [grievanceText, setGrievanceText] = useState('');
  const [grievanceName, setGrievanceName] = useState('');

  const handleSubmitGrievance = (e) => {
    e.preventDefault();
    if (!grievanceText.trim()) return;
    setGrievanceSubmitted(true);
    setGrievanceText('');
    setGrievanceName('');
    setTimeout(() => setGrievanceSubmitted(false), 4000);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-solar">
              <Landmark size={13} />
              Gram Panchayat Community Hub
            </span>
            <span className="badge badge-cyan">
              <Users size={13} />
              Evening Digital Literacy & Citizen Services
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Village Community & Digital Empowerment Hub
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Transforming {school?.name} into the village digital learning & governance center after school hours
          </p>
        </div>
      </div>

      {/* 3 Pillar Feature Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff' }}>Adult Digital Literacy</h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tue & Thu 5:30 PM</span>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Teaching village elders, farmers, and women how to verify DBT payments, use BHIM UPI safely, and access land records (Bhulekh).
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(249, 115, 22, 0.15)',
              color: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff' }}>Women SHG Kiosk</h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Aajeevika Digital Register</span>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Providing solar-powered connectivity to Self-Help Groups for managing micro-credit ledgers and handicraft marketplace listings.
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HeartHandshake size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff' }}>Kisan Weather & Agro Advice</h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Satellite Data Link</span>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Weekly live projection of monsoon rainfall radar forecasts, crop pest advisories, and Mandi market prices on the school screen.
          </p>
        </div>
      </div>

      {/* Community Notices & Grievance Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 1fr)',
        gap: '20px'
      }}>
        {/* Left: Community Noticeboard */}
        <div className="card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
            Gram Panchayat Public Announcements & Workshops
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Upcoming village events hosted at the Vidya Setu Smart Hub
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notices.map(notice => (
              <div
                key={notice.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#ffffff' }}>
                    {notice.title}
                  </h4>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    textTransform: 'uppercase'
                  }}>
                    {notice.category?.replace('_', ' ')}
                  </span>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {notice.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} color="#f97316" />
                    {notice.event_time}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#38bdf8" />
                    {notice.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Citizen Kiosk Form */}
        <div className="card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
            Village Redressal & Citizen Helpdesk
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Villagers can register local infrastructure issues (handpump, electricity cut, road) through the school portal.
          </p>

          {grievanceSubmitted && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981',
              borderRadius: '6px',
              padding: '10px 14px',
              marginBottom: '14px',
              fontSize: '0.82rem',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle size={16} />
              Grievance ticket logged and forwarded to Block Development Officer (BDO).
            </div>
          )}

          <form onSubmit={handleSubmitGrievance} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Citizen / Villager Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Chandra (Ward 4)"
                value={grievanceName}
                onChange={(e) => setGrievanceName(e.target.value)}
                required
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
                Issue Category
              </label>
              <select
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
                <option value="school_facility">School Facility / Clean Drinking Water</option>
                <option value="solar_light">Village Street Solar Light Fault</option>
                <option value="midday_meal">Poshan / Anganwadi Ration Query</option>
                <option value="internet_kiosk">BharatNet Fiber Access for Villagers</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Details of Issue
              </label>
              <textarea
                rows={3}
                placeholder="Describe the problem..."
                value={grievanceText}
                onChange={(e) => setGrievanceText(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  resize: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-solar"
              style={{ padding: '8px 16px', fontSize: '0.84rem', alignSelf: 'flex-start', marginTop: '6px' }}
            >
              Submit Citizen Grievance
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
