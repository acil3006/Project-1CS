import type { AppData, Campaign, MedicalStaff, Student } from '../types'

export const studentProfile: Student = {
  id: 'stu-001',
  fullName: 'Yacine Benali',
  bacRegistrationNumber: '12345678',
  university: 'University of Algiers',
  residence: 'Cité Universitaire Ben Aknoun',
  dateOfBirth: '2006-02-18',
  healthRecordId: 'HR-ALGIERS-2201',
}

export const otherStudents: Student[] = [
  {
    id: 'stu-002',
    fullName: 'Nadia Achouri',
    bacRegistrationNumber: '23456789',
    university: 'University of Algiers',
    residence: 'Cité Universitaire El Harrach',
    dateOfBirth: '2005-11-04',
    healthRecordId: 'HR-ALGIERS-2202',
  },
  {
    id: 'stu-003',
    fullName: 'Mohamed Bensaid',
    bacRegistrationNumber: '34567890',
    university: 'University of Blida',
    residence: 'Cité Universitaire Soumaa',
    dateOfBirth: '2004-07-19',
    healthRecordId: 'HR-BLIDA-1803',
  },
]

export const medicalStaff: MedicalStaff[] = [
  {
    id: 'med-001',
    fullName: 'Dr. Samir Haddad',
    professionalId: 'DOC-1001',
    role: 'DOCTOR',
    assignedResidence: 'Ben Aknoun Health Unit',
    specialty: 'General Medicine',
  },
  {
    id: 'med-002',
    fullName: 'Nurse Laila Mebarki',
    professionalId: 'NUR-2001',
    role: 'NURSE',
    assignedResidence: 'Ben Aknoun Health Unit',
    specialty: 'Primary Care',
  },
]

export const initialCampaigns: Campaign[] = [
  {
    id: 'camp-001',
    title: 'Mental Health Awareness Week',
    type: 'Awareness',
    target: 'University residences in Algiers',
    startDate: '2026-05-10',
    endDate: '2026-05-17',
    status: 'ACTIVE',
    description: 'Workshops, counseling booths, and stress management sessions.',
  },
  {
    id: 'camp-002',
    title: 'Diabetes Screening Drive',
    type: 'Screening',
    target: 'University residences in Blida',
    startDate: '2026-05-20',
    endDate: '2026-05-28',
    status: 'ACTIVE',
    description: 'On-site glucose testing and nutrition counseling for students.',
  },
]

export const initialData: AppData = {
  students: [studentProfile, ...otherStudents],
  medicalStaff,
  appointments: [
    {
      id: 'apt-101',
      studentId: 'stu-002',
      reason: 'Dental care',
      symptoms: 'Tooth sensitivity',
      preferredDate: '2026-05-25',
      timeSlot: '10:00',
      type: 'ON_SITE',
      status: 'CONFIRMED',
      priority: 'NORMAL',
      assignedDoctorId: 'med-001',
    },
  ],
  triages: [
    {
      id: 'tri-101',
      appointmentId: 'apt-101',
      nurseId: 'med-002',
      temperature: '36.8°C',
      bloodPressure: '118/76',
      heartRate: '78 bpm',
      symptoms: 'Sensitivity when chewing',
      painLevel: '3/10',
      emergencyFlag: false,
      notes: 'No swelling observed.',
    },
  ],
  consultations: [
    {
      id: 'con-101',
      appointmentId: 'apt-101',
      doctorId: 'med-001',
      diagnosis: 'Dental caries suspicion',
      notes: 'Recommend dental x-ray and avoid sugary drinks.',
      prescriptionId: 'pre-101',
      status: 'FINALIZED',
    },
  ],
  prescriptions: [
    {
      id: 'pre-101',
      consultationId: 'con-101',
      medication: 'Ibuprofen 200mg',
      dosage: '1 tablet every 12 hours',
      duration: '2 days',
      instructions: 'Take after meals.',
      status: 'DISPENSED',
      dispensedBy: 'med-002',
      dispensedAt: '2026-05-22 14:20',
    },
  ],
  stockItems: [
    {
      id: 'stk-001',
      name: 'Paracetamol 500mg',
      category: 'Analgesic',
      quantity: 46,
      threshold: 30,
      expiryDate: '2027-01-15',
      status: 'OK',
    },
    {
      id: 'stk-002',
      name: 'Amoxicillin 500mg',
      category: 'Antibiotic',
      quantity: 18,
      threshold: 25,
      expiryDate: '2026-09-10',
      status: 'LOW',
    },
    {
      id: 'stk-003',
      name: 'Digital Thermometer',
      category: 'Equipment',
      quantity: 5,
      threshold: 4,
      expiryDate: '2029-12-31',
      status: 'OK',
    },
  ],
  campaigns: initialCampaigns,
  documents: [
    {
      id: 'doc-001',
      studentId: 'stu-001',
      title: 'BAC medical certificate',
      status: 'VERIFIED',
      uploadedAt: '2026-01-15',
    },
    {
      id: 'doc-002',
      studentId: 'stu-001',
      title: 'Vaccination record',
      status: 'PENDING',
      uploadedAt: '2026-05-20',
    },
    {
      id: 'doc-003',
      studentId: 'stu-001',
      title: 'Previous consultation report',
      status: 'VERIFIED',
      uploadedAt: '2025-12-08',
    },
  ],
  notifications: [
    {
      id: 'note-001',
      studentId: 'stu-001',
      title: 'Vaccination record received',
      message: 'Your vaccination record is pending verification by the nurse team.',
      timestamp: '2026-05-21 09:12',
      status: 'UNREAD',
    },
  ],
  teleconsultations: [
    {
      id: 'tel-001',
      studentId: 'stu-003',
      reason: 'Psychological support',
      symptoms: 'Sleep issues and anxiety before exams',
      status: 'APPROVED',
      scheduledAt: '2026-05-25 15:30',
      doctorId: 'med-001',
    },
  ],
  auditLogs: [
    {
      id: 'log-001',
      action: 'PRESCRIPTION_DISPENSED',
      actor: 'Nurse Laila Mebarki',
      timestamp: '2026-05-22 14:20',
      details: 'Ibuprofen 200mg dispensed for appointment apt-101.',
    },
  ],
}
