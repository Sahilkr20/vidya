from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth.models import User
from core.models import (
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

class Command(BaseCommand):
    help = 'Seeds realistic demonstration data for Vidya Setu Smart Rural Education Platform'

    def handle(self, *args, **options):
        self.stdout.write('Clearing existing platform data...')
        School.objects.all().delete()
        LearningResource.objects.all().delete()

        self.stdout.write('Creating rural smart schools...')
        
        # School 1: Rajasthan (Primary demo school)
        s1 = School.objects.create(
            name="GSSS Khedla Smart Vidya Kendra",
            village="Khedla",
            block="Ramgarh Block",
            district="Alwar",
            state="Rajasthan",
            udise_code="08060104502",
            solar_capacity_kw=4.2,
            solar_output_watts=2650,
            battery_percentage=92,
            power_source="solar",
            grid_power_available=True,
            connectivity_type="bharatnet_fiber",
            connectivity_status="online",
            latency_ms=38,
            bandwidth_kbps=5200,
            data_saver_mode=True,
            edge_server_ip="192.168.10.1",
            edge_server_status="Operational (RPi 5 Edge Hub)",
            edge_storage_used_gb=138.4,
            edge_storage_total_gb=256.0,
            smart_classrooms_count=4,
            total_students=286,
            total_teachers=12,
            last_synced_at=timezone.now()
        )

        # School 2: Sundarbans, West Bengal (Offgrid satellite)
        s2 = School.objects.create(
            name="Sundarbans Adarsh Ashram Shala",
            village="Gosaba Island",
            block="Canning Block II",
            district="South 24 Parganas",
            state="West Bengal",
            udise_code="19180203101",
            solar_capacity_kw=5.0,
            solar_output_watts=3100,
            battery_percentage=78,
            power_source="solar",
            grid_power_available=False,
            connectivity_type="vsat_satellite",
            connectivity_status="intermittent",
            latency_ms=640,
            bandwidth_kbps=450,
            data_saver_mode=True,
            edge_server_ip="192.168.20.1",
            edge_server_status="Operational (Solar Edge Caching)",
            edge_storage_used_gb=210.5,
            edge_storage_total_gb=256.0,
            smart_classrooms_count=3,
            total_students=315,
            total_teachers=10,
            last_synced_at=timezone.now()
        )

        # School 3: Bastar, Chhattisgarh (Tribal area edge server)
        s3 = School.objects.create(
            name="Bastar Tribal Digital Gurukul",
            village="Tokapal",
            block="Bastar Block",
            district="Bastar",
            state="Chhattisgarh",
            udise_code="22140301905",
            solar_capacity_kw=3.0,
            solar_output_watts=1820,
            battery_percentage=85,
            power_source="hybrid",
            grid_power_available=True,
            connectivity_type="4g_5g_cpe",
            connectivity_status="online",
            latency_ms=85,
            bandwidth_kbps=1800,
            data_saver_mode=True,
            edge_server_ip="192.168.30.1",
            edge_server_status="Operational",
            edge_storage_used_gb=112.0,
            edge_storage_total_gb=256.0,
            smart_classrooms_count=2,
            total_students=194,
            total_teachers=8,
            last_synced_at=timezone.now()
        )

        # School 4: Western Ghats, Maharashtra
        s4 = School.objects.create(
            name="Zilla Parishad High School Velhe",
            village="Velhe",
            block="Velhe Block",
            district="Pune",
            state="Maharashtra",
            udise_code="27250402201",
            solar_capacity_kw=3.5,
            solar_output_watts=2200,
            battery_percentage=94,
            power_source="solar",
            grid_power_available=True,
            connectivity_type="bharatnet_fiber",
            connectivity_status="online",
            latency_ms=29,
            bandwidth_kbps=8500,
            data_saver_mode=False,
            edge_server_ip="192.168.40.1",
            edge_server_status="Operational",
            edge_storage_used_gb=95.2,
            edge_storage_total_gb=256.0,
            smart_classrooms_count=4,
            total_students=240,
            total_teachers=9,
            last_synced_at=timezone.now()
        )

        self.stdout.write('Creating IoT & Infrastructure Telemetry...')
        # Telemetry for s1
        DeviceTelemetry.objects.create(
            school=s1,
            device_name="Solar Inverter 4.2kW MPPT",
            device_category="solar_power",
            status="healthy",
            metric_label="Active Generation",
            metric_value="2,650 Watts (Peak Sun)",
            health_score=98
        )
        DeviceTelemetry.objects.create(
            school=s1,
            device_name="Tubular Gel Battery Bank (48V 200Ah)",
            device_category="solar_power",
            status="healthy",
            metric_label="Battery Charge & Health",
            metric_value="92% (52.8V Nominal)",
            health_score=94
        )
        DeviceTelemetry.objects.create(
            school=s1,
            device_name="Local Edge Server (Raspberry Pi 5 8GB)",
            device_category="edge_compute",
            status="healthy",
            metric_label="CPU Temp & Cache Utilization",
            metric_value="42°C | 138 GB / 256 GB NVMe",
            health_score=97
        )
        DeviceTelemetry.objects.create(
            school=s1,
            device_name="BharatNet GPON Fiber ONT",
            device_category="connectivity",
            status="healthy",
            metric_label="Optical Link Rx Power",
            metric_value="-19.2 dBm | Ping 38ms",
            health_score=95
        )
        DeviceTelemetry.objects.create(
            school=s1,
            device_name="Classroom 1 Interactive Laser Projector",
            device_category="display_av",
            status="healthy",
            metric_label="Lamp Status & Runtime",
            metric_value="Eco Mode | 412 Hrs Logged",
            health_score=92
        )
        DeviceTelemetry.objects.create(
            school=s1,
            device_name="Smart Gate RFID Attendance Scanner",
            device_category="biometric",
            status="healthy",
            metric_label="Scans Today",
            metric_value="264 Students Verified",
            health_score=99
        )
        DeviceTelemetry.objects.create(
            school=s1,
            device_name="Classroom Environmental Air & Temp Sensor",
            device_category="environmental",
            status="healthy",
            metric_label="Indoor Climate",
            metric_value="27.4°C | 48% RH | AQI 42 (Good)",
            health_score=96
        )

        self.stdout.write('Creating Curated Educational Resources & Offline Modules...')
        resources_data = [
            {
                "title": "Solar Energy, Circuits & Clean Tech Fundamentals",
                "grade": 8,
                "subject": "Science & Innovation",
                "language": "Hindi",
                "resource_type": "video",
                "file_size_mb": 18.4,
                "duration_mins": 22,
                "is_cached_locally": True,
                "curriculum_standard": "NCERT Class 8 - Chapter 14",
                "description": "Explains how solar photovoltaic panels convert sunlight into DC current, battery storage chemistry, and practical applications in rural communities.",
                "content_payload": {
                    "summary": "Covers photovoltaic cells, inverter working, parallel vs series circuits, and hands-on multimeter testing.",
                    "key_takeaways": [
                        "Photovoltaic effect releases electrons when photons hit silicon wafers.",
                        "Inverters convert Direct Current (DC) from batteries to Alternating Current (AC) for appliances.",
                        "Proper solar panel tilt matches the latitude of the village for peak winter/summer irradiance."
                    ],
                    "quiz_questions": [
                        {"q": "What type of electrical current do solar panels produce directly?", "options": ["Direct Current (DC)", "Alternating Current (AC)", "Static Magnetic Pulse", "Three-phase Current"], "answer": 0},
                        {"q": "Which device converts DC battery power to AC for school projectors?", "options": ["Inverter", "Transformer", "Capacitor", "Galvanometer"], "answer": 0}
                    ]
                }
            },
            {
                "title": "Vedic Mathematics: Rapid Mental Math & Multiplication",
                "grade": 7,
                "subject": "Mathematics",
                "language": "Hindi",
                "resource_type": "simulation",
                "file_size_mb": 12.0,
                "duration_mins": 18,
                "is_cached_locally": True,
                "curriculum_standard": "NEP 2020 Foundational Numeracy",
                "description": "Learn the 'Urdhva Tiryagbhyam' (Vertically and Crosswise) formula to multiply 2-digit and 3-digit numbers in under 5 seconds without paper.",
                "content_payload": {
                    "summary": "Master fast cross-multiplication, base-100 shortcuts, and check answers using the digital root (Navasesh) method.",
                    "key_takeaways": [
                        "Multiply digits vertically, then cross-multiply and add.",
                        "Helps rural students compute mental sums in competitive scholarship exams.",
                        "Reduces reliance on paper in remote classrooms."
                    ],
                    "quiz_questions": [
                        {"q": "What is the product of 96 × 94 using base 100 method?", "options": ["9024", "9014", "9124", "8924"], "answer": 0}
                    ]
                }
            },
            {
                "title": "Rainwater Harvesting & Ground Water Recharging",
                "grade": 7,
                "subject": "Environmental Studies",
                "language": "Marathi",
                "resource_type": "video",
                "file_size_mb": 22.5,
                "duration_mins": 20,
                "is_cached_locally": True,
                "curriculum_standard": "Maharashtra SCERT Geography",
                "description": "Rooftop water collection, silt filtration pit design, and revitalizing village borewells to fight seasonal drought.",
                "content_payload": {
                    "summary": "Detailed schematic animation of PVC pipe connections from school tin roofs into gravel-sand recharge wells.",
                    "key_takeaways": [
                        "Filters using charcoal, gravel, and sand remove 90% of suspended organic solids.",
                        "Recharging 100,000 liters during monsoon ensures round-the-year school drinking water."
                    ],
                    "quiz_questions": [
                        {"q": "Which natural material adsorbs odors and chemical residues in water filters?", "options": ["Activated Charcoal", "Granite Chips", "Clay Soil", "Limestone"], "answer": 0}
                    ]
                }
            },
            {
                "title": "Sundarbans Mangrove Ecology & Tidal Biodiversity",
                "grade": 9,
                "subject": "Biology & Ecology",
                "language": "Bengali",
                "resource_type": "audio",
                "file_size_mb": 9.2,
                "duration_mins": 25,
                "is_cached_locally": True,
                "curriculum_standard": "West Bengal Board Class 9 Life Sciences",
                "description": "Vernacular audio documentary detailing pneumatophore breathing roots, Royal Bengal Tiger conservation, and cyclonic storm surge protection.",
                "content_payload": {
                    "summary": "Audio lesson recorded in native Bengali dialect with natural forest sounds and environmental scientists.",
                    "key_takeaways": [
                        "Pneumatophores rise vertically to breathe in oxygen-deficient estuarine mud.",
                        "Dense mangrove roots absorb up to 66% of cyclone wave energy."
                    ]
                }
            },
            {
                "title": "Foundational Coding & Algorithms Without Internet",
                "grade": 6,
                "subject": "Digital & Vocational Skills",
                "language": "English",
                "resource_type": "simulation",
                "file_size_mb": 15.8,
                "duration_mins": 30,
                "is_cached_locally": True,
                "curriculum_standard": "Atal Tinkering Labs / PM-SHRI Curriculum",
                "description": "Block-based visual programming logic, loops, conditionals, and game creation executed locally on the Raspberry Pi edge server.",
                "content_payload": {
                    "summary": "Zero-bandwidth interactive coding environment running completely on classroom local Wi-Fi.",
                    "key_takeaways": [
                        "Sequencing: step-by-step instructions computers follow in order.",
                        "Conditionals: If-Then statements to automate classroom appliances."
                    ],
                    "quiz_questions": [
                        {"q": "Which programming construct repeats a command until a condition is met?", "options": ["Loop", "Variable", "Comment", "Constant"], "answer": 0}
                    ]
                }
            },
            {
                "title": "Human Anatomy & 3D Interactive Organ Systems",
                "grade": 10,
                "subject": "Science & Innovation",
                "language": "Hindi",
                "resource_type": "video",
                "file_size_mb": 31.0,
                "duration_mins": 28,
                "is_cached_locally": False,
                "curriculum_standard": "NCERT Class 10 - Life Processes",
                "description": "3D visualization of double circulation, pulmonary and systemic circuits, heart valves, and blood pressure monitoring.",
                "content_payload": {
                    "summary": "Interactive medical-grade model with vernacular Hindi commentary.",
                    "key_takeaways": [
                        "Oxygenated blood returns from lungs through pulmonary veins into left atrium.",
                        "Bicuspid and tricuspid valves prevent backflow of blood during systole."
                    ]
                }
            },
            {
                "title": "Foundational English Grammar & Conversational Phonics",
                "grade": 5,
                "subject": "Language & Literacy",
                "language": "English",
                "resource_type": "worksheet",
                "file_size_mb": 6.4,
                "duration_mins": 15,
                "is_cached_locally": True,
                "curriculum_standard": "NIPUN Bharat Foundational Literacy",
                "description": "Interactive illustrated cards for phonics sounds, simple sentence construction, and daily school conversations.",
                "content_payload": {
                    "summary": "Audio-guided flashcards designed for first-generation English learners.",
                    "key_takeaways": [
                        "Short and long vowel sounds with rhyming practice.",
                        "Simple Subject-Verb-Object everyday sentences."
                    ]
                }
            }
        ]

        for r in resources_data:
            LearningResource.objects.create(**r)

        self.stdout.write('Creating Students & Attendance...')
        students_sample = [
            {"name": "Pooja Gurjar", "roll": "KH-01", "grade": 8, "gender": "Female", "guardian": "Kishan Lal Gurjar", "rfid": "RFID-801", "points": 340, "modules": 14, "att": 96.5},
            {"name": "Aman Meena", "roll": "KH-02", "grade": 8, "gender": "Male", "guardian": "Ramesh Meena", "rfid": "RFID-802", "points": 280, "modules": 11, "att": 94.0},
            {"name": "Sunita Yadav", "roll": "KH-03", "grade": 8, "gender": "Female", "guardian": "Subhash Yadav", "rfid": "RFID-803", "points": 410, "modules": 18, "att": 98.2},
            {"name": "Devendra Singh", "roll": "KH-04", "grade": 8, "gender": "Male", "guardian": "Bhagwan Singh", "rfid": "RFID-804", "points": 190, "modules": 7, "att": 89.0},
            {"name": "Kavita Saini", "roll": "KH-05", "grade": 7, "gender": "Female", "guardian": "Gopal Saini", "rfid": "RFID-701", "points": 320, "modules": 13, "att": 95.0},
            {"name": "Rohit Verma", "roll": "KH-06", "grade": 7, "gender": "Male", "guardian": "Manoj Verma", "rfid": "RFID-702", "points": 230, "modules": 9, "att": 91.5},
            {"name": "Priya Choudhary", "roll": "KH-07", "grade": 6, "gender": "Female", "guardian": "Ramavtar Choudhary", "rfid": "RFID-601", "points": 290, "modules": 12, "att": 97.0},
            {"name": "Mukesh Bheel", "roll": "KH-08", "grade": 6, "gender": "Male", "guardian": "Chhagan Bheel", "rfid": "RFID-602", "points": 180, "modules": 8, "att": 88.0},
        ]

        created_students = []
        for s in students_sample:
            stu = Student.objects.create(
                school=s1,
                name=s["name"],
                roll_number=s["roll"],
                grade=s["grade"],
                gender=s["gender"],
                guardian_name=s["guardian"],
                rfid_card_id=s["rfid"],
                learning_points=s["points"],
                completed_modules=s["modules"],
                attendance_percentage=s["att"]
            )
            created_students.append(stu)

        # Mark attendance for today
        today = timezone.now().date()
        for idx, stu in enumerate(created_students):
            st = 'present' if idx != 3 else 'absent'
            AttendanceRecord.objects.create(
                student=stu,
                school=s1,
                date=today,
                status=st,
                check_in_time="08:42 AM" if st == 'present' else "--",
                synced_to_cloud=True,
                midday_meal_served=(st == 'present')
            )

        self.stdout.write('Creating Maintenance Tickets...')
        MaintenanceTicket.objects.create(
            school=s1,
            ticket_id="TKT-ALW-2026-081",
            equipment_name="Solar Inverter Battery String #2",
            severity="medium",
            status="technician_assigned",
            issue_summary="Battery #3 electrolyte level below nominal threshold",
            description="Routine automated IoT sensor diagnostic flagged specific gravity drop. District solar vendor dispatched for distilled water top-up and cell rebalance.",
            reported_by="IoT Auto Telemetry Monitor",
            technician_contact="Rajesh Sharma (Block Solar Engineer, Mob: +91 98290-XXXXX)"
        )
        MaintenanceTicket.objects.create(
            school=s1,
            ticket_id="TKT-ALW-2026-079",
            equipment_name="Smart Classroom #3 Audio Amplifier",
            severity="low",
            status="resolved",
            issue_summary="Loose 3.5mm AUX jack causing intermittent channel humming",
            description="Replaced with gold-plated shielded audio cable. Tested with Grade 7 Science audio lesson.",
            reported_by="Master Ji Ramesh Meena",
            technician_contact="Local Village IT Sahayak"
        )

        self.stdout.write('Creating Village Community Notices...')
        CommunityNotice.objects.create(
            school=s1,
            title="Evening Adult Digital Literacy & DBT / PM-Kisan Clinic",
            category="digital_literacy",
            event_time="Every Tuesday & Thursday, 5:30 PM - 7:00 PM",
            location="Smart Classroom 1 & Village Wi-Fi Courtyard",
            organizer="Gram Panchayat Khedla & Vidya Setu Student Volunteers",
            description="Hands-on training for village elders, farmers, and women self-help groups on using Aadhaar-enabled payments, checking crop insurance (PMFBY), and digital e-Kyc.",
            is_active=True
        )
        CommunityNotice.objects.create(
            school=s1,
            title="Poshan Abhiyaan: Quarterly Child Health & Eye Checkup Camp",
            category="health_nutrition",
            event_time="Saturday at 10:00 AM",
            location="School Main Assembly Hall",
            organizer="Primary Health Centre (PHC) Ramgarh & Anganwadi Workers",
            description="Free pediatric eye exams, vitamin-A distribution, and Midday Meal nutritional assessment for all primary students and mothers.",
            is_active=True
        )

        self.stdout.write('Creating Edge Offline Sync Queue Items...')
        SyncQueueItem.objects.create(
            school=s1,
            record_type="attendance_batch",
            payload={"batch": "2026-11-03", "students_marked": 284, "midday_meals": 272},
            status="synced",
            synced_at=timezone.now()
        )
        SyncQueueItem.objects.create(
            school=s1,
            record_type="quiz_results_batch",
            payload={"module": "Solar Energy Basics", "students_attempted": 28, "avg_score": 88.5},
            status="queued_offline"
        )

        self.stdout.write('Creating Demo Users for Authentication...')
        # Clear existing demo users if any
        User.objects.filter(username__in=['teacher_ramesh', 'deo_sharma', 'sarpanch_khedla', 'student_pooja']).delete()

        # 1. Rural School Teacher
        u1 = User.objects.create_user(
            username='teacher_ramesh',
            email='ramesh.meena@vidyasetu.gov.in',
            password='vidya123',
            first_name='Ramesh',
            last_name='Meena'
        )
        UserProfile.objects.create(
            user=u1,
            role='teacher',
            full_name='Master Ji Ramesh Meena',
            phone_number='+91 98291-44321',
            school=s1,
            designation='Head Teacher & Digital Facilitator'
        )

        # 2. District Education Officer (DEO)
        u2 = User.objects.create_user(
            username='deo_sharma',
            email='deo.alwar@rajasthan.gov.in',
            password='vidya123',
            first_name='Sunil',
            last_name='Sharma'
        )
        UserProfile.objects.create(
            user=u2,
            role='deo',
            full_name='Dr. Sunil Kumar Sharma, RAS',
            phone_number='+91 94140-55678',
            school=s1,
            designation='District Education Officer (Alwar Cluster)'
        )

        # 3. Gram Panchayat Pradhan
        u3 = User.objects.create_user(
            username='sarpanch_khedla',
            email='pradhan.khedla@panchayat.gov.in',
            password='vidya123',
            first_name='Balwant',
            last_name='Singh'
        )
        UserProfile.objects.create(
            user=u3,
            role='panchayat',
            full_name='Balwant Singh Gurjar',
            phone_number='+91 98295-88990',
            school=s1,
            designation='Sarpanch & Village Education Committee Chair'
        )

        # 4. Rural Student
        u4 = User.objects.create_user(
            username='student_pooja',
            email='pooja.g8@khedlaschool.in',
            password='vidya123',
            first_name='Pooja',
            last_name='Gurjar'
        )
        UserProfile.objects.create(
            user=u4,
            role='student',
            full_name='Pooja Gurjar',
            phone_number='+91 97840-12345',
            school=s1,
            designation='Class 8 Student Leader (Bal Sansad)'
        )

        self.stdout.write('Creating Live Google Meet Classes & Calendar Sync...')
        LiveClassSession.objects.create(
            school=s1,
            teacher_name="Master Ji Ramesh Meena",
            title="Interactive Science: Solar Inverters & DC-to-AC Conversion",
            subject="Science & Innovation",
            grade=8,
            scheduled_time="Today, 11:30 AM",
            duration_mins=45,
            meet_link="https://meet.google.com/setu-vidya-live",
            calendar_sync_url="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vidya+Setu+Live+Science+Class&details=Solar+Inverter+and+Circuits+Demonstration&location=Google+Meet",
            status="live"
        )
        LiveClassSession.objects.create(
            school=s1,
            teacher_name="Master Ji Ramesh Meena",
            title="Vedic Mathematics: Rapid Mental Arithmetic & Fractions",
            subject="Mathematics",
            grade=7,
            scheduled_time="Tomorrow, 10:00 AM",
            duration_mins=40,
            meet_link="https://meet.google.com/math-fast-vedic",
            calendar_sync_url="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vedic+Math+Class&details=Speed+Multiplication+Techniques&location=Google+Meet",
            status="scheduled"
        )
        LiveClassSession.objects.create(
            school=s1,
            teacher_name="Sister Sunita Sharma",
            title="Rainwater Harvesting & Borewell Recharge Case Study",
            subject="Environmental Studies",
            grade=8,
            scheduled_time="Yesterday, 02:00 PM",
            duration_mins=50,
            meet_link="https://meet.google.com/rain-harvest-vidya",
            status="completed",
            recorded_link="https://vidyasetu.local/recordings/rainwater_class8.mp4"
        )

        self.stdout.write('Creating Assignments and Student Submissions...')
        asg1 = Assignment.objects.create(
            school=s1,
            created_by_name="Master Ji Ramesh Meena",
            title="Solar Energy Circuit Diagram & Efficiency Calculation",
            subject="Science & Innovation",
            grade=8,
            description="Draw a neat circuit diagram connecting the classroom rooftop solar PV panel, MPPT charge controller, 48V battery bank, and inverter. Calculate total watt-hours consumed by 4 LED tube lights and 1 laser projector over 5 hours.",
            attachment_name="Solar_Circuits_Assignment_Class8.pdf",
            attachment_type="PDF",
            attachment_url="https://vidyasetu.local/materials/Solar_Circuits_Assignment_Class8.pdf",
            due_date="Tomorrow at 5:00 PM",
            total_points=100
        )
        Assignment.objects.create(
            school=s1,
            created_by_name="Master Ji Ramesh Meena",
            title="Vedic Math Problem Set: Urdhva Tiryagbhyam 20 Sums",
            subject="Mathematics",
            grade=8,
            description="Solve 20 two-digit and three-digit cross multiplication problems using the base-100 Vedic formula. Write step-by-step digital root verification.",
            attachment_name="Vedic_Math_Practice_Sheet.docx",
            attachment_type="DOCX",
            attachment_url="https://vidyasetu.local/materials/Vedic_Math_Practice_Sheet.docx",
            due_date="Friday, 4:00 PM",
            total_points=50
        )

        # Student Submission for asg1
        AssignmentSubmission.objects.create(
            assignment=asg1,
            student_name="Pooja Gurjar",
            student_roll="KH-01",
            submission_text="Completed circuit diagram and calculated 1,450 Watt-Hours total classroom daily load. Diagram drawn in notebook and verified with classroom inverter multimeter.",
            attachment_name="Pooja_Gurjar_Solar_Worksheet.pdf",
            attachment_url="https://vidyasetu.local/submissions/Pooja_Gurjar_Solar_Worksheet.pdf",
            status="graded",
            grade_score=96,
            teacher_feedback="Outstanding circuit clarity and accurate Watt-Hour calculation! Excellent work connecting theory to the school's solar meter."
        )

        self.stdout.write('Creating Class Study Materials & Notes Repository...')
        ClassStudyMaterial.objects.create(
            school=s1,
            uploaded_by_name="Master Ji Ramesh Meena",
            title="Class 8 Science Complete Revision Notes (NCERT Chapter 14)",
            subject="Science & Innovation",
            grade=8,
            file_type="PDF",
            file_name="NCERT_Class8_Science_Ch14_Revision.pdf",
            file_size_mb=4.8,
            download_url="https://vidyasetu.local/materials/NCERT_Class8_Science_Ch14_Revision.pdf",
            downloads_count=42
        )
        ClassStudyMaterial.objects.create(
            school=s1,
            uploaded_by_name="Master Ji Ramesh Meena",
            title="Renewable Energy Slides Presentation for Smart Blackboard",
            subject="Science & Innovation",
            grade=8,
            file_type="PPTX",
            file_name="Solar_Energy_Blackboard_Slides.pptx",
            file_size_mb=12.4,
            download_url="https://vidyasetu.local/materials/Solar_Energy_Blackboard_Slides.pptx",
            downloads_count=29
        )
        ClassStudyMaterial.objects.create(
            school=s1,
            uploaded_by_name="Sister Sunita Sharma",
            title="Vedic Arithmetic Shortcuts Quick Reference Guide",
            subject="Mathematics",
            grade=7,
            file_type="DOCX",
            file_name="Vedic_Math_CheatSheet.docx",
            file_size_mb=2.1,
            download_url="https://vidyasetu.local/materials/Vedic_Math_CheatSheet.docx",
            downloads_count=35
        )

        self.stdout.write('Creating Community Forum Topics and Peer Discussions...')
        t1 = ForumTopic.objects.create(
            school=s1,
            author_name="Master Ji Ramesh Meena",
            author_role="teacher",
            title="Notice: Upcoming Block Science Fair & Solar Demonstration Project",
            subject="Science & Innovation",
            category="announcement",
            content="Students of Class 7 and 8 are invited to submit their science models by next Wednesday. We will be demonstrating how our village school runs 100% on off-grid solar power!",
            is_announcement=True,
            is_pinned=True
        )
        ForumReply.objects.create(
            topic=t1,
            author_name="Pooja Gurjar",
            author_role="student",
            content="Sir, our Study Mate group is building a miniature solar water purifier model! Can we use the science lab multimeter?",
            is_teacher_endorsed=False
        )
        ForumReply.objects.create(
            topic=t1,
            author_name="Master Ji Ramesh Meena",
            author_role="teacher",
            content="Yes Pooja, you and your group can use both the digital multimeter and the demonstration solar cells during recess.",
            is_teacher_endorsed=True
        )

        t2 = ForumTopic.objects.create(
            school=s1,
            author_name="Aman Meena",
            author_role="student",
            title="Question on Ohm's Law: Why does resistance increase with conductor length?",
            subject="Science & Innovation",
            category="academic_query",
            content="Can someone explain in simple terms why a longer wire has more electrical resistance than a shorter wire?",
            is_announcement=False,
            is_pinned=False
        )
        ForumReply.objects.create(
            topic=t2,
            author_name="Master Ji Ramesh Meena",
            author_role="teacher",
            content="Imagine running through a crowded village market. The longer the distance you run, the more people (atoms) you collide with! Similarly, electrons collide with more metal ions in a longer conductor.",
            is_teacher_endorsed=True
        )

        self.stdout.write('Creating Study Mate Groups & Student Goals...')
        StudyMateGroup.objects.create(
            school=s1,
            name="Solar & Electronics Explorers",
            subject="Science & Innovation",
            grade=8,
            description="Peer learning group focusing on practical solar circuits, multimeters, and building zero-cost STEM models.",
            members_count=7,
            meeting_schedule="Tue & Thu at 4:30 PM",
            lead_student="Pooja Gurjar"
        )
        StudyMateGroup.objects.create(
            school=s1,
            name="Vedic Speed Math Circle",
            subject="Mathematics",
            grade=8,
            description="Daily 20-minute mental calculation practice and speed arithmetic drills for competitive rural scholarship exams.",
            members_count=9,
            meeting_schedule="Mon, Wed & Fri at 4:00 PM",
            lead_student="Aman Meena"
        )

        StudentGoal.objects.create(
            student_name="Pooja Gurjar",
            title="Complete Chapter 14 Solar Circuit Assignment",
            target_date="Tomorrow",
            is_completed=True,
            notes="Calculated total Watt-Hours and drew schematic diagram in notebook."
        )
        StudentGoal.objects.create(
            student_name="Pooja Gurjar",
            title="Master 10 Vedic Multiplication Shortcuts",
            target_date="This Friday",
            is_completed=False,
            notes="Practice base-100 and base-50 cross multiplication."
        )
        StudentGoal.objects.create(
            student_name="Pooja Gurjar",
            title="25-minute Pomodoro Science Revision Session",
            target_date="Today",
            is_completed=False,
            notes="Review human heart and double circulation diagram."
        )

        self.stdout.write('Seeding Braille Literacy & Assistive Learning Studio data...')
        BrailleLesson.objects.all().delete()
        BraillePracticeQuiz.objects.all().delete()
        BrailleStudentProgress.objects.all().delete()

        # Lesson 1: Bharati Braille Hindi Vowels
        bl1 = BrailleLesson.objects.create(
            title="Bharati Braille: Hindi Vowels (स्वर ज्ञान व स्पर्श अभ्यास)",
            category="bharati_hindi",
            level="beginner",
            order=1,
            description="Learn the primary 11 Hindi vowels using the standardized Bharati Braille 6-dot matrix. Master phonetics, dot coordinate locations, and tactile perception.",
            characters_data=[
                {"char": "अ", "dots": [1], "unicode": "⠁", "name": "A (अ)", "desc": "Top-left single dot (Dot 1)"},
                {"char": "आ", "dots": [3, 4, 5], "unicode": "⠜", "name": "AA (आ)", "desc": "Dots 3, 4, 5 forming diagonal tactile grip"},
                {"char": "इ", "dots": [2, 4], "unicode": "⠊", "name": "I (इ)", "desc": "Dots 2 and 4 (diagonal mid-dots)"},
                {"char": "ई", "dots": [3, 5], "unicode": "⠔", "name": "EE (ई)", "desc": "Dots 3 and 5 (lower diagonal)"},
                {"char": "उ", "dots": [1, 3, 6], "unicode": "⠥", "name": "U (उ)", "desc": "Dots 1, 3 on left and 6 on right"},
                {"char": "ऊ", "dots": [1, 2, 5, 6], "unicode": "⠳", "name": "OO (ऊ)", "desc": "Dots 1, 2, 5, 6 corner cluster"},
                {"char": "ए", "dots": [1, 5], "unicode": "⠑", "name": "E (ए)", "desc": "Dots 1 and 5 (cross corners)"},
                {"char": "ऐ", "dots": [3, 4], "unicode": "⠌", "name": "AI (ऐ)", "desc": "Dots 3 and 4 (inner bottom & top-right)"},
                {"char": "ओ", "dots": [1, 3, 5], "unicode": "⠕", "name": "O (ओ)", "desc": "Dots 1, 3, 5 (full left border + center right)"},
                {"char": "औ", "dots": [2, 4, 6], "unicode": "⠪", "name": "AU (औ)", "desc": "Dots 2, 4, 6 (inverted diagonal column)"},
                {"char": "ं", "dots": [5, 6], "unicode": "⠰", "name": "Anusvara (ं)", "desc": "Dots 5, 6 (right column bottom)"},
                {"char": "ः", "dots": [6], "unicode": "⠠", "name": "Visarga (ः)", "desc": "Dot 6 (bottom right)"}
            ]
        )

        BraillePracticeQuiz.objects.create(
            lesson=bl1,
            prompt="Which dot combination represents Hindi vowel 'अ' in Bharati Braille?",
            target_char="अ",
            expected_dots=[1],
            braille_unicode="⠁",
            audio_hint="Dot 1 alone at the top left of the Braille cell.",
            options=[
                {"label": "Dot 1 (Top Left)", "dots": [1], "correct": True},
                {"label": "Dots 1, 2", "dots": [1, 2], "correct": False},
                {"label": "Dots 2, 4", "dots": [2, 4], "correct": False},
                {"label": "Dots 1, 5", "dots": [1, 5], "correct": False}
            ],
            explanation="In Bharati Braille, 'अ' is represented by Dot 1, the identical fundamental cell as English letter 'A'."
        )

        BraillePracticeQuiz.objects.create(
            lesson=bl1,
            prompt="Identify the vowel represented by Dots 1, 3, 5 (⠕):",
            target_char="ओ",
            expected_dots=[1, 3, 5],
            braille_unicode="⠕",
            audio_hint="Sound like 'Om' or 'Okhli'.",
            options=[
                {"label": "इ (I)", "dots": [2, 4], "correct": False},
                {"label": "ओ (O)", "dots": [1, 3, 5], "correct": True},
                {"label": "उ (U)", "dots": [1, 3, 6], "correct": False},
                {"label": "आ (AA)", "dots": [3, 4, 5], "correct": False}
            ],
            explanation="Dots 1, 3, 5 form the letter 'ओ' (also corresponds to English 'O')."
        )

        # Lesson 2: Bharati Braille Hindi Consonants
        bl2 = BrailleLesson.objects.create(
            title="Bharati Braille: Hindi Consonants (व्यंजन वर्ग व शब्द रचना)",
            category="bharati_hindi",
            level="intermediate",
            order=2,
            description="Comprehensive guide to Hindi consonants from 'क' to 'ह', including conjunct indicators and pronunciation guidance.",
            characters_data=[
                {"char": "क", "dots": [1, 3], "unicode": "⠅", "name": "KA (क)", "desc": "Dots 1, 3"},
                {"char": "ख", "dots": [4, 6], "unicode": "⠨", "name": "KHA (ख)", "desc": "Dots 4, 6"},
                {"char": "ग", "dots": [1, 2, 4, 5], "unicode": "⠛", "name": "GA (ग)", "desc": "Dots 1, 2, 4, 5 (four-corner square)"},
                {"char": "घ", "dots": [1, 2, 6], "unicode": "⠣", "name": "GHA (घ)", "desc": "Dots 1, 2, 6"},
                {"char": "च", "dots": [1, 4], "unicode": "⠉", "name": "CHA (च)", "desc": "Dots 1, 4 (top horizontal pair)"},
                {"char": "छ", "dots": [1, 6], "unicode": "⠡", "name": "CHHA (छ)", "desc": "Dots 1, 6"},
                {"char": "ज", "dots": [2, 4, 5], "unicode": "⠚", "name": "JA (ज)", "desc": "Dots 2, 4, 5"},
                {"char": "झ", "dots": [3, 5, 6], "unicode": "⠴", "name": "JHA (झ)", "desc": "Dots 3, 5, 6"},
                {"char": "त", "dots": [2, 3, 4, 5], "unicode": "⠞", "name": "TA (त)", "desc": "Dots 2, 3, 4, 5"},
                {"char": "थ", "dots": [1, 4, 5, 6], "unicode": "⠹", "name": "THA (थ)", "desc": "Dots 1, 4, 5, 6"},
                {"char": "द", "dots": [1, 4, 5], "unicode": "⠙", "name": "DA (द)", "desc": "Dots 1, 4, 5"},
                {"char": "ध", "dots": [2, 3, 4, 6], "unicode": "⠮", "name": "DHA (ध)", "desc": "Dots 2, 3, 4, 6"},
                {"char": "न", "dots": [1, 3, 4, 5], "unicode": "⠝", "name": "NA (न)", "desc": "Dots 1, 3, 4, 5"},
                {"char": "प", "dots": [1, 2, 3, 4], "unicode": "⠏", "name": "PA (प)", "desc": "Dots 1, 2, 3, 4"},
                {"char": "फ", "dots": [2, 3, 5], "unicode": "⠖", "name": "PHA (फ)", "desc": "Dots 2, 3, 5"},
                {"char": "ब", "dots": [1, 2], "unicode": "⠃", "name": "BA (ब)", "desc": "Dots 1, 2"},
                {"char": "भ", "dots": [4, 5], "unicode": "⠘", "name": "BHA (भ)", "desc": "Dots 4, 5"},
                {"char": "म", "dots": [1, 3, 4], "unicode": "⠍", "name": "MA (म)", "desc": "Dots 1, 3, 4"},
                {"char": "य", "dots": [1, 3, 4, 5, 6], "unicode": "⠽", "name": "YA (य)", "desc": "Dots 1, 3, 4, 5, 6"},
                {"char": "र", "dots": [1, 2, 3, 5], "unicode": "⠗", "name": "RA (र)", "desc": "Dots 1, 2, 3, 5"},
                {"char": "ल", "dots": [1, 2, 3], "unicode": "⠇", "name": "LA (ल)", "desc": "Dots 1, 2, 3 (left vertical bar)"},
                {"char": "व", "dots": [1, 2, 3, 6], "unicode": "⠧", "name": "VA (व)", "desc": "Dots 1, 2, 3, 6"},
                {"char": "स", "dots": [2, 3, 4], "unicode": "⠎", "name": "SA (स)", "desc": "Dots 2, 3, 4"},
                {"char": "ह", "dots": [1, 2, 5], "unicode": "⠓", "name": "HA (ह)", "desc": "Dots 1, 2, 5"}
            ]
        )

        BraillePracticeQuiz.objects.create(
            lesson=bl2,
            prompt="What dots form the Devanagari consonant 'क' (KA)?",
            target_char="क",
            expected_dots=[1, 3],
            braille_unicode="⠅",
            audio_hint="First and third dots on the left column.",
            options=[
                {"label": "Dots 1, 3", "dots": [1, 3], "correct": True},
                {"label": "Dots 1, 2", "dots": [1, 2], "correct": False},
                {"label": "Dots 1, 4", "dots": [1, 4], "correct": False},
                {"label": "Dots 2, 4, 5", "dots": [2, 4, 5], "correct": False}
            ],
            explanation="'क' corresponds to Dots 1 and 3 in Bharati Braille (similar to English 'K')."
        )

        BraillePracticeQuiz.objects.create(
            lesson=bl2,
            prompt="Which Braille cell represents 'म' (MA)?",
            target_char="म",
            expected_dots=[1, 3, 4],
            braille_unicode="⠍",
            audio_hint="Dots 1, 3 on left and Dot 4 on right top.",
            options=[
                {"label": "Dots 1, 3, 4 (⠍)", "dots": [1, 3, 4], "correct": True},
                {"label": "Dots 1, 2, 3 (⠇)", "dots": [1, 2, 3], "correct": False},
                {"label": "Dots 2, 3, 4 (⠎)", "dots": [2, 3, 4], "correct": False},
                {"label": "Dots 1, 2, 4, 5 (⠛)", "dots": [1, 2, 4, 5], "correct": False}
            ],
            explanation="'म' is written as Dots 1, 3, 4, equivalent to English 'M'."
        )

        # Lesson 3: Standard English Braille (Grade 1 A-Z)
        bl3 = BrailleLesson.objects.create(
            title="Standard English Braille (Grade 1 A to Z Foundation)",
            category="english_alphabet",
            level="beginner",
            order=3,
            description="Master the 26 letters of the international English Braille alphabet. Organized into 3 logical tiers of dot patterns.",
            characters_data=[
                {"char": "A", "dots": [1], "unicode": "⠁", "name": "Letter A", "desc": "Dot 1"},
                {"char": "B", "dots": [1, 2], "unicode": "⠃", "name": "Letter B", "desc": "Dots 1, 2"},
                {"char": "C", "dots": [1, 4], "unicode": "⠉", "name": "Letter C", "desc": "Dots 1, 4"},
                {"char": "D", "dots": [1, 4, 5], "unicode": "⠙", "name": "Letter D", "desc": "Dots 1, 4, 5"},
                {"char": "E", "dots": [1, 5], "unicode": "⠑", "name": "Letter E", "desc": "Dots 1, 5"},
                {"char": "F", "dots": [1, 2, 4], "unicode": "⠋", "name": "Letter F", "desc": "Dots 1, 2, 4"},
                {"char": "G", "dots": [1, 2, 4, 5], "unicode": "⠛", "name": "Letter G", "desc": "Dots 1, 2, 4, 5"},
                {"char": "H", "dots": [1, 2, 5], "unicode": "⠓", "name": "Letter H", "desc": "Dots 1, 2, 5"},
                {"char": "I", "dots": [2, 4], "unicode": "⠊", "name": "Letter I", "desc": "Dots 2, 4"},
                {"char": "J", "dots": [2, 4, 5], "unicode": "⠚", "name": "Letter J", "desc": "Dots 2, 4, 5"},
                {"char": "K", "dots": [1, 3], "unicode": "⠅", "name": "Letter K", "desc": "Dots 1, 3"},
                {"char": "L", "dots": [1, 2, 3], "unicode": "⠇", "name": "Letter L", "desc": "Dots 1, 2, 3"},
                {"char": "M", "dots": [1, 3, 4], "unicode": "⠍", "name": "Letter M", "desc": "Dots 1, 3, 4"},
                {"char": "N", "dots": [1, 3, 4, 5], "unicode": "⠝", "name": "Letter N", "desc": "Dots 1, 3, 4, 5"},
                {"char": "O", "dots": [1, 3, 5], "unicode": "⠕", "name": "Letter O", "desc": "Dots 1, 3, 5"},
                {"char": "P", "dots": [1, 2, 3, 4], "unicode": "⠏", "name": "Letter P", "desc": "Dots 1, 2, 3, 4"},
                {"char": "Q", "dots": [1, 2, 3, 4, 5], "unicode": "⠟", "name": "Letter Q", "desc": "Dots 1, 2, 3, 4, 5"},
                {"char": "R", "dots": [1, 2, 3, 5], "unicode": "⠗", "name": "Letter R", "desc": "Dots 1, 2, 3, 5"},
                {"char": "S", "dots": [2, 3, 4], "unicode": "⠎", "name": "Letter S", "desc": "Dots 2, 3, 4"},
                {"char": "T", "dots": [2, 3, 4, 5], "unicode": "⠞", "name": "Letter T", "desc": "Dots 2, 3, 4, 5"},
                {"char": "U", "dots": [1, 3, 6], "unicode": "⠥", "name": "Letter U", "desc": "Dots 1, 3, 6"},
                {"char": "V", "dots": [1, 2, 3, 6], "unicode": "⠧", "name": "Letter V", "desc": "Dots 1, 2, 3, 6"},
                {"char": "W", "dots": [2, 4, 5, 6], "unicode": "⠺", "name": "Letter W", "desc": "Dots 2, 4, 5, 6"},
                {"char": "X", "dots": [1, 3, 4, 6], "unicode": "⠭", "name": "Letter X", "desc": "Dots 1, 3, 4, 6"},
                {"char": "Y", "dots": [1, 3, 4, 5, 6], "unicode": "⠽", "name": "Letter Y", "desc": "Dots 1, 3, 4, 5, 6"},
                {"char": "Z", "dots": [1, 3, 5, 6], "unicode": "⠵", "name": "Letter Z", "desc": "Dots 1, 3, 5, 6"}
            ]
        )

        BraillePracticeQuiz.objects.create(
            lesson=bl3,
            prompt="Which letter is represented by the 3 vertical left dots (1, 2, 3)?",
            target_char="L",
            expected_dots=[1, 2, 3],
            braille_unicode="⠇",
            audio_hint="Sound like 'Lion' or 'Learn'.",
            options=[
                {"label": "Letter L (⠇)", "dots": [1, 2, 3], "correct": True},
                {"label": "Letter B (⠃)", "dots": [1, 2], "correct": False},
                {"label": "Letter K (⠅)", "dots": [1, 3], "correct": False},
                {"label": "Letter P (⠏)", "dots": [1, 2, 3, 4], "correct": False}
            ],
            explanation="Dots 1, 2, 3 form a continuous vertical ridge on the left, which is letter 'L'."
        )

        # Lesson 4: Nemeth Code Math & Numbers
        bl4 = BrailleLesson.objects.create(
            title="Nemeth Code & Arithmetic: Digits 0-9 & Math Signs",
            category="numbers_math",
            level="intermediate",
            order=4,
            description="Learn how blind and visually impaired students do science and mathematics! Covers numbers with prefix ⠼, addition (+), subtraction (-), and equality (=).",
            characters_data=[
                {"char": "#", "dots": [3, 4, 5, 6], "unicode": "⠼", "name": "Number Sign Prefix", "desc": "Indicates subsequent letters represent digits"},
                {"char": "1", "dots": [1], "unicode": "⠁", "name": "Digit 1 (एक)", "desc": "Prefix + Dot 1"},
                {"char": "2", "dots": [1, 2], "unicode": "⠃", "name": "Digit 2 (दो)", "desc": "Prefix + Dots 1, 2"},
                {"char": "3", "dots": [1, 4], "unicode": "⠉", "name": "Digit 3 (तीन)", "desc": "Prefix + Dots 1, 4"},
                {"char": "4", "dots": [1, 4, 5], "unicode": "⠙", "name": "Digit 4 (चार)", "desc": "Prefix + Dots 1, 4, 5"},
                {"char": "5", "dots": [1, 5], "unicode": "⠑", "name": "Digit 5 (पाँच)", "desc": "Prefix + Dots 1, 5"},
                {"char": "6", "dots": [1, 2, 4], "unicode": "⠋", "name": "Digit 6 (छह)", "desc": "Prefix + Dots 1, 2, 4"},
                {"char": "7", "dots": [1, 2, 4, 5], "unicode": "⠛", "name": "Digit 7 (सात)", "desc": "Prefix + Dots 1, 2, 4, 5"},
                {"char": "8", "dots": [1, 2, 5], "unicode": "⠓", "name": "Digit 8 (आठ)", "desc": "Prefix + Dots 1, 2, 5"},
                {"char": "9", "dots": [2, 4], "unicode": "⠊", "name": "Digit 9 (नौ)", "desc": "Prefix + Dots 2, 4"},
                {"char": "0", "dots": [2, 4, 5], "unicode": "⠚", "name": "Digit 0 (शून्य)", "desc": "Prefix + Dots 2, 4, 5"},
                {"char": "+", "dots": [2, 3, 5], "unicode": "⠖", "name": "Plus Operator (+)", "desc": "Dots 2, 3, 5"},
                {"char": "-", "dots": [3, 6], "unicode": "⠤", "name": "Minus Operator (-)", "desc": "Dots 3, 6"},
                {"char": "=", "dots": [2, 3, 5, 6], "unicode": "⠶", "name": "Equals Sign (=)", "desc": "Dots 2, 3, 5, 6"}
            ]
        )

        BraillePracticeQuiz.objects.create(
            lesson=bl4,
            prompt="Which symbol is used before Braille characters to indicate numbers (Number Sign)?",
            target_char="#",
            expected_dots=[3, 4, 5, 6],
            braille_unicode="⠼",
            audio_hint="Dots 3, 4, 5, 6 (L-shape inverted on right).",
            options=[
                {"label": "Dots 3, 4, 5, 6 (⠼)", "dots": [3, 4, 5, 6], "correct": True},
                {"label": "Dots 1, 2, 3 (⠇)", "dots": [1, 2, 3], "correct": False},
                {"label": "Dots 2, 4 (⠊)", "dots": [2, 4], "correct": False},
                {"label": "Dots 1, 6 (⠡)", "dots": [1, 6], "correct": False}
            ],
            explanation="The Number Sign (⠼ - Dots 3, 4, 5, 6) switches the reading context to digits 1-0."
        )

        # Pre-seed Student Progress for Pooja Gurjar
        BrailleStudentProgress.objects.create(
            student_name="Pooja Gurjar",
            lesson=bl1,
            accuracy_percent=95.0,
            score=180,
            completed=True,
            practice_minutes=25,
            mastered_chars=["अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ओ"],
            last_practiced_at=timezone.now()
        )
        BrailleStudentProgress.objects.create(
            student_name="Pooja Gurjar",
            lesson=bl3,
            accuracy_percent=88.5,
            score=145,
            completed=True,
            practice_minutes=18,
            mastered_chars=["A", "B", "C", "D", "E", "F", "L", "M"],
            last_practiced_at=timezone.now()
        )

        self.stdout.write('Seeding Sections 3.3 to 3.25 Enterprise & Administrative Data...')
        stu1 = created_students[0]
        stu2 = created_students[1]

        # 3.3 Role-Based Access Control
        RolePermissionMatrix.objects.all().delete()
        RolePermissionMatrix.objects.create(
            role='superadmin',
            can_manage_schools=True, can_manage_users=True, can_allocate_courses=True,
            can_conduct_exams=True, can_approve_scholarships=True, can_view_analytics=True,
            can_view_audit_logs=True, can_manage_grievances=True, can_export_reports=True,
            description="Complete national administrative authority over rural education clusters."
        )
        RolePermissionMatrix.objects.create(
            role='deo',
            can_manage_schools=True, can_manage_users=True, can_allocate_courses=True,
            can_conduct_exams=True, can_approve_scholarships=True, can_view_analytics=True,
            can_view_audit_logs=True, can_manage_grievances=True, can_export_reports=True,
            description="District Education Officer: cluster-wide oversight, DBT approvals, inspections."
        )
        RolePermissionMatrix.objects.create(
            role='headmaster',
            can_manage_schools=False, can_manage_users=True, can_allocate_courses=True,
            can_conduct_exams=True, can_approve_scholarships=False, can_view_analytics=True,
            can_view_audit_logs=False, can_manage_grievances=True, can_export_reports=True,
            description="School Principal: timetable allocations, attendance verification, teacher reviews."
        )
        RolePermissionMatrix.objects.create(
            role='teacher',
            can_manage_schools=False, can_manage_users=False, can_allocate_courses=False,
            can_conduct_exams=True, can_approve_scholarships=False, can_view_analytics=True,
            can_view_audit_logs=False, can_manage_grievances=False, can_export_reports=False,
            description="Classroom Instructor: lesson delivery, assignment grading, exam curation."
        )
        RolePermissionMatrix.objects.create(
            role='student',
            can_manage_schools=False, can_manage_users=False, can_allocate_courses=False,
            can_conduct_exams=False, can_approve_scholarships=False, can_view_analytics=False,
            can_view_audit_logs=False, can_manage_grievances=False, can_export_reports=False,
            description="Rural Student: class attendance, assignments, study groups, Braille studio."
        )
        RolePermissionMatrix.objects.create(
            role='parent',
            can_manage_schools=False, can_manage_users=False, can_allocate_courses=False,
            can_conduct_exams=False, can_approve_scholarships=False, can_view_analytics=False,
            can_view_audit_logs=False, can_manage_grievances=True, can_export_reports=False,
            description="Guardian: child progress tracking, attendance alerts, PTM communication."
        )
        RolePermissionMatrix.objects.create(
            role='panchayat',
            can_manage_schools=False, can_manage_users=False, can_allocate_courses=False,
            can_conduct_exams=False, can_approve_scholarships=False, can_view_analytics=True,
            can_view_audit_logs=False, can_manage_grievances=True, can_export_reports=True,
            description="Gram Panchayat / SMC Member: infrastructure supervision, solar grid verification."
        )

        # 3.6 Teacher Management
        TeacherProfile.objects.all().delete()
        t1 = TeacherProfile.objects.create(
            school=s1,
            employee_id="RJ-EDU-04128",
            name="Rajendra Prasad Sharma",
            designation="Senior Teacher Grade I (HOD Science)",
            qualification="M.Sc (Physics), B.Ed",
            specialization="Physics, Electronics & Solar Energy",
            phone_number="+91 94140 88219",
            email="rajendra.sharma@rajasthan.gov.in",
            assigned_grades="Class 8A, Class 8B, Class 9A",
            is_active=True,
            biometric_device_id="BIO-ALW-01"
        )
        t2 = TeacherProfile.objects.create(
            school=s1,
            employee_id="RJ-EDU-05912",
            name="Sunita Devi Meena",
            designation="Senior Mathematics Teacher",
            qualification="M.Sc (Mathematics), B.Ed",
            specialization="Vedic Mathematics & Algebra",
            phone_number="+91 94141 33491",
            email="sunita.meena@rajasthan.gov.in",
            assigned_grades="Class 7A, Class 8A",
            is_active=True,
            biometric_device_id="BIO-ALW-02"
        )
        t3 = TeacherProfile.objects.create(
            school=s1,
            employee_id="RJ-EDU-06104",
            name="Vikram Singh Chauhan",
            designation="Social Science & ICT Instructor",
            qualification="M.A (History), PGDCA",
            specialization="Digital Literacy & Smart Lab",
            phone_number="+91 94142 77012",
            email="vikram.chauhan@rajasthan.gov.in",
            assigned_grades="Class 6A, Class 7A, Class 8A",
            is_active=True,
            biometric_device_id="BIO-ALW-03"
        )

        # 3.7 Parent Management
        ParentProfile.objects.all().delete()
        p1 = ParentProfile.objects.create(
            guardian_name="Ramkaran Gurjar",
            phone_number="+91 98290 11442",
            relation="Father",
            occupation="Organic Mustard & Wheat Farmer",
            annual_income="₹85,000",
            preferred_language="Hindi",
            village="Khedla",
            whatsapp_enabled=True,
            sms_alerts_enabled=True
        )
        p1.students.add(stu1)

        p2 = ParentProfile.objects.create(
            guardian_name="Gopal Lal Meena",
            phone_number="+91 98291 99201",
            relation="Father",
            occupation="Village Cooperative Dairy Manager",
            annual_income="₹1,10,000",
            preferred_language="Hindi",
            village="Khedla",
            whatsapp_enabled=True,
            sms_alerts_enabled=True
        )
        p2.students.add(stu2)

        # 3.8 Class & Subject Management
        AcademicClass.objects.all().delete()
        c_8a = AcademicClass.objects.create(
            school=s1,
            grade=8,
            section="A",
            academic_year="2025-2026",
            room_number="Room 101 (Smart Class Alpha)",
            class_teacher="Rajendra Prasad Sharma",
            total_students_enrolled=36
        )
        c_8b = AcademicClass.objects.create(
            school=s1,
            grade=8,
            section="B",
            academic_year="2025-2026",
            room_number="Room 102",
            class_teacher="Sunita Devi Meena",
            total_students_enrolled=34
        )
        c_7a = AcademicClass.objects.create(
            school=s1,
            grade=7,
            section="A",
            academic_year="2025-2026",
            room_number="Room 103",
            class_teacher="Vikram Singh Chauhan",
            total_students_enrolled=38
        )

        Subject.objects.all().delete()
        sub_sci = Subject.objects.create(
            code="SCI-08",
            name="Science & Innovation (विज्ञान)",
            grade=8,
            syllabus_standard="NCERT & Rajasthan SCERT",
            total_chapters=16,
            practical_sessions=14
        )
        sub_math = Subject.objects.create(
            code="MATH-08",
            name="Mathematics & Vedic Arithmetic (गणित)",
            grade=8,
            syllabus_standard="NCERT & NEP 2020",
            total_chapters=15,
            practical_sessions=10
        )
        sub_soc = Subject.objects.create(
            code="SOC-08",
            name="Social Sciences & Heritage (सामाजिक विज्ञान)",
            grade=8,
            syllabus_standard="NCERT",
            total_chapters=18,
            practical_sessions=6
        )
        sub_hin = Subject.objects.create(
            code="HIN-08",
            name="Hindi Literature (हिंदी वसंत)",
            grade=8,
            syllabus_standard="NCERT",
            total_chapters=18,
            practical_sessions=4
        )

        # 3.9 Course Allocation Engine
        CourseAllocation.objects.all().delete()
        CourseAllocation.objects.create(
            school=s1,
            teacher_name="Rajendra Prasad Sharma",
            subject=sub_sci,
            academic_class=c_8a,
            periods_per_week=6,
            timetable_slots=[
                {"day": "Monday", "period": 1, "time": "08:30 AM - 09:15 AM", "room": "Smart Class Alpha"},
                {"day": "Tuesday", "period": 3, "time": "10:00 AM - 10:45 AM", "room": "Smart Class Alpha"},
                {"day": "Wednesday", "period": 2, "time": "09:15 AM - 10:00 AM", "room": "Smart Class Alpha"},
                {"day": "Thursday", "period": 4, "time": "10:45 AM - 11:30 AM", "room": "Solar STEM Lab"},
                {"day": "Friday", "period": 2, "time": "09:15 AM - 10:00 AM", "room": "Smart Class Alpha"},
                {"day": "Saturday", "period": 1, "time": "08:30 AM - 09:15 AM", "room": "Smart Class Alpha"}
            ],
            is_confirmed=True
        )
        CourseAllocation.objects.create(
            school=s1,
            teacher_name="Sunita Devi Meena",
            subject=sub_math,
            academic_class=c_8a,
            periods_per_week=6,
            timetable_slots=[
                {"day": "Monday", "period": 2, "time": "09:15 AM - 10:00 AM", "room": "Smart Class Alpha"},
                {"day": "Tuesday", "period": 1, "time": "08:30 AM - 09:15 AM", "room": "Smart Class Alpha"},
                {"day": "Wednesday", "period": 3, "time": "10:00 AM - 10:45 AM", "room": "Smart Class Alpha"},
                {"day": "Thursday", "period": 2, "time": "09:15 AM - 10:00 AM", "room": "Smart Class Alpha"},
                {"day": "Friday", "period": 1, "time": "08:30 AM - 09:15 AM", "room": "Smart Class Alpha"}
            ],
            is_confirmed=True
        )

        # 3.10 Online Learning Module
        OnlineDigitalCourse.objects.all().delete()
        OnlineDigitalCourse.objects.create(
            title="Class 8 Science: Renewable Solar Microgrids & Electricity",
            subject="Science",
            grade=8,
            instructor_name="Rajendra Prasad Sharma",
            video_streaming_url="https://meet.google.com/rural-stem-sci8",
            interactive_slides_url="https://docs.google.com/presentation/d/solar-electricity",
            is_live_stream_active=True,
            enrolled_students_count=72,
            modules_payload=[
                {"module_num": 1, "name": "Photovoltaic Cell Basics", "duration_mins": 30, "status": "completed"},
                {"module_num": 2, "name": "Measuring Voltage & Current with Multimeter", "duration_mins": 45, "status": "live_today"},
                {"module_num": 3, "name": "Battery Inverter Storage Math", "duration_mins": 40, "status": "upcoming"}
            ]
        )

        # 3.11 Offline Learning Module
        OfflineContentPackage.objects.all().delete()
        OfflineContentPackage.objects.create(
            school=s1,
            package_name="Rajasthan NCERT Grade 8 Offline Master Pack",
            grade=8,
            subject="All Core Subjects (STEM & Vernacular)",
            total_size_mb=840.5,
            edge_device_target="Raspberry Pi 5 Hub (192.168.10.1)",
            sync_status="downloaded_locally",
            offline_video_count=32,
            offline_pdf_count=64
        )
        OfflineContentPackage.objects.create(
            school=s1,
            package_name="Bharati Braille & Inclusive Speech Audio Pods",
            grade=8,
            subject="Special Education & Inclusion",
            total_size_mb=320.0,
            edge_device_target="Raspberry Pi 5 Hub (192.168.10.1)",
            sync_status="downloaded_locally",
            offline_video_count=12,
            offline_pdf_count=28
        )

        # 3.12 Smart Classroom Management
        SmartClassroomEquipment.objects.all().delete()
        SmartClassroomEquipment.objects.create(
            school=s1,
            room_name="Smart Class Alpha (Room 101)",
            equipment_type="interactive_flat_panel",
            brand_model="LG Touch IFPD 75TR3DJ 4K",
            serial_number="LG-IFPD-RJ-2024-001",
            power_consumption_watts=190,
            health_status="healthy",
            last_inspected=timezone.now().date(),
            amc_vendor="Rajasthan Electronics & Instruments Ltd (REIL)"
        )
        SmartClassroomEquipment.objects.create(
            school=s1,
            room_name="Smart Class Alpha (Room 101)",
            equipment_type="solar_ups_inverter",
            brand_model="Luminous Solar NXG Hybrid 5kVA",
            serial_number="LUM-PCU-2023-881",
            power_consumption_watts=60,
            health_status="healthy",
            last_inspected=timezone.now().date(),
            amc_vendor="Rajasthan Renewable Energy Corp (RREC)"
        )
        SmartClassroomEquipment.objects.create(
            school=s1,
            room_name="Smart Class Alpha (Room 101)",
            equipment_type="raspberry_pi_edge",
            brand_model="Raspberry Pi 5 (8GB RAM) with 512GB NVMe",
            serial_number="RPI5-EDGE-001-KHD",
            power_consumption_watts=15,
            health_status="healthy",
            last_inspected=timezone.now().date(),
            amc_vendor="Vidya Setu Engineering Cell"
        )
        SmartClassroomEquipment.objects.create(
            school=s1,
            room_name="Smart Class Alpha (Room 101)",
            equipment_type="audio_amplifier",
            brand_model="Ahuja Wireless PA 60W Digital System",
            serial_number="AHU-PA-99120",
            power_consumption_watts=45,
            health_status="healthy",
            last_inspected=timezone.now().date(),
            amc_vendor="Ahuja Radios Delhi"
        )

        # 3.13 Teacher Attendance
        TeacherAttendanceRecord.objects.all().delete()
        TeacherAttendanceRecord.objects.create(
            school=s1,
            teacher_name="Rajendra Prasad Sharma",
            date=timezone.now().date(),
            status="present",
            check_in_time="08:12 AM",
            check_out_time="02:35 PM",
            verification_method="Biometric Thumbprint / RFID"
        )
        TeacherAttendanceRecord.objects.create(
            school=s1,
            teacher_name="Sunita Devi Meena",
            date=timezone.now().date(),
            status="present",
            check_in_time="08:18 AM",
            check_out_time="02:40 PM",
            verification_method="Biometric Thumbprint / RFID"
        )
        TeacherAttendanceRecord.objects.create(
            school=s1,
            teacher_name="Vikram Singh Chauhan",
            date=timezone.now().date(),
            status="present",
            check_in_time="08:25 AM",
            check_out_time="02:30 PM",
            verification_method="Biometric Thumbprint / RFID"
        )

        # 3.15 Online Examination & Quiz
        OnlineExam.objects.all().delete()
        e1 = OnlineExam.objects.create(
            school=s1,
            title="Class 8 Science Mid-Term Summative Assessment",
            subject="Science",
            grade=8,
            exam_date=timezone.now().date(),
            duration_mins=60,
            total_marks=50,
            passing_marks=18,
            exam_type="mcq",
            is_published=True
        )

        ExamQuestion.objects.all().delete()
        ExamQuestion.objects.create(
            exam=e1,
            question_text="What is the unit of electric current in the International System (SI)?",
            question_type="mcq",
            options=[
                {"label": "Volt (V)", "correct": False},
                {"label": "Ampere (A)", "correct": True},
                {"label": "Ohm (Ω)", "correct": False},
                {"label": "Watt (W)", "correct": False}
            ],
            marks=2,
            explanation="The SI unit of electric current is the Ampere (A)."
        )
        ExamQuestion.objects.create(
            exam=e1,
            question_text="Which semiconductor material is primarily used to manufacture photovoltaic solar cells?",
            question_type="mcq",
            options=[
                {"label": "Copper", "correct": False},
                {"label": "Silicon", "correct": True},
                {"label": "Aluminum", "correct": False},
                {"label": "Iron", "correct": False}
            ],
            marks=2,
            explanation="Silicon (Si) is the most abundant semiconductor used in solar wafers."
        )

        ExamResult.objects.all().delete()
        ExamResult.objects.create(
            exam=e1,
            student=stu1,
            marks_obtained=46.0,
            percentage=92.0,
            grade_letter="A+",
            passed=True,
            answers_payload={"q1": "Ampere", "q2": "Silicon"}
        )
        ExamResult.objects.create(
            exam=e1,
            student=stu2,
            marks_obtained=41.5,
            percentage=83.0,
            grade_letter="A",
            passed=True,
            answers_payload={"q1": "Ampere", "q2": "Silicon"}
        )

        # 3.16 Student Progress Tracking (Report Cards)
        StudentReportCard.objects.all().delete()
        StudentReportCard.objects.create(
            student=stu1,
            academic_year="2025-2026",
            term="Mid-Term Summative (अर्धवार्षिक)",
            overall_percentage=91.4,
            class_rank=1,
            attendance_percentage=96.5,
            subject_breakdown=[
                {"subject": "Science & Innovation", "marks": 48, "max": 50, "grade": "A+"},
                {"subject": "Mathematics", "marks": 47, "max": 50, "grade": "A+"},
                {"subject": "Social Studies", "marks": 43, "max": 50, "grade": "A"},
                {"subject": "Hindi Literature", "marks": 45, "max": 50, "grade": "A+"}
            ],
            teacher_remarks="Exceptional leadership in solar electronics, speed math, and inclusive Braille literacy.",
            promoted_to_next_grade=True
        )

        # 3.17 Internet Connectivity Monitoring
        ConnectivityAuditMetric.objects.all().delete()
        ConnectivityAuditMetric.objects.create(
            school=s1,
            interface="BharatNet Optical Fiber (GPON)",
            ping_latency_ms=38,
            packet_loss_percentage=0.15,
            download_speed_kbps=5200,
            upload_speed_kbps=2200,
            uptime_percentage_30days=98.8,
            failover_active=False
        )

        # 3.18 Scholarship Management
        ScholarshipScheme.objects.all().delete()
        sch1 = ScholarshipScheme.objects.create(
            scheme_code="NMMS-2026",
            name="National Means-cum-Merit Scholarship Scheme (NMMSS)",
            ministry="Department of School Education & Literacy, MoE",
            amount_per_annum_inr=12000,
            eligibility_criteria="Class 8 rural students securing >55% marks with parental income < ₹3.5 Lakhs",
            target_category="Merit Students from Economically Weaker Sections",
            is_active=True
        )
        sch2 = ScholarshipScheme.objects.create(
            scheme_code="GIRLS-STEM-RJ",
            name="Rajasthan Rural Girls STEM Excellence Grant",
            ministry="Department of Education, Govt of Rajasthan",
            amount_per_annum_inr=15000,
            eligibility_criteria="Female students in rural smart schools actively demonstrating STEM innovation",
            target_category="Rural Girls in STEM",
            is_active=True
        )

        ScholarshipApplication.objects.all().delete()
        ScholarshipApplication.objects.create(
            scholarship=sch1,
            student=stu1,
            application_number="NMMSS-RJ-2025-08194",
            applied_date=timezone.now().date(),
            verification_stage="dbt_disbursed",
            dbt_bank_account_last4="4921",
            dbt_transaction_ref="DBT-RBI-20260215-08194",
            disbursed_at=timezone.now()
        )
        ScholarshipApplication.objects.create(
            scholarship=sch2,
            student=stu1,
            application_number="GIRLS-STEM-2025-00412",
            applied_date=timezone.now().date(),
            verification_stage="deo_approved",
            dbt_bank_account_last4="4921",
            dbt_transaction_ref=""
        )

        # 3.19 Parent Portal & Meetings
        ParentMeetingNotice.objects.all().delete()
        ParentMeetingNotice.objects.create(
            school=s1,
            title="Term 1 Parent-Teacher Meeting (PTM) & Midday Meal Review",
            agenda="Discuss digital attendance reports, solar lab demonstrations, and winter uniform distribution.",
            meeting_date="Upcoming Saturday, 10:00 AM",
            venue="Smart Classroom 1 & Village Panchayat Chopal",
            sms_dispatched_count=184
        )

        ParentCommunication.objects.all().delete()
        ParentCommunication.objects.create(
            parent_name="Ramkaran Gurjar",
            student_name="Pooja Gurjar",
            teacher_name="Rajendra Prasad Sharma",
            message_direction="teacher_to_parent",
            subject="Commendation: Pooja topped District Science Exhibition",
            body="Namaste Ramkaran ji! Pooja built an outstanding solar circuit prototype today. We are accelerating her NMMS scholarship disbursal.",
            is_read=True
        )

        # 3.20 Notification Management
        BroadcastNotification.objects.all().delete()
        BroadcastNotification.objects.create(
            school=s1,
            title="Winter Timetable Revision (08:30 AM to 02:30 PM)",
            message="As per DEO Alwar circular, school timings are revised due to winter morning fog. Midday meal will be served at 12:15 PM.",
            target_audience="all",
            priority="normal",
            channels=["in_app", "sms", "ivr_voice"],
            is_sent=True
        )
        BroadcastNotification.objects.create(
            school=s1,
            title="Notice: Solar Microgrid Battery Maintenance Schedule",
            message="Solar technician will calibrate gel battery cells on Thursday. Classroom 2 will briefly operate on backup inverter.",
            target_audience="teachers",
            priority="urgent",
            channels=["in_app"],
            is_sent=True
        )

        # 3.21 Complaint & Feedback Management (Grievance Redressal)
        GrievanceTicket.objects.all().delete()
        GrievanceTicket.objects.create(
            ticket_number="GRV-ALW-2026-004",
            school=s1,
            complainant_name="Sarla Devi (SMC Member)",
            complainant_role="parent",
            category="infrastructure",
            subject="Solar Inverter MCB trip during noon cloud cover",
            description="During heavy cloud passage, inverter tripped twice before auto-reconnecting to tubular battery bank. Please inspect solar MPPT charge controller.",
            priority="high",
            status="resolved",
            resolution_notes="REIL engineer visited on Monday, cleaned solar PV glass surfaces and calibrated trip voltage threshold to 48.5V.",
            assigned_to="Assistant Engineer (REIL Alwar)",
            resolved_at=timezone.now()
        )
        GrievanceTicket.objects.create(
            ticket_number="GRV-ALW-2026-007",
            school=s1,
            complainant_name="Gopal Lal Meena",
            complainant_role="parent",
            category="midday_meal",
            subject="Request for fortified milk ration under Mukhyamantri Bal Gopal Yojana",
            description="Village dairy cooperative ready to supply certified fresh milk pasteurized locally.",
            priority="medium",
            status="open",
            resolution_notes="",
            assigned_to="Block Nutrition Coordinator"
        )

        # 3.23 Report Generation
        GeneratedReport.objects.all().delete()
        GeneratedReport.objects.create(
            school=s1,
            report_type="udise_plus",
            title="UDISE+ National School Compliance Register 2025-26",
            period="Annual Session 2025-2026",
            format_type="PDF",
            file_size_kb=345,
            generated_by="DEO Alwar Office",
            data_summary={"enrolled": 286, "girls": 148, "solar_powered": True, "internet_status": "BharatNet Active"}
        )
        GeneratedReport.objects.create(
            school=s1,
            report_type="midday_meal_monthly",
            title="PM-POSHAN Monthly Meal Distribution & Calorie Compliance",
            period="January - February 2026",
            format_type="Excel",
            file_size_kb=220,
            generated_by="Block Education Officer (BEO)",
            data_summary={"meals_served": 5420, "pulses_kg": 240, "vegetables_kg": 510}
        )

        # 3.24 System Configuration
        SystemConfiguration.objects.all().delete()
        SystemConfiguration.objects.create(
            config_key="EDGE_CACHE_BURST_SYNC_WINDOW",
            config_value="01:00 AM - 04:30 AM IST",
            category="edge_sync",
            description="Nightly low-congestion satellite & fiber window for caching high-res video lectures locally."
        )
        SystemConfiguration.objects.create(
            config_key="SMS_GATEWAY_SENDER_ID",
            config_value="VDYSETU-RJ",
            category="sms_gateway",
            description="Government approved DLT header for automated vernacular SMS attendance alerts."
        )
        SystemConfiguration.objects.create(
            config_key="SOLAR_INVERTER_LOW_BATTERY_CUTOFF",
            config_value="25%",
            category="power_telemetry",
            description="Safeguard threshold before non-essential smart display power sheds to preserve edge server."
        )

        # 3.25 Audit Trail Logs
        AuditTrailLog.objects.all().delete()
        AuditTrailLog.objects.create(
            user_name="deo_alwar",
            user_role="deo",
            ip_address="192.168.10.15",
            action="DISBURSE_DBT",
            target_model="ScholarshipApplication",
            record_id="NMMSS-RJ-2025-08194",
            description="Sanctioned DBT transfer of ₹12,000 to student Pooja Gurjar (NMMS 2026)"
        )
        AuditTrailLog.objects.create(
            user_name="rajendra_teacher",
            user_role="teacher",
            ip_address="192.168.10.42",
            action="GENERATE_EXAM",
            target_model="OnlineExam",
            record_id="SCI-08-MIDTERM",
            description="Created and published Class 8 Science Mid-Term MCQ Assessment"
        )
        AuditTrailLog.objects.create(
            user_name="deo_alwar",
            user_role="deo",
            ip_address="192.168.10.15",
            action="RESOLVE_GRIEVANCE",
            target_model="GrievanceTicket",
            record_id="GRV-ALW-2026-004",
            description="Marked solar inverter charge controller inspection ticket as RESOLVED"
        )



        self.stdout.write(self.style.SUCCESS('Successfully seeded Vidya Setu Smart Rural Education Platform into MySQL!'))
