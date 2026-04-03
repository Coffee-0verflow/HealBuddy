import { useState } from 'react';
import { firstAidGuides } from '../data/firstaid';

function GuideDetail({ guide, onBack }) {
  return (
    <div className="space-y-5 pb-10">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
        ← All Guides
      </button>

      <div className="flex items-center gap-4">
        <span className="text-5xl">{guide.icon}</span>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{guide.label}</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Offline first-aid guide</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Steps to Follow</p>
          <ol className="space-y-4">
            {guide.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">{i + 1}</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step}</p>
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
            <a href="tel:112" className="flex items-center justify-center gap-2 py-3.5 text-white rounded-xl font-bold text-sm transition-colors"
              style={{ background: '#dc2626' }}
              onMouseEnter={e => e.currentTarget.style.background = '#b91c1c'}
              onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}>
              📞 Call 112
            </a>
            <a href="tel:108" className="flex items-center justify-center gap-2 py-3.5 text-white rounded-xl font-bold text-sm transition-colors"
              style={{ background: '#f97316' }}
              onMouseEnter={e => e.currentTarget.style.background = '#ea580c'}
              onMouseLeave={e => e.currentTarget.style.background = '#f97316'}>
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
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>First Aid</p>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Offline Guides</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>All guides work without internet. Tap any scenario for step-by-step help.</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl"
          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <span className="text-sm">✅</span>
          <span className="text-xs font-medium text-green-700 whitespace-nowrap">Works Offline</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {firstAidGuides.map(guide => (
          <button key={guide.id} onClick={() => setSelected(guide.id)}
            className="flex flex-col items-start gap-2.5 p-4 rounded-2xl text-left transition-all active:scale-95 group"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <span className="text-3xl">{guide.icon}</span>
            <span className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{guide.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
