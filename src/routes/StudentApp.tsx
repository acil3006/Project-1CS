import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppContext } from '../app/AppContext'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Field, TextArea, TextInput } from '../components/common/Field'
import { SectionHeader } from '../components/common/SectionHeader'
import { Select } from '../components/common/Select'
import { appointmentStatusLabel, appointmentStatusTone, documentStatusTone, prescriptionStatusTone } from '../utils/status'
import type { Appointment, AppointmentType } from '../types'

const moduleCards = [
  { title: 'Accommodation', description: 'Residence requests, room swaps, and maintenance.', status: 'Available soon' },
  { title: 'Healthcare', description: 'Appointments, prescriptions, and teleconsultations.', status: 'Active module' },
  { title: 'Activities', description: 'Cultural, scientific, and sports registrations.', status: 'Available soon' },
]

const appointmentReasons = [
  'General consultation',
  'Dental care',
  'Psychological support',
  'Vaccination',
  'Medical certificate',
  'Emergency follow-up',
]

const timeSlots = ['08:30', '10:00', '11:30', '14:00', '15:30', '17:00']

const tabs = [
  { id: 'home', label: 'Healthcare Home' },
  { id: 'booking', label: 'Appointment Booking' },
  { id: 'tracking', label: 'Appointment Tracking' },
  { id: 'teleconsultation', label: 'Teleconsultation' },
  { id: 'documents', label: 'Health Documents' },
  { id: 'prescriptions', label: 'Prescriptions' },
  { id: 'campaigns', label: 'Prevention Campaigns' },
]

