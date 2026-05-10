import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../lib/auth'
import {
  LayoutDashboard, Users, UserCheck, Calendar, ClipboardList,
  LogOut, BrainCircuit, ChevronRight, Bell
} from 'lucide-react'

const navMap = {
  ADMIN: [
    { label: 'Dashboard',   path: '/admin',        icon: LayoutDashboard },
    { label: 'Users',        path: '/admin/users',  icon: Users },
  ],
  HR: [
    { label: 'Dashboard',   path: '/hr',              icon: LayoutDashboard },
    { label: 'Candidates',  path: '/hr/candidates',   icon: UserCheck },
    { label: 'Interviews',  path: '/hr/interviews',   icon: Calendar },
    { label: 'Evaluations', path: '/hr/evaluations',  icon: ClipboardList },
  ],
  INTERVIEWER: [
    { label: 'Dashboard',   path: '/interviewer',     icon: LayoutDashboard },
  ],
  APPLICANT: [
    { label: 'Dashboard',   path: '/applicant',       icon: LayoutDashboard },
  ]
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navItems = navMap[user?.role] ?? []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="w-64 flex flex-col bg-white/80 backdrop-blur-xl border-r border-slate-200"
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <BrainCircuit className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm leading-tight">SmartInterview</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-700'}`} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto text-blue-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
              {user?.fullName?.[0] ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-500 truncate">{user?.username}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 flex items-center justify-between px-6 border-b border-slate-200 bg-white/50 backdrop-blur-xl">
          <div />
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-400" />
            </button>
            <div className="text-xs text-slate-500">
              Welcome back, <span className="text-slate-700 font-medium">{user?.fullName?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
