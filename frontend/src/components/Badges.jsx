export function TrustBadge({ tag }) {
  const map = {
    '24x7':            { label: '24×7',            cls: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    emergency_capable: { label: 'Emergency',        cls: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
    govt_listed:       { label: 'Govt Listed',      cls: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
    verified:          { label: '✓ Verified',       cls: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300' },
    tourist_friendly:  { label: 'Tourist Friendly', cls: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
    digital_payment:   { label: 'UPI/Card',         cls: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' },
    female_doctor:     { label: 'Female Doctor',    cls: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300' },
  };
  const cfg = map[tag];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

export function CostBadge({ badge }) {
  const map = {
    budget:   { label: '₹ Budget',    cls: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    moderate: { label: '₹₹ Moderate', cls: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
    premium:  { label: '₹₹₹ Premium', cls: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' },
  };
  const cfg = map[badge];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

export function FacilityTypeLabel({ type }) {
  const map = {
    govt_hospital:    { label: 'Govt Hospital',    cls: 'text-blue-700 dark:text-blue-400' },
    private_hospital: { label: 'Private Hospital', cls: 'text-violet-700 dark:text-violet-400' },
    clinic:           { label: 'Clinic',           cls: 'text-teal-700 dark:text-teal-400' },
    pharmacy:         { label: 'Pharmacy',         cls: 'text-green-700 dark:text-green-400' },
    urgent_care:      { label: 'Urgent Care',      cls: 'text-orange-700 dark:text-orange-400' },
  };
  const cfg = map[type] || { label: type, cls: 'text-slate-500 dark:text-slate-400' };
  return (
    <span className={`text-xs font-bold uppercase tracking-wide ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

export function UrgencyPill({ config }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
      {config.icon} {config.label}
    </span>
  );
}
