from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class School(models.Model):
    name = models.CharField(max_length=255)
    village = models.CharField(max_length=150)
    block = models.CharField(max_length=150, default='Rural Block A')
    district = models.CharField(max_length=150)
    state = models.CharField(max_length=150)
    udise_code = models.CharField(max_length=50, unique=True)
    
    # Power & Energy Telemetry
    solar_capacity_kw = models.FloatField(default=3.5)
    solar_output_watts = models.IntegerField(default=1850)
    battery_percentage = models.IntegerField(default=86)
    power_source = models.CharField(
        max_length=50,
        choices=[
            ('solar', 'Solar Microgrid'),
            ('grid', 'State Electricity Grid'),
            ('hybrid', 'Solar + Grid Hybrid'),
            ('battery_backup', 'Inverter Battery Backup'),
        ],
        default='hybrid'
    )
    grid_power_available = models.BooleanField(default=True)
    
    # Rural Connectivity
    connectivity_type = models.CharField(
        max_length=50,
        choices=[
            ('bharatnet_fiber', 'BharatNet Optical Fiber'),
            ('vsat_satellite', 'ISRO / GSAT VSAT Terminal'),
            ('4g_5g_cpe', 'Rural 4G/5G Wireless CPE'),
            ('mesh_wifi', 'Village Local Mesh Wi-Fi'),
            ('offline_sneakernet', 'Local Edge Server (Zero-Net Caching)'),
        ],
        default='bharatnet_fiber'
    )
    connectivity_status = models.CharField(
        max_length=30,
        choices=[
            ('online', 'Online & Synced'),
            ('intermittent', 'Intermittent / Low Bandwidth'),
            ('offline', 'Offline (Edge Caching Active)'),
        ],
        default='online'
    )
    latency_ms = models.IntegerField(default=42)
    bandwidth_kbps = models.IntegerField(default=4800)
    data_saver_mode = models.BooleanField(default=True)
    
    # Edge Infrastructure (Raspberry Pi / Low-cost Smart Classroom Server)
    edge_server_ip = models.CharField(max_length=50, default='192.168.1.100')
    edge_server_status = models.CharField(max_length=50, default='Operational')
    edge_storage_used_gb = models.FloatField(default=142.5)
    edge_storage_total_gb = models.FloatField(default=256.0)
    smart_classrooms_count = models.IntegerField(default=4)
    total_students = models.IntegerField(default=284)
    total_teachers = models.IntegerField(default=11)
    
    last_synced_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.village}, {self.district})"


class DeviceTelemetry(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='telemetry')
    device_name = models.CharField(max_length=150)
    device_category = models.CharField(
        max_length=50,
        choices=[
            ('solar_power', 'Solar & Inverter'),
            ('edge_compute', 'Local Edge Server'),
            ('display_av', 'Smart Classroom Projector/Display'),
            ('connectivity', 'Network Gateway / Modem'),
            ('environmental', 'IoT Classroom Sensors'),
            ('biometric', 'Smart Attendance Reader'),
        ],
        default='solar_power'
    )
    status = models.CharField(
        max_length=30,
        choices=[
            ('healthy', 'Healthy / Nominal'),
            ('warning', 'Warning / Requires Check'),
            ('offline', 'Offline / No Signal'),
            ('critical', 'Critical Fault'),
        ],
        default='healthy'
    )
    metric_label = models.CharField(max_length=100)
    metric_value = models.CharField(max_length=100)
    health_score = models.IntegerField(default=95)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.device_name} - {self.metric_label}: {self.metric_value}"


class LearningResource(models.Model):
    title = models.CharField(max_length=255)
    grade = models.IntegerField(default=6)
    subject = models.CharField(max_length=100)
    language = models.CharField(
        max_length=50,
        choices=[
            ('Hindi', 'Hindi (हिंदी)'),
            ('English', 'English'),
            ('Telugu', 'Telugu (తెలుగు)'),
            ('Tamil', 'Tamil (தமிழ்)'),
            ('Marathi', 'Marathi (मराठी)'),
            ('Bengali', 'Bengali (বাংলা)'),
            ('Odia', 'Odia (ଓଡ଼ିଆ)'),
            ('Gujarati', 'Gujarati (ગુજરાતી)'),
        ],
        default='Hindi'
    )
    resource_type = models.CharField(
        max_length=50,
        choices=[
            ('video', 'Interactive Video Lesson'),
            ('simulation', 'Virtual Science & Math Sim'),
            ('audio', 'Vernacular Audio Story / Pod'),
            ('worksheet', 'Printable / Digital Worksheet'),
            ('quiz', 'Gamified Offline Quiz'),
        ],
        default='video'
    )
    file_size_mb = models.FloatField(default=14.5)
    duration_mins = models.IntegerField(default=15)
    is_cached_locally = models.BooleanField(default=True)
    curriculum_standard = models.CharField(max_length=100, default='NCERT & NEP 2020 Aligned')
    description = models.TextField(blank=True)
    content_payload = models.JSONField(default=dict, blank=True)
    views_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.language} Gr.{self.grade}] {self.title}"


