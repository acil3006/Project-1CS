import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { clearSession, loadSession, saveSession } from "../auth/authStore";
import {
  DOCTOR_ID,
  initialData,
  NURSE_ID,
  SCENARIO_APPOINTMENT_ID,
  SCENARIO_CAMPAIGN_ID,
  SCENARIO_CERTIFICATE_ID,
  SCENARIO_CONSULTATION_ID,
  SCENARIO_PRESCRIPTION_ID,
  SCENARIO_TRIAGE_ID,
  STUDENT_ID
} from "../data/mockData";
import type {
  AppData,
  AppointmentType,
  CampaignType,
  DocumentStatus,
  IssueStatus,
  Priority,
  Session
} from "../types";

const DATA_KEY = "aethera-edusihha-data";

interface BookAppointmentInput {
  reason: string;
  symptoms: string;
  preferredDate: string;
  timeSlot: string;
  type: AppointmentType;
}

interface CampaignInput {
  title: string;
  target: string;
  type: CampaignType;
  description: string;
  startDate: string;
  endDate: string;
}

interface AppContextValue {
  data: AppData;
  session: Session | null;
  setSession: (session: Session | null) => void;
  logout: () => void;
  resetDemoData: () => void;
  bookScenarioAppointment: (input: BookAppointmentInput) => void;
  validateScenarioAppointment: (priority?: Priority, doctorId?: string) => void;
  saveScenarioTriage: () => void;
  finalizeScenarioConsultation: () => void;
  dispenseScenarioPrescription: () => void;
  publishScenarioCampaign: (input?: CampaignInput) => void;
  registerCampaignInterest: (campaignId: string) => void;
  verifyDocument: (documentId: string, status: DocumentStatus, comment?: string) => void;
  markIssue: (issueId: string, status: IssueStatus) => void;
  requestReplenishment: (stockItemId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function cloneInitialData() {
  return JSON.parse(JSON.stringify(initialData)) as AppData;
}

function loadData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    return raw ? (JSON.parse(raw) as AppData) : cloneInitialData();
  } catch {
    return cloneInitialData();
  }
}

function stamp() {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());
}

