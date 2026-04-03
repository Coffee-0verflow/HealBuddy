import { useState, useRef } from 'react';
import { emergencyPhrases, ALL_LANGS } from '../data/emergencyPhrases';
import { phrases } from '../data/phrases';

// Keywords mapped to phrase ids — handles common variations
const KEYWORD_MAP = [
  { keys: ['chest pain', 'pain in chest', 'heart pain', 'chest hurt'],        id: 'p2' },
  { keys: ['headache', 'head pain', 'head ache', 'head hurts'],               id: 'p3' },
  { keys: ['stomach pain', 'stomach ache', 'belly pain', 'abdominal pain',
            'tummy pain', 'pain in stomach'],                                  id: 'p4' },
  { keys: ['back pain', 'pain in back', 'back ache', 'backache'],             id: 'p5' },
  { keys: ['leg pain', 'leg hurts', 'leg hurt', 'pain in leg'],               id: 'p6' },
  { keys: ['arm pain', 'arm hurts', 'arm hurt', 'pain in arm'],               id: 'p7' },
  { keys: ['severe pain', 'very painful', 'extreme pain', 'unbearable pain'], id: 'p8' },
  { keys: ['pain worse', 'pain increasing', 'getting worse'],                 id: 'p9' },
  { keys: ['toothache', 'tooth pain', 'tooth ache', 'tooth hurts'],          id: 'p10' },
  { keys: ['in pain', 'i am in pain', 'feeling pain'],                        id: 'p1' },

  { keys: ['ambulance', 'call ambulance'],                                     id: 'e1' },
  { keys: ['call 112', 'dial 112', '112'],                                     id: 'e2' },
  { keys: ['emergency', 'this is emergency'],                                  id: 'e3' },
  { keys: ['need doctor', 'want doctor', 'doctor now'],                        id: 'e4' },
  { keys: ['fainted', 'unconscious', 'passed out', 'someone fainted'],        id: 'e5' },
  { keys: ['accident', 'crash', 'collision'],                                  id: 'e6' },
  { keys: ['heart attack', 'cardiac', 'heart problem'],                        id: 'e7' },
  { keys: ['cannot breathe', 'cant breathe', 'breathing problem',
            'difficulty breathing', 'short of breath'],                        id: 'e8' },
  { keys: ['bleeding', 'blood coming', 'heavy bleeding'],                     id: 'e9' },
  { keys: ['injured', 'injury', 'wound', 'hurt badly'],                       id: 'e10' },
  { keys: ['seizure', 'fits', 'convulsion', 'epilepsy'],                      id: 'e11' },
  { keys: ['allergic', 'allergy', 'medicine allergy'],                        id: 'e12' },
  { keys: ['diabetic', 'diabetes', 'sugar patient'],                          id: 'e13' },
  { keys: ['blood pressure', 'bp problem', 'hypertension'],                   id: 'e14' },
  { keys: ['pregnant', 'pregnancy', 'expecting'],                             id: 'e15' },

  { keys: ['help me', 'please help', 'need help', 'help'],                    id: 'h1' },
  { keys: ['call family', 'call my family', 'contact family'],                id: 'h3' },
  { keys: ['alone', 'i am alone', 'no one with me'],                          id: 'h4' },
  { keys: ['lost', 'i am lost', 'dont know way'],                             id: 'h5' },
  { keys: ['dont speak', 'language barrier', 'no local language'],            id: 'h6' },
  { keys: ['speak slowly', 'slow down', 'talk slowly'],                       id: 'h7' },
  { keys: ['write it', 'write down', 'can you write'],                        id: 'h8' },
  { keys: ['female doctor', 'lady doctor', 'woman doctor'],                   id: 'h9' },
  { keys: ['dont leave', 'stay with me', 'do not leave'],                     id: 'h10' },

  { keys: ['fever', 'high temperature', 'temperature', 'i have fever'],       id: 's1' },
  { keys: ['vomit', 'vomiting', 'throwing up', 'nausea', 'nauseous'],        id: 's2' },
  { keys: ['diarrhea', 'loose motion', 'loose stool', 'stomach upset'],      id: 's3' },
  { keys: ['dizzy', 'dizziness', 'spinning', 'vertigo', 'giddy'],            id: 's4' },
  { keys: ['weak', 'weakness', 'fatigue', 'tired', 'no energy'],             id: 's5' },
  { keys: ['cannot eat', 'not eating', 'no appetite'],                        id: 's6' },
  { keys: ['rash', 'skin rash', 'itching', 'skin problem'],                  id: 's7' },
  { keys: ['swelling', 'swollen', 'inflammation'],                            id: 's8' },
  { keys: ['animal bite', 'dog bite', 'snake bite', 'bitten'],               id: 's9' },
  { keys: ['not sleeping', 'insomnia', 'cannot sleep', 'no sleep'],          id: 's10' },
  { keys: ['high sugar', 'blood sugar', 'sugar level'],                       id: 's11' },
  { keys: ['swallowing', 'cannot swallow', 'difficulty swallowing'],         id: 's12' },
  { keys: ['blurred vision', 'blurry vision', 'cannot see', 'vision problem'], id: 's13' },
  { keys: ['numbness', 'numb hands', 'tingling', 'hands numb'],              id: 's14' },
  { keys: ['unconscious', 'blacked out', 'lost consciousness'],              id: 's15' },

  { keys: ['nearest hospital', 'where is hospital', 'find hospital',
            'hospital nearby', 'close hospital'],                              id: 'n1' },
  { keys: ['pharmacy', 'medicine shop', 'chemist', 'drug store'],            id: 'n2' },
  { keys: ['take me hospital', 'go to hospital', 'hospital please'],         id: 'n3' },
  { keys: ['how far hospital', 'distance hospital'],                          id: 'n4' },
  { keys: ['doctor nearby', 'any doctor', 'find doctor'],                     id: 'n5' },
  { keys: ['take me clinic', 'go to clinic', 'clinic please'],               id: 'n6' },
  { keys: ['hospital open', 'is it open', 'open now'],                       id: 'n7' },
  { keys: ['government hospital', 'govt hospital', 'free hospital'],         id: 'n8' },
  { keys: ['emergency ward', 'casualty', 'emergency room', 'er'],            id: 'n9' },
  { keys: ['show map', 'on map', 'show direction', 'directions'],            id: 'n10' },
];

