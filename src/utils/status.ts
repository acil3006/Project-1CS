import type { BadgeTone } from '../components/common/Badge'
import type { AppointmentStatus, DocumentStatus, PrescriptionStatus } from '../types'

export const appointmentStatusLabel: Record<AppointmentStatus, string> = {
  PENDING: 'Pending validation',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export const appointmentStatusTone = {
  PENDING: 'amber',
  CONFIRMED: 'blue',
  IN_PROGRESS: 'indigo',
  COMPLETED: 'emerald',
  CANCELLED: 'rose',
} as const satisfies Record<AppointmentStatus, BadgeTone>

export const prescriptionStatusTone = {
  ISSUED: 'blue',
  READY: 'amber',
  DISPENSED: 'emerald',
} as const satisfies Record<PrescriptionStatus, BadgeTone>

export const documentStatusTone = {
  VERIFIED: 'emerald',
  PENDING: 'amber',
  REJECTED: 'rose',
  NEEDS_CLARIFICATION: 'indigo',
} as const satisfies Record<DocumentStatus, BadgeTone>
