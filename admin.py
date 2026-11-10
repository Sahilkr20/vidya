from django.contrib import admin
from .models import (
    School,
    DeviceTelemetry,
    LearningResource,
    Student,
    AttendanceRecord,
    MaintenanceTicket,
    CommunityNotice,
    SyncQueueItem,
    UserProfile,
    LiveClassSession,
    Assignment,
    AssignmentSubmission,
    ClassStudyMaterial,
    ForumTopic,
    ForumReply,
    StudyMateGroup,
    StudentGoal,
    BrailleLesson,
    BraillePracticeQuiz,
    BrailleStudentProgress,
    RolePermissionMatrix,
    TeacherProfile,
    ParentProfile,
    ParentMeetingNotice,
    ParentCommunication,
    AcademicClass,
    Subject,
    CourseAllocation,
    OnlineDigitalCourse,
    OfflineContentPackage,
    SmartClassroomEquipment,
    TeacherAttendanceRecord,
    OnlineExam,
    ExamQuestion,
    ExamResult,
    StudentReportCard,
    ConnectivityAuditMetric,
    ScholarshipScheme,
    ScholarshipApplication,
    BroadcastNotification,
    GrievanceTicket,
    GeneratedReport,
    SystemConfiguration,
    AuditTrailLog
)

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'village', 'district', 'state', 'connectivity_status', 'battery_percentage', 'last_synced_at')
    list_filter = ('connectivity_status', 'power_source', 'state')
    search_fields = ('name', 'village', 'district', 'udise_code')

@admin.register(DeviceTelemetry)
class DeviceTelemetryAdmin(admin.ModelAdmin):
    list_display = ('device_name', 'school', 'device_category', 'status', 'metric_label', 'metric_value')
    list_filter = ('device_category', 'status')

@admin.register(LearningResource)
class LearningResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'grade', 'subject', 'language', 'resource_type', 'is_cached_locally')
    list_filter = ('grade', 'language', 'resource_type', 'is_cached_locally')
    search_fields = ('title', 'subject', 'description')

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'roll_number', 'grade', 'school', 'learning_points', 'attendance_percentage')
    list_filter = ('grade', 'school')
    search_fields = ('name', 'roll_number')

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('student', 'date', 'status', 'check_in_time', 'synced_to_cloud', 'midday_meal_served')
    list_filter = ('status', 'date', 'synced_to_cloud')

@admin.register(MaintenanceTicket)
class MaintenanceTicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_id', 'equipment_name', 'school', 'severity', 'status', 'created_at')
    list_filter = ('severity', 'status')
    search_fields = ('ticket_id', 'equipment_name', 'issue_summary')

@admin.register(CommunityNotice)
class CommunityNoticeAdmin(admin.ModelAdmin):
    list_display = ('title', 'school', 'category', 'event_time', 'is_active')
    list_filter = ('category', 'is_active')

@admin.register(SyncQueueItem)
class SyncQueueItemAdmin(admin.ModelAdmin):
    list_display = ('record_type', 'school', 'status', 'created_at', 'synced_at')
    list_filter = ('status', 'record_type')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'role', 'school', 'phone_number', 'designation')
    list_filter = ('role', 'school')
    search_fields = ('full_name', 'user__username', 'phone_number')

@admin.register(LiveClassSession)
class LiveClassSessionAdmin(admin.ModelAdmin):
    list_display = ('title', 'teacher_name', 'grade', 'subject', 'status', 'scheduled_time', 'meet_link')
    list_filter = ('status', 'grade', 'subject')

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by_name', 'grade', 'subject', 'due_date', 'total_points')
    list_filter = ('grade', 'subject')

@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'assignment', 'status', 'grade_score', 'submitted_at')
    list_filter = ('status',)

@admin.register(ClassStudyMaterial)
class ClassStudyMaterialAdmin(admin.ModelAdmin):
    list_display = ('title', 'grade', 'subject', 'file_type', 'file_name', 'downloads_count')
    list_filter = ('file_type', 'grade', 'subject')

@admin.register(ForumTopic)
class ForumTopicAdmin(admin.ModelAdmin):
    list_display = ('title', 'author_name', 'author_role', 'category', 'is_announcement', 'is_pinned')
    list_filter = ('category', 'is_announcement', 'is_pinned')

@admin.register(StudyMateGroup)
class StudyMateGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'grade', 'subject', 'members_count', 'meeting_schedule')

@admin.register(StudentGoal)
class StudentGoalAdmin(admin.ModelAdmin):
    list_display = ('title', 'student_name', 'target_date', 'is_completed')
    list_filter = ('is_completed',)

@admin.register(BrailleLesson)
class BrailleLessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'level', 'order', 'created_at')
    list_filter = ('category', 'level')
    search_fields = ('title', 'description')

@admin.register(BraillePracticeQuiz)
class BraillePracticeQuizAdmin(admin.ModelAdmin):
    list_display = ('prompt', 'target_char', 'braille_unicode', 'lesson')
    search_fields = ('prompt', 'target_char')

@admin.register(BrailleStudentProgress)
class BrailleStudentProgressAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'lesson', 'accuracy_percent', 'score', 'completed', 'practice_minutes', 'last_practiced_at')
    list_filter = ('completed', 'lesson__category')

