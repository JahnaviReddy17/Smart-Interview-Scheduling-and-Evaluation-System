import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { UserCheck, Calendar, ClipboardCheck, Clock, UserPlus, CalendarPlus, FileText, ArrowUpRight, TrendingUp, Users, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import { useAuth } from '../../lib/auth'
import StatCard from '../../components/ui/StatCard'

export default function HrDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: stats } = useQuery({
    queryKey: ['hr-dashboard'],
    queryFn: () => api.get('/hr/dashboard').then(r => r.data)
  })

  const { data: candidates = [] } = useQuery({
    queryKey: ['hr-candidates-recent'],
    queryFn: () => api.get('/hr/candidates').then(r => r.data.slice(0, 5))
  })

  const areaData = [
    { month: 'Jan', candidates: 4 },
    { month: 'Feb', candidates: 7 },
    { month: 'Mar', candidates: 5 },
    { month: 'Apr', candidates: 10 },
    { month: 'May', candidates: 8 },
    { month: 'Jun', candidates: stats?.totalCandidates ?? 12 },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8 pb-10"
    >
      {/* Welcome Hero */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.fullName?.split(' ')[0] || 'HR'}! 👋</h1>
            <p className="mt-2 text-slate-400 max-w-md">
              You have <span className="text-blue-400 font-semibold">{stats?.pendingDecisions || 0} pending decisions</span> to make today. 
              Let's find the best talent for your team.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/hr/candidates')}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-all active:scale-95"
            >
              <Users className="w-4 h-4" /> View All
            </button>
            <button 
              onClick={() => navigate('/hr/candidates')}
              className="flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" /> Hire Talent
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Candidates"    value={stats?.totalCandidates}     icon={UserCheck}      color="blue"   />
        <StatCard label="Interviews Fixed"    value={stats?.scheduledInterviews} icon={Calendar}       color="violet" />
        <StatCard label="Completed"           value={stats?.completedInterviews} icon={ClipboardCheck} color="green"  />
        <StatCard label="Pending Decision"    value={stats?.pendingDecisions}    icon={Clock}          color="amber"  />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-6 border-slate-200/50 shadow-sm relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-24 h-24 text-blue-500" />
          </div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Hiring Insights</h3>
              <p className="text-xs text-slate-500">Candidate growth over the last 6 months</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-blue-600 text-[10px] font-bold uppercase tracking-wider">
              <Zap className="w-3 h-3" /> Live Updates
            </div>
          </div>

          <div className="h-[280px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#64748b', fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#ffffff', 
                    border: 'none', 
                    borderRadius: '16px', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#1e293b'
                  }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="candidates" 
                  stroke="#3b82f6" 
                  fill="url(#grad)" 
                  strokeWidth={3} 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions Side Panel */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="glass-card p-6 border-slate-200/50">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Quick Shortcuts</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Register Candidate', icon: UserPlus, color: 'bg-blue-50 text-blue-600', path: '/hr/candidates' },
                { label: 'Set Interview', icon: CalendarPlus, color: 'bg-violet-50 text-violet-600', path: '/hr/interviews' },
                { label: 'Review Results', icon: FileText, color: 'bg-emerald-50 text-emerald-600', path: '/hr/evaluations' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{action.label}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 border-slate-200/50 bg-gradient-to-br from-indigo-600 to-violet-700 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform duration-700" />
            <h4 className="font-bold text-sm mb-1 relative z-10">AI Insights Available</h4>
            <p className="text-[11px] text-indigo-100 mb-3 relative z-10">All candidate evaluations now include AI-powered skill analysis.</p>
            <button className="text-[11px] font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors relative z-10">
              Explore Now
            </button>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Table */}
      <motion.div variants={itemVariants} className="glass-card border-slate-200/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-lg">My Recent Candidates</h3>
          <button 
            onClick={() => navigate('/hr/candidates')}
            className="text-blue-600 text-xs font-bold hover:underline"
          >
            View Full List
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-left">
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">Candidate</th>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">Role</th>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">Status</th>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode='popLayout'>
                {candidates.length > 0 ? candidates.map((c, i) => (
                  <motion.tr 
                    key={c.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {c.fullName?.[0]}
                        </div>
                        <span className="font-semibold text-slate-700">{c.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{c.jobRole}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight
                        ${c.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-700' : 
                          c.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                          c.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">
                      No candidates created yet. Click 'Hire Talent' to begin.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
