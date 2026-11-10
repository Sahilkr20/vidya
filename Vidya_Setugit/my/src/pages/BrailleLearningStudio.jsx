import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  BookOpen, 
  Award, 
  BrainCircuit, 
  Copy, 
  Check, 
  HelpCircle, 
  Layers, 
  Search, 
  RefreshCw, 
  Save, 
  Play, 
  Headphones, 
  Zap, 
  GraduationCap
} from 'lucide-react';
import { 
  fetchBrailleLessons, 
  translateTextToBraille, 
  fetchBrailleProgress, 
  saveBrailleProgress 
} from '../services/api';

// Helper to compute Braille Unicode from dot array
function computeBrailleUnicode(dots = []) {
  if (!dots || dots.length === 0) return '⠀';
  const offset = dots.reduce((acc, d) => (d >= 1 && d <= 8 ? acc + (1 << (d - 1)) : acc), 0);
  return String.fromCharCode(0x2800 + offset);
}

// Reverse lookup table for 6-dot cells
const DOT_LOOKUP = {
  '1': { hi: 'अ', en: 'A', num: '1', name: 'A / अ / 1', desc: 'Dot 1 alone' },
  '1,2': { hi: 'ब', en: 'B', num: '2', name: 'B / ब / 2', desc: 'Dots 1, 2' },
  '1,4': { hi: 'च', en: 'C', num: '3', name: 'C / च / 3', desc: 'Dots 1, 4' },
  '1,4,5': { hi: 'द', en: 'D', num: '4', name: 'D / द / 4', desc: 'Dots 1, 4, 5' },
  '1,5': { hi: 'ए', en: 'E', num: '5', name: 'E / ए / 5', desc: 'Dots 1, 5' },
  '1,2,4': { hi: 'छ', en: 'F', num: '6', name: 'F / छ / 6', desc: 'Dots 1, 2, 4' },
  '1,2,4,5': { hi: 'ग', en: 'G', num: '7', name: 'G / ग / 7', desc: 'Dots 1, 2, 4, 5' },
  '1,2,5': { hi: 'ह', en: 'H', num: '8', name: 'H / ह / 8', desc: 'Dots 1, 2, 5' },
  '2,4': { hi: 'इ', en: 'I', num: '9', name: 'I / इ / 9', desc: 'Dots 2, 4' },
  '2,4,5': { hi: 'ज', en: 'J', num: '0', name: 'J / ज / 0', desc: 'Dots 2, 4, 5' },
  '1,3': { hi: 'क', en: 'K', num: null, name: 'K / क', desc: 'Dots 1, 3' },
  '1,2,3': { hi: 'ल', en: 'L', num: null, name: 'L / ल', desc: 'Dots 1, 2, 3' },
  '1,3,4': { hi: 'म', en: 'M', num: null, name: 'M / म', desc: 'Dots 1, 3, 4' },
  '1,3,4,5': { hi: 'न', en: 'N', num: null, name: 'N / न', desc: 'Dots 1, 3, 4, 5' },
  '1,3,5': { hi: 'ओ', en: 'O', num: null, name: 'O / ओ', desc: 'Dots 1, 3, 5' },
  '1,2,3,4': { hi: 'प', en: 'P', num: null, name: 'P / प', desc: 'Dots 1, 2, 3, 4' },
  '1,2,3,4,5': { hi: 'क्ष', en: 'Q', num: null, name: 'Q / क्ष', desc: 'Dots 1, 2, 3, 4, 5' },
  '1,2,3,5': { hi: 'र', en: 'R', num: null, name: 'R / र', desc: 'Dots 1, 2, 3, 5' },
  '2,3,4': { hi: 'स', en: 'S', num: null, name: 'S / स', desc: 'Dots 2, 3, 4' },
  '2,3,4,5': { hi: 'त', en: 'T', num: null, name: 'T / त', desc: 'Dots 2, 3, 4, 5' },
  '1,3,6': { hi: 'उ', en: 'U', num: null, name: 'U / उ', desc: 'Dots 1, 3, 6' },
  '1,2,3,6': { hi: 'व', en: 'V', num: null, name: 'V / व', desc: 'Dots 1, 2, 3, 6' },
  '2,4,5,6': { hi: 'ठ', en: 'W', num: null, name: 'W / ठ', desc: 'Dots 2, 4, 5, 6' },
  '1,3,4,6': { hi: 'ध', en: 'X', num: null, name: 'X / ध', desc: 'Dots 1, 3, 4, 6' },
  '1,3,4,5,6': { hi: 'य', en: 'Y', num: null, name: 'Y / य', desc: 'Dots 1, 3, 4, 5, 6' },
  '1,3,5,6': { hi: 'ज्ञ', en: 'Z', num: null, name: 'Z / ज्ञ', desc: 'Dots 1, 3, 5, 6' },
  '3,4,5': { hi: 'आ', en: null, num: null, name: 'AA / आ', desc: 'Dots 3, 4, 5' },
  '3,5': { hi: 'ई', en: null, num: null, name: 'EE / ई', desc: 'Dots 3, 5' },
  '1,2,5,6': { hi: 'ऊ', en: null, num: null, name: 'OO / ऊ', desc: 'Dots 1, 2, 5, 6' },
  '3,4': { hi: 'ऐ', en: null, num: null, name: 'AI / ऐ', desc: 'Dots 3, 4' },
  '2,4,6': { hi: 'औ', en: null, num: null, name: 'AU / औ', desc: 'Dots 2, 4, 6' },
  '4,6': { hi: 'ख', en: null, num: null, name: 'KHA / ख', desc: 'Dots 4, 6' },
  '1,2,6': { hi: 'घ', en: null, num: null, name: 'GHA / घ', desc: 'Dots 1, 2, 6' },
  '4,5': { hi: 'भ', en: null, num: null, name: 'BHA / भ', desc: 'Dots 4, 5' },
  '2,3,5': { hi: 'फ', en: '+', num: '+', name: 'फ / Plus (+)', desc: 'Dots 2, 3, 5' },
  '3,4,5,6': { hi: '#', en: '#', num: '#', name: 'Number Prefix (⠼)', desc: 'Dots 3, 4, 5, 6' },
  '2,3,5,6': { hi: '=', en: '=', num: '=', name: 'Equals Sign (=)', desc: 'Dots 2, 3, 5, 6' }
};

