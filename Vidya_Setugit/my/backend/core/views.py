from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from django.utils import timezone
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
from .serializers import (
    SchoolSerializer,
    DeviceTelemetrySerializer,
    LearningResourceSerializer,
    StudentSerializer,
    AttendanceRecordSerializer,
    MaintenanceTicketSerializer,
    CommunityNoticeSerializer,
    SyncQueueItemSerializer,
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    LiveClassSessionSerializer,
    AssignmentSerializer,
    AssignmentSubmissionSerializer,
    ClassStudyMaterialSerializer,
    ForumTopicSerializer,
    ForumReplySerializer,
    StudyMateGroupSerializer,
    StudentGoalSerializer,
    BrailleLessonSerializer,
    BraillePracticeQuizSerializer,
    BrailleStudentProgressSerializer,
    RolePermissionMatrixSerializer,
    TeacherProfileSerializer,
    ParentProfileSerializer,
    ParentMeetingNoticeSerializer,
    ParentCommunicationSerializer,
    AcademicClassSerializer,
    SubjectSerializer,
    CourseAllocationSerializer,
    OnlineDigitalCourseSerializer,
    OfflineContentPackageSerializer,
    SmartClassroomEquipmentSerializer,
    TeacherAttendanceRecordSerializer,
    OnlineExamSerializer,
    ExamQuestionSerializer,
    ExamResultSerializer,
    StudentReportCardSerializer,
    ConnectivityAuditMetricSerializer,
    ScholarshipSchemeSerializer,
    ScholarshipApplicationSerializer,
    BroadcastNotificationSerializer,
    GrievanceTicketSerializer,
    GeneratedReportSerializer,
    SystemConfigurationSerializer,
    AuditTrailLogSerializer
)


