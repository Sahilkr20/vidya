from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
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


class DeviceTelemetrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceTelemetry
        fields = '__all__'


class LearningResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningResource
        fields = '__all__'


class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    roll_number = serializers.CharField(source='student.roll_number', read_only=True)
    grade = serializers.IntegerField(source='student.grade', read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = '__all__'


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class MaintenanceTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceTicket
        fields = '__all__'


class CommunityNoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityNotice
        fields = '__all__'


class SyncQueueItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyncQueueItem
        fields = '__all__'


class SchoolSerializer(serializers.ModelSerializer):
    telemetry = DeviceTelemetrySerializer(many=True, read_only=True)
    tickets = MaintenanceTicketSerializer(many=True, read_only=True)
    community_notices = CommunityNoticeSerializer(many=True, read_only=True)

    class Meta:
        model = School
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    school_village = serializers.CharField(source='school.village', read_only=True)
    school_district = serializers.CharField(source='school.district', read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'role',
            'full_name',
            'phone_number',
            'school',
            'school_name',
            'school_village',
            'school_district',
            'designation',
            'avatar_url',
            'created_at'
        ]


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=6)
    full_name = serializers.CharField(max_length=150)
    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES, default='teacher')
    phone_number = serializers.CharField(max_length=20, required=False, allow_blank=True)
    school_id = serializers.IntegerField(required=False, allow_null=True)
    designation = serializers.CharField(max_length=150, required=False, allow_blank=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data.get('email', '')
        password = validated_data['password']
        full_name = validated_data['full_name']
        role = validated_data.get('role', 'teacher')
        phone_number = validated_data.get('phone_number', '')
        school_id = validated_data.get('school_id')
        designation = validated_data.get('designation') or (
            'Rural Head Teacher' if role == 'teacher' else
            'District Education Officer' if role == 'deo' else
            'Panchayat Pradhan' if role == 'panchayat' else 'Rural Student'
        )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=full_name.split(' ')[0] if full_name else '',
            last_name=' '.join(full_name.split(' ')[1:]) if len(full_name.split(' ')) > 1 else ''
        )

        school = None
        if school_id:
            try:
                school = School.objects.get(id=school_id)
            except School.DoesNotExist:
                pass

        profile = UserProfile.objects.create(
            user=user,
            role=role,
            full_name=full_name,
            phone_number=phone_number,
            school=school,
            designation=designation
        )

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            # Also allow login with email
            if '@' in username:
                try:
                    user_obj = User.objects.get(email=username)
                    username = user_obj.username
                except (User.DoesNotExist, User.MultipleObjectsReturned):
                    pass

            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError("Invalid credentials. Please verify your username and password.")
        else:
            raise serializers.ValidationError("Must include 'username' and 'password'.")

        data['user'] = user
        return data


class LiveClassSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveClassSession
        fields = '__all__'


class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = '__all__'


class AssignmentSerializer(serializers.ModelSerializer):
    submissions = AssignmentSubmissionSerializer(many=True, read_only=True)
    submission_count = serializers.IntegerField(source='submissions.count', read_only=True)

    class Meta:
        model = Assignment
        fields = '__all__'


class ClassStudyMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassStudyMaterial
        fields = '__all__'


class ForumReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumReply
        fields = '__all__'


class ForumTopicSerializer(serializers.ModelSerializer):
    replies = ForumReplySerializer(many=True, read_only=True)
    reply_count = serializers.IntegerField(source='replies.count', read_only=True)

    class Meta:
        model = ForumTopic
        fields = '__all__'


class StudyMateGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyMateGroup
        fields = '__all__'


class StudentGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentGoal
        fields = '__all__'


class BraillePracticeQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = BraillePracticeQuiz
        fields = '__all__'


class BrailleLessonSerializer(serializers.ModelSerializer):
    quizzes = BraillePracticeQuizSerializer(many=True, read_only=True)
    quiz_count = serializers.IntegerField(source='quizzes.count', read_only=True)

    class Meta:
        model = BrailleLesson
        fields = '__all__'


class BrailleStudentProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    category = serializers.CharField(source='lesson.category', read_only=True)

    class Meta:
        model = BrailleStudentProgress
        fields = '__all__'


# 3.3 Role-Based Access Control
class RolePermissionMatrixSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = RolePermissionMatrix
        fields = '__all__'


