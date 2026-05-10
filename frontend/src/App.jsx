import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import AppLayout from './components/layout/AppLayout'

import Login from './pages/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import HrDashboard from './pages/hr/Dashboard'
import HrCandidates from './pages/hr/Candidates'
import HrInterviews from './pages/hr/Interviews'
import HrEvaluations from './pages/hr/Evaluations'
import InterviewerDashboard from './pages/interviewer/Dashboard'
import ApplicantDashboard from './pages/applicant/Dashboard'

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />
  return children
}

function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  const map = { ADMIN: '/admin', HR: '/hr', INTERVIEWER: '/interviewer', APPLICANT: '/applicant' }
  return <Navigate to={map[user.role] || '/login'} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RoleRedirect />} />

          <Route element={<ProtectedRoute roles={['ADMIN']}><AppLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>

          <Route element={<ProtectedRoute roles={['HR', 'ADMIN']}><AppLayout /></ProtectedRoute>}>
            <Route path="/hr" element={<HrDashboard />} />
            <Route path="/hr/candidates" element={<HrCandidates />} />
            <Route path="/hr/interviews" element={<HrInterviews />} />
            <Route path="/hr/evaluations" element={<HrEvaluations />} />
          </Route>

          <Route element={<ProtectedRoute roles={['INTERVIEWER', 'ADMIN']}><AppLayout /></ProtectedRoute>}>
            <Route path="/interviewer" element={<InterviewerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute roles={['APPLICANT', 'ADMIN']}><AppLayout /></ProtectedRoute>}>
            <Route path="/applicant" element={<ApplicantDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
