import type { AppData } from "../types";

export const SCENARIO_APPOINTMENT_ID = "apt-scenario-fever";
export const SCENARIO_TRIAGE_ID = "triage-scenario-fever";
export const SCENARIO_CONSULTATION_ID = "consult-scenario-fever";
export const SCENARIO_PRESCRIPTION_ID = "rx-scenario-fever";
export const SCENARIO_CERTIFICATE_ID = "doc-scenario-certificate";
export const SCENARIO_CAMPAIGN_ID = "camp-seasonal-flu";
export const STUDENT_ID = "stu-yacine";
export const DOCTOR_ID = "staff-doctor-samir";
export const NURSE_ID = "staff-nurse-amina";

export const initialData: AppData = {
  students: [
    {
      id: STUDENT_ID,
      fullName: "Yacine Benali",
      bacRegistrationNumber: "12345678",
      university: "University of Algiers",
      residence: "Cité Universitaire Ben Aknoun",
      dateOfBirth: "2006-03-14",
      healthRecordId: "HR-ALG-2026-0042"
    }
  ],
  medicalStaff: [
    {
      id: DOCTOR_ID,
      fullName: "Dr. Samir Haddad",
      professionalId: "DOC-1001",
      role: "DOCTOR",
      assignedResidence: "Cité Universitaire Ben Aknoun",
      specialty: "General Medicine"
    },
    {
      id: NURSE_ID,
      fullName: "Amina Kerrouche",
      professionalId: "NUR-2001",
      role: "NURSE",
      assignedResidence: "Cité Universitaire Ben Aknoun",
      specialty: "Student Health Unit"
    }
  ],
  admins: [
    {
      id: "admin-dou-algiers",
      fullName: "Meriem Saadi",
      adminId: "DOU-ALGIERS",
      scope: "DOU",
      label: "Regional DOU - Algiers"
    },
    {
      id: "admin-onou-national",
      fullName: "Kamel Boudiaf",
      adminId: "ONOU-NATIONAL",
      scope: "ONOU",
      label: "National ONOU"
    }
  ],
  appointments: [
    {
      id: "apt-dental-101",
      studentId: STUDENT_ID,
      reason: "Dental care",
      symptoms: "Tooth sensitivity after meals",
      preferredDate: "2026-05-25",
      timeSlot: "10:30",
      type: "ON_SITE",
      status: "CONFIRMED",
      priority: "NORMAL",
      assignedDoctorId: DOCTOR_ID,
      createdAt: "2026-05-21 09:12"
    },
    {
      id: "apt-tele-204",
      studentId: STUDENT_ID,
      reason: "Psychological support",
      symptoms: "Exam stress and sleep difficulty",
      preferredDate: "2026-05-26",
      timeSlot: "16:00",
      type: "TELECONSULTATION",
      status: "CONFIRMED",
      priority: "NORMAL",
      assignedDoctorId: DOCTOR_ID,
      createdAt: "2026-05-22 14:45"
    }
  ],
  triages: [],
  consultations: [
    {
      id: "consult-previous-001",
      appointmentId: "apt-dental-101",
      doctorId: DOCTOR_ID,
      diagnosis: "Mild dental sensitivity",
      notes: "Student advised to schedule dental follow-up if pain increases.",
      status: "FINALIZED",
      createdAt: "2026-04-16 11:20"
    }
  ],
  prescriptions: [
    {
      id: "rx-previous-001",
      consultationId: "consult-previous-001",
      studentId: STUDENT_ID,
      medication: "Vitamin D3",
      dosage: "1000 IU daily",
      duration: "30 days",
      instructions: "Take after lunch.",
      doctorName: "Dr. Samir Haddad",
      status: "READY",
      issuedAt: "2026-04-16 11:28"
    }
  ],
  stockItems: [
    {
      id: "stock-paracetamol",
      name: "Paracetamol 500mg",
      category: "Analgesic / antipyretic",
      quantity: 42,
      threshold: 30,
      expiryDate: "2027-02-28",
      status: "OK"
    },
    {
      id: "stock-amoxicillin",
      name: "Amoxicillin 500mg",
      category: "Antibiotic",
      quantity: 14,
      threshold: 20,
      expiryDate: "2026-09-30",
      status: "LOW"
    },
    {
      id: "stock-glucose",
      name: "Glucose test strips",
      category: "Screening supplies",
      quantity: 9,
      threshold: 15,
      expiryDate: "2026-07-15",
      status: "CRITICAL"
    },
    {
      id: "stock-masks",
      name: "Surgical masks",
      category: "Protection",
      quantity: 180,
      threshold: 100,
      expiryDate: "2028-01-01",
      status: "OK"
    }
  ],
  documents: [
    {
      id: "doc-bac-medical",
      studentId: STUDENT_ID,
      title: "BAC medical certificate",
      type: "Certificate",
      uploadedAt: "2026-05-02",
      status: "VERIFIED",
      comment: "Accepted during registration."
    },
    {
      id: "doc-vaccination",
      studentId: STUDENT_ID,
      title: "Vaccination record",
      type: "Vaccination",
      uploadedAt: "2026-05-08",
      status: "PENDING_VERIFICATION",
      comment: "Awaiting nurse review."
    },
    {
      id: "doc-consult-report",
      studentId: STUDENT_ID,
      title: "Previous consultation report",
      type: "Clinical report",
      uploadedAt: "2026-04-16",
      status: "VERIFIED"
    },
    {
      id: "doc-sport-clearance",
      studentId: STUDENT_ID,
      title: "Sports medical clearance",
      type: "Medical certificate",
      uploadedAt: "2026-03-12",
      status: "REJECTED",
      comment: "Document is missing physician stamp."
    }
  ],
  campaigns: [
    {
      id: "camp-vaccination",
      title: "Residence vaccination campaign",
      type: "Vaccination",
      target: "Algiers university residences",
      startDate: "2026-05-28",
      endDate: "2026-06-08",
      status: "PUBLISHED",
      description: "On-site vaccination slots coordinated with university residence healthcare units.",
      interestedStudentIds: []
    },
    {
      id: "camp-mental-health",
      title: "Mental health awareness week",
      type: "Mental health",
      target: "University of Algiers",
      startDate: "2026-06-02",
      endDate: "2026-06-07",
      status: "PUBLISHED",
      description: "Peer support sessions, confidential screening, and stress management workshops.",
      interestedStudentIds: []
    },
    {
      id: "camp-diabetes",
      title: "Diabetes screening morning",
      type: "Screening",
      target: "Ben Aknoun and Kouba residences",
      startDate: "2026-06-12",
      endDate: "2026-06-12",
      status: "PUBLISHED",
      description: "Fast glucose checks and orientation for at-risk students.",
      interestedStudentIds: []
    }
  ],
  notifications: [
    {
      id: "notif-appointment",
      studentId: STUDENT_ID,
      title: "Appointment confirmed",
      message: "Your dental appointment is confirmed for 25 May at 10:30.",
      createdAt: "2026-05-22 09:30",
      read: false
    },
    {
      id: "notif-documents",
      studentId: STUDENT_ID,
      title: "Document under review",
      message: "Your vaccination record is pending verification by the healthcare unit.",
      createdAt: "2026-05-20 13:10",
      read: false
    }
  ],
  metrics: {
    totalStudentsServed: 18420,
    appointmentsThisMonth: 1268,
    completedConsultations: 912,
    teleconsultations: 184,
    prescriptionsDispensed: 476,
    lowStockAlerts: 2,
    equipmentGapAlerts: 3,
    staffingGaps: 4,
    campaignsActive: 3,
    complianceReportsPending: 2,
    averageWaitingTimeDays: 2.4
  },
  auditLogs: [
    {
      id: "audit-init-1",
      timestamp: "2026-05-24 08:00",
      actor: "System",
      action: "API gateway health check",
      module: "Platform",
      detail: "Aethera gateway synchronized Accommodation, EduSihha, and Activities modules."
    },
    {
      id: "audit-init-2",
      timestamp: "2026-05-24 08:15",
      actor: "EduPlan",
      action: "Compliance snapshot generated",
      module: "Analytics & Reporting",
      detail: "Regional DOU healthcare indicators prepared for supervision dashboard."
    }
  ],
  issues: [
    {
      id: "issue-1",
      residence: "Cité Universitaire Kouba",
      category: "Stock shortage",
      severity: "High",
      status: "Under review",
      summary: "Antipyretic stock below two-week coverage."
    },
    {
      id: "issue-2",
      residence: "Cité Universitaire Bab Ezzouar",
      category: "Lack of staff",
      severity: "Critical",
      status: "Assigned",
      summary: "Night shift nurse unavailable for two consecutive days."
    },
    {
      id: "issue-3",
      residence: "Cité Universitaire Ben Aknoun",
      category: "Urgent campaign need",
      severity: "Medium",
      status: "Under review",
      summary: "Increase in seasonal fever symptoms reported by nurses."
    }
  ],
  equipment: [
    {
      id: "eq-thermometer",
      name: "Digital thermometers",
      residence: "Cité Universitaire Ben Aknoun",
      status: "Operational",
      lastChecked: "2026-05-23"
    },
    {
      id: "eq-ecg",
      name: "Portable ECG",
      residence: "Cité Universitaire Kouba",
      status: "Maintenance required",
      lastChecked: "2026-05-18"
    },
    {
      id: "eq-nebulizer",
      name: "Nebulizer kit",
      residence: "Cité Universitaire Bab Ezzouar",
      status: "Missing",
      lastChecked: "2026-05-15"
    }
  ]
};
