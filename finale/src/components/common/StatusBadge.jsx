export default function StatusBadge({ children, tone = 'neutral' }) { return <span className={`badge badge-${tone.toLowerCase().replaceAll(' ', '-')}`}>{children}</span>; }