export default function BrailleLearningStudio({ school, currentUser }) {
  const [activeTab, setActiveTab] = useState('tactile_cell'); // 'tactile_cell', 'translator', 'quiz', 'curriculum', 'progress'
  
  // 6-Dot Tactile Cell Simulator State
  const [activeDots, setActiveDots] = useState([1]); // default to Dot 1 ('A' / 'अ')
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [lastSpeechText, setLastSpeechText] = useState('');

  // Text-to-Braille Translator State
  const [inputText, setInputText] = useState('नमस्ते Vidya Setu 123');
  const [translationResult, setTranslationResult] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Curriculum & Quiz State from MySQL
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loadingLessons, setLoadingLessons] = useState(false);

  // Interactive Quiz State
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);

  // Student Progress State from MySQL
  const [progressList, setProgressList] = useState([]);
  const [saveStatus, setSaveStatus] = useState(null);

  const studentName = currentUser?.profile?.full_name || 'Pooja Gurjar';

  // Load Lessons and Progress from Backend MySQL
  useEffect(() => {
    loadLessonsAndProgress();
  }, [categoryFilter]);

  async function loadLessonsAndProgress() {
    setLoadingLessons(true);
    try {
      const lessonData = await fetchBrailleLessons(categoryFilter === 'all' ? null : categoryFilter);
      setLessons(lessonData);
      if (lessonData.length > 0 && !selectedLesson) {
        setSelectedLesson(lessonData[0]);
      }
      const prog = await fetchBrailleProgress(studentName);
      setProgressList(prog);
    } catch (err) {
      console.error('Error loading Braille data:', err);
    } finally {
      setLoadingLessons(false);
    }
  }

  // Trigger Live Translation on text change
  useEffect(() => {
    let isMounted = true;
    async function doTranslate() {
      if (!inputText.trim()) {
        setTranslationResult(null);
        return;
      }
      setIsTranslating(true);
      try {
        const res = await translateTextToBraille(inputText);
        if (isMounted) setTranslationResult(res);
      } catch (err) {
        console.error('Translation error:', err);
      } finally {
        if (isMounted) setIsTranslating(false);
      }
    }
    const timer = setTimeout(doTranslate, 300);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [inputText]);

  // Accessibility Speech Synthesis
  function speakText(text) {
    if (!speechEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    // Prefer English/Hindi voice if available
    window.speechSynthesis.speak(utterance);
    setLastSpeechText(text);
  }

  // Toggle dot on 6-dot tactile simulator
  function handleToggleDot(dotNum) {
    let nextDots;
    if (activeDots.includes(dotNum)) {
      nextDots = activeDots.filter(d => d !== dotNum).sort((a, b) => a - b);
    } else {
      nextDots = [...activeDots, dotNum].sort((a, b) => a - b);
    }
    setActiveDots(nextDots);

    // Identify current cell
    const key = nextDots.join(',');
    const found = DOT_LOOKUP[key];
    if (found) {
      speakText(`${found.name}. Active dots: ${nextDots.join(' and ')}`);
    } else if (nextDots.length > 0) {
      speakText(`Dots ${nextDots.join(' and ')}`);
    } else {
      speakText("Empty cell");
    }
  }

  // Load a character into 6-dot simulator
  function loadCharacterDots(dots, charName) {
    setActiveDots([...dots].sort((a, b) => a - b));
    setActiveTab('tactile_cell');
    speakText(`Loaded character ${charName}. Dots ${dots.join(' and ')}`);
  }

  // Current detected character
  const currentKey = activeDots.join(',');
  const currentInfo = DOT_LOOKUP[currentKey] || null;
  const currentUnicode = computeBrailleUnicode(activeDots);

  // Copy to clipboard
  function handleCopy(text) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Handle Quiz Option Selection
  function handleSelectQuizOption(idx, option, currentQuiz) {
    if (quizSubmitted) return;
    setSelectedOptionIndex(idx);
    const isCorrect = option.correct;
    setQuizSubmitted(true);
    if (isCorrect) {
      setQuizScore(prev => prev + 10);
      setQuizFeedback({
        type: 'success',
        msg: `🎉 Brilliant! Correct answer! ${currentQuiz.explanation || ''}`
      });
      speakText("Brilliant! Correct answer.");
    } else {
      setQuizFeedback({
        type: 'error',
        msg: `Incorrect. Expected answer: ${currentQuiz.target_char} (${currentQuiz.explanation || ''})`
      });
      speakText(`Not quite. The correct answer was ${currentQuiz.target_char}`);
    }
  }

  // Save Quiz Mastery to MySQL
  async function handleSaveQuizProgress(lessonId) {
    try {
      setSaveStatus('saving');
      await saveBrailleProgress({
        student_name: studentName,
        lesson_id: lessonId,
        score: quizScore,
        accuracy_percent: 100.0,
        practice_minutes: 10,
        mastered_chars: [selectedLesson?.characters_data?.[0]?.char || 'अ']
      });
      setSaveStatus('saved');
      await loadLessonsAndProgress();
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Failed to save progress:', err);
      setSaveStatus('error');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER SECTION */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
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
            fontSize: '1.8rem',
            color: '#fff',
            fontWeight: 800
          }}>
            ⠃
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Braille Literacy & Assistive Tactile Studio
              </h1>
              <span style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                NEP 2020 Inclusive STEM
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              दिव्यांग समावेशी ब्रेल शिक्षण केंद्र • Bharati Braille (हिंदी स्वर व व्यंजन), English Grade 1/2, Nemeth Math & Live 6-Dot Simulation.
            </p>
          </div>
        </div>

        {/* Audio Speech Toggle & Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              const next = !speechEnabled;
              setSpeechEnabled(next);
              if (next) speakText("Braille audio voice assistant enabled");
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: speechEnabled ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: speechEnabled ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
              color: speechEnabled ? '#4ade80' : '#f87171',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {speechEnabled ? 'Voice Reader On' : 'Voice Reader Off'}
          </button>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            Student: <strong style={{ color: '#fff' }}>{studentName}</strong>
          </div>
        </div>
      </div>

      {/* TOP SUB-TAB NAVIGATION */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '8px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'tactile_cell', label: '6-Dot Tactile Cell Simulator', icon: Sparkles, badge: 'Interactive' },
          { id: 'translator', label: 'Text-to-Braille Translator', icon: BrainCircuit, badge: 'Bilingual' },
          { id: 'quiz', label: 'Practice Flashcards & Quizzes', icon: Award, badge: 'Gamified' },
          { id: 'curriculum', label: 'Curriculum & Character Charts', icon: BookOpen, badge: `${lessons.length} Modules` },
          { id: 'progress', label: 'Mastery & Progress Tracking', icon: GraduationCap, badge: 'MySQL Linked' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                speakText(`Navigated to ${tab.label}`);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                background: isActive ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'var(--bg-surface)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: isActive ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              <span style={{
                background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                padding: '2px 6px',
                borderRadius: '999px',
                fontSize: '0.65rem',
                fontWeight: 700
              }}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: 6-DOT TACTILE CELL SIMULATOR                           */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'tactile_cell' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          {/* LEFT: THE TACTILE 6-PIN HARDWARE-STYLE CELL */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Interactive 6-Dot Tactile Cell (टैक्टाइल सेल)
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Click pins or press numbers (1-6) to raise/lower Braille tactile dots.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveDots([]);
                  speakText("Cleared all dots.");
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={13} />
                Clear Cell
              </button>
            </div>

            {/* THE TACTILE GRID */}
            <div style={{
              background: 'linear-gradient(145deg, #0f172a, #090d16)',
              borderRadius: '24px',
              padding: '36px 48px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px solid rgba(56, 189, 248, 0.2)',
              boxShadow: 'inset 0 4px 20px rgba(0, 0, 0, 0.8), 0 10px 30px rgba(0, 0, 0, 0.4)'
            }}>
              {/* 2 COLUMNS, 3 ROWS */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '90px 90px',
                gridTemplateRows: '90px 90px 90px',
                gap: '24px 36px',
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '24px 32px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                {[
                  { dot: 1, label: 'Dot 1' },
                  { dot: 4, label: 'Dot 4' },
                  { dot: 2, label: 'Dot 2' },
                  { dot: 5, label: 'Dot 5' },
                  { dot: 3, label: 'Dot 3' },
                  { dot: 6, label: 'Dot 6' },
                ].map(({ dot, label }) => {
                  const isActive = activeDots.includes(dot);
                  return (
                    <button
                      key={dot}
                      onClick={() => handleToggleDot(dot)}
                      title={`Toggle ${label}`}
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        border: isActive ? '3px solid #38bdf8' : '2px solid rgba(255, 255, 255, 0.15)',
                        background: isActive 
                          ? 'radial-gradient(circle at 35% 35%, #38bdf8, #0284c7 60%, #0369a1 100%)' 
                          : 'radial-gradient(circle at 35% 35%, #334155, #1e293b 70%, #0f172a 100%)',
                        boxShadow: isActive 
                          ? '0 0 25px rgba(56, 189, 248, 0.6), inset 0 2px 6px rgba(255, 255, 255, 0.5)' 
                          : 'inset 0 4px 8px rgba(0, 0, 0, 0.6)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                        transform: isActive ? 'scale(1.05)' : 'scale(1.0)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>{dot}</span>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        {isActive ? 'Raised' : 'Flat'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUICK PRESET CHARACTERS */}
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                TRY PRESET CHARACTERS (त्वरित अक्षर लोड करें):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { char: 'अ (A)', dots: [1] },
                  { char: 'क (K)', dots: [1, 3] },
                  { char: 'म (M)', dots: [1, 3, 4] },
                  { char: 'ल (L)', dots: [1, 2, 3] },
                  { char: 'ग (G)', dots: [1, 2, 4, 5] },
                  { char: 'आ (AA)', dots: [3, 4, 5] },
                  { char: 'B (ब)', dots: [1, 2] },
                  { char: 'Number #', dots: [3, 4, 5, 6] },
                ].map(p => (
                  <button
                    key={p.char}
                    onClick={() => loadCharacterDots(p.dots, p.char)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      color: '#38bdf8',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {p.char}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: REAL-TIME RECOGNITION & PHONETIC CARD */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#38bdf8',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <Zap size={14} />
                Live Character Identification
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '6px 0 0', color: 'var(--text-primary)' }}>
                {currentInfo ? currentInfo.name : 'Unknown Combination'}
              </h2>
            </div>

            {/* BIG UNICODE BRAILLE GLYPH DISPLAY */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.9))',
              borderRadius: '16px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                fontSize: '5.5rem',
                lineHeight: 1,
                color: '#38bdf8',
                textShadow: '0 0 30px rgba(56, 189, 248, 0.5)',
                fontFamily: 'monospace'
              }}>
                {currentUnicode}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                <span>Unicode Pattern: <strong>{currentUnicode.charCodeAt(0).toString(16).toUpperCase()}</strong></span>
                <span>•</span>
                <span>Raised Dots: <strong>[{activeDots.join(', ') || 'None'}]</strong></span>
              </div>
            </div>

            {/* DETAILS BREAKDOWN */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bharati Braille (हिंदी)</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
                  {currentInfo?.hi || '—'}
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>English Grade 1 / Nemeth</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                  {currentInfo?.en || '—'} {currentInfo?.num ? `(${currentInfo.num})` : ''}
                </div>
              </div>
            </div>

            {/* AUDIO PRONUNCIATION BUTTON */}
            <button
              onClick={() => {
                const text = currentInfo ? `${currentInfo.name}. Active dots: ${activeDots.join(', ')}` : `Dots ${activeDots.join(', ')}`;
                speakText(text);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '14px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)'
              }}
            >
              <Volume2 size={18} />
              Listen Pronunciation & Dot Coordinates (ध्वनि सुनें)
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: TEXT-TO-BRAILLE BILINGUAL TRANSLATOR                    */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'translator' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Bilingual Text-to-Braille Live Converter (द्विभाषी अनुवादक)
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Translates Hindi Devanagari text, English sentences, and math numbers into tactile Braille Unicode patterns.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['नमस्ते', 'Vidya Setu', 'Science 101', '12 + 8 = 20'].map(sample => (
                  <button
                    key={sample}
                    onClick={() => setInputText(sample)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type English or Hindi text here (e.g. 'नमस्ते भारत' or 'Inclusive Education')..."
              rows={3}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />

            {/* TRANSLATED BRAILLE UNICODE OUTPUT */}
            <div style={{
              background: 'linear-gradient(145deg, #0f172a, #0b1120)',
              borderRadius: '12px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Braille Output Pattern (यूनिकोड ब्रेल)
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleCopy(translationResult?.braille_unicode)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      color: '#38bdf8',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy Braille'}
                  </button>
                  <button
                    onClick={() => speakText(`Text: ${inputText}. In Braille: ${translationResult?.cells?.map(c => c.phonetic).join(', ')}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.25)',
                      color: '#4ade80',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Volume2 size={12} />
                    Speak Output
                  </button>
                </div>
              </div>

              <div style={{
                fontSize: '2.4rem',
                letterSpacing: '0.15em',
                color: '#38bdf8',
                lineHeight: 1.4,
                wordBreak: 'break-all',
                fontFamily: 'monospace'
              }}>
                {translationResult?.braille_unicode || '⠀'}
              </div>
            </div>
          </div>

          {/* INDIVIDUAL BRAILLE CELL MATRIX BREAKDOWN */}
          {translationResult?.cells && (
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              padding: '24px'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 16px', color: 'var(--text-primary)' }}>
                Tactile 6-Dot Cell Breakdown ({translationResult.cells.length} Cells)
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: '12px'
              }}>
                {translationResult.cells.map((cell, idx) => (
                  <div
                    key={idx}
                    onClick={() => loadCharacterDots(cell.dots, cell.char)}
                    style={{
                      background: 'var(--bg-card)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b' }}>
                      {cell.char === ' ' ? '⎵' : cell.char}
                    </span>
                    <span style={{ fontSize: '2.2rem', color: '#38bdf8', lineHeight: 1 }}>
                      {cell.unicode}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      Dots: {cell.dots.length > 0 ? cell.dots.join(',') : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: INTERACTIVE PRACTICE QUIZZES & FLASHCARDS               */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'quiz' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
          {/* MAIN QUIZ CARD */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{
                  background: 'rgba(249, 115, 22, 0.15)',
                  color: '#fb923c',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  Interactive Braille Quiz (MySQL Linked)
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 0', color: 'var(--text-primary)' }}>
                  {selectedLesson?.quizzes?.[activeQuizIndex]?.prompt || "Select a lesson to start practice quiz"}
                </h3>
              </div>

              <div style={{
                background: 'rgba(56, 189, 248, 0.1)',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                Score: {quizScore} pts
              </div>
            </div>

            {selectedLesson?.quizzes?.[activeQuizIndex] && (
              <>
                {/* PROMPT TARGET DISPLAY */}
                <div style={{
                  background: 'linear-gradient(145deg, #0f172a, #1e293b)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '32px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Target Character / Glyph</div>
                  <div style={{ fontSize: '4rem', fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>
                    {selectedLesson.quizzes[activeQuizIndex].target_char}
                  </div>
                  <div style={{ fontSize: '3rem', color: '#38bdf8', lineHeight: 1 }}>
                    {selectedLesson.quizzes[activeQuizIndex].braille_unicode}
                  </div>
                  {selectedLesson.quizzes[activeQuizIndex].audio_hint && (
                    <button
                      onClick={() => speakText(`Hint: ${selectedLesson.quizzes[activeQuizIndex].audio_hint}`)}
                      style={{
                        marginTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'transparent',
                        border: 'none',
                        color: '#38bdf8',
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Volume2 size={14} />
                      Audio Hint: "{selectedLesson.quizzes[activeQuizIndex].audio_hint}"
                    </button>
                  )}
                </div>

                {/* OPTIONS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {selectedLesson.quizzes[activeQuizIndex].options?.map((opt, idx) => {
                    const isSelected = selectedOptionIndex === idx;
                    let btnBg = 'var(--bg-card)';
                    let btnBorder = 'var(--border-subtle)';
                    if (quizSubmitted) {
                      if (opt.correct) {
                        btnBg = 'rgba(34, 197, 94, 0.2)';
                        btnBorder = 'rgba(34, 197, 94, 0.6)';
                      } else if (isSelected) {
                        btnBg = 'rgba(239, 68, 68, 0.2)';
                        btnBorder = 'rgba(239, 68, 68, 0.6)';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectQuizOption(idx, opt, selectedLesson.quizzes[activeQuizIndex])}
                        style={{
                          padding: '16px',
                          borderRadius: '10px',
                          background: btnBg,
                          border: `1px solid ${btnBorder}`,
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          textAlign: 'left',
                          cursor: quizSubmitted ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{opt.label}</span>
                        {quizSubmitted && opt.correct && <CheckCircle2 size={18} color="#4ade80" />}
                      </button>
                    );
                  })}
                </div>

                {/* FEEDBACK & NEXT BUTTON */}
                {quizFeedback && (
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: '8px',
                    background: quizFeedback.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: quizFeedback.type === 'success' ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                    color: quizFeedback.type === 'success' ? '#4ade80' : '#f87171',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>{quizFeedback.msg}</span>
                    <button
                      onClick={() => {
                        setSelectedOptionIndex(null);
                        setQuizSubmitted(false);
                        setQuizFeedback(null);
                        const nextIdx = (activeQuizIndex + 1) % (selectedLesson.quizzes.length || 1);
                        setActiveQuizIndex(nextIdx);
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        background: '#0284c7',
                        color: '#fff',
                        border: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Next Question →
                    </button>
                  </div>
                )}
              </>
            )}

            {/* SAVE PROGRESS TO MYSQL BUTTON */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
              <button
                onClick={() => handleSaveQuizProgress(selectedLesson?.id || 1)}
                disabled={saveStatus === 'saving'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Save size={16} />
                {saveStatus === 'saving' ? 'Saving to Database...' : saveStatus === 'saved' ? 'Saved to MySQL! ✓' : 'Save Quiz Progress to MySQL'}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: SELECT LESSON TO PRACTICE */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Select Lesson to Practice
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lessons.map(lesson => (
                <div
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setActiveQuizIndex(0);
                    setQuizSubmitted(false);
                    setQuizFeedback(null);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: selectedLesson?.id === lesson.id ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-card)',
                    border: selectedLesson?.id === lesson.id ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: selectedLesson?.id === lesson.id ? '#38bdf8' : 'var(--text-primary)' }}>
                    {lesson.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {lesson.quizzes?.length || 0} Questions • Level: {lesson.level}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: CURRICULUM CHARTS & CHARACTER REPOSITORY                */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'curriculum' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* CATEGORY FILTER BUTTONS */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Modules (समस्त मॉड्यूल)' },
              { id: 'bharati_hindi', label: 'Bharati Braille Hindi (स्वर व व्यंजन)' },
              { id: 'english_alphabet', label: 'Standard English Braille (A-Z)' },
              { id: 'numbers_math', label: 'Nemeth Numbers & Math Signs' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  background: categoryFilter === cat.id ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-surface)',
                  border: categoryFilter === cat.id ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                  color: categoryFilter === cat.id ? '#38bdf8' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* LESSON MODULE CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {lessons.map(lesson => (
              <div
                key={lesson.id}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      {lesson.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                      {lesson.description}
                    </p>
                  </div>
                  <span style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: '#38bdf8',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}>
                    Level: {lesson.level}
                  </span>
                </div>

                {/* CHARACTERS GRID */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '12px'
                }}>
                  {lesson.characters_data?.map((ch, cIdx) => (
                    <div
                      key={cIdx}
                      onClick={() => loadCharacterDots(ch.dots, ch.name || ch.char)}
                      style={{
                        background: 'var(--bg-card)',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        padding: '14px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#38bdf8';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
                        {ch.char}
                      </span>
                      <span style={{ fontSize: '2.5rem', color: '#38bdf8', lineHeight: 1 }}>
                        {ch.unicode}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {ch.name}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        Dots: [{ch.dots.join(', ')}]
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: STUDENT MASTERY & PROGRESS TRACKING (MYSQL CONNECTED)   */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'progress' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* STATS OVERVIEW */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Total Practice Time', val: '43 mins', icon: Headphones, color: '#38bdf8' },
              { label: 'Mastered Characters', val: '16 Glyphs', icon: Award, color: '#f59e0b' },
              { label: 'Average Accuracy', val: '91.8%', icon: CheckCircle2, color: '#4ade80' },
              { label: 'Active Rural Scholar', val: studentName, icon: GraduationCap, color: '#c084fc' }
            ].map((stat, sIdx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={sIdx}
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
                    background: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={22} color={stat.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {stat.val}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PROGRESS TABLE FROM MYSQL */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              MySQL Database Records: Student Braille Progress
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px' }}>Student</th>
                    <th style={{ padding: '10px 12px' }}>Lesson Module</th>
                    <th style={{ padding: '10px 12px' }}>Category</th>
                    <th style={{ padding: '10px 12px' }}>Accuracy</th>
                    <th style={{ padding: '10px 12px' }}>Score</th>
                    <th style={{ padding: '10px 12px' }}>Practice Time</th>
                    <th style={{ padding: '10px 12px' }}>Mastered Characters</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {progressList.map(prog => (
                    <tr key={prog.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {prog.student_name}
                      </td>
                      <td style={{ padding: '12px', color: '#38bdf8' }}>
                        {prog.lesson_title}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                        {prog.category}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#4ade80' }}>
                        {prog.accuracy_percent}%
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-primary)' }}>
                        {prog.score} pts
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                        {prog.practice_minutes} mins
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {prog.mastered_chars?.map((ch, idx) => (
                            <span
                              key={idx}
                              style={{
                                background: 'rgba(56, 189, 248, 0.1)',
                                color: '#38bdf8',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 600
                              }}
                            >
                              {ch}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          background: prog.completed ? 'rgba(34, 197, 94, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                          color: prog.completed ? '#4ade80' : '#fb923c',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          fontSize: '0.7rem',
                          fontWeight: 700
                        }}>
                          {prog.completed ? 'Completed ✓' : 'In Progress'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
