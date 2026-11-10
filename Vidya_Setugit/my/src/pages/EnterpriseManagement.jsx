import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Tv, 
  Wifi, 
  Award, 
  MessageSquare, 
  Bell, 
  AlertTriangle, 
  BarChart3, 
  FileText, 
  Settings, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Send, 
  RefreshCw, 
  Layers, 
  Eye, 
  Database, 
  Sliders, 
  TrendingUp, 
  Zap, 
  Check, 
  Sparkles
} from 'lucide-react';
import { 
  fetchEnterpriseAnalytics,
  fetchRBAC,
  fetchTeachers,
  fetchParents,
  fetchAcademicClasses,
  fetchSubjects,
  fetchCourseAllocations,
  fetchOnlineCourses,
  fetchOfflinePackages,
  fetchSmartEquipment,
  fetchTeacherAttendance,
  fetchOnlineExams,
  fetchStudentReportCards,
  fetchConnectivityAuditMetrics,
  fetchScholarships,
  fetchScholarshipApplications,
  approveScholarshipApp,
  disburseScholarshipDBT,
  fetchParentMeetings,
  fetchParentMessages,
  fetchBroadcastNotifications,
  createBroadcastNotification,
  fetchGrievanceTickets,
  resolveGrievanceTicket,
  fetchGeneratedReports,
  triggerGenerateReport,
  fetchSystemConfigurations,
  fetchAuditLogs
} from '../services/api';