class Student(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='students')
    name = models.CharField(max_length=150)
    roll_number = models.CharField(max_length=50)
    admission_number = models.CharField(max_length=50, blank=True, default='ADM-2025-001')
    grade = models.IntegerField(default=6)
    gender = models.CharField(max_length=20, choices=[('Female', 'Female'), ('Male', 'Male'), ('Other', 'Other')])
    category = models.CharField(max_length=50, default='OBC', choices=[('General', 'General'), ('OBC', 'OBC'), ('SC', 'SC'), ('ST', 'ST'), ('EWS', 'EWS')])
    status = models.CharField(max_length=30, default='Active', choices=[('Active', 'Active Enrolled'), ('Transferred', 'Transferred'), ('Graduated', 'Graduated')])
    guardian_name = models.CharField(max_length=150, blank=True)
    guardian_phone = models.CharField(max_length=20, default='+91 98765 01234')
    rfid_card_id = models.CharField(max_length=50, blank=True)
    learning_points = models.IntegerField(default=120)
    completed_modules = models.IntegerField(default=8)
    attendance_percentage = models.FloatField(default=92.5)

    def __str__(self):
        return f"{self.name} (Class {self.grade}) - {self.roll_number}"


class AttendanceRecord(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendances')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField(default=timezone.now)
    status = models.CharField(
        max_length=20,
        choices=[('present', 'Present'), ('absent', 'Absent'), ('late', 'Late')],
        default='present'
    )
    check_in_time = models.CharField(max_length=20, default='08:45 AM')
    synced_to_cloud = models.BooleanField(default=True)
    midday_meal_served = models.BooleanField(default=True)

    class Meta:
        unique_together = ('student', 'date')

    def __str__(self):
        return f"{self.student.name} - {self.date}: {self.status}"


class MaintenanceTicket(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='tickets')
    ticket_id = models.CharField(max_length=50, unique=True)
    equipment_name = models.CharField(max_length=150)
    severity = models.CharField(
        max_length=20,
        choices=[('critical', 'Critical (Class Disrupted)'), ('high', 'High'), ('medium', 'Medium'), ('low', 'Low')],
        default='medium'
    )
    status = models.CharField(
        max_length=30,
        choices=[
            ('open', 'Ticket Logged'),
            ('technician_assigned', 'Technician Dispatched'),
            ('in_progress', 'Repair in Progress'),
            ('resolved', 'Resolved & Operational'),
        ],
        default='open'
    )
    issue_summary = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    reported_by = models.CharField(max_length=100, default='Village Teacher / Pradhan')
    technician_contact = models.CharField(max_length=150, default='Block Tech Support Team')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[{self.ticket_id}] {self.equipment_name} - {self.status}"


class CommunityNotice(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='community_notices')
    title = models.CharField(max_length=255)
    category = models.CharField(
        max_length=50,
        choices=[
            ('digital_literacy', 'Adult Digital Literacy & DBT Clinic'),
            ('gram_panchayat', 'Gram Panchayat Village Assembly'),
            ('health_nutrition', 'Poshan Abhiyaan & Health Camp'),
            ('kisan_mitra', 'Farmer Tech & Agri Knowledge Session'),
        ],
        default='digital_literacy'
    )
    event_time = models.CharField(max_length=100, default='Today at 5:30 PM')
    location = models.CharField(max_length=150, default='Vidya Setu Smart Classroom Hub')
    organizer = models.CharField(max_length=150, default='Gram Panchayat & Head Teacher')
    description = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class SyncQueueItem(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='sync_queue')
    record_type = models.CharField(max_length=50) # 'attendance', 'quiz_result', 'ticket'
    payload = models.JSONField(default=dict)
    status = models.CharField(
        max_length=30,
        choices=[('queued_offline', 'Queued Locally'), ('syncing', 'Syncing...'), ('synced', 'Synced to State Portal')],
        default='queued_offline'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    synced_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.record_type} - {self.status}"


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('teacher', 'Rural School Teacher / In-Charge'),
        ('deo', 'District Education Officer (DEO)'),
        ('panchayat', 'Gram Panchayat / Village Representative'),
        ('student', 'Student / Learner'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='teacher')
    full_name = models.CharField(max_length=150, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True, related_name='affiliated_users')
    designation = models.CharField(max_length=150, default='Smart Classroom Facilitator')
    avatar_url = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name or self.user.username} ({self.get_role_display()})"


