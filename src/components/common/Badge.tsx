import type { ReactNode } from 'react'

const tones = {
  slate: 'bg-slate-100 text-slate-700 border border-slate-200',
  emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  rose: 'bg-rose-50 text-rose-700 border border-rose-200',
  amber: 'bg-amber-50 text-amber-700 border border-amber-200',
  blue: 'bg-blue-50 text-blue-700 border border-blue-200',
  indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
} as const

export type BadgeTone = keyof typeof tones

export function Badge({
  tone = 'slate',
  children,
  className = '',
}: {
  tone?: BadgeTone
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
