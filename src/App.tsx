import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminApp } from './routes/AdminApp'
import { AdminLogin } from './routes/AdminLogin'
import { LoginLanding } from './routes/LoginLanding'
import { MedicalApp } from './routes/MedicalApp'
import { MedicalLogin } from './routes/MedicalLogin'
import { StudentApp } from './routes/StudentApp'
import { StudentLogin } from './routes/StudentLogin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginLanding />} />
      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/login/medical" element={<MedicalLogin />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/student/*" element={<StudentApp />} />
      <Route path="/medical/*" element={<MedicalApp />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