class LiveClassSession(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='live_classes')
    teacher_name = models.CharField(max_length=150, default='Master Ji Ramesh Meena')
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
    grade = models.IntegerField(default=8)
    scheduled_time = models.CharField(max_length=100, default='Today at 10:30 AM')
    duration_mins = models.IntegerField(default=45)
    meet_link = models.CharField(max_length=255, default='https://meet.google.com/vid-setu-live')
    calendar_sync_url = models.CharField(max_length=500, blank=True)
    status = models.CharField(
        max_length=30,
        choices=[('scheduled', 'Scheduled'), ('live', 'Live Now'), ('completed', 'Completed')],
        default='scheduled'
    )
    recorded_link = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.status.upper()}] {self.title} (Gr.{self.grade})"


class Assignment(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='assignments')
    created_by_name = models.CharField(max_length=150, default='Master Ji Ramesh Meena')
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
    grade = models.IntegerField(default=8)
    description = models.TextField()
    attachment_name = models.CharField(max_length=150, default='Chapter_Worksheet.pdf')
    attachment_type = models.CharField(
        max_length=20,
        choices=[('PDF', 'PDF Document'), ('DOCX', 'Word Document'), ('PPTX', 'PowerPoint Presentation')],
        default='PDF'
    )
    attachment_url = models.CharField(max_length=255, default='#')
    due_date = models.CharField(max_length=100, default='Tomorrow, 5:00 PM')
    total_points = models.IntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} (Class {self.grade})"


class AssignmentSubmission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student_name = models.CharField(max_length=150)
    student_roll = models.CharField(max_length=50, default='KH-01')
    submission_text = models.TextField(blank=True)
    attachment_name = models.CharField(max_length=150, default='Student_Answer_Sheet.pdf')
    attachment_url = models.CharField(max_length=255, default='#')
    status = models.CharField(
        max_length=30,
        choices=[('submitted', 'Submitted'), ('graded', 'Graded & Reviewed')],
        default='submitted'
    )
    grade_score = models.IntegerField(null=True, blank=True)
    teacher_feedback = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student_name} - {self.assignment.title}"


class ClassStudyMaterial(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='study_materials')
    uploaded_by_name = models.CharField(max_length=150, default='Master Ji Ramesh Meena')
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
    grade = models.IntegerField(default=8)
    file_type = models.CharField(
        max_length=20,
        choices=[('PDF', 'PDF'), ('DOCX', 'DOCX'), ('PPTX', 'PPTX')],
        default='PDF'
    )
    file_name = models.CharField(max_length=150)
    file_size_mb = models.FloatField(default=4.5)
    download_url = models.CharField(max_length=255, default='#')
    downloads_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.file_type}] {self.title} (Gr.{self.grade})"


class ForumTopic(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='forum_topics')
    author_name = models.CharField(max_length=150)
    author_role = models.CharField(max_length=50, default='student')
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=100, default='General')
    category = models.CharField(
        max_length=50,
        choices=[
            ('academic_query', 'Academic Student Query'),
            ('announcement', 'Teacher Official Announcement'),
            ('study_group', 'Peer Study Circle Discussion')
        ],
        default='academic_query'
    )
    content = models.TextField()
    is_announcement = models.BooleanField(default=False)
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.category}] {self.title}"


class ForumReply(models.Model):
    topic = models.ForeignKey(ForumTopic, on_delete=models.CASCADE, related_name='replies')
    author_name = models.CharField(max_length=150)
    author_role = models.CharField(max_length=50, default='teacher')
    content = models.TextField()
    is_teacher_endorsed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reply by {self.author_name} on {self.topic.title}"


