import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, Calendar, UserCheck, ClipboardList, TrendingUp, Activity } from 'lucide-react'
import api from '../../lib/api'
import StatCard from '../../components/ui/StatCard'
import PageHeader from '../../components/ui/PageHeader'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then(r => r.data)
  })

  const barData = stats ? [
    { name: 'Pending',    value: stats.pending ?? 0 },
    { name: 'Scheduled', value: Number(stats.scheduledInterviews ?? 0) },
    { name: 'Completed', value: Number(stats.completedInterviews ?? 0) },
    { name: 'Selected',  value: stats.selected ?? 0 },
    { name: 'Rejected',  value: stats.rejected ?? 0 },
  ] : []

  const pieData = stats ? [
    { name: 'HR',          value: stats.totalHR ?? 0 },
    { name: 'Interviewers',value: stats.totalInterviewers ?? 0 },
  ] : []

  if (isLoading) return <LoadingState />

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" subtitle="System overview and analytics" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Candidates" value={stats?.totalCandidates}  icon={UserCheck} color="blue"   delay={0}    />
        <StatCard label="Total Interviews" value={stats?.totalInterviews}  icon={Calendar}  color="violet" delay={0.05} />
        <StatCard label="HR Members"       value={stats?.totalHR}           icon={Users}     color="green"  delay={0.1}  />
        <StatCard label="Interviewers"     value={stats?.totalInterviewers} icon={ClipboardList} color="amber" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-slate-900 text-sm">Pipeline Overview</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={28}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                cursor={{ fill: '#ffffff08' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-violet-400" />
            <h3 className="font-semibold text-slate-900 text-sm">Team Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={4}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                {d.name}: {d.value}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-5 h-20 animate-pulse bg-slate-50/60" />
        ))}
      </div>
    </div>
  )
}
