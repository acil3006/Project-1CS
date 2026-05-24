import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Field, TextInput } from '../components/common/Field'
import { Select } from '../components/common/Select'
import { useAppContext } from '../app/AppContext'
import type { AdminScope } from '../types'

export function AdminLogin() {
  const { loginAdmin } = useAppContext()
  const navigate = useNavigate()
  const [adminId, setAdminId] = useState('DOU-ALGIERS')
  const [password, setPassword] = useState('admin123')
  const [scope, setScope] = useState<AdminScope>('DOU')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const result = loginAdmin(adminId, password, scope)
    if (!result.success) {
      setError(result.message ?? 'Login failed.')
      return
    }
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <header>
          <Link to="/" className="text-sm font-semibold text-brand-600">
            ← Back to access selection
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">Administration access • EduPlan</h1>
          <p className="text-sm text-slate-600">Regional and national views adapt based on the chosen scope.</p>
        </header>

        <Card>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field label="Admin ID">
              <TextInput value={adminId} onChange={(event) => setAdminId(event.target.value)} />
            </Field>
            <Field label="Password">
              <TextInput type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </Field>
            <Field label="Scope">
              <Select value={scope} onChange={(event) => setScope(event.target.value as AdminScope)}>
                <option value="DOU">Regional DOU</option>
                <option value="ONOU">National ONOU</option>
              </Select>
            </Field>
            {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
            <Button type="submit">Access EduPlan</Button>
          </form>
        </Card>

        <Card className="bg-brand-50">
          <h2 className="text-sm font-semibold text-slate-900">Mock credentials</h2>
          <p className="text-sm text-slate-600">DOU: DOU-ALGIERS / admin123</p>
          <p className="text-sm text-slate-600">ONOU: ONOU-NATIONAL / admin123</p>
        </Card>
      </div>
    </div>
  )
}
