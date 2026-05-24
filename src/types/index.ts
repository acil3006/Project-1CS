export type Role = 'STUDENT' | 'DOCTOR' | 'NURSE' | 'ADMIN'
export type MedicalRole = 'DOCTOR' | 'NURSE'
export type AdminScope = 'DOU' | 'ONOU'

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export type AppointmentType = 'ON_SITE' | 'TELECONSULTATION'

export type PrescriptionStatus = 'ISSUED' | 'READY' | 'DISPENSED'

export type DocumentStatus = 'VERIFIED' | 'PENDING' | 'REJECTED' | 'NEEDS_CLARIFICATION'

export type CampaignStatus = 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED'

export type AuditAction =
  | 'APPOINTMENT_REQUESTED'
  | 'APPOINTMENT_VALIDATED'
  | 'TRIAGE_SAVED'
  | 'CONSULTATION_FINALIZED'
  | 'PRESCRIPTION_ISSUED'
  | 'PRESCRIPTION_DISPENSED'
  | 'CAMPAIGN_PUBLISHED'
  | 'DOCUMENT_VERIFIED'

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
  role: MedicalRole
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
  priority?: 'NORMAL' | 'URGENT' | 'EMERGENCY'
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
  notes?: string
}

export interface Consultation {
  id: string
  appointmentId: string
  doctorId: string
  diagnosis: string
  notes: string
  prescriptionId?: string
  referralId?: string
  status: 'OPEN' | 'FINALIZED'
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
  status: 'OK' | 'LOW' | 'EXPIRING'
}

export interface Campaign {
  id: string
  title: string
  type: string
  target: string
  startDate: string
  endDate: string
  status: CampaignStatus
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
  title: string
  status: DocumentStatus
  uploadedAt: string
}

export interface Notification {
  id: string
  studentId: string
  title: string
  message: string
  timestamp: string
  status: 'UNREAD' | 'READ'
}

export interface AuditLogEntry {
  id: string
  action: AuditAction
  actor: string
  timestamp: string
  details: string
}

export interface Teleconsultation {
  id: string
  studentId: string
  reason: string
  symptoms: string
  status: 'PENDING' | 'APPROVED' | 'COMPLETED'
  scheduledAt?: string
  doctorId?: string
}

export interface Session {
  role: Role
  userId: string
  scope?: AdminScope
}

export interface AppData {
  students: Student[]
  medicalStaff: MedicalStaff[]
  appointments: Appointment[]
  triages: Triage[]
  consultations: Consultation[]
  prescriptions: Prescription[]
  stockItems: StockItem[]
  campaigns: Campaign[]
  documents: HealthDocument[]
  notifications: Notification[]
  teleconsultations: Teleconsultation[]
  auditLogs: AuditLogEntry[]
}
