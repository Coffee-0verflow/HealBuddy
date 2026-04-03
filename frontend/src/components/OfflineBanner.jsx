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
      <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#16a34a' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
        Online
      </div>
    ) : (
      <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#d97706' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
        Offline — Core features available
      </div>
    );
  }

  if (online) return (
    <div className="flex items-center gap-2 px-4 py-1.5 text-xs" style={{ background: '#f0fdf4', borderTop: '1px solid #bbf7d0', color: '#15803d' }}>
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
      Online — All features available
    </div>
  );

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs" style={{ background: '#fffbeb', borderTop: '1px solid #fde68a', color: '#92400e' }}>
      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block flex-shrink-0" />
      <span><strong>Offline Mode</strong> — Triage, First Aid, and preloaded facility data still work.</span>
    </div>
  );
}
