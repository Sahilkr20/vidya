const API_BASE = '/api';

// Fallback seed data if Django backend is starting up or offline
const FALLBACK_SCHOOLS = [
  {
    id: 1,
    name: "GSSS Khedla Smart Vidya Kendra",
    village: "Khedla",
    block: "Ramgarh Block",
    district: "Alwar",
    state: "Rajasthan",
    udise_code: "08060104502",
    solar_capacity_kw: 4.2,
    solar_output_watts: 2650,
    battery_percentage: 92,
    power_source: "solar",
    grid_power_available: true,
    connectivity_type: "bharatnet_fiber",
    connectivity_status: "online",
    latency_ms: 38,
    bandwidth_kbps: 5200,
    data_saver_mode: true,
    edge_server_ip: "192.168.10.1",
    edge_server_status: "Operational (RPi 5 Edge Hub)",
    edge_storage_used_gb: 138.4,
    edge_storage_total_gb: 256.0,
    smart_classrooms_count: 4,
    total_students: 286,
    total_teachers: 12,
    last_synced_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Sundarbans Adarsh Ashram Shala",
    village: "Gosaba Island",
    block: "Canning Block II",
    district: "South 24 Parganas",
    state: "West Bengal",
    udise_code: "19180203101",
    solar_capacity_kw: 5.0,
    solar_output_watts: 3100,
    battery_percentage: 78,
    power_source: "solar",
    grid_power_available: false,
    connectivity_type: "vsat_satellite",
    connectivity_status: "intermittent",
    latency_ms: 640,
    bandwidth_kbps: 450,
    data_saver_mode: true,
    edge_server_ip: "192.168.20.1",
    edge_server_status: "Operational (Solar Edge Caching)",
    edge_storage_used_gb: 210.5,
    edge_storage_total_gb: 256.0,
    smart_classrooms_count: 3,
    total_students: 315,
    total_teachers: 10,
    last_synced_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Bastar Tribal Digital Gurukul",
    village: "Tokapal",
    block: "Bastar Block",
    district: "Bastar",
    state: "Chhattisgarh",
    udise_code: "22140301905",
    solar_capacity_kw: 3.0,
    solar_output_watts: 1820,
    battery_percentage: 85,
    power_source: "hybrid",
    grid_power_available: true,
    connectivity_type: "4g_5g_cpe",
    connectivity_status: "online",
    latency_ms: 85,
    bandwidth_kbps: 1800,
    data_saver_mode: true,
    edge_server_ip: "192.168.30.1",
    edge_server_status: "Operational",
    edge_storage_used_gb: 112.0,
    edge_storage_total_gb: 256.0,
    smart_classrooms_count: 2,
    total_students: 194,
    total_teachers: 8,
    last_synced_at: new Date().toISOString()
  },
  {
    id: 4,
    name: "Zilla Parishad High School Velhe",
    village: "Velhe",
    block: "Velhe Block",
    district: "Pune",
    state: "Maharashtra",
    udise_code: "27250402201",
    solar_capacity_kw: 3.5,
    solar_output_watts: 2200,
    battery_percentage: 94,
    power_source: "solar",
    grid_power_available: true,
    connectivity_type: "bharatnet_fiber",
    connectivity_status: "online",
    latency_ms: 29,
    bandwidth_kbps: 8500,
    data_saver_mode: false,
    edge_server_ip: "192.168.40.1",
    edge_server_status: "Operational",
    edge_storage_used_gb: 95.2,
    edge_storage_total_gb: 256.0,
    smart_classrooms_count: 4,
    total_students: 240,
    total_teachers: 9,
    last_synced_at: new Date().toISOString()
  }
];

export function getAuthToken() {
  return localStorage.getItem('vidyasetu_token');
}

export function getStoredUser() {
  const u = localStorage.getItem('vidyasetu_user');
  try {
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

export function setAuthSession(token, user) {
  if (token) localStorage.setItem('vidyasetu_token', token);
  if (user) localStorage.setItem('vidyasetu_user', JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem('vidyasetu_token');
  localStorage.removeItem('vidyasetu_user');
}

function getHeaders(custom = {}) {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json', ...custom };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  return headers;
}

export async function loginUser(credentials) {
  try {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.non_field_errors?.[0] || data.username?.[0] || data.password?.[0] || data.error || 'Login failed');
    }
    setAuthSession(data.token, data.user);
    return data;
  } catch (err) {
    // If backend is unreachable, support offline demo personas
    if (credentials.username === 'teacher_ramesh' && credentials.password === 'vidya123') {
      const demoUser = {
        id: 1,
        username: 'teacher_ramesh',
        email: 'ramesh.meena@vidyasetu.gov.in',
        profile: {
          role: 'teacher',
          full_name: 'Master Ji Ramesh Meena',
          phone_number: '+91 98291-44321',
          school: 1,
          school_name: 'GSSS Khedla Smart Vidya Kendra',
          designation: 'Head Teacher & Digital Facilitator'
        }
      };
      setAuthSession('demo-token-123', demoUser);
      return { token: 'demo-token-123', user: demoUser, message: 'Offline Demo Login Successful' };
    }
    throw err;
  }
}

export async function registerUser(formData) {
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  const data = await res.json();
  if (!res.ok) {
    const firstErr = Object.values(data)[0];
    const msg = Array.isArray(firstErr) ? firstErr[0] : (typeof firstErr === 'string' ? firstErr : 'Registration failed');
    throw new Error(msg);
  }
  setAuthSession(data.token, data.user);
  return data;
}

export async function getCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/me/`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      clearAuthSession();
      return null;
    }
    const data = await res.json();
    localStorage.setItem('vidyasetu_user', JSON.stringify(data));
    return data;
  } catch {
    return getStoredUser();
  }
}

export async function logoutUser() {
  try {
    await fetch(`${API_BASE}/auth/logout/`, {
      method: 'POST',
      headers: getHeaders()
    });
  } catch {}
  clearAuthSession();
}

export async function fetchOverview() {
  try {
    const res = await fetch(`${API_BASE}/overview/`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    return {
      total_schools: 4,
      connectivity_breakdown: { online: 3, intermittent: 1, offline: 0 },
      total_students: 1035,
      total_resources: 12,
      cached_resources: 10,
      edge_bandwidth_saved_gb: 230.4,
      pending_sync_items: 2,
      open_maintenance_tickets: 1,
      avg_battery_health: 87.2,
      total_solar_kw: 15.7,
      system_status: 'All Rural Edge Hubs Operational'
    };
  }
}

export async function fetchSchools() {
  try {
    const res = await fetch(`${API_BASE}/schools/`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.results || data;
  } catch {
    return FALLBACK_SCHOOLS;
  }
}

export async function toggleSchoolConnectivity(schoolId, newStatus) {
  try {
    const res = await fetch(`${API_BASE}/schools/${schoolId}/toggle_connectivity/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return await res.json();
  } catch (err) {
    console.warn('Backend update failed, updating locally', err);
    const school = FALLBACK_SCHOOLS.find(s => s.id === schoolId);
    if (school) {
      school.connectivity_status = newStatus;
      if (newStatus === 'online') {
        school.latency_ms = 38;
        school.bandwidth_kbps = 5200;
      } else if (newStatus === 'intermittent') {
        school.latency_ms = 350;
        school.bandwidth_kbps = 320;
      } else {
        school.latency_ms = 0;
        school.bandwidth_kbps = 0;
      }
      return { ...school };
    }
    return null;
  }
}

