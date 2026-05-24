export type PortalType = 'student' | 'medical' | 'admin'

export type StaffRole = 'DOCTOR' | 'NURSE'

export type AdminScope = 'DOU' | 'ONOU'

export type AppointmentType = 'ON_SITE' | 'TELECONSULTATION'

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export type PriorityLevel = 'NORMAL' | 'URGENT' | 'EMERGENCY'

export type PrescriptionStatus = 'ISSUED' | 'READY' | 'DISPENSED'

export interface Student {
  id: string
  fullName: string
  bacRegistrationNumber: string
  university: string
  residence: string
  dateOfBirth: string
  healthRecordId: string
}

export interface MedicalStaff {
  id: string
  fullName: string
  professionalId: string
  role: StaffRole
  assignedResidence: string
  specialty: string
}

export interface Appointment {
  id: string
  studentId: string
  reason: string
  symptoms: string
  preferredDate: string
  timeSlot: string
  type: AppointmentType
  status: AppointmentStatus
  priority?: PriorityLevel
  assignedDoctorId?: string
  triageId?: string
}

export interface Triage {
  id: string
  appointmentId: string
  nurseId: string
  temperature: string
  bloodPressure: string
  heartRate: string
  symptoms: string
  painLevel: string
  emergencyFlag: boolean
  notes: string
}

export interface Consultation {
  id: string
  appointmentId: string
  doctorId: string
  diagnosis: string
  notes: string
  prescriptionId?: string
  referralId?: string
  status: 'DRAFT' | 'FINALIZED'
}

export interface Prescription {
  id: string
  consultationId: string
  medication: string
  dosage: string
  duration: string
  instructions: string
  status: PrescriptionStatus
  dispensedBy?: string
  dispensedAt?: string
}

export interface StockItem {
  id: string
  name: string
  category: string
  quantity: number
  threshold: number
  expiryDate: string
  status: 'OK' | 'LOW' | 'EXPIRES_SOON' | 'CRITICAL'
}

export interface Campaign {
  id: string
  title: string
  type: 'Vaccination' | 'Awareness' | 'Screening' | 'Mental health'
  target: string
  startDate: string
  endDate: string
  status: 'Draft' | 'Published'
  description: string
}

export interface AdminMetric {
  appointmentsThisMonth: number
  completedConsultations: number
  teleconsultations: number
  prescriptionsDispensed: number
  lowStockAlerts: number
  staffingGaps: number
  campaignsActive: number
}

export interface HealthDocument {
  id: string
  studentId: string
  name: string
  status: 'Verified' | 'Pending verification' | 'Rejected'
}

export interface NotificationItem {
  id: string
  studentId: string
  message: string
  timestamp: string
}

export interface EscalatedIssue {
  id: string
  title: string
  residence: string
  status: 'Under review' | 'Assigned' | 'Resolved'
}

export interface AuditLog {
  id: string
  action: string
  actor: string
  time: string
}

export interface PlatformState {
  students: Student[]
  medicalStaff: MedicalStaff[]
  appointments: Appointment[]
  triages: Triage[]
  consultations: Consultation[]
  prescriptions: Prescription[]
  stockItems: StockItem[]
  campaigns: Campaign[]
  documents: HealthDocument[]
  notifications: NotificationItem[]
  escalatedIssues: EscalatedIssue[]
  auditLogs: AuditLog[]
}

export interface Session {
  portal: PortalType
  userId: string
  role?: StaffRole
  scope?: AdminScope
}