class StudyMateGroup(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='study_groups')
    name = models.CharField(max_length=150)
    subject = models.CharField(max_length=100)
    grade = models.IntegerField(default=8)
    description = models.TextField()
    members_count = models.IntegerField(default=6)
    meeting_schedule = models.CharField(max_length=100, default='Tue & Thu at 4:30 PM')
    lead_student = models.CharField(max_length=150, default='Pooja Gurjar')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class StudentGoal(models.Model):
    student_name = models.CharField(max_length=150, default='Pooja Gurjar')
    title = models.CharField(max_length=255)
    target_date = models.CharField(max_length=100, default='This Friday')
    is_completed = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({'Done' if self.is_completed else 'Pending'})"


class BrailleLesson(models.Model):
    CATEGORY_CHOICES = [
        ('bharati_hindi', 'Bharati Braille (हिंदी स्वर व व्यंजन)'),
        ('english_alphabet', 'Standard English Braille (Grade 1 A-Z)'),
        ('numbers_math', 'Nemeth Numbers & Mathematical Signs'),
        ('contractions', 'Everyday Words & Contractions (Grade 2)'),
    ]
    LEVEL_CHOICES = [
        ('beginner', 'Beginner (Foundational Dots 1-6)'),
        ('intermediate', 'Intermediate (Words & Math)'),
        ('advanced', 'Advanced (Full Sentence Literacy)'),
    ]

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='bharati_hindi')
    level = models.CharField(max_length=50, choices=LEVEL_CHOICES, default='beginner')
    description = models.TextField()
    characters_data = models.JSONField(default=list)
    order = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.get_category_display()}] {self.title}"


class BraillePracticeQuiz(models.Model):
    lesson = models.ForeignKey(BrailleLesson, on_delete=models.CASCADE, related_name='quizzes')
    prompt = models.CharField(max_length=255)
    target_char = models.CharField(max_length=50)
    expected_dots = models.JSONField(default=list) # e.g. [1, 2, 4] for 'F'
    braille_unicode = models.CharField(max_length=20, default='⠁')
    audio_hint = models.CharField(max_length=255, blank=True)
    options = models.JSONField(default=list)
    explanation = models.TextField(blank=True)

    def __str__(self):
        return f"Quiz: {self.prompt} ({self.target_char})"


class BrailleStudentProgress(models.Model):
    student_name = models.CharField(max_length=150, default='Pooja Gurjar')
    lesson = models.ForeignKey(BrailleLesson, on_delete=models.CASCADE, related_name='progress_records')
    accuracy_percent = models.FloatField(default=0.0)
    score = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    practice_minutes = models.IntegerField(default=0)
    mastered_chars = models.JSONField(default=list)
    last_practiced_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.student_name} - {self.lesson.title}: {self.accuracy_percent}%"


# ===========================================================================
# 3.3 ROLE-BASED ACCESS CONTROL (RBAC)
# ===========================================================================

class RolePermissionMatrix(models.Model):
    ROLE_CHOICES = [
        ('superadmin', 'Super Administrator / Ministry Head'),
        ('deo', 'District Education Officer (DEO)'),
        ('headmaster', 'School Headmaster / Principal'),
        ('teacher', 'Smart Classroom Teacher'),
        ('student', 'Rural Student'),
        ('parent', 'Parent / Guardian'),
        ('panchayat', 'Gram Panchayat / SMC Member'),
    ]

    role = models.CharField(max_length=50, choices=ROLE_CHOICES, unique=True)
    can_manage_schools = models.BooleanField(default=False)
    can_manage_users = models.BooleanField(default=False)
    can_allocate_courses = models.BooleanField(default=False)
    can_conduct_exams = models.BooleanField(default=False)
    can_approve_scholarships = models.BooleanField(default=False)
    can_view_analytics = models.BooleanField(default=True)
    can_view_audit_logs = models.BooleanField(default=False)
    can_manage_grievances = models.BooleanField(default=False)
    can_export_reports = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"RBAC: {self.get_role_display()}"


# ===========================================================================
# 3.6 TEACHER MANAGEMENT
# ===========================================================================

