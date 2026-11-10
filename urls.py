from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SchoolViewSet,
    DeviceTelemetryViewSet,
    LearningResourceViewSet,
    StudentViewSet,
    AttendanceRecordViewSet,
    MaintenanceTicketViewSet,
    CommunityNoticeViewSet,
    SyncQueueViewSet,
    LiveClassViewSet,
    AssignmentViewSet,
    AssignmentSubmissionViewSet,
    ClassStudyMaterialViewSet,
    ForumTopicViewSet,
    StudyMateGroupViewSet,
    StudentGoalViewSet,
    BrailleLessonViewSet,
    BrailleProgressViewSet,
    RolePermissionMatrixViewSet,
    TeacherProfileViewSet,
    ParentProfileViewSet,
    ParentMeetingNoticeViewSet,
    ParentCommunicationViewSet,
    AcademicClassViewSet,
    SubjectViewSet,
    CourseAllocationViewSet,
    OnlineDigitalCourseViewSet,
    OfflineContentPackageViewSet,
    SmartClassroomEquipmentViewSet,
    TeacherAttendanceViewSet,
    OnlineExamViewSet,
    ExamQuestionViewSet,
    ExamResultViewSet,
    StudentReportCardViewSet,
    ConnectivityAuditViewSet,
    ScholarshipSchemeViewSet,
    ScholarshipApplicationViewSet,
    BroadcastNotificationViewSet,
    GrievanceTicketViewSet,
    GeneratedReportViewSet,
    SystemConfigurationViewSet,
    AuditTrailLogViewSet,
    platform_overview,
    register_user,
    login_user,
    current_user,
    logout_user,
    ai_tutor_chat,
    translate_to_braille,
    enterprise_analytics
)

router = DefaultRouter()
router.register(r'schools', SchoolViewSet)
router.register(r'telemetry', DeviceTelemetryViewSet)
router.register(r'resources', LearningResourceViewSet)
router.register(r'students', StudentViewSet)
router.register(r'attendance', AttendanceRecordViewSet)
router.register(r'tickets', MaintenanceTicketViewSet)
router.register(r'notices', CommunityNoticeViewSet)
router.register(r'sync-queue', SyncQueueViewSet)
router.register(r'classes', LiveClassViewSet)
router.register(r'assignments', AssignmentViewSet)
router.register(r'submissions', AssignmentSubmissionViewSet)
router.register(r'materials', ClassStudyMaterialViewSet)
router.register(r'forum', ForumTopicViewSet)
router.register(r'study-groups', StudyMateGroupViewSet)
router.register(r'goals', StudentGoalViewSet)
router.register(r'braille/lessons', BrailleLessonViewSet)
router.register(r'braille/progress', BrailleProgressViewSet)

# 3.3 to 3.25 Enterprise Router Registrations
router.register(r'enterprise/rbac', RolePermissionMatrixViewSet)
router.register(r'enterprise/teachers', TeacherProfileViewSet)
router.register(r'enterprise/parents', ParentProfileViewSet)
router.register(r'enterprise/parent-meetings', ParentMeetingNoticeViewSet)
router.register(r'enterprise/parent-messages', ParentCommunicationViewSet)
router.register(r'enterprise/classes', AcademicClassViewSet)
router.register(r'enterprise/subjects', SubjectViewSet)
router.register(r'enterprise/course-allocations', CourseAllocationViewSet)
router.register(r'enterprise/online-courses', OnlineDigitalCourseViewSet)
router.register(r'enterprise/offline-packages', OfflineContentPackageViewSet)
router.register(r'enterprise/smart-equipment', SmartClassroomEquipmentViewSet)
router.register(r'enterprise/teacher-attendance', TeacherAttendanceViewSet)
router.register(r'enterprise/exams', OnlineExamViewSet)
router.register(r'enterprise/exam-questions', ExamQuestionViewSet)
router.register(r'enterprise/exam-results', ExamResultViewSet)
router.register(r'enterprise/report-cards', StudentReportCardViewSet)
router.register(r'enterprise/connectivity-audit', ConnectivityAuditViewSet)
router.register(r'enterprise/scholarships', ScholarshipSchemeViewSet)
router.register(r'enterprise/scholarship-applications', ScholarshipApplicationViewSet)
router.register(r'enterprise/broadcast-notifications', BroadcastNotificationViewSet)
router.register(r'enterprise/grievances', GrievanceTicketViewSet)
router.register(r'enterprise/generated-reports', GeneratedReportViewSet)
router.register(r'enterprise/system-configs', SystemConfigurationViewSet)
router.register(r'enterprise/audit-logs', AuditTrailLogViewSet)

urlpatterns = [
    # Auth Endpoints
    path('auth/register/', register_user, name='auth-register'),
    path('auth/login/', login_user, name='auth-login'),
    path('auth/me/', current_user, name='auth-me'),
    path('auth/logout/', logout_user, name='auth-logout'),

    # AI Tutor Chatbot Endpoint
    path('ai-tutor/chat/', ai_tutor_chat, name='ai-tutor-chat'),

    # Braille Live Translation Endpoint
    path('braille/translate/', translate_to_braille, name='braille-translate'),

    # 3.22 Comprehensive Analytics Engine Endpoint
    path('enterprise/analytics/', enterprise_analytics, name='enterprise-analytics'),

    # Platform Overview
    path('overview/', platform_overview, name='platform-overview'),
    path('', include(router.urls)),
]
