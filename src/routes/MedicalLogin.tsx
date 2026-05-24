import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Field, TextInput } from '../components/common/Field'
import { Select } from '../components/common/Select'
import { useAppContext } from '../app/AppContext'
import type { MedicalRole } from '../types'

export function MedicalLogin() {
  const { loginMedical } = useAppContext()
  const navigate = useNavigate()
  const [professionalId, setProfessionalId] = useState('NUR-2001')
  const [password, setPassword] = useState('nurse123')
  const [role, setRole] = useState<MedicalRole>('NURSE')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const result = loginMedical(professionalId, password, role)
    if (!result.success) {
      setError(result.message ?? 'Login failed.')
      return
    }
    navigate('/medical')
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <header>
          <Link to="/" className="text-sm font-semibold text-brand-600">
            ← Back to access selection
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">Medical staff access • EduSihha</h1>
          <p className="text-sm text-slate-600">
            Doctors and nurses share the same platform with role-based permissions.
          </p>
        </header>

        <Card>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field label="Professional ID">
              <TextInput
                value={professionalId}
                onChange={(event) => setProfessionalId(event.target.value)}
                placeholder="DOC-1001"
              />
            </Field>
            <Field label="Password">
              <TextInput
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="doctor123"
              />
            </Field>
            <Field label="Role">
              <Select value={role} onChange={(event) => setRole(event.target.value as MedicalRole)}>
                <option value="DOCTOR">Doctor</option>
                <option value="NURSE">Nurse</option>
              </Select>
            </Field>
            {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
            <Button type="submit">Access EduSihha</Button>
          </form>
        </Card>

        <Card className="bg-brand-50">
          <h2 className="text-sm font-semibold text-slate-900">Mock credentials</h2>
          <p className="text-sm text-slate-600">Doctor: DOC-1001 / doctor123</p>
          <p className="text-sm text-slate-600">Nurse: NUR-2001 / nurse123</p>
        </Card>
      </div>
    </div>
  )
}
