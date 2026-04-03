export function TrustBadge({ tag }) {
  const map = {
    '24x7':            { label: '24×7',           bg: '#d1fae5', color: '#065f46' },
    emergency_capable: { label: 'Emergency',       bg: '#fee2e2', color: '#991b1b' },
    govt_listed:       { label: 'Govt Listed',     bg: '#dbeafe', color: '#1e40af' },
    verified:          { label: '✓ Verified',      bg: '#e0e7ff', color: '#3730a3' },
    tourist_friendly:  { label: 'Tourist Friendly',bg: '#fef3c7', color: '#92400e' },
    digital_payment:   { label: 'UPI/Card',        bg: '#f3e8ff', color: '#6b21a8' },
    female_doctor:     { label: 'Female Doctor',   bg: '#fce7f3', color: '#9d174d' },
  };
  const cfg = map[tag];
  if (!cfg) return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

export function CostBadge({ badge }) {
  const map = {
    budget:   { label: '₹ Budget',   bg: '#dcfce7', color: '#166534' },
    moderate: { label: '₹₹ Moderate',bg: '#fef9c3', color: '#854d0e' },
    premium:  { label: '₹₹₹ Premium',bg: '#ffedd5', color: '#9a3412' },
  };
  const cfg = map[badge];
  if (!cfg) return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

export function FacilityTypeLabel({ type }) {
  const map = {
    govt_hospital:    { label: 'Govt Hospital',    color: '#1d4ed8' },
    private_hospital: { label: 'Private Hospital', color: '#7c3aed' },
    clinic:           { label: 'Clinic',           color: '#0f766e' },
    pharmacy:         { label: 'Pharmacy',         color: '#15803d' },
    urgent_care:      { label: 'Urgent Care',      color: '#c2410c' },
  };
  const cfg = map[type] || { label: type, color: '#6b7280' };
  return (
    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: cfg.color }}>
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
