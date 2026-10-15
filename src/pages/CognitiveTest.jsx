import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import API_BASE_URL from '../api';
import AssessmentCard from '../components/AssessmentCard';
import QuestionRenderer from '../components/QuestionRenderer';
import ProgressBar from '../components/ProgressBar';
import { createQuestionsForGrade, ModuleConfig } from '../data/questions';
import '../styles/assessment.css';

export default function CognitiveTest() {
  const navigate = useNavigate();
  const [step, setStep] = useState('intro'); // 'intro' | 'form' | 'test' | 'results'
  const [student, setStudent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [qStart, setQStart] = useState(null);
  const [elapsed, setElapsed] = useState('00:00');
  const [feedback, setFeedback] = useState('');
  const [totalTime, setTotalTime] = useState(0);
  const [saveStatus, setSaveStatus] = useState('');
  const [profile, setProfile] = useState(null);
  const [pastAssessments, setPastAssessments] = useState([]);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const [profileResponse, assessmentResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/me`, { credentials: 'include' }),
          fetch(`${API_BASE_URL}/api/assessments`, { credentials: 'include' })
        ]);
        if (profileResponse.ok) {
          const data = await profileResponse.json();
          setProfile(data.student);
        }
        if (assessmentResponse.ok) {
          const data = await assessmentResponse.json();
          setPastAssessments(data.assessments || []);
        }
      } catch (error) {
        console.error('Assessment history load error:', error);
      }
    };
    loadStudentData();
  }, []);

  // Timer
  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      const s = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(
        `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const studentData = {
      rollNumber: formData.get('rollNumber').trim(),
      age: parseInt(formData.get('age')),
      grade: parseInt(formData.get('grade')),
      board: formData.get('board'),
      name: profile?.name,
      institution: profile?.institution
    };
    setStudent(studentData);
    setQuestions(createQuestionsForGrade(studentData.grade));
    setStartTime(Date.now());
    setQStart(Date.now());
    setStep('test');
  };

  const currentQ = questions[index];

  const saveAssessment = async (completedResponses, assessmentTime) => {
    setSaveStatus('saving');
    try {
      const response = await fetch(`${API_BASE_URL}/api/assessments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...student,
          score: Math.round((completedResponses.reduce((sum, response) => sum + response.correct, 0) / completedResponses.length) * 100),
          correctCount: completedResponses.reduce((sum, response) => sum + response.correct, 0),
          questionCount: completedResponses.length,
          responses: completedResponses,
          totalTimeMs: assessmentTime
        })
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Your login session expired. Please log in again before saving this result.');
        }
        throw new Error(result.message || 'The assessment could not be saved.');
      }
      setSaveStatus('saved');
      setPastAssessments((previous) => [result.assessment || result, ...previous]);
    } catch (error) {
      console.error('Assessment save error:', error);
      setSaveStatus(error.message || 'The assessment could not be saved.');
    }
  };

  const handleAnswer = useCallback(
    (answer, isCorrect) => {
      const rt = Date.now() - qStart;
      const answerText = currentQ.options?.[answer]
        ?? currentQ.items?.[answer]?.value
        ?? (currentQ.type === 'attention' && typeof answer === 'object'
          ? `Found ${answer.hits} of ${answer.total} targets; ${answer.falseAlarms} incorrect clicks`
          : String(answer));
      const correctAnswer = currentQ.options?.[currentQ.answer]
        ?? currentQ.items?.[currentQ.answer]?.value
        ?? (currentQ.type === 'attention' ? 'Find every target and avoid other symbols' : '');
      const response = {
        student_id: student.rollNumber,
        age: student.age,
        grade: student.grade,
        board: student.board,
        module: currentQ.moduleKey,
        module_name: currentQ.module,
        item: index + 1,
        correct: isCorrect ? 1 : 0,
        question: currentQ.q || currentQ.question || currentQ.instruction || currentQ.rule,
        answer: String(answerText),
        correct_answer: String(correctAnswer),
        response_time_ms: Math.round(rt),
        error: isCorrect ? 0 : 1,
        attempts: 1,
        difficulty: Math.ceil((currentQ.idx + 1) / 3),
        timestamp: new Date().toISOString()
      };

      const completedResponses = [...responses, response];
      setResponses(completedResponses);
      setFeedback(isCorrect ? '✓ Correct!' : '✗ Recorded');

      setTimeout(() => {
        setFeedback('');
        if (index + 1 >= questions.length) {
          const assessmentTime = Date.now() - startTime;
          setTotalTime(assessmentTime);
          setStep('results');
          saveAssessment(completedResponses, assessmentTime);
        } else {
          setIndex(index + 1);
          setQStart(Date.now());
        }
      }, 600);
    },
    [index, questions.length, qStart, currentQ, student, startTime, responses]
  );

  const handleDownload = () => {
    const headers = [
      'student_id', 'age', 'grade', 'board', 'module', 'module_name', 'item',
      'question', 'answer', 'correct_answer', 'correct', 'response_time_ms',
      'error', 'attempts', 'difficulty', 'timestamp'
    ];
    const rows = responses.map((r) =>
      headers.map((h) => {
        const v = r[h] ?? '';
        const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
        if (s.includes(',') || s.includes('"') || s.includes('\n')) {
          return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
      }).join(',')
    );
    const csv = headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cogniplay_${student?.rollNumber || 'student'}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    const pdf = new jsPDF();
    const correctCount = responses.reduce((sum, response) => sum + response.correct, 0);
    pdf.setFontSize(20);
    pdf.text('Antarang Cognitive Assessment', 16, 18);
    pdf.setFontSize(11);
    pdf.text(`Student: ${student?.name || profile?.name || student?.rollNumber || 'Student'}`, 16, 28);
    pdf.text(`School/college: ${student?.institution || profile?.institution || '—'}`, 16, 35);
    pdf.text(`Class ${student?.grade} · ${student?.board} · Score: ${correctCount}/${responses.length}`, 16, 42);
    let y = 54;
    responses.forEach((response, index) => {
      const question = `${index + 1}. ${response.question}`;
      const lines = pdf.splitTextToSize(question, 178);
      if (y + lines.length * 5 + 14 > 280) {
        pdf.addPage();
        y = 18;
      }
      pdf.setTextColor(35, 50, 56);
      pdf.text(lines, 16, y);
      y += lines.length * 5;
      pdf.setTextColor(response.correct ? 22 : 153, response.correct ? 101 : 27, response.correct ? 52 : 27);
      pdf.text(`${response.correct ? 'Correct' : 'Incorrect'} · Your answer: ${response.answer}`, 20, y + 5);
      if (!response.correct) {
        pdf.text(`Correct answer: ${response.correct_answer}`, 20, y + 11);
        y += 6;
      }
      y += 16;
    });
    pdf.save(`antarang-assessment-${student?.rollNumber || 'student'}.pdf`);
  };

  const handleRestart = () => {
    setStep('intro');
    setStudent(null);
    setQuestions([]);
    setIndex(0);
    setResponses([]);
    setStartTime(null);
    setTotalTime(0);
    setSaveStatus('');
    setElapsed('00:00');
  };

  // ========== INTRO ==========
  if (step === 'intro') {
    return (
      <div className="page-content">
        <div className="page-header">
          <span className="eyebrow">COGNITIVE ASSESSMENT 🧠</span>
          <h1>Explore how your mind works</h1>
          <p className="subtitle">
            A fun, gamified assessment of your reasoning, memory, attention,
            inhibition, and cognitive flexibility.
          </p>
        </div>

        <AssessmentCard onStart={() => setStep('form')} />

        <div className="assessment-overview-strip">
          <div className="assessment-overview-item">
            <strong>30</strong>
            <span>thoughtful tasks</span>
          </div>
          <div className="assessment-overview-item">
            <strong>5</strong>
            <span>thinking skills</span>
          </div>
          <div className="assessment-overview-item">
            <strong>5–12</strong>
            <span>class levels</span>
          </div>
          <div className="assessment-overview-item">
            <strong>1</strong>
            <span>personal result</span>
          </div>
        </div>

        {pastAssessments.length > 0 && (
          <div className="card assessment-history-card">
            <div className="history-heading">
              <div>
                <span className="eyebrow">YOUR HISTORY</span>
                <h3>Past cognitive assessments</h3>
              </div>
              <span>{pastAssessments.length} saved</span>
            </div>
            <div className="assessment-history-list">
              {pastAssessments.map((assessment) => (
                <div className="assessment-history-item" key={assessment.id}>
                  <div>
                    <b>{assessment.score}% · Class {assessment.grade}</b>
                    <span>{new Date(assessment.createdAt).toLocaleDateString()} · {assessment.correctCount}/{assessment.questionCount} correct</span>
                  </div>
                  <button className="btn-secondary" onClick={() => handleDownloadPastPdf(assessment)}>Download PDF</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="two-col">
          <div className="card info-card">
            <h3>What you'll do</h3>
            <ul className="feature-list">
              <li>🔍 <b>Pattern Detective</b> — Find the next item in a sequence</li>
              <li>🧩 <b>Memory Mission</b> — Remember and recall objects</li>
              <li>🎯 <b>Attention Hunter</b> — Spot target symbols quickly</li>
              <li>🚦 <b>Stop-Go Challenge</b> — Resist automatic responses</li>
              <li>🔄 <b>Rule Switch</b> — Adapt to changing rules</li>
            </ul>
          </div>
          <div className="card info-card">
            <h3>Good to know</h3>
            <ul className="feature-list">
              <li>⏱ Takes about 5–8 minutes</li>
              <li>📝 Try each task; see your correct answers in the final review</li>
              <li>📊 Scores reflect your answers in each skill</li>
              <li>🔒 Your assessment history stays with you</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ========== FORM ==========
  if (step === 'form') {
    return (
      <div className="page-content">
        <div className="page-header">
          <span className="eyebrow">BEFORE WE BEGIN</span>
          <h1>Tell us a little about you</h1>
          <p className="subtitle">This helps us understand your results better.</p>
        </div>

        <div className="card form-card-centered">
          <div className="disclaimer">
            <b>Research prototype:</b> This educational assessment measures task performance.
            It is not an IQ or clinical diagnostic test.
          </div>

          <form onSubmit={handleFormSubmit} className="assessment-form">
            <div className="form-group">
              <label htmlFor="roll-number">Student roll number</label>
              <input id="roll-number" name="rollNumber" placeholder="e.g., S001" maxLength="20" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="student-age">Age</label>
                <input id="student-age" name="age" type="number" min="8" max="20" placeholder="e.g., 15" required />
              </div>
              <div className="form-group">
                <label htmlFor="student-grade">Class / standard</label>
                <select id="student-grade" name="grade" defaultValue="" required>
                  <option value="" disabled>Select your class</option>
                  {Array.from({ length: 8 }, (_, index) => index + 5).map((grade) => (
                    <option key={grade} value={grade}>Class {grade}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="student-board">Board</label>
              <select id="student-board" name="board" defaultValue="SSC" required>
                <option value="SSC">SSC</option>
                <option value="CBSE">CBSE</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="module-preview">
              <h4>What you'll explore:</h4>
              <div className="module-chips">
                {ModuleConfig.map((m) => (
                  <span key={m.key} className="chip">
                    {m.icon} {m.name.replace(/^[A-Z] — /, '')}
                  </span>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setStep('intro')}>
                ← Back
              </button>
              <button type="submit" className="btn-primary btn-large">
                Start Assessment →
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ========== TEST ==========
  if (step === 'test' && currentQ) {
    return (
      <div className="page-content">
        <div className="test-header">
          <div className="test-info">
            <span className="eyebrow">{currentQ.module}</span>
            <h2>{getModuleTitle(currentQ.type)}</h2>
          </div>
          <div className="test-meta">
            <div className="timer"> {elapsed}</div>
            <ProgressBar current={index + 1} total={questions.length} />
          </div>
        </div>

        <div className="card question-card">
          <QuestionRenderer key={currentQ.id} question={currentQ} onAnswer={handleAnswer} />
        </div>

        <div className="feedback">{feedback}</div>
      </div>
    );
  }

  // ========== RESULTS ==========
  if (step === 'results') {
    const groups = {
      reasoning: 'Reasoning',
      memory: 'Working Memory',
      attention: 'Attention',
      inhibition: 'Inhibitory Control',
      flexibility: 'Cognitive Flexibility'
    };

    const metrics = Object.entries(groups).map(([key, label]) => {
      const r = responses.filter((x) => x.module === key);
      const score = r.length
        ? Math.round((r.reduce((a, b) => a + b.correct, 0) / r.length) * 100)
        : 0;
      const correctCount = r.reduce((total, response) => total + response.correct, 0);
      const avgRT = r.length
        ? Math.round(r.reduce((a, b) => a + b.response_time_ms, 0) / r.length)
        : 0;
      return { key, label, score, avgRT, correctCount, total: r.length };
    });

    const totalSeconds = Math.floor(totalTime / 1000);
    const timeStr = `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;

    return (
      <div className="page-content">
        <div className="page-header">
          <span className="eyebrow">YOUR RESULTS 🌱</span>
          <h1>Assessment Completed</h1>
          <p className="subtitle">
            Student <b>{student.rollNumber}</b> (Age {student.age}, Class {student.grade}, {student.board}) completed{' '}
            {responses.length} tasks in {timeStr}.
          </p>
        </div>

        <div className="overall-score card">
          <span>Overall score</span>
          <strong>{responses.reduce((sum, response) => sum + response.correct, 0)} / {responses.length}</strong>
          <span>{responses.length ? Math.round((responses.reduce((sum, response) => sum + response.correct, 0) / responses.length) * 100) : 0}% correct</span>
        </div>

        <div className="metrics-grid">
          {metrics.map((m) => (
            <div key={m.key} className="metric">
              <b>{m.label}</b>
              <div className="big">{m.score}%</div>
              <small>{m.correctCount} / {m.total} correct · Avg RT: {m.avgRT} ms</small>
            </div>
          ))}
        </div>

        <div className="card answer-review">
          <h3>Answer review</h3>
          <ol>
            {responses.map((response) => (
              <li key={response.item} className={response.correct ? 'answer-correct' : 'answer-incorrect'}>
                <div>
                  <b>Question {response.item}: {response.question}</b>
                  <p>{response.module_name}</p>
                  <p>Your answer: {response.answer}</p>
                  {!response.correct && <p>Correct answer: {response.correct_answer}</p>}
                </div>
                <span>{response.correct ? 'Correct' : 'Incorrect'}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="card profile-card">
          <h3>Cognitive Performance Profile</h3>
          <div className="instructions">
            <b>Research interpretation:</b> These scores reflect task performance in a controlled
            setting. For scientific validation, compare with established standardized assessments
            and analyze reliability, validity, and age/grade effects. Higher accuracy with faster
            response times generally indicates stronger performance in that cognitive domain.
          </div>
          <button className="btn-primary" onClick={() => navigate('/app/chat', { state: { initialMessage: 'Please summarize my latest cognitive assessment and suggest three practical ways I can improve.' } })}>
            Ask Antarang AI for a summary
          </button>
        </div>

        <div className={`save-status ${saveStatus === 'saved' ? 'save-success' : ''}`} role="status">
          {saveStatus === 'saving' && 'Saving your assessment…'}
          {saveStatus === 'saved' && 'Your assessment and answers were saved.'}
          {saveStatus && saveStatus !== 'saving' && saveStatus !== 'saved' && (
            <>
              <span>We could not save your assessment: {saveStatus}</span>
              <button className="btn-secondary" onClick={() => saveAssessment(responses, totalTime)}>
                Try saving again
              </button>
            </>
          )}
        </div>

        <div className="action-row">
          <button className="btn-primary" onClick={handleDownloadPdf}>
            Download PDF
          </button>
          <button className="btn-primary" onClick={handleDownload}>
            📥 Download Data (CSV)
          </button>
          <button className="btn-secondary" onClick={handleRestart}>
            🔄 New Assessment
          </button>
        </div>
      </div>
    );
  }

  function handleDownloadPastPdf(assessment) {
    const pdf = new jsPDF();
    pdf.setFontSize(20);
    pdf.text('Antarang Cognitive Assessment', 16, 18);
    pdf.setFontSize(11);
    pdf.text(`Class ${assessment.grade} · ${assessment.board} · Score: ${assessment.correctCount}/${assessment.questionCount}`, 16, 28);
    let y = 40;
    (assessment.responses || []).forEach((response, index) => {
      const lines = pdf.splitTextToSize(`${index + 1}. ${response.question}`, 178);
      if (y + lines.length * 5 + 14 > 280) { pdf.addPage(); y = 18; }
      pdf.setTextColor(35, 50, 56);
      pdf.text(lines, 16, y);
      y += lines.length * 5;
      pdf.setTextColor(response.correct ? 22 : 153, response.correct ? 101 : 27, response.correct ? 52 : 27);
      pdf.text(`${response.correct ? 'Correct' : 'Incorrect'} · Your answer: ${response.answer}`, 20, y + 5);
      if (!response.correct) { pdf.text(`Correct answer: ${response.correct_answer}`, 20, y + 11); y += 6; }
      y += 16;
    });
    pdf.save(`antarang-assessment-${assessment.id}.pdf`);
  }

  return null;
}

function getModuleTitle(type) {
  const titles = {
    reasoning: 'Pattern Detective 🔍',
    memory: 'Memory Mission 🧩',
    attention: 'Attention Hunter 🎯',
    inhibition: 'Stop-Go Challenge 🚦',
    flexibility: 'Rule Switch 🔄'
  };
  return titles[type] || 'Question';
}