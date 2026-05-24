import { Link } from 'react-router-dom'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'

export function LoginLanding() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Aethera Student Welfare</span>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Unified access to accommodation, healthcare, and activities
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            Choose your portal to explore the EduSihha healthcare module and the broader student welfare ecosystem.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="flex h-full flex-col gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">Student</p>
              <h2 className="text-xl font-semibold text-slate-900">Al-Talib Mobile</h2>
              <p className="mt-2 text-sm text-slate-600">
                Book appointments, track prescriptions, and follow prevention campaigns from your phone.
              </p>
            </div>
            <div className="mt-auto">
              <Link to="/login/student">
                <Button className="w-full">Student Login</Button>
              </Link>
            </div>
          </Card>

          <Card className="flex h-full flex-col gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">Medical Staff</p>
              <h2 className="text-xl font-semibold text-slate-900">EduSihha Platform</h2>
              <p className="mt-2 text-sm text-slate-600">
                Manage consultations, triage, prescriptions, and clinical records with role-based access.
              </p>
            </div>
            <div className="mt-auto">
              <Link to="/login/medical">
                <Button className="w-full">Medical Login</Button>
              </Link>
            </div>
          </Card>

          <Card className="flex h-full flex-col gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">Administration</p>
              <h2 className="text-xl font-semibold text-slate-900">EduPlan Dashboard</h2>
              <p className="mt-2 text-sm text-slate-600">
                Monitor regional and national healthcare KPIs, campaigns, and compliance signals.
              </p>
            </div>
            <div className="mt-auto">
              <Link to="/login/admin">
                <Button className="w-full">Admin Login</Button>
              </Link>
            </div>
          </Card>
        </div>

        <Card className="flex flex-col gap-2 bg-brand-50">
          <h3 className="text-lg font-semibold text-slate-900">Prototype scope</h3>
          <p className="text-sm text-slate-600">
            The healthcare module is fully interactive. Accommodation and activities are visible as preview cards within the
            student app.
          </p>
        </Card>
      </div>
    </div>
  )
}