export async function triggerSchoolSync(schoolId) {
  try {
    const res = await fetch(`${API_BASE}/schools/${schoolId}/trigger_sync/`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Sync failed');
    return await res.json();
  } catch (err) {
    console.warn('Fallback sync triggered', err);
    return {
      message: 'Successfully synced local edge queue to state educational portal.',
      synced_count: 2,
      last_synced_at: new Date().toISOString()
    };
  }
}

export async function fetchTelemetry(schoolId) {
  try {
    const url = schoolId ? `${API_BASE}/telemetry/?school=${schoolId}` : `${API_BASE}/telemetry/`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch telemetry');
    const data = await res.json();
    return data.results || data;
  } catch {
    return [
      { id: 1, device_name: "Solar Inverter 4.2kW MPPT", device_category: "solar_power", status: "healthy", metric_label: "Active Generation", metric_value: "2,650 Watts (Peak Sun)", health_score: 98 },
      { id: 2, device_name: "Tubular Gel Battery Bank (48V 200Ah)", device_category: "solar_power", status: "healthy", metric_label: "Battery Charge & Health", metric_value: "92% (52.8V Nominal)", health_score: 94 },
      { id: 3, device_name: "Local Edge Server (Raspberry Pi 5 8GB)", device_category: "edge_compute", status: "healthy", metric_label: "CPU Temp & Cache Utilization", metric_value: "42°C | 138 GB / 256 GB NVMe", health_score: 97 },
      { id: 4, device_name: "BharatNet GPON Fiber ONT", device_category: "connectivity", status: "healthy", metric_label: "Optical Link Rx Power", metric_value: "-19.2 dBm | Ping 38ms", health_score: 95 },
      { id: 5, device_name: "Classroom 1 Interactive Laser Projector", device_category: "display_av", status: "healthy", metric_label: "Lamp Status & Runtime", metric_value: "Eco Mode | 412 Hrs Logged", health_score: 92 },
      { id: 6, device_name: "Smart Gate RFID Attendance Scanner", device_category: "biometric", status: "healthy", metric_label: "Scans Today", metric_value: "264 Students Verified", health_score: 99 },
      { id: 7, device_name: "Classroom Environmental Air & Temp Sensor", device_category: "environmental", status: "healthy", metric_label: "Indoor Climate", metric_value: "27.4°C | 48% RH | AQI 42 (Good)", health_score: 96 }
    ];
  }
}

export async function fetchResources(filters = {}) {
  try {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/resources/?${params}`);
    if (!res.ok) throw new Error('Failed to fetch resources');
    const data = await res.json();
    return data.results || data;
  } catch {
    return [
      {
        id: 1,
        title: "Solar Energy, Circuits & Clean Tech Fundamentals",
        grade: 8,
        subject: "Science & Innovation",
        language: "Hindi",
        resource_type: "video",
        file_size_mb: 18.4,
        duration_mins: 22,
        is_cached_locally: true,
        curriculum_standard: "NCERT Class 8 - Chapter 14",
        description: "Explains how solar photovoltaic panels convert sunlight into DC current, battery storage chemistry, and practical applications in rural communities.",
        content_payload: {
          summary: "Covers photovoltaic cells, inverter working, parallel vs series circuits, and hands-on multimeter testing.",
          key_takeaways: [
            "Photovoltaic effect releases electrons when photons hit silicon wafers.",
            "Inverters convert Direct Current (DC) from batteries to Alternating Current (AC) for appliances.",
            "Proper solar panel tilt matches the latitude of the village for peak winter/summer irradiance."
          ],
          quiz_questions: [
            { q: "What type of electrical current do solar panels produce directly?", options: ["Direct Current (DC)", "Alternating Current (AC)", "Static Magnetic Pulse", "Three-phase Current"], answer: 0 },
            { q: "Which device converts DC battery power to AC for school projectors?", options: ["Inverter", "Transformer", "Capacitor", "Galvanometer"], answer: 0 }
          ]
        }
      },
      {
        id: 2,
        title: "Vedic Mathematics: Rapid Mental Math & Multiplication",
        grade: 7,
        subject: "Mathematics",
        language: "Hindi",
        resource_type: "simulation",
        file_size_mb: 12.0,
        duration_mins: 18,
        is_cached_locally: true,
        curriculum_standard: "NEP 2020 Foundational Numeracy",
        description: "Learn the 'Urdhva Tiryagbhyam' (Vertically and Crosswise) formula to multiply 2-digit and 3-digit numbers in under 5 seconds without paper.",
        content_payload: {
          summary: "Master fast cross-multiplication, base-100 shortcuts, and check answers using the digital root (Navasesh) method.",
          key_takeaways: [
            "Multiply digits vertically, then cross-multiply and add.",
            "Helps rural students compute mental sums in competitive scholarship exams.",
            "Reduces reliance on paper in remote classrooms."
          ],
          quiz_questions: [
            { q: "What is the product of 96 × 94 using base 100 method?", options: ["9024", "9014", "9124", "8924"], answer: 0 }
          ]
        }
      },
      {
        id: 3,
        title: "Rainwater Harvesting & Ground Water Recharging",
        grade: 7,
        subject: "Environmental Studies",
        language: "Marathi",
        resource_type: "video",
        file_size_mb: 22.5,
        duration_mins: 20,
        is_cached_locally: true,
        curriculum_standard: "Maharashtra SCERT Geography",
        description: "Rooftop water collection, silt filtration pit design, and revitalizing village borewells to fight seasonal drought.",
        content_payload: {
          summary: "Detailed schematic animation of PVC pipe connections from school tin roofs into gravel-sand recharge wells.",
          key_takeaways: [
            "Filters using charcoal, gravel, and sand remove 90% of suspended organic solids.",
            "Recharging 100,000 liters during monsoon ensures round-the-year school drinking water."
          ],
          quiz_questions: [
            { q: "Which natural material adsorbs odors and chemical residues in water filters?", options: ["Activated Charcoal", "Granite Chips", "Clay Soil", "Limestone"], answer: 0 }
          ]
        }
      },
      {
        id: 4,
        title: "Sundarbans Mangrove Ecology & Tidal Biodiversity",
        grade: 9,
        subject: "Biology & Ecology",
        language: "Bengali",
        resource_type: "audio",
        file_size_mb: 9.2,
        duration_mins: 25,
        is_cached_locally: true,
        curriculum_standard: "West Bengal Board Class 9 Life Sciences",
        description: "Vernacular audio documentary detailing pneumatophore breathing roots, Royal Bengal Tiger conservation, and cyclonic storm surge protection.",
        content_payload: {
          summary: "Audio lesson recorded in native Bengali dialect with natural forest sounds and environmental scientists.",
          key_takeaways: [
            "Pneumatophores rise vertically to breathe in oxygen-deficient estuarine mud.",
            "Dense mangrove roots absorb up to 66% of cyclone wave energy."
          ]
        }
      },
      {
        id: 5,
        title: "Foundational Coding & Algorithms Without Internet",
        grade: 6,
        subject: "Digital & Vocational Skills",
        language: "English",
        resource_type: "simulation",
        file_size_mb: 15.8,
        duration_mins: 30,
        is_cached_locally: true,
        curriculum_standard: "Atal Tinkering Labs / PM-SHRI Curriculum",
        description: "Block-based visual programming logic, loops, conditionals, and game creation executed locally on the Raspberry Pi edge server.",
        content_payload: {
          summary: "Zero-bandwidth interactive coding environment running completely on classroom local Wi-Fi.",
          key_takeaways: [
            "Sequencing: step-by-step instructions computers follow in order.",
            "Conditionals: If-Then statements to automate classroom appliances."
          ],
          quiz_questions: [
            { q: "Which programming construct repeats a command until a condition is met?", options: ["Loop", "Variable", "Comment", "Constant"], answer: 0 }
          ]
        }
      },
      {
        id: 6,
        title: "Human Anatomy & 3D Interactive Organ Systems",
        grade: 10,
        subject: "Science & Innovation",
        language: "Hindi",
        resource_type: "video",
        file_size_mb: 31.0,
        duration_mins: 28,
        is_cached_locally: false,
        curriculum_standard: "NCERT Class 10 - Life Processes",
        description: "3D visualization of double circulation, pulmonary and systemic circuits, heart valves, and blood pressure monitoring.",
        content_payload: {
          summary: "Interactive medical-grade model with vernacular Hindi commentary.",
          key_takeaways: [
            "Oxygenated blood returns from lungs through pulmonary veins into left atrium.",
            "Bicuspid and tricuspid valves prevent backflow of blood during systole."
          ]
        }
      }
    ];
  }
}

export async function toggleResourceCache(resourceId) {
  try {
    const res = await fetch(`${API_BASE}/resources/${resourceId}/toggle_cache/`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Toggle cache failed');
    return await res.json();
  } catch (err) {
    console.warn('Backend toggle failed, toggling locally', err);
    return { id: resourceId, is_cached_locally: true };
  }
}

export async function fetchStudents(schoolId, grade) {
  try {
    let url = `${API_BASE}/students/`;
    const params = [];
    if (schoolId) params.push(`school=${schoolId}`);
    if (grade) params.push(`grade=${grade}`);
    if (params.length) url += `?${params.join('&')}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch students');
    const data = await res.json();
    return data.results || data;
  } catch {
    return [
      { id: 1, name: "Pooja Gurjar", roll_number: "KH-01", grade: 8, gender: "Female", guardian_name: "Kishan Lal Gurjar", rfid_card_id: "RFID-801", learning_points: 340, completed_modules: 14, attendance_percentage: 96.5 },
      { id: 2, name: "Aman Meena", roll_number: "KH-02", grade: 8, gender: "Male", guardian_name: "Ramesh Meena", rfid_card_id: "RFID-802", learning_points: 280, completed_modules: 11, attendance_percentage: 94.0 },
      { id: 3, name: "Sunita Yadav", roll_number: "KH-03", grade: 8, gender: "Female", guardian_name: "Subhash Yadav", rfid_card_id: "RFID-803", learning_points: 410, completed_modules: 18, attendance_percentage: 98.2 },
      { id: 4, name: "Devendra Singh", roll_number: "KH-04", grade: 8, gender: "Male", guardian_name: "Bhagwan Singh", rfid_card_id: "RFID-804", learning_points: 190, completed_modules: 7, attendance_percentage: 89.0 },
      { id: 5, name: "Kavita Saini", roll_number: "KH-05", grade: 7, gender: "Female", guardian_name: "Gopal Saini", rfid_card_id: "RFID-701", learning_points: 320, completed_modules: 13, attendance_percentage: 95.0 },
      { id: 6, name: "Rohit Verma", roll_number: "KH-06", grade: 7, gender: "Male", guardian_name: "Manoj Verma", rfid_card_id: "RFID-702", learning_points: 230, completed_modules: 9, attendance_percentage: 91.5 },
      { id: 7, name: "Priya Choudhary", roll_number: "KH-07", grade: 6, gender: "Female", guardian_name: "Ramavtar Choudhary", rfid_card_id: "RFID-601", learning_points: 290, completed_modules: 12, attendance_percentage: 97.0 },
      { id: 8, name: "Mukesh Bheel", roll_number: "KH-08", grade: 6, gender: "Male", guardian_name: "Chhagan Bheel", rfid_card_id: "RFID-602", learning_points: 180, completed_modules: 8, attendance_percentage: 88.0 }
    ];
  }
}

export async function markSmartAttendance(data) {
  try {
    const res = await fetch(`${API_BASE}/attendance/mark_smart_attendance/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Attendance error');
    return await res.json();
  } catch (err) {
    console.warn('Offline attendance mark fallback', err);
    return {
      student: data.student_id,
      status: data.status,
      check_in_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      synced_to_cloud: data.is_cloud_synced ?? true,
      midday_meal_served: true
    };
  }
}

export async function fetchTickets(schoolId) {
  try {
    const url = schoolId ? `${API_BASE}/tickets/?school=${schoolId}` : `${API_BASE}/tickets/`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch tickets');
    const data = await res.json();
    return data.results || data;
  } catch {
    return [
      {
        id: 1,
        ticket_id: "TKT-ALW-2026-081",
        equipment_name: "Solar Inverter Battery String #2",
        severity: "medium",
        status: "technician_assigned",
        issue_summary: "Battery #3 electrolyte level below nominal threshold",
        description: "Automated IoT diagnostic flagged cell specific gravity. Block engineer dispatched for cell top-up.",
        reported_by: "IoT Auto Telemetry Monitor",
        technician_contact: "Rajesh Sharma (Block Solar Engineer, +91 98290-XXXXX)",
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        ticket_id: "TKT-ALW-2026-079",
        equipment_name: "Smart Classroom #3 Audio Amplifier",
        severity: "low",
        status: "resolved",
        issue_summary: "Loose 3.5mm AUX jack causing channel humming",
        description: "Replaced with gold-plated shielded audio cable. Tested with audio lessons.",
        reported_by: "Master Ji Ramesh Meena",
        technician_contact: "Local Village IT Sahayak",
        created_at: new Date().toISOString()
      }
    ];
  }
}

export async function createTicket(ticketData) {
  try {
    const res = await fetch(`${API_BASE}/tickets/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });
    if (!res.ok) throw new Error('Failed to create ticket');
    return await res.json();
  } catch {
    return {
      ...ticketData,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
  }
}

export async function fetchNotices(schoolId) {
  try {
    const res = await fetch(`${API_BASE}/notices/`);
    if (!res.ok) throw new Error('Failed to fetch notices');
    const data = await res.json();
    return data.results || data;
  } catch {
    return [
      {
        id: 1,
        title: "Evening Adult Digital Literacy & DBT / PM-Kisan Clinic",
        category: "digital_literacy",
        event_time: "Every Tuesday & Thursday, 5:30 PM - 7:00 PM",
        location: "Smart Classroom 1 & Village Wi-Fi Courtyard",
        organizer: "Gram Panchayat Khedla & Vidya Setu Student Volunteers",
        description: "Hands-on training for village elders, farmers, and women self-help groups on using Aadhaar-enabled payments, checking crop insurance (PMFBY), and digital e-Kyc.",
        is_active: true
      },
      {
        id: 2,
        title: "Poshan Abhiyaan: Quarterly Child Health & Eye Checkup Camp",
        category: "health_nutrition",
        event_time: "Saturday at 10:00 AM",
        location: "School Main Assembly Hall",
        organizer: "Primary Health Centre (PHC) Ramgarh & Anganwadi Workers",
        description: "Free pediatric eye exams, vitamin-A distribution, and Midday Meal nutritional assessment for all primary students and mothers.",
        is_active: true
      }
    ];
  }
}

export async function fetchSyncQueue() {
  try {
    const res = await fetch(`${API_BASE}/sync-queue/`);
    if (!res.ok) throw new Error('Failed to fetch sync queue');
    const data = await res.json();
    return data.results || data;
  } catch {
    return [
      { id: 1, record_type: "attendance_batch", payload: { count: 284 }, status: "synced", created_at: new Date().toISOString() },
      { id: 2, record_type: "quiz_results_batch", payload: { count: 28 }, status: "queued_offline", created_at: new Date().toISOString() }
    ];
  }
}

// ----------------------------------------------------
// 2.3.1 TEACHER & 2.3.2 STUDENT MODULE API SERVICES
// ----------------------------------------------------

export async function fetchClasses(schoolId) {
  try {
    const url = schoolId ? `${API_BASE}/classes/?school=${schoolId}` : `${API_BASE}/classes/`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch classes');
    const data = await res.json();
    return data.results || data;
  } catch {
    return [
      {
        id: 1,
        teacher_name: "Master Ji Ramesh Meena",
        title: "Interactive Science: Solar Inverters & DC-to-AC Conversion",
        subject: "Science & Innovation",
        grade: 8,
        scheduled_time: "Today, 11:30 AM",
        duration_mins: 45,
        meet_link: "https://meet.google.com/setu-vidya-live",
        calendar_sync_url: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vidya+Setu+Live+Science+Class&details=Solar+Inverter+and+Circuits+Demonstration&location=Google+Meet",
        status: "live"
      },
      {
        id: 2,
        teacher_name: "Master Ji Ramesh Meena",
        title: "Vedic Mathematics: Rapid Mental Arithmetic & Fractions",
        subject: "Mathematics",
        grade: 7,
        scheduled_time: "Tomorrow, 10:00 AM",
        duration_mins: 40,
        meet_link: "https://meet.google.com/math-fast-vedic",
        calendar_sync_url: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vedic+Math+Class&details=Speed+Multiplication+Techniques&location=Google+Meet",
        status: "scheduled"
      },
      {
        id: 3,
        teacher_name: "Sister Sunita Sharma",
        title: "Rainwater Harvesting & Borewell Recharge Case Study",
        subject: "Environmental Studies",
        grade: 8,
        scheduled_time: "Yesterday, 02:00 PM",
        duration_mins: 50,
        meet_link: "https://meet.google.com/rain-harvest-vidya",
        status: "completed",
        recorded_link: "https://vidyasetu.local/recordings/rainwater_class8.mp4"
      }
    ];
  }
}

export async function createClass(classData) {
  const res = await fetch(`${API_BASE}/classes/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(classData)
  });
  if (!res.ok) throw new Error('Failed to schedule class');
  return await res.json();
}

export async function toggleClassStatus(classId, status) {
  const res = await fetch(`${API_BASE}/classes/${classId}/toggle_status/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update class status');
  return await res.json();
}

export async function fetchAssignments(schoolId) {
  try {
    const url = schoolId ? `${API_BASE}/assignments/?school=${schoolId}` : `${API_BASE}/assignments/`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch assignments');
    const data = await res.json();
    return data.results || data;
  } catch {
    return [
      {
        id: 1,
        title: "Solar Energy Circuit Diagram & Efficiency Calculation",
        created_by_name: "Master Ji Ramesh Meena",
        subject: "Science & Innovation",
        grade: 8,
        description: "Draw a neat circuit diagram connecting the classroom rooftop solar PV panel, MPPT charge controller, 48V battery bank, and inverter. Calculate total watt-hours consumed by 4 LED tube lights and 1 laser projector over 5 hours.",
        attachment_name: "Solar_Circuits_Assignment_Class8.pdf",
        attachment_type: "PDF",
        due_date: "Tomorrow at 5:00 PM",
        total_points: 100,
        submissions: [
          {
            id: 1,
            student_name: "Pooja Gurjar",
            student_roll: "KH-01",
            submission_text: "Completed circuit diagram and calculated 1,450 Watt-Hours total classroom daily load.",
            attachment_name: "Pooja_Gurjar_Solar_Worksheet.pdf",
            status: "graded",
            grade_score: 96,
            teacher_feedback: "Outstanding circuit clarity and accurate Watt-Hour calculation!"
          }
        ]
      },
      {
        id: 2,
        title: "Vedic Math Problem Set: Urdhva Tiryagbhyam 20 Sums",
        created_by_name: "Master Ji Ramesh Meena",
        subject: "Mathematics",
        grade: 8,
        description: "Solve 20 two-digit and three-digit cross multiplication problems using the base-100 Vedic formula.",
        attachment_name: "Vedic_Math_Practice_Sheet.docx",
        attachment_type: "DOCX",
        due_date: "Friday, 4:00 PM",
        total_points: 50,
        submissions: []
      }
    ];
  }
}

export async function createAssignment(assignmentData) {
  const res = await fetch(`${API_BASE}/assignments/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(assignmentData)
  });
  if (!res.ok) throw new Error('Failed to create assignment');
  return await res.json();
}

export async function submitAssignment(assignmentId, submissionData) {
  const res = await fetch(`${API_BASE}/assignments/${assignmentId}/submit_solution/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(submissionData)
  });
  if (!res.ok) throw new Error('Failed to submit assignment');
  return await res.json();
}

export async function gradeSubmission(submissionId, score, feedback) {
  const res = await fetch(`${API_BASE}/submissions/${submissionId}/grade/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ score, feedback })
  });
  if (!res.ok) throw new Error('Failed to grade submission');
  return await res.json();
}

export async function fetchMaterials(schoolId) {
  try {
    const url = schoolId ? `${API_BASE}/materials/?school=${schoolId}` : `${API_BASE}/materials/`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch materials');
    const data = await res.json();
    return data.results || data;
  } catch {
    return [
      {
        id: 1,
        title: "Class 8 Science Complete Revision Notes (NCERT Chapter 14)",
        uploaded_by_name: "Master Ji Ramesh Meena",
        subject: "Science & Innovation",
        grade: 8,
        file_type: "PDF",
        file_name: "NCERT_Class8_Science_Ch14_Revision.pdf",
        file_size_mb: 4.8,
        downloads_count: 42
      },
      {
        id: 2,
        title: "Renewable Energy Slides Presentation for Smart Blackboard",
        uploaded_by_name: "Master Ji Ramesh Meena",
        subject: "Science & Innovation",
        grade: 8,
        file_type: "PPTX",
        file_name: "Solar_Energy_Blackboard_Slides.pptx",
        file_size_mb: 12.4,
        downloads_count: 29
      },
      {
        id: 3,
        title: "Vedic Arithmetic Shortcuts Quick Reference Guide",
        uploaded_by_name: "Sister Sunita Sharma",
        subject: "Mathematics",
        grade: 7,
        file_type: "DOCX",
        file_name: "Vedic_Math_CheatSheet.docx",
        file_size_mb: 2.1,
        downloads_count: 35
      }
    ];
  }
}

export async function uploadMaterial(materialData) {
  const res = await fetch(`${API_BASE}/materials/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(materialData)
  });
  if (!res.ok) throw new Error('Failed to upload material');
  return await res.json();
}

