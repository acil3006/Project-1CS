import {
  Activity,
  AlertTriangle,
  Bell,
  Boxes,
  Calendar,
  Check,
  ClipboardCheck,
  ClipboardList,
  FileText,
  HeartPulse,
  Home,
  LogOut,
  Navigation,
  Pill,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Stethoscope,
  User,
  UserCheck,
  Video
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../app/AppState";
import {
  DOCTOR_ID,
  SCENARIO_APPOINTMENT_ID,
  SCENARIO_PRESCRIPTION_ID,
  SCENARIO_TRIAGE_ID,
  STUDENT_ID
} from "../../data/mockData";
import { canDispense, documentNeedsReview, formatDate } from "../../utils/status";
import { Badge } from "../common/Badge";
import { Card, CardHeader } from "../common/Card";
import { DemoGuide } from "../common/DemoGuide";
import { StatCard } from "../common/StatCard";

type MedicalView =
  | "dashboard"
  | "calendar"
  | "records"
  | "consultations"
  | "teleconsultations"
  | "prescriptions"
  | "referrals"
  | "certificates"
  | "reports"
  | "queue"
  | "walkin"
  | "triage"
  | "documents"
  | "dispensing"
  | "stock"
  | "orientation";

export function MedicalPlatform() {
  const { data, session, logout } = useApp();
  const navigate = useNavigate();
  const [view, setView] = useState<MedicalView>("dashboard");
  const role = session?.role === "DOCTOR" ? "DOCTOR" : "NURSE";
  const staff = data.medicalStaff.find((item) => item.id === session?.userId) ?? data.medicalStaff[0];

  const doctorNav = [
    ["dashboard", "Dashboard", Home],
    ["calendar", "Appointment Calendar", Calendar],
    ["records", "Patient Records", User],
    ["consultations", "Consultations", ClipboardCheck],
    ["teleconsultations", "Teleconsultations", Video],
    ["prescriptions", "Prescriptions", Pill],
    ["referrals", "Referrals", Navigation],
    ["certificates", "Medical Certificates", FileText],
    ["reports", "Reports", Activity]
  ] as const;

  const nurseNav = [
    ["dashboard", "Dashboard", Home],
    ["queue", "Appointment Queue", ClipboardList],
    ["walkin", "Walk-in Registration", Plus],
    ["triage", "Triage", HeartPulse],
    ["documents", "Document Verification", FileText],
    ["dispensing", "Prescription Dispensing", Pill],
    ["stock", "Stock & Equipment", Boxes],
    ["orientation", "Patient Orientation", Send]
  ] as const;

  const navItems = role === "DOCTOR" ? doctorNav : nurseNav;

  const signOut = () => {
    logout();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-aethera-line bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-aethera-pale p-2 text-aethera-blue">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold text-aethera-ink">EduSihha</p>
              <p className="text-xs font-semibold text-slate-500">Medical staff platform</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <p className="font-bold text-aethera-ink">{staff.fullName}</p>
            <p className="mt-1 text-sm text-slate-500">{staff.specialty}</p>
            <div className="mt-3">
              <Badge tone={role === "DOCTOR" ? "blue" : "green"}>{role === "DOCTOR" ? "Doctor permissions" : "Nurse permissions"}</Badge>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {navItems.map(([id, label, Icon]) => (
              <button
                key={id}
                className={`nav-item w-full ${view === id ? "nav-item-active" : ""}`}
                onClick={() => setView(id as MedicalView)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-10 border-b border-aethera-line bg-white/95 px-5 py-4 backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-aethera-cyan">
                  Cité Universitaire Ben Aknoun health unit
                </p>
                <h1 className="text-2xl font-bold text-aethera-ink">
                  {role === "DOCTOR" ? "Doctor clinical workspace" : "Nurse operations workspace"}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="relative min-w-[260px]">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input className="input pl-9" placeholder="Search patient by BAC, name, or health record" />
                </label>
                <button className="btn-secondary">
                  <Bell className="h-4 w-4" /> 4
                </button>
                <button className="btn-ghost" onClick={signOut}>
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            </div>
          </header>

          <div className="grid gap-5 p-5 xl:grid-cols-[1fr_280px]">
            <div className="space-y-5">
              {role === "DOCTOR" ? <DoctorWorkspace view={view} setView={setView} /> : <NurseWorkspace view={view} setView={setView} />}
            </div>
            <DemoGuide />
          </div>
        </section>
      </div>
    </main>
  );
}

function DoctorWorkspace({ view, setView }: { view: MedicalView; setView: (view: MedicalView) => void }) {
  const { data, finalizeScenarioConsultation } = useApp();
  const student = data.students.find((item) => item.id === STUDENT_ID)!;
  const appointments = data.appointments.filter((item) => item.assignedDoctorId === DOCTOR_ID || item.id === SCENARIO_APPOINTMENT_ID);
  const scenarioAppointment = data.appointments.find((item) => item.id === SCENARIO_APPOINTMENT_ID);
  const triage = data.triages.find((item) => item.id === SCENARIO_TRIAGE_ID);
  const prescription = data.prescriptions.find((item) => item.id === SCENARIO_PRESCRIPTION_ID);
  const teleconsultations = data.appointments.filter((item) => item.type === "TELECONSULTATION");

  if (view === "dashboard") {
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Today's appointments" value={appointments.length} icon={Calendar} detail="Calendar and queue merged through API gateway" />
          <StatCard label="Pending consultations" value={appointments.filter((item) => item.status !== "COMPLETED").length} icon={ClipboardCheck} tone="amber" />
          <StatCard label="Teleconsultations" value={teleconsultations.length} icon={Video} tone="green" />
          <StatCard label="Prescriptions to review" value={prescription?.status === "ISSUED" ? 1 : 0} icon={Pill} tone="blue" />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <AppointmentTable appointments={appointments} onStart={() => setView("consultations")} />
          <Card>
            <CardHeader title="Alerts from nurses" subtitle="Triage and preparation notes" />
            {triage ? (
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="font-bold text-amber-900">Triage ready for Yacine Benali</p>
                <p className="mt-1 text-sm text-amber-800">
                  {triage.temperature}, BP {triage.bloodPressure}, HR {triage.heartRate}. Symptoms: {triage.symptoms}.
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No triage note for the scenario yet.</p>
            )}
          </Card>
        </div>
        <PatientRecord compact />
      </>
    );
  }

  if (view === "calendar") {
    return <AppointmentTable appointments={appointments} onStart={() => setView("consultations")} />;
  }

  if (view === "records") {
    return <PatientRecord />;
  }

  if (view === "consultations") {
    return (
      <Card>
        <CardHeader
          title="Consultation screen"
          subtitle="Diagnosis and final prescription are restricted to doctor authorization"
          action={<Badge tone="blue">Clinical decision validation</Badge>}
        />
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="label">Patient summary</p>
              <h3 className="mt-1 text-lg font-bold text-aethera-ink">{student.fullName}</h3>
              <p className="text-sm text-slate-500">{student.healthRecordId} · {student.residence}</p>
              <p className="mt-3 text-sm text-slate-600">
                Appointment: {scenarioAppointment?.reason ?? "No scenario appointment yet"} · Symptoms:{" "}
                {scenarioAppointment?.symptoms ?? "Not captured"}
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="font-bold text-blue-900">Nurse triage notes</p>
              {triage ? (
                <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-blue-700">Temperature</dt><dd className="font-bold">{triage.temperature}</dd></div>
                  <div><dt className="text-blue-700">Blood pressure</dt><dd className="font-bold">{triage.bloodPressure}</dd></div>
                  <div><dt className="text-blue-700">Heart rate</dt><dd className="font-bold">{triage.heartRate}</dd></div>
                  <div><dt className="text-blue-700">Pain level</dt><dd className="font-bold">{triage.painLevel}/10</dd></div>
                  <div className="col-span-2"><dt className="text-blue-700">Notes</dt><dd className="font-bold">{triage.notes}</dd></div>
                </dl>
              ) : (
                <p className="mt-2 text-sm text-blue-800">Triage has not been saved yet.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="label">Diagnosis</span>
              <input className="input mt-2" defaultValue="Seasonal flu suspicion" />
            </label>
            <label className="block">
              <span className="label">Clinical notes</span>
              <textarea
                className="input mt-2 min-h-28"
                defaultValue="Rest, hydration, fever monitoring. Return if symptoms persist beyond 72 hours."
              />
            </label>
            <div className="grid gap-3 md:grid-cols-3">
              <button className="btn-secondary">
                <Pill className="h-4 w-4" /> Add prescription
              </button>
              <button className="btn-secondary">
                <Navigation className="h-4 w-4" /> Add referral
              </button>
              <button className="btn-secondary">
                <FileText className="h-4 w-4" /> Generate certificate
              </button>
            </div>
            <div className="rounded-lg border border-aethera-line bg-slate-50 p-4">
              <p className="font-bold text-aethera-ink">Prescription draft</p>
              <p className="mt-1 text-sm text-slate-600">Paracetamol 500mg · 1 tablet every 8 hours · Duration: 3 days</p>
            </div>
            <button className="btn-primary w-full" onClick={finalizeScenarioConsultation}>
              <Check className="h-4 w-4" /> Save consultation and validate clinical decision
            </button>
          </div>
        </div>
      </Card>
    );
  }

  if (view === "teleconsultations") {
    return (
      <Card>
        <CardHeader title="Teleconsultation sessions" subtitle="Remote sessions approved by staff and visible to students" />
        <div className="space-y-3">
          {teleconsultations.map((appointment) => (
            <div key={appointment.id} className="rounded-lg border border-aethera-line bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-aethera-ink">{student.fullName} · {appointment.reason}</p>
                  <p className="text-sm text-slate-500">{formatDate(appointment.preferredDate)} at {appointment.timeSlot}</p>
                </div>
                <button className="btn-primary">
                  <Video className="h-4 w-4" /> Join session
                </button>
              </div>
              <textarea className="input mt-3 min-h-20" placeholder="Remote consultation notes" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (view === "prescriptions") {
    return (
      <Card>
        <CardHeader title="Digital prescription" subtitle="Doctor-issued prescription becomes available to nurse dispensing workflow" />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="label">Medication</span>
            <select className="input mt-2" defaultValue="Paracetamol 500mg">
              <option>Paracetamol 500mg</option>
              <option>Amoxicillin 500mg</option>
              <option>Vitamin D3</option>
            </select>
          </label>
          <label className="block">
            <span className="label">Dosage</span>
            <input className="input mt-2" defaultValue="1 tablet every 8 hours" />
          </label>
          <label className="block">
            <span className="label">Duration</span>
            <input className="input mt-2" defaultValue="3 days" />
          </label>
          <label className="block">
            <span className="label">Instructions</span>
            <input className="input mt-2" defaultValue="Take after meals. Monitor fever." />
          </label>
        </div>
        <button className="btn-primary mt-4" onClick={finalizeScenarioConsultation}>Submit prescription</button>
        {prescription ? (
          <div className="mt-4 rounded-lg bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-aethera-ink">{prescription.medication}</p>
              <Badge status={prescription.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">{prescription.dosage} · {prescription.duration}</p>
          </div>
        ) : null}
      </Card>
    );
  }

  if (view === "referrals") {
    return (
      <Card>
        <CardHeader title="Referral creation" subtitle="Generate referral document mock for external hospital or specialist" />
        <div className="grid gap-4 md:grid-cols-2">
          <input className="input" defaultValue="Mustapha Pacha University Hospital" />
          <select className="input" defaultValue="Normal">
            <option>Normal</option>
            <option>Urgent</option>
            <option>Emergency</option>
          </select>
        </div>
        <textarea className="input mt-4 min-h-28" defaultValue="Referral not required for current flu suspicion; use for specialist escalation." />
        <button className="btn-secondary mt-4">Generate referral document mock</button>
      </Card>
    );
  }

  if (view === "certificates") {
    return (
      <Card>
        <CardHeader title="Medical certificates" subtitle="Doctor-generated certificates become student documents" />
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="font-bold text-aethera-ink">Consultation summary - seasonal flu suspicion</p>
          <p className="text-sm text-slate-500">Generated after finalizing consultation. Visible in Al-Talib health documents.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Doctor reports" subtitle="Clinical workload, prescriptions issued, and consultation traceability" />
      <SimpleBars
        values={[
          ["General", 64],
          ["Dental", 21],
          ["Psychological", 34],
          ["Vaccination", 18],
          ["Certificate", 27]
        ]}
      />
    </Card>
  );
}

function NurseWorkspace({ view, setView }: { view: MedicalView; setView: (view: MedicalView) => void }) {
  const {
    data,
    validateScenarioAppointment,
    saveScenarioTriage,
    dispenseScenarioPrescription,
    verifyDocument,
    requestReplenishment
  } = useApp();
  const [walkInSaved, setWalkInSaved] = useState(false);
  const student = data.students.find((item) => item.id === STUDENT_ID)!;
  const pendingAppointments = data.appointments.filter((item) => item.status === "PENDING");
  const scenarioAppointment = data.appointments.find((item) => item.id === SCENARIO_APPOINTMENT_ID);
  const prescriptions = data.prescriptions.filter((item) => canDispense(item.status));
  const pendingDocuments = data.documents.filter((item) => documentNeedsReview(item.status));
  const triage = data.triages.find((item) => item.id === SCENARIO_TRIAGE_ID);

  if (view === "dashboard") {
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Requests to validate" value={pendingAppointments.length} icon={ClipboardList} tone="amber" />
          <StatCard label="Walk-in queue" value={walkInSaved ? 1 : 0} icon={Plus} />
          <StatCard label="Triage tasks" value={scenarioAppointment && scenarioAppointment.status !== "COMPLETED" ? 1 : 0} icon={HeartPulse} tone="green" />
          <StatCard label="Low stock alerts" value={data.stockItems.filter((item) => item.quantity <= item.threshold).length} icon={AlertTriangle} tone="rose" />
        </div>
        <Card>
          <CardHeader title="Nurse permissions" subtitle="Assists workflow without final clinical authority" />
          <div className="grid gap-3 md:grid-cols-3">
            <Permission label="Validate appointment" allowed />
            <Permission label="Capture vital signs" allowed />
            <Permission label="Verify documents" allowed />
            <Permission label="Create final diagnosis" />
            <Permission label="Issue prescription independently" />
            <Permission label="Generate final referral" />
          </div>
        </Card>
      </>
    );
  }

  if (view === "queue") {
    return (
      <Card>
        <CardHeader title="Appointment queue" subtitle="Validate requests and assign doctor/priority" />
        <div className="space-y-3">
          {(pendingAppointments.length ? pendingAppointments : scenarioAppointment ? [scenarioAppointment] : []).map((appointment) => (
            <div key={appointment.id} className="rounded-lg border border-aethera-line bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-aethera-ink">{student.fullName} · {appointment.reason}</p>
                  <p className="text-sm text-slate-500">{appointment.symptoms} · {formatDate(appointment.preferredDate)} at {appointment.timeSlot}</p>
                </div>
                <Badge status={appointment.status} />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <select className="input" defaultValue="NORMAL">
                  <option value="NORMAL">Normal</option>
                  <option value="URGENT">Urgent</option>
                  <option value="EMERGENCY">Emergency</option>
                </select>
                <select className="input" defaultValue={DOCTOR_ID}>
                  <option value={DOCTOR_ID}>Dr. Samir Haddad</option>
                </select>
                <button className="btn-primary" onClick={() => validateScenarioAppointment()}>
                  <UserCheck className="h-4 w-4" /> Validate
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="btn-secondary" disabled title="Doctor authorization required">
                  Final diagnosis
                </button>
                <button className="btn-secondary" disabled title="Doctor authorization required">
                  Issue prescription
                </button>
              </div>
            </div>
          ))}
          {!pendingAppointments.length && !scenarioAppointment ? (
            <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-700">Ask the student to book the scenario appointment first.</p>
          ) : null}
        </div>
      </Card>
    );
  }

  if (view === "walkin") {
    return (
      <Card>
        <CardHeader title="Walk-in registration" subtitle="Register student arriving without appointment" />
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="label">BAC registration number</span>
            <input className="input mt-2" defaultValue="12345678" />
          </label>
          <label>
            <span className="label">Reason</span>
            <select className="input mt-2" defaultValue="Emergency follow-up">
              <option>General consultation</option>
              <option>Emergency follow-up</option>
              <option>Medical certificate</option>
            </select>
          </label>
        </div>
        <textarea className="input mt-4 min-h-24" defaultValue="Student arrived at the Ben Aknoun health unit with fever symptoms." />
        <button className="btn-primary mt-4" onClick={() => setWalkInSaved(true)}>Add to queue</button>
        {walkInSaved ? <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">Walk-in added to queue.</p> : null}
      </Card>
    );
  }

  if (view === "triage") {
    return (
      <Card>
        <CardHeader title="Pre-consultation triage" subtitle="Capture vital signs and send to doctor" />
        <div className="grid gap-4 md:grid-cols-3">
          <label><span className="label">Temperature</span><input className="input mt-2" defaultValue="38.2°C" /></label>
          <label><span className="label">Blood pressure</span><input className="input mt-2" defaultValue="120/80" /></label>
          <label><span className="label">Heart rate</span><input className="input mt-2" defaultValue="92 bpm" /></label>
          <label className="md:col-span-2"><span className="label">Symptoms</span><input className="input mt-2" defaultValue="fever, headache, fatigue" /></label>
          <label><span className="label">Pain level</span><input className="input mt-2" defaultValue="4/10" /></label>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-600">
          <input type="checkbox" className="h-4 w-4" /> Emergency flag
        </label>
        <textarea className="input mt-4 min-h-24" defaultValue="Stable student. Hydration advised while waiting for doctor consultation." />
        <button className="btn-primary mt-4" onClick={saveScenarioTriage}>
          <Send className="h-4 w-4" /> Save triage notes and send to doctor
        </button>
        {triage ? <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">Triage visible to Dr. Samir Haddad.</p> : null}
      </Card>
    );
  }

  if (view === "documents") {
    return (
      <Card>
        <CardHeader title="Document verification" subtitle="Review uploaded student health documents" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-3">Document</th>
                <th>Status</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.documents.map((document) => (
                <tr key={document.id} className="border-b border-slate-100">
                  <td className="py-3 font-semibold text-aethera-ink">{document.title}</td>
                  <td><Badge status={document.status} /></td>
                  <td className="text-slate-500">{document.comment ?? "No comment"}</td>
                  <td className="space-x-2">
                    <button className="btn-secondary px-3 py-1" onClick={() => verifyDocument(document.id, "VERIFIED", "Verified by nurse.")}>Verify</button>
                    <button className="btn-secondary px-3 py-1" onClick={() => verifyDocument(document.id, "NEEDS_CLARIFICATION", "Please upload a clearer copy.")}>Clarify</button>
                    <button className="btn-secondary px-3 py-1" onClick={() => verifyDocument(document.id, "REJECTED", "Document rejected after review.")}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-500">{pendingDocuments.length} document(s) currently need nurse review.</p>
      </Card>
    );
  }

  if (view === "dispensing") {
    return (
      <Card>
        <CardHeader title="Prescription dispensing" subtitle="Dispense prescriptions issued by doctors and update stock" />
        <div className="space-y-3">
          {prescriptions.length ? prescriptions.map((prescription) => (
            <div key={prescription.id} className="rounded-lg border border-aethera-line bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-aethera-ink">{prescription.medication}</p>
                  <p className="text-sm text-slate-500">{prescription.dosage} · {prescription.duration} · {prescription.doctorName}</p>
                </div>
                <Badge status={prescription.status} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Badge tone="green">Stock available</Badge>
                <button className="btn-primary" onClick={dispenseScenarioPrescription}>
                  <Check className="h-4 w-4" /> Mark as dispensed
                </button>
              </div>
            </div>
          )) : (
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
              No doctor-issued prescription is waiting. Finalize the doctor consultation to create the scenario prescription.
            </p>
          )}
        </div>
        <AuditPreview />
      </Card>
    );
  }

  if (view === "stock") {
    return (
      <Card>
        <CardHeader title="Stock & equipment" subtitle="Visibility for pharmaceutical stock and medical equipment" />
        <div className="grid gap-5 xl:grid-cols-2">
          <InventoryTable onReplenish={requestReplenishment} />
          <EquipmentTable />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Patient orientation" subtitle="Route students to the right doctor, service, or emergency pathway" />
      <div className="grid gap-3 md:grid-cols-3">
        <button className="btn-secondary">Send to doctor</button>
        <button className="btn-secondary">Send to documents desk</button>
        <button className="btn-secondary">Send to emergency follow-up</button>
      </div>
      <div className="mt-4 rounded-lg bg-rose-50 p-4">
        <p className="font-bold text-rose-800">Restricted clinical actions</p>
        <p className="mt-1 text-sm text-rose-700">Final diagnosis, independent prescription, and final referral require doctor authorization.</p>
      </div>
    </Card>
  );
}

function AppointmentTable({
  appointments,
  onStart
}: {
  appointments: { id: string; reason: string; preferredDate: string; timeSlot: string; type: string; status: string }[];
  onStart: () => void;
}) {
  const student = "Yacine Benali";
  return (
    <Card>
      <CardHeader title="Appointment calendar" subtitle="Calendar/list view of assigned consultations" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="py-3">Student</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-b border-slate-100">
                <td className="py-3 font-semibold text-aethera-ink">{student}</td>
                <td>{appointment.reason}</td>
                <td>{formatDate(appointment.preferredDate)} · {appointment.timeSlot}</td>
                <td>{appointment.type === "ON_SITE" ? "On-site" : "Teleconsultation"}</td>
                <td><Badge status={appointment.status} /></td>
                <td>
                  <button className="btn-secondary px-3 py-1" onClick={onStart}>Start consultation</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function PatientRecord({ compact = false }: { compact?: boolean }) {
  const { data } = useApp();
  const student = data.students.find((item) => item.id === STUDENT_ID)!;
  const documents = data.documents.filter((item) => item.studentId === STUDENT_ID);
  const prescriptions = data.prescriptions.filter((item) => item.studentId === STUDENT_ID);
  const consultations = data.consultations.filter((item) => item.doctorId === DOCTOR_ID);

  return (
    <Card>
      <CardHeader title={compact ? "Recent patient record" : "Patient medical record"} subtitle="Authorized clinical record access" />
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="label">Identity & Patient Registry</p>
          <h3 className="mt-2 text-xl font-bold text-aethera-ink">{student.fullName}</h3>
          <p className="text-sm text-slate-500">{student.healthRecordId}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-slate-500">BAC</dt><dd className="font-semibold">{student.bacRegistrationNumber}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">University</dt><dd className="font-semibold">{student.university}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Residence</dt><dd className="font-semibold">{student.residence}</dd></div>
          </dl>
          <div className="mt-4 rounded-lg bg-white p-3 text-sm">
            <p className="font-bold text-aethera-ink">Allergies</p>
            <p className="text-slate-500">No known drug allergies</p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <RecordColumn title="Consultations" items={consultations.map((item) => `${item.diagnosis} · ${item.createdAt}`)} />
          <RecordColumn title="Documents" items={documents.map((item) => `${item.title} · ${item.status.replaceAll("_", " ")}`)} />
          <RecordColumn title="Prescriptions" items={prescriptions.map((item) => `${item.medication} · ${item.status}`)} />
        </div>
      </div>
    </Card>
  );
}

function RecordColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="font-bold text-aethera-ink">{title}</p>
      <div className="mt-3 space-y-2">
        {items.slice(0, 4).map((item) => (
          <p key={item} className="rounded-lg bg-slate-50 p-2 text-xs text-slate-600">{item}</p>
        ))}
      </div>
    </div>
  );
}

function Permission({ label, allowed = false }: { label: string; allowed?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${allowed ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
      <div className="flex items-center gap-2">
        {allowed ? <Check className="h-4 w-4 text-emerald-700" /> : <ShieldCheck className="h-4 w-4 text-rose-700" />}
        <p className={`text-sm font-semibold ${allowed ? "text-emerald-800" : "text-rose-800"}`}>{label}</p>
      </div>
      {!allowed ? <p className="mt-1 text-xs text-rose-700">Doctor authorization required</p> : null}
    </div>
  );
}

function InventoryTable({ onReplenish }: { onReplenish: (stockItemId: string) => void }) {
  const { data } = useApp();
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[560px] bg-white text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <th className="p-3">Drug</th>
            <th>Qty</th>
            <th>Expiry</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.stockItems.map((item) => (
            <tr key={item.id} className="border-b border-slate-100">
              <td className="p-3 font-semibold text-aethera-ink">{item.name}</td>
              <td>{item.quantity} / threshold {item.threshold}</td>
              <td>{formatDate(item.expiryDate)}</td>
              <td><Badge status={item.status} /></td>
              <td><button className="btn-secondary px-3 py-1" onClick={() => onReplenish(item.id)}>Request</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EquipmentTable() {
  const { data } = useApp();
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[520px] bg-white text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <th className="p-3">Equipment</th>
            <th>Residence</th>
            <th>Status</th>
            <th>Checked</th>
          </tr>
        </thead>
        <tbody>
          {data.equipment.map((item) => (
            <tr key={item.id} className="border-b border-slate-100">
              <td className="p-3 font-semibold text-aethera-ink">{item.name}</td>
              <td>{item.residence}</td>
              <td><Badge status={item.status} /></td>
              <td>{formatDate(item.lastChecked)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AuditPreview() {
  const { data } = useApp();
  return (
    <div className="mt-5 rounded-lg bg-slate-50 p-4">
      <p className="font-bold text-aethera-ink">Audit log preview</p>
      <div className="mt-3 space-y-2">
        {data.auditLogs.slice(0, 4).map((log) => (
          <p key={log.id} className="text-xs text-slate-600">
            <span className="font-semibold">{log.timestamp}</span> · {log.actor} · {log.action}
          </p>
        ))}
      </div>
    </div>
  );
}

function SimpleBars({ values }: { values: [string, number][] }) {
  return (
    <div className="space-y-3">
      {values.map(([label, value]) => (
        <div key={label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-semibold text-slate-700">{label}</span>
            <span className="text-slate-500">{value}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-aethera-blue" style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
