import { useState } from 'react';
import { translateOffline } from '../logic/ai';

export default function TranslationBadge({ text, targetLang = "Hindi" }) {
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    setLoading(true);
    const result = await translateOffline(text, targetLang);
    setTranslation(result);
    setLoading(false);
  };

  if (translation) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 text-blue-800 text-xs mt-2 border border-blue-200">
        🗣️ {translation}
      </span>
    );
  }

  return (
    <button 
      onClick={handleTranslate}
      disabled={loading}
      className="text-xs text-blue-600 underline hover:text-blue-800 mt-2 flex items-center gap-1"
    >
      {loading ? "Translating..." : `Translate to ${targetLang}`}
    </button>
  );
}
