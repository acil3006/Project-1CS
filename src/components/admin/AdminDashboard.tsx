import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Boxes,
  Calendar,
  Check,
  ClipboardList,
  Database,
  FileText,
  HeartPulse,
  Home,
  LineChart,
  LogOut,
  Megaphone,
  Pill,
  Search,
  ShieldCheck,
  Stethoscope,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../app/AppState";
import type { CampaignType, IssueStatus } from "../../types";
import { formatDate } from "../../utils/status";
import { Badge } from "../common/Badge";
import { Card, CardHeader } from "../common/Card";
import { DemoGuide } from "../common/DemoGuide";
import { StatCard } from "../common/StatCard";

type AdminView = "overview" | "analytics" | "campaigns" | "operations" | "alerts" | "compliance" | "issues";

export function AdminDashboard() {
  const { data, session, logout } = useApp();
  const navigate = useNavigate();
  const [view, setView] = useState<AdminView>("overview");
  const scopeLabel = session?.scope === "ONOU" ? "National ONOU view" : "Regional DOU - Algiers view";

  const navItems = [
    ["overview", "Overview", Home],
    ["analytics", "Analytics", BarChart3],
    ["campaigns", "Prevention Campaigns", Megaphone],
    ["operations", "Staff & Operations", Users],
    ["alerts", "Stock & Equipment", Boxes],
    ["compliance", "Compliance Reporting", FileText],
    ["issues", "Escalated Issues", AlertTriangle]
  ] as const;

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
              <LineChart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold text-aethera-ink">EduPlan</p>
              <p className="text-xs font-semibold text-slate-500">DOU/ONOU piloting dashboard</p>
            </div>
          </div>
          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <p className="font-bold text-aethera-ink">{session?.displayName}</p>
            <p className="mt-1 text-sm text-slate-500">{scopeLabel}</p>
            <div className="mt-3">
              <Badge tone={session?.scope === "ONOU" ? "blue" : "green"}>{session?.scope === "ONOU" ? "National scope" : "Regional scope"}</Badge>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {navItems.map(([id, label, Icon]) => (
              <button
                key={id}
                className={`nav-item w-full ${view === id ? "nav-item-active" : ""}`}
                onClick={() => setView(id as AdminView)}
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
                <p className="text-xs font-semibold uppercase tracking-wide text-aethera-cyan">Aethera supervision layer</p>
                <h1 className="text-2xl font-bold text-aethera-ink">Healthcare service monitoring</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="relative min-w-[260px]">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input className="input pl-9" placeholder="Search residence, region, campaign, alert" />
                </label>
                <button className="btn-secondary">
                  <Bell className="h-4 w-4" /> Alerts
                </button>
                <button className="btn-ghost" onClick={signOut}>
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            </div>
          </header>

          <div className="grid gap-5 p-5 xl:grid-cols-[1fr_300px]">
            <div className="space-y-5">
              {view === "overview" ? <Overview /> : null}
              {view === "analytics" ? <Analytics /> : null}
              {view === "campaigns" ? <CampaignManagement /> : null}
              {view === "operations" ? <Operations /> : null}
              {view === "alerts" ? <StockEquipmentAlerts /> : null}
              {view === "compliance" ? <Compliance /> : null}
              {view === "issues" ? <Issues /> : null}
            </div>
            <div className="space-y-5">
              <SecurityPanel />
              <DemoGuide />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Overview() {
  const { data } = useApp();
  const metrics = data.metrics;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students served" value={metrics.totalStudentsServed.toLocaleString()} icon={Users} detail="Identity & Patient Registry" />
        <StatCard label="Appointments this month" value={metrics.appointmentsThisMonth.toLocaleString()} icon={Calendar} tone="blue" />
        <StatCard label="Consultations completed" value={metrics.completedConsultations.toLocaleString()} icon={Stethoscope} tone="green" detail="+1 after scenario doctor finalizes" />
        <StatCard label="Teleconsultations" value={metrics.teleconsultations} icon={Activity} tone="green" />
        <StatCard label="Active campaigns" value={metrics.campaignsActive} icon={Megaphone} tone="blue" />
        <StatCard label="Low stock alerts" value={metrics.lowStockAlerts} icon={AlertTriangle} tone="rose" />
        <StatCard label="Equipment gap alerts" value={metrics.equipmentGapAlerts} icon={Boxes} tone="amber" />
        <StatCard label="Staffing gaps" value={metrics.staffingGaps} icon={Users} tone="rose" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader title="Performance indicators by residence" subtitle="Regional supervision snapshot" />
          <div className="space-y-4">
            {[
              ["Ben Aknoun", 92, "2.1 days"],
              ["Kouba", 78, "3.4 days"],
              ["Bab Ezzouar", 71, "3.9 days"],
              ["Bouzareah", 85, "2.6 days"]
            ].map(([residence, score, wait]) => (
              <div key={residence}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold text-aethera-ink">{residence}</span>
                  <span className="text-slate-500">Avg wait {wait}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-aethera-mint" style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Scenario supervision" subtitle="Visible changes after the guided flow" />
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between gap-3"><span className="text-slate-600">Completed consultation</span><Badge tone="green">+1 reflected</Badge></li>
            <li className="flex justify-between gap-3"><span className="text-slate-600">Dispensed prescription</span><Badge tone="green">+1 reflected</Badge></li>
            <li className="flex justify-between gap-3"><span className="text-slate-600">Paracetamol stock</span><Badge tone="blue">{data.stockItems.find((item) => item.id === "stock-paracetamol")?.quantity} remaining</Badge></li>
            <li className="flex justify-between gap-3"><span className="text-slate-600">Average waiting time</span><Badge tone="blue">{data.metrics.averageWaitingTimeDays} days</Badge></li>
          </ul>
        </Card>
      </div>
    </>
  );
}

function Analytics() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartCard title="Appointment volume by week" values={[["W1", 62], ["W2", 74], ["W3", 68], ["W4", 82], ["W5", 91]]} />
      <ChartCard title="Consultation types distribution" values={[["General", 70], ["Dental", 24], ["Psychological", 38], ["Vaccination", 29], ["Certificates", 42]]} />
      <ChartCard title="Teleconsultation adoption" values={[["Jan", 22], ["Feb", 31], ["Mar", 45], ["Apr", 54], ["May", 64]]} />
      <ChartCard title="Campaign participation" values={[["Vaccination", 56], ["Mental health", 44], ["Diabetes", 33], ["Flu prevention", 61]]} />
      <Card className="xl:col-span-2">
        <CardHeader title="Drug stock risk by residence" subtitle="Decision support for pharmaceutical replenishment" />
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Ben Aknoun", "Low", "Paracetamol after scenario"],
            ["Kouba", "Critical", "Antipyretics"],
            ["Bab Ezzouar", "High", "Glucose strips"],
            ["Bouzareah", "Normal", "No immediate risk"]
          ].map(([residence, risk, detail]) => (
            <div key={residence} className="rounded-lg bg-slate-50 p-4">
              <p className="font-bold text-aethera-ink">{residence}</p>
              <div className="mt-2"><Badge status={risk === "Normal" ? "OK" : risk.toUpperCase()} /></div>
              <p className="mt-2 text-xs text-slate-500">{detail}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CampaignManagement() {
  const { data, publishScenarioCampaign } = useApp();
  const [form, setForm] = useState({
    title: "Seasonal Flu Prevention Campaign",
    target: "University residences in Algiers",
    type: "Awareness" as CampaignType,
    description: "Awareness sessions, vaccination orientation, and early fever screening across Algiers residences.",
    startDate: "2026-05-27",
    endDate: "2026-06-10"
  });

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader title="Create prevention campaign" subtitle="Published campaigns appear in Al-Talib Healthcare" />
        <div className="space-y-4">
          <label><span className="label">Campaign title</span><input className="input mt-2" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
          <label><span className="label">Target region/residence</span><input className="input mt-2" value={form.target} onChange={(event) => setForm({ ...form, target: event.target.value })} /></label>
          <label>
            <span className="label">Type</span>
            <select className="input mt-2" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as CampaignType })}>
              <option>Vaccination</option>
              <option>Awareness</option>
              <option>Screening</option>
              <option>Mental health</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label><span className="label">Start date</span><input className="input mt-2" type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} /></label>
            <label><span className="label">End date</span><input className="input mt-2" type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} /></label>
          </div>
          <label><span className="label">Description</span><textarea className="input mt-2 min-h-28" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
          <button className="btn-primary w-full" onClick={() => publishScenarioCampaign(form)}>
            <Megaphone className="h-4 w-4" /> Publish campaign
          </button>
          <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">Scenario title: Seasonal Flu Prevention Campaign. Type can be presented as Awareness / Vaccination in the demo.</p>
        </div>
      </Card>
      <Card>
        <CardHeader title="Published campaigns" subtitle="Student-facing prevention content" />
        <div className="space-y-3">
          {data.campaigns.map((campaign) => (
            <div key={campaign.id} className="rounded-lg border border-aethera-line bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-aethera-ink">{campaign.title}</p>
                  <p className="text-sm text-slate-500">{campaign.type} · {campaign.target}</p>
                </div>
                <Badge status={campaign.status} />
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{campaign.description}</p>
              <p className="mt-2 text-xs text-slate-500">{formatDate(campaign.startDate)} to {formatDate(campaign.endDate)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Operations() {
  const { data } = useApp();
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
      <Card>
        <CardHeader title="Staff & operations monitoring" subtitle="Availability and workload by residence" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-3">Residence</th>
                <th>Doctors</th>
                <th>Nurses</th>
                <th>Workload</th>
                <th>Gap</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Ben Aknoun", 1, 2, "Medium", "Covered"],
                ["Kouba", 1, 1, "High", "Night nurse"],
                ["Bab Ezzouar", 2, 1, "High", "General doctor"],
                ["Bouzareah", 1, 2, "Normal", "Covered"]
              ].map(([residence, doctors, nurses, workload, gap]) => (
                <tr key={residence} className="border-b border-slate-100">
                  <td className="py-3 font-semibold text-aethera-ink">{residence}</td>
                  <td>{doctors}</td>
                  <td>{nurses}</td>
                  <td><Badge tone={workload === "High" ? "rose" : workload === "Medium" ? "amber" : "green"}>{workload}</Badge></td>
                  <td>{gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <CardHeader title="Escalation list" subtitle="Operational incidents from medical units" />
        <div className="space-y-3">
          {data.issues.slice(0, 3).map((issue) => (
            <div key={issue.id} className="rounded-lg bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-aethera-ink">{issue.category}</p>
                  <p className="text-xs text-slate-500">{issue.residence}</p>
                </div>
                <Badge status={issue.status} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{issue.summary}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StockEquipmentAlerts() {
  const { data, requestReplenishment } = useApp();
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader title="Drug stock alerts" subtitle="Low stock, expiry warnings, and replenishment requests" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-3">Item</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.stockItems.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-3 font-semibold text-aethera-ink">{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity} / {item.threshold}</td>
                  <td>{formatDate(item.expiryDate)}</td>
                  <td><Badge status={item.status} /></td>
                  <td><button className="btn-secondary px-3 py-1" onClick={() => requestReplenishment(item.id)}>Create request</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <CardHeader title="Equipment alerts" subtitle="Missing equipment and maintenance tracking" />
        <div className="grid gap-3 md:grid-cols-3">
          {data.equipment.map((item) => (
            <div key={item.id} className="rounded-lg bg-slate-50 p-4">
              <p className="font-bold text-aethera-ink">{item.name}</p>
              <p className="text-sm text-slate-500">{item.residence}</p>
              <div className="mt-3"><Badge status={item.status} /></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Compliance() {
  const { data } = useApp();
  const [generated, setGenerated] = useState(false);

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader title="Ministry compliance report" subtitle="Mock generation for supervision and traceability" />
        <div className="space-y-3 text-sm">
          <ReportRow label="Consultations" value={data.metrics.completedConsultations.toLocaleString()} />
          <ReportRow label="Campaigns completed/active" value={data.metrics.campaignsActive.toString()} />
          <ReportRow label="Stock incidents" value={data.metrics.lowStockAlerts.toString()} />
          <ReportRow label="Data protection/audit status" value="Compliant mock indicator" />
          <ReportRow label="Sensitive decision traceability" value={`${data.auditLogs.length} audit entries`} />
        </div>
        <button className="btn-primary mt-5" onClick={() => setGenerated(true)}>
          <FileText className="h-4 w-4" /> Generate compliance report mock
        </button>
        {generated ? <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">Compliance report generated for presentation demo.</p> : null}
      </Card>
      <Card>
        <CardHeader title="Audit trail" subtitle="Major actions across appointment, clinical, prescription, and campaign modules" />
        <div className="max-h-[460px] space-y-3 overflow-y-auto pr-2 thin-scrollbar">
          {data.auditLogs.map((log) => (
            <div key={log.id} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-aethera-ink">{log.action}</p>
                <Badge tone="slate">{log.module}</Badge>
              </div>
              <p className="mt-1 text-xs text-slate-500">{log.timestamp} · {log.actor}</p>
              <p className="mt-2 text-sm text-slate-600">{log.detail}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Issues() {
  const { data, markIssue } = useApp();
  const statuses: IssueStatus[] = ["Under review", "Assigned", "Resolved"];

  return (
    <Card>
      <CardHeader title="Escalated issues" subtitle="Issues sent by healthcare units for DOU/ONOU decision support" />
      <div className="space-y-3">
        {data.issues.map((issue) => (
          <div key={issue.id} className="rounded-lg border border-aethera-line bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-aethera-ink">{issue.category}</p>
                <p className="text-sm text-slate-500">{issue.residence} · severity {issue.severity}</p>
              </div>
              <Badge status={issue.status} />
            </div>
            <p className="mt-2 text-sm text-slate-600">{issue.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button key={status} className="btn-secondary px-3 py-1" onClick={() => markIssue(issue.id, status)}>
                  Mark {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SecurityPanel() {
  const items: { title: string; subtitle: string; icon: LucideIcon }[] = [
    { title: "API gateway active", subtitle: "Aethera gateway routes app traffic", icon: Activity },
    { title: "RBAC enabled", subtitle: "Doctor, nurse, student, admin permissions", icon: ShieldCheck },
    { title: "Audit logs active", subtitle: "Major sensitive actions are traced", icon: ClipboardList },
    { title: "National hosting ready", subtitle: "Data hosted nationally / compliance-ready indicator", icon: Database }
  ];

  return (
    <Card>
      <CardHeader title="Security & Traceability" subtitle="Prototype-level compliance representation" />
      <div className="space-y-3">
        {items.map(({ title, subtitle, icon: Icon }) => (
          <div key={title} className="flex gap-3 rounded-lg bg-slate-50 p-3">
            <Icon className="mt-0.5 h-5 w-5 text-aethera-blue" />
            <div>
              <p className="text-sm font-bold text-aethera-ink">{title}</p>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ChartCard({ title, values }: { title: string; values: [string, number][] }) {
  return (
    <Card>
      <CardHeader title={title} />
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
    </Card>
  );
}

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-slate-600">{label}</span>
      <span className="font-bold text-aethera-ink">{value}</span>
    </div>
  );
}
