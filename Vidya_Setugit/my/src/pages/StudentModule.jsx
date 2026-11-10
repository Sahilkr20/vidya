import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  Video, 
  Calendar, 
  FileText, 
  Download, 
  Upload, 
  Bot, 
  Send, 
  Users, 
  Sparkles, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Award, 
  Target, 
  Plus, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export default function StudentModule({ 
  classes = [], 
  assignments = [], 
  goals = [], 
  studyGroups = [], 
  forumTopics = [], 
  school,
  onToggleGoal,
  onCreateGoal,
  onSubmitAssignment,
  onJoinGroup,
  onAskAITutor,
  currentUser
}) {
  const [activeSubTab, setActiveSubTab] = useState('dashboard'); // 'dashboard', 'classes', 'assignments', 'aitutor', 'groups'

  // Pomodoro Timer State
  const [pomodoroMode, setPomodoroMode] = useState('focus'); // 'focus' (25m) | 'break' (5m)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(2);

  // Goal Form
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('This Week');

  // Assignment Submission Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState('');

  // AI Tutor Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am your Vidya Setu AI Academic Tutor. You can ask me any question from Science, Math, Social Studies, or English. How can I assist your studies today?',
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Pomodoro interval
  useEffect(() => {
    let timer = null;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (pomodoroMode === 'focus') {
        setCompletedSessions(prev => prev + 1);
        setPomodoroMode('break');
        setTimeLeft(5 * 60);
        alert('🎉 Great job! 25-minute Pomodoro focus session complete. Take a 5-minute breather!');
      } else {
        setPomodoroMode('focus');
        setTimeLeft(25 * 60);
        alert('Break time over! Ready for another focused study session?');
      }
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, pomodoroMode]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(pomodoroMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchPomodoroMode = (mode) => {
    setIsTimerRunning(false);
    setPomodoroMode(mode);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  // Goal Handlers
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    onCreateGoal({
      student_name: currentUser?.profile?.full_name || 'Pooja Gurjar',
      title: newGoalTitle,
      target_date: newGoalDate,
      is_completed: false,
      notes: 'Added from Student Goal Notepad'
    });
    setNewGoalTitle('');
  };

  // Submit Assignment
  const handleSubmitAssignmentForm = (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    onSubmitAssignment(selectedAssignment.id, {
      student_name: currentUser?.profile?.full_name || 'Pooja Gurjar',
      student_roll: 'KH-01',
      submission_text: submissionText,
      attachment_name: submissionFile || `${(currentUser?.profile?.full_name || 'Student').replace(" ", "_")}_Solution.pdf`
    });
    setShowSubmitModal(false);
    setSelectedAssignment(null);
    setSubmissionText('');
    setSubmissionFile('');
  };

  // Send AI Tutor Message
  const handleSendChat = async (promptText) => {
    const msg = promptText || chatInput;
    if (!msg.trim()) return;

    const userMsg = {
      sender: 'user',
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await onAskAITutor({
        message: msg,
        subject: 'Science',
        grade: 8,
        language: 'English'
      });
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: res.reply,
          time: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'I could not connect to the cloud right now, but your local edge server notes cover this topic in Chapter 14!',
          time: 'Just now'
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Student Module Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-cyan">
              <Award size={13} />
              Student Learning Space
            </span>
            <span className="badge badge-solar">
              Section 2.3.2 Module
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Personal Learning Dashboard & AI Study Studio
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Welcome back, {currentUser?.profile?.full_name || 'Pooja Gurjar'}! Track your goals, join live classes, and study with AI assistance.
          </p>
        </div>

        {/* Quick Streak Pill */}
        <div style={{
          background: 'rgba(249, 115, 22, 0.15)',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '1.2rem' }}>🔥</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fb923c' }}>14-Day Study Streak</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>340 Gamified Points</div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '6px',
        background: 'var(--bg-card)',
        padding: '6px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        overflowX: 'auto'
      }}>
        {[
          { id: 'dashboard', label: 'Personal Dashboard & Timer', icon: Target },
          { id: 'classes', label: 'Class Participation', icon: Video, badge: classes.filter(c => c.status === 'live').length ? 'LIVE' : null },
          { id: 'assignments', label: 'Assignments & Submissions', icon: FileText, badge: assignments.length },
          { id: 'aitutor', label: 'AI Academic Tutor (Chatbot)', icon: Bot, highlight: true },
          { id: 'groups', label: 'Study Mate Circles & Forum', icon: Users, badge: studyGroups.length }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '6px',
                background: isActive ? 'var(--cyan-500)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 500,
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={15} color={isActive ? '#ffffff' : tab.highlight ? '#38bdf8' : 'currentColor'} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{
                  background: tab.badge === 'LIVE' ? '#ef4444' : isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  fontSize: '0.65rem',
                  fontWeight: 800
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PERSONAL DASHBOARD & POMODORO TIMER */}
      {activeSubTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)', gap: '20px' }}>
          {/* Left Column: Goal-Setting Notepad & Subject Performance Graphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Goal-Setting Notepad */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={18} color="#38bdf8" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                    Student Goal-Setting Notepad
                  </h3>
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {goals.filter(g => g.is_completed).length} / {goals.length} Completed
                </span>
              </div>

              {/* Add Goal Input */}
              <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Set an academic goal (e.g. Solve 10 Vedic math sums)..."
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.84rem'
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                >
                  <Plus size={14} />
                  Add Goal
                </button>
              </form>

              {/* Goal Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {goals.map(goal => (
                  <div
                    key={goal.id}
                    onClick={() => onToggleGoal(goal.id)}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {goal.is_completed ? (
                        <CheckCircle2 size={18} color="#10b981" />
                      ) : (
                        <Circle size={18} color="var(--text-muted)" />
                      )}
                      <div>
                        <div style={{
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          color: goal.is_completed ? 'var(--text-muted)' : '#ffffff',
                          textDecoration: goal.is_completed ? 'line-through' : 'none'
                        }}>
                          {goal.title}
                        </div>
                        {goal.notes && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {goal.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <span style={{ fontSize: '0.72rem', color: '#fb923c', fontWeight: 600 }}>
                      {goal.target_date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Graphs / Charts */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <TrendingUp size={18} color="#10b981" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                  Academic Mastery & Progress Graphs
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { subject: 'Science & Innovation', score: 94, color: '#38bdf8' },
                  { subject: 'Mathematics (Vedic & NCERT)', score: 88, color: '#f97316' },
                  { subject: 'Environmental Studies', score: 92, color: '#10b981' },
                  { subject: 'Language & Literacy (English/Hindi)', score: 86, color: '#c084fc' }
                ].map(item => (
                  <div key={item.subject}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>{item.subject}</span>
                      <span style={{ color: item.color, fontWeight: 700 }}>{item.score}% Mastery</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${item.score}%`,
                        height: '100%',
                        background: item.color,
                        borderRadius: '4px'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pomodoro-Based Study Timer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="card" style={{
              padding: '24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(249, 115, 22, 0.08) 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                <Clock size={16} color="#fb923c" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                  Pomodoro Focus Timer
                </h3>
              </div>

              {/* Mode Toggle Buttons */}
              <div style={{
                display: 'flex',
                background: 'var(--bg-surface)',
                borderRadius: '8px',
                padding: '4px',
                gap: '4px',
                marginBottom: '20px'
              }}>
                <button
                  onClick={() => switchPomodoroMode('focus')}
                  style={{
                    background: pomodoroMode === 'focus' ? 'var(--cyan-500)' : 'transparent',
                    color: pomodoroMode === 'focus' ? '#ffffff' : 'var(--text-muted)',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    fontWeight: 700
                  }}
                >
                  Focus (25m)
                </button>
                <button
                  onClick={() => switchPomodoroMode('break')}
                  style={{
                    background: pomodoroMode === 'break' ? '#10b981' : 'transparent',
                    color: pomodoroMode === 'break' ? '#ffffff' : 'var(--text-muted)',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    fontWeight: 700
                  }}
                >
                  Break (5m)
                </button>
              </div>

              {/* Circular Big Clock */}
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                border: `6px solid ${pomodoroMode === 'focus' ? '#38bdf8' : '#10b981'}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                background: 'rgba(0, 0, 0, 0.3)',
                boxShadow: pomodoroMode === 'focus' ? '0 0 25px rgba(56, 189, 248, 0.25)' : '0 0 25px rgba(16, 185, 129, 0.25)'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  color: '#ffffff'
                }}>
                  {formatTimer(timeLeft)}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {pomodoroMode === 'focus' ? 'Study Block' : 'Rest Block'}
                </div>
              </div>

              {/* Timer Controls */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={pomodoroMode === 'focus' ? 'btn-primary' : 'btn-solar'}
                  style={{ padding: '10px 24px', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                  <span>{isTimerRunning ? 'Pause' : 'Start Focus'}</span>
                </button>
                <button
                  onClick={resetTimer}
                  className="btn-secondary"
                  style={{ padding: '10px 14px' }}
                  title="Reset clock"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                🎉 <strong>{completedSessions} Pomodoros</strong> completed today!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLASS PARTICIPATION */}
      {activeSubTab === 'classes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {classes.map(cls => (
              <div key={cls.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: cls.status === 'live' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                      color: cls.status === 'live' ? '#34d399' : '#38bdf8'
                    }}>
                      {cls.status === 'live' ? '🔴 LIVE NOW' : cls.status === 'scheduled' ? 'UPCOMING' : 'COMPLETED'}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Grade {cls.grade} • {cls.duration_mins}m
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                    {cls.title}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#fb923c', fontWeight: 600, marginBottom: '6px' }}>
                    {cls.subject} • Teacher: {cls.teacher_name}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    Time: {cls.scheduled_time}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                  {cls.status === 'completed' && cls.recorded_link ? (
                    <a
                      href={cls.recorded_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ flex: 1, padding: '7px 12px', fontSize: '0.78rem', justifyContent: 'center', textDecoration: 'none' }}
                    >
                      <Video size={14} color="#38bdf8" />
                      Watch Recorded Class
                    </a>
                  ) : (
                    <a
                      href={cls.meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ flex: 1, padding: '7px 12px', fontSize: '0.78rem', justifyContent: 'center', textDecoration: 'none' }}
                    >
                      <Video size={14} />
                      Join Google Meet
                    </a>
                  )}

                  {cls.calendar_sync_url && (
                    <a
                      href={cls.calendar_sync_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: '7px 10px', fontSize: '0.78rem', textDecoration: 'none' }}
                      title="Add to Google Calendar"
                    >
                      <Calendar size={14} color="#fb923c" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ASSIGNMENT HANDLING */}
      {activeSubTab === 'assignments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {assignments.map(asg => {
              const mySubmission = asg.submissions?.find(s => s.student_name === (currentUser?.profile?.full_name || 'Pooja Gurjar'));
              return (
                <div key={asg.id} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{
                          background: 'rgba(56, 189, 248, 0.15)',
                          color: '#38bdf8',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 700
                        }}>
                          Grade {asg.grade} • {asg.subject}
                        </span>
                        <span style={{
                          background: 'rgba(249, 115, 22, 0.15)',
                          color: '#fb923c',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 700
                        }}>
                          Max Points: {asg.total_points}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                        {asg.title}
                      </h3>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '10px', maxWidth: '780px' }}>
                        {asg.description}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        <span>Deadline: <strong style={{ color: '#ffffff' }}>{asg.due_date}</strong></span>
                        <span>Attached Material: <strong style={{ color: '#38bdf8' }}>{asg.attachment_name}</strong></span>
                      </div>
                    </div>

                    {/* Action & Status */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      {mySubmission ? (
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            background: mySubmission.status === 'graded' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                            color: mySubmission.status === 'graded' ? '#34d399' : '#fbbf24',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.74rem',
                            fontWeight: 700
                          }}>
                            {mySubmission.status === 'graded' ? `Score: ${mySubmission.grade_score} / ${asg.total_points}` : 'Submitted (Awaiting Review)'}
                          </span>
                          {mySubmission.teacher_feedback && (
                            <div style={{ fontSize: '0.74rem', color: '#38bdf8', marginTop: '6px', maxWidth: '280px' }}>
                              Teacher Note: {mySubmission.teacher_feedback}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => alert(`Downloaded ${asg.attachment_name} to your local device!`)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                          >
                            <Download size={13} />
                            Download PDF
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAssignment(asg);
                              setShowSubmitModal(true);
                            }}
                            className="btn-primary"
                            style={{ padding: '6px 14px', fontSize: '0.76rem' }}
                          >
                            <Upload size={13} />
                            Submit Work
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: AI TUTOR INTERFACE (CHATBOT PROTOTYPE) */}
      {activeSubTab === 'aitutor' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(280px, 1fr)',
          gap: '20px'
        }}>
          {/* Chat Window */}
          <div className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '560px',
            padding: '20px'
          }}>
            {/* Chat Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '12px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <Bot size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#ffffff' }}>
                    Vidya Setu AI Academic Tutor
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#34d399' }}>
                    ● Online (NCERT Grade 6-10 STEM Specialist)
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              paddingRight: '6px',
              marginBottom: '14px'
            }}>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    background: msg.sender === 'user' ? 'var(--cyan-500)' : 'var(--bg-surface)',
                    color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '0.84rem',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.text}
                  <div style={{
                    fontSize: '0.65rem',
                    color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                    textAlign: 'right',
                    marginTop: '4px'
                  }}>
                    {msg.time}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div style={{
                  alignSelf: 'flex-start',
                  background: 'var(--bg-surface)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  color: '#38bdf8'
                }}>
                  AI Tutor is analyzing textbook concepts...
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendChat(); }} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Ask any question from Science, Math, Circuits..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '0.86rem'
                }}
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="btn-primary"
                style={{ padding: '10px 16px' }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>

          {/* Quick FAQ / Prompt Suggestions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="card" style={{ padding: '18px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} />
                Frequently Asked Academic Queries:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  "Explain Ohm's Law in simple Hindi with rural analogy",
                  "How to multiply 96 x 94 using Vedic mental math?",
                  "How do school rooftop solar panels generate DC electricity?",
                  "What is the difference between plant and animal cells?",
                  "Formula to calculate rooftop rainwater harvesting liters"
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendChat(prompt)}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      textAlign: 'left',
                      fontSize: '0.76rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#38bdf8'; e.currentTarget.style.borderColor = '#38bdf8'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STUDY MATE GROUPS & FORUM */}
      {activeSubTab === 'groups' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)', gap: '20px' }}>
          {/* Study Mate Circles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              Collaborative Study Mate Circles
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {studyGroups.map(grp => (
                <div key={grp.id} className="card" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{grp.name}</h4>
                      <span style={{ fontSize: '0.74rem', color: '#fb923c', fontWeight: 600 }}>
                        {grp.subject} • Class {grp.grade}
                      </span>
                    </div>
                    <span style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px'
                    }}>
                      {grp.members_count} Peers Joined
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    {grp.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Schedule: {grp.meeting_schedule}
                    </span>
                    <button
                      onClick={() => onJoinGroup(grp.id)}
                      className="btn-primary"
                      style={{ padding: '5px 12px', fontSize: '0.74rem' }}
                    >
                      Join Circle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Questions in Forum */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              Recent Peer & Teacher Discussions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {forumTopics.slice(0, 3).map(top => (
                <div key={top.id} className="card" style={{ padding: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#ffffff', marginBottom: '4px' }}>
                    {top.title}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {top.content}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 600 }}>
                    {top.replies?.length || 0} Responses (Teacher Endorsed)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL */}
      {showSubmitModal && selectedAssignment && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
              Submit Assignment Solutions
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Assignment: <strong>{selectedAssignment.title}</strong>
            </p>

            <form onSubmit={handleSubmitAssignmentForm} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Write Your Solutions / Answers
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your final calculated values, equations, or answers here..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    resize: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Attach Notebook Scan / Solution File Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pooja_Gurjar_Assignment_Solutions.pdf"
                  value={submissionFile}
                  onChange={(e) => setSubmissionFile(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.84rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="btn-secondary"
                  style={{ padding: '8px 14px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '8px 18px' }}
                >
                  Submit Solution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