export async function incrementMaterialDownload(materialId) {
  try {
    const res = await fetch(`${API_BASE}/materials/${materialId}/download/`, {
      method: 'POST',
      headers: getHeaders()
    });
    return await res.json();
  } catch {
    return { success: true };
  }
}

export async function fetchForumTopics(category) {
  try {
    const url = category && category !== 'all' ? `${API_BASE}/forum/?category=${category}` : `${API_BASE}/forum/`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch forum');
    const data = await res.json();
    return data.results || data;
  } catch {
    return [
      {
        id: 1,
        author_name: "Master Ji Ramesh Meena",
        author_role: "teacher",
        title: "Notice: Upcoming Block Science Fair & Solar Demonstration Project",
        category: "announcement",
        content: "Students of Class 7 and 8 are invited to submit their science models by next Wednesday. We will demonstrate how our village school runs 100% on off-grid solar power!",
        is_announcement: true,
        is_pinned: true,
        replies: [
          {
            id: 1,
            author_name: "Pooja Gurjar",
            author_role: "student",
            content: "Sir, our Study Mate group is building a miniature solar water purifier model! Can we use the science lab multimeter?",
            is_teacher_endorsed: false
          },
          {
            id: 2,
            author_name: "Master Ji Ramesh Meena",
            author_role: "teacher",
            content: "Yes Pooja, you and your group can use both the digital multimeter and the demonstration solar cells during recess.",
            is_teacher_endorsed: true
          }
        ]
      },
      {
        id: 2,
        author_name: "Aman Meena",
        author_role: "student",
        title: "Question on Ohm's Law: Why does resistance increase with conductor length?",
        category: "academic_query",
        content: "Can someone explain in simple terms why a longer wire has more electrical resistance than a shorter wire?",
        is_announcement: false,
        is_pinned: false,
        replies: [
          {
            id: 3,
            author_name: "Master Ji Ramesh Meena",
            author_role: "teacher",
            content: "Imagine running through a crowded village market. The longer the distance, the more people you collide with! Similarly, electrons collide with more metal ions in a longer conductor.",
            is_teacher_endorsed: true
          }
        ]
      }
    ];
  }
}

