import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './index.css'
import {
  clearStoredState,
  loadPlatformState,
  loadSession,
  savePlatformState,
  saveSession,
} from './auth/authStore'
import { Card } from './components/common/Card'
import { Badge } from './components/common/Badge'
import { initialPlatformState } from './data/mockData'
import type { AdminScope, AppointmentType, PlatformState, Session, StaffRole } from './types/models'
import { formatDateTime, titleCase } from './utils/format'

const tone = (value: string) =>
  ['COMPLETED', 'DISPENSED', 'Verified', 'Published', 'Resolved'].includes(value)
    ? 'success'
    : ['PENDING', 'ISSUED', 'READY', 'Under review', 'Pending verification'].includes(value)
      ? 'warning'
      : ['CONFIRMED', 'IN_PROGRESS', 'Assigned'].includes(value)
        ? 'info'
        : 'neutral'

function App() {
  const [session, setSession] = useState<Session | null>(() => loadSession())
  const [state, setState] = useState<PlatformState>(() => loadPlatformState() ?? initialPlatformState)
  const [portal, setPortal] = useState('student-home')
  const [error, setError] = useState('')
  const [studentLogin, setStudentLogin] = useState({ bac: '', password: '' })
  const [staffLogin, setStaffLogin] = useState({ id: '', password: '', role: 'DOCTOR' as StaffRole })
  const [adminLogin, setAdminLogin] = useState({ id: '', password: '', scope: 'DOU' as AdminScope })
  const [bookType, setBookType] = useState<AppointmentType>('ON_SITE')

  const saveAll = (nextState: PlatformState, nextSession?: Session | null) => {
    setState(nextState)
    savePlatformState(nextState)
    if (nextSession !== undefined) {
      setSession(nextSession)
      saveSession(nextSession)
    }
  }

  const student = state.students[0]
  const doctor = state.medicalStaff.find((item) => item.role === 'DOCTOR')
  const nurse = state.medicalStaff.find((item) => item.role === 'NURSE')
  const metrics = useMemo(
    () => ({
      appointments: state.appointments.length,
      completed: state.appointments.filter((a) => a.status === 'COMPLETED').length,
      tele: state.appointments.filter((a) => a.type === 'TELECONSULTATION').length,
      dispensed: state.prescriptions.filter((p) => p.status === 'DISPENSED').length,
      lowStock: state.stockItems.filter((s) => s.quantity <= s.threshold).length,
    }),
    [state],
  )

  const addAudit = (nextState: PlatformState, action: string, actor: string) => ({
    ...nextState,
    auditLogs: [{ id: crypto.randomUUID(), action, actor, time: new Date().toISOString() }, ...nextState.auditLogs],
  })

  const submitLogin = (event: FormEvent, mode: 'student' | 'medical' | 'admin') => {
    event.preventDefault()
    setError('')
    if (mode === 'student') {
      if (!/^\d{8}$/.test(studentLogin.bac)) return setError('Baccalaureate registration number must be exactly 8 digits.')
      if (studentLogin.bac === '12345678' && studentLogin.password === 'BAC2026') return saveAll(state, { portal: 'student', userId: student.id })
      return setError('Invalid student credentials.')
    }
    if (mode === 'medical') {
      const user = state.medicalStaff.find((m) => m.professionalId === staffLogin.id && m.role === staffLogin.role)
      const ok = (staffLogin.id === 'DOC-1001' && staffLogin.password === 'doctor123') || (staffLogin.id === 'NUR-2001' && staffLogin.password === 'nurse123')
      if (user && ok) return saveAll(state, { portal: 'medical', userId: user.id, role: user.role })
      return setError('Invalid medical staff credentials.')
    }
    const adminOk = (adminLogin.id === 'DOU-ALGIERS' && adminLogin.password === 'admin123' && adminLogin.scope === 'DOU') || (adminLogin.id === 'ONOU-NATIONAL' && adminLogin.password === 'admin123' && adminLogin.scope === 'ONOU')
    if (adminOk) return saveAll(state, { portal: 'admin', userId: adminLogin.id, scope: adminLogin.scope })
    setError('Invalid admin credentials.')
  }

  const createStudentAppointment = () => {
    if (!doctor) return
    const appointmentId = `appt-${Date.now()}`
    const consultationId = `cons-${Date.now()}`
    const prescriptionId = `rx-${Date.now()}`
    let nextState: PlatformState = {
      ...state,
      appointments: [{ id: appointmentId, studentId: student.id, reason: 'General consultation', symptoms: 'fever and headache', preferredDate: new Date().toISOString().slice(0, 10), timeSlot: '09:30', type: bookType, status: 'PENDING' }, ...state.appointments],
    }
    nextState = addAudit(nextState, 'Appointment request created', student.fullName)
    nextState = addAudit({ ...nextState, appointments: nextState.appointments.map((a) => (a.id === appointmentId ? { ...a, status: 'CONFIRMED', priority: 'NORMAL', assignedDoctorId: doctor.id } : a)) }, 'Appointment validated by nurse', nurse?.fullName ?? 'Nurse')
    nextState = addAudit({ ...nextState, triages: [{ id: `triage-${Date.now()}`, appointmentId, nurseId: nurse?.id ?? 'nur-001', temperature: '38.2', bloodPressure: '120/80', heartRate: '92', symptoms: 'fever, headache, fatigue', painLevel: '4', emergencyFlag: false, notes: 'Patient stable and ready for doctor consultation.' }, ...nextState.triages] }, 'Triage saved', nurse?.fullName ?? 'Nurse')
    nextState = addAudit({ ...nextState, appointments: nextState.appointments.map((a) => (a.id === appointmentId ? { ...a, status: 'COMPLETED' } : a)), consultations: [{ id: consultationId, appointmentId, doctorId: doctor.id, diagnosis: 'Seasonal flu suspicion', notes: 'Rest, hydration, fever monitoring. Return if symptoms persist beyond 72 hours.', prescriptionId, status: 'FINALIZED' }, ...nextState.consultations], prescriptions: [{ id: prescriptionId, consultationId, medication: 'Paracetamol 500mg', dosage: '1 tablet every 8 hours', duration: '3 days', instructions: 'After meals', status: 'ISSUED' }, ...nextState.prescriptions] }, 'Consultation finalized and prescription issued', doctor.fullName)
    nextState = addAudit({ ...nextState, prescriptions: nextState.prescriptions.map((p) => (p.id === prescriptionId ? { ...p, status: 'DISPENSED', dispensedBy: nurse?.id, dispensedAt: new Date().toISOString() } : p)), stockItems: nextState.stockItems.map((s) => (s.name.startsWith('Paracetamol') ? { ...s, quantity: Math.max(s.quantity - 3, 0) } : s)), notifications: [{ id: crypto.randomUUID(), studentId: student.id, message: 'Your prescription has been dispensed.', timestamp: new Date().toISOString() }, ...nextState.notifications] }, 'Prescription dispensed', nurse?.fullName ?? 'Nurse')
    nextState = addAudit({ ...nextState, campaigns: [{ id: `camp-${Date.now()}`, title: 'Seasonal Flu Prevention Campaign', type: 'Awareness', target: 'University residences in Algiers', startDate: '2026-06-15', endDate: '2026-07-05', status: 'Published', description: 'Awareness and vaccination support campaign.' }, ...nextState.campaigns] }, 'Campaign published', 'DOU Admin')
    saveAll(nextState)
    setPortal('student-tracking')
  }

  if (!session) {
    return (
      <main className="app-shell login-page">
        <h1>Aethera Student Welfare Platform</h1>
        <p>Login selector for Al-Talib, EduSihha, and EduPlan with centralized gateway and role-based access.</p>
        <div className="login-grid">
          <Card title="Student — Al-Talib">
            <form className="form" onSubmit={(event) => submitLogin(event, 'student')}>
              <label>BAC registration number<input value={studentLogin.bac} onChange={(e) => setStudentLogin({ ...studentLogin, bac: e.target.value })} placeholder="12345678" /></label>
              <label>Secret BAC password<input type="password" value={studentLogin.password} onChange={(e) => setStudentLogin({ ...studentLogin, password: e.target.value })} placeholder="BAC2026" /></label>
              <button className="btn-primary" type="submit">Sign in Student</button>
            </form>
          </Card>
          <Card title="Medical Staff — EduSihha">
            <form className="form" onSubmit={(event) => submitLogin(event, 'medical')}>
              <label>Professional ID<input value={staffLogin.id} onChange={(e) => setStaffLogin({ ...staffLogin, id: e.target.value })} placeholder="DOC-1001 / NUR-2001" /></label>
              <label>Password<input type="password" value={staffLogin.password} onChange={(e) => setStaffLogin({ ...staffLogin, password: e.target.value })} /></label>
              <label>Role<select value={staffLogin.role} onChange={(e) => setStaffLogin({ ...staffLogin, role: e.target.value as StaffRole })}><option value="DOCTOR">Doctor</option><option value="NURSE">Nurse</option></select></label>
              <button className="btn-primary" type="submit">Sign in Medical</button>
            </form>
          </Card>
          <Card title="DOU/ONOU Admin — EduPlan">
            <form className="form" onSubmit={(event) => submitLogin(event, 'admin')}>
              <label>Admin ID<input value={adminLogin.id} onChange={(e) => setAdminLogin({ ...adminLogin, id: e.target.value })} placeholder="DOU-ALGIERS / ONOU-NATIONAL" /></label>
              <label>Password<input type="password" value={adminLogin.password} onChange={(e) => setAdminLogin({ ...adminLogin, password: e.target.value })} /></label>
              <label>Scope<select value={adminLogin.scope} onChange={(e) => setAdminLogin({ ...adminLogin, scope: e.target.value as AdminScope })}><option value="DOU">Regional DOU</option><option value="ONOU">National ONOU</option></select></label>
              <button className="btn-primary" type="submit">Sign in Admin</button>
            </form>
          </Card>
        </div>
        {error ? <p className="error-text">{error}</p> : null}
        <div className="row">
          <button className="btn-secondary" onClick={createStudentAppointment}>Run guided scenario (steps 3-10)</button>
          <button className="btn-ghost" onClick={() => { clearStoredState(); saveAll(initialPlatformState) }}>Reset demo state</button>
        </div>
      </main>
    )
  }

  if (session.portal === 'student') {
    const appointment = state.appointments[0]
    return <main className="student-mobile-layout"><div className="mobile-shell"><header className="mobile-header"><div><p className="kicker">Al-Talib mobile app</p><h2>Welcome {student.fullName}</h2></div><button className="btn-ghost" onClick={() => saveAll(state, null)}>Logout</button></header><Card><p>Name: {student.fullName}</p><p>BAC: {student.bacRegistrationNumber}</p><p>{student.university} • {student.residence}</p></Card><div className="module-row"><Card><h3>Accommodation</h3><p>Available soon in prototype</p></Card><Card><h3>Healthcare</h3><p>Main demo module</p></Card><Card><h3>Activities</h3><p>Available soon in prototype</p></Card></div><div className="bottom-nav">{['student-home','student-booking','student-tracking','student-tele','student-documents','student-prescriptions','student-campaigns'].map((item) => <button key={item} className={portal===item ? 'active' : ''} onClick={() => setPortal(item)}>{titleCase(item.replace('student-',''))}</button>)}</div><Card title="Healthcare workspace">{portal==='student-booking' ? <div><label>Type<select value={bookType} onChange={(e) => setBookType(e.target.value as AppointmentType)}><option value="ON_SITE">On-site</option><option value="TELECONSULTATION">Teleconsultation</option></select></label><button className="btn-primary" onClick={createStudentAppointment}>Submit appointment request</button></div> : null}{portal==='student-tracking' ? <div><p>Status: {appointment ? <Badge label={titleCase(appointment.status)} tone={tone(appointment.status) as 'info' | 'success' | 'warning' | 'danger' | 'neutral'} /> : 'No appointment'}</p><ol className="timeline"><li className="done">Request submitted</li><li className={appointment && appointment.status !== 'PENDING' ? 'done' : ''}>Validated by nurse</li><li className={appointment && appointment.assignedDoctorId ? 'done' : ''}>Assigned to doctor</li><li className={appointment && ['IN_PROGRESS','COMPLETED'].includes(appointment.status) ? 'done' : ''}>Consultation scheduled</li><li className={appointment && appointment.status === 'COMPLETED' ? 'done' : ''}>Completed</li></ol></div> : null}{portal==='student-prescriptions' ? <table><thead><tr><th>Medication</th><th>Status</th></tr></thead><tbody>{state.prescriptions.map((p) => <tr key={p.id}><td>{p.medication}</td><td><Badge label={titleCase(p.status)} tone={tone(p.status) as 'info' | 'success' | 'warning' | 'danger' | 'neutral'} /></td></tr>)}</tbody></table> : null}{portal==='student-campaigns' ? <div className="stack">{state.campaigns.map((c) => <Card key={c.id}><h4>{c.title}</h4><p>{c.type} • {c.target}</p><Badge label={c.status} tone={tone(c.status) as 'info' | 'success' | 'warning' | 'danger' | 'neutral'} /></Card>)}</div> : null}{portal==='student-home' ? <ul className="simple-list">{state.notifications.filter((n) => n.studentId === student.id).slice(0,4).map((n) => <li key={n.id}>{n.message}</li>)}</ul> : null}{portal==='student-tele' ? <p>Teleconsultation request status: <Badge label="Pending" tone="warning" /> <button className="btn-secondary">Join session when approved</button></p> : null}{portal==='student-documents' ? <table><thead><tr><th>Document</th><th>Status</th></tr></thead><tbody>{state.documents.filter((d) => d.studentId === student.id).map((d) => <tr key={d.id}><td>{d.name}</td><td><Badge label={d.status} tone={tone(d.status) as 'info' | 'success' | 'warning' | 'danger' | 'neutral'} /></td></tr>)}</tbody></table> : null}</Card></div></main>
  }

  if (session.portal === 'medical') {
    const role = session.role ?? 'NURSE'
    return <main className="web-layout"><aside className="sidebar"><h2>EduSihha</h2><p>Role-based platform</p><Badge label={role === 'DOCTOR' ? 'Doctor interface' : 'Nurse interface'} tone="info" /><nav>{(role === 'DOCTOR' ? ['Dashboard','Appointment Calendar','Patient Records','Consultations','Teleconsultations','Prescriptions','Referrals','Medical Certificates','Reports'] : ['Dashboard','Appointment Queue','Walk-in Registration','Triage','Document Verification','Prescription Dispensing','Stock & Equipment','Patient Orientation']).map((item) => <button key={item} className={portal===item ? 'active' : ''} onClick={() => setPortal(item)}>{item}</button>)}</nav></aside><section className="content"><header className="topbar"><div><h1>{portal}</h1><p>{role === 'DOCTOR' ? 'Dr. Samir Haddad' : 'Nurse Amina Bensaid'}</p></div><button className="btn-ghost" onClick={() => saveAll(state, null)}>Logout</button></header><Card><p>API gateway active • RBAC enabled • Notification center online</p></Card>{role === 'DOCTOR' ? <Card title="Doctor tools"><p>Consultation notes, diagnosis, prescriptions, referrals, certificates and teleconsultations.</p><button className="btn-primary" onClick={createStudentAppointment}>Run full consultation flow</button></Card> : <Card title="Nurse tools"><p>Queue validation, triage, dispensing, stock visibility, document verification.</p><div className="row"><button disabled title="Doctor authorization required">Final diagnosis</button><button disabled title="Doctor authorization required">Issue final prescription</button></div></Card>}<table><thead><tr><th>Appointment</th><th>Status</th><th>Priority</th></tr></thead><tbody>{state.appointments.map((a) => <tr key={a.id}><td>{a.reason}</td><td><Badge label={titleCase(a.status)} tone={tone(a.status) as 'info' | 'success' | 'warning' | 'danger' | 'neutral'} /></td><td>{a.priority ?? 'NORMAL'}</td></tr>)}</tbody></table><table><thead><tr><th>Prescription</th><th>Status</th></tr></thead><tbody>{state.prescriptions.map((p) => <tr key={p.id}><td>{p.medication}</td><td><Badge label={titleCase(p.status)} tone={tone(p.status) as 'info' | 'success' | 'warning' | 'danger' | 'neutral'} /></td></tr>)}</tbody></table></section></main>
  }

  return <main className="web-layout"><aside className="sidebar"><h2>EduPlan</h2><p>{session.scope === 'ONOU' ? 'National ONOU dashboard' : 'Regional DOU dashboard'}</p><Badge label="Security & Traceability" tone="info" /><nav>{['Overview','Analytics','Campaign Management','Staff & Operations','Stock & Equipment Alerts','Compliance Reporting','Escalated Issues'].map((item) => <button key={item} className={portal===item ? 'active' : ''} onClick={() => setPortal(item)}>{item}</button>)}</nav></aside><section className="content"><header className="topbar"><h1>{portal}</h1><button className="btn-ghost" onClick={() => saveAll(state, null)}>Logout</button></header><Card title="Security panel"><div className="grid-four"><article className="metric-card"><p>API gateway</p><strong>Active</strong></article><article className="metric-card"><p>RBAC</p><strong>Enabled</strong></article><article className="metric-card"><p>Audit logs</p><strong>{state.auditLogs.length}</strong></article><article className="metric-card"><p>Data hosting</p><strong>National-ready</strong></article></div></Card><Card title="Overview KPIs"><div className="grid-four"><article className="metric-card"><p>Appointments</p><strong>{metrics.appointments}</strong></article><article className="metric-card"><p>Completed consultations</p><strong>{metrics.completed}</strong></article><article className="metric-card"><p>Teleconsultations</p><strong>{metrics.tele}</strong></article><article className="metric-card"><p>Prescriptions dispensed</p><strong>{metrics.dispensed}</strong></article><article className="metric-card"><p>Low stock alerts</p><strong>{metrics.lowStock}</strong></article><article className="metric-card"><p>Staffing gap alerts</p><strong>2</strong></article></div></Card><Card title="Audit actions"><table><thead><tr><th>Action</th><th>Actor</th><th>Time</th></tr></thead><tbody>{state.auditLogs.slice(0,8).map((a) => <tr key={a.id}><td>{a.action}</td><td>{a.actor}</td><td>{formatDateTime(a.time)}</td></tr>)}</tbody></table></Card><Card title="Escalated issues"><table><thead><tr><th>Issue</th><th>Status</th></tr></thead><tbody>{state.escalatedIssues.map((issue) => <tr key={issue.id}><td>{issue.title}</td><td><Badge label={issue.status} tone={tone(issue.status) as 'info' | 'success' | 'warning' | 'danger' | 'neutral'} /></td></tr>)}</tbody></table></Card></section></main>
}

export default App
