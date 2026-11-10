import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import OverviewDashboard from './pages/OverviewDashboard';
import SmartClassroom from './pages/SmartClassroom';
import SchoolInfrastructure from './pages/SchoolInfrastructure';
import CurriculumRepository from './pages/CurriculumRepository';
import StudentAttendance from './pages/StudentAttendance';
import VillageCommunity from './pages/VillageCommunity';
import TeacherModule from './pages/TeacherModule';
import StudentModule from './pages/StudentModule';
import BrailleLearningStudio from './pages/BrailleLearningStudio';
import EnterpriseManagement from './pages/EnterpriseManagement';

import {
  fetchOverview,
  fetchSchools,
  toggleSchoolConnectivity,
  triggerSchoolSync,
  fetchTelemetry,
  fetchResources,
  toggleResourceCache,
  fetchStudents,
  markSmartAttendance,
  fetchTickets,
  createTicket,
  fetchNotices,
  fetchSyncQueue,
  getCurrentUser,
  getStoredUser,
  logoutUser,
  fetchClasses,
  createClass,
  toggleClassStatus,
  fetchAssignments,
  createAssignment,
  submitAssignment,
  gradeSubmission,
  fetchMaterials,
  uploadMaterial,
  fetchForumTopics,
  createForumTopic,
  replyToForumTopic,
  fetchStudyGroups,
  joinStudyGroup,
  fetchStudentGoals,
  createStudentGoal,
  toggleStudentGoal,
  askAITutor
} from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('teacher_module');
  const [schools, setSchools] = useState([]);
  const [currentSchool, setCurrentSchool] = useState(null);
  const [overview, setOverview] = useState(null);
  const [telemetry, setTelemetry] = useState([]);
  const [resources, setResources] = useState([]);
  const [students, setStudents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [notices, setNotices] = useState([]);
  const [syncQueue, setSyncQueue] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncBanner, setSyncBanner] = useState(null);
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(true);

  // Authentication & Dynamic Role State (Teacher vs Student conditional rendering)
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [activeRole, setActiveRole] = useState(getStoredUser()?.profile?.role === 'student' ? 'student' : 'teacher');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 2.3.1 & 2.3.2 Modules State
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [forumTopics, setForumTopics] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);
  const [studentGoals, setStudentGoals] = useState([]);

  // Initial load
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [
          overviewData,
          schoolsData,
          resourcesData,
          noticesData,
          syncData,
          validatedUser,
          classesData,
          assignmentsData,
          materialsData,
          forumData,
          groupsData,
          goalsData
        ] = await Promise.all([
          fetchOverview(),
          fetchSchools(),
          fetchResources(),
          fetchNotices(),
          fetchSyncQueue(),
          getCurrentUser(),
          fetchClasses(),
          fetchAssignments(),
          fetchMaterials(),
          fetchForumTopics(),
          fetchStudyGroups(),
          fetchStudentGoals()
        ]);

        setOverview(overviewData);
        setSchools(schoolsData);
        setClasses(classesData);
        setAssignments(assignmentsData);
        setMaterials(materialsData);
        setForumTopics(forumData);
        setStudyGroups(groupsData);
        setStudentGoals(goalsData);

        if (validatedUser) {
          setCurrentUser(validatedUser);
          const userRole = validatedUser.profile?.role === 'student' ? 'student' : 'teacher';
          setActiveRole(userRole);
          setCurrentTab(userRole === 'student' ? 'student_module' : 'teacher_module');
        }

        // Set initial school
        let initialSchool = schoolsData[0] || null;
        if (validatedUser?.profile?.school) {
          const userSchool = schoolsData.find(s => s.id === validatedUser.profile.school);
          if (userSchool) initialSchool = userSchool;
        }

        setCurrentSchool(initialSchool);
        setResources(resourcesData);
        setNotices(noticesData);
        setSyncQueue(syncData);

        if (initialSchool) {
          const [telemData, studentsData, ticketsData] = await Promise.all([
            fetchTelemetry(initialSchool.id),
            fetchStudents(initialSchool.id),
            fetchTickets(initialSchool.id)
          ]);
          setTelemetry(telemData);
          setStudents(studentsData);
          setTickets(ticketsData);
        }
      } catch (err) {
        console.error('Failed to load initial data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // When switching school
  const handleSelectSchool = async (school) => {
    setCurrentSchool(school);
    try {
      const [telemData, studentsData, ticketsData, classData, asgData, matData] = await Promise.all([
        fetchTelemetry(school.id),
        fetchStudents(school.id),
        fetchTickets(school.id),
        fetchClasses(school.id),
        fetchAssignments(school.id),
        fetchMaterials(school.id)
      ]);
      setTelemetry(telemData);
      setStudents(studentsData);
      setTickets(ticketsData);
      setClasses(classData);
      setAssignments(asgData);
      setMaterials(matData);
    } catch (err) {
      console.error('Error switching school', err);
    }
  };

  // Toggle network simulation (online, intermittent, offline)
  const handleToggleConnectivity = async (status) => {
    if (!currentSchool) return;
    const updated = await toggleSchoolConnectivity(currentSchool.id, status);
    if (updated) {
      setCurrentSchool(updated);
      setSchools(prev => prev.map(s => s.id === updated.id ? updated : s));
      setSyncBanner(`Simulated network state changed to: ${status.toUpperCase()}`);
      setTimeout(() => setSyncBanner(null), 3500);
    }
  };

  // Trigger sync of local edge queue to state educational portal
  const handleTriggerSync = async () => {
    if (!currentSchool || isSyncing) return;
    setIsSyncing(true);
    try {
      const res = await triggerSchoolSync(currentSchool.id);
      setSyncBanner(res.message || 'Offline queue synced successfully!');
      const [updatedOverview, updatedQueue] = await Promise.all([
        fetchOverview(),
        fetchSyncQueue()
      ]);
      setOverview(updatedOverview);
      setSyncQueue(updatedQueue);
    } catch (err) {
      setSyncBanner('Sync completed locally.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncBanner(null), 4000);
    }
  };

  // Role Switcher Handler (Teacher Mode <-> Student Mode)
  const handleToggleRole = (role) => {
    setActiveRole(role);
    if (role === 'teacher') {
      setCurrentTab('teacher_module');
      setSyncBanner('Switched to Teacher Module (2.3.1) - Google Meet, Assignment & Material Control');
    } else {
      setCurrentTab('student_module');
      setSyncBanner('Switched to Student Module (2.3.2) - Pomodoro Timer, Goal Notepad & AI Academic Tutor');
    }
    setTimeout(() => setSyncBanner(null), 3500);
  };

  // Teacher Module Handlers
  const handleScheduleClass = async (classData) => {
    try {
      const newClass = await createClass(classData);
      setClasses(prev => [newClass, ...prev]);
      setSyncBanner(`Google Meet Class "${newClass.title}" scheduled and synced with Google Calendar!`);
    } catch {
      setClasses(prev => [{ ...classData, id: Date.now() }, ...prev]);
      setSyncBanner('Class scheduled in local session.');
    }
    setTimeout(() => setSyncBanner(null), 4000);
  };

  const handleToggleClassStatus = async (classId, status) => {
    try {
      const updated = await toggleClassStatus(classId, status);
      setClasses(prev => prev.map(c => c.id === classId ? updated : c));
    } catch {
      setClasses(prev => prev.map(c => c.id === classId ? { ...c, status } : c));
    }
  };

  const handleCreateAssignment = async (assignmentData) => {
    try {
      const newAsg = await createAssignment(assignmentData);
      setAssignments(prev => [newAsg, ...prev]);
      setSyncBanner(`Assignment "${newAsg.title}" published with deadline ${newAsg.due_date}!`);
    } catch {
      setAssignments(prev => [{ ...assignmentData, id: Date.now(), submissions: [] }, ...prev]);
      setSyncBanner('Assignment created locally.');
    }
    setTimeout(() => setSyncBanner(null), 4000);
  };

  const handleGradeSubmission = async (submissionId, score, feedback) => {
    try {
      await gradeSubmission(submissionId, score, feedback);
      const updatedAsgs = await fetchAssignments(currentSchool?.id);
      setAssignments(updatedAsgs);
      setSyncBanner(`Awarded ${score} points with feedback to student!`);
    } catch {
      setSyncBanner('Grade recorded locally.');
    }
    setTimeout(() => setSyncBanner(null), 3500);
  };

  const handleUploadMaterial = async (matData) => {
    try {
      const created = await uploadMaterial(matData);
      setMaterials(prev => [created, ...prev]);
      setSyncBanner(`Class notes "${created.title}" uploaded to resource repository!`);
    } catch {
      setMaterials(prev => [{ ...matData, id: Date.now(), downloads_count: 0 }, ...prev]);
      setSyncBanner('Document uploaded to local cache.');
    }
    setTimeout(() => setSyncBanner(null), 3500);
  };

  const handleCreateTopic = async (topicData) => {
    try {
      const newTopic = await createForumTopic(topicData);
      setForumTopics(prev => [newTopic, ...prev]);
      setSyncBanner('Announcement published to student community!');
    } catch {
      setForumTopics(prev => [{ ...topicData, id: Date.now(), replies: [] }, ...prev]);
    }
    setTimeout(() => setSyncBanner(null), 3500);
  };

  const handleReplyTopic = async (topicId, replyData) => {
    try {
      const rep = await replyToForumTopic(topicId, replyData);
      setForumTopics(prev => prev.map(t => t.id === topicId ? { ...t, replies: [...(t.replies || []), rep] } : t));
      setSyncBanner('Reply posted with teacher endorsement!');
    } catch {
      setForumTopics(prev => prev.map(t => t.id === topicId ? { ...t, replies: [...(t.replies || []), { ...replyData, id: Date.now(), is_teacher_endorsed: true }] } : t));
    }
    setTimeout(() => setSyncBanner(null), 3500);
  };

  // Student Module Handlers
  const handleToggleGoal = async (goalId) => {
    try {
      const updated = await toggleStudentGoal(goalId);
      setStudentGoals(prev => prev.map(g => g.id === goalId ? updated : g));
    } catch {
      setStudentGoals(prev => prev.map(g => g.id === goalId ? { ...g, is_completed: !g.is_completed } : g));
    }
  };

  const handleCreateGoal = async (goalData) => {
    try {
      const created = await createStudentGoal(goalData);
      setStudentGoals(prev => [created, ...prev]);
      setSyncBanner('New academic goal added to your notepad!');
    } catch {
      setStudentGoals(prev => [{ ...goalData, id: Date.now() }, ...prev]);
    }
    setTimeout(() => setSyncBanner(null), 3000);
  };

  const handleSubmitAssignment = async (assignmentId, subData) => {
    try {
      await submitAssignment(assignmentId, subData);
      const updated = await fetchAssignments(currentSchool?.id);
      setAssignments(updated);
      setSyncBanner('Assignment submitted successfully! Waiting for teacher review.');
    } catch {
      setSyncBanner('Assignment submitted locally.');
    }
    setTimeout(() => setSyncBanner(null), 4000);
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const res = await joinStudyGroup(groupId);
      setStudyGroups(prev => prev.map(g => g.id === groupId ? { ...g, members_count: res.members_count } : g));
      setSyncBanner(res.message || 'Joined study mate circle!');
    } catch {
      setStudyGroups(prev => prev.map(g => g.id === groupId ? { ...g, members_count: g.members_count + 1 } : g));
      setSyncBanner('Joined study group!');
    }
    setTimeout(() => setSyncBanner(null), 3000);
  };

  // Curriculum Toggle Cache
  const handleToggleResourceCache = async (resourceId) => {
    const updated = await toggleResourceCache(resourceId);
    setResources(prev => prev.map(r => r.id === resourceId ? { ...r, is_cached_locally: !r.is_cached_locally } : r));
    setSyncBanner(
      updated.is_cached_locally 
        ? 'Module cached on local Raspberry Pi NVMe SSD for 0-bandwidth playback.' 
        : 'Module cache purged from edge server.'
    );
    setTimeout(() => setSyncBanner(null), 3500);
  };

  // Smart Attendance
  const handleMarkAttendance = async (data) => {
    await markSmartAttendance(data);
    const updatedStudents = await fetchStudents(currentSchool?.id);
    setStudents(updatedStudents);
  };

  // Hardware Ticket
  const handleCreateTicket = async (ticketData) => {
    const created = await createTicket(ticketData);
    setTickets(prev => [created, ...prev]);
    setSyncBanner(`Hardware ticket ${created.ticket_id} created and dispatched to block technician!`);
    setTimeout(() => setSyncBanner(null), 4000);
  };

  // Auth Handlers
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    const role = user.profile?.role === 'student' ? 'student' : 'teacher';
    setActiveRole(role);
    setCurrentTab(role === 'student' ? 'student_module' : 'teacher_module');
    setSyncBanner(`Welcome to Vidya Setu, ${user.profile?.full_name || user.username}! (Authenticated as ${user.profile?.role?.toUpperCase()})`);
    setTimeout(() => setSyncBanner(null), 4000);
    if (user.profile?.school) {
      const userSchool = schools.find(s => s.id === user.profile.school);
      if (userSchool) handleSelectSchool(userSchool);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setSyncBanner('You have been logged out successfully.');
    setTimeout(() => setSyncBanner(null), 3000);
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        currentSchool={currentSchool}
        schools={schools}
        onSelectSchool={handleSelectSchool}
        onToggleConnectivity={handleToggleConnectivity}
        onTriggerSync={handleTriggerSync}
        syncQueueCount={syncQueue.filter(q => q.status !== 'synced').length}
        isSyncing={isSyncing}
        language={language}
        onLanguageChange={setLanguage}
        currentUser={currentUser}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onNavigateTab={setCurrentTab}
      />

      {/* Live Rural Cluster Telemetry Ribbon */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(14, 165, 233, 0.12) 0%, rgba(249, 115, 22, 0.10) 50%, rgba(16, 185, 129, 0.12) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '6px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        fontSize: '0.74rem',
        color: 'var(--text-secondary)',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="live-pulse-dot"></span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>Cluster Hub:</span>
            <span>{currentSchool?.name || 'GSSS Khedla Smart Vidya Kendra'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#f59e0b', fontWeight: 800 }}>⚡ Solar Microgrid:</span>
            <span>{currentSchool?.solar_output_watts ? `${(currentSchool.solar_output_watts / 1000).toFixed(2)} kW` : '2.65 kW'} ({currentSchool?.battery_percentage || 92}% Storage)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#38bdf8', fontWeight: 800 }}>🌐 BharatNet Fiber:</span>
            <span>{currentSchool?.bandwidth_kbps ? `${(currentSchool.bandwidth_kbps / 1000).toFixed(1)} Mbps` : '5.2 Mbps'} ({currentSchool?.latency_ms || 38}ms Latency)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#4ade80', fontWeight: 800 }}>🍲 PM-POSHAN:</span>
            <span>268 Meals Served Today</span>
          </div>
        </div>

        {/* Quick Mode Jump Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Quick Jump:</span>
          <button
            onClick={() => setCurrentTab('teacher_module')}
            style={{
              background: currentTab === 'teacher_module' ? 'rgba(249, 115, 22, 0.25)' : 'transparent',
              color: currentTab === 'teacher_module' ? '#fb923c' : 'var(--text-secondary)',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px'
            }}
          >
            Teacher 2.3.1
          </button>
          <span>•</span>
          <button
            onClick={() => setCurrentTab('student_module')}
            style={{
              background: currentTab === 'student_module' ? 'rgba(2, 132, 199, 0.25)' : 'transparent',
              color: currentTab === 'student_module' ? '#38bdf8' : 'var(--text-secondary)',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px'
            }}
          >
            Student 2.3.2
          </button>
          <span>•</span>
          <button
            onClick={() => setCurrentTab('braille')}
            style={{
              background: currentTab === 'braille' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
              color: currentTab === 'braille' ? '#f59e0b' : 'var(--text-secondary)',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px'
            }}
          >
            Braille Studio
          </button>
          <span>•</span>
          <button
            onClick={() => setCurrentTab('enterprise')}
            style={{
              background: currentTab === 'enterprise' ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
              color: currentTab === 'enterprise' ? '#c084fc' : 'var(--text-secondary)',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px'
            }}
          >
            ERP 3.3-3.25
          </button>
        </div>
      </div>

      {/* Sync / Alert Banner Notification */}
      {syncBanner && (
        <div style={{
          background: 'linear-gradient(90deg, #0284c7, #2563eb)',
          color: '#ffffff',
          padding: '8px 24px',
          fontSize: '0.82rem',
          fontWeight: 600,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {syncBanner}
        </div>
      )}

      {/* Main Layout */}
      <div className="main-layout">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          school={currentSchool}
          activeRole={activeRole}
          onToggleRole={handleToggleRole}
        />

        <main className="content-area">
          {/* SECTION 2.3.1: TEACHER MODULE */}
          {currentTab === 'teacher_module' && (
            <TeacherModule
              classes={classes}
              assignments={assignments}
              materials={materials}
              forumTopics={forumTopics}
              school={currentSchool}
              onScheduleClass={handleScheduleClass}
              onToggleClassStatus={handleToggleClassStatus}
              onCreateAssignment={handleCreateAssignment}
              onGradeSubmission={handleGradeSubmission}
              onUploadMaterial={handleUploadMaterial}
              onCreateTopic={handleCreateTopic}
              onReplyTopic={handleReplyTopic}
              currentUser={currentUser}
            />
          )}

          {/* SECTION 2.3.2: STUDENT MODULE */}
          {currentTab === 'student_module' && (
            <StudentModule
              classes={classes}
              assignments={assignments}
              goals={studentGoals}
              studyGroups={studyGroups}
              forumTopics={forumTopics}
              school={currentSchool}
              onToggleGoal={handleToggleGoal}
              onCreateGoal={handleCreateGoal}
              onSubmitAssignment={handleSubmitAssignment}
              onJoinGroup={handleJoinGroup}
              onAskAITutor={askAITutor}
              currentUser={currentUser}
            />
          )}

          {/* BRAILLE LEARNING & ASSISTIVE STUDIO */}
          {currentTab === 'braille' && (
            <BrailleLearningStudio
              school={currentSchool}
              currentUser={currentUser}
            />
          )}

          {/* ENTERPRISE MANAGEMENT & GOVERNANCE (3.3 - 3.25) */}
          {currentTab === 'enterprise' && (
            <EnterpriseManagement
              school={currentSchool}
              schools={schools}
              currentUser={currentUser}
            />
          )}

          {/* CLUSTER OVERVIEW */}
          {currentTab === 'overview' && (
            <OverviewDashboard
              overview={overview}
              schools={schools}
              currentSchool={currentSchool}
              onSelectSchool={handleSelectSchool}
              onNavigateTab={setCurrentTab}
              onTriggerSync={handleTriggerSync}
            />
          )}

          {/* SMART CLASSROOM */}
          {currentTab === 'classroom' && (
            <SmartClassroom
              resources={resources}
              school={currentSchool}
              onNavigateTab={setCurrentTab}
            />
          )}

          {/* SOLAR & IOT GRID */}
          {currentTab === 'infrastructure' && (
            <SchoolInfrastructure
              school={currentSchool}
              telemetry={telemetry}
              tickets={tickets}
              onCreateTicket={handleCreateTicket}
              onRefresh={async () => {
                const telem = await fetchTelemetry(currentSchool?.id);
                setTelemetry(telem);
              }}
            />
          )}

          {/* CURRICULUM REPOSITORY */}
          {currentTab === 'curriculum' && (
            <CurriculumRepository
              resources={resources}
              onToggleCache={handleToggleResourceCache}
              onSelectLesson={(lesson) => {
                setCurrentTab('classroom');
              }}
              onNavigateTab={setCurrentTab}
            />
          )}

          {/* SMART ATTENDANCE */}
          {currentTab === 'attendance' && (
            <StudentAttendance
              students={students}
              school={currentSchool}
              onMarkAttendance={handleMarkAttendance}
              onTriggerSync={handleTriggerSync}
            />
          )}

          {/* GRAM PANCHAYAT & VILLAGE HUB */}
          {currentTab === 'community' && (
            <VillageCommunity
              school={currentSchool}
              notices={notices}
            />
          )}
        </main>
      </div>

      {/* Auth Modal (Login & Register) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
        schools={schools}
      />
    </div>
  );
}