export async function createForumTopic(topicData) {
  const res = await fetch(`${API_BASE}/forum/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(topicData)
  });
  if (!res.ok) throw new Error('Failed to post topic');
  return await res.json();
}

export async function replyToForumTopic(topicId, replyData) {
  const res = await fetch(`${API_BASE}/forum/${topicId}/add_reply/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(replyData)
  });
  if (!res.ok) throw new Error('Failed to post reply');
  return await res.json();
}

export async function fetchStudyGroups() {
  try {
    const res = await fetch(`${API_BASE}/study-groups/`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch study groups');
    const data = await res.json();
    return data.results || data;
  } catch {
    return [
      {
        id: 1,
        name: "Solar & Electronics Explorers",
        subject: "Science & Innovation",
        grade: 8,
        description: "Peer learning group focusing on practical solar circuits, multimeters, and building zero-cost STEM models.",
        members_count: 7,
        meeting_schedule: "Tue & Thu at 4:30 PM",
        lead_student: "Pooja Gurjar"
      },
      {
        id: 2,
        name: "Vedic Speed Math Circle",
        subject: "Mathematics",
        grade: 8,
        description: "Daily 20-minute mental calculation practice and speed arithmetic drills for competitive rural scholarship exams.",
        members_count: 9,
        meeting_schedule: "Mon, Wed & Fri at 4:00 PM",
        lead_student: "Aman Meena"
      }
    ];
  }
}

export async function joinStudyGroup(groupId) {
  const res = await fetch(`${API_BASE}/study-groups/${groupId}/join/`, {
    method: 'POST',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to join study group');
  return await res.json();
}

export async function fetchStudentGoals() {
  try {
    const res = await fetch(`${API_BASE}/goals/`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch goals');
    const data = await res.json();
    return data.results || data;
  } catch {
    return [
      { id: 1, title: "Complete Chapter 14 Solar Circuit Assignment", target_date: "Tomorrow", is_completed: true, notes: "Calculated total Watt-Hours." },
      { id: 2, title: "Master 10 Vedic Multiplication Shortcuts", target_date: "This Friday", is_completed: false, notes: "Practice base-100." },
      { id: 3, title: "25-minute Pomodoro Science Revision Session", target_date: "Today", is_completed: false, notes: "Review human heart." }
    ];
  }
}

export async function createStudentGoal(goalData) {
  const res = await fetch(`${API_BASE}/goals/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(goalData)
  });
  if (!res.ok) throw new Error('Failed to create goal');
  return await res.json();
}

export async function toggleStudentGoal(goalId) {
  const res = await fetch(`${API_BASE}/goals/${goalId}/toggle/`, {
    method: 'POST',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to toggle goal');
  return await res.json();
}

export async function askAITutor(queryData) {
  try {
    const res = await fetch(`${API_BASE}/ai-tutor/chat/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(queryData)
    });
    if (!res.ok) throw new Error('AI Tutor query failed');
    return await res.json();
  } catch (err) {
    return {
      reply: `💡 **AI Academic Tutor (Offline Local Mode):**\n\nRegarding *"${queryData.message}"*:\n\n1. Review NCERT Chapter 14 summary.\n2. In a rural off-grid setting, solar PV panels convert sunlight into DC current via the photovoltaic effect.\n3. Discuss this with your Study Mate Group!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
}

// ==========================================
// Braille Literacy & Assistive Studio APIs
// ==========================================

export async function fetchBrailleLessons(category = null) {
  try {
    const url = category ? `${API_BASE}/braille/lessons/?category=${encodeURIComponent(category)}` : `${API_BASE}/braille/lessons/`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch braille lessons');
    const data = await res.json();
    return data.results || data;
  } catch {
    // Offline client fallback
    return [
      {
        id: 1,
        title: "Bharati Braille: Hindi Vowels (स्वर ज्ञान व स्पर्श अभ्यास)",
        category: "bharati_hindi",
        level: "beginner",
        order: 1,
        description: "Learn primary 11 Hindi vowels using the standardized Bharati Braille 6-dot matrix.",
        characters_data: [
          { char: "अ", dots: [1], unicode: "⠁", name: "A (अ)", desc: "Dot 1" },
          { char: "आ", dots: [3, 4, 5], unicode: "⠜", name: "AA (आ)", desc: "Dots 3, 4, 5" },
          { char: "इ", dots: [2, 4], unicode: "⠊", name: "I (इ)", desc: "Dots 2, 4" },
          { char: "ई", dots: [3, 5], unicode: "⠔", name: "EE (ई)", desc: "Dots 3, 5" },
          { char: "उ", dots: [1, 3, 6], unicode: "⠥", name: "U (उ)", desc: "Dots 1, 3, 6" },
          { char: "ऊ", dots: [1, 2, 5, 6], unicode: "⠳", name: "OO (ऊ)", desc: "Dots 1, 2, 5, 6" },
          { char: "ए", dots: [1, 5], unicode: "⠑", name: "E (ए)", desc: "Dots 1, 5" },
          { char: "ऐ", dots: [3, 4], unicode: "⠌", name: "AI (ऐ)", desc: "Dots 3, 4" },
          { char: "ओ", dots: [1, 3, 5], unicode: "⠕", name: "O (ओ)", desc: "Dots 1, 3, 5" },
          { char: "औ", dots: [2, 4, 6], unicode: "⠪", name: "AU (औ)", desc: "Dots 2, 4, 6" }
        ],
        quizzes: [
          {
            id: 1,
            prompt: "Which dot combination represents Hindi vowel 'अ' in Bharati Braille?",
            target_char: "अ",
            expected_dots: [1],
            braille_unicode: "⠁",
            audio_hint: "Dot 1 alone at the top left of the Braille cell.",
            options: [
              { label: "Dot 1 (Top Left)", dots: [1], correct: true },
              { label: "Dots 1, 2", dots: [1, 2], correct: false },
              { label: "Dots 2, 4", dots: [2, 4], correct: false },
              { label: "Dots 1, 5", dots: [1, 5], correct: false }
            ],
            explanation: "In Bharati Braille, 'अ' is represented by Dot 1."
          }
        ]
      },
      {
        id: 2,
        title: "Standard English Braille (Grade 1 A-Z)",
        category: "english_alphabet",
        level: "beginner",
        order: 2,
        description: "Master the 26 letters of the international English Braille alphabet.",
        characters_data: [
          { char: "A", dots: [1], unicode: "⠁", name: "Letter A", desc: "Dot 1" },
          { char: "B", dots: [1, 2], unicode: "⠃", name: "Letter B", desc: "Dots 1, 2" },
          { char: "C", dots: [1, 4], unicode: "⠉", name: "Letter C", desc: "Dots 1, 4" },
          { char: "D", dots: [1, 4, 5], unicode: "⠙", name: "Letter D", desc: "Dots 1, 4, 5" },
          { char: "E", dots: [1, 5], unicode: "⠑", name: "Letter E", desc: "Dots 1, 5" },
          { char: "F", dots: [1, 2, 4], unicode: "⠋", name: "Letter F", desc: "Dots 1, 2, 4" }
        ],
        quizzes: []
      }
    ];
  }
}

export async function translateTextToBraille(text) {
  try {
    const res = await fetch(`${API_BASE}/braille/translate/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Translation failed');
    return await res.json();
  } catch {
    // Client-side fallback translation
    const fallbackMap = {
      'a': { dots: [1], u: '⠁', p: 'A' },
      'b': { dots: [1, 2], u: '⠃', p: 'B' },
      'c': { dots: [1, 4], u: '⠉', p: 'C' },
      'd': { dots: [1, 4, 5], u: '⠙', p: 'D' },
      'e': { dots: [1, 5], u: '⠑', p: 'E' },
      'f': { dots: [1, 2, 4], u: '⠋', p: 'F' },
      'g': { dots: [1, 2, 4, 5], u: '⠛', p: 'G' },
      'h': { dots: [1, 2, 5], u: '⠓', p: 'H' },
      'i': { dots: [2, 4], u: '⠊', p: 'I' },
      'j': { dots: [2, 4, 5], u: '⠚', p: 'J' },
      'k': { dots: [1, 3], u: '⠅', p: 'K' },
      'l': { dots: [1, 2, 3], u: '⠇', p: 'L' },
      'm': { dots: [1, 3, 4], u: '⠍', p: 'M' },
      'n': { dots: [1, 3, 4, 5], u: '⠝', p: 'N' },
      'o': { dots: [1, 3, 5], u: '⠕', p: 'O' },
      'p': { dots: [1, 2, 3, 4], u: '⠏', p: 'P' },
      'q': { dots: [1, 2, 3, 4, 5], u: '⠟', p: 'Q' },
      'r': { dots: [1, 2, 3, 5], u: '⠗', p: 'R' },
      's': { dots: [2, 3, 4], u: '⠎', p: 'S' },
      't': { dots: [2, 3, 4, 5], u: '⠞', p: 'T' },
      'u': { dots: [1, 3, 6], u: '⠥', p: 'U' },
      'v': { dots: [1, 2, 3, 6], u: '⠧', p: 'V' },
      'w': { dots: [2, 4, 5, 6], u: '⠺', p: 'W' },
      'x': { dots: [1, 3, 4, 6], u: '⠭', p: 'X' },
      'y': { dots: [1, 3, 4, 5, 6], u: '⠽', p: 'Y' },
      'z': { dots: [1, 3, 5, 6], u: '⠵', p: 'Z' },
      'अ': { dots: [1], u: '⠁', p: 'A (अ)' },
      'आ': { dots: [3, 4, 5], u: '⠜', p: 'AA (आ)' },
      'क': { dots: [1, 3], u: '⠅', p: 'KA (क)' },
      'म': { dots: [1, 3, 4], u: '⠍', p: 'MA (म)' },
      'न': { dots: [1, 3, 4, 5], u: '⠝', p: 'NA (न)' },
      'स': { dots: [2, 3, 4], u: '⠎', p: 'SA (स)' },
      'त': { dots: [2, 3, 4, 5], u: '⠞', p: 'TA (त)' },
      ' ': { dots: [], u: '⠀', p: 'Space' }
    };

    const cells = [];
    const unicodeList = [];
    for (const c of text) {
      const match = fallbackMap[c.toLowerCase()] || { dots: [], u: '⠀', p: c };
      cells.push({
        char: c,
        dots: match.dots,
        unicode: match.u,
        phonetic: match.p,
        desc: `Dots ${match.dots.join(', ') || 'none'}`
      });
      unicodeList.push(match.u);
    }
    return {
      original_text: text,
      braille_unicode: unicodeList.join(''),
      cells,
      total_cells: cells.length
    };
  }
}

export async function fetchBrailleProgress(studentName = 'Pooja Gurjar') {
  try {
    const res = await fetch(`${API_BASE}/braille/progress/?student_name=${encodeURIComponent(studentName)}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch progress');
    const data = await res.json();
    return data.results || data;
  } catch {
    return [
      {
        id: 1,
        student_name: studentName,
        lesson_title: "Bharati Braille: Hindi Vowels",
        category: "bharati_hindi",
        accuracy_percent: 95.0,
        score: 180,
        completed: true,
        practice_minutes: 25,
        mastered_chars: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ओ"]
      }
    ];
  }
}

export async function saveBrailleProgress(progressData) {
  const res = await fetch(`${API_BASE}/braille/progress/record_practice/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(progressData)
  });
  if (!res.ok) throw new Error('Failed to record Braille progress');
  return await res.json();
}

// ===========================================================================
// 3.3 to 3.25 ENTERPRISE & ADMINISTRATIVE APIS
// ===========================================================================

export async function fetchEnterpriseAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/enterprise/analytics/`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Analytics failed');
    return await res.json();
  } catch (err) {
    return {
      cluster_summary: {
        total_schools: 4,
        total_students: 286,
        total_teachers: 12,
        student_teacher_ratio: 23.8,
        female_ratio_percent: 51.7,
        attendance_rate_cluster: 92.8,
        midday_meal_served_today: 268
      },
      connectivity_grid: {
        online_count: 3,
        intermittent_count: 1,
        offline_count: 0,
        avg_latency_ms: 42,
        uptime_percentage: 98.4
      },
      solar_energy_iot: {
        total_solar_kw: 16.2,
        avg_battery_health: 87.5,
        daily_clean_units_kwh: 74.5,
        co2_saved_kg_monthly: 2180
      },
      scholarships_dbt: {
        total_applications: 14,
        approved_count: 12,
        disbursed_count: 9,
        total_funds_disbursed_inr: 108000,
        disbursement_rate_percent: 75.0
      },
      grievance_redressal: {
        total_tickets: 6,
        resolved_count: 5,
        open_count: 1,
        avg_resolution_hours: 36
      },
      smart_hardware_health: {
        healthy: 14,
        maintenance_due: 2,
        critical_down: 0,
        overall_health_index: 96.2
      },
      dropout_risk_early_warning: [
        { category: 'High Risk (<70% Attendance)', students_count: 12, action: 'Panchayat & Teacher Home Visit Triggered' },
        { category: 'Moderate Risk (Migrant Season)', students_count: 28, action: 'Edge Offline Video Packs Dispatched' },
        { category: 'Safe & High Engagement', students_count: 246, action: 'Scholarship Accelerated' }
      ]
    };
  }
}

export async function fetchRBAC() {
  const res = await fetch(`${API_BASE}/enterprise/rbac/`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch RBAC');
  const data = await res.json();
  return data.results || data;
}

export async function fetchTeachers(schoolId = null) {
  const url = schoolId ? `${API_BASE}/enterprise/teachers/?school=${schoolId}` : `${API_BASE}/enterprise/teachers/`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch teachers');
  const data = await res.json();
  return data.results || data;
}

export async function fetchParents() {
  const res = await fetch(`${API_BASE}/enterprise/parents/`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch parents');
  const data = await res.json();
  return data.results || data;
}

export async function fetchAcademicClasses(schoolId = null) {
  const url = schoolId ? `${API_BASE}/enterprise/classes/?school=${schoolId}` : `${API_BASE}/enterprise/classes/`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch academic classes');
  const data = await res.json();
  return data.results || data;
}

export async function fetchSubjects() {
  const res = await fetch(`${API_BASE}/enterprise/subjects/`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch subjects');
  const data = await res.json();
  return data.results || data;
}

export async function fetchCourseAllocations(schoolId = null) {
  const url = schoolId ? `${API_BASE}/enterprise/course-allocations/?school=${schoolId}` : `${API_BASE}/enterprise/course-allocations/`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch course allocations');
  const data = await res.json();
  return data.results || data;
}

export async function fetchOnlineCourses() {
  const res = await fetch(`${API_BASE}/enterprise/online-courses/`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch online courses');
  const data = await res.json();
  return data.results || data;
}

export async function fetchOfflinePackages(schoolId = null) {
  const url = schoolId ? `${API_BASE}/enterprise/offline-packages/?school=${schoolId}` : `${API_BASE}/enterprise/offline-packages/`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch offline packages');
  const data = await res.json();
  return data.results || data;
}

export async function fetchSmartEquipment(schoolId = null) {
  const url = schoolId ? `${API_BASE}/enterprise/smart-equipment/?school=${schoolId}` : `${API_BASE}/enterprise/smart-equipment/`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch smart equipment');
  const data = await res.json();
  return data.results || data;
}

export async function fetchTeacherAttendance(schoolId = null) {
  const url = schoolId ? `${API_BASE}/enterprise/teacher-attendance/?school=${schoolId}` : `${API_BASE}/enterprise/teacher-attendance/`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch teacher attendance');
  const data = await res.json();
  return data.results || data;
}

export async function fetchOnlineExams(schoolId = null) {
  const url = schoolId ? `${API_BASE}/enterprise/exams/?school=${schoolId}` : `${API_BASE}/enterprise/exams/`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch online exams');
  const data = await res.json();
  return data.results || data;
}

export async function fetchStudentReportCards(studentId = null) {
  const url = studentId ? `${API_BASE}/enterprise/report-cards/?student=${studentId}` : `${API_BASE}/enterprise/report-cards/`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch report cards');
  const data = await res.json();
  return data.results || data;
}

export async function fetchConnectivityAuditMetrics(schoolId = null) {
  const url = schoolId ? `${API_BASE}/enterprise/connectivity-audit/?school=${schoolId}` : `${API_BASE}/enterprise/connectivity-audit/`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch connectivity audit');
  const data = await res.json();
  return data.results || data;
}

export async function fetchScholarships() {
  const res = await fetch(`${API_BASE}/enterprise/scholarships/`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch scholarships');
  const data = await res.json();
  return data.results || data;
}

export async function fetchScholarshipApplications() {
  const res = await fetch(`${API_BASE}/enterprise/scholarship-applications/`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch scholarship applications');
  const data = await res.json();
  return data.results || data;
}

export async function approveScholarshipApp(appId) {
  const res = await fetch(`${API_BASE}/enterprise/scholarship-applications/${appId}/approve_application/`, {
    method: 'POST',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to approve scholarship');
  return await res.json();
}

export async function disburseScholarshipDBT(appId) {
  const res = await fetch(`${API_BASE}/enterprise/scholarship-applications/${appId}/disburse_dbt/`, {
    method: 'POST',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to disburse scholarship DBT');
  return await res.json();
}

export async function fetchParentMeetings(schoolId = null) {
  const url = schoolId ? `${API_BASE}/enterprise/parent-meetings/?school=${schoolId}` : `${API_BASE}/enterprise/parent-meetings/`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch parent meetings');
  const data = await res.json();
  return data.results || data;
}

export async function fetchParentMessages() {
  const res = await fetch(`${API_BASE}/enterprise/parent-messages/`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch parent messages');
  const data = await res.json();
  return data.results || data;
}

export async function fetchBroadcastNotifications(schoolId = null) {
  const url = schoolId ? `${API_BASE}/enterprise/broadcast-notifications/?school=${schoolId}` : `${API_BASE}/enterprise/broadcast-notifications/`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  const data = await res.json();
  return data.results || data;
}

export async function createBroadcastNotification(notifData) {
  const res = await fetch(`${API_BASE}/enterprise/broadcast-notifications/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(notifData)
  });
  if (!res.ok) throw new Error('Failed to dispatch notification');
  return await res.json();
}

