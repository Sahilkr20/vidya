import React, { useState } from 'react';
import { 
  Video, 
  Calendar, 
  FileText, 
  FolderPlus, 
  MessageSquare, 
  Plus, 
  CheckCircle, 
  ExternalLink, 
  Clock, 
  Upload, 
  Download, 
  Award, 
  ShieldCheck, 
  Users, 
  Radio, 
  Sparkles,
  BarChart3,
  BookOpen,
  Pin,
  Trash2
} from 'lucide-react';

export default function TeacherModule({ 
  classes = [], 
  assignments = [], 
  materials = [], 
  forumTopics = [], 
  school,
  onScheduleClass,
  onToggleClassStatus,
  onCreateAssignment,
  onGradeSubmission,
  onUploadMaterial,
  onCreateTopic,
  onReplyTopic,
  currentUser
}) {
  const [activeSubTab, setActiveSubTab] = useState('classes'); // 'classes', 'assignments', 'materials', 'community', 'analytics'

  // Modal states
  const [showClassModal, setShowClassModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  // Class Form
  const [classForm, setClassForm] = useState({
    title: '',
    subject: 'Science & Innovation',
    grade: 8,
    scheduled_time: 'Today at 02:00 PM',
    duration_mins: 45,
    meet_code: 'meet.google.com/vid-setu-' + Math.floor(100 + Math.random() * 900)
  });

  // Assignment Form
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    subject: 'Science & Innovation',
    grade: 8,
    description: '',
    attachment_name: 'Worksheet_Class8.pdf',
    attachment_type: 'PDF',
    due_date: 'Tomorrow, 5:00 PM',
    total_points: 100
  });

  // Material Form
  const [materialForm, setMaterialForm] = useState({
    title: '',
    subject: 'Science & Innovation',
    grade: 8,
    file_type: 'PDF',
    file_name: 'Chapter_Revision_Notes.pdf',
    file_size_mb: 4.2
  });

  // Community Topic Form
  const [topicForm, setTopicForm] = useState({
    title: '',
    subject: 'General',
    category: 'announcement',
    content: ''
  });
  const [replyText, setReplyText] = useState({});

  // Handlers
  const handleScheduleClassSubmit = (e) => {
    e.preventDefault();
    const meetUrl = classForm.meet_code.startsWith('http') ? classForm.meet_code : `https://${classForm.meet_code}`;
    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(classForm.title)}&details=${encodeURIComponent('Live Class on Vidya Setu')}&location=${encodeURIComponent(meetUrl)}`;
    
    onScheduleClass({
      school: school?.id || 1,
      teacher_name: currentUser?.profile?.full_name || 'Master Ji Ramesh Meena',
      title: classForm.title,
      subject: classForm.subject,
      grade: Number(classForm.grade),
      scheduled_time: classForm.scheduled_time,
      duration_mins: Number(classForm.duration_mins),
      meet_link: meetUrl,
      calendar_sync_url: calUrl,
      status: 'scheduled'
    });
    setClassForm({
      title: '',
      subject: 'Science & Innovation',
      grade: 8,
      scheduled_time: 'Today at 02:00 PM',
      duration_mins: 45,
      meet_code: 'meet.google.com/vid-setu-' + Math.floor(100 + Math.random() * 900)
    });
    setShowClassModal(false);
  };

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    onCreateAssignment({
      school: school?.id || 1,
      created_by_name: currentUser?.profile?.full_name || 'Master Ji Ramesh Meena',
      title: assignmentForm.title,
      subject: assignmentForm.subject,
      grade: Number(assignmentForm.grade),
      description: assignmentForm.description,
      attachment_name: assignmentForm.attachment_name,
      attachment_type: assignmentForm.attachment_type,
      due_date: assignmentForm.due_date,
      total_points: Number(assignmentForm.total_points)
    });
    setAssignmentForm({
      title: '',
      subject: 'Science & Innovation',
      grade: 8,
      description: '',
      attachment_name: 'Worksheet_Class8.pdf',
      attachment_type: 'PDF',
      due_date: 'Tomorrow, 5:00 PM',
      total_points: 100
    });
    setShowAssignmentModal(false);
  };

  const handleMaterialSubmit = (e) => {
    e.preventDefault();
    onUploadMaterial({
      school: school?.id || 1,
      uploaded_by_name: currentUser?.profile?.full_name || 'Master Ji Ramesh Meena',
      title: materialForm.title,
      subject: materialForm.subject,
      grade: Number(materialForm.grade),
      file_type: materialForm.file_type,
      file_name: materialForm.file_name,
      file_size_mb: Number(materialForm.file_size_mb)
    });
    setMaterialForm({
      title: '',
      subject: 'Science & Innovation',
      grade: 8,
      file_type: 'PDF',
      file_name: 'Chapter_Revision_Notes.pdf',
      file_size_mb: 4.2
    });
    setShowMaterialModal(false);
  };

  const handleGradingSubmit = (e) => {
    e.preventDefault();
    if (!selectedSubmission || !gradeInput) return;
    onGradeSubmission(selectedSubmission.id, gradeInput, feedbackInput);
    setShowGradingModal(false);
    setSelectedSubmission(null);
    setGradeInput('');
    setFeedbackInput('');
  };

  const handleTopicSubmit = (e) => {
    e.preventDefault();
    if (!topicForm.title.trim()) return;
    onCreateTopic({
      school: school?.id || 1,
      author_name: currentUser?.profile?.full_name || 'Master Ji Ramesh Meena',
      author_role: 'teacher',
      title: topicForm.title,
      subject: topicForm.subject,
      category: topicForm.category,
      content: topicForm.content,
      is_announcement: topicForm.category === 'announcement',
      is_pinned: true
    });
    setTopicForm({ title: '', subject: 'General', category: 'announcement', content: '' });
  };

  const handleSendReply = (topicId) => {
    const text = replyText[topicId];
    if (!text || !text.trim()) return;
    onReplyTopic(topicId, {
      author_name: currentUser?.profile?.full_name || 'Master Ji Ramesh Meena',
      author_role: 'teacher',
      content: text
    });
    setReplyText(prev => ({ ...prev, [topicId]: '' }));
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Module Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-solar">
              <ShieldCheck size={13} />
              Teacher Command Hub
            </span>
            <span className="badge badge-cyan">
              Section 2.3.1 Module
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Teacher Instruction & Class Management Studio
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Schedule Google Meet live classes, manage assignments, upload notes, and moderate student queries
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowClassModal(true)}
            className="btn-primary"
            style={{ fontSize: '0.82rem' }}
          >
            <Video size={15} />
            Schedule Live Class
          </button>
          <button
            onClick={() => setShowAssignmentModal(true)}
            className="btn-solar"
            style={{ fontSize: '0.82rem' }}
          >
            <FileText size={15} />
            Create Assignment
          </button>
          <button
            onClick={() => setShowMaterialModal(true)}
            className="btn-secondary"
            style={{ fontSize: '0.82rem' }}
          >
            <Upload size={15} />
            Upload Notes
          </button>
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
          { id: 'classes', label: 'Live Classes & Google Meet', icon: Video, badge: classes.length },
          { id: 'assignments', label: 'Assignment Control', icon: FileText, badge: assignments.length },
          { id: 'materials', label: 'Resource Repository', icon: BookOpen, badge: materials.length },
          { id: 'community', label: 'Community & Moderation', icon: MessageSquare, badge: forumTopics.length },
          { id: 'analytics', label: 'Student Analytics', icon: BarChart3 }
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
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  fontSize: '0.68rem',
                  fontWeight: 700
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIVE CLASSES & GOOGLE MEET */}
      {activeSubTab === 'classes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '16px' }}>
            {classes.map(cls => (
              <div
                key={cls.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  borderLeft: cls.status === 'live' ? '4px solid #10b981' : cls.status === 'scheduled' ? '4px solid #38bdf8' : '4px solid var(--border-subtle)'
                }}
              >
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
                      {cls.status === 'live' ? '🔴 LIVE SESSION' : cls.status === 'scheduled' ? '⏰ SCHEDULED' : 'COMPLETED'}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Class {cls.grade} • {cls.duration_mins} mins
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                    {cls.title}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#fb923c', fontWeight: 600, marginBottom: '8px' }}>
                    {cls.subject} • By {cls.teacher_name}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    <Clock size={14} color="#38bdf8" />
                    <span>{cls.scheduled_time}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={cls.meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ flex: 1, padding: '7px 12px', fontSize: '0.78rem', justifyContent: 'center', textDecoration: 'none' }}
                    >
                      <Video size={14} />
                      {cls.status === 'live' ? 'Enter Google Meet' : 'Start Google Meet'}
                    </a>

                    {cls.calendar_sync_url && (
                      <a
                        href={cls.calendar_sync_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ padding: '7px 10px', fontSize: '0.78rem', textDecoration: 'none' }}
                        title="Sync reminder to Google Calendar"
                      >
                        <Calendar size={14} color="#fb923c" />
                      </a>
                    )}
                  </div>

                  {/* Teacher action toggle status */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    {cls.status !== 'live' && (
                      <button
                        onClick={() => onToggleClassStatus(cls.id, 'live')}
                        style={{
                          flex: 1,
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#34d399',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 600
                        }}
                      >
                        Set Live Now
                      </button>
                    )}
                    {cls.status !== 'completed' && (
                      <button
                        onClick={() => onToggleClassStatus(cls.id, 'completed')}
                        style={{
                          flex: 1,
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border-subtle)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem'
                        }}
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ASSIGNMENT CONTROL */}
      {activeSubTab === 'assignments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Active assignments and student submissions awaiting evaluation:
            </span>
            <button 
              onClick={() => setShowAssignmentModal(true)}
              className="btn-solar"
              style={{ fontSize: '0.78rem' }}
            >
              <Plus size={14} />
              Add Assignment
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {assignments.map(asg => (
              <div key={asg.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700
                      }}>
                        Class {asg.grade} • {asg.subject}
                      </span>
                      <span style={{
                        background: 'rgba(249, 115, 22, 0.15)',
                        color: '#fb923c',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700
                      }}>
                        Total: {asg.total_points} Pts
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                      {asg.title}
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '8px', maxWidth: '780px' }}>
                      {asg.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      <span>Due: <strong>{asg.due_date}</strong></span>
                      <span>Attachment: <strong style={{ color: '#38bdf8' }}>{asg.attachment_name} ({asg.attachment_type})</strong></span>
                    </div>
                  </div>

                  <span style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '0.76rem',
                    fontWeight: 700
                  }}>
                    {asg.submissions?.length || 0} Submissions
                  </span>
                </div>

                {/* Submissions List */}
                {asg.submissions && asg.submissions.length > 0 && (
                  <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Student Submissions
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {asg.submissions.map(sub => (
                        <div
                          key={sub.id}
                          style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            padding: '12px 14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '10px'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <strong style={{ color: '#ffffff', fontSize: '0.86rem' }}>{sub.student_name}</strong>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({sub.student_roll})</span>
                              <span style={{
                                fontSize: '0.68rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: sub.status === 'graded' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                color: sub.status === 'graded' ? '#34d399' : '#fbbf24'
                              }}>
                                {sub.status === 'graded' ? `Graded: ${sub.grade_score}/${asg.total_points}` : 'Pending Evaluation'}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              "{sub.submission_text || 'Submitted assignment file.'}" • File: <u>{sub.attachment_name}</u>
                            </p>
                            {sub.teacher_feedback && (
                              <p style={{ fontSize: '0.74rem', color: '#38bdf8', marginTop: '2px' }}>
                                Teacher Feedback: {sub.teacher_feedback}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              setSelectedSubmission(sub);
                              setGradeInput(sub.grade_score || '');
                              setFeedbackInput(sub.teacher_feedback || '');
                              setShowGradingModal(true);
                            }}
                            style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-subtle)',
                              color: '#38bdf8',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Award size={13} />
                            {sub.status === 'graded' ? 'Edit Grade' : 'Grade Submission'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RESOURCE REPOSITORY */}
      {activeSubTab === 'materials' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Downloadable Class Notes & Presentation Slides (PDF, DOCX, PPTX):
            </span>
            <button 
              onClick={() => setShowMaterialModal(true)}
              className="btn-primary"
              style={{ fontSize: '0.78rem' }}
            >
              <Upload size={14} />
              Upload New Document
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {materials.map(mat => (
              <div key={mat.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: mat.file_type === 'PDF' ? 'rgba(244, 63, 94, 0.15)' : mat.file_type === 'PPTX' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                      color: mat.file_type === 'PDF' ? '#fb7185' : mat.file_type === 'PPTX' ? '#fb923c' : '#38bdf8'
                    }}>
                      {mat.file_type}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Class {mat.grade} • {mat.file_size_mb} MB
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                    {mat.title}
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Uploaded by: {mat.uploaded_by_name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontFamily: 'monospace', marginTop: '4px' }}>
                    {mat.file_name}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {mat.downloads_count || 0} Downloads
                  </span>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert(`Simulated download of ${mat.file_name} (Ready in local cache)`); }}
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none'
                    }}
                  >
                    <Download size={13} />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMMUNITY & MODERATION */}
      {activeSubTab === 'community' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '20px' }}>
          {/* Forum Discussion Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {forumTopics.map(topic => (
              <div key={topic.id} className="card" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {topic.is_pinned && <Pin size={14} color="#f97316" />}
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: topic.is_announcement ? 'rgba(249, 115, 22, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                      color: topic.is_announcement ? '#fb923c' : '#38bdf8'
                    }}>
                      {topic.category.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    By {topic.author_name} ({topic.author_role})
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                  {topic.title}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {topic.content}
                </p>

                {/* Existing Replies */}
                {topic.replies && topic.replies.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', background: 'var(--bg-surface)', padding: '12px', borderRadius: '8px' }}>
                    {topic.replies.map(rep => (
                      <div key={rep.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.78rem', color: rep.author_role === 'teacher' ? '#38bdf8' : '#ffffff' }}>
                            {rep.author_name} {rep.author_role === 'teacher' ? '(Teacher)' : ''}
                          </span>
                          {rep.is_teacher_endorsed && (
                            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.64rem', fontWeight: 700, padding: '1px 5px', borderRadius: '4px' }}>
                              ✓ Verified Answer
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {rep.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Reply as teacher (endorsed response)..."
                    value={replyText[topic.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [topic.id]: e.target.value })}
                    style={{
                      flex: 1,
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      color: '#ffffff',
                      fontSize: '0.8rem'
                    }}
                  />
                  <button
                    onClick={() => handleSendReply(topic.id)}
                    className="btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Issue New Official Announcement Form */}
          <div className="card" style={{ padding: '20px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
              Issue Teacher Announcement
            </h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Broadcast guidelines, homework schedules, or science fair alerts to students
            </p>

            <form onSubmit={handleTopicSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Announcement Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Fair Project Submission Date"
                  value={topicForm.title}
                  onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '7px 10px',
                    color: '#ffffff',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  value={topicForm.category}
                  onChange={(e) => setTopicForm({ ...topicForm, category: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '7px 10px',
                    color: '#ffffff',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="announcement">Official Announcement</option>
                  <option value="academic_query">Academic Query / Homework Clarification</option>
                  <option value="study_group">Study Circle Coordination</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Message Content
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details of the announcement..."
                  value={topicForm.content}
                  onChange={(e) => setTopicForm({ ...topicForm, content: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '7px 10px',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    resize: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-solar"
                style={{ padding: '8px 14px', fontSize: '0.8rem', justifyContent: 'center', marginTop: '6px' }}
              >
                Publish to Community
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: STUDENT ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>ASSIGNMENTS SUBMITTED</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                94% <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>On-time</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '4px' }}>
                +12% vs last month
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>AVERAGE CLASS QUIZ SCORE</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fb923c', marginTop: '4px' }}>
                87.5 / 100
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Class 8 Science & Math
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE STUDY GROUPS</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                2 Circles
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                16 Student Participants
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE CLASS */}
      {showClassModal && (
        <div className="modal-overlay" onClick={() => setShowClassModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Schedule Live Google Meet Class
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Creates a Google Meet session with automated Google Calendar reminders for rural students.
            </p>

            <form onSubmit={handleScheduleClassSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Lesson / Topic Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric Circuits & Multimeter Testing"
                  value={classForm.title}
                  onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Subject
                  </label>
                  <select
                    value={classForm.subject}
                    onChange={(e) => setClassForm({ ...classForm, subject: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.84rem'
                    }}
                  >
                    <option value="Science & Innovation">Science & Innovation</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Environmental Studies">Environmental Studies</option>
                    <option value="Language & Literacy">Language & Literacy</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Target Grade
                  </label>
                  <select
                    value={classForm.grade}
                    onChange={(e) => setClassForm({ ...classForm, grade: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.84rem'
                    }}
                  >
                    {[6, 7, 8, 9, 10].map(g => (
                      <option key={g} value={g}>Class {g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Date & Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Today at 02:30 PM"
                    value={classForm.scheduled_time}
                    onChange={(e) => setClassForm({ ...classForm, scheduled_time: e.target.value })}
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

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={classForm.duration_mins}
                    onChange={(e) => setClassForm({ ...classForm, duration_mins: e.target.value })}
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
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Google Meet Link (or code)
                </label>
                <input
                  type="text"
                  required
                  value={classForm.meet_code}
                  onChange={(e) => setClassForm({ ...classForm, meet_code: e.target.value })}
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
                  onClick={() => setShowClassModal(false)}
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
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE ASSIGNMENT */}
      {showAssignmentModal && (
        <div className="modal-overlay" onClick={() => setShowAssignmentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Create Class Assignment
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Upload assignment files (PDF, DOCX, PPTX) and assign deadlines to your rural class.
            </p>

            <form onSubmit={handleAssignmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Energy Problem Set 3"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Class Grade
                  </label>
                  <select
                    value={assignmentForm.grade}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, grade: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.84rem'
                    }}
                  >
                    {[6, 7, 8, 9, 10].map(g => (
                      <option key={g} value={g}>Class {g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Document Type
                  </label>
                  <select
                    value={assignmentForm.attachment_type}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, attachment_type: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.84rem'
                    }}
                  >
                    <option value="PDF">PDF Document (.pdf)</option>
                    <option value="DOCX">Word Document (.docx)</option>
                    <option value="PPTX">PowerPoint Presentation (.pptx)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Instructions & Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe problem statements, required steps, and submission format..."
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Submission Deadline
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Friday at 5:00 PM"
                    value={assignmentForm.due_date}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, due_date: e.target.value })}
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

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Max Points
                  </label>
                  <input
                    type="number"
                    value={assignmentForm.total_points}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, total_points: e.target.value })}
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
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="btn-secondary"
                  style={{ padding: '8px 14px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-solar"
                  style={{ padding: '8px 18px' }}
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD MATERIAL */}
      {showMaterialModal && (
        <div className="modal-overlay" onClick={() => setShowMaterialModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Upload Study Material to Resource Repository
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Upload notes or presentation slides accessible offline on the local edge server.
            </p>

            <form onSubmit={handleMaterialSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NCERT Class 8 Science Chapter 14 Summary"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Document Format
                  </label>
                  <select
                    value={materialForm.file_type}
                    onChange={(e) => setMaterialForm({ ...materialForm, file_type: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.84rem'
                    }}
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="PPTX">PowerPoint Slides</option>
                    <option value="DOCX">Word Document</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Target Class
                  </label>
                  <select
                    value={materialForm.grade}
                    onChange={(e) => setMaterialForm({ ...materialForm, grade: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.84rem'
                    }}
                  >
                    {[6, 7, 8, 9, 10].map(g => (
                      <option key={g} value={g}>Class {g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowMaterialModal(false)}
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
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GRADE SUBMISSION */}
      {showGradingModal && selectedSubmission && (
        <div className="modal-overlay" onClick={() => setShowGradingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
              Grade Student Submission
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Student: <strong>{selectedSubmission.student_name} ({selectedSubmission.student_roll})</strong>
            </p>

            <form onSubmit={handleGradingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong>Submission Text:</strong>
                <p style={{ marginTop: '4px', color: '#ffffff' }}>{selectedSubmission.submission_text || 'Submitted document.'}</p>
                <p style={{ marginTop: '4px', fontSize: '0.74rem', color: '#38bdf8' }}>Attachment: {selectedSubmission.attachment_name}</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Award Score (out of 100)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  placeholder="e.g. 95"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
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

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Teacher Feedback
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide constructive feedback and encouragement..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowGradingModal(false)}
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
                  Submit Grade & Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
