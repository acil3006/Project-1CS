interface BadgeProps {
  label: string
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'neutral'
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{label}</span>
}