function auditId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function addAudit(data: AppData, actor: string, action: string, module: string, detail: string) {
  data.auditLogs = [
    {
      id: auditId("audit"),
      timestamp: stamp(),
      actor,
      action,
      module,
      detail
    },
    ...data.auditLogs
  ];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<AppData>(() => loadData());
  const [sessionState, setSessionState] = useState<Session | null>(() => loadSession());

  const persistData = (next: AppData) => {
    setDataState(next);
    localStorage.setItem(DATA_KEY, JSON.stringify(next));
  };

  const setSession = (next: Session | null) => {
    setSessionState(next);
    saveSession(next);
  };

  const logout = () => {
    setSessionState(null);
    clearSession();
  };

  const resetDemoData = () => {
    const next = cloneInitialData();
    persistData(next);
  };

  const mutate = (recipe: (draft: AppData) => void) => {
    const draft = JSON.parse(JSON.stringify(data)) as AppData;
    recipe(draft);
    draft.metrics.lowStockAlerts = draft.stockItems.filter((item) => item.quantity <= item.threshold).length;
    draft.metrics.campaignsActive = draft.campaigns.filter((campaign) => campaign.status === "PUBLISHED").length;
    persistData(draft);
  };

  const bookScenarioAppointment = (input: BookAppointmentInput) => {
    mutate((draft) => {
      const existing = draft.appointments.find((appointment) => appointment.id === SCENARIO_APPOINTMENT_ID);
      const appointment = {
        id: SCENARIO_APPOINTMENT_ID,
        studentId: STUDENT_ID,
        reason: input.reason,
        symptoms: input.symptoms,
        preferredDate: input.preferredDate,
        timeSlot: input.timeSlot,
        type: input.type,
        status: "PENDING" as const,
        createdAt: stamp()
      };

      if (existing) {
        Object.assign(existing, appointment);
      } else {
        draft.appointments = [appointment, ...draft.appointments];
        draft.metrics.appointmentsThisMonth += 1;
      }

      draft.notifications = [
        {
          id: auditId("notif"),
          studentId: STUDENT_ID,
          title: "Appointment request submitted",
          message: "Your general consultation request is pending validation by the healthcare unit.",
          createdAt: stamp(),
          read: false
        },
        ...draft.notifications
      ];

      addAudit(
        draft,
        "Yacine Benali",
        "Appointment request created",
        "Appointment & Scheduling",
        "Student requested an on-site general consultation for fever and headache."
      );
    });
  };

  const validateScenarioAppointment = (priority: Priority = "NORMAL", doctorId = DOCTOR_ID) => {
    mutate((draft) => {
      const appointment = draft.appointments.find((item) => item.id === SCENARIO_APPOINTMENT_ID);
      if (!appointment) return;

      appointment.status = "CONFIRMED";
      appointment.priority = priority;
      appointment.assignedDoctorId = doctorId;

      draft.notifications = [
        {
          id: auditId("notif"),
          studentId: STUDENT_ID,
          title: "Appointment validated",
          message: "Your consultation has been validated and assigned to Dr. Samir Haddad.",
          createdAt: stamp(),
          read: false
        },
        ...draft.notifications
      ];

      addAudit(
        draft,
        "Amina Kerrouche",
        "Appointment validated",
        "Appointment & Scheduling",
        "Priority set to Normal and assigned to Dr. Samir Haddad."
      );
    });
  };

  const saveScenarioTriage = () => {
    mutate((draft) => {
      const appointment = draft.appointments.find((item) => item.id === SCENARIO_APPOINTMENT_ID);
      if (!appointment) return;

      appointment.status = "IN_PROGRESS";
      appointment.triageId = SCENARIO_TRIAGE_ID;

      const triage = {
        id: SCENARIO_TRIAGE_ID,
        appointmentId: SCENARIO_APPOINTMENT_ID,
        nurseId: NURSE_ID,
        temperature: "38.2°C",
        bloodPressure: "120/80",
        heartRate: "92 bpm",
        symptoms: "fever, headache, fatigue",
        painLevel: 4,
        emergencyFlag: false,
        notes: "Stable student. Hydration advised while waiting for doctor consultation.",
        createdAt: stamp()
      };

      const existing = draft.triages.find((item) => item.id === SCENARIO_TRIAGE_ID);
      if (existing) {
        Object.assign(existing, triage);
      } else {
        draft.triages = [triage, ...draft.triages];
      }

      addAudit(
        draft,
        "Amina Kerrouche",
        "Triage saved",
        "Clinical Records",
        "Temperature 38.2°C, BP 120/80, HR 92 bpm, pain level 4/10."
      );
    });
  };

  const finalizeScenarioConsultation = () => {
    mutate((draft) => {
      const appointment = draft.appointments.find((item) => item.id === SCENARIO_APPOINTMENT_ID);
      if (!appointment) return;

      const alreadyFinalized = draft.consultations.some((item) => item.id === SCENARIO_CONSULTATION_ID);
      appointment.status = "COMPLETED";
      appointment.assignedDoctorId = DOCTOR_ID;

      const consultation = {
        id: SCENARIO_CONSULTATION_ID,
        appointmentId: SCENARIO_APPOINTMENT_ID,
        doctorId: DOCTOR_ID,
        diagnosis: "Seasonal flu suspicion",
        notes: "Rest, hydration, fever monitoring. Return if symptoms persist beyond 72 hours.",
        prescriptionId: SCENARIO_PRESCRIPTION_ID,
        certificateId: SCENARIO_CERTIFICATE_ID,
        status: "FINALIZED" as const,
        createdAt: stamp()
      };

      const prescription = {
        id: SCENARIO_PRESCRIPTION_ID,
        consultationId: SCENARIO_CONSULTATION_ID,
        studentId: STUDENT_ID,
        medication: "Paracetamol 500mg",
        dosage: "1 tablet every 8 hours",
        duration: "3 days",
        instructions: "Take after meals. Do not exceed 3 tablets per day.",
        doctorName: "Dr. Samir Haddad",
        status: "ISSUED" as const,
        issuedAt: stamp()
      };

      const certificate = {
        id: SCENARIO_CERTIFICATE_ID,
        studentId: STUDENT_ID,
        title: "Consultation summary - seasonal flu suspicion",
        type: "Medical certificate",
        uploadedAt: "2026-05-24",
        status: "VERIFIED" as const,
        comment: "Generated by Dr. Samir Haddad after final consultation."
      };

      const existingConsultation = draft.consultations.find((item) => item.id === SCENARIO_CONSULTATION_ID);
      if (existingConsultation) {
        Object.assign(existingConsultation, consultation);
      } else {
        draft.consultations = [consultation, ...draft.consultations];
      }

      const existingPrescription = draft.prescriptions.find((item) => item.id === SCENARIO_PRESCRIPTION_ID);
      if (existingPrescription) {
        Object.assign(existingPrescription, prescription);
      } else {
        draft.prescriptions = [prescription, ...draft.prescriptions];
      }

      if (!draft.documents.some((item) => item.id === SCENARIO_CERTIFICATE_ID)) {
        draft.documents = [certificate, ...draft.documents];
      }

      if (!alreadyFinalized) {
        draft.metrics.completedConsultations += 1;
        draft.metrics.averageWaitingTimeDays = 2.3;
      }

      draft.notifications = [
        {
          id: auditId("notif"),
          studentId: STUDENT_ID,
          title: "Consultation completed",
          message: "Your consultation summary and prescription are now available in Al-Talib.",
          createdAt: stamp(),
          read: false
        },
        ...draft.notifications
      ];

      addAudit(
        draft,
        "Dr. Samir Haddad",
        "Consultation finalized",
        "Clinical Records",
        "Diagnosis validated: Seasonal flu suspicion."
      );
      addAudit(
        draft,
        "Dr. Samir Haddad",
        "Prescription issued",
        "Prescription Management",
        "Paracetamol 500mg, one tablet every 8 hours for 3 days."
      );
    });
  };

  const dispenseScenarioPrescription = () => {
    mutate((draft) => {
      const prescription = draft.prescriptions.find((item) => item.id === SCENARIO_PRESCRIPTION_ID);
      if (!prescription || prescription.status === "DISPENSED") return;

      prescription.status = "DISPENSED";
      prescription.dispensedBy = "Amina Kerrouche";
      prescription.dispensedAt = stamp();

      const stock = draft.stockItems.find((item) => item.id === "stock-paracetamol");
      if (stock) {
        stock.quantity = Math.max(0, stock.quantity - 1);
        stock.status = stock.quantity <= stock.threshold ? "LOW" : "OK";
      }

      draft.metrics.prescriptionsDispensed += 1;
      draft.notifications = [
        {
          id: auditId("notif"),
          studentId: STUDENT_ID,
          title: "Prescription dispensed",
          message: "Your prescription has been dispensed.",
          createdAt: stamp(),
          read: false
        },
        ...draft.notifications
      ];

      addAudit(
        draft,
        "Amina Kerrouche",
        "Prescription dispensed",
        "Prescription Management",
        "Paracetamol 500mg dispensed and stock count decreased by one."
      );
    });
  };

  const publishScenarioCampaign = (input?: CampaignInput) => {
    mutate((draft) => {
      const campaign = {
        id: SCENARIO_CAMPAIGN_ID,
        title: input?.title ?? "Seasonal Flu Prevention Campaign",
        type: input?.type ?? "Awareness",
        target: input?.target ?? "University residences in Algiers",
        startDate: input?.startDate ?? "2026-05-27",
        endDate: input?.endDate ?? "2026-06-10",
        status: "PUBLISHED" as const,
        description:
          input?.description ??
          "Awareness sessions, vaccination orientation, and early fever screening across Algiers residences.",
        interestedStudentIds: []
      };

      const existing = draft.campaigns.find((item) => item.id === SCENARIO_CAMPAIGN_ID);
      if (existing) {
        Object.assign(existing, campaign, {
          interestedStudentIds: existing.interestedStudentIds
        });
      } else {
        draft.campaigns = [campaign, ...draft.campaigns];
      }

      addAudit(
        draft,
        "EduPlan Admin",
        "Campaign published",
        "Analytics & Reporting",
        `${campaign.title} published for ${campaign.target}.`
      );
    });
  };

  const registerCampaignInterest = (campaignId: string) => {
    mutate((draft) => {
      const campaign = draft.campaigns.find((item) => item.id === campaignId);
      if (!campaign) return;

      if (!campaign.interestedStudentIds.includes(STUDENT_ID)) {
        campaign.interestedStudentIds.push(STUDENT_ID);
      }
    });
  };

  const verifyDocument = (documentId: string, status: DocumentStatus, comment?: string) => {
    mutate((draft) => {
      const document = draft.documents.find((item) => item.id === documentId);
      if (!document) return;

      document.status = status;
      document.comment = comment;

      addAudit(
        draft,
        "Amina Kerrouche",
        "Document verification updated",
        "Identity & Patient Registry",
        `${document.title} marked as ${status.toLowerCase().replaceAll("_", " ")}.`
      );
    });
  };

  const markIssue = (issueId: string, status: IssueStatus) => {
    mutate((draft) => {
      const issue = draft.issues.find((item) => item.id === issueId);
      if (!issue) return;

      issue.status = status;
      addAudit(
        draft,
        "EduPlan Admin",
        "Escalated issue updated",
        "Staff & Operations Management",
        `${issue.category} at ${issue.residence} marked as ${status}.`
      );
    });
  };

  const requestReplenishment = (stockItemId: string) => {
    mutate((draft) => {
      const stock = draft.stockItems.find((item) => item.id === stockItemId);
      if (!stock) return;

      addAudit(
        draft,
        "EduPlan Admin",
        "Replenishment request created",
        "Pharmaceutical Stock & Equipment Management",
        `${stock.name} replenishment request sent to regional logistics.`
      );
    });
  };

  const value = useMemo<AppContextValue>(
    () => ({
      data,
      session: sessionState,
      setSession,
      logout,
      resetDemoData,
      bookScenarioAppointment,
      validateScenarioAppointment,
      saveScenarioTriage,
      finalizeScenarioConsultation,
      dispenseScenarioPrescription,
      publishScenarioCampaign,
      registerCampaignInterest,
      verifyDocument,
      markIssue,
      requestReplenishment
    }),
    [data, sessionState]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
}
