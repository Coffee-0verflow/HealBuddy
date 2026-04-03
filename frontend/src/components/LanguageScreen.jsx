import { useState, useMemo } from 'react';
import { medicalPhrases, PHRASE_LANGS, PHRASE_CATEGORIES } from '../data/medicalPhrases';

export default function LanguageScreen() {
  const [activeLang, setActiveLang] = useState('hindi');
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(null);

  const lang = PHRASE_LANGS.find(l => l.key === activeLang);

  const filtered = useMemo(() => {
    let list = medicalPhrases;
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(p =>
        p.english.toLowerCase().includes(q) ||
        (p[activeLang] && p[activeLang].toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeCategory, search, activeLang]);

  function copy(text, id) {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20">

      {/* Header */}
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Offline · 10 Languages · 50 Phrases</p>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Medical Phrases</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Show these cards to locals or healthcare staff. Works fully offline.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-5">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder='Search in English… e.g. "chest pain", "ambulance", "fracture"'
          className="w-full pl-11 pr-10 py-3 rounded-2xl text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none"
          >✕</button>
        )}
      </div>

      {/* Language selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
        {PHRASE_LANGS.map(l => (
          <button
            key={l.key}
            onClick={() => setActiveLang(l.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all border ${
              activeLang === l.key
                ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-600'
            }`}
          >
            <span className="text-base">{l.label}</span>
            <span className="text-[10px] opacity-75">{l.name}</span>
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-5">
        {/* All tab */}
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
            activeCategory === 'all'
              ? 'bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 border-transparent shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          🗂 All
        </button>
        {PHRASE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              activeCategory === cat.id
                ? `${cat.color} text-white border-transparent shadow-md`
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-4">
        {filtered.length} phrase{filtered.length !== 1 ? 's' : ''}
        {search ? ` matching "${search}"` : ''} · {lang?.name}
      </p>

      {/* Phrase cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No phrases found for "{search}"</p>
          <p className="text-xs mt-1">Try: "chest", "fever", "ambulance", "fracture", "help"</p>
          <button onClick={() => setSearch('')} className="mt-4 text-xs font-bold text-teal-600 dark:text-teal-400 underline">
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(phrase => {
            const translation = phrase[activeLang];
            const cat = PHRASE_CATEGORIES.find(c => c.id === phrase.category);
            return (
              <div
                key={phrase.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Category badge */}
                <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white mb-2 ${cat?.color || 'bg-slate-400'}`}>
                  {cat?.label}
                </span>

                {/* English */}
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">English</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
                  {search ? highlight(phrase.english, search) : phrase.english}
                </p>

                {/* Translation */}
                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                      {lang?.label} {lang?.name}
                    </p>
                    <button
                      onClick={() => copy(translation, phrase.id)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-teal-100 dark:bg-teal-800/50 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-700/50 transition-colors"
                    >
                      {copied === phrase.id ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                    {translation || <span className="text-slate-400 italic">Translation coming soon</span>}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tip */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          💡 <strong className="text-slate-700 dark:text-slate-300">Tip:</strong> Tap 📋 Copy to copy the phrase and share via WhatsApp or show on screen. Text in brackets is the pronunciation guide.
        </p>
      </div>
    </div>
  );
}

// Highlight matching search term in text
function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 dark:bg-yellow-700/50 text-slate-900 dark:text-slate-100 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
