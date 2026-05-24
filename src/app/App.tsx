import {
  Activity,
  ArrowRight,
  Building2,
  HeartPulse,
  Lock,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Users
} from "lucide-react";
import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useApp } from "./AppState";
import { AdminDashboard } from "../components/admin/AdminDashboard";
import { MedicalPlatform } from "../components/medical/MedicalPlatform";
import { StudentApp } from "../components/student/StudentApp";
import { Badge } from "../components/common/Badge";
import { Card } from "../components/common/Card";
import type { AccessKind, AdminScope, Session } from "../types";

function LoginHub() {
  const { data, setSession } = useApp();
  const navigate = useNavigate();
  const [access, setAccess] = useState<AccessKind>("student");
  const [studentForm, setStudentForm] = useState({ bac: "12345678", password: "BAC2026" });
  const [medicalForm, setMedicalForm] = useState({ professionalId: "NUR-2001", password: "nurse123" });
  const [adminForm, setAdminForm] = useState({ adminId: "DOU-ALGIERS", password: "admin123", scope: "DOU" as AdminScope });
  const [error, setError] = useState("");

  const submitStudent = () => {
    setError("");
    if (!/^\d{8}$/.test(studentForm.bac)) {
      setError("Baccalaureate registration number must be exactly 8 digits.");
      return;
    }
    if (!studentForm.password.trim()) {
      setError("Secret password is required.");
      return;
    }

    const student = data.students.find(
      (item) => item.bacRegistrationNumber === studentForm.bac && studentForm.password === "BAC2026"
    );
    if (!student) {
      setError("Invalid BAC credentials for the prototype.");
      return;
    }

    const session: Session = {
      kind: "student",
      role: "STUDENT",
      userId: student.id,
      displayName: student.fullName
    };
    setSession(session);
    navigate("/student");
  };

  const submitMedical = () => {
    setError("");
    const user = data.medicalStaff.find(
      (item) =>
        item.professionalId === medicalForm.professionalId &&
        ((item.role === "DOCTOR" && medicalForm.password === "doctor123") ||
          (item.role === "NURSE" && medicalForm.password === "nurse123"))
    );

    if (!user) {
      setError("Invalid professional ID or password.");
      return;
    }

    setSession({
      kind: "medical",
      role: user.role,
      userId: user.id,
      displayName: user.fullName
    });
    navigate("/medical");
  };

  const submitAdmin = () => {
    setError("");
    const admin = data.admins.find(
      (item) => item.adminId === adminForm.adminId && item.scope === adminForm.scope && adminForm.password === "admin123"
    );

    if (!admin) {
      setError("Invalid admin credentials or scope.");
      return;
    }

    setSession({
      kind: "admin",
      role: "ADMIN",
      userId: admin.id,
      displayName: admin.fullName,
      scope: admin.scope
    });
    navigate("/admin");
  };

  const accessCards = [
    {
      kind: "student" as const,
      title: "Student",
      subtitle: "Al-Talib mobile app",
      icon: Smartphone,
      detail: "BAC credentials, modular welfare services, healthcare self-service."
    },
    {
      kind: "medical" as const,
      title: "Medical Staff",
      subtitle: "EduSihha web platform",
      icon: Stethoscope,
      detail: "Doctor and nurse workflows with RBAC permissions."
    },
    {
      kind: "admin" as const,
      title: "DOU/ONOU Admin",
      subtitle: "EduPlan dashboard",
      icon: ShieldCheck,
      detail: "Regional and national supervision, reporting, and alerts."
    }
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff5f6,transparent_36%),linear-gradient(135deg,#f7fbfd,#eef8fb)] px-4 py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <Badge tone="blue">Aethera Student Welfare Platform</Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-aethera-ink md:text-6xl">
              EduSihha healthcare module prototype
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Unified Algerian university welfare services with authenticated access through a shared API gateway,
              role-based health data permissions, and DOU/ONOU supervision.
            </p>
          </div>
          <Card className="bg-white/90">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-aethera-pale p-3 text-aethera-blue">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-aethera-ink">Prototype security model</p>
                <p className="text-sm text-slate-500">Authentication first, RBAC after login, audit traceability on major actions.</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs font-semibold text-slate-600">
              <div className="rounded-lg bg-slate-50 p-3">
                <Building2 className="mx-auto mb-2 h-5 w-5 text-aethera-cyan" />
                Gateway
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <HeartPulse className="mx-auto mb-2 h-5 w-5 text-aethera-mint" />
                EduSihha
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <Users className="mx-auto mb-2 h-5 w-5 text-aethera-blue" />
                EduPlan
              </div>
            </div>
          </Card>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {accessCards.map((card) => {
            const Icon = card.icon;
            const active = access === card.kind;
            return (
              <button
                key={card.kind}
                className={`rounded-lg border p-5 text-left shadow-sm transition ${
                  active
                    ? "border-aethera-blue bg-white ring-4 ring-aethera-blue/10"
                    : "border-aethera-line bg-white/80 hover:bg-white"
                }`}
                onClick={() => {
                  setAccess(card.kind);
                  setError("");
                }}
              >
                <Icon className={`h-7 w-7 ${active ? "text-aethera-blue" : "text-slate-400"}`} />
                <h2 className="mt-4 text-lg font-bold text-aethera-ink">{card.title}</h2>
                <p className="text-sm font-semibold text-aethera-cyan">{card.subtitle}</p>
                <p className="mt-3 text-sm leading-6 text-slate-500">{card.detail}</p>
              </button>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="label">Selected access</p>
                <h2 className="mt-1 text-2xl font-bold text-aethera-ink">
                  {access === "student" ? "Al-Talib student login" : access === "medical" ? "EduSihha staff login" : "EduPlan admin login"}
                </h2>
              </div>
              <Activity className="h-7 w-7 text-aethera-cyan" />
            </div>

            {access === "student" ? (
              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="label">Baccalaureate registration number</span>
                  <input
                    className="input mt-2"
                    value={studentForm.bac}
                    maxLength={8}
                    inputMode="numeric"
                    onChange={(event) => setStudentForm({ ...studentForm, bac: event.target.value.replace(/\D/g, "") })}
                  />
                </label>
                <label className="block">
                  <span className="label">Secret password from BAC document</span>
                  <input
                    className="input mt-2"
                    type="password"
                    value={studentForm.password}
                    onChange={(event) => setStudentForm({ ...studentForm, password: event.target.value })}
                  />
                </label>
                <button className="btn-primary w-full" onClick={submitStudent}>
                  Enter Al-Talib <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}

            {access === "medical" ? (
              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="label">Professional ID</span>
                  <select
                    className="input mt-2"
                    value={medicalForm.professionalId}
                    onChange={(event) =>
                      setMedicalForm({
                        professionalId: event.target.value,
                        password: event.target.value.startsWith("DOC") ? "doctor123" : "nurse123"
                      })
                    }
                  >
                    <option value="DOC-1001">DOC-1001 - Doctor</option>
                    <option value="NUR-2001">NUR-2001 - Nurse</option>
                  </select>
                </label>
                <label className="block">
                  <span className="label">Password</span>
                  <input
                    className="input mt-2"
                    type="password"
                    value={medicalForm.password}
                    onChange={(event) => setMedicalForm({ ...medicalForm, password: event.target.value })}
                  />
                </label>
                <button className="btn-primary w-full" onClick={submitMedical}>
                  Open EduSihha <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}

            {access === "admin" ? (
              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="label">Scope</span>
                  <select
                    className="input mt-2"
                    value={adminForm.scope}
                    onChange={(event) => {
                      const scope = event.target.value as AdminScope;
                      setAdminForm({
                        scope,
                        adminId: scope === "DOU" ? "DOU-ALGIERS" : "ONOU-NATIONAL",
                        password: "admin123"
                      });
                    }}
                  >
                    <option value="DOU">Regional DOU</option>
                    <option value="ONOU">National ONOU</option>
                  </select>
                </label>
                <label className="block">
                  <span className="label">Admin ID</span>
                  <input
                    className="input mt-2"
                    value={adminForm.adminId}
                    onChange={(event) => setAdminForm({ ...adminForm, adminId: event.target.value })}
                  />
                </label>
                <label className="block">
                  <span className="label">Password</span>
                  <input
                    className="input mt-2"
                    type="password"
                    value={adminForm.password}
                    onChange={(event) => setAdminForm({ ...adminForm, password: event.target.value })}
                  />
                </label>
                <button className="btn-primary w-full" onClick={submitAdmin}>
                  Enter EduPlan <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}

            {error ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p> : null}
          </Card>

          <Card className="bg-aethera-ink text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">Mock credentials</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                ["Student", "12345678 / BAC2026"],
                ["Doctor", "DOC-1001 / doctor123"],
                ["Nurse", "NUR-2001 / nurse123"],
                ["DOU admin", "DOU-ALGIERS / admin123"],
                ["ONOU admin", "ONOU-NATIONAL / admin123"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/10 p-4">
                  <p className="text-sm font-bold">{label}</p>
                  <p className="mt-1 text-sm text-cyan-100">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg bg-white/10 p-4">
              <p className="font-semibold">Architecture represented in the prototype</p>
              <p className="mt-2 text-sm leading-6 text-cyan-50">
                Each role signs in before reaching its interface. State changes are stored locally to simulate the
                shared API gateway and healthcare backend modules used by Al-Talib, EduSihha, and EduPlan.
              </p>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}

function RequireAccess({ kind, children }: { kind: AccessKind; children: JSX.Element }) {
  const { session } = useApp();
  if (!session || session.kind !== kind) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginHub />} />
      <Route
        path="/student"
        element={
          <RequireAccess kind="student">
            <StudentApp />
          </RequireAccess>
        }
      />
      <Route
        path="/medical"
        element={
          <RequireAccess kind="medical">
            <MedicalPlatform />
          </RequireAccess>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAccess kind="admin">
            <AdminDashboard />
          </RequireAccess>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
