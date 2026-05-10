import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Calendar, User, Star, Award, Clock, CheckCircle, XCircle, Video, BrainCircuit } from 'lucide-react'
import dayjs from 'dayjs'
import api from '../../lib/api'
import PageHeader from '../../components/ui/PageHeader'

const statusColors = {
  PENDING:    { label: 'Application Pending',  color: 'badge-yellow', icon: Clock },
  SCHEDULED:  { label: 'Interview Scheduled',  color: 'badge-blue',   icon: Calendar },
  INTERVIEWED:{ label: 'Interview Completed',  color: 'badge-purple', icon: Star },
  SELECTED:   { label: 'Selected!',            color: 'badge-green',  icon: CheckCircle },
  REJECTED:   { label: 'Not Selected',         color: 'badge-red',    icon: XCircle },
}

const steps = ['Applied', 'Scheduled', 'Interviewed', 'Decision']
const stepMap = { PENDING: 0, SCHEDULED: 1, INTERVIEWED: 2, SELECTED: 3, REJECTED: 3 }

export default function ApplicantDashboard() {
  const { data: profile } = useQuery({
    queryKey: ['applicant-profile'],
    queryFn: () => api.get('/applicant/profile').then(r => r.data).catch(() => null)
  })
  const { data: interviews = [] } = useQuery({
    queryKey: ['applicant-interviews'],
    queryFn: () => api.get('/applicant/interviews').then(r => r.data).catch(() => [])
  })
  const { data: result } = useQuery({
    queryKey: ['applicant-result'],
    queryFn: () => api.get('/applicant/result').then(r => r.data).catch(() => null)
  })

  const statusInfo = statusColors[profile?.status] || statusColors.PENDING
  const StatusIcon = statusInfo.icon
  const currentStep = stepMap[profile?.status] ?? 0

  return (
    <div className="space-y-6">
      <PageHeader title="My Application" subtitle="Track your interview journey" />

      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-600/30">
              {profile.fullName?.[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">{profile.fullName}</h2>
              <p className="text-slate-500 text-sm">{profile.jobRole}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={statusInfo.color}>
                  <StatusIcon className="w-3 h-3 mr-1 inline" />{statusInfo.label}
                </span>
                {profile.experience && <span className="badge-gray">{profile.experience}</span>}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-3 h-0.5 bg-slate-200 z-0" />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute left-0 top-3 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 z-10"
              />
              {steps.map((step, i) => (
                <div key={step} className="flex flex-col items-center z-20">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.15 }}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      i <= currentStep
                        ? 'bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/30'
                        : 'bg-slate-100 border-slate-300'
                    }`}
                  >
                    {i < currentStep && <span className="text-slate-900 text-[10px]">✓</span>}
                    {i === currentStep && <span className="w-2 h-2 rounded-full bg-white" />}
                  </motion.div>
                  <span className={`text-[10px] mt-1 font-medium ${i <= currentStep ? 'text-blue-400' : 'text-slate-600'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {interviews.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-slate-900">Scheduled Interviews</h3>
          </div>
          <div className="space-y-3">
            {interviews.map(iv => (
              <div key={iv.id} className="flex items-center gap-3 p-3 bg-slate-50/60 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{iv.jobRole}</p>
                  <p className="text-xs text-slate-500">{dayjs(iv.scheduledAt).format('MMMM D, YYYY [at] h:mm A')} &bull; {iv.duration} min</p>
                </div>
                {iv.meetingLink && (
                  <a href={iv.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30 text-xs font-medium hover:bg-violet-600/30 transition-colors">
                    <Video className="w-3 h-3" /> Join
                  </a>
                )}
                <span className="badge-blue">{iv.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`glass-card p-6 border ${result.hrDecision === 'SELECTED' ? 'border-green-500/30' : result.hrDecision === 'REJECTED' ? 'border-red-500/30' : 'border-slate-300/50'}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-slate-900">Evaluation Result</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Technical',       val: result.technicalScore },
              { label: 'Communication',   val: result.communicationScore },
              { label: 'Problem Solving', val: result.problemSolvingScore },
            ].map(({ label, val }) => (
              <div key={label} className="bg-slate-50/60 p-3 rounded-xl">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-lg font-bold text-slate-900">{val}/10</p>
                <div className="h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(val / 10) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                  />
                </div>
              </div>
            ))}
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl">
              <p className="text-xs text-amber-500">Final Score</p>
              <p className="text-2xl font-bold text-amber-400">{result.finalScore}/10</p>
            </div>
          </div>
          {result.hrDecision ? (
            <div className={`p-4 rounded-xl text-center font-semibold ${
              result.hrDecision === 'SELECTED'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {result.hrDecision === 'SELECTED' ? '🎉 Congratulations! You have been selected!' : 'Thank you for your time. Better luck next time!'}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 text-sm text-center border border-amber-500/20">
              Awaiting HR decision...
            </div>
          )}
          {result.aiFeedback && (
            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">AI Analysis Feedback</h4>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{result.aiFeedback}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium">AI Reliability Score:</span>
                <span className="text-xs font-bold text-blue-400">{result.aiScore}/10</span>
              </div>
            </div>
          )}
          {result.comments && (
            <p className="text-xs text-slate-500 mt-3 italic border-l-2 border-slate-300 pl-3">Interviewer: "{result.comments}"</p>
          )}
        </motion.div>
      )}
    </div>
  )
}
