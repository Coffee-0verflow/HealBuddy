import { useState } from 'react';
import { symptomRules } from '../data/symptomRules';
import { runTriage } from '../logic/triageEngine';
import { UrgencyPill } from './Badges';
import EmergencyOverlay from './EmergencyOverlay';

export default function SymptomFlow({ symptomId, onResult, onBack }) {
  const symptom = symptomRules.find(s => s.id === symptomId);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  if (!symptom) return null;

  function handleAnswer(questionId, value) {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (step < symptom.questions.length - 1) {
      setStep(step + 1);
    } else {
      const triageResult = runTriage(symptomId, newAnswers);
      setResult(triageResult);
      if (triageResult.isEmergency) setShowOverlay(true);
      onResult?.(triageResult, newAnswers);
    }
  }

  const progress = (step / symptom.questions.length) * 100;

  if (result) {
    return (
      <>
        {showOverlay && <EmergencyOverlay onDismiss={() => setShowOverlay(false)} />}
        <div className="space-y-5 pb-10">
          <BackBtn onClick={onBack} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="rounded-2xl p-5 shadow-sm"
                style={{
                  background: result.isEmergency ? '#fff1f2' : 'var(--bg-surface)',
                  border: result.isEmergency ? '1px solid #fecdd3' : '1px solid var(--border)',
                }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{symptom.icon}</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{symptom.label}</span>
                </div>
                <div className="mb-3"><UrgencyPill config={result.config} /></div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{result.rationale}</p>
                <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                  <span className="text-base mt-0.5">ℹ️</span>
                  <p className="text-xs text-amber-800">This is not a medical diagnosis. It is a guidance tool. Always consult a qualified doctor.</p>
                </div>
              </div>

              <div className="rounded-2xl p-4" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">Recommended Action</p>
                <p className="text-base font-bold text-blue-800">{result.config.action}</p>
              </div>

              {result.isEmergency && (
                <div className="grid grid-cols-2 gap-2">
                  <a href="tel:112" className="flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors">📞 Call 112</a>
                  <a href="tel:108" className="flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-colors">🚑 Call 108</a>
                </div>
              )}
            </div>

            <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Your Responses</p>
              <div className="space-y-3">
                {symptom.questions.map(q => answers[q.id] && (
                  <div key={q.id} className="flex flex-col gap-1 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{q.text}</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{answers[q.id]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const currentQ = symptom.questions[step];

  return (
    <div className="space-y-5 pb-10" style={{ maxWidth: 640 }}>
      <BackBtn onClick={onBack} />

      <div className="flex items-center gap-4">
        <span className="text-4xl">{symptom.icon}</span>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{symptom.label}</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Question {step + 1} of {symptom.questions.length}</p>
        </div>
      </div>

      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: '#2563eb' }} />
      </div>

      <div className="rounded-2xl p-6 shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <p className="text-base font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>{currentQ.text}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentQ.options.map(opt => (
            <button key={opt} onClick={() => handleAnswer(currentQ.id, opt)}
              className="text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#93c5fd'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        Answer honestly for the most accurate guidance.
      </p>
    </div>
  );
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-sm transition-colors"
      style={{ color: 'var(--text-muted)' }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
      ← Back
    </button>
  );
}
