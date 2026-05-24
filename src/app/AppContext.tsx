/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { initialData, medicalStaff, studentProfile } from '../data/mockData'
import {
  type AdminScope,
  type AppData,
  type Appointment,
  type AppointmentType,
  type Campaign,
  type DocumentStatus,
  type MedicalRole,
  type Session,
} from '../types'

const sessionKey = 'aethera-session'
const dataKey = 'aethera-data'

type LoginResult = { success: boolean; message?: string }

interface AppContextValue {
  data: AppData
  session: Session | null
  student: typeof studentProfile | null
  staff: (typeof medicalStaff)[number] | null
  adminScope: AdminScope | null
  loginStudent: (bacNumber: string, password: string) => LoginResult
  loginMedical: (professionalId: string, password: string, role: MedicalRole) => LoginResult
  loginAdmin: (adminId: string, password: string, scope: AdminScope) => LoginResult
  logout: () => void
  bookAppointment: (payload: {
    reason: string
    symptoms: string
    preferredDate: string
    timeSlot: string
    type: AppointmentType
  }) => Appointment
  validateAppointment: (appointmentId: string, payload: { priority: Appointment['priority']; doctorId: string }) => void
  recordTriage: (
    appointmentId: string,
    payload: {
      temperature: string
      bloodPressure: string
      heartRate: string
      symptoms: string
      painLevel: string
      emergencyFlag: boolean
      notes?: string
    },
  ) => void
  finalizeConsultation: (
    appointmentId: string,
    payload: {
      diagnosis: string
      notes: string
      medication: string
      dosage: string
      duration: string
      instructions: string
    },
  ) => void
  dispensePrescription: (prescriptionId: string, nurseId: string) => void
  publishCampaign: (payload: Omit<Campaign, 'id' | 'status'>) => void
  requestTeleconsultation: (payload: { reason: string; symptoms: string }) => void
  updateDocumentStatus: (documentId: string, status: DocumentStatus, comment?: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const credentialMap = {
  student: { bac: '12345678', password: 'BAC2026' },
  doctor: { id: 'DOC-1001', password: 'doctor123' },
  nurse: { id: 'NUR-2001', password: 'nurse123' },
  adminDou: { id: 'DOU-ALGIERS', password: 'admin123', scope: 'DOU' as AdminScope },
  adminOnou: { id: 'ONOU-NATIONAL', password: 'admin123', scope: 'ONOU' as AdminScope },
}

const now = () => new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => {
    const stored = localStorage.getItem(sessionKey)
    return stored ? (JSON.parse(stored) as Session) : null
  })
  const [data, setData] = useState<AppData>(() => {
    const stored = localStorage.getItem(dataKey)
    return stored ? (JSON.parse(stored) as AppData) : initialData
  })

  useEffect(() => {
    if (session) {
      localStorage.setItem(sessionKey, JSON.stringify(session))
    } else {
      localStorage.removeItem(sessionKey)
    }
  }, [session])

  useEffect(() => {
    localStorage.setItem(dataKey, JSON.stringify(data))
  }, [data])

  const student = useMemo(() => {
    if (session?.role !== 'STUDENT') return null
    return data.students.find((item) => item.id === session.userId) ?? null
  }, [data.students, session])

  const staff = useMemo(() => {
    if (session?.role !== 'DOCTOR' && session?.role !== 'NURSE') return null
    return data.medicalStaff.find((item) => item.id === session.userId) ?? null
  }, [data.medicalStaff, session])

  const adminScope = useMemo(() => (session?.role === 'ADMIN' ? session.scope ?? null : null), [session])

  const loginStudent = (bacNumber: string, password: string): LoginResult => {
    if (bacNumber !== credentialMap.student.bac || password !== credentialMap.student.password) {
      return { success: false, message: 'Invalid Bac registration number or password.' }
    }
    setSession({ role: 'STUDENT', userId: studentProfile.id })
    return { success: true }
  }

  const loginMedical = (professionalId: string, password: string, role: MedicalRole): LoginResult => {
    const expected = role === 'DOCTOR' ? credentialMap.doctor : credentialMap.nurse
    if (professionalId !== expected.id || password !== expected.password) {
      return { success: false, message: 'Invalid professional ID, password, or role.' }
    }
    const staffMember = data.medicalStaff.find((item) => item.professionalId === professionalId && item.role === role)
    if (!staffMember) {
      return { success: false, message: 'No medical staff found for the selected role.' }
    }
    setSession({ role, userId: staffMember.id })
    return { success: true }
  }

