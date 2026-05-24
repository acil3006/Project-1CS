import type { ButtonHTMLAttributes } from 'react'

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-white text-brand-700 border border-brand-200 hover:border-brand-300',
  ghost: 'bg-transparent text-slate-600 hover:text-slate-900',
  outline: 'border border-slate-200 text-slate-700 hover:border-slate-300',
} as const

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
} as const

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
