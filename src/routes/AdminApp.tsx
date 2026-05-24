import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppContext } from '../app/AppContext'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Field, TextArea, TextInput } from '../components/common/Field'
import { SectionHeader } from '../components/common/SectionHeader'
import { Select } from '../components/common/Select'
import { StatCard } from '../components/common/StatCard'
import { computeMetrics } from '../utils/metrics'

const navItems = [
  'Overview',
  'Analytics',
  'Campaigns',
  'Staff & Operations',
  'Stock & Equipment',
  'Compliance',
  'Escalated Issues',
  'Security & Traceability',
]

export function AdminApp() {
  const { session, adminScope, data, logout, publishCampaign } = useAppContext()
  const [section, setSection] = useState('Overview')
  const [campaignForm, setCampaignForm] = useState({
    title: 'Seasonal Flu Prevention Campaign',
    target: 'University residences in Algiers',
    description: 'Vaccination booths, awareness sessions, and hygiene kits for students.',
    startDate: '2026-06-01',
    endDate: '2026-06-20',
    type: 'Awareness / Vaccination',
  })

  const metrics = useMemo(() => computeMetrics(data), [data])

  if (!session || session.role !== 'ADMIN') {
    return <Navigate to="/login/admin" replace />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col gap-4 border-r border-slate-200 bg-white px-4 py-6 md:flex">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">EduPlan</p>
            <h1 className="text-lg font-semibold text-slate-900">Admin Dashboard</h1>
          </div>
          <div className="rounded-2xl bg-brand-50 p-3 text-sm text-slate-700">
            <p className="font-semibold">{adminScope === 'ONOU' ? 'ONOU National' : 'DOU Algiers'}</p>
            <p>{adminScope} scope</p>
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
              <p className="text-sm font-semibold text-brand-600">EduPlan</p>
              <h2 className="text-2xl font-semibold text-slate-900">{section}</h2>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone="blue">{adminScope} scope</Badge>
              <Button variant="outline" size="sm" onClick={logout}>
                Log out
              </Button>
            </div>
          </div>

          {section === 'Overview' ? (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard label="Total students served" value="18,420" helper="Across all residences" />
                <StatCard label="Appointments this month" value={metrics.appointmentsThisMonth} helper="+12% vs last month" />
                <StatCard label="Consultations completed" value={metrics.completedConsultations} helper="Includes teleconsultations" />
                <StatCard label="Teleconsultations" value={metrics.teleconsultations} helper="Sessions approved" />
                <StatCard label="Active campaigns" value={metrics.campaignsActive} helper="Regional prevention" />
                <StatCard label="Low stock alerts" value={metrics.lowStockAlerts} helper="Action required" />
                <StatCard label="Equipment gap alerts" value="4" helper="Pending replacements" />
                <StatCard label="Staffing gap alerts" value={metrics.staffingGaps} helper="Doctor/nurse shortages" />
                <StatCard label="Compliance reports" value="2" helper="Pending review" />
              </div>

              <Card>
                <SectionHeader title="Security & Traceability" subtitle="Platform compliance status" />
                <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span>API Gateway active</span>
                    <Badge tone="emerald">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span>RBAC enabled</span>
                    <Badge tone="emerald">Enforced</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span>Audit logs active</span>
                    <Badge tone="emerald">Recording</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span>Data hosted nationally</span>
                    <Badge tone="emerald">Compliant</Badge>
                  </div>
                </div>
              </Card>

              <Card>
                <SectionHeader title="Escalated issues" subtitle="Latest escalations from healthcare units" />
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="font-semibold text-slate-900">Stock shortage: Amoxicillin 500mg</p>
                    <p>Ben Aknoun unit requested urgent replenishment.</p>
                    <Badge tone="amber">Under review</Badge>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="font-semibold text-slate-900">High demand for psychological support</p>
                    <p>Additional counselor required in Algiers residences.</p>
                    <Badge tone="blue">Assigned</Badge>
                  </div>
                </div>
              </Card>
            </div>
          ) : null}

          {section === 'Analytics' ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <Card>
                <SectionHeader title="Appointment volume by week" />
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, index) => (
                    <div key={week} className="flex items-center gap-3">
                      <span className="w-20 text-xs text-slate-500">{week}</span>
                      <div className="h-2 flex-1 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-brand-500" style={{ width: `${40 + index * 15}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{120 + index * 24}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionHeader title="Consultation types distribution" />
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>General consultations: 46%</p>
                  <p>Dental care: 18%</p>
                  <p>Psychological support: 21%</p>
                  <p>Vaccination: 15%</p>
                </div>
              </Card>

              <Card>
                <SectionHeader title="Teleconsultation adoption" />
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>Adoption rate: 28%</p>
                  <p>Average resolution time: 22 hours</p>
                  <p>Top residence: Ben Aknoun</p>
                </div>
              </Card>

              <Card>
                <SectionHeader title="Drug stock risk by residence" />
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>Ben Aknoun: Medium risk</p>
                  <p>El Harrach: Low risk</p>
                  <p>Soumaa: Medium risk</p>
                </div>
              </Card>
            </div>
          ) : null}

          {section === 'Campaigns' ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <SectionHeader title="Prevention campaign management" subtitle="Create new campaign" />
                <div className="mt-4 grid gap-3">
                  <Field label="Campaign title">
                    <TextInput
                      value={campaignForm.title}
                      onChange={(event) => setCampaignForm((prev) => ({ ...prev, title: event.target.value }))}
                    />
                  </Field>
                  <Field label="Target region / residence">
                    <TextInput
                      value={campaignForm.target}
                      onChange={(event) => setCampaignForm((prev) => ({ ...prev, target: event.target.value }))}
                    />
                  </Field>
                  <Field label="Type">
                    <Select value={campaignForm.type} onChange={(event) => setCampaignForm((prev) => ({ ...prev, type: event.target.value }))}>
                      <option>Vaccination</option>
                      <option>Awareness</option>
                      <option>Screening</option>
                      <option>Mental health</option>
                      <option>Awareness / Vaccination</option>
                    </Select>
                  </Field>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Start date">
                      <TextInput
                        type="date"
                        value={campaignForm.startDate}
                        onChange={(event) => setCampaignForm((prev) => ({ ...prev, startDate: event.target.value }))}
                      />
                    </Field>
                    <Field label="End date">
                      <TextInput
                        type="date"
                        value={campaignForm.endDate}
                        onChange={(event) => setCampaignForm((prev) => ({ ...prev, endDate: event.target.value }))}
                      />
                    </Field>
                  </div>
                  <Field label="Description">
                    <TextArea
                      rows={3}
                      value={campaignForm.description}
                      onChange={(event) => setCampaignForm((prev) => ({ ...prev, description: event.target.value }))}
                    />
                  </Field>
                  <Button
                    onClick={() => {
                      publishCampaign({
                        title: campaignForm.title,
                        target: campaignForm.target,
                        description: campaignForm.description,
                        startDate: campaignForm.startDate,
                        endDate: campaignForm.endDate,
                        type: campaignForm.type,
                      })
                    }}
                  >
                    Publish campaign
                  </Button>
                </div>
              </Card>

              <Card>
                <SectionHeader title="Active campaigns" subtitle="Visible to students" />
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  {data.campaigns.map((campaign) => (
                    <div key={campaign.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="font-semibold text-slate-900">{campaign.title}</p>
                      <p>{campaign.type}</p>
                      <p className="text-xs text-slate-500">
                        {campaign.startDate} → {campaign.endDate}
                      </p>
                      <Badge tone="emerald">{campaign.status}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : null}

          {section === 'Staff & Operations' ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <Card>
                <SectionHeader title="Medical staff coverage" />
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <p>Doctors available: 18</p>
                  <p>Nurses available: 32</p>
                  <p>Residences with shortages: 2</p>
                </div>
              </Card>
              <Card>
                <SectionHeader title="Escalation list" />
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>Ben Aknoun: +1 nurse needed</p>
                  <p>Soumaa: high consultation demand</p>
                </div>
              </Card>
            </div>
          ) : null}

          {section === 'Stock & Equipment' ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <Card>
                <SectionHeader title="Low drug stock" />
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  {data.stockItems.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p>Qty: {item.quantity}</p>
                      <Badge tone={item.status === 'LOW' ? 'amber' : 'emerald'}>{item.status}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <SectionHeader title="Equipment alerts" />
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>2 ECG machines pending maintenance.</p>
                  <p>1 ultrasound unit requires calibration.</p>
                </div>
                <Button size="sm" className="mt-4">
                  Create replenishment request
                </Button>
              </Card>
            </div>
          ) : null}

          {section === 'Compliance' ? (
            <Card className="mt-6">
              <SectionHeader title="Compliance reporting" subtitle="Ministry of Health" />
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>Consultations reported: {metrics.completedConsultations}</p>
                <p>Campaigns completed: {metrics.campaignsActive}</p>
                <p>Stock incidents: {metrics.lowStockAlerts}</p>
                <p>Audit status: up to date</p>
              </div>
              <Button className="mt-4">Generate compliance report</Button>
            </Card>
          ) : null}

          {section === 'Escalated Issues' ? (
            <Card className="mt-6">
              <SectionHeader title="Escalated issues" subtitle="Assign and track resolution" />
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900">Equipment failure: Autoclave</p>
                  <p>El Harrach residence unit reported sterilization issue.</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline">
                      Under review
                    </Button>
                    <Button size="sm" variant="outline">
                      Assign
                    </Button>
                    <Button size="sm">Resolve</Button>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900">Urgent campaign request</p>
                  <p>Requested mental health campaign after exam stress reports.</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline">
                      Under review
                    </Button>
                    <Button size="sm">Assign</Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}

          {section === 'Security & Traceability' ? (
            <Card className="mt-6">
              <SectionHeader title="Security & Traceability" subtitle="Audit log highlights" />
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                {data.auditLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="font-semibold text-slate-900">{log.action}</p>
                    <p>{log.details}</p>
                    <p className="text-xs text-slate-400">{log.timestamp}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
        </main>
      </div>
    </div>
  )
}
