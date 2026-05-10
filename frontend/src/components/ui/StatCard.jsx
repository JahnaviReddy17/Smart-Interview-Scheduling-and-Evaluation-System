import { motion } from 'framer-motion'

export default function StatCard({ label, value, icon: Icon, color = 'blue', delay = 0 }) {
  const colors = {
    blue:   'from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/20',
    green:  'from-green-500/20 to-green-600/10 text-green-400 border-green-500/20',
    violet: 'from-violet-500/20 to-violet-600/10 text-violet-400 border-violet-500/20',
    amber:  'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/20',
    red:    'from-red-500/20 to-red-600/10 text-red-400 border-red-500/20',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-card p-5 flex items-start gap-4 hover:border-slate-300/50 transition-all duration-300"
    >
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center flex-shrink-0 border`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value ?? '—'}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}
