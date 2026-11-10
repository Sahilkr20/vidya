import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Maximize2, 
  CheckCircle, 
  Award, 
  Languages, 
  Sun, 
  Zap, 
  Tv, 
  HardDrive,
  FileText,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function SmartClassroom({ resources = [], school, onNavigateTab }) {
  const [selectedLesson, setSelectedLesson] = useState(resources[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson', 'quiz', 'notes'
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [audioLang, setAudioLang] = useState('Hindi');

  const questions = selectedLesson?.content_payload?.quiz_questions || [
    {
      q: "What type of electrical current do solar photovoltaic panels generate directly?",
      options: ["Direct Current (DC)", "Alternating Current (AC)", "Static Charge", "High Frequency RF"],
      answer: 0
    },
    {
      q: "Which hardware component converts DC battery power to AC for school projectors?",
      options: ["Inverter", "Step-down Transformer", "Capacitor", "Rheostat"],
      answer: 0
    }
  ];

  const handleSelectAnswer = (qIdx, optIdx) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleEvaluateQuiz = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.answer) {
        score += 10;
      }
    });
    setQuizScore(score);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-cyan">
              <Tv size={13} />
              Classroom #1 Smart Projector Display
            </span>
            <span className="badge badge-online">
              <HardDrive size={13} />
              Local Edge Stream (0ms Buffering)
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff' }}>
            {selectedLesson ? selectedLesson.title : 'Smart Interactive Classroom'}
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Playing from Local Raspberry Pi Micro-Server • {school?.name}
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setLowPowerMode(!lowPowerMode)}
            style={{
              background: lowPowerMode ? 'rgba(249, 115, 22, 0.25)' : 'var(--bg-card)',
              color: lowPowerMode ? '#fb923c' : 'var(--text-secondary)',
              border: lowPowerMode ? '1px solid #f97316' : '1px solid var(--border-subtle)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
            title="Dimmable eco-mode reduces classroom display power by 40% to preserve solar battery on cloudy days"
          >
            <Sun size={15} />
            {lowPowerMode ? 'Eco Power Mode (Active)' : 'Eco Power Mode'}
          </button>

          <button
            onClick={() => onNavigateTab('curriculum')}
            className="btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            Browse All Lessons
          </button>
        </div>
      </div>

      {/* Main Grid: Player on Left, Curriculum / Lesson Info on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)',
        gap: '20px'
      }}>
        {/* Left Column: Interactive Screen / Player */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            background: lowPowerMode ? '#070b14' : '#030712',
            border: '2px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            aspectRatio: '16/9',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px'
          }}>
            {/* Screen Header Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(8px)',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span>
                {selectedLesson?.curriculum_standard || 'NCERT Class 8'} • Grade {selectedLesson?.grade || 8}
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.65)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.74rem',
                color: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Languages size={14} color="#38bdf8" />
                <span>Audio: {audioLang}</span>
              </div>
            </div>

            {/* Interactive Blackboard Center View */}
            <div style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 'auto 0',
              padding: '0 20px',
              zIndex: 10
            }}>
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: isPlaying ? 'rgba(56, 189, 248, 0.2)' : 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(234, 88, 12, 0.4)',
                marginBottom: '16px',
                transition: 'transform 0.2s'
              }}
              onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: 4 }} />}
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                {selectedLesson?.title || 'Solar Energy & Electric Circuits'}
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', maxWidth: '520px' }}>
                {isPlaying 
                  ? 'Simulating classroom audio-visual stream from Edge NVMe storage at 1080p.' 
                  : 'Click play to start zero-buffer offline interactive lesson in your classroom.'}
              </p>

              {isPlaying && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '16px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.74rem',
                  color: '#34d399'
                }}>
                  <Zap size={13} />
                  <span>Bitrate: 2,400 kbps (Cached) • 0 Internet Bandwidth Consumed</span>
                </div>
              )}
            </div>

            {/* Player Controls Bar */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10,
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ background: 'transparent', color: '#ffffff' }}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button
                  onClick={() => setIsPlaying(true)}
                  style={{ background: 'transparent', color: 'var(--text-muted)' }}
                  title="Replay from start"
                >
                  <RotateCcw size={16} />
                </button>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  {isPlaying ? '08:24' : '00:00'} / {selectedLesson?.duration_mins || 20}:00
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ flex: 1, margin: '0 20px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: isPlaying ? '42%' : '0%', height: '100%', background: '#38bdf8', borderRadius: '3px' }}></div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Volume2 size={18} color="var(--text-muted)" />
                <Maximize2 size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
              </div>
            </div>
          </div>

          {/* Sub-Tabs: Lesson Overview, Quiz, Key Takeaways */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '16px' }}>
              <button
                onClick={() => setActiveTab('lesson')}
                style={{
                  background: activeTab === 'lesson' ? 'var(--cyan-500)' : 'transparent',
                  color: activeTab === 'lesson' ? '#ffffff' : 'var(--text-secondary)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                Lesson Outline
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                style={{
                  background: activeTab === 'quiz' ? 'var(--cyan-500)' : 'transparent',
                  color: activeTab === 'quiz' ? '#ffffff' : 'var(--text-secondary)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <HelpCircle size={14} />
                Interactive Class Quiz
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                style={{
                  background: activeTab === 'notes' ? 'var(--cyan-500)' : 'transparent',
                  color: activeTab === 'notes' ? '#ffffff' : 'var(--text-secondary)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                Teacher Notes
              </button>
            </div>

            {activeTab === 'lesson' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {selectedLesson?.description}
                </p>
                <div style={{ marginTop: '8px' }}>
                  <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                    Key Learning Objectives:
                  </h4>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {(selectedLesson?.content_payload?.key_takeaways || [
                      "Understand silicon photovoltaic cell working principle.",
                      "Learn how inverters and tubular battery storage ensure continuous night & overcast power.",
                      "Hands-on demonstration using classroom solar multimeter."
                    ]).map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    Test student comprehension directly on the blackboard:
                  </span>
                  {quizScore !== null && (
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}>
                      Class Score: {quizScore} / {questions.length * 10} Pts
                    </span>
                  )}
                </div>

                {questions.map((q, qIdx) => (
                  <div key={qIdx} style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '14px'
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#ffffff', marginBottom: '10px' }}>
                      {qIdx + 1}. {q.q}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                      {q.options.map((opt, optIdx) => {
                        const isChosen = quizAnswers[qIdx] === optIdx;
                        const isCorrect = optIdx === q.answer;
                        const showResult = quizScore !== null;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectAnswer(qIdx, optIdx)}
                            style={{
                              background: showResult
                                ? isCorrect ? 'rgba(16, 185, 129, 0.2)' : isChosen ? 'rgba(244, 63, 94, 0.2)' : 'var(--bg-card)'
                                : isChosen ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-card)',
                              color: showResult
                                ? isCorrect ? '#34d399' : isChosen ? '#fb7185' : 'var(--text-primary)'
                                : isChosen ? '#38bdf8' : 'var(--text-primary)',
                              border: isChosen ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              textAlign: 'left',
                              fontSize: '0.82rem',
                              fontWeight: isChosen ? 600 : 400
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleEvaluateQuiz}
                  className="btn-primary"
                  style={{ alignSelf: 'flex-start', padding: '8px 18px', fontSize: '0.84rem' }}
                >
                  <Award size={16} />
                  Submit Answers & Record Points
                </button>
              </div>
            )}

            {activeTab === 'notes' && (
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <p>
                  <strong>Pedagogical Guidance for Rural Multi-Grade Classrooms:</strong>
                </p>
                <p style={{ marginTop: '8px' }}>
                  When demonstrating solar circuits, use the school's own rooftop solar panel inverter as a living laboratory. 
                  Have students observe the digital readout change when clouds pass overhead to connect theory to empirical observation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Offline Caching Playlist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="card" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
              Offline Edge Classroom Playlist
            </h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Locally cached on Raspberry Pi • Zero internet required
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '520px', overflowY: 'auto' }}>
              {resources.map(res => {
                const isCurrent = res.id === selectedLesson?.id;
                return (
                  <div
                    key={res.id}
                    onClick={() => {
                      setSelectedLesson(res);
                      setIsPlaying(false);
                      setQuizScore(null);
                    }}
                    style={{
                      background: isCurrent ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-surface)',
                      border: isCurrent ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(249, 115, 22, 0.15)',
                        color: '#fb923c'
                      }}>
                        Grade {res.grade} • {res.subject}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {res.duration_mins}m
                      </span>
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '0.84rem', color: isCurrent ? '#38bdf8' : '#ffffff', lineHeight: 1.3 }}>
                      {res.title}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>Lang: {res.language}</span>
                      <span>•</span>
                      <span style={{ color: res.is_cached_locally ? '#34d399' : 'var(--text-muted)' }}>
                        {res.is_cached_locally ? '✓ Cached Locally' : 'Cloud Available'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