// Lang key mapping from ALL_LANGS keys → phrases.js keys
const LANG_KEY_MAP = { hindi: 'hi', tamil: 'ta', telugu: 'te' };

function findBestMatch(input) {
  const lower = input.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();
  if (!lower) return null;

  // Score each rule by how many of its keywords appear in the input
  let best = null, bestScore = 0;
  for (const rule of KEYWORD_MAP) {
    for (const kw of rule.keys) {
      if (lower.includes(kw)) {
        const score = kw.length; // longer match = more specific
        if (score > bestScore) { bestScore = score; best = rule.id; }
      }
    }
  }
  if (best) return phrases.find(p => p.id === best) || null;

  // Fallback: token overlap against phrase english text
  const tokens = lower.split(' ').filter(t => t.length > 2);
  let topPhrase = null, topOverlap = 0;
  for (const phrase of phrases) {
    const eng = phrase.en.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
    const overlap = tokens.filter(t => eng.includes(t)).length;
    if (overlap > topOverlap) { topOverlap = overlap; topPhrase = phrase; }
  }
  return topOverlap > 0 ? topPhrase : null;
}

export default function PhraseCards() {
  const [activeLang, setActiveLang]         = useState('hindi');
  const [inputText, setInputText]           = useState('');
  const [translateLang, setTranslateLang]   = useState('hindi');
  const [translated, setTranslated]         = useState(null);
  const debounceRef = useRef(null);
  const lang = ALL_LANGS.find(l => l.key === activeLang);

  function runTranslate(text) {
    if (!text.trim()) { setTranslated(null); return; }
    const match = findBestMatch(text);
    if (!match) {
      setTranslated({ text: '⚠️ No match found. Try: "chest pain", "fever", "need ambulance", "nearest hospital"…', source: 'error' });
      return;
    }
    const langKey = LANG_KEY_MAP[translateLang];
    const result  = langKey ? match[langKey] : null;
    setTranslated(
      result
        ? { text: result, matched: match.en, source: 'offline' }
        : { text: match.en, matched: match.en, source: 'offline' }
    );
  }

  function handleInput(val) {
    setInputText(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runTranslate(val), 400);
  }

  function handleLangChange(val) {
    setTranslateLang(val);
    setTranslated(null);
    if (inputText.trim()) setTimeout(() => runTranslate(inputText), 0);
  }

  return (
    <div className="space-y-5 pb-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Language Support</p>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Emergency Phrases</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          All 22 scheduled Indian languages. Show cards to locals or healthcare staff.
        </p>
      </div>

      {/* Translator */}
      <div className="rounded-2xl p-4 space-y-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>🔤 Translate Anything</p>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: '#dcfce7', color: '#15803d' }}>📦 Fully Offline</span>
        </div>

        {/* Language picker */}
        <select
          value={translateLang}
          onChange={e => handleLangChange(e.target.value)}
          className="w-full px-3 py-2 rounded-xl text-sm outline-none cursor-pointer"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          {ALL_LANGS.map(l => (
            <option key={l.key} value={l.key}>{l.label}  {l.name}</option>
          ))}
        </select>

        {/* Input */}
        <textarea
          rows={3}
          value={inputText}
          onChange={e => handleInput(e.target.value)}
          placeholder='Type in English… e.g. "chest pain", "I cannot breathe", "nearest hospital"'
          className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        />

        {/* Output */}
        {translated && (
          <div className="rounded-xl p-4 space-y-2"
            style={{
              background: translated.source === 'error' ? '#fffbeb' : '#eff6ff',
              border: `1px solid ${translated.source === 'error' ? '#fde68a' : '#bfdbfe'}`,
            }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold" style={{ color: translated.source === 'error' ? '#92400e' : '#2563eb' }}>
                {ALL_LANGS.find(l => l.key === translateLang)?.label}  {ALL_LANGS.find(l => l.key === translateLang)?.name}
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: translated.source === 'offline' ? '#fef9c3' : '#fef3c7',
                  color: '#92400e',
                }}>
                {translated.source === 'offline' ? '📦 Offline' : '⚠️ Not found'}
              </span>
            </div>
            {translated.matched && translated.source !== 'error' && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Matched: "{translated.matched}"</p>
            )}
            <p className="text-base leading-relaxed font-medium"
              style={{ color: translated.source === 'error' ? '#92400e' : '#1e40af' }}>
              {translated.text}
            </p>
            {translated.source !== 'error' && (
              <button
                onClick={() => navigator.clipboard?.writeText(translated.text)}
                className="text-xs px-3 py-1 rounded-lg"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer' }}>
                📋 Copy
              </button>
            )}
          </div>
        )}
      </div>

      {/* Language selector — scrollable */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {ALL_LANGS.map(l => (
          <button key={l.key} onClick={() => setActiveLang(l.key)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeLang === l.key ? '#2563eb' : 'var(--bg-surface)',
              color: activeLang === l.key ? '#ffffff' : 'var(--text-secondary)',
              border: activeLang === l.key ? '1px solid #2563eb' : '1px solid var(--border)',
              boxShadow: activeLang === l.key ? '0 2px 8px rgba(37,99,235,0.3)' : 'none',
            }}>
            <span className="text-base">{l.label}</span>
            <span className="text-xs opacity-70">{l.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {emergencyPhrases.map((phrase, i) => (
          <div key={i} className="rounded-2xl p-4 shadow-sm transition-shadow hover:shadow-md"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>English</p>
            <p className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{phrase.english}</p>
            <div className="rounded-xl p-3" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <p className="text-xs font-semibold text-blue-500 mb-1">{lang?.name}</p>
              <p className="text-sm text-blue-800 leading-relaxed">{phrase[activeLang] || '—'}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-4" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
        <p className="text-sm text-amber-700">
          💡 <strong>Tip:</strong> Show the local language card to healthcare staff or locals. Text in brackets is the pronunciation guide.
        </p>
      </div>
    </div>
  );
}
