import { useState, useEffect } from 'react';

export default function OfflineBanner({ inline = false }) {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  if (inline) {
    return online ? (
      <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
        Online
      </div>
    ) : (
      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
        Offline — Core features available
      </div>
    );
  }

  if (online) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs bg-orange-950 dark:bg-orange-950 border-b border-orange-900 text-orange-400">
      <span className="w-2 h-2 rounded-full bg-orange-500 inline-block flex-shrink-0" />
      <span><strong>Offline Mode</strong> — Triage, First Aid, and preloaded facility data still work.</span>
    </div>
  );
}
