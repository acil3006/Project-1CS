import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Field, TextInput } from '../components/common/Field'
import { useAppContext } from '../app/AppContext'

export function StudentLogin() {
  const { loginStudent } = useAppContext()
  const navigate = useNavigate()
  const [bac, setBac] = useState('12345678')
  const [password, setPassword] = useState('BAC2026')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!/^[0-9]{8}$/.test(bac)) {
      setError('Bac registration number must be exactly 8 digits.')
      return
    }
    const result = loginStudent(bac, password)
    if (!result.success) {
      setError(result.message ?? 'Login failed.')
      return
    }
    navigate('/student')
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <header>
          <Link to="/" className="text-sm font-semibold text-brand-600">
            ← Back to access selection
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">Student access • Al-Talib</h1>
          <p className="text-sm text-slate-600">Use your BAC credentials to access student healthcare services.</p>
        </header>

        <Card>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field label="Bac registration number" message="8 digits required">
              <TextInput value={bac} onChange={(event) => setBac(event.target.value)} placeholder="12345678" />
            </Field>
            <Field label="Secret BAC password">
              <TextInput
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="BAC2026"
              />
            </Field>
            {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
            <Button type="submit">Access Al-Talib</Button>
          </form>
        </Card>

        <Card className="bg-brand-50">
          <h2 className="text-sm font-semibold text-slate-900">Mock credentials</h2>
          <p className="text-sm text-slate-600">Bac registration number: 12345678</p>
          <p className="text-sm text-slate-600">Secret password: BAC2026</p>
        </Card>
      </div>
    </div>
  )
}