export function StudentApp() {
  const { student, data, logout, bookAppointment, requestTeleconsultation } = useAppContext()
  const [view, setView] = useState<'modules' | 'healthcare'>('modules')
  const [activeTab, setActiveTab] = useState('home')
  const [appointmentForm, setAppointmentForm] = useState({
    reason: 'General consultation',
    preferredDate: '2026-05-26',
    timeSlot: '10:00',
    type: 'ON_SITE' as AppointmentType,
    symptoms: 'Fever and headache',
  })
  const [appointmentConfirmation, setAppointmentConfirmation] = useState<Appointment | null>(null)
  const [teleForm, setTeleForm] = useState({
    reason: 'General consultation',
    symptoms: 'Fatigue and mild fever',
  })

  const studentAppointments = useMemo(() => {
    if (!student) return []
    return data.appointments.filter((appointment) => appointment.studentId === student.id)
  }, [data.appointments, student])

  const appointmentIds = useMemo(() => studentAppointments.map((appointment) => appointment.id), [studentAppointments])

  const studentConsultations = useMemo(() => {
    return data.consultations.filter((consultation) => appointmentIds.includes(consultation.appointmentId))
  }, [data.consultations, appointmentIds])

  const studentPrescriptions = useMemo(() => {
    const ids = new Set(studentConsultations.map((consultation) => consultation.prescriptionId).filter(Boolean))
    return data.prescriptions.filter((prescription) => ids.has(prescription.id))
  }, [data.prescriptions, studentConsultations])

  const studentDocuments = useMemo(() => {
    if (!student) return []
    return data.documents.filter((doc) => doc.studentId === student.id)
  }, [data.documents, student])

  const studentNotifications = useMemo(() => {
    if (!student) return []
    return data.notifications.filter((note) => note.studentId === student.id)
  }, [data.notifications, student])

  const studentTeleconsultations = useMemo(() => {
    if (!student) return []
    return data.teleconsultations.filter((item) => item.studentId === student.id)
  }, [data.teleconsultations, student])

  const nextAppointment = studentAppointments.find((item) => item.status !== 'COMPLETED')

  if (!student) {
    return <Navigate to="/login/student" replace />
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-600">Al-Talib Student App</p>
            <h1 className="text-2xl font-semibold text-slate-900">Welcome back, {student.fullName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone="blue">Authenticated</Badge>
            <Button variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="bg-slate-50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Student identity card</p>
              <Badge tone="emerald">Active</Badge>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-slate-900">{student.fullName}</p>
                <p>Bac: {student.bacRegistrationNumber}</p>
                <p>Date of birth: {student.dateOfBirth}</p>
              </div>
              <div>
                <p>University: {student.university}</p>
                <p>Residence: {student.residence}</p>
                <p>Health record: {student.healthRecordId}</p>
              </div>
            </div>
          </Card>

          <Card>
            <SectionHeader title="Guided scenario" subtitle="Follow the demo flow across roles" />
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Step 3: Book an on-site consultation for fever & headache.</p>
              <Button
                size="sm"
                onClick={() => {
                  const appointment = bookAppointment({
                    reason: 'General consultation',
                    preferredDate: '2026-05-26',
                    timeSlot: '10:00',
                    type: 'ON_SITE',
                    symptoms: 'Fever and headache',
                  })
                  setAppointmentConfirmation(appointment)
                  setView('healthcare')
                  setActiveTab('tracking')
                }}
              >
                Trigger appointment request
              </Button>
              {appointmentConfirmation ? (
                <p className="text-xs text-emerald-600">
                  Appointment {appointmentConfirmation.id} created and awaiting validation.
                </p>
              ) : null}
            </div>
          </Card>
        </div>

        <Card className="bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <Button variant={view === 'modules' ? 'primary' : 'outline'} onClick={() => setView('modules')}>
                Modules
              </Button>
              <Button variant={view === 'healthcare' ? 'primary' : 'outline'} onClick={() => setView('healthcare')}>
                Healthcare
              </Button>
            </div>
            <Badge tone="indigo">Mobile-first interface</Badge>
          </div>

          {view === 'modules' ? (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {moduleCards.map((module) => (
                <Card key={module.title} className="border-dashed">
                  <h3 className="text-lg font-semibold text-slate-900">{module.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{module.description}</p>
                  <div className="mt-4">
                    <Badge tone={module.title === 'Healthcare' ? 'emerald' : 'slate'}>{module.status}</Badge>
                  </div>
                  {module.title === 'Healthcare' ? (
                    <Button className="mt-4 w-full" onClick={() => setView('healthcare')}>
                      Open Healthcare
                    </Button>
                  ) : null}
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              {activeTab === 'home' ? (
                <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <Card>
                    <SectionHeader title="Next appointment" subtitle="Quick overview" />
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      {nextAppointment ? (
                        <>
                          <p className="font-semibold text-slate-900">{nextAppointment.reason}</p>
                          <p>
                            {nextAppointment.preferredDate} • {nextAppointment.timeSlot} •{' '}
                            {nextAppointment.type === 'ON_SITE' ? 'On-site' : 'Teleconsultation'}
                          </p>
                          <Badge tone={appointmentStatusTone[nextAppointment.status]}>
                            {appointmentStatusLabel[nextAppointment.status]}
                          </Badge>
                        </>
                      ) : (
                        <p>No upcoming appointments yet.</p>
                      )}
                    </div>
                  </Card>

                  <Card>
                    <SectionHeader title="Health alerts" subtitle="Latest wellness updates" />
                    <ul className="mt-4 space-y-3 text-sm text-slate-600">
                      <li>Flu symptoms reported across Ben Aknoun residence.</li>
                      <li>Remember to update your vaccination record before June 1st.</li>
                      <li>Emergency hotline 3030 available 24/7.</li>
                    </ul>
                  </Card>

                  <Card>
                    <SectionHeader title="Quick actions" />
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <Button variant="outline" onClick={() => setActiveTab('booking')}>
                        Book appointment
                      </Button>
                      <Button variant="outline" onClick={() => setActiveTab('teleconsultation')}>
                        Request teleconsultation
                      </Button>
                      <Button variant="outline" onClick={() => setActiveTab('documents')}>
                        Upload documents
                      </Button>
                      <Button variant="outline" onClick={() => setActiveTab('prescriptions')}>
                        View prescriptions
                      </Button>
                    </div>
                  </Card>

                  <Card>
                    <SectionHeader title="Recent notifications" />
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      {studentNotifications.slice(0, 3).map((note) => (
                        <div key={note.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <p className="font-semibold text-slate-900">{note.title}</p>
                          <p>{note.message}</p>
                          <p className="mt-1 text-xs text-slate-400">{note.timestamp}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ) : null}

              {activeTab === 'booking' ? (
                <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <Card>
                    <SectionHeader title="Book appointment" subtitle="Choose a reason, date, and time slot" />
                    <form
                      className="mt-4 grid gap-4"
                      onSubmit={(event) => {
                        event.preventDefault()
                        const appointment = bookAppointment({
                          reason: appointmentForm.reason,
                          symptoms: appointmentForm.symptoms,
                          preferredDate: appointmentForm.preferredDate,
                          timeSlot: appointmentForm.timeSlot,
                          type: appointmentForm.type,
                        })
                        setAppointmentConfirmation(appointment)
                        setActiveTab('tracking')
                      }}
                    >
                      <Field label="Reason for visit">
                        <Select
                          value={appointmentForm.reason}
                          onChange={(event) =>
                            setAppointmentForm((prev) => ({ ...prev, reason: event.target.value }))
                          }
                        >
                          {appointmentReasons.map((reason) => (
                            <option key={reason} value={reason}>
                              {reason}
                            </option>
                          ))}
                        </Select>
                      </Field>
                      <Field label="Preferred date">
                        <TextInput
                          type="date"
                          value={appointmentForm.preferredDate}
                          onChange={(event) =>
                            setAppointmentForm((prev) => ({ ...prev, preferredDate: event.target.value }))
                          }
                        />
                      </Field>
                      <Field label="Preferred time slot">
                        <Select
                          value={appointmentForm.timeSlot}
                          onChange={(event) => setAppointmentForm((prev) => ({ ...prev, timeSlot: event.target.value }))}
                        >
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </Select>
                      </Field>
                      <Field label="Consultation type">
                        <Select
                          value={appointmentForm.type}
                          onChange={(event) =>
                            setAppointmentForm((prev) => ({ ...prev, type: event.target.value as AppointmentType }))
                          }
                        >
                          <option value="ON_SITE">On-site</option>
                          <option value="TELECONSULTATION">Teleconsultation</option>
                        </Select>
                      </Field>
                      <Field label="Symptoms">
                        <TextArea
                          value={appointmentForm.symptoms}
                          onChange={(event) => setAppointmentForm((prev) => ({ ...prev, symptoms: event.target.value }))}
                          rows={4}
                        />
                      </Field>
                      <Button type="submit">Submit appointment request</Button>
                    </form>
                  </Card>

                  <Card>
                    <SectionHeader title="Confirmation" subtitle="Request status" />
                    {appointmentConfirmation ? (
                      <div className="mt-4 space-y-3 text-sm text-slate-600">
                        <p className="font-semibold text-slate-900">Request submitted successfully.</p>
                        <p>
                          Appointment ID: <span className="font-semibold">{appointmentConfirmation.id}</span>
                        </p>
                        <Badge tone="amber">Pending validation</Badge>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-slate-500">Submit the form to generate a request confirmation.</p>
                    )}
                  </Card>
                </div>
              ) : null}

              {activeTab === 'tracking' ? (
                <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <Card>
                    <SectionHeader title="Appointment tracking" subtitle="Live timeline" />
                    <div className="mt-4 space-y-4 text-sm text-slate-600">
                        {studentAppointments.length ? (
                          studentAppointments.map((appointment) => (
                            <div key={appointment.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-slate-900">{appointment.reason}</p>
                                  <p>
                                    {appointment.preferredDate} • {appointment.timeSlot}
                                  </p>
                                </div>
                                <Badge tone={appointmentStatusTone[appointment.status]}>
                                  {appointmentStatusLabel[appointment.status]}
                                </Badge>
                              </div>
                              <ol className="mt-3 space-y-2 text-xs text-slate-500">
                                <li>Request submitted</li>
                                <li className={appointment.status !== 'PENDING' ? 'text-emerald-600' : ''}>
                                  Validated by nurse
                                </li>
                                <li className={appointment.assignedDoctorId ? 'text-emerald-600' : ''}>
                                  Assigned to doctor
                                </li>
                                <li
                                  className={
                                    appointment.status === 'IN_PROGRESS' || appointment.status === 'COMPLETED'
                                      ? 'text-emerald-600'
                                      : ''
                                  }
                                >
                                  Consultation scheduled
                                </li>
                                <li className={appointment.status === 'COMPLETED' ? 'text-emerald-600' : ''}>
                                  Completed
                                </li>
                              </ol>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500">No appointment requests yet.</p>
                        )}
                      </div>
                    </Card>

                  <Card>
                    <SectionHeader title="Status legend" />
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <Badge tone="amber">Pending</Badge>
                      <Badge tone="blue">Confirmed</Badge>
                      <Badge tone="indigo">In progress</Badge>
                      <Badge tone="emerald">Completed</Badge>
                      <Badge tone="rose">Cancelled</Badge>
                    </div>
                  </Card>
                </div>
              ) : null}

              {activeTab === 'teleconsultation' ? (
                <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <Card>
                    <SectionHeader title="Teleconsultation request" subtitle="Submit your symptoms" />
                    <form
                      className="mt-4 grid gap-4"
                      onSubmit={(event) => {
                        event.preventDefault()
                        requestTeleconsultation({ reason: teleForm.reason, symptoms: teleForm.symptoms })
                        setTeleForm((prev) => ({ ...prev, symptoms: '' }))
                      }}
                    >
                      <Field label="Reason">
                        <Select value={teleForm.reason} onChange={(event) => setTeleForm((prev) => ({ ...prev, reason: event.target.value }))}>
                          {appointmentReasons.map((reason) => (
                            <option key={reason} value={reason}>
                              {reason}
                            </option>
                          ))}
                        </Select>
                      </Field>
                      <Field label="Symptoms">
                        <TextArea
                          rows={4}
                          value={teleForm.symptoms}
                          onChange={(event) => setTeleForm((prev) => ({ ...prev, symptoms: event.target.value }))}
                        />
                      </Field>
                      <Field label="Document upload">
                        <TextInput type="file" />
                      </Field>
                      <Button type="submit">Submit teleconsultation request</Button>
                    </form>
                  </Card>

                  <Card>
                    <SectionHeader title="My teleconsultations" />
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      {studentTeleconsultations.map((tele) => (
                        <div key={tele.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <p className="font-semibold text-slate-900">{tele.reason}</p>
                          <p>{tele.symptoms}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge tone={tele.status === 'APPROVED' ? 'emerald' : 'amber'}>{tele.status}</Badge>
                            {tele.status === 'APPROVED' ? (
                              <Button size="sm">Join session</Button>
                            ) : (
                              <span className="text-xs text-slate-400">Awaiting approval</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ) : null}

              {activeTab === 'documents' ? (
                <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <Card>
                    <SectionHeader title="Upload document" subtitle="Send documents for verification" />
                    <div className="mt-4 space-y-3">
                      <Field label="Document title">
                        <TextInput placeholder="Medical certificate" />
                      </Field>
                      <Field label="Upload file">
                        <TextInput type="file" />
                      </Field>
                      <Button>Upload document</Button>
                    </div>
                  </Card>

                  <Card>
                    <SectionHeader title="My health documents" />
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      {studentDocuments.map((doc) => (
                        <div key={doc.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <p className="font-semibold text-slate-900">{doc.title}</p>
                          <p className="text-xs text-slate-500">Uploaded: {doc.uploadedAt}</p>
                          <Badge tone={documentStatusTone[doc.status]}>{doc.status.replace('_', ' ')}</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ) : null}

              {activeTab === 'prescriptions' ? (
                <div className="mt-6 grid gap-4">
                  <Card>
                    <SectionHeader title="Digital prescriptions" subtitle="Track medication pickup" />
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {studentPrescriptions.map((prescription) => (
                        <div key={prescription.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <p className="font-semibold text-slate-900">{prescription.medication}</p>
                          <p className="text-sm text-slate-600">{prescription.dosage}</p>
                          <p className="text-sm text-slate-600">Duration: {prescription.duration}</p>
                          <p className="text-sm text-slate-600">{prescription.instructions}</p>
                          <div className="mt-2">
                            <Badge tone={prescriptionStatusTone[prescription.status]}>{prescription.status}</Badge>
                          </div>
                        </div>
                      ))}
                      {studentPrescriptions.length === 0 ? (
                        <p className="text-sm text-slate-500">No prescriptions available yet.</p>
                      ) : null}
                    </div>
                  </Card>
                </div>
              ) : null}

              {activeTab === 'campaigns' ? (
                <div className="mt-6 grid gap-4">
                  <Card>
                    <SectionHeader title="Prevention campaigns" subtitle="Regional health programs" />
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {data.campaigns.map((campaign) => (
                        <div key={campaign.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <p className="font-semibold text-slate-900">{campaign.title}</p>
                          <p className="text-sm text-slate-600">{campaign.type} • {campaign.target}</p>
                          <p className="text-xs text-slate-500">
                            {campaign.startDate} → {campaign.endDate}
                          </p>
                          <p className="mt-2 text-sm text-slate-600">{campaign.description}</p>
                          <Button size="sm" variant="outline" className="mt-3">
                            Register interest
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ) : null}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