  const loginAdmin = (adminId: string, password: string, scope: AdminScope): LoginResult => {
    const target = scope === 'DOU' ? credentialMap.adminDou : credentialMap.adminOnou
    if (adminId !== target.id || password !== target.password) {
      return { success: false, message: 'Invalid admin credentials.' }
    }
    setSession({ role: 'ADMIN', userId: adminId, scope })
    return { success: true }
  }

  const logout = () => setSession(null)

  const bookAppointment = (payload: {
    reason: string
    symptoms: string
    preferredDate: string
    timeSlot: string
    type: AppointmentType
  }): Appointment => {
    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      studentId: studentProfile.id,
      reason: payload.reason,
      symptoms: payload.symptoms,
      preferredDate: payload.preferredDate,
      timeSlot: payload.timeSlot,
      type: payload.type,
      status: 'PENDING',
    }

    setData((prev) => ({
      ...prev,
      appointments: [appointment, ...prev.appointments],
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          action: 'APPOINTMENT_REQUESTED',
          actor: studentProfile.fullName,
          timestamp: now(),
          details: `Appointment request created for ${payload.reason}.`,
        },
        ...prev.auditLogs,
      ],
      notifications: [
        {
          id: `note-${Date.now()}`,
          studentId: studentProfile.id,
          title: 'Appointment request submitted',
          message: 'Your request has been sent to the nurse team for validation.',
          timestamp: now(),
          status: 'UNREAD',
        },
        ...prev.notifications,
      ],
    }))

    return appointment
  }

  const validateAppointment = (
    appointmentId: string,
    payload: { priority: Appointment['priority']; doctorId: string },
  ) => {
    setData((prev) => ({
      ...prev,
      appointments: prev.appointments.map((appointment) =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              status: 'CONFIRMED',
              priority: payload.priority,
              assignedDoctorId: payload.doctorId,
            }
          : appointment,
      ),
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          action: 'APPOINTMENT_VALIDATED',
          actor: 'Nurse Laila Mebarki',
          timestamp: now(),
          details: `Appointment ${appointmentId} validated and assigned to Dr. Samir Haddad.`,
        },
        ...prev.auditLogs,
      ],
      notifications: [
        {
          id: `note-${Date.now()}`,
          studentId: studentProfile.id,
          title: 'Appointment validated',
          message: 'Your appointment has been validated and assigned to a doctor.',
          timestamp: now(),
          status: 'UNREAD',
        },
        ...prev.notifications,
      ],
    }))
  }

  const recordTriage = (
    appointmentId: string,
    payload: {
      temperature: string
      bloodPressure: string
      heartRate: string
      symptoms: string
      painLevel: string
      emergencyFlag: boolean
      notes?: string
    },
  ) => {
    const triageId = `tri-${Date.now()}`
    setData((prev) => ({
      ...prev,
      triages: [
        {
          id: triageId,
          appointmentId,
          nurseId: 'med-002',
          ...payload,
        },
        ...prev.triages,
      ],
      appointments: prev.appointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status: 'IN_PROGRESS', triageId } : appointment,
      ),
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          action: 'TRIAGE_SAVED',
          actor: 'Nurse Laila Mebarki',
          timestamp: now(),
          details: `Triage completed for appointment ${appointmentId}.`,
        },
        ...prev.auditLogs,
      ],
    }))
  }

  const finalizeConsultation = (
    appointmentId: string,
    payload: {
      diagnosis: string
      notes: string
      medication: string
      dosage: string
      duration: string
      instructions: string
    },
  ) => {
    const consultationId = `con-${Date.now()}`
    const prescriptionId = `pre-${Date.now()}`

    setData((prev) => ({
      ...prev,
      consultations: [
        {
          id: consultationId,
          appointmentId,
          doctorId: 'med-001',
          diagnosis: payload.diagnosis,
          notes: payload.notes,
          prescriptionId,
          status: 'FINALIZED',
        },
        ...prev.consultations,
      ],
      prescriptions: [
        {
          id: prescriptionId,
          consultationId,
          medication: payload.medication,
          dosage: payload.dosage,
          duration: payload.duration,
          instructions: payload.instructions,
          status: 'ISSUED',
        },
        ...prev.prescriptions,
      ],
      appointments: prev.appointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status: 'COMPLETED' } : appointment,
      ),
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          action: 'CONSULTATION_FINALIZED',
          actor: 'Dr. Samir Haddad',
          timestamp: now(),
          details: `Consultation finalized for appointment ${appointmentId}.`,
        },
        {
          id: `log-${Date.now()}-p`,
          action: 'PRESCRIPTION_ISSUED',
          actor: 'Dr. Samir Haddad',
          timestamp: now(),
          details: `${payload.medication} prescription issued.`,
        },
        ...prev.auditLogs,
      ],
      notifications: [
        {
          id: `note-${Date.now()}`,
          studentId: studentProfile.id,
          title: 'Consultation completed',
          message: 'Your consultation summary and prescription are available.',
          timestamp: now(),
          status: 'UNREAD',
        },
        ...prev.notifications,
      ],
    }))
  }

  const dispensePrescription = (prescriptionId: string, nurseId: string) => {
    setData((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.map((prescription) =>
        prescription.id === prescriptionId
          ? { ...prescription, status: 'DISPENSED', dispensedBy: nurseId, dispensedAt: now() }
          : prescription,
      ),
      stockItems: prev.stockItems.map((item) =>
        item.name === 'Paracetamol 500mg'
          ? {
              ...item,
              quantity: Math.max(item.quantity - 1, 0),
              status: item.quantity - 1 <= item.threshold ? 'LOW' : item.status,
            }
          : item,
      ),
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          action: 'PRESCRIPTION_DISPENSED',
          actor: 'Nurse Laila Mebarki',
          timestamp: now(),
          details: `Prescription ${prescriptionId} dispensed to student.`,
        },
        ...prev.auditLogs,
      ],
      notifications: [
        {
          id: `note-${Date.now()}`,
          studentId: studentProfile.id,
          title: 'Prescription dispensed',
          message: 'Your medication has been dispensed by the healthcare unit.',
          timestamp: now(),
          status: 'UNREAD',
        },
        ...prev.notifications,
      ],
    }))
  }

  const publishCampaign = (payload: Omit<Campaign, 'id' | 'status'>) => {
    const campaign: Campaign = {
      ...payload,
      id: `camp-${Date.now()}`,
      status: 'PUBLISHED',
    }

    setData((prev) => ({
      ...prev,
      campaigns: [campaign, ...prev.campaigns],
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          action: 'CAMPAIGN_PUBLISHED',
          actor: 'EduPlan Admin',
          timestamp: now(),
          details: `Campaign "${payload.title}" published.`,
        },
        ...prev.auditLogs,
      ],
    }))
  }

  const requestTeleconsultation = (payload: { reason: string; symptoms: string }) => {
    setData((prev) => ({
      ...prev,
      teleconsultations: [
        {
          id: `tel-${Date.now()}`,
          studentId: studentProfile.id,
          reason: payload.reason,
          symptoms: payload.symptoms,
          status: 'PENDING',
        },
        ...prev.teleconsultations,
      ],
    }))
  }

  const updateDocumentStatus = (documentId: string, status: DocumentStatus, comment?: string) => {
    setData((prev) => ({
      ...prev,
      documents: prev.documents.map((doc) => (doc.id === documentId ? { ...doc, status } : doc)),
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          action: 'DOCUMENT_VERIFIED',
          actor: 'Nurse Laila Mebarki',
          timestamp: now(),
          details: `Document ${documentId} marked as ${status}. ${comment ?? ''}`.trim(),
        },
        ...prev.auditLogs,
      ],
    }))
  }

  const value: AppContextValue = {
    data,
    session,
    student,
    staff,
    adminScope,
    loginStudent,
    loginMedical,
    loginAdmin,
    logout,
    bookAppointment,
    validateAppointment,
    recordTriage,
    finalizeConsultation,
    dispensePrescription,
    publishCampaign,
    requestTeleconsultation,
    updateDocumentStatus,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return ctx
}