# 3.6 Teacher Management
class TeacherProfileSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)

    class Meta:
        model = TeacherProfile
        fields = '__all__'


# 3.7 Parent Management & 3.19 Parent Portal
class ParentProfileSerializer(serializers.ModelSerializer):
    student_names = serializers.SerializerMethodField()

    class Meta:
        model = ParentProfile
        fields = '__all__'

    def get_student_names(self, obj):
        return [s.name for s in obj.students.all()]


class ParentMeetingNoticeSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)

    class Meta:
        model = ParentMeetingNotice
        fields = '__all__'


class ParentCommunicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentCommunication
        fields = '__all__'


# 3.8 Class & Subject Management
class AcademicClassSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)

    class Meta:
        model = AcademicClass
        fields = '__all__'


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'


# 3.9 Course Allocation Engine
class CourseAllocationSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    subject_code = serializers.CharField(source='subject.code', read_only=True)
    class_label = serializers.SerializerMethodField()

    class Meta:
        model = CourseAllocation
        fields = '__all__'

    def get_class_label(self, obj):
        return f"Grade {obj.academic_class.grade}-{obj.academic_class.section}"


# 3.10 Online Learning Module
class OnlineDigitalCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnlineDigitalCourse
        fields = '__all__'


# 3.11 Offline Learning Module
class OfflineContentPackageSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)

    class Meta:
        model = OfflineContentPackage
        fields = '__all__'


# 3.12 Smart Classroom Management
class SmartClassroomEquipmentSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    equipment_type_display = serializers.CharField(source='get_equipment_type_display', read_only=True)

    class Meta:
        model = SmartClassroomEquipment
        fields = '__all__'


# 3.13 Teacher Attendance
class TeacherAttendanceRecordSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)

    class Meta:
        model = TeacherAttendanceRecord
        fields = '__all__'


# 3.15 Online Examination & Quiz
class ExamQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamQuestion
        fields = '__all__'


class OnlineExamSerializer(serializers.ModelSerializer):
    questions = ExamQuestionSerializer(many=True, read_only=True)
    questions_count = serializers.IntegerField(source='questions.count', read_only=True)
    school_name = serializers.CharField(source='school.name', read_only=True)

    class Meta:
        model = OnlineExam
        fields = '__all__'


class ExamResultSerializer(serializers.ModelSerializer):
    exam_title = serializers.CharField(source='exam.title', read_only=True)
    student_name = serializers.CharField(source='student.name', read_only=True)
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)

    class Meta:
        model = ExamResult
        fields = '__all__'


# 3.16 Student Progress Tracking
class StudentReportCardSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    student_grade = serializers.IntegerField(source='student.grade', read_only=True)

    class Meta:
        model = StudentReportCard
        fields = '__all__'


# 3.17 Internet Connectivity Monitoring
class ConnectivityAuditMetricSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)

    class Meta:
        model = ConnectivityAuditMetric
        fields = '__all__'


# 3.18 Scholarship Management
class ScholarshipSchemeSerializer(serializers.ModelSerializer):
    application_count = serializers.IntegerField(source='applications.count', read_only=True)

    class Meta:
        model = ScholarshipScheme
        fields = '__all__'


class ScholarshipApplicationSerializer(serializers.ModelSerializer):
    scholarship_name = serializers.CharField(source='scholarship.name', read_only=True)
    scholarship_amount = serializers.IntegerField(source='scholarship.amount_per_annum_inr', read_only=True)
    student_name = serializers.CharField(source='student.name', read_only=True)
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    school_name = serializers.CharField(source='student.school.name', read_only=True)

    class Meta:
        model = ScholarshipApplication
        fields = '__all__'


# 3.20 Notification Management
class BroadcastNotificationSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)

    class Meta:
        model = BroadcastNotification
        fields = '__all__'


# 3.21 Complaint & Feedback Management (Grievances)
class GrievanceTicketSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = GrievanceTicket
        fields = '__all__'


# 3.23 Report Generation
class GeneratedReportSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    report_type_display = serializers.CharField(source='get_report_type_display', read_only=True)

    class Meta:
        model = GeneratedReport
        fields = '__all__'


# 3.24 System Configuration
class SystemConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemConfiguration
        fields = '__all__'


# 3.25 Audit Log Management
class AuditTrailLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditTrailLog
        fields = '__all__'