class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all().order_by('id')
    serializer_class = SchoolSerializer

    @action(detail=True, methods=['post'])
    def toggle_connectivity(self, request, pk=None):
        school = self.get_object()
        new_status = request.data.get('status') # 'online', 'intermittent', 'offline'
        if new_status in ['online', 'intermittent', 'offline']:
            school.connectivity_status = new_status
            if new_status == 'online':
                school.latency_ms = 45
                school.bandwidth_kbps = 4800
                school.last_synced_at = timezone.now()
            elif new_status == 'intermittent':
                school.latency_ms = 350
                school.bandwidth_kbps = 320
            else:
                school.latency_ms = 0
                school.bandwidth_kbps = 0
            school.save()
            return Response(SchoolSerializer(school).data)
        return Response({'error': 'Invalid status provided'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def trigger_sync(self, request, pk=None):
        school = self.get_object()
        pending_items = SyncQueueItem.objects.filter(school=school, status__in=['queued_offline', 'syncing'])
        synced_count = pending_items.count()
        now = timezone.now()
        for item in pending_items:
            item.status = 'synced'
            item.synced_at = now
            item.save()
        school.last_synced_at = now
        school.save()
        return Response({
            'message': f'Successfully synced {synced_count} items from edge server to central cloud.',
            'synced_count': synced_count,
            'last_synced_at': now
        })


class DeviceTelemetryViewSet(viewsets.ModelViewSet):
    queryset = DeviceTelemetry.objects.all().order_by('-updated_at')
    serializer_class = DeviceTelemetrySerializer

    def get_queryset(self):
        qs = super().get_queryset()
        school_id = self.request.query_params.get('school')
        if school_id:
            qs = qs.filter(school_id=school_id)
        return qs


class LearningResourceViewSet(viewsets.ModelViewSet):
    queryset = LearningResource.objects.all().order_by('-created_at')
    serializer_class = LearningResourceSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        grade = self.request.query_params.get('grade')
        subject = self.request.query_params.get('subject')
        language = self.request.query_params.get('language')
        cached = self.request.query_params.get('cached')

        if grade:
            qs = qs.filter(grade=grade)
        if subject:
            qs = qs.filter(subject__icontains=subject)
        if language:
            qs = qs.filter(language__iexact=language)
        if cached is not None:
            qs = qs.filter(is_cached_locally=(cached.lower() == 'true'))
        return qs

    @action(detail=True, methods=['post'])
    def toggle_cache(self, request, pk=None):
        resource = self.get_object()
        resource.is_cached_locally = not resource.is_cached_locally
        resource.save()
        return Response(LearningResourceSerializer(resource).data)


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by('grade', 'roll_number')
    serializer_class = StudentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        grade = self.request.query_params.get('grade')
        school_id = self.request.query_params.get('school')
        if grade:
            qs = qs.filter(grade=grade)
        if school_id:
            qs = qs.filter(school_id=school_id)
        return qs


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.all().order_by('-date')
    serializer_class = AttendanceRecordSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        date = self.request.query_params.get('date')
        school_id = self.request.query_params.get('school')
        if date:
            qs = qs.filter(date=date)
        if school_id:
            qs = qs.filter(school_id=school_id)
        return qs

    @action(detail=False, methods=['post'])
    def mark_smart_attendance(self, request):
        """
        Accepts single or bulk RFID / smart classroom attendance checkins
        Supports offline queueing if connectivity is offline.
        """
        student_id = request.data.get('student_id')
        school_id = request.data.get('school_id', 1)
        status_val = request.data.get('status', 'present')
        is_cloud_synced = request.data.get('is_cloud_synced', True)

        try:
            student = Student.objects.get(id=student_id)
            school = School.objects.get(id=school_id)
            today = timezone.now().date()
            now_time = timezone.now().strftime('%I:%M %p')

            record, created = AttendanceRecord.objects.update_or_create(
                student=student,
                date=today,
                defaults={
                    'school': school,
                    'status': status_val,
                    'check_in_time': now_time,
                    'synced_to_cloud': is_cloud_synced,
                    'midday_meal_served': True
                }
            )

            # If not synced to cloud, queue on edge server
            if not is_cloud_synced:
                SyncQueueItem.objects.create(
                    school=school,
                    record_type='attendance',
                    payload={
                        'student_id': student.id,
                        'student_name': student.name,
                        'roll': student.roll_number,
                        'date': str(today),
                        'status': status_val
                    },
                    status='queued_offline'
                )

            return Response(AttendanceRecordSerializer(record).data, status=status.HTTP_200_OK)
        except (Student.DoesNotExist, School.DoesNotExist) as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)


class MaintenanceTicketViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceTicket.objects.all().order_by('-created_at')
    serializer_class = MaintenanceTicketSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        school_id = self.request.query_params.get('school')
        if school_id:
            qs = qs.filter(school_id=school_id)
        return qs


class CommunityNoticeViewSet(viewsets.ModelViewSet):
    queryset = CommunityNotice.objects.all().order_by('-event_time')
    serializer_class = CommunityNoticeSerializer


class SyncQueueViewSet(viewsets.ModelViewSet):
    queryset = SyncQueueItem.objects.all().order_by('-created_at')
    serializer_class = SyncQueueItemSerializer


@api_view(['GET'])
def platform_overview(request):
    """
    District / Hub summary metrics across smart rural schools
    """
    total_schools = School.objects.count()
    online_schools = School.objects.filter(connectivity_status='online').count()
    intermittent_schools = School.objects.filter(connectivity_status='intermittent').count()
    offline_schools = School.objects.filter(connectivity_status='offline').count()
    
    total_students = Student.objects.count()
    total_resources = LearningResource.objects.count()
    cached_resources = LearningResource.objects.filter(is_cached_locally=True).count()
    
    pending_sync_items = SyncQueueItem.objects.filter(status='queued_offline').count()
    open_tickets = MaintenanceTicket.objects.exclude(status='resolved').count()
    
    # Average solar battery across schools
    schools = School.objects.all()
    avg_battery = round(sum(s.battery_percentage for s in schools) / max(total_schools, 1), 1)
    total_solar_kw = round(sum(s.solar_capacity_kw for s in schools), 1)

    return Response({
        'total_schools': total_schools,
        'connectivity_breakdown': {
            'online': online_schools,
            'intermittent': intermittent_schools,
            'offline': offline_schools,
        },
        'total_students': total_students,
        'total_resources': total_resources,
        'cached_resources': cached_resources,
        'edge_bandwidth_saved_gb': round(cached_resources * 38.4, 1),
        'pending_sync_items': pending_sync_items,
        'open_maintenance_tickets': open_tickets,
        'avg_battery_health': avg_battery,
        'total_solar_kw': total_solar_kw,
        'system_status': 'All Rural Edge Hubs Operational'
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new Vidya Setu user (Teacher, DEO, Panchayat, or Student)
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        user_data = UserSerializer(user).data
        return Response({
            'message': f'Welcome to Vidya Setu, {user.username}!',
            'token': token.key,
            'user': user_data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Authenticate user and return role and auth token
    """
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        token, _ = Token.objects.get_or_create(user=user)
        user_data = UserSerializer(user).data
        return Response({
            'message': 'Login successful!',
            'token': token.key,
            'user': user_data
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def current_user(request):
    """
    Retrieve current authenticated user profile
    """
    if request.user.is_authenticated:
        return Response(UserSerializer(request.user).data)
    
    # Check Authorization: Token <key>
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Token ') or auth_header.startswith('Bearer '):
        key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=key)
            return Response(UserSerializer(token.user).data)
        except Token.DoesNotExist:
            pass
    return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def logout_user(request):
    """
    Log out active user session
    """
    logout(request)
    return Response({'message': 'Logged out successfully from Vidya Setu'})


class LiveClassViewSet(viewsets.ModelViewSet):
    queryset = LiveClassSession.objects.all().order_by('-created_at')
    serializer_class = LiveClassSessionSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        school_id = self.request.query_params.get('school')
        grade = self.request.query_params.get('grade')
        status_filter = self.request.query_params.get('status')
        if school_id:
            qs = qs.filter(school_id=school_id)
        if grade:
            qs = qs.filter(grade=grade)
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        session = self.get_object()
        new_status = request.data.get('status') # 'scheduled', 'live', 'completed'
        if new_status in ['scheduled', 'live', 'completed']:
            session.status = new_status
            session.save()
            return Response(LiveClassSessionSerializer(session).data)
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all().order_by('-created_at')
    serializer_class = AssignmentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        school_id = self.request.query_params.get('school')
        grade = self.request.query_params.get('grade')
        subject = self.request.query_params.get('subject')
        if school_id:
            qs = qs.filter(school_id=school_id)
        if grade:
            qs = qs.filter(grade=grade)
        if subject:
            qs = qs.filter(subject__icontains=subject)
        return qs

    @action(detail=True, methods=['post'])
    def submit_solution(self, request, pk=None):
        assignment = self.get_object()
        student_name = request.data.get('student_name', 'Rural Student')
        student_roll = request.data.get('student_roll', 'KH-01')
        submission_text = request.data.get('submission_text', '')
        attachment_name = request.data.get('attachment_name', f'{student_name.replace(" ", "_")}_Solution.pdf')

        submission = AssignmentSubmission.objects.create(
            assignment=assignment,
            student_name=student_name,
            student_roll=student_roll,
            submission_text=submission_text,
            attachment_name=attachment_name,
            status='submitted'
        )
        return Response(AssignmentSubmissionSerializer(submission).data, status=status.HTTP_201_CREATED)


class AssignmentSubmissionViewSet(viewsets.ModelViewSet):
    queryset = AssignmentSubmission.objects.all().order_by('-submitted_at')
    serializer_class = AssignmentSubmissionSerializer

    @action(detail=True, methods=['post'])
    def grade(self, request, pk=None):
        sub = self.get_object()
        score = request.data.get('score')
        feedback = request.data.get('feedback', '')
        if score is not None:
            sub.grade_score = int(score)
            sub.teacher_feedback = feedback
            sub.status = 'graded'
            sub.save()
            return Response(AssignmentSubmissionSerializer(sub).data)
        return Response({'error': 'Score required'}, status=status.HTTP_400_BAD_REQUEST)


class ClassStudyMaterialViewSet(viewsets.ModelViewSet):
    queryset = ClassStudyMaterial.objects.all().order_by('-created_at')
    serializer_class = ClassStudyMaterialSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        school_id = self.request.query_params.get('school')
        grade = self.request.query_params.get('grade')
        subject = self.request.query_params.get('subject')
        file_type = self.request.query_params.get('type')
        if school_id:
            qs = qs.filter(school_id=school_id)
        if grade:
            qs = qs.filter(grade=grade)
        if subject:
            qs = qs.filter(subject__icontains=subject)
        if file_type:
            qs = qs.filter(file_type__iexact=file_type)
        return qs

    @action(detail=True, methods=['post'])
    def download(self, request, pk=None):
        material = self.get_object()
        material.downloads_count += 1
        material.save()
        return Response({'downloads_count': material.downloads_count, 'file_name': material.file_name})


class ForumTopicViewSet(viewsets.ModelViewSet):
    queryset = ForumTopic.objects.all().order_by('-is_pinned', '-created_at')
    serializer_class = ForumTopicSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs

    @action(detail=True, methods=['post'])
    def add_reply(self, request, pk=None):
        topic = self.get_object()
        author_name = request.data.get('author_name', 'Vidya Setu Member')
        author_role = request.data.get('author_role', 'student')
        content = request.data.get('content', '')
        if not content.trim():
            return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)

        reply = ForumReply.objects.create(
            topic=topic,
            author_name=author_name,
            author_role=author_role,
            content=content,
            is_teacher_endorsed=(author_role == 'teacher')
        )
        return Response(ForumReplySerializer(reply).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def toggle_pin(self, request, pk=None):
        topic = self.get_object()
        topic.is_pinned = not topic.is_pinned
        topic.save()
        return Response(ForumTopicSerializer(topic).data)


class StudyMateGroupViewSet(viewsets.ModelViewSet):
    queryset = StudyMateGroup.objects.all().order_by('-created_at')
    serializer_class = StudyMateGroupSerializer

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        grp = self.get_object()
        grp.members_count += 1
        grp.save()
        return Response({'members_count': grp.members_count, 'message': f'You joined {grp.name}!'})


class StudentGoalViewSet(viewsets.ModelViewSet):
    queryset = StudentGoal.objects.all().order_by('-created_at')
    serializer_class = StudentGoalSerializer

    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        goal = self.get_object()
        goal.is_completed = not goal.is_completed
        goal.save()
        return Response(StudentGoalSerializer(goal).data)


@api_view(['POST'])
@permission_classes([AllowAny])
def ai_tutor_chat(request):
    """
    AI Academic Tutor for Rural STEM & NCERT Curriculum
    Prototype chatbot responding with step-by-step guidance in English or Hindi.
    """
    import os
    user_query = request.data.get('message', '').strip()
    subject = request.data.get('subject', 'Science')
    grade = request.data.get('grade', 8)
    lang = request.data.get('language', 'English')

    if not user_query:
        return Response({'reply': 'Namaste! Please ask any academic question from your textbook or assignments.'})

    query_lower = user_query.lower()

    # Intelligent curated responses for core curriculum concepts
    if 'ohm' in query_lower or 'voltage' in query_lower or 'current' in query_lower:
        reply = (
            "💡 **Ohm's Law Explained (ओम का नियम):**\n\n"
            "Ohm's Law states that electric current (I) flowing through a conductor between two points "
            "is directly proportional to the voltage (V) across the two points, provided temperature remains constant.\n\n"
            "📐 **Formula:** `V = I × R` (Voltage = Current × Resistance)\n"
            "• **V**: Potential difference in Volts (V)\n"
            "• **I**: Electric current in Amperes (A)\n"
            "• **R**: Resistance in Ohms (Ω)\n\n"
            "🌾 *Rural Analogy:* Think of water flowing from a rooftop tank through a garden pipe. "
            "The tank's height is the **Voltage**, the speed of water flow is the **Current**, "
            "and any narrow squeeze in the pipe is the **Resistance**!"
        )
    elif 'solar' in query_lower or 'photovoltaic' in query_lower or 'cell' in query_lower and 'solar' in query_lower:
        reply = (
            "☀️ **How Solar Panels Generate Electricity:**\n\n"
            "1. **Photovoltaic Effect:** Sunlight particles (photons) strike the silicon wafer of the solar panel.\n"
            "2. **Electron Excitation:** Photons knock electrons free from silicon atoms, creating a flow of Direct Current (DC).\n"
            "3. **Inverter Conversion:** The classroom solar inverter converts this DC electricity into 230V Alternating Current (AC) for our projector and computers.\n"
            "4. **Tubular Battery Bank:** Excess energy generated at noon is stored chemically in tubular gel batteries to power evening classes."
        )
    elif 'multiply' in query_lower or 'vedic' in query_lower or 'math' in query_lower or '96' in query_lower:
        reply = (
            "🧮 **Vedic Math: Base 100 Mental Multiplication:**\n\n"
            "Let's multiply **96 × 94** in 5 seconds without paper:\n"
            "• 96 is **-4** below 100\n"
            "• 94 is **-6** below 100\n\n"
            "**Step 1 (Left Part):** Cross-subtract: `96 - 6 = 90` (or `94 - 4 = 90`)\n"
            "**Step 2 (Right Part):** Multiply the deficiencies: `(-4) × (-6) = 24`\n"
            "**Final Answer:** Join both parts: **9024**! 🎉"
        )
    elif 'rainwater' in query_lower or 'water' in query_lower and 'harvest' in query_lower:
        reply = (
            "💧 **Rooftop Rainwater Harvesting Formula:**\n\n"
            "To calculate liters of clean drinking water collected from a school tin roof:\n"
            "• `Volume (Liters) = Roof Area (m²) × Annual Rainfall (mm) × Runoff Coefficient (0.85)`\n\n"
            "**Example:** A 120 m² school roof receiving 600 mm monsoon rainfall collects:\n"
            "`120 × 600 × 0.85 = 61,200 Liters` of drinking water filtered through sand & charcoal pits!"
        )
    elif 'cell' in query_lower or 'plant' in query_lower or 'animal' in query_lower:
        reply = (
            "🔬 **Plant Cell vs Animal Cell (NCERT Class 8 Biology):**\n\n"
            "1. **Cell Wall:** Present in plant cells (made of cellulose for rigidity); absent in animal cells.\n"
            "2. **Chloroplasts:** Present in plant cells for photosynthesis; absent in animal cells.\n"
            "3. **Vacuoles:** Large central vacuole in plants; small temporary vacuoles in animals.\n"
            "4. **Nucleus & Mitochondria:** Present in both cells for genetic control and ATP energy production."
        )
    else:
        reply = (
            f"📖 **Vidya Setu AI Academic Guidance for Grade {grade} ({subject}):**\n\n"
            f"Regarding your query on: *'{user_query}'*\n\n"
            "1. **Key Concept:** Break down the textbook problem into known variables and required solution.\n"
            "2. **NCERT Standard Reference:** Check Class 8 Science/Math Chapter summary.\n"
            "3. **Next Steps:** Discuss this in your **Study Mate Group** or post on the **Community Forum** where your teacher can endorse the solution!\n\n"
            "Feel free to ask specific numericals, formulas, or bilingual definitions!"
        )

    return Response({
        'reply': reply,
        'subject': subject,
        'grade': grade,
        'timestamp': timezone.now().strftime('%I:%M %p')
    })


# ---------------------------------------------------------------------------
# Section: Braille Literacy & Assistive Learning Studio Endpoints
# ---------------------------------------------------------------------------

def dots_to_braille_unicode(dots):
    """Converts a 1-indexed list of Braille dots (1 to 8) to its Unicode character."""
    if not dots:
        return '⠀'  # Unicode U+2800 Braille Blank Pattern
    offset = sum(1 << (d - 1) for d in dots if 1 <= d <= 8)
    return chr(0x2800 + offset)


BHARATI_BRAILLE_MAP = {
    # Hindi Vowels (स्वर)
    'अ': {'dots': [1], 'phonetic': 'A (अ)', 'desc': 'Dot 1'},
    'आ': {'dots': [3, 4, 5], 'phonetic': 'AA (आ)', 'desc': 'Dots 3, 4, 5'},
    'इ': {'dots': [2, 4], 'phonetic': 'I (इ)', 'desc': 'Dots 2, 4'},
    'ई': {'dots': [3, 5], 'phonetic': 'EE (ई)', 'desc': 'Dots 3, 5'},
    'उ': {'dots': [1, 3, 6], 'phonetic': 'U (उ)', 'desc': 'Dots 1, 3, 6'},
    'ऊ': {'dots': [1, 2, 5, 6], 'phonetic': 'OO (ऊ)', 'desc': 'Dots 1, 2, 5, 6'},
    'ऋ': {'dots': [1, 2, 3, 5, 6], 'phonetic': 'RI (ऋ)', 'desc': 'Dots 1, 2, 3, 5, 6'},
    'ए': {'dots': [1, 5], 'phonetic': 'E (ए)', 'desc': 'Dots 1, 5'},
    'ऐ': {'dots': [3, 4], 'phonetic': 'AI (ऐ)', 'desc': 'Dots 3, 4'},
    'ओ': {'dots': [1, 3, 5], 'phonetic': 'O (ओ)', 'desc': 'Dots 1, 3, 5'},
    'औ': {'dots': [2, 4, 6], 'phonetic': 'AU (औ)', 'desc': 'Dots 2, 4, 6'},
    'ं': {'dots': [5, 6], 'phonetic': 'Anusvara (ं)', 'desc': 'Dots 5, 6'},
    'ः': {'dots': [6], 'phonetic': 'Visarga (ः)', 'desc': 'Dot 6'},
    '्': {'dots': [4], 'phonetic': 'Halant (्)', 'desc': 'Dot 4 (Virama)'},

    # Hindi Consonants (व्यंजन)
    'क': {'dots': [1, 3], 'phonetic': 'KA (क)', 'desc': 'Dots 1, 3'},
    'ख': {'dots': [4, 6], 'phonetic': 'KHA (ख)', 'desc': 'Dots 4, 6'},
    'ग': {'dots': [1, 2, 4, 5], 'phonetic': 'GA (ग)', 'desc': 'Dots 1, 2, 4, 5'},
    'घ': {'dots': [1, 2, 6], 'phonetic': 'GHA (घ)', 'desc': 'Dots 1, 2, 6'},
    'ङ': {'dots': [3, 4, 6], 'phonetic': 'NGA (ङ)', 'desc': 'Dots 3, 4, 6'},
    'च': {'dots': [1, 4], 'phonetic': 'CHA (च)', 'desc': 'Dots 1, 4'},
    'छ': {'dots': [1, 6], 'phonetic': 'CHHA (छ)', 'desc': 'Dots 1, 6'},
    'ज': {'dots': [2, 4, 5], 'phonetic': 'JA (ज)', 'desc': 'Dots 2, 4, 5'},
    'झ': {'dots': [3, 5, 6], 'phonetic': 'JHA (झ)', 'desc': 'Dots 3, 5, 6'},
    'ञ': {'dots': [2, 5], 'phonetic': 'NYA (ञ)', 'desc': 'Dots 2, 5'},
    'ट': {'dots': [2, 3, 4, 5, 6], 'phonetic': 'TA (ट)', 'desc': 'Dots 2, 3, 4, 5, 6'},
    'ठ': {'dots': [2, 4, 5, 6], 'phonetic': 'THA (ठ)', 'desc': 'Dots 2, 4, 5, 6'},
    'ड': {'dots': [1, 2, 4, 6], 'phonetic': 'DA (ड)', 'desc': 'Dots 1, 2, 4, 6'},
    'ढ': {'dots': [1, 2, 3, 4, 6], 'phonetic': 'DHA (ढ)', 'desc': 'Dots 1, 2, 3, 4, 6'},
    'ण': {'dots': [3, 4, 5, 6], 'phonetic': 'NA (ण)', 'desc': 'Dots 3, 4, 5, 6'},
    'त': {'dots': [2, 3, 4, 5], 'phonetic': 'TA (त)', 'desc': 'Dots 2, 3, 4, 5'},
    'थ': {'dots': [1, 4, 5, 6], 'phonetic': 'THA (थ)', 'desc': 'Dots 1, 4, 5, 6'},
    'द': {'dots': [1, 4, 5], 'phonetic': 'DA (द)', 'desc': 'Dots 1, 4, 5'},
    'ध': {'dots': [2, 3, 4, 6], 'phonetic': 'DHA (ध)', 'desc': 'Dots 2, 3, 4, 6'},
    'न': {'dots': [1, 3, 4, 5], 'phonetic': 'NA (न)', 'desc': 'Dots 1, 3, 4, 5'},
    'प': {'dots': [1, 2, 3, 4], 'phonetic': 'PA (प)', 'desc': 'Dots 1, 2, 3, 4'},
    'फ': {'dots': [2, 3, 5], 'phonetic': 'PHA (फ)', 'desc': 'Dots 2, 3, 5'},
    'ब': {'dots': [1, 2], 'phonetic': 'BA (ब)', 'desc': 'Dots 1, 2'},
    'भ': {'dots': [4, 5], 'phonetic': 'BHA (भ)', 'desc': 'Dots 4, 5'},
    'म': {'dots': [1, 3, 4], 'phonetic': 'MA (म)', 'desc': 'Dots 1, 3, 4'},
    'य': {'dots': [1, 3, 4, 5, 6], 'phonetic': 'YA (य)', 'desc': 'Dots 1, 3, 4, 5, 6'},
    'र': {'dots': [1, 2, 3, 5], 'phonetic': 'RA (र)', 'desc': 'Dots 1, 2, 3, 5'},
    'ल': {'dots': [1, 2, 3], 'phonetic': 'LA (ल)', 'desc': 'Dots 1, 2, 3'},
    'व': {'dots': [1, 2, 3, 6], 'phonetic': 'VA (व)', 'desc': 'Dots 1, 2, 3, 6'},
    'श': {'dots': [1, 4, 6], 'phonetic': 'SHA (श)', 'desc': 'Dots 1, 4, 6'},
    'ष': {'dots': [1, 2, 3, 4, 6], 'phonetic': 'SHA (ष)', 'desc': 'Dots 1, 2, 3, 4, 6'},
    'स': {'dots': [2, 3, 4], 'phonetic': 'SA (स)', 'desc': 'Dots 2, 3, 4'},
    'ह': {'dots': [1, 2, 5], 'phonetic': 'HA (ह)', 'desc': 'Dots 1, 2, 5'},
    'क्ष': {'dots': [1, 2, 3, 4, 5], 'phonetic': 'KSHA (क्ष)', 'desc': 'Dots 1, 2, 3, 4, 5'},
    'ज्ञ': {'dots': [1, 5, 6], 'phonetic': 'GYA (ज्ञ)', 'desc': 'Dots 1, 5, 6'},

    # English Alphabet A-Z
    'a': {'dots': [1], 'phonetic': 'Letter A', 'desc': 'Dot 1'},
    'b': {'dots': [1, 2], 'phonetic': 'Letter B', 'desc': 'Dots 1, 2'},
    'c': {'dots': [1, 4], 'phonetic': 'Letter C', 'desc': 'Dots 1, 4'},
    'd': {'dots': [1, 4, 5], 'phonetic': 'Letter D', 'desc': 'Dots 1, 4, 5'},
    'e': {'dots': [1, 5], 'phonetic': 'Letter E', 'desc': 'Dots 1, 5'},
    'f': {'dots': [1, 2, 4], 'phonetic': 'Letter F', 'desc': 'Dots 1, 2, 4'},
    'g': {'dots': [1, 2, 4, 5], 'phonetic': 'Letter G', 'desc': 'Dots 1, 2, 4, 5'},
    'h': {'dots': [1, 2, 5], 'phonetic': 'Letter H', 'desc': 'Dots 1, 2, 5'},
    'i': {'dots': [2, 4], 'phonetic': 'Letter I', 'desc': 'Dots 2, 4'},
    'j': {'dots': [2, 4, 5], 'phonetic': 'Letter J', 'desc': 'Dots 2, 4, 5'},
    'k': {'dots': [1, 3], 'phonetic': 'Letter K', 'desc': 'Dots 1, 3'},
    'l': {'dots': [1, 2, 3], 'phonetic': 'Letter L', 'desc': 'Dots 1, 2, 3'},
    'm': {'dots': [1, 3, 4], 'phonetic': 'Letter M', 'desc': 'Dots 1, 3, 4'},
    'n': {'dots': [1, 3, 4, 5], 'phonetic': 'Letter N', 'desc': 'Dots 1, 3, 4, 5'},
    'o': {'dots': [1, 3, 5], 'phonetic': 'Letter O', 'desc': 'Dots 1, 3, 5'},
    'p': {'dots': [1, 2, 3, 4], 'phonetic': 'Letter P', 'desc': 'Dots 1, 2, 3, 4'},
    'q': {'dots': [1, 2, 3, 4, 5], 'phonetic': 'Letter Q', 'desc': 'Dots 1, 2, 3, 4, 5'},
    'r': {'dots': [1, 2, 3, 5], 'phonetic': 'Letter R', 'desc': 'Dots 1, 2, 3, 5'},
    's': {'dots': [2, 3, 4], 'phonetic': 'Letter S', 'desc': 'Dots 2, 3, 4'},
    't': {'dots': [2, 3, 4, 5], 'phonetic': 'Letter T', 'desc': 'Dots 2, 3, 4, 5'},
    'u': {'dots': [1, 3, 6], 'phonetic': 'Letter U', 'desc': 'Dots 1, 3, 6'},
    'v': {'dots': [1, 2, 3, 6], 'phonetic': 'Letter V', 'desc': 'Dots 1, 2, 3, 6'},
    'w': {'dots': [2, 4, 5, 6], 'phonetic': 'Letter W', 'desc': 'Dots 2, 4, 5, 6'},
    'x': {'dots': [1, 3, 4, 6], 'phonetic': 'Letter X', 'desc': 'Dots 1, 3, 4, 6'},
    'y': {'dots': [1, 3, 4, 5, 6], 'phonetic': 'Letter Y', 'desc': 'Dots 1, 3, 4, 5, 6'},
    'z': {'dots': [1, 3, 5, 6], 'phonetic': 'Letter Z', 'desc': 'Dots 1, 3, 5, 6'},

    # Nemeth Numbers
    '1': {'dots': [1], 'phonetic': 'Number 1 (एक)', 'desc': 'Dot 1'},
    '2': {'dots': [1, 2], 'phonetic': 'Number 2 (दो)', 'desc': 'Dots 1, 2'},
    '3': {'dots': [1, 4], 'phonetic': 'Number 3 (तीन)', 'desc': 'Dots 1, 4'},
    '4': {'dots': [1, 4, 5], 'phonetic': 'Number 4 (चार)', 'desc': 'Dots 1, 4, 5'},
    '5': {'dots': [1, 5], 'phonetic': 'Number 5 (पाँच)', 'desc': 'Dots 1, 5'},
    '6': {'dots': [1, 2, 4], 'phonetic': 'Number 6 (छह)', 'desc': 'Dots 1, 2, 4'},
    '7': {'dots': [1, 2, 4, 5], 'phonetic': 'Number 7 (सात)', 'desc': 'Dots 1, 2, 4, 5'},
    '8': {'dots': [1, 2, 5], 'phonetic': 'Number 8 (आठ)', 'desc': 'Dots 1, 2, 5'},
    '9': {'dots': [2, 4], 'phonetic': 'Number 9 (नौ)', 'desc': 'Dots 2, 4'},
    '0': {'dots': [2, 4, 5], 'phonetic': 'Number 0 (शून्य)', 'desc': 'Dots 2, 4, 5'},

    # Punctuation & math
    ' ': {'dots': [], 'phonetic': 'Space (खाली जगह)', 'desc': 'Blank cell'},
    ',': {'dots': [2], 'phonetic': 'Comma', 'desc': 'Dot 2'},
    ';': {'dots': [2, 3], 'phonetic': 'Semicolon', 'desc': 'Dots 2, 3'},
    ':': {'dots': [2, 5], 'phonetic': 'Colon', 'desc': 'Dots 2, 5'},
    '.': {'dots': [2, 5, 6], 'phonetic': 'Full Stop / Period', 'desc': 'Dots 2, 5, 6'},
    '?': {'dots': [2, 3, 6], 'phonetic': 'Question Mark', 'desc': 'Dots 2, 3, 6'},
    '!': {'dots': [2, 3, 5], 'phonetic': 'Exclamation', 'desc': 'Dots 2, 3, 5'},
    '+': {'dots': [2, 3, 5], 'phonetic': 'Plus (+)', 'desc': 'Dots 2, 3, 5'},
    '-': {'dots': [3, 6], 'phonetic': 'Minus (-)', 'desc': 'Dots 3, 6'},
    '=': {'dots': [2, 3, 5, 6], 'phonetic': 'Equals (=)', 'desc': 'Dots 2, 3, 5, 6'},
}


class BrailleLessonViewSet(viewsets.ModelViewSet):
    queryset = BrailleLesson.objects.all().order_by('order', 'id')
    serializer_class = BrailleLessonSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        level = self.request.query_params.get('level')
        if category:
            qs = qs.filter(category=category)
        if level:
            qs = qs.filter(level=level)
        return qs


class BrailleProgressViewSet(viewsets.ModelViewSet):
    queryset = BrailleStudentProgress.objects.all().order_by('-last_practiced_at')
    serializer_class = BrailleStudentProgressSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        student_name = self.request.query_params.get('student_name')
        if student_name:
            qs = qs.filter(student_name__iexact=student_name)
        return qs

    @action(detail=False, methods=['post'])
    def record_practice(self, request):
        student_name = request.data.get('student_name', 'Pooja Gurjar')
        lesson_id = request.data.get('lesson_id')
        score = int(request.data.get('score', 0))
        accuracy = float(request.data.get('accuracy_percent', 0.0))
        minutes = int(request.data.get('practice_minutes', 5))
        chars = request.data.get('mastered_chars', [])

        if not lesson_id:
            return Response({'error': 'lesson_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lesson = BrailleLesson.objects.get(id=lesson_id)
        except BrailleLesson.DoesNotExist:
            return Response({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)

        progress, created = BrailleStudentProgress.objects.get_or_create(
            student_name=student_name,
            lesson=lesson,
            defaults={
                'score': score,
                'accuracy_percent': accuracy,
                'practice_minutes': minutes,
                'completed': accuracy >= 80.0,
                'mastered_chars': chars,
                'last_practiced_at': timezone.now()
            }
        )

        if not created:
            progress.score = max(progress.score, score)
            progress.accuracy_percent = max(progress.accuracy_percent, accuracy)
            progress.practice_minutes += minutes
            progress.completed = progress.completed or (accuracy >= 80.0)
            existing_chars = set(progress.mastered_chars or [])
            existing_chars.update(chars)
            progress.mastered_chars = list(existing_chars)
            progress.last_practiced_at = timezone.now()
            progress.save()

        return Response(BrailleStudentProgressSerializer(progress).data, status=status.HTTP_200_OK)


@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def translate_to_braille(request):
    """
    Translates input text (English, Hindi Devanagari, or Numbers) into Braille Unicode
    patterns and provides 6-dot matrix breakdown for tactile simulation.
    """
    if request.method == 'GET':
        text = request.query_params.get('text', 'नमस्ते Vidya Setu 123')
    else:
        text = request.data.get('text', '')

    if not text:
        return Response({
            'text': '',
            'braille_unicode': '',
            'cells': [],
            'total_characters': 0
        })

    cells = []
    unicode_chars = []

    # Number sign in Braille
    NUMBER_SIGN_DOTS = [3, 4, 5, 6]
    NUMBER_SIGN_UNICODE = '⠼'

    in_number_mode = False

    for ch in text:
        lower_ch = ch.lower()

        # Check if digit
        if ch.isdigit():
            if not in_number_mode:
                # Add number indicator cell
                cells.append({
                    'char': '#',
                    'dots': NUMBER_SIGN_DOTS,
                    'unicode': NUMBER_SIGN_UNICODE,
                    'phonetic': 'Number Sign (संख्या संकेत)',
                    'desc': 'Dots 3, 4, 5, 6'
                })
                unicode_chars.append(NUMBER_SIGN_UNICODE)
                in_number_mode = True
        else:
            in_number_mode = False

        if ch in BHARATI_BRAILLE_MAP:
            info = BHARATI_BRAILLE_MAP[ch]
            u_char = dots_to_braille_unicode(info['dots'])
            cells.append({
                'char': ch,
                'dots': info['dots'],
                'unicode': u_char,
                'phonetic': info['phonetic'],
                'desc': info['desc']
            })
            unicode_chars.append(u_char)
        elif lower_ch in BHARATI_BRAILLE_MAP:
            info = BHARATI_BRAILLE_MAP[lower_ch]
            u_char = dots_to_braille_unicode(info['dots'])
            cells.append({
                'char': ch,
                'dots': info['dots'],
                'unicode': u_char,
                'phonetic': info['phonetic'],
                'desc': info['desc']
            })
            unicode_chars.append(u_char)
        else:
            # Fallback for unrecognized glyphs
            cells.append({
                'char': ch,
                'dots': [],
                'unicode': '⠀',
                'phonetic': f"Symbol '{ch}'",
                'desc': 'Unmapped'
            })
            unicode_chars.append('⠀')

    return Response({
        'original_text': text,
        'braille_unicode': ''.join(unicode_chars),
        'cells': cells,
        'total_cells': len(cells),
        'timestamp': timezone.now().isoformat()
    })


# ===========================================================================
# 3.3 to 3.25 ENTERPRISE & ADMINISTRATIVE MANAGEMENT VIEWSETS
# ===========================================================================

class RolePermissionMatrixViewSet(viewsets.ModelViewSet):
    queryset = RolePermissionMatrix.objects.all().order_by('id')
    serializer_class = RolePermissionMatrixSerializer


class TeacherProfileViewSet(viewsets.ModelViewSet):
    queryset = TeacherProfile.objects.all().order_by('-joining_date')
    serializer_class = TeacherProfileSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        school_id = self.request.query_params.get('school')
        if school_id:
            qs = qs.filter(school_id=school_id)
        return qs


class ParentProfileViewSet(viewsets.ModelViewSet):
    queryset = ParentProfile.objects.all().order_by('id')
    serializer_class = ParentProfileSerializer


class ParentMeetingNoticeViewSet(viewsets.ModelViewSet):
    queryset = ParentMeetingNotice.objects.all().order_by('-created_at')
    serializer_class = ParentMeetingNoticeSerializer


class ParentCommunicationViewSet(viewsets.ModelViewSet):
    queryset = ParentCommunication.objects.all().order_by('-created_at')
    serializer_class = ParentCommunicationSerializer


class AcademicClassViewSet(viewsets.ModelViewSet):
    queryset = AcademicClass.objects.all().order_by('grade', 'section')
    serializer_class = AcademicClassSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        school_id = self.request.query_params.get('school')
        if school_id:
            qs = qs.filter(school_id=school_id)
        return qs


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by('grade', 'code')
    serializer_class = SubjectSerializer


class CourseAllocationViewSet(viewsets.ModelViewSet):
    queryset = CourseAllocation.objects.all().order_by('id')
    serializer_class = CourseAllocationSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        school_id = self.request.query_params.get('school')
        if school_id:
            qs = qs.filter(school_id=school_id)
        return qs


class OnlineDigitalCourseViewSet(viewsets.ModelViewSet):
    queryset = OnlineDigitalCourse.objects.all().order_by('-created_at')
    serializer_class = OnlineDigitalCourseSerializer


class OfflineContentPackageViewSet(viewsets.ModelViewSet):
    queryset = OfflineContentPackage.objects.all().order_by('-last_cached_at')
    serializer_class = OfflineContentPackageSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        school_id = self.request.query_params.get('school')
        if school_id:
            qs = qs.filter(school_id=school_id)
        return qs


class SmartClassroomEquipmentViewSet(viewsets.ModelViewSet):
    queryset = SmartClassroomEquipment.objects.all().order_by('room_name')
    serializer_class = SmartClassroomEquipmentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        school_id = self.request.query_params.get('school')
        status_filter = self.request.query_params.get('health_status')
        if school_id:
            qs = qs.filter(school_id=school_id)
        if status_filter:
            qs = qs.filter(health_status=status_filter)
        return qs


class TeacherAttendanceViewSet(viewsets.ModelViewSet):
    queryset = TeacherAttendanceRecord.objects.all().order_by('-date')
    serializer_class = TeacherAttendanceRecordSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        school_id = self.request.query_params.get('school')
        if school_id:
            qs = qs.filter(school_id=school_id)
        return qs


class OnlineExamViewSet(viewsets.ModelViewSet):
    queryset = OnlineExam.objects.all().order_by('-exam_date')
    serializer_class = OnlineExamSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        school_id = self.request.query_params.get('school')
        if school_id:
            qs = qs.filter(school_id=school_id)
        return qs


class ExamQuestionViewSet(viewsets.ModelViewSet):
    queryset = ExamQuestion.objects.all().order_by('id')
    serializer_class = ExamQuestionSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        exam_id = self.request.query_params.get('exam')
        if exam_id:
            qs = qs.filter(exam_id=exam_id)
        return qs


class ExamResultViewSet(viewsets.ModelViewSet):
    queryset = ExamResult.objects.all().order_by('-evaluated_at')
    serializer_class = ExamResultSerializer


class StudentReportCardViewSet(viewsets.ModelViewSet):
    queryset = StudentReportCard.objects.all().order_by('-created_at')
    serializer_class = StudentReportCardSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        student_id = self.request.query_params.get('student')
        if student_id:
            qs = qs.filter(student_id=student_id)
        return qs


class ConnectivityAuditViewSet(viewsets.ModelViewSet):
    queryset = ConnectivityAuditMetric.objects.all().order_by('-timestamp')
    serializer_class = ConnectivityAuditMetricSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        school_id = self.request.query_params.get('school')
        if school_id:
            qs = qs.filter(school_id=school_id)
        return qs


class ScholarshipSchemeViewSet(viewsets.ModelViewSet):
    queryset = ScholarshipScheme.objects.all().order_by('id')
    serializer_class = ScholarshipSchemeSerializer


class ScholarshipApplicationViewSet(viewsets.ModelViewSet):
    queryset = ScholarshipApplication.objects.all().order_by('-applied_date')
    serializer_class = ScholarshipApplicationSerializer

    @action(detail=True, methods=['post'])
    def approve_application(self, request, pk=None):
        app = self.get_object()
        app.verification_stage = 'deo_approved'
        app.save()
        AuditTrailLog.objects.create(
            user_name=request.user.username if request.user.is_authenticated else 'deo_alwar',
            user_role='deo',
            action='APPROVE',
            target_model='ScholarshipApplication',
            record_id=str(app.id),
            description=f'DEO sanctioned scholarship {app.scholarship.name} for {app.student.name}'
        )
        return Response(ScholarshipApplicationSerializer(app).data)

    @action(detail=True, methods=['post'])
    def disburse_dbt(self, request, pk=None):
        app = self.get_object()
        app.verification_stage = 'dbt_disbursed'
        app.dbt_transaction_ref = f'DBT-RBI-{timezone.now().strftime("%Y%m%d")}-{app.id:04d}'
        app.disbursed_at = timezone.now()
        app.save()
        AuditTrailLog.objects.create(
            user_name=request.user.username if request.user.is_authenticated else 'deo_alwar',
            user_role='deo',
            action='DISBURSE',
            target_model='ScholarshipApplication',
            record_id=str(app.id),
            description=f'DBT ₹{app.scholarship.amount_per_annum_inr} disbursed to student bank a/c ending {app.dbt_bank_account_last4}'
        )
        return Response(ScholarshipApplicationSerializer(app).data)


class BroadcastNotificationViewSet(viewsets.ModelViewSet):
    queryset = BroadcastNotification.objects.all().order_by('-created_at')
    serializer_class = BroadcastNotificationSerializer


class GrievanceTicketViewSet(viewsets.ModelViewSet):
    queryset = GrievanceTicket.objects.all().order_by('-created_at')
    serializer_class = GrievanceTicketSerializer

    @action(detail=True, methods=['post'])
    def resolve_ticket(self, request, pk=None):
        ticket = self.get_object()
        notes = request.data.get('resolution_notes', 'Issue addressed and resolved on-site.')
        ticket.status = 'resolved'
        ticket.resolution_notes = notes
        ticket.resolved_at = timezone.now()
        ticket.save()
        AuditTrailLog.objects.create(
            user_name=request.user.username if request.user.is_authenticated else 'deo_admin',
            user_role='deo',
            action='RESOLVE',
            target_model='GrievanceTicket',
            record_id=ticket.ticket_number,
            description=f'Grievance {ticket.ticket_number} resolved: {notes}'
        )
        return Response(GrievanceTicketSerializer(ticket).data)


class GeneratedReportViewSet(viewsets.ModelViewSet):
    queryset = GeneratedReport.objects.all().order_by('-created_at')
    serializer_class = GeneratedReportSerializer

    @action(detail=False, methods=['post'])
    def generate_report(self, request):
        report_type = request.data.get('report_type', 'udise_plus')
        school_id = request.data.get('school')
        school = School.objects.get(id=school_id) if school_id else School.objects.first()

        titles = {
            'udise_plus': f'Unified District Information System (UDISE+) Compliance - {school.name}',
            'midday_meal_monthly': f'PM-POSHAN Mid-Day Meal Nutrition Audit - {school.village}',
            'attendance_muster': f'Digital Biometric Attendance Muster Roll - {school.name}',
            'scholarship_dbt': f'District DBT Beneficiary Disbursal Register - {school.district}',
            'infrastructure_audit': f'Solar Microgrid & Smart Equipment Health Audit - {school.name}',
            'academic_term_exam': f'Summative Academic Marks Registry - {school.name}'
        }

        report = GeneratedReport.objects.create(
            school=school,
            report_type=report_type,
            title=titles.get(report_type, f'Custom System Report - {school.name}'),
            format_type=request.data.get('format', 'PDF'),
            file_size_kb=312,
            generated_by=request.user.username if request.user.is_authenticated else 'DEO Portal Admin',
            data_summary={
                'school': school.name,
                'udise': school.udise_code,
                'students_count': school.total_students,
                'attendance_avg': 93.4,
                'generated_at': timezone.now().isoformat()
            }
        )
        AuditTrailLog.objects.create(
            user_name=request.user.username if request.user.is_authenticated else 'portal_admin',
            user_role='deo',
            action='GENERATE_REPORT',
            target_model='GeneratedReport',
            record_id=str(report.id),
            description=f'Exported {report.title} in {report.format_type} format'
        )
        return Response(GeneratedReportSerializer(report).data, status=status.HTTP_201_CREATED)


class SystemConfigurationViewSet(viewsets.ModelViewSet):
    queryset = SystemConfiguration.objects.all().order_by('category', 'config_key')
    serializer_class = SystemConfigurationSerializer


class AuditTrailLogViewSet(viewsets.ModelViewSet):
    queryset = AuditTrailLog.objects.all().order_by('-timestamp')
    serializer_class = AuditTrailLogSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def enterprise_analytics(request):
    """
    3.22 Comprehensive Analytics Engine
    Aggregates KPIs across all connected rural schools in the district cluster.
    """
    schools = School.objects.all()
    students = Student.objects.all()
    teachers = TeacherProfile.objects.all()
    exams = OnlineExam.objects.all()
    scholarships = ScholarshipApplication.objects.all()
    grievances = GrievanceTicket.objects.all()
    equipment = SmartClassroomEquipment.objects.all()

    total_schools = schools.count()
    total_students = students.count()
    total_teachers = teachers.count() or 1
    female_students = students.filter(gender='Female').count()
    male_students = students.filter(gender='Male').count()

    total_solar_kw = sum(s.solar_capacity_kw for s in schools)
    avg_battery = sum(s.battery_percentage for s in schools) / max(total_schools, 1)

    online_schools = schools.filter(connectivity_status='online').count()
    intermittent_schools = schools.filter(connectivity_status='intermittent').count()
    offline_schools = schools.filter(connectivity_status='offline').count()

    dbt_disbursed_count = scholarships.filter(verification_stage='dbt_disbursed').count()
    dbt_disbursed_amount = dbt_disbursed_count * 12000

    resolved_grievances = grievances.filter(status='resolved').count()
    open_grievances = grievances.filter(status='open').count()

    healthy_equipment = equipment.filter(health_status='healthy').count()
    warning_equipment = equipment.filter(health_status='warning').count()
    critical_equipment = equipment.filter(health_status='critical').count()

    return Response({
        'cluster_summary': {
            'total_schools': total_schools,
            'total_students': total_students,
            'total_teachers': total_teachers,
            'student_teacher_ratio': round(total_students / total_teachers, 1),
            'female_ratio_percent': round((female_students / max(total_students, 1)) * 100, 1),
            'attendance_rate_cluster': 92.8,
            'midday_meal_served_today': round(total_students * 0.94)
        },
        'connectivity_grid': {
            'online_count': online_schools,
            'intermittent_count': intermittent_schools,
            'offline_count': offline_schools,
            'avg_latency_ms': 42,
            'uptime_percentage': 98.4
        },
        'solar_energy_iot': {
            'total_solar_kw': round(total_solar_kw, 1),
            'avg_battery_health': round(avg_battery, 1),
            'daily_clean_units_kwh': round(total_solar_kw * 4.6, 1),
            'co2_saved_kg_monthly': round(total_solar_kw * 135)
        },
        'scholarships_dbt': {
            'total_applications': scholarships.count(),
            'approved_count': scholarships.filter(verification_stage__in=['deo_approved', 'dbt_disbursed']).count(),
            'disbursed_count': dbt_disbursed_count,
            'total_funds_disbursed_inr': dbt_disbursed_amount,
            'disbursement_rate_percent': round((dbt_disbursed_count / max(scholarships.count(), 1)) * 100, 1)
        },
        'grievance_redressal': {
            'total_tickets': grievances.count(),
            'resolved_count': resolved_grievances,
            'open_count': open_grievances,
            'avg_resolution_hours': 36
        },
        'smart_hardware_health': {
            'healthy': healthy_equipment,
            'maintenance_due': warning_equipment,
            'critical_down': critical_equipment,
            'overall_health_index': 96.2
        },
        'dropout_risk_early_warning': [
            {'category': 'High Risk (<70% Attendance)', 'students_count': 12, 'action': 'Panchayat & Teacher Home Visit Triggered'},
            {'category': 'Moderate Risk (Migrant Season)', 'students_count': 28, 'action': 'Edge Offline Video Packs Dispatched'},
            {'category': 'Safe & High Engagement', 'students_count': total_students - 40, 'action': 'Scholarship Accelerated'}
        ]
    })




