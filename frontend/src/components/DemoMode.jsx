import { demoScenarios } from '../data/demoScenarios';
import { urgencyConfig } from '../data/symptomRules';

export default function DemoMode({ onRunScenario }) {
  return (
    <div className="space-y-5 pb-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Demo Mode</p>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Try a Scenario</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Click any scenario to auto-fill symptoms and see HealBuddy's full decision flow in action.
        </p>
      </div>

      <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: '#eef2ff', border: '1px solid #c7d2fe' }}>
        <span className="text-xl flex-shrink-0">🎬</span>
        <p className="text-sm text-indigo-700">
          These scenarios are designed for evaluators and judges to quickly experience the product's triage logic, urgency classification, and facility recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {demoScenarios.map(s => {
          const cfg = urgencyConfig[s.expectedUrgency];
          return (
            <button key={s.id} onClick={() => onRunScenario(s)}
              className="w-full text-left rounded-2xl p-5 transition-all group"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#93c5fd'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
              <div className="flex items-start gap-3">
                <span className="text-4xl flex-shrink-0">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} mb-2`}>
                    {cfg.icon} {cfg.label}
                  </span>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{s.description}</p>
                  <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: 'var(--text-muted)' }}>
                    <span>📍 {s.city}</span>
                    <span>👤 {s.persona}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Click to run this scenario</span>
                <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">Run →</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