class TeacherProfile(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='teacher_profile')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='teachers_list')
    employee_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=150)
    designation = models.CharField(max_length=100, default='Senior Teacher Grade II')
    qualification = models.CharField(max_length=150, default='B.Ed, M.Sc (Physics)')
    specialization = models.CharField(max_length=100, default='Science & Innovation')
    phone_number = models.CharField(max_length=20, default='+91 94140 12345')
    email = models.EmailField(blank=True)
    joining_date = models.DateField(default=timezone.now)
    assigned_grades = models.CharField(max_length=100, default='Class 6, 7, 8')
    is_active = models.BooleanField(default=True)
    biometric_device_id = models.CharField(max_length=50, blank=True, default='BIO-RJ-041')

    def __str__(self):
        return f"{self.name} ({self.employee_id}) - {self.school.name}"


# ===========================================================================
# 3.7 PARENT MANAGEMENT & 3.19 PARENT PORTAL
# ===========================================================================

class ParentProfile(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='parent_profile')
    guardian_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20)
    relation = models.CharField(max_length=50, choices=[('Father', 'Father'), ('Mother', 'Mother'), ('Guardian', 'Local Guardian')], default='Father')
    occupation = models.CharField(max_length=100, default='Farmer / Krishi')
    annual_income = models.CharField(max_length=50, default='₹75,000')
    preferred_language = models.CharField(max_length=50, default='Hindi')
    village = models.CharField(max_length=150, blank=True)
    students = models.ManyToManyField(Student, related_name='parents')
    whatsapp_enabled = models.BooleanField(default=True)
    sms_alerts_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.guardian_name} ({self.relation})"


class ParentMeetingNotice(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='parent_meetings')
    title = models.CharField(max_length=200, default='Quarterly Parent-Teacher Meeting (PTM)')
    agenda = models.TextField()
    meeting_date = models.CharField(max_length=100, default='Second Saturday at 10:00 AM')
    venue = models.CharField(max_length=150, default='Smart Classroom 1 & Village Panchayat Hall')
    sms_dispatched_count = models.IntegerField(default=165)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PTM: {self.title} ({self.school.name})"


class ParentCommunication(models.Model):
    parent_name = models.CharField(max_length=150)
    student_name = models.CharField(max_length=150)
    teacher_name = models.CharField(max_length=150)
    message_direction = models.CharField(max_length=30, choices=[('parent_to_teacher', 'Parent to Teacher'), ('teacher_to_parent', 'Teacher to Parent')])
    subject = models.CharField(max_length=200)
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Msg: {self.subject} ({self.parent_name} -> {self.teacher_name})"


# ===========================================================================
# 3.8 CLASS & SUBJECT MANAGEMENT
# ===========================================================================

class AcademicClass(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='academic_classes')
    grade = models.IntegerField(default=8)
    section = models.CharField(max_length=10, default='A')
    academic_year = models.CharField(max_length=20, default='2025-2026')
    room_number = models.CharField(max_length=50, default='Room 102')
    class_teacher = models.CharField(max_length=150, default='Rajendra Prasad Sharma')
    total_students_enrolled = models.IntegerField(default=34)

    def __str__(self):
        return f"Grade {self.grade}-{self.section} ({self.school.name})"


class Subject(models.Model):
    code = models.CharField(max_length=30, unique=True)
    name = models.CharField(max_length=100)
    grade = models.IntegerField(default=8)
    syllabus_standard = models.CharField(max_length=100, default='NCERT & NEP 2020 State Board')
    total_chapters = models.IntegerField(default=16)
    practical_sessions = models.IntegerField(default=12)

    def __str__(self):
        return f"[{self.code}] {self.name} (Gr.{self.grade})"


# ===========================================================================
# 3.9 COURSE ALLOCATION ENGINE
# ===========================================================================

class CourseAllocation(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='course_allocations')
    teacher_name = models.CharField(max_length=150)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='allocations')
    academic_class = models.ForeignKey(AcademicClass, on_delete=models.CASCADE, related_name='allocations')
    periods_per_week = models.IntegerField(default=5)
    timetable_slots = models.JSONField(default=list)
    is_confirmed = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.teacher_name} -> {self.subject.name} ({self.academic_class})"


# ===========================================================================
# 3.10 ONLINE LEARNING MODULE
# ===========================================================================

class OnlineDigitalCourse(models.Model):
    title = models.CharField(max_length=200)
    subject = models.CharField(max_length=100)
    grade = models.IntegerField(default=8)
    instructor_name = models.CharField(max_length=150)
    video_streaming_url = models.CharField(max_length=500, blank=True)
    interactive_slides_url = models.CharField(max_length=500, blank=True)
    is_live_stream_active = models.BooleanField(default=False)
    enrolled_students_count = models.IntegerField(default=68)
    modules_payload = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Online Course: {self.title} (Grade {self.grade})"