export default function EnterpriseManagement({ school, schools = [], currentUser }) {
  const [activeSection, setActiveSection] = useState('analytics'); // analytics, rbac, teachers, classes, allocation, learning, smart_equipment, attendance, exams, connectivity, scholarships, parent_portal, notifications, grievances, reports, system_admin
  
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [rbacList, setRbacList] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [parents, setParents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [onlineCourses, setOnlineCourses] = useState([]);
  const [offlinePackages, setOfflinePackages] = useState([]);
  const [smartEquipment, setSmartEquipment] = useState([]);
  const [teacherAttendance, setTeacherAttendance] = useState([]);
  const [exams, setExams] = useState([]);
  const [reportCards, setReportCards] = useState([]);
  const [connectivityLogs, setConnectivityLogs] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [scholarshipApps, setScholarshipApps] = useState([]);
  const [parentMeetings, setParentMeetings] = useState([]);
  const [parentMessages, setParentMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [reports, setReports] = useState([]);
  const [systemConfigs, setSystemConfigs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Action states
  const [actionSuccess, setActionSuccess] = useState(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState(school?.id || 1);
  const [newNotifTitle, setNewNotifTitle] = useState('');
  const [newNotifMsg, setNewNotifMsg] = useState('');
  const [newNotifAudience, setNewNotifAudience] = useState('all');
  const [newNotifPriority, setNewNotifPriority] = useState('normal');

  useEffect(() => {
    loadAllData();
  }, [selectedSchoolId]);

  async function loadAllData() {
    setLoading(true);
    try {
      const [
        analyticsData,
        rbacData,
        teachersData,
        parentsData,
        classesData,
        subjectsData,
        allocationsData,
        onlineData,
        offlineData,
        equipmentData,
        tAttendanceData,
        examsData,
        reportCardsData,
        connectivityData,
        scholarshipsData,
        scholarshipAppsData,
        parentMeetingsData,
        parentMessagesData,
        notificationsData,
        grievancesData,
        reportsData,
        configsData,
        auditLogsData
      ] = await Promise.all([
        fetchEnterpriseAnalytics(),
        fetchRBAC(),
        fetchTeachers(selectedSchoolId),
        fetchParents(),
        fetchAcademicClasses(selectedSchoolId),
        fetchSubjects(),
        fetchCourseAllocations(selectedSchoolId),
        fetchOnlineCourses(),
        fetchOfflinePackages(selectedSchoolId),
        fetchSmartEquipment(selectedSchoolId),
        fetchTeacherAttendance(selectedSchoolId),
        fetchOnlineExams(selectedSchoolId),
        fetchStudentReportCards(),
        fetchConnectivityAuditMetrics(selectedSchoolId),
        fetchScholarships(),
        fetchScholarshipApplications(),
        fetchParentMeetings(selectedSchoolId),
        fetchParentMessages(),
        fetchBroadcastNotifications(selectedSchoolId),
        fetchGrievanceTickets(selectedSchoolId),
        fetchGeneratedReports(selectedSchoolId),
        fetchSystemConfigurations(),
        fetchAuditLogs()
      ]);

      setAnalytics(analyticsData);
      setRbacList(rbacData);
      setTeachers(teachersData);
      setParents(parentsData);
      setClasses(classesData);
      setSubjects(subjectsData);
      setAllocations(allocationsData);
      setOnlineCourses(onlineData);
      setOfflinePackages(offlineData);
      setSmartEquipment(equipmentData);
      setTeacherAttendance(tAttendanceData);
      setExams(examsData);
      setReportCards(reportCardsData);
      setConnectivityLogs(connectivityData);
      setScholarships(scholarshipsData);
      setScholarshipApps(scholarshipAppsData);
      setParentMeetings(parentMeetingsData);
      setParentMessages(parentMessagesData);
      setNotifications(notificationsData);
      setGrievances(grievancesData);
      setReports(reportsData);
      setSystemConfigs(configsData);
      setAuditLogs(auditLogsData);
    } catch (err) {
      console.error('Error loading enterprise hub data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Scholarship DBT Disbursal
  async function handleDisburseDBT(appId) {
    try {
      await disburseScholarshipDBT(appId);
      setActionSuccess(`DBT funds successfully disbursed via RBI automated gateway!`);
      loadAllData();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      alert('Failed to disburse scholarship: ' + err.message);
    }
  }

  // Handle Grievance Resolution
  async function handleResolveGrievance(ticketId) {
    const notes = prompt("Enter resolution notes / action taken:", "Verified on site by Block Education Officer. Issue fully rectified.");
    if (!notes) return;
    try {
      await resolveGrievanceTicket(ticketId, notes);
      setActionSuccess(`Grievance ${ticketId} resolved and logged to Audit Trail!`);
      loadAllData();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      alert('Failed to resolve grievance: ' + err.message);
    }
  }

  // Handle Report Generation
  async function handleGenerateReport(type) {
    try {
      await triggerGenerateReport({
        school: selectedSchoolId,
        report_type: type,
        format: 'PDF'
      });
      setActionSuccess(`Compliance report successfully compiled and saved to database!`);
      loadAllData();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      alert('Failed to generate report: ' + err.message);
    }
  }

  // Handle Broadcast Notification
  async function handleSendNotification(e) {
    e.preventDefault();
    if (!newNotifTitle || !newNotifMsg) return;
    try {
      await createBroadcastNotification({
        school: selectedSchoolId,
        title: newNotifTitle,
        message: newNotifMsg,
        target_audience: newNotifAudience,
        priority: newNotifPriority,
        channels: ['in_app', 'sms']
      });
      setNewNotifTitle('');
      setNewNotifMsg('');
      setActionSuccess(`Broadcast notification successfully queued for dispatch!`);
      loadAllData();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      alert('Failed to dispatch notification: ' + err.message);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* COMMAND CENTER HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
            color: '#fff'
          }}>
            <Database size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Enterprise Operations & Governance Command Center
              </h1>
              <span style={{
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 700
              }}>
                Sections 3.3 — 3.25 Operational
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: '4px 0 0' }}>
              District & Cluster Administration: Role-Based Access, Course Allocations, Smart Hardware IoT, DBT Scholarships, Grievances & UDISE+ Compliance.
            </p>
          </div>
        </div>

        {/* CLUSTER SELECTION & REFRESH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={selectedSchoolId}
            onChange={(e) => setSelectedSchoolId(Number(e.target.value))}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {schools.map(s => (
              <option key={s.id} value={s.id} style={{ background: '#1e293b' }}>
                {s.name} ({s.village})
              </option>
            ))}
          </select>

          <button
            onClick={loadAllData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            Sync Cluster
          </button>
        </div>
      </div>

      {/* SUCCESS NOTIFICATION TOAST */}
      {actionSuccess && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '8px',
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.4)',
          color: '#4ade80',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* NAVIGATION SUB-TABS (Sections 3.3 to 3.25) */}
      <div style={{
        display: 'flex',
        gap: '6px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '8px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'analytics', label: '3.22 Analytics Dashboard', icon: BarChart3 },
          { id: 'rbac', label: '3.3 RBAC Permissions', icon: Shield },
          { id: 'teachers', label: '3.6 Teacher Management', icon: GraduationCap },
          { id: 'classes', label: '3.8 Class & Subjects', icon: BookOpen },
          { id: 'allocation', label: '3.9 Course Allocation Engine', icon: Calendar },
          { id: 'learning', label: '3.10/3.11 Online & Offline Edge', icon: Zap },
          { id: 'smart_equipment', label: '3.12 Smart Hardware & IoT', icon: Tv },
          { id: 'attendance', label: '3.13 Teacher Attendance', icon: Clock },
          { id: 'exams', label: '3.15/3.16 Exams & Report Cards', icon: Award },
          { id: 'connectivity', label: '3.17 Connectivity Monitor', icon: Wifi },
          { id: 'scholarships', label: '3.18 Scholarships & DBT', icon: TrendingUp },
          { id: 'parent_portal', label: '3.19 Parent Portal & PTM', icon: Users },
          { id: 'notifications', label: '3.20 Broadcast Notifications', icon: Bell },
          { id: 'grievances', label: '3.21 Grievance Redressal', icon: AlertTriangle },
          { id: 'reports', label: '3.23 Report Generation (UDISE+)', icon: FileText },
          { id: 'system_admin', label: '3.24/3.25 System Admin & Audit', icon: Sliders }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeSection === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSection(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 14px',
                borderRadius: '8px',
                background: isActive ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'var(--bg-surface)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: isActive ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                fontSize: '0.78rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 3.22 ANALYTICS DASHBOARD & KPI OVERVIEW                      */}
      {/* ============================================================ */}
      {activeSection === 'analytics' && analytics && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* TOP METRIC CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Cluster Total Enrollment', val: analytics.cluster_summary.total_students, sub: `Student/Teacher: ${analytics.cluster_summary.student_teacher_ratio}:1`, color: '#38bdf8', icon: Users },
              { label: 'Girls Enrollment Ratio', val: `${analytics.cluster_summary.female_ratio_percent}%`, sub: 'Beti Bachao Beti Padhao Metric', color: '#f59e0b', icon: Award },
              { label: 'Cluster Attendance Rate', val: `${analytics.cluster_summary.attendance_rate_cluster}%`, sub: `${analytics.cluster_summary.midday_meal_served_today} PM-POSHAN meals served`, color: '#4ade80', icon: CheckCircle2 },
              { label: 'Total Solar Clean Energy', val: `${analytics.solar_energy_iot.total_solar_kw} kW`, sub: `${analytics.solar_energy_iot.co2_saved_kg_monthly} kg CO2 avoided/mo`, color: '#facc15', icon: Zap },
              { label: 'DBT Funds Disbursed', val: `₹${analytics.scholarships_dbt.total_funds_disbursed_inr.toLocaleString()}`, sub: `${analytics.scholarships_dbt.disbursed_count} scholars credited`, color: '#c084fc', icon: TrendingUp }
            ].map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: `${m.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={22} color={m.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.label}</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {m.val}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: m.color, marginTop: '2px' }}>{m.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* EARLY WARNING DROPOUT PREDICTION */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              NEP 2020 Predictive Dropout Risk Early Warning Engine (ड्रॉपआउट रोकथाम चेतावनी)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {analytics.dropout_risk_early_warning.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: idx === 0 ? '#f87171' : idx === 1 ? '#fb923c' : '#4ade80' }}>
                    {item.category}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {item.students_count} Students
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Intervention: <strong>{item.action}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3.3 ROLE-BASED ACCESS CONTROL MATRIX                         */}
      {/* ============================================================ */}
      {activeSection === 'rbac' && (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
            Role-Based Access Control (RBAC) Permission Matrix (3.3)
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Role Title</th>
                  <th style={{ padding: '12px' }}>Manage Schools</th>
                  <th style={{ padding: '12px' }}>Manage Users</th>
                  <th style={{ padding: '12px' }}>Allocate Courses</th>
                  <th style={{ padding: '12px' }}>Conduct Exams</th>
                  <th style={{ padding: '12px' }}>Approve DBT Scholarships</th>
                  <th style={{ padding: '12px' }}>Audit Trail Logs</th>
                  <th style={{ padding: '12px' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {rbacList.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#38bdf8' }}>{r.role_display}</td>
                    <td style={{ padding: '12px' }}>{r.can_manage_schools ? <Check color="#4ade80" size={16} /> : <XCircle color="#64748b" size={16} />}</td>
                    <td style={{ padding: '12px' }}>{r.can_manage_users ? <Check color="#4ade80" size={16} /> : <XCircle color="#64748b" size={16} />}</td>
                    <td style={{ padding: '12px' }}>{r.can_allocate_courses ? <Check color="#4ade80" size={16} /> : <XCircle color="#64748b" size={16} />}</td>
                    <td style={{ padding: '12px' }}>{r.can_conduct_exams ? <Check color="#4ade80" size={16} /> : <XCircle color="#64748b" size={16} />}</td>
                    <td style={{ padding: '12px' }}>{r.can_approve_scholarships ? <Check color="#4ade80" size={16} /> : <XCircle color="#64748b" size={16} />}</td>
                    <td style={{ padding: '12px' }}>{r.can_view_audit_logs ? <Check color="#4ade80" size={16} /> : <XCircle color="#64748b" size={16} />}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.74rem' }}>{r.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3.6 TEACHER MANAGEMENT                                       */}
      {/* ============================================================ */}
      {activeSection === 'teachers' && (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
            Teacher Management & Faculty Directory (3.6)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {teachers.map(t => (
              <div
                key={t.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{t.name}</h4>
                    <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>{t.employee_id} • {t.designation}</span>
                  </div>
                  <span style={{
                    background: t.is_active ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: t.is_active ? '#4ade80' : '#f87171',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.68rem',
                    fontWeight: 700
                  }}>
                    {t.is_active ? 'Active' : 'On Leave'}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Specialization: <strong>{t.specialization}</strong> ({t.qualification})
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Assigned: <strong>{t.assigned_grades}</strong> • Phone: {t.phone_number}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3.8 CLASS & SUBJECT MANAGEMENT                               */}
      {/* ============================================================ */}
      {activeSection === 'classes' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              Academic Classes & Sections (3.8)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {classes.map(c => (
                <div
                  key={c.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    padding: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#38bdf8' }}>Grade {c.grade}-{c.section}</strong>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Room: {c.room_number} • Class Teacher: {c.class_teacher}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>
                    {c.total_students_enrolled} Enrolled
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              Curriculum Subjects & Standards
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {subjects.map(s => (
                <div
                  key={s.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    padding: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#f8fafc' }}>[{s.code}] {s.name}</strong>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {s.total_chapters} Chapters • {s.practical_sessions} Practical Labs
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Grade {s.grade}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3.9 COURSE ALLOCATION ENGINE                                 */}
      {/* ============================================================ */}
      {activeSection === 'allocation' && (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
            Course Allocation Engine & Weekly Timetables (3.9)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {allocations.map(al => (
              <div
                key={al.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  padding: '18px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <strong style={{ fontSize: '1rem', color: '#38bdf8' }}>{al.teacher_name}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                      Teaching <strong>{al.subject_name}</strong> ({al.class_label})
                    </span>
                  </div>
                  <span style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: '#38bdf8',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}>
                    {al.periods_per_week} Periods / Week
                  </span>
                </div>

                {/* TIMETABLE SLOTS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
                  {al.timetable_slots.map((ts, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>{ts.day} (P{ts.period})</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{ts.time}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{ts.room}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3.10 & 3.11 ONLINE & OFFLINE LEARNING MODULES                */}
      {/* ============================================================ */}
      {activeSection === 'learning' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* ONLINE DIGITAL COURSES */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              Online Learning Module (3.10)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {onlineCourses.map(oc => (
                <div
                  key={oc.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{oc.title}</h4>
                    {oc.is_live_stream_active && (
                      <span style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.65rem',
                        fontWeight: 800
                      }}>
                        LIVE NOW
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Instructor: {oc.instructor_name} • {oc.enrolled_students_count} Students
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OFFLINE RPI EDGE PACKS */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              Offline Edge Learning Module (3.11)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {offlinePackages.map(pkg => (
                <div
                  key={pkg.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px'
                  }}
                >
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: '#38bdf8' }}>{pkg.package_name}</h4>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Size: {pkg.total_size_mb} MB • {pkg.offline_video_count} Videos • {pkg.offline_pdf_count} Worksheets
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#4ade80', marginTop: '6px' }}>
                    Target: {pkg.edge_device_target}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3.12 SMART CLASSROOM HARDWARE & IOT                          */}
      {/* ============================================================ */}
      {activeSection === 'smart_equipment' && (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
            Smart Classroom Hardware & IoT Telemetry (3.12)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {smartEquipment.map(eq => (
              <div
                key={eq.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{eq.room_name}</h4>
                  <span style={{
                    background: eq.health_status === 'healthy' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: eq.health_status === 'healthy' ? '#4ade80' : '#f87171',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.68rem',
                    fontWeight: 700
                  }}>
                    {eq.health_status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#38bdf8' }}>
                  {eq.equipment_type_display}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Model: {eq.brand_model} • Power: {eq.power_consumption_watts}W
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  S/N: {eq.serial_number} • Vendor: {eq.amc_vendor}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3.13 ATTENDANCE MANAGEMENT (TEACHER ATTENDANCE)              */}
      {/* ============================================================ */}
      {activeSection === 'attendance' && (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
            Biometric Teacher & Faculty Attendance (3.13)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Faculty Name</th>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>Check-In</th>
                <th style={{ padding: '10px' }}>Check-Out</th>
                <th style={{ padding: '10px' }}>Method</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {teacherAttendance.map(ta => (
                <tr key={ta.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{ta.teacher_name}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{ta.date}</td>
                  <td style={{ padding: '12px', color: '#4ade80' }}>{ta.check_in_time}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{ta.check_out_time}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.72rem' }}>{ta.verification_method}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      background: 'rgba(34, 197, 94, 0.15)',
                      color: '#4ade80',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.68rem',
                      fontWeight: 700
                    }}>
                      {ta.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3.15 & 3.16 EXAMS, QUIZZES & STUDENT REPORT CARDS            */}
      {/* ============================================================ */}
      {activeSection === 'exams' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* EXAMS */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              Online Examinations & Quizzes (3.15)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {exams.map(ex => (
                <div
                  key={ex.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px'
                  }}
                >
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{ex.title}</h4>
                  <div style={{ fontSize: '0.74rem', color: '#38bdf8', marginTop: '4px' }}>
                    Subject: {ex.subject} (Class {ex.grade}) • Marks: {ex.total_marks} ({ex.duration_mins} mins)
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Questions: {ex.questions_count || 2} Curated • Type: {ex.exam_type.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REPORT CARDS */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              Student Progress Tracking (Report Cards 3.16)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reportCards.map(rc => (
                <div
                  key={rc.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#f59e0b' }}>{rc.student_name}</h4>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#4ade80' }}>{rc.overall_percentage}%</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Class Rank: #{rc.class_rank} • Attendance: {rc.attendance_percentage}% • {rc.term}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Remarks: <em>"{rc.teacher_remarks}"</em>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3.17 INTERNET CONNECTIVITY MONITORING                        */}
      {/* ============================================================ */}
      {activeSection === 'connectivity' && (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
            Internet Connectivity & BharatNet Telemetry (3.17)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {connectivityLogs.map(log => (
              <div
                key={log.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#38bdf8' }}>{log.interface}</h4>
                  <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 700 }}>
                    {log.uptime_percentage_30days}% Uptime
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                  Latency: <strong>{log.ping_latency_ms} ms</strong> • Packet Loss: {log.packet_loss_percentage}%
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Download: {log.download_speed_kbps / 1000} Mbps • Upload: {log.upload_speed_kbps / 1000} Mbps
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3.18 SCHOLARSHIP MANAGEMENT & DBT DISBURSAL                  */}
      {/* ============================================================ */}
      {activeSection === 'scholarships' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              Direct Benefit Transfer (DBT) Scholarship Applications (3.18)
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Application #</th>
                  <th style={{ padding: '10px' }}>Student</th>
                  <th style={{ padding: '10px' }}>Scholarship Scheme</th>
                  <th style={{ padding: '10px' }}>Amount</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scholarshipApps.map(app => (
                  <tr key={app.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#38bdf8' }}>{app.application_number}</td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{app.student_name}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{app.scholarship_name}</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#f59e0b' }}>₹{app.scholarship_amount.toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: app.verification_stage === 'dbt_disbursed' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                        color: app.verification_stage === 'dbt_disbursed' ? '#4ade80' : '#fb923c',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.68rem',
                        fontWeight: 700
                      }}>
                        {app.verification_stage.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {app.verification_stage !== 'dbt_disbursed' && (
                        <button
                          onClick={() => handleDisburseDBT(app.id)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: '#10b981',
                            color: '#fff',
                            border: 'none',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Disburse DBT
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3.19 PARENT PORTAL & PTM MANAGEMENT                          */}
      {/* ============================================================ */}
      {activeSection === 'parent_portal' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              Parent-Teacher Meetings (PTM) Notices (3.19)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {parentMeetings.map(pm => (
                <div
                  key={pm.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px'
                  }}
                >
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#38bdf8' }}>{pm.title}</h4>
                  <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '4px' }}>
                    Scheduled: {pm.meeting_date} ({pm.venue})
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Agenda: {pm.agenda} • {pm.sms_dispatched_count} Parents Alerted
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              Parent-Teacher Vernacular Messages
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {parentMessages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4ade80' }}>{msg.subject}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '4px 0' }}>
                    From: {msg.teacher_name} ➔ To: {msg.parent_name} (re: {msg.student_name})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    "{msg.body}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3.20 BROADCAST NOTIFICATION DISPATCHER                       */}
      {/* ============================================================ */}
      {activeSection === 'notifications' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              Recent Broadcast Circulars & Emergency Alerts (3.20)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.map(n => (
                <div
                  key={n.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: n.priority === 'urgent' ? '#f87171' : '#f8fafc' }}>
                      {n.title}
                    </h4>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#38bdf8' }}>
                      Audience: {n.target_audience.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '6px 0 0' }}>
                    {n.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendNotification} style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#38bdf8' }}>
              Send Instant Broadcast Alert
            </h4>
            <input
              type="text"
              placeholder="Notice Title (e.g. Winter Break / Weather Alert)"
              value={newNotifTitle}
              onChange={(e) => setNewNotifTitle(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '6px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.82rem'
              }}
            />
            <textarea
              placeholder="Full vernacular notification message for SMS & In-App broadcast..."
              rows={4}
              value={newNotifMsg}
              onChange={(e) => setNewNotifMsg(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '6px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.82rem'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Dispatch Multichannel Broadcast
            </button>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3.21 GRIEVANCE REDRESSAL & FEEDBACK                          */}
      {/* ============================================================ */}
      {activeSection === 'grievances' && (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
            Grievance Redressal & Citizen Feedback Registry (3.21)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {grievances.map(grv => (
              <div
                key={grv.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8' }}>{grv.ticket_number}</span>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '2px 0 0', color: 'var(--text-primary)' }}>{grv.subject}</h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Category: {grv.category_display} • By {grv.complainant_name} ({grv.complainant_role})
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      background: grv.status === 'resolved' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                      color: grv.status === 'resolved' ? '#4ade80' : '#fb923c',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontSize: '0.68rem',
                      fontWeight: 700
                    }}>
                      {grv.status.toUpperCase()}
                    </span>
                    {grv.status !== 'resolved' && (
                      <button
                        onClick={() => handleResolveGrievance(grv.id)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#0284c7',
                          color: '#fff',
                          border: 'none',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {grv.description}
                </p>
                {grv.resolution_notes && (
                  <div style={{
                    marginTop: '4px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    fontSize: '0.72rem',
                    color: '#4ade80'
                  }}>
                    Action Taken: <strong>{grv.resolution_notes}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3.23 REPORT GENERATION (UDISE+ & PM-POSHAN)                  */}
      {/* ============================================================ */}
      {activeSection === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Automated Government Compliance & Statutory Reports (3.23)
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleGenerateReport('udise_plus')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Generate UDISE+ PDF
                </button>
                <button
                  onClick={() => handleGenerateReport('midday_meal_monthly')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: '#f59e0b',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Generate POSHAN Excel
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reports.map(rep => (
                <div
                  key={rep.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{rep.title}</h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Period: {rep.period} • Size: {rep.file_size_kb} KB • Author: {rep.generated_by}
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`Downloading verified export: ${rep.title}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      color: '#38bdf8',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={13} />
                    Download {rep.format_type}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3.24 & 3.25 SYSTEM CONFIGURATION & AUDIT TRAIL LOGS          */}
      {/* ============================================================ */}
      {activeSection === 'system_admin' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
          {/* SYSTEM CONFIGURATION */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              System Configurations (3.24)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {systemConfigs.map(sc => (
                <div
                  key={sc.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    padding: '12px'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8' }}>{sc.config_key}</div>
                  <div style={{ fontSize: '0.75rem', color: '#f59e0b', margin: '2px 0' }}>{sc.config_value}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{sc.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AUDIT LOGS */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              Immutable Audit Trail Logs (3.25)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {auditLogs.map(log => (
                <div
                  key={log.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    padding: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.78rem', color: '#4ade80' }}>[{log.action}] {log.target_model}</strong>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : ''}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: '4px 0' }}>
                    {log.description}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    Actor: {log.user_name} ({log.user_role}) • IP: {log.ip_address}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
