# Vidya Setu (विद्या सेतु)
### Smart Rural Education Infrastructure & Connectivity Platform

**Vidya Setu** is a smart, fault-tolerant educational infrastructure and connectivity platform designed for remote, tribal, and rural schools across India. It combines a **solar-powered edge computing architecture (Raspberry Pi/low-power servers)** with a **high-performance React.js frontend**, a **Python / Django REST API backend**, and a **MySQL Server database**.

---

## 📋 Comprehensive Feature Specification

### 2.3.1 Teacher Module
* **Dashboard**: Allows teachers to schedule classes, track real-time student analytics, and manage class study materials.
* **Class Management**: Enables creation and scheduling of live **Google Meet sessions**, including automated reminders synced with **Google Calendar** via 1-click template links.
* **Assignment Control**: Teachers can upload assignments in **PDF, DOCX, and PPTX** formats with submission deadlines, review student submissions, award scores (out of total points), and provide qualitative feedback.
* **Resource Repository**: Dedicated upload feature for class notes, slides, and downloadable documents with download frequency telemetry.
* **Community Interaction**: Teachers can moderate peer discussions, respond to student academic queries with verified endorsements, and issue official school announcements.

### 2.3.2 Student Module
* **Personal Dashboard**: Includes an interactive **Goal-Setting Notepad** with completion tracking, visual **Performance Graphs** for subject mastery, and a **Pomodoro-Based Study Timer** (25-min focus sessions & 5-min breaks with session completion tally).
* **Class Participation**: Students can join live Google Meet classes or watch recorded class sessions via provided links and sync calendar reminders.
* **Assignment Handling**: Clean interface for downloading assignment materials, attending questions, submitting solution files/notes, and tracking grades and teacher feedback.
* **AI Tutor Interface (Prototype)**: Chatbot-style assistance for frequently asked academic queries (NCERT Science, Vedic Math, Circuits, Ecology) with step-by-step guidance in English and Hindi.
* **Study Mate Groups**: Peer circles for collaborative learning (e.g. "Solar & Electronics Explorers", "Vedic Speed Math Circle") and peer discussion forums.

### 2.4 Technology Stack
| Layer | Technology Used |
|---|---|
| **Frontend** | React.js (v19) |
| **Bundler & Dev Server** | Vite (v8) |
| **Backend** | Python (3.12) / Django (6.1) REST Framework |
| **Database** | MySQL Server 8.0 (`vidyasetu_db` on 127.0.0.1:3306 via PyMySQL) |
| **AI Integration** | Intelligent NCERT/STEM Academic Prompt Engine (OpenAI GPT compatible) |

### 2.5 State Management and Component Design
* **Hooks-Based State**: Uses React's `useState` and `useEffect` hooks for local state management, timers, and form handling.
* **Role-Based Conditional Rendering**: UI dynamically adapts depending on whether the user is in **Teacher Mode** or **Student Mode**. A single-click role toggle in the sidebar enables seamless switching.
* **Modular Component Architecture**: Each functional area (`TeacherModule`, `StudentModule`, `OverviewDashboard`, `SmartClassroom`, `SchoolInfrastructure`, `CurriculumRepository`, `StudentAttendance`, `AuthModal`) is developed as an independent, reusable module.

### 2.6 UI/UX Design Strategy
* **Responsive Layout**: Designed for seamless accessibility across smartphones, tablets, and desktops.
* **Minimalist & Accessible Design**: High-contrast Indian educational palette (amber/saffron, emerald solar green, cyan/sky, deep slate), readable typography (`Outfit`, `Plus Jakarta Sans`), and consistent spacing.
* **Clean Calls-to-Action**: Clear buttons for Google Meet launching, calendar syncing, assignment submissions, Pomodoro controls, and AI chat.

### 2.7 Testing and Deployment
* **Role-Based Access Flow**: Verified with pre-seeded personas for Teacher (`teacher_ramesh`), DEO (`deo_sharma`), Panchayat (`sarpanch_khedla`), and Student (`student_pooja`).
* **Assignment Lifecycle**: Verified uploading, downloading, submitting, and teacher grading.
* **Timer Functionality**: Verified 25m focus & 5m break transitions.
* **Component Rendering**: 100% verified with Vite production build (`npm run build`).

---

## 🗄️ MySQL Database Configuration

The backend is connected to **MySQL Server 8.0**:
- **Database Name**: `vidyasetu_db`
- **Host**: `127.0.0.1` (Port: `3306`)
- **Username**: `root`
- **Password**: `admin`
- **Driver**: `PyMySQL` (`pymysql.install_as_MySQLdb()`) with `utf8mb4` character set

### Tables in `vidyasetu_db`:
- `core_liveclasssession`: Scheduled & live Google Meet classes, Google Calendar sync links
- `core_assignment` & `core_assignmentsubmission`: Assignment files (PDF/DOCX/PPTX), deadlines, student submissions, grades, feedback
- `core_classstudymaterial`: Uploaded notes, presentations, download counts
- `core_forumtopic` & `core_forumreply`: Community forum, announcements, teacher-endorsed answers
- `core_studymategroup`: Collaborative peer learning circles
- `core_studentgoal`: Student goal-setting notepad entries
- `auth_user` & `core_userprofile`: Authenticated users, hashed passwords, roles, and school affiliations
- `core_school`: Rural school infrastructure, UDISE codes, and backhaul links
- `core_devicetelemetry`: Solar generation watts, battery health, CPU thermals, and projector lamp hours
- `core_learningresource`: Multi-lingual NCERT modules and offline edge cache flags
- `core_student` & `core_attendancerecord`: Student rosters, RFID gate card IDs, daily attendance, PM-POSHAN meals
- `core_maintenanceticket`: Equipment maintenance tickets and technician dispatch logs
- `core_communitynotice`: Gram Panchayat notices and adult digital literacy clinics
- `core_syncqueueitem`: Offline queue for fault-tolerant sync during rural link cuts

---

## 🔐 Authentication & Roles (Login & Register)

### Pre-Seeded 1-Click Demo Accounts (Stored in MySQL)
| Stakeholder Persona | Username | Password | Role |
|---|---|---|---|
| **Master Ji Ramesh Meena** | `teacher_ramesh` | `vidya123` | Rural Head Teacher |
| **Dr. S.K. Sharma** | `deo_sharma` | `vidya123` | District Education Officer (DEO) |
| **Balwant Singh Gurjar** | `sarpanch_khedla` | `vidya123` | Gram Panchayat Pradhan |
| **Pooja Gurjar** | `student_pooja` | `vidya123` | Class 8 Student Leader |

---

## 🚀 How to Run

### Option 1: One-Click Launch (Recommended)
Double-click or run from PowerShell:
```powershell
.\start_vidyasetu.bat
```
This starts both the Django backend connected to MySQL and the React Vite frontend in separate windows.

### Option 2: Running Independently

#### 1. Start Django Backend (Port 8000)
```powershell
cd backend
python manage.py runserver 127.0.0.1:8000
```
- API Base: `http://127.0.0.1:8000/api/`
- Platform Overview: `http://127.0.0.1:8000/api/overview/`
- Django Admin: `http://127.0.0.1:8000/admin/`

#### 2. Start React Frontend (Port 5173)
```powershell
npm run dev
```
- Open browser at: **`http://localhost:5173`**
