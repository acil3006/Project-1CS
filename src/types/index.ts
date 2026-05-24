export type AccessKind = "student" | "medical" | "admin";
export type MedicalRole = "DOCTOR" | "NURSE";
export type AdminScope = "DOU" | "ONOU";
export type UserRole = "STUDENT" | MedicalRole | "ADMIN";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type AppointmentType = "ON_SITE" | "TELECONSULTATION";
export type Priority = "NORMAL" | "URGENT" | "EMERGENCY";
export type PrescriptionStatus = "ISSUED" | "READY" | "DISPENSED";
export type DocumentStatus = "VERIFIED" | "PENDING_VERIFICATION" | "REJECTED" | "NEEDS_CLARIFICATION";
export type CampaignStatus = "DRAFT" | "PUBLISHED" | "COMPLETED";
export type CampaignType = "Vaccination" | "Awareness" | "Screening" | "Mental health";
export type IssueStatus = "Under review" | "Assigned" | "Resolved";

export interface Student {
  id: string;
  fullName: string;
  bacRegistrationNumber: string;
  university: string;
  residence: string;
  dateOfBirth: string;
  healthRecordId: string;
}

export interface MedicalStaff {
  id: string;
  fullName: string;
  professionalId: string;
  role: MedicalRole;
  assignedResidence: string;
  specialty: string;
}

export interface AdminUser {
  id: string;
  fullName: string;
  adminId: string;
  scope: AdminScope;
  label: string;
}

export interface Appointment {
  id: string;
  studentId: string;
  reason: string;
  symptoms: string;
  preferredDate: string;
  timeSlot: string;
  type: AppointmentType;
  status: AppointmentStatus;
  priority?: Priority;
  assignedDoctorId?: string;
  triageId?: string;
  createdAt: string;
}

export interface Triage {
  id: string;
  appointmentId: string;
  nurseId: string;
  temperature: string;
  bloodPressure: string;
  heartRate: string;
  symptoms: string;
  painLevel: number;
  emergencyFlag: boolean;
  notes: string;
  createdAt: string;
}

export interface Consultation {
  id: string;
  appointmentId: string;
  doctorId: string;
  diagnosis: string;
  notes: string;
  prescriptionId?: string;
  referralId?: string;
  certificateId?: string;
  status: "DRAFT" | "FINALIZED";
  createdAt: string;
}

export interface Prescription {
  id: string;
  consultationId: string;
  studentId: string;
  medication: string;
  dosage: string;
  duration: string;
  instructions: string;
  doctorName: string;
  status: PrescriptionStatus;
  issuedAt: string;
  dispensedBy?: string;
  dispensedAt?: string;
}

export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  expiryDate: string;
  status: "OK" | "LOW" | "EXPIRING" | "CRITICAL";
}

export interface HealthDocument {
  id: string;
  studentId: string;
  title: string;
  type: string;
  uploadedAt: string;
  status: DocumentStatus;
  comment?: string;
}

export interface Campaign {
  id: string;
  title: string;
  type: CampaignType;
  target: string;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  description: string;
  interestedStudentIds: string[];
}

export interface AdminMetric {
  totalStudentsServed: number;
  appointmentsThisMonth: number;
  completedConsultations: number;
  teleconsultations: number;
  prescriptionsDispensed: number;
  lowStockAlerts: number;
  equipmentGapAlerts: number;
  staffingGaps: number;
  campaignsActive: number;
  complianceReportsPending: number;
  averageWaitingTimeDays: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  module: string;
  detail: string;
}

export interface NotificationItem {
  id: string;
  studentId: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface EscalatedIssue {
  id: string;
  residence: string;
  category: "Stock shortage" | "Lack of staff" | "High demand" | "Equipment failure" | "Urgent campaign need";
  severity: "Medium" | "High" | "Critical";
  status: IssueStatus;
  summary: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  residence: string;
  status: "Operational" | "Maintenance required" | "Missing";
  lastChecked: string;
}

export interface AppData {
  students: Student[];
  medicalStaff: MedicalStaff[];
  admins: AdminUser[];
  appointments: Appointment[];
  triages: Triage[];
  consultations: Consultation[];
  prescriptions: Prescription[];
  stockItems: StockItem[];
  documents: HealthDocument[];
  campaigns: Campaign[];
  notifications: NotificationItem[];
  metrics: AdminMetric;
  auditLogs: AuditLog[];
  issues: EscalatedIssue[];
  equipment: EquipmentItem[];
}

export interface Session {
  kind: AccessKind;
  role: UserRole;
  userId: string;
  displayName: string;
  scope?: AdminScope;
}