@admin.register(RolePermissionMatrix)
class RolePermissionMatrixAdmin(admin.ModelAdmin):
    list_display = ('role', 'can_manage_schools', 'can_manage_users', 'can_conduct_exams', 'can_approve_scholarships')

@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'employee_id', 'school', 'designation', 'specialization', 'is_active')
    list_filter = ('school', 'is_active')
    search_fields = ('name', 'employee_id')

@admin.register(ParentProfile)
class ParentProfileAdmin(admin.ModelAdmin):
    list_display = ('guardian_name', 'phone_number', 'relation', 'occupation', 'preferred_language')
    search_fields = ('guardian_name', 'phone_number')

@admin.register(ParentMeetingNotice)
class ParentMeetingNoticeAdmin(admin.ModelAdmin):
    list_display = ('title', 'school', 'meeting_date', 'venue', 'sms_dispatched_count')

@admin.register(ParentCommunication)
class ParentCommunicationAdmin(admin.ModelAdmin):
    list_display = ('subject', 'parent_name', 'teacher_name', 'message_direction', 'is_read', 'created_at')

@admin.register(AcademicClass)
class AcademicClassAdmin(admin.ModelAdmin):
    list_display = ('grade', 'section', 'school', 'room_number', 'class_teacher', 'total_students_enrolled')
    list_filter = ('school', 'grade')

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'grade', 'total_chapters', 'practical_sessions')
    list_filter = ('grade',)

@admin.register(CourseAllocation)
class CourseAllocationAdmin(admin.ModelAdmin):
    list_display = ('teacher_name', 'subject', 'academic_class', 'school', 'periods_per_week', 'is_confirmed')
    list_filter = ('school', 'subject')

@admin.register(OnlineDigitalCourse)
class OnlineDigitalCourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'grade', 'instructor_name', 'is_live_stream_active', 'enrolled_students_count')

@admin.register(OfflineContentPackage)
class OfflineContentPackageAdmin(admin.ModelAdmin):
    list_display = ('package_name', 'school', 'grade', 'subject', 'total_size_mb', 'sync_status')
    list_filter = ('sync_status', 'school')

@admin.register(SmartClassroomEquipment)
class SmartClassroomEquipmentAdmin(admin.ModelAdmin):
    list_display = ('room_name', 'equipment_type', 'school', 'serial_number', 'health_status', 'last_inspected')
    list_filter = ('equipment_type', 'health_status', 'school')

@admin.register(TeacherAttendanceRecord)
class TeacherAttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('teacher_name', 'school', 'date', 'status', 'check_in_time', 'check_out_time')
    list_filter = ('status', 'date', 'school')

@admin.register(OnlineExam)
class OnlineExamAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'grade', 'school', 'exam_date', 'total_marks', 'exam_type', 'is_published')
    list_filter = ('subject', 'grade', 'exam_type')

@admin.register(ExamQuestion)
class ExamQuestionAdmin(admin.ModelAdmin):
    list_display = ('exam', 'question_text', 'question_type', 'marks')

@admin.register(ExamResult)
class ExamResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'exam', 'marks_obtained', 'percentage', 'grade_letter', 'passed')
    list_filter = ('passed', 'exam')

@admin.register(StudentReportCard)
class StudentReportCardAdmin(admin.ModelAdmin):
    list_display = ('student', 'academic_year', 'term', 'overall_percentage', 'class_rank', 'promoted_to_next_grade')
    list_filter = ('academic_year', 'term')

@admin.register(ConnectivityAuditMetric)
class ConnectivityAuditMetricAdmin(admin.ModelAdmin):
    list_display = ('school', 'interface', 'ping_latency_ms', 'download_speed_kbps', 'uptime_percentage_30days', 'timestamp')
    list_filter = ('interface', 'school')

@admin.register(ScholarshipScheme)
class ScholarshipSchemeAdmin(admin.ModelAdmin):
    list_display = ('scheme_code', 'name', 'amount_per_annum_inr', 'deadline', 'is_active')
    list_filter = ('is_active',)

@admin.register(ScholarshipApplication)
class ScholarshipApplicationAdmin(admin.ModelAdmin):
    list_display = ('application_number', 'student', 'scholarship', 'applied_date', 'verification_stage', 'dbt_transaction_ref')
    list_filter = ('verification_stage', 'scholarship')

@admin.register(BroadcastNotification)
class BroadcastNotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'school', 'target_audience', 'priority', 'is_sent', 'created_at')
    list_filter = ('priority', 'target_audience')

@admin.register(GrievanceTicket)
class GrievanceTicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_number', 'school', 'complainant_name', 'category', 'priority', 'status', 'created_at')
    list_filter = ('status', 'priority', 'category')
    search_fields = ('ticket_number', 'subject', 'complainant_name')

@admin.register(GeneratedReport)
class GeneratedReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'school', 'report_type', 'format_type', 'generated_by', 'created_at')
    list_filter = ('report_type', 'format_type')

@admin.register(SystemConfiguration)
class SystemConfigurationAdmin(admin.ModelAdmin):
    list_display = ('config_key', 'category', 'is_editable', 'updated_at')
    list_filter = ('category',)

@admin.register(AuditTrailLog)
class AuditTrailLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'user_name', 'user_role', 'action', 'target_model', 'record_id')
    list_filter = ('action', 'user_role')
    search_fields = ('user_name', 'description')


