import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  DownloadCloud, 
  CheckCircle2, 
  Play, 
  HardDrive, 
  Languages, 
  Layers,
  Sparkles,
  FileCheck
} from 'lucide-react';

export default function CurriculumRepository({ 
  resources = [], 
  onToggleCache, 
  onSelectLesson, 
  onNavigateTab 
}) {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const subjects = ['all', 'Science & Innovation', 'Mathematics', 'Environmental Studies', 'Digital & Vocational Skills', 'Biology & Ecology', 'Language & Literacy'];
  const grades = ['all', 5, 6, 7, 8, 9, 10];
  const languages = ['all', 'Hindi', 'English', 'Marathi', 'Bengali'];

  const filteredResources = resources.filter(res => {
    if (selectedGrade !== 'all' && res.grade !== Number(selectedGrade)) return false;
    if (selectedLanguage !== 'all' && res.language !== selectedLanguage) return false;
    if (selectedSubject !== 'all' && res.subject !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        res.title.toLowerCase().includes(q) ||
        res.subject.toLowerCase().includes(q) ||
        res.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-cyan">
              <BookOpen size={13} />
              NCERT & State Board Repository
            </span>
            <span className="badge badge-solar">
              <HardDrive size={13} />
              Edge Pre-Caching Hub
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Curriculum & Offline Content Repository
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            High-compression, zero-internet educational modules for vernacular rural classrooms
          </p>
        </div>

        {/* Search Input */}
        <div style={{
          position: 'relative',
          width: '320px',
          maxWidth: '100%'
        }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search lessons, subjects, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '9px 12px 9px 38px',
              color: '#ffffff',
              fontSize: '0.86rem'
            }}
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Filter size={14} />
          <span>Filters:</span>
        </div>

        {/* Grade Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Grade:</span>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '5px 10px',
              color: '#ffffff',
              fontSize: '0.8rem'
            }}
          >
            {grades.map(g => (
              <option key={g} value={g}>{g === 'all' ? 'All Grades' : `Class ${g}`}</option>
            ))}
          </select>
        </div>

        {/* Subject Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '5px 10px',
              color: '#ffffff',
              fontSize: '0.8rem'
            }}
          >
            {subjects.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'All Subjects' : s}</option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '5px 10px',
              color: '#ffffff',
              fontSize: '0.8rem'
            }}
          >
            {languages.map(l => (
              <option key={l} value={l}>{l === 'all' ? 'All Vernaculars' : l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '18px'
      }}>
        {filteredResources.map(res => (
          <div
            key={res.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              padding: '20px',
              position: 'relative'
            }}
          >
            <div>
              {/* Badges */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8'
                }}>
                  Grade {res.grade} • {res.subject}
                </span>

                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: res.is_cached_locally ? '#34d399' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {res.is_cached_locally ? <CheckCircle2 size={13} /> : <DownloadCloud size={13} />}
                  {res.is_cached_locally ? 'On Edge NVMe' : 'Cloud Only'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px', lineHeight: 1.35 }}>
                {res.title}
              </h3>

              <div style={{ fontSize: '0.75rem', color: '#fb923c', fontWeight: 600, marginBottom: '8px' }}>
                {res.curriculum_standard}
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                {res.description}
              </p>
            </div>

            {/* Footer with size, language, and actions */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                marginBottom: '12px',
                fontSize: '0.76rem',
                color: 'var(--text-muted)'
              }}>
                <span>Size: {res.file_size_mb} MB</span>
                <span>Language: {res.language}</span>
                <span>Duration: {res.duration_mins}m</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    onSelectLesson(res);
                    onNavigateTab('classroom');
                  }}
                  className="btn-primary"
                  style={{ flex: 1, padding: '7px 12px', fontSize: '0.78rem', justifyContent: 'center' }}
                >
                  <Play size={14} />
                  Play Lesson
                </button>

                <button
                  onClick={() => onToggleCache(res.id)}
                  style={{
                    background: res.is_cached_locally ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: res.is_cached_locally ? '#fb7185' : '#34d399',
                    border: res.is_cached_locally ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '7px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title={res.is_cached_locally ? 'Remove from local Raspberry Pi storage' : 'Download and cache to local Raspberry Pi for offline playback'}
                >
                  <HardDrive size={14} />
                  {res.is_cached_locally ? 'Cached' : 'Cache Offline'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