export async function fetchGrievanceTickets(schoolId = null) {
  const url = schoolId ? `${API_BASE}/enterprise/grievances/?school=${schoolId}` : `${API_BASE}/enterprise/grievances/`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch grievances');
  const data = await res.json();
  return data.results || data;
}

export async function resolveGrievanceTicket(ticketId, resolutionNotes) {
  const res = await fetch(`${API_BASE}/enterprise/grievances/${ticketId}/resolve_ticket/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ resolution_notes: resolutionNotes })
  });
  if (!res.ok) throw new Error('Failed to resolve grievance');
  return await res.json();
}

export async function fetchGeneratedReports(schoolId = null) {
  const url = schoolId ? `${API_BASE}/enterprise/generated-reports/?school=${schoolId}` : `${API_BASE}/enterprise/generated-reports/`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch reports');
  const data = await res.json();
  return data.results || data;
}

export async function triggerGenerateReport(reportData) {
  const res = await fetch(`${API_BASE}/enterprise/generated-reports/generate_report/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(reportData)
  });
  if (!res.ok) throw new Error('Failed to generate report');
  return await res.json();
}

export async function fetchSystemConfigurations() {
  const res = await fetch(`${API_BASE}/enterprise/system-configs/`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch system configurations');
  const data = await res.json();
  return data.results || data;
}

export async function fetchAuditLogs() {
  const res = await fetch(`${API_BASE}/enterprise/audit-logs/`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  const data = await res.json();
  return data.results || data;
}