# ===========================================================================
# 3.11 OFFLINE LEARNING MODULE
# ===========================================================================

class OfflineContentPackage(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='offline_packages')
    package_name = models.CharField(max_length=200)
    grade = models.IntegerField(default=8)
    subject = models.CharField(max_length=100)
    total_size_mb = models.FloatField(default=480.0)
    edge_device_target = models.CharField(max_length=150, default='Raspberry Pi 5 Hub (192.168.10.1)')
    sync_status = models.CharField(
        max_length=50,
        choices=[
            ('downloaded_locally', 'Downloaded & Cached Locally on Edge'),
            ('pending_sync', 'Scheduled for Nightly Burst Sync'),
            ('syncing', 'Synchronizing Over BharatNet'),
        ],
        default='downloaded_locally'
    )
    last_cached_at = models.DateTimeField(default=timezone.now)
    offline_video_count = models.IntegerField(default=24)
    offline_pdf_count = models.IntegerField(default=48)

    def __str__(self):
        return f"Offline Pack: {self.package_name} ({self.school.name})"


# ===========================================================================
# 3.12 SMART CLASSROOM MANAGEMENT
# ===========================================================================

class SmartClassroomEquipment(models.Model):
    EQUIPMENT_TYPES = [
        ('interactive_flat_panel', 'Interactive Smart Display / IFPD 75"'),
        ('solar_ups_inverter', 'Solar Hybrid PCU Inverter (5kVA)'),
        ('raspberry_pi_edge', 'Edge Microserver (RPi 5 8GB)'),
        ('audio_amplifier', 'Classroom PA & Wireless Mic'),
        ('iot_smart_meter', 'IoT Energy & Power Sensor'),
        ('rfid_biometric', 'RFID & Biometric Terminal')
    ]
    STATUS_CHOICES = [
        ('healthy', 'Operational / Good'),
        ('warning', 'Maintenance Due'),
        ('critical', 'Faulty / Down')
    ]

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='smart_equipment')
    room_name = models.CharField(max_length=100, default='Smart Class 1')
    equipment_type = models.CharField(max_length=50, choices=EQUIPMENT_TYPES)
    brand_model = models.CharField(max_length=100, default='LG Touch 75TR3DJ / Luminous Solar')
    serial_number = models.CharField(max_length=100, unique=True)
    power_consumption_watts = models.IntegerField(default=180)
    health_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='healthy')
    last_inspected = models.DateField(default=timezone.now)
    amc_vendor = models.CharField(max_length=150, default='Rajasthan Electronics & Instruments Ltd (REIL)')

    def __str__(self):
        return f"{self.room_name} - {self.get_equipment_type_display()} ({self.health_status})"


# ===========================================================================
# 3.13 ATTENDANCE MANAGEMENT (TEACHER ATTENDANCE)
# ===========================================================================

class TeacherAttendanceRecord(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='teacher_attendances')
    teacher_name = models.CharField(max_length=150)
    date = models.DateField(default=timezone.now)
    status = models.CharField(
        max_length=30,
        choices=[
            ('present', 'Present & Teaching'),
            ('on_duty', 'On Duty (Training/Election)'),
            ('leave', 'Sanctioned Medical/Casual Leave'),
            ('absent', 'Absent Without Intimation')
        ],
        default='present'
    )
    check_in_time = models.CharField(max_length=20, default='08:15 AM')
    check_out_time = models.CharField(max_length=20, default='02:45 PM')
    verification_method = models.CharField(max_length=50, default='Biometric Thumbprint / RFID')

    class Meta:
        unique_together = ('school', 'teacher_name', 'date')

    def __str__(self):
        return f"{self.teacher_name} - {self.date}: {self.status}"


# ===========================================================================
# 3.15 ONLINE EXAMINATION & QUIZ
# ===========================================================================

