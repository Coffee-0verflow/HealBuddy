import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setDeferredPrompt(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-4 sm:w-80 z-[9999] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 flex items-start gap-3 animate-in slide-in-from-bottom-4">
      <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white text-xl shrink-0">🩺</div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-sm text-slate-900 dark:text-slate-100">Install HealBuddy</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Add to home screen for offline access</p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleInstall}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded-xl transition-colors active:scale-[0.97]"
          >
            Install
          </button>
          <button
            onClick={() => setVisible(false)}
            className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold py-2 rounded-xl transition-colors active:scale-[0.97]"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
