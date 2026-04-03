import { useState } from 'react';
import { firstAidGuides } from '../data/firstaid';

function GuideDetail({ guide, onBack }) {
  return (
    <div className="space-y-5 pb-10">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors">
        ← All Guides
      </button>

      <div className="flex items-center gap-4">
        <span className="text-5xl">{guide.icon}</span>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{guide.label}</h2>
          <p className="text-sm mt-0.5 text-slate-400 dark:text-slate-500">Offline first-aid guide</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl p-5 shadow-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-slate-400 dark:text-slate-500">Steps to Follow</p>
          <ol className="space-y-4">
            {guide.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">{i + 1}</span>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl p-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-3">⚠️ Do Not</p>
            <ul className="space-y-2.5">
              {guide.doNot.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-red-700 dark:text-red-400">
                  <span className="flex-shrink-0 font-bold mt-0.5">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-5 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50">
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">🏥 When to Escalate</p>
            <p className="text-sm text-orange-800 dark:text-orange-300 leading-relaxed">{guide.escalate}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a href="tel:112" className="flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors">
              📞 Call 112
            </a>
            <a href="tel:108" className="flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-colors">
              🚑 Call 108
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FirstAid() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const guide = firstAidGuides.find(g => g.id === selected);
    return <GuideDetail guide={guide} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-slate-400 dark:text-slate-500">First Aid</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Offline Guides</h2>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">All guides work without internet. Tap any scenario for step-by-step help.</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50">
          <span className="text-sm">✅</span>
          <span className="text-xs font-medium text-green-700 dark:text-green-400 whitespace-nowrap">Works Offline</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {firstAidGuides.map(guide => (
          <button key={guide.id} onClick={() => setSelected(guide.id)}
            className="flex flex-col items-start gap-2.5 p-4 rounded-2xl text-left transition-all active:scale-95 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md">
            <span className="text-3xl">{guide.icon}</span>
            <span className="text-sm font-semibold leading-tight text-slate-800 dark:text-slate-200">{guide.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
