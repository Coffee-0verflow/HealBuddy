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

  const progress = ((step + 1) / symptom.questions.length) * 100;

  if (result) {
    return (
      <>
        {showOverlay && <EmergencyOverlay onDismiss={() => setShowOverlay(false)} />}
        <div className="space-y-5 pb-10">
          <BackBtn onClick={onBack} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className={`rounded-2xl p-5 shadow-sm bg-white dark:bg-slate-800 ${result.isEmergency ? 'border-2 border-red-600 dark:border-red-700' : 'border border-slate-200 dark:border-slate-700'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{symptom.icon}</span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{symptom.label}</span>
                </div>
                <div className="mb-3"><UrgencyPill config={result.config} /></div>
                <p className="text-sm leading-relaxed mb-3 text-slate-600 dark:text-slate-300">{result.rationale}</p>
                <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <span className="text-base mt-0.5">ℹ️</span>
                  <p className="text-xs text-slate-400 dark:text-slate-500">This is not a medical diagnosis. It is a guidance tool. Always consult a qualified doctor.</p>
                </div>
              </div>

              <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-blue-400">Recommended Action</p>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100">{result.config.action}</p>
              </div>

              {result.isEmergency && (
                <div className="grid grid-cols-2 gap-2">
                  <a href="tel:112" className="flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors">📞 Call 112</a>
                  <a href="tel:108" className="flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-colors">🚑 Call 108</a>
                </div>
              )}
            </div>

            <div className="rounded-2xl p-5 shadow-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-slate-400 dark:text-slate-500">Your Responses</p>
              <div className="space-y-3">
                {symptom.questions.map(q => answers[q.id] && (
                  <div key={q.id} className="flex flex-col gap-1 pb-3 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xs text-slate-400 dark:text-slate-500">{q.text}</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{answers[q.id]}</span>
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
    <div className="space-y-5 pb-10 max-w-xl">
      <BackBtn onClick={onBack} />

      <div className="flex items-center gap-4">
        <span className="text-4xl">{symptom.icon}</span>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{symptom.label}</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500">Question {step + 1} of {symptom.questions.length}</p>
        </div>
      </div>

      <div className="w-full h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
        <div className="h-full rounded-full transition-all duration-300 bg-blue-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="rounded-2xl p-6 shadow-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <p className="text-base font-semibold mb-5 text-slate-900 dark:text-slate-100">{currentQ.text}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentQ.options.map(opt => (
            <button key={opt} onClick={() => handleAnswer(currentQ.id, opt)}
              className="text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              {opt}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        Answer honestly for the most accurate guidance.
      </p>
    </div>
  );
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors">
      ← Back
    </button>
  );
}
