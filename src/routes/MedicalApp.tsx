import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppContext } from '../app/AppContext'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Field, TextArea, TextInput } from '../components/common/Field'
import { SectionHeader } from '../components/common/SectionHeader'
import { Select } from '../components/common/Select'
import { documentStatusTone, prescriptionStatusTone } from '../utils/status'

const doctorNav = [
  'Dashboard',
  'Appointment Calendar',
  'Patient Records',
  'Consultations',
  'Teleconsultations',
  'Prescriptions',
  'Referrals',
  'Medical Certificates',
  'Reports',
]

const nurseNav = [
  'Dashboard',
  'Appointment Queue',
  'Walk-in Registration',
  'Triage',
  'Document Verification',
  'Prescription Dispensing',
  'Stock & Equipment',
  'Patient Orientation',
]

export function MedicalApp() {
  const {
    staff,
    data,
    logout,
    validateAppointment,
    recordTriage,
    finalizeConsultation,
    dispensePrescription,
    updateDocumentStatus,
  } = useAppContext()
  const [section, setSection] = useState('Dashboard')
  const [triageForm, setTriageForm] = useState({
    temperature: '38.2°C',
    bloodPressure: '120/80',
    heartRate: '92 bpm',
    symptoms: 'Fever, headache, fatigue',
    painLevel: '4/10',
    emergencyFlag: false,
    notes: 'Student reports 2 days of symptoms.',
  })
  const [consultationForm, setConsultationForm] = useState({
    diagnosis: 'Seasonal flu suspicion',
    notes: 'Rest, hydration, fever monitoring. Return if symptoms persist beyond 72 hours.',
    medication: 'Paracetamol 500mg',
    dosage: '1 tablet every 8 hours',
    duration: '3 days',
    instructions: 'Take after meals and drink water.',
  })

  const pendingAppointments = useMemo(
    () => data.appointments.filter((appointment) => appointment.status === 'PENDING'),
    [data.appointments],
  )

  const assignedAppointments = useMemo(() => {
    if (!staff) return []
    return data.appointments.filter((appointment) => appointment.assignedDoctorId === staff.id)
  }, [data.appointments, staff])

  const student = data.students.find((item) => item.bacRegistrationNumber === '12345678')
  const scenarioAppointment = data.appointments.find((appointment) => appointment.studentId === student?.id)

  const scenarioTriage = scenarioAppointment
    ? data.triages.find((triage) => triage.appointmentId === scenarioAppointment.id)
    : null

  const doctorPrescriptions = data.prescriptions
  const readyPrescriptions = data.prescriptions.filter((prescription) => prescription.status === 'ISSUED')

  if (!staff) {
    return <Navigate to="/login/medical" replace />
  }

  const navItems = staff.role === 'DOCTOR' ? doctorNav : nurseNav

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col gap-4 border-r border-slate-200 bg-white px-4 py-6 md:flex">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">EduSihha</p>
            <h1 className="text-lg font-semibold text-slate-900">Medical Platform</h1>
          </div>
          <div className="rounded-2xl bg-brand-50 p-3 text-sm text-slate-700">
            <p className="font-semibold">{staff.fullName}</p>
            <p>{staff.role}</p>
            <p className="text-xs text-slate-500">{staff.assignedResidence}</p>
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            {navItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSection(item)}
                className={`rounded-xl px-3 py-2 text-left ${
                  section === item
                    ? 'bg-brand-100 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
          <Button variant="outline" size="sm" onClick={logout}>
            Log out
          </Button>
        </aside>

        <main className="flex-1 px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-brand-600">EduSihha</p>
              <h2 className="text-2xl font-semibold text-slate-900">{section}</h2>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={staff.role === 'DOCTOR' ? 'blue' : 'amber'}>{staff.role}</Badge>
              <Button variant="outline" size="sm" onClick={logout}>
                Log out
              </Button>
            </div>
          </div>

          {staff.role === 'DOCTOR' ? (
            <div className="mt-6 space-y-6">
              {section === 'Dashboard' ? (
                <div className="grid gap-4 lg:grid-cols-3">
                  <Card>
                    <SectionHeader title="Today's appointments" />
                    <p className="mt-3 text-3xl font-semibold text-slate-900">{assignedAppointments.length}</p>
                    <p className="text-sm text-slate-500">Assigned consultations for today.</p>
                  </Card>
                  <Card>
                    <SectionHeader title="Teleconsultations" />
                    <p className="mt-3 text-3xl font-semibold text-slate-900">{data.teleconsultations.length}</p>
                    <p className="text-sm text-slate-500">Approved remote sessions.</p>
                  </Card>
                  <Card>
                    <SectionHeader title="Prescriptions to review" />
                    <p className="mt-3 text-3xl font-semibold text-slate-900">{doctorPrescriptions.length}</p>
                    <p className="text-sm text-slate-500">Digital prescriptions issued this week.</p>
                  </Card>
                  <Card className="lg:col-span-2">
                    <SectionHeader title="Alerts from nurses" subtitle="Latest triage updates" />
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      {scenarioTriage ? (
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <p className="font-semibold text-slate-900">Yacine Benali</p>
                          <p>{scenarioTriage.symptoms}</p>
                          <p>Temperature: {scenarioTriage.temperature}</p>
                        </div>
                      ) : (
                        <p>No new triage notes yet.</p>
                      )}
                    </div>
                  </Card>
                  <Card>
                    <SectionHeader title="Scenario step" subtitle="Finalize consultation" />
                    <p className="mt-3 text-sm text-slate-600">
                      Step 6: complete the consultation, issue prescription, and validate clinical decision.
                    </p>
                    <Button
                      className="mt-4"
                      size="sm"
                      onClick={() => {
                        if (!scenarioAppointment) return
                        finalizeConsultation(scenarioAppointment.id, consultationForm)
                        setSection('Consultations')
                      }}
                    >
                      Finalize scenario consultation
                    </Button>
                  </Card>
                </div>
              ) : null}

              {section === 'Appointment Calendar' ? (
                <Card>
                  <SectionHeader title="Appointment calendar" subtitle="List view" />
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {assignedAppointments.map((appointment) => (
                      <div key={appointment.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{appointment.reason}</p>
                            <p>
                              {appointment.preferredDate} • {appointment.timeSlot} •{' '}
                              {appointment.type === 'ON_SITE' ? 'On-site' : 'Teleconsultation'}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Start consultation
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null}

              {section === 'Patient Records' ? (
                <Card>
                  <SectionHeader title="Patient record" subtitle="Student identity & history" />
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{student?.fullName}</p>
                      <p className="text-sm text-slate-600">Bac: {student?.bacRegistrationNumber}</p>
                      <p className="text-sm text-slate-600">Residence: {student?.residence}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Allergies: None reported</p>
                      <p className="text-sm text-slate-600">Chronic conditions: None</p>
                      <p className="text-sm text-slate-600">Last consultation: 2026-05-22</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {data.documents.map((doc) => (
                      <div key={doc.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <p className="text-sm font-semibold text-slate-900">{doc.title}</p>
                        <Badge tone={documentStatusTone[doc.status]}>{doc.status.replace('_', ' ')}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null}

              {section === 'Consultations' ? (
                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <Card>
                    <SectionHeader title="Consultation screen" subtitle="Clinical notes & diagnosis" />
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">Student: {student?.fullName}</p>
                      {scenarioTriage ? (
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <p className="font-semibold text-slate-900">Nurse triage notes</p>
                          <p>Temperature: {scenarioTriage.temperature}</p>
                          <p>Blood pressure: {scenarioTriage.bloodPressure}</p>
                          <p>Heart rate: {scenarioTriage.heartRate}</p>
                          <p>Symptoms: {scenarioTriage.symptoms}</p>
                          <p>Pain level: {scenarioTriage.painLevel}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-amber-600">Awaiting triage notes from nurse.</p>
                      )}
                    </div>
                    <div className="mt-4 grid gap-3">
                      <Field label="Diagnosis">
                        <TextInput
                          value={consultationForm.diagnosis}
                          onChange={(event) => setConsultationForm((prev) => ({ ...prev, diagnosis: event.target.value }))}
                        />
                      </Field>
                      <Field label="Clinical notes">
                        <TextArea
                          rows={4}
                          value={consultationForm.notes}
                          onChange={(event) => setConsultationForm((prev) => ({ ...prev, notes: event.target.value }))}
                        />
                      </Field>
                      <div className="grid gap-3 md:grid-cols-2">
                        <Field label="Medication">
                          <TextInput
                            value={consultationForm.medication}
                            onChange={(event) =>
                              setConsultationForm((prev) => ({ ...prev, medication: event.target.value }))
                            }
                          />
                        </Field>
                        <Field label="Dosage">
                          <TextInput
                            value={consultationForm.dosage}
                            onChange={(event) => setConsultationForm((prev) => ({ ...prev, dosage: event.target.value }))}
                          />
                        </Field>
                        <Field label="Duration">
                          <TextInput
                            value={consultationForm.duration}
                            onChange={(event) =>
                              setConsultationForm((prev) => ({ ...prev, duration: event.target.value }))
                            }
                          />
                        </Field>
                        <Field label="Instructions">
                          <TextInput
                            value={consultationForm.instructions}
                            onChange={(event) =>
                              setConsultationForm((prev) => ({ ...prev, instructions: event.target.value }))
                            }
                          />
                        </Field>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button
                        onClick={() => {
                          if (!scenarioAppointment) return
                          finalizeConsultation(scenarioAppointment.id, consultationForm)
                        }}
                      >
                        Save consultation
                      </Button>
                      <Button variant="outline">Generate certificate</Button>
                      <Button variant="outline">Create referral</Button>
                    </div>
                  </Card>

                  <Card>
                    <SectionHeader title="Consultation summary" subtitle="Decision validation" />
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      <p>Decision: {consultationForm.diagnosis}</p>
                      <Badge tone="emerald">Clinical decision validated</Badge>
                      <Button size="sm" variant="outline">
                        Issue digital prescription
                      </Button>
                    </div>
                  </Card>
                </div>
              ) : null}

              {section === 'Teleconsultations' ? (
                <Card>
                  <SectionHeader title="Teleconsultations" subtitle="Approved sessions" />
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {data.teleconsultations.map((tele) => (
                      <div key={tele.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <p className="font-semibold text-slate-900">{tele.reason}</p>
                        <p>{tele.symptoms}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <Badge tone={tele.status === 'APPROVED' ? 'emerald' : 'amber'}>{tele.status}</Badge>
                          <Button size="sm">Join session</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null}

              {section === 'Prescriptions' ? (
                <Card>
                  <SectionHeader title="Digital prescriptions" subtitle="Issued to pharmacy" />
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {doctorPrescriptions.map((prescription) => (
                      <div key={prescription.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <p className="font-semibold text-slate-900">{prescription.medication}</p>
                        <p className="text-sm text-slate-600">{prescription.dosage}</p>
                        <Badge tone={prescriptionStatusTone[prescription.status]}>{prescription.status}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null}

              {section === 'Referrals' ? (
                <Card>
                  <SectionHeader title="Referral creation" subtitle="External hospital / specialist" />
                  <div className="mt-4 grid gap-3">
                    <Field label="Referral reason">
                      <TextInput placeholder="Specialist consultation" />
                    </Field>
                    <Field label="Urgency">
                      <Select>
                        <option>Normal</option>
                        <option>Urgent</option>
                        <option>Emergency</option>
                      </Select>
                    </Field>
                    <Field label="Notes">
                      <TextArea rows={3} />
                    </Field>
                    <Button>Generate referral document</Button>
                  </div>
                </Card>
              ) : null}

              {section === 'Medical Certificates' ? (
                <Card>
                  <SectionHeader title="Medical certificates" subtitle="Generate student certificates" />
                  <div className="mt-4 grid gap-3">
                    <Field label="Certificate type">
                      <Select>
                        <option>Medical rest certificate</option>
                        <option>Vaccination confirmation</option>
                        <option>Fitness confirmation</option>
                      </Select>
                    </Field>
                    <Field label="Notes">
                      <TextArea rows={3} />
                    </Field>
                    <Button>Generate certificate</Button>
                  </div>
                </Card>
              ) : null}

              {section === 'Reports' ? (
                <Card>
                  <SectionHeader title="Reports" subtitle="Clinical activity" />
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>Consultations completed this month: {data.consultations.length}</p>
                    <p>Teleconsultations handled: {data.teleconsultations.length}</p>
                    <p>Referrals issued: 3</p>
                  </div>
                </Card>
              ) : null}
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {section === 'Dashboard' ? (
                <div className="grid gap-4 lg:grid-cols-3">
                  <Card>
                    <SectionHeader title="Pending appointment requests" />
                    <p className="mt-3 text-3xl font-semibold text-slate-900">{pendingAppointments.length}</p>
                  </Card>
                  <Card>
                    <SectionHeader title="Walk-in queue" />
                    <p className="mt-3 text-3xl font-semibold text-slate-900">3</p>
                  </Card>
                  <Card>
                    <SectionHeader title="Documents pending" />
                    <p className="mt-3 text-3xl font-semibold text-slate-900">
                      {data.documents.filter((doc) => doc.status === 'PENDING').length}
                    </p>
                  </Card>
                  <Card className="lg:col-span-2">
                    <SectionHeader title="Scenario step" subtitle="Validate appointment and triage" />
                    <p className="mt-3 text-sm text-slate-600">
                      Step 4 & 5: validate the appointment and record triage for Yacine Benali.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button
                        size="sm"
                        onClick={() => {
                          if (!scenarioAppointment) return
                          validateAppointment(scenarioAppointment.id, {
                            priority: 'NORMAL',
                            doctorId: 'med-001',
                          })
                          setSection('Appointment Queue')
                        }}
                      >
                        Validate scenario appointment
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (!scenarioAppointment) return
                          recordTriage(scenarioAppointment.id, triageForm)
                          setSection('Triage')
                        }}
                      >
                        Save scenario triage
                      </Button>
                    </div>
                  </Card>
                  <Card>
                    <SectionHeader title="Low stock alerts" />
                    <p className="mt-3 text-3xl font-semibold text-slate-900">
                      {data.stockItems.filter((item) => item.status === 'LOW').length}
                    </p>
                  </Card>
                </div>
              ) : null}

              {section === 'Appointment Queue' ? (
                <Card>
                  <SectionHeader title="Appointment queue" subtitle="Validate requests" />
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {pendingAppointments.map((appointment) => (
                      <div key={appointment.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{appointment.reason}</p>
                            <p>Student ID: {appointment.studentId}</p>
                            <p>
                              {appointment.preferredDate} • {appointment.timeSlot}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select defaultValue="NORMAL">
                              <option value="NORMAL">Normal</option>
                              <option value="URGENT">Urgent</option>
                              <option value="EMERGENCY">Emergency</option>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() =>
                                validateAppointment(appointment.id, { priority: 'NORMAL', doctorId: 'med-001' })
                              }
                            >
                              Validate & assign
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null}

              {section === 'Walk-in Registration' ? (
                <Card>
                  <SectionHeader title="Walk-in registration" subtitle="Add patient to queue" />
                  <div className="mt-4 grid gap-3">
                    <Field label="Bac registration number">
                      <TextInput placeholder="12345678" />
                    </Field>
                    <Field label="Reason">
                      <Select>
                        <option>General consultation</option>
                        <option>Dental care</option>
                        <option>Vaccination</option>
                      </Select>
                    </Field>
                    <Field label="Initial notes">
                      <TextArea rows={3} />
                    </Field>
                    <Button>Add to queue</Button>
                  </div>
                </Card>
              ) : null}

              {section === 'Triage' ? (
                <Card>
                  <SectionHeader title="Pre-consultation triage" subtitle="Capture vital signs" />
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <Field label="Temperature">
                      <TextInput
                        value={triageForm.temperature}
                        onChange={(event) => setTriageForm((prev) => ({ ...prev, temperature: event.target.value }))}
                      />
                    </Field>
                    <Field label="Blood pressure">
                      <TextInput
                        value={triageForm.bloodPressure}
                        onChange={(event) => setTriageForm((prev) => ({ ...prev, bloodPressure: event.target.value }))}
                      />
                    </Field>
                    <Field label="Heart rate">
                      <TextInput
                        value={triageForm.heartRate}
                        onChange={(event) => setTriageForm((prev) => ({ ...prev, heartRate: event.target.value }))}
                      />
                    </Field>
                    <Field label="Pain level">
                      <TextInput
                        value={triageForm.painLevel}
                        onChange={(event) => setTriageForm((prev) => ({ ...prev, painLevel: event.target.value }))}
                      />
                    </Field>
                    <Field label="Symptoms">
                      <TextArea
                        rows={3}
                        value={triageForm.symptoms}
                        onChange={(event) => setTriageForm((prev) => ({ ...prev, symptoms: event.target.value }))}
                      />
                    </Field>
                    <Field label="Notes">
                      <TextArea
                        rows={3}
                        value={triageForm.notes}
                        onChange={(event) => setTriageForm((prev) => ({ ...prev, notes: event.target.value }))}
                      />
                    </Field>
                  </div>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      if (!scenarioAppointment) return
                      recordTriage(scenarioAppointment.id, triageForm)
                    }}
                  >
                    Save triage notes
                  </Button>
                </Card>
              ) : null}

              {section === 'Document Verification' ? (
                <Card>
                  <SectionHeader title="Document verification" subtitle="Review student uploads" />
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {data.documents.map((doc) => (
                      <div key={doc.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <p className="font-semibold text-slate-900">{doc.title}</p>
                        <Badge tone={documentStatusTone[doc.status]}>{doc.status.replace('_', ' ')}</Badge>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => updateDocumentStatus(doc.id, 'VERIFIED')}>
                            Verify
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => updateDocumentStatus(doc.id, 'REJECTED')}>
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDocumentStatus(doc.id, 'NEEDS_CLARIFICATION')}
                          >
                            Needs clarification
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null}

              {section === 'Prescription Dispensing' ? (
                <Card>
                  <SectionHeader title="Prescription dispensing" subtitle="Finalize medication pickup" />
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {readyPrescriptions.map((prescription) => (
                      <div key={prescription.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{prescription.medication}</p>
                            <p>{prescription.dosage}</p>
                            <Badge tone={prescriptionStatusTone[prescription.status]}>{prescription.status}</Badge>
                          </div>
                          <Button size="sm" onClick={() => dispensePrescription(prescription.id, staff.id)}>
                            Mark dispensed
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null}

              {section === 'Stock & Equipment' ? (
                <Card>
                  <SectionHeader title="Stock & equipment" subtitle="Inventory overview" />
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {data.stockItems.map((item) => (
                      <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{item.name}</p>
                            <p>Qty: {item.quantity}</p>
                            <p>Expiry: {item.expiryDate}</p>
                          </div>
                          <Badge tone={item.status === 'LOW' ? 'amber' : 'emerald'}>{item.status}</Badge>
                        </div>
                        <Button size="sm" variant="outline" className="mt-2">
                          Request replenishment
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null}

              {section === 'Patient Orientation' ? (
                <Card>
                  <SectionHeader title="Patient orientation" subtitle="Guidance for students" />
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>Provide directions to consultation room.</li>
                    <li>Share estimated waiting time.</li>
                    <li>Explain prescription pickup workflow.</li>
                  </ul>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" disabled title="Doctor authorization required">
                      Issue final diagnosis (restricted)
                    </Button>
                  </div>
                </Card>
              ) : null}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