class OnlineExam(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='online_exams')
    title = models.CharField(max_length=200)
    subject = models.CharField(max_length=100)
    grade = models.IntegerField(default=8)
    exam_date = models.DateField(default=timezone.now)
    duration_mins = models.IntegerField(default=60)
    total_marks = models.IntegerField(default=50)
    passing_marks = models.IntegerField(default=18)
    exam_type = models.CharField(
        max_length=50,
        choices=[
            ('mcq', 'Objective MCQ Assessment'),
            ('mixed', 'MCQ + Concept Diagram Numerical'),
            ('offline_paper', 'Hybrid OMR Sheet / Paper Evaluation')
        ],
        default='mcq'
    )
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} (Class {self.grade})"


class ExamQuestion(models.Model):
    exam = models.ForeignKey(OnlineExam, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=30, default='mcq')
    options = models.JSONField(default=list)
    marks = models.IntegerField(default=2)
    explanation = models.TextField(blank=True)

    def __str__(self):
        return f"Q for {self.exam.title}: {self.question_text[:50]}"


class ExamResult(models.Model):
    exam = models.ForeignKey(OnlineExam, on_delete=models.CASCADE, related_name='results')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='exam_results')
    marks_obtained = models.FloatField(default=42.0)
    percentage = models.FloatField(default=84.0)
    grade_letter = models.CharField(max_length=5, default='A')
    passed = models.BooleanField(default=True)
    answers_payload = models.JSONField(default=dict)
    evaluated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.student.name} - {self.exam.title}: {self.marks_obtained}/{self.exam.total_marks}"


# ===========================================================================
# 3.16 STUDENT PROGRESS TRACKING
# ===========================================================================

class StudentReportCard(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='report_cards')
    academic_year = models.CharField(max_length=20, default='2025-2026')
    term = models.CharField(max_length=50, default='Mid-Term Summative (अर्धवार्षिक)')
    overall_percentage = models.FloatField(default=86.5)
    class_rank = models.IntegerField(default=3)
    attendance_percentage = models.FloatField(default=94.0)
    subject_breakdown = models.JSONField(default=list)
    teacher_remarks = models.TextField(default='Exemplary dedication in rural STEM and Braille inclusion.')
    promoted_to_next_grade = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report Card: {self.student.name} ({self.term})"


# ===========================================================================
# 3.17 INTERNET CONNECTIVITY MONITORING
# ===========================================================================

class ConnectivityAuditMetric(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='connectivity_logs')
    interface = models.CharField(max_length=50, default='BharatNet Optical Fiber (GPON)')
    ping_latency_ms = models.IntegerField(default=38)
    packet_loss_percentage = models.FloatField(default=0.2)
    download_speed_kbps = models.IntegerField(default=5200)
    upload_speed_kbps = models.IntegerField(default=2100)
    uptime_percentage_30days = models.FloatField(default=98.6)
    failover_active = models.BooleanField(default=False)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.school.name} - Latency: {self.ping_latency_ms}ms ({self.interface})"


# ===========================================================================
# 3.18 SCHOLARSHIP MANAGEMENT
# ===========================================================================

class ScholarshipScheme(models.Model):
    scheme_code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    ministry = models.CharField(max_length=200, default='Ministry of Education & Social Justice, GoI')
    amount_per_annum_inr = models.IntegerField(default=12000)
    eligibility_criteria = models.TextField()
    target_category = models.CharField(max_length=100, default='OBC / SC / ST / Rural Girls / Differently Abled')
    deadline = models.DateField(default=timezone.now)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"[{self.scheme_code}] {self.name}"


class ScholarshipApplication(models.Model):
    STAGE_CHOICES = [
        ('applied', 'Application Submitted by Student'),
        ('school_verified', 'Verified by Headmaster'),
        ('deo_approved', 'Sanctioned by District Education Officer (DEO)'),
        ('dbt_disbursed', 'DBT Transferred to Student Bank Account'),
        ('rejected', 'Application Incomplete / Rejected')
    ]

    scholarship = models.ForeignKey(ScholarshipScheme, on_delete=models.CASCADE, related_name='applications')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='scholarship_apps')
    application_number = models.CharField(max_length=100, unique=True)
    applied_date = models.DateField(default=timezone.now)
    verification_stage = models.CharField(max_length=50, choices=STAGE_CHOICES, default='school_verified')
    dbt_bank_account_last4 = models.CharField(max_length=10, default='4921')
    dbt_transaction_ref = models.CharField(max_length=100, blank=True)
    disbursed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.application_number} - {self.student.name} ({self.verification_stage})"


# ===========================================================================
# 3.20 NOTIFICATION MANAGEMENT
# ===========================================================================

