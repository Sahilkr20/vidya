import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Layers, 
  FileCheck, 
  Lightbulb, 
  Printer, 
  Share2, 
  CheckCircle,
  Copy
} from 'lucide-react';

export default function TeacherHub({ school }) {
  const [selectedTopic, setSelectedTopic] = useState('solar_energy');
  const [teachingAid, setTeachingAid] = useState('pebbles_and_shadow');
  const [copied, setCopied] = useState(false);

  const lessonPlans = {
    solar_energy: {
      title: "Solar Energy & Circuitry (Multi-Grade Class 7 & 8)",
      titleHi: "सौर ऊर्जा एवं विद्युत परिपथ (कक्षा 7 एवं 8)",
      objective: "Demystify direct sunlight into electricity using the school's own rooftop solar panels.",
      ruralResources: "School solar inverter display, small LED diode, copper wire scrap, transparent glass sheet.",
      multiGradeStrategy: [
        { grade: "Class 7 (Guided Peer Activity)", task: "Observe and log solar inverter wattage every 15 minutes between 10:00 AM and 12:00 PM. Plot sunlight curve on blackboard." },
        { grade: "Class 8 (Direct Instruction)", task: "Explain difference between AC vs DC current, calculate watt-hours, and understand battery storage safety." }
      ],
      blackboardFormula: "Power (Watts) = Voltage (Volts) × Current (Amperes) | P = V × I",
      vernacularExplanation: "जैसे नल से बहता पानी करंट (Current) है और टंकी की ऊंचाई वोल्टेज (Voltage) है, वैसे ही सोलर पैनल सूरज की धूप से इलेक्ट्रॉन को गति देकर बिजली पैदा करता है।"
    },
    rainwater_harvesting: {
      title: "Rainwater Harvesting & Soil Conservation (Class 6 & 7)",
      titleHi: "वर्षा जल संचयन एवं मृदा संरक्षण",
      objective: "Understand local water table depletion and practical rooftop catchment.",
      ruralResources: "Sand, gravel, charcoal from kitchen stove, plastic bottle cut in half, muddy pond water.",
      multiGradeStrategy: [
        { grade: "Class 6 (Hands-On Lab)", task: "Construct a 3-layer gravity water filter in a cut plastic bottle using sand, charcoal, and pebbles." },
        { grade: "Class 7 (Field Survey)", task: "Measure school tin roof area in square meters and estimate monsoon rainwater collection volume." }
      ],
      blackboardFormula: "Water Harvested (Liters) = Roof Area (m²) × Rainfall (mm) × Runoff Coefficient (0.85)",
      vernacularExplanation: "बारिश की हर बूंद को गांव की ज़मीन में वापस उतारना हमारी जिम्मेदारी है ताकि गर्मियों में बोरवेल का पानी न सूखे।"
    },
    fast_math: {
      title: "Vedic Mental Arithmetic & Marketplace Estimation (Class 5 & 6)",
      titleHi: "वैदिक गणित एवं दैनिक हाट-बाज़ार गणना",
      objective: "Perform rapid 2-digit calculations without paper for weekly village haat (market) trade.",
      ruralResources: "Dry tamarind seeds or pebbles for abacus representation.",
      multiGradeStrategy: [
        { grade: "Class 5 (Bazaar Roleplay)", task: "Set up mock village vegetable shop, calculate change from 100 and 500 rupee notes mentally." },
        { grade: "Class 6 (Vedic Cross-Multiplication)", task: "Practice 10 mental sums of 2-digit numbers using 'Urdhva Tiryagbhyam' method." }
      ],
      blackboardFormula: "Base 100 Method: (100 - a) × (100 - b) = (100 - a - b) | (a × b)",
      vernacularExplanation: "बिना कागज़-कलम के दिमाग में गुणा करने से बच्चों का संख्यात्मक आत्मविश्वास बढ़ता है।"
    }
  };

  const currentPlan = lessonPlans[selectedTopic];

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${currentPlan.title}\nObjective: ${currentPlan.objective}\nFormula: ${currentPlan.blackboardFormula}\nExplanation: ${currentPlan.vernacularExplanation}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-solar">
              <Sparkles size={13} />
              AI Rural Pedagogy Assistant
            </span>
            <span className="badge badge-cyan">
              <GraduationCap size={13} />
              Multi-Grade Classroom Toolkit
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Teacher Copilot & Vernacular Lesson Studio
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Curriculum adaptations specifically engineered for single-teacher, multi-grade rural schools
          </p>
        </div>

        <button 
          onClick={handleCopy}
          className="btn-primary"
          style={{ fontSize: '0.8rem', padding: '8px 16px' }}
        >
          {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
          {copied ? 'Copied Lesson Plan!' : 'Copy to Blackboard'}
        </button>
      </div>

      {/* Select Topic Chips */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {[
          { id: 'solar_energy', label: 'Solar & Clean Energy', icon: '☀️' },
          { id: 'rainwater_harvesting', label: 'Rainwater & Ecology', icon: '💧' },
          { id: 'fast_math', label: 'Vedic Math & Market Calc', icon: '🧮' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setSelectedTopic(item.id)}
            style={{
              background: selectedTopic === item.id ? 'var(--cyan-500)' : 'var(--bg-card)',
              color: selectedTopic === item.id ? '#ffffff' : 'var(--text-primary)',
              border: selectedTopic === item.id ? '1px solid var(--cyan-400)' : '1px solid var(--border-subtle)',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Lesson Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.8fr) minmax(300px, 1fr)',
        gap: '20px'
      }}>
        {/* Left: Lesson plan and blackboard notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                  {currentPlan.title}
                </h2>
                <div style={{ fontSize: '0.92rem', color: '#fb923c', fontWeight: 600 }}>
                  {currentPlan.titleHi}
                </div>
              </div>
              <span className="badge badge-online">NEP 2020 Experiential</span>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              <strong>Classroom Objective:</strong> {currentPlan.objective}
            </p>

            {/* Rural zero-cost materials */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
                <Lightbulb size={14} />
                <span>Zero-Cost Village Teaching Aids (कबाड़ से जुगाड़)</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                {currentPlan.ruralResources}
              </p>
            </div>

            {/* Multi-Grade Classroom Task Distribution */}
            <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
              Multi-Grade Class Workflow (Simultaneous Teaching):
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {currentPlan.multiGradeStrategy.map((strat, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderLeft: '4px solid #38bdf8',
                    padding: '12px 14px',
                    borderRadius: '0 8px 8px 0'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#38bdf8', marginBottom: '4px' }}>
                    {strat.grade}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {strat.task}
                  </div>
                </div>
              ))}
            </div>

            {/* Vernacular Explainer */}
            <div style={{
              background: 'rgba(249, 115, 22, 0.08)',
              border: '1px solid rgba(249, 115, 22, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '16px'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fb923c', marginBottom: '6px' }}>
                सरल देसी भाषा में समझाएं (Vernacular Concept Analogy):
              </div>
              <p style={{ fontSize: '0.86rem', color: '#f8fafc', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{currentPlan.vernacularExplanation}"
              </p>
            </div>
          </div>
        </div>

        {/* Right: Blackboard Sketch & Teacher Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
              Blackboard Diagram Summary
            </h3>
            <div style={{
              background: '#04101e',
              border: '2px dashed #1e3a5f',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              color: '#38bdf8',
              lineHeight: 1.6,
              marginBottom: '14px'
            }}>
              <div style={{ color: '#fb923c', fontWeight: 700 }}>[ BLACKBOARD HEADER ]</div>
              <div style={{ marginTop: '6px' }}>{currentPlan.blackboardFormula}</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                [Sunlight ☀️] ➔ [PV Panel] ➔ [DC Charge Controller] ➔ [Tubular Battery] ➔ [Inverter] ➔ [Projector 📽️]
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Write this summary diagram on the blackboard before starting the video lesson from the edge server.
            </p>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              PM-SHRI & SCERT Teacher Guidelines
            </h3>
            <ul style={{ paddingLeft: '18px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li>Encourage female students to operate the multimeter and record readings.</li>
              <li>Save battery power by dimming projector brightness during the hands-on lab portion.</li>
              <li>Sync class quiz scores once the solar charge reaches 90% and internet activates.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
