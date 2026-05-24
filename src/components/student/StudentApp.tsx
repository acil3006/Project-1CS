import {
  Activity,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  FileText,
  HeartPulse,
  Home,
  LogOut,
  Pill,
  ShieldCheck,
  Smartphone,
  Upload,
  Users,
  Video
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../app/AppState";
import { SCENARIO_APPOINTMENT_ID, STUDENT_ID } from "../../data/mockData";
import type { AppointmentStatus, AppointmentType } from "../../types";
import { appointmentProgress, formatDate } from "../../utils/status";
import { Badge } from "../common/Badge";
import { Card, CardHeader } from "../common/Card";
import { Timeline } from "../common/Timeline";

type StudentScreen = "modules" | "home" | "book" | "track" | "teleconsult" | "documents" | "prescriptions" | "campaigns";

const reasons = [
  "General consultation",
  "Dental care",
  "Psychological support",
  "Vaccination",
  "Medical certificate",
  "Emergency follow-up"
];

export function StudentApp() {
  const {
    data,
    session,
    logout,
    bookScenarioAppointment,
    registerCampaignInterest
  } = useApp();
  const navigate = useNavigate();
  const [screen, setScreen] = useState<StudentScreen>("modules");
  const [booking, setBooking] = useState({
    reason: "General consultation",
    symptoms: "fever and headache",
    preferredDate: "2026-05-25",
    timeSlot: "09:00",
    type: "ON_SITE" as AppointmentType
  });
  const [teleconsultSubmitted, setTeleconsultSubmitted] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const student = data.students.find((item) => item.id === session?.userId) ?? data.students[0];
  const studentAppointments = data.appointments.filter((item) => item.studentId === student.id);
  const scenarioAppointment = data.appointments.find((item) => item.id === SCENARIO_APPOINTMENT_ID);
  const nextAppointment = studentAppointments.find((item) => item.status !== "COMPLETED") ?? studentAppointments[0];
  const prescriptions = data.prescriptions.filter((item) => item.studentId === student.id);
  const documents = data.documents.filter((item) => item.studentId === student.id);
  const notifications = data.notifications.filter((item) => item.studentId === student.id).slice(0, 4);
  const consultation = data.consultations.find((item) => item.appointmentId === scenarioAppointment?.id);

  const submitBooking = () => {
    bookScenarioAppointment(booking);
    setScreen("track");
  };

  const signOut = () => {
    logout();
    navigate("/");
  };

  const bottomItems = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "book" as const, label: "Book", icon: Calendar },
    { id: "track" as const, label: "Track", icon: ClipboardList },
    { id: "prescriptions" as const, label: "Rx", icon: Pill },
    { id: "campaigns" as const, label: "Campaigns", icon: HeartPulse }
  ];

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-6 md:px-6">
      <div className="mobile-shell">
        <div className="flex h-[calc(100vh-80px)] min-h-[700px] flex-col bg-slate-50">
          <header className="bg-aethera-ink px-5 pb-5 pt-6 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">Al-Talib</p>
                <h1 className="text-xl font-bold">Student welfare services</h1>
              </div>
              <button className="rounded-full bg-white/10 p-2" onClick={signOut} title="Log out">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 rounded-lg bg-white/10 p-4">
              <p className="text-sm text-cyan-100">Welcome back</p>
              <p className="text-lg font-bold">{student.fullName}</p>
              <p className="mt-1 text-xs text-cyan-100">{student.university} · {student.residence}</p>
            </div>
          </header>

          <div className="thin-scrollbar flex-1 overflow-y-auto px-4 py-5">
            {screen === "modules" ? (
              <ModulesScreen studentName={student.fullName} onOpenHealthcare={() => setScreen("home")} />
            ) : null}
            {screen === "home" ? (
              <HealthcareHome
                nextAppointment={nextAppointment}
                notifications={notifications}
                onNavigate={setScreen}
              />
            ) : null}
            {screen === "book" ? (
              <BookingScreen booking={booking} setBooking={setBooking} onSubmit={submitBooking} />
            ) : null}
            {screen === "track" ? (
              <TrackingScreen appointment={scenarioAppointment} consultationSummary={consultation?.notes} />
            ) : null}
            {screen === "teleconsult" ? (
              <TeleconsultationScreen submitted={teleconsultSubmitted} onSubmit={() => setTeleconsultSubmitted(true)} />
            ) : null}
            {screen === "documents" ? (
              <DocumentsScreen
                documents={documents}
                uploadMessage={uploadMessage}
                onUpload={() => setUploadMessage("Document uploaded. Status: Pending verification.")}
              />
            ) : null}
            {screen === "prescriptions" ? <PrescriptionsScreen prescriptions={prescriptions} /> : null}
            {screen === "campaigns" ? (
              <CampaignsScreen
                campaigns={data.campaigns.filter((campaign) => campaign.status === "PUBLISHED")}
                onRegister={registerCampaignInterest}
              />
            ) : null}
          </div>

          {screen !== "modules" ? (
            <nav className="grid grid-cols-5 gap-1 border-t border-slate-200 bg-white px-2 py-2">
              {bottomItems.map((item) => {
                const Icon = item.icon;
                const active = screen === item.id;
                return (
                  <button
                    key={item.id}
                    className={`flex h-14 flex-col items-center justify-center rounded-lg text-[11px] font-semibold ${
                      active ? "bg-aethera-pale text-aethera-blue" : "text-slate-500"
                    }`}
                    onClick={() => setScreen(item.id)}
                  >
                    <Icon className="mb-1 h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function ModulesScreen({ studentName, onOpenHealthcare }: { studentName: string; onOpenHealthcare: () => void }) {
  return (
    <div className="space-y-4">
      <Card className="bg-white">
        <p className="text-sm text-slate-500">Authenticated student</p>
        <h2 className="mt-1 text-xl font-bold text-aethera-ink">{studentName}</h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="font-semibold text-slate-500">BAC number</dt>
            <dd className="mt-1 font-bold text-aethera-ink">12345678</dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="font-semibold text-slate-500">Health record</dt>
            <dd className="mt-1 font-bold text-aethera-ink">HR-ALG-2026-0042</dd>
          </div>
        </dl>
      </Card>

      <button
        className="w-full rounded-lg border border-aethera-line bg-white p-5 text-left shadow-sm"
        onClick={onOpenHealthcare}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-aethera-pale p-3 text-aethera-blue">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-aethera-ink">Healthcare · EduSihha</h3>
            <p className="text-sm text-slate-500">Appointments, prescriptions, documents, teleconsultation.</p>
          </div>
        </div>
        <div className="mt-4">
          <Badge tone="green">Deep prototype available</Badge>
        </div>
      </button>

      <div className="grid gap-3">
        <ModulePreview icon={Building2} title="Accommodation" subtitle="Available soon in prototype" />
        <ModulePreview icon={Users} title="Activities" subtitle="Scientific, cultural, and sporting services preview" />
      </div>
    </div>
  );
}

function ModulePreview({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-4">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-slate-400" />
        <div>
          <p className="font-bold text-slate-700">{title}</p>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function HealthcareHome({
  nextAppointment,
  notifications,
  onNavigate
}: {
  nextAppointment?: { preferredDate: string; timeSlot: string; reason: string; status: string; type: AppointmentType };
  notifications: { id: string; title: string; message: string; createdAt: string }[];
  onNavigate: (screen: StudentScreen) => void;
}) {
  const quickActions = [
    { label: "Book appointment", icon: Calendar, screen: "book" as const },
    { label: "Track status", icon: ClipboardList, screen: "track" as const },
    { label: "Teleconsultation", icon: Video, screen: "teleconsult" as const },
    { label: "Health documents", icon: FileText, screen: "documents" as const },
    { label: "Prescriptions", icon: Pill, screen: "prescriptions" as const },
    { label: "Campaigns", icon: ShieldCheck, screen: "campaigns" as const }
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-white to-aethera-pale">
        <CardHeader title="Healthcare home" subtitle="EduSihha services through the Aethera gateway" />
        {nextAppointment ? (
          <div className="rounded-lg bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next appointment</p>
                <p className="mt-1 font-bold text-aethera-ink">{nextAppointment.reason}</p>
                <p className="text-sm text-slate-500">
                  {formatDate(nextAppointment.preferredDate)} at {nextAppointment.timeSlot} ·{" "}
                  {nextAppointment.type === "ON_SITE" ? "On-site" : "Teleconsultation"}
                </p>
              </div>
              <Badge status={nextAppointment.status} />
            </div>
          </div>
        ) : (
          <p className="rounded-lg bg-white p-4 text-sm text-slate-500">No active appointment yet.</p>
        )}
      </Card>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex gap-3">
          <Activity className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-bold text-amber-900">Health alert</p>
            <p className="text-sm text-amber-800">Seasonal fever cases are increasing in Algiers residences.</p>
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-bold text-aethera-ink">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="rounded-lg border border-aethera-line bg-white p-4 text-left shadow-sm"
                onClick={() => onNavigate(action.screen)}
              >
                <Icon className="h-5 w-5 text-aethera-blue" />
                <p className="mt-3 text-sm font-bold text-aethera-ink">{action.label}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-aethera-ink">Recent notifications</h2>
        <div className="space-y-2">
          {notifications.map((item) => (
            <div key={item.id} className="rounded-lg bg-white p-3 shadow-sm">
              <div className="flex gap-2">
                <Bell className="mt-0.5 h-4 w-4 text-aethera-cyan" />
                <div>
                  <p className="text-sm font-bold text-aethera-ink">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function BookingScreen({
  booking,
  setBooking,
  onSubmit
}: {
  booking: {
    reason: string;
    symptoms: string;
    preferredDate: string;
    timeSlot: string;
    type: AppointmentType;
  };
  setBooking: (booking: {
    reason: string;
    symptoms: string;
    preferredDate: string;
    timeSlot: string;
    type: AppointmentType;
  }) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Book appointment" subtitle="Create a request for the university residence healthcare unit" />
        <div className="space-y-4">
          <label className="block">
            <span className="label">Reason</span>
            <select className="input mt-2" value={booking.reason} onChange={(event) => setBooking({ ...booking, reason: event.target.value })}>
              {reasons.map((reason) => (
                <option key={reason}>{reason}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="label">Symptoms</span>
            <textarea
              className="input mt-2 min-h-24"
              value={booking.symptoms}
              onChange={(event) => setBooking({ ...booking, symptoms: event.target.value })}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="label">Preferred date</span>
              <input
                className="input mt-2"
                type="date"
                value={booking.preferredDate}
                onChange={(event) => setBooking({ ...booking, preferredDate: event.target.value })}
              />
            </label>
            <label className="block">
              <span className="label">Time slot</span>
              <select className="input mt-2" value={booking.timeSlot} onChange={(event) => setBooking({ ...booking, timeSlot: event.target.value })}>
                <option>09:00</option>
                <option>10:30</option>
                <option>14:00</option>
                <option>16:00</option>
              </select>
            </label>
          </div>
          <fieldset>
            <legend className="label">Consultation type</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                ["ON_SITE", "On-site"],
                ["TELECONSULTATION", "Teleconsultation"]
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                    booking.type === value ? "border-aethera-blue bg-aethera-pale text-aethera-blue" : "border-slate-200 bg-white text-slate-600"
                  }`}
                  onClick={() => setBooking({ ...booking, type: value as AppointmentType })}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <button className="btn-primary w-full" onClick={onSubmit}>
            Submit appointment request
          </button>
          <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            Demo scenario preset: on-site general consultation for fever and headache. Status becomes Pending validation.
          </p>
        </div>
      </Card>
    </div>
  );
}

function TrackingScreen({
  appointment,
  consultationSummary
}: {
  appointment?: { status: string; preferredDate: string; timeSlot: string; reason: string; symptoms: string };
  consultationSummary?: string;
}) {
  const status = appointment?.status ?? "PENDING";
  const items = [
    { label: "Request submitted", detail: "Student created appointment request", done: Boolean(appointment) },
    { label: "Validated by nurse", detail: "Priority assigned and doctor selected", done: ["CONFIRMED", "IN_PROGRESS", "COMPLETED"].includes(status) },
    { label: "Assigned to doctor", detail: "Dr. Samir Haddad receives the file", done: ["CONFIRMED", "IN_PROGRESS", "COMPLETED"].includes(status) },
    { label: "Consultation scheduled", detail: "Student file is ready for consultation", done: ["IN_PROGRESS", "COMPLETED"].includes(status) },
    { label: "Completed", detail: "Consultation finalized and summary available", done: status === "COMPLETED" }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Appointment tracking" subtitle="Visible lifecycle from request to completion" action={<Badge status={status} />} />
        {appointment ? (
          <div className="mb-5 rounded-lg bg-slate-50 p-4">
            <p className="font-bold text-aethera-ink">{appointment.reason}</p>
            <p className="text-sm text-slate-500">
              {formatDate(appointment.preferredDate)} · {appointment.timeSlot} · {appointment.symptoms}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-aethera-blue" style={{ width: `${appointmentProgress(status as AppointmentStatus)}%` }} />
            </div>
          </div>
        ) : (
          <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">Book the scenario appointment first.</p>
        )}
        <Timeline items={items} />
      </Card>
      {consultationSummary ? (
        <Card>
          <CardHeader title="Consultation summary available" />
          <p className="text-sm leading-6 text-slate-600">{consultationSummary}</p>
        </Card>
      ) : null}
    </div>
  );
}

function TeleconsultationScreen({ submitted, onSubmit }: { submitted: boolean; onSubmit: () => void }) {
  return (
    <Card>
      <CardHeader title="Request teleconsultation" subtitle="Remote consultation request with mock document upload" />
      <div className="space-y-4">
        <label className="block">
          <span className="label">Reason</span>
          <input className="input mt-2" defaultValue="Follow-up after exam stress consultation" />
        </label>
        <label className="block">
          <span className="label">Symptoms</span>
          <textarea className="input mt-2 min-h-24" defaultValue="Fatigue and sleep difficulty before exams." />
        </label>
        <button className="btn-secondary w-full" type="button">
          <Upload className="h-4 w-4" /> Attach document mock
        </button>
        <button className="btn-primary w-full" onClick={onSubmit}>Submit teleconsultation request</button>
        {submitted ? (
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-blue-900">Request approved for demo</p>
              <Badge status="CONFIRMED" />
            </div>
            <button className="btn-primary mt-3 w-full">
              <Video className="h-4 w-4" /> Join session
            </button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function DocumentsScreen({
  documents,
  uploadMessage,
  onUpload
}: {
  documents: { id: string; title: string; type: string; uploadedAt: string; status: string; comment?: string }[];
  uploadMessage: string;
  onUpload: () => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="My health documents" subtitle="Uploaded documents are verified by authorized healthcare staff" />
        <button className="btn-secondary w-full" onClick={onUpload}>
          <Upload className="h-4 w-4" /> Upload document mock
        </button>
        {uploadMessage ? <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{uploadMessage}</p> : null}
      </Card>
      <div className="space-y-3">
        {documents.map((document) => (
          <div key={document.id} className="rounded-lg border border-aethera-line bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-aethera-ink">{document.title}</p>
                <p className="text-xs text-slate-500">{document.type} · Uploaded {formatDate(document.uploadedAt)}</p>
              </div>
              <Badge status={document.status} />
            </div>
            {document.comment ? <p className="mt-3 text-xs text-slate-500">{document.comment}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function PrescriptionsScreen({
  prescriptions
}: {
  prescriptions: { id: string; medication: string; dosage: string; duration: string; instructions: string; doctorName: string; issuedAt: string; status: string }[];
}) {
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader title="My prescriptions" subtitle="Digital prescriptions issued by EduSihha doctors" />
      </Card>
      {prescriptions.map((prescription) => (
        <div key={prescription.id} className="rounded-lg border border-aethera-line bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-aethera-ink">{prescription.medication}</p>
              <p className="text-sm text-slate-500">{prescription.dosage} · {prescription.duration}</p>
            </div>
            <Badge status={prescription.status} />
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">{prescription.instructions}</p>
          <p className="mt-3 text-xs font-semibold text-slate-600">{prescription.doctorName} · {prescription.issuedAt}</p>
        </div>
      ))}
    </div>
  );
}

function CampaignsScreen({
  campaigns,
  onRegister
}: {
  campaigns: { id: string; title: string; type: string; target: string; startDate: string; endDate: string; description: string; interestedStudentIds: string[] }[];
  onRegister: (campaignId: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader title="Prevention campaigns" subtitle="Published national and regional health campaigns" />
      </Card>
      {campaigns.map((campaign) => {
        const registered = campaign.interestedStudentIds.includes(STUDENT_ID);
        return (
          <div key={campaign.id} className="rounded-lg border border-aethera-line bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-aethera-ink">{campaign.title}</p>
                <p className="text-xs font-semibold text-aethera-cyan">{campaign.type} · {campaign.target}</p>
              </div>
              {registered ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{campaign.description}</p>
            <p className="mt-2 text-xs text-slate-500">{formatDate(campaign.startDate)} to {formatDate(campaign.endDate)}</p>
            <button className="btn-secondary mt-3 w-full" disabled={registered} onClick={() => onRegister(campaign.id)}>
              {registered ? "Interest registered" : "Register interest"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