class BroadcastNotification(models.Model):
    school = models.ForeignKey(School, null=True, blank=True, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    target_audience = models.CharField(
        max_length=50,
        choices=[
            ('all', 'Entire Village & School Community'),
            ('teachers', 'All Teachers'),
            ('students', 'Students Only'),
            ('parents', 'Parents Community')
        ],
        default='all'
    )
    priority = models.CharField(
        max_length=20,
        choices=[
            ('normal', 'Standard Circular'),
            ('urgent', 'Urgent Notice'),
            ('emergency', 'Emergency Alert / Weather Warning')
        ],
        default='normal'
    )
    channels = models.JSONField(default=list)
    is_sent = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.priority.upper()}] {self.title}"


# ===========================================================================
# 3.21 COMPLAINT AND FEEDBACK MANAGEMENT (GRIEVANCE REDRESSAL)
# ===========================================================================

class GrievanceTicket(models.Model):
    CATEGORY_CHOICES = [
        ('infrastructure', 'Solar Power / Projector / Water Defect'),
        ('teacher_absence', 'Teacher Punctuality / Vacancy'),
        ('midday_meal', 'Mid-Day Meal Quality & Ration'),
        ('connectivity', 'Internet & Smart Class Downtime'),
        ('scholarship', 'Scholarship Delay / Bank Error'),
        ('harassment_safety', 'Student Safety & Transport'),
        ('general_feedback', 'Community Suggestion')
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical (Escalate to DEO)')
    ]
    STATUS_CHOICES = [
        ('open', 'Received & Registered'),
        ('in_investigation', 'Under Field Inspection'),
        ('resolved', 'Action Taken & Resolved'),
        ('closed', 'Closed & Verified by Panchayat')
    ]

    ticket_number = models.CharField(max_length=50, unique=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='grievances')
    complainant_name = models.CharField(max_length=150)
    complainant_role = models.CharField(max_length=50, default='parent')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    subject = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='open')
    resolution_notes = models.TextField(blank=True)
    assigned_to = models.CharField(max_length=150, default='Block Education Officer (BEO)')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.ticket_number}: {self.subject} ({self.status})"


# ===========================================================================
# 3.23 REPORT GENERATION
# ===========================================================================

class GeneratedReport(models.Model):
    REPORT_TYPES = [
        ('udise_plus', 'Unified District Information System for Education (UDISE+)'),
        ('midday_meal_monthly', 'Pradhan Mantri POSHAN (Mid-Day Meal) Compliance'),
        ('attendance_muster', 'Digital Attendance Muster Roll'),
        ('scholarship_dbt', 'DBT Scholarship Beneficiary Disbursal Report'),
        ('infrastructure_audit', 'Solar & Smart Classroom Asset Health Report'),
        ('academic_term_exam', 'Summative Examination Performance & Marksheet')
    ]

    school = models.ForeignKey(School, null=True, blank=True, on_delete=models.CASCADE, related_name='reports')
    report_type = models.CharField(max_length=50, choices=REPORT_TYPES)
    title = models.CharField(max_length=255)
    period = models.CharField(max_length=100, default='Academic Session 2025-2026')
    format_type = models.CharField(max_length=20, default='PDF')
    file_size_kb = models.IntegerField(default=245)
    generated_by = models.CharField(max_length=150, default='DEO Alwar / Portal System')
    data_summary = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.format_type})"


# ===========================================================================
# 3.24 ADMIN MANAGEMENT (SYSTEM CONFIGURATION)
# ===========================================================================

class SystemConfiguration(models.Model):
    config_key = models.CharField(max_length=100, unique=True)
    config_value = models.TextField()
    category = models.CharField(max_length=50, default='general')
    description = models.TextField(blank=True)
    is_editable = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.config_key} = {self.config_value}"


# ===========================================================================
# 3.25 AUDIT LOG MANAGEMENT
# ===========================================================================

class AuditTrailLog(models.Model):
    user_name = models.CharField(max_length=150, default='admin')
    user_role = models.CharField(max_length=50, default='deo')
    ip_address = models.CharField(max_length=50, default='192.168.10.15')
    action = models.CharField(max_length=50)
    target_model = models.CharField(max_length=100)
    record_id = models.CharField(max_length=100, default='1')
    description = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M')}] {self.user_name} ({self.action}): {self.target_model}"




