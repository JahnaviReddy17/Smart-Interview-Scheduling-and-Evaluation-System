import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAuth } from '../lib/auth'
import { BrainCircuit, Eye, EyeOff, Lock, User, Sparkles, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const credentials = [
  { role: 'HR',          user: 'hr1',         pass: 'hr123', color: 'violet' },
  { role: 'Interviewer', user: 'interviewer1',pass: 'int123', color: 'emerald' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  useEffect(() => {
    setMounted(true)
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await login(data.username, data.password)
      toast.success(`Welcome back, ${user.fullName}!`, {
        icon: '👋',
        style: { borderRadius: '12px', background: '#f8fafc', color: '#0f172a' }
      })
      const map = { ADMIN: '/admin', HR: '/hr', INTERVIEWER: '/interviewer', APPLICANT: '/applicant' }
      navigate(map[user.role] || '/')
    } catch (error) {
      console.error("Login failed:", error);
      const msg = error.response?.data?.message || error.message || 'Invalid username or password';
      toast.error(`Login failed: ${msg}`);
    } finally {
      setLoading(false)
    }
  }

  const fillCredential = (user, pass) => {
    setValue('username', user, { shouldValidate: true })
    setValue('password', pass, { shouldValidate: true })
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, -80, 0], y: [0, 120, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -right-24 w-80 h-80 bg-violet-400/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, -100, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 left-1/3 w-96 h-96 bg-indigo-400/10 rounded-full blur-[100px]" 
        />
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header Section */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15 }}
              className="inline-flex relative"
            >
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
              <div className="relative w-20 h-20 rounded-[24px] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-xl shadow-blue-500/20 border border-white/20">
                <BrainCircuit className="w-10 h-10 text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-extrabold text-slate-900 mt-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700"
            >
              SmartInterview
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-slate-500 font-medium mt-2"
            >
              Scheduling. Evaluation. Intelligence.
            </motion.p>
          </div>

          {/* Main Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-[32px] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative glass-card p-10 bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[32px]">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Username</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      {...register('username', { required: 'Username is required' })}
                      placeholder="e.g. johndoe"
                      className="input-field pl-12 bg-slate-50/50 border-slate-200/60 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 rounded-2xl py-3.5"
                    />
                  </div>
                  {errors.username && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-xs font-medium mt-1.5 ml-1">
                      {errors.username.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      {...register('password', { required: 'Password is required' })}
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="input-field pl-12 pr-12 bg-slate-50/50 border-slate-200/60 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 rounded-2xl py-3.5"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-xs font-medium mt-1.5 ml-1">
                      {errors.password.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02, backgroundColor: '#1d4ed8' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-70 group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Quick Credentials Section */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-10"
              >
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                      <span className="relative bg-white px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[2px]">
                      Demo Access (HR & Interviewer)
                    </span>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {credentials.map((c, idx) => (
                    <motion.button
                      key={c.role}
                      type="button"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.1 + (idx * 0.1) }}
                      whileHover={{ y: -4, borderColor: `rgba(59, 130, 246, 0.3)`, backgroundColor: '#fff' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fillCredential(c.user, c.pass)}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/50 border border-slate-100/80 transition-all duration-300"
                    >
                      <span className="text-[11px] font-extrabold text-slate-800 mb-1">{c.role}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        c.color === 'blue' ? 'bg-blue-500' : c.color === 'violet' ? 'bg-violet-500' : 'bg-emerald-500'
                      }`} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center text-slate-400 text-xs mt-8 font-medium"
          >
            Powered by Next-Gen AI & Evaluation Logic
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
