import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Calendar, Play, Star, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import api from '../../lib/api'
import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'

const statusBadge = {
  SCHEDULED: 'badge-blue', IN_PROGRESS: 'badge-yellow',
  COMPLETED: 'badge-green', CANCELLED: 'badge-red'
}

export default function InterviewerDashboard() {
  const [evalModal, setEvalModal] = useState(null)
  const qc = useQueryClient()

  const { data: interviews = [], isLoading } = useQuery({
    queryKey: ['interviewer-interviews'],
    queryFn: () => api.get('/interviewer/interviews').then(r => r.data)
  })

  const startMut = useMutation({
    mutationFn: id => api.patch(`/interviewer/interviews/${id}/start`),
    onSuccess: () => { qc.invalidateQueries(['interviewer-interviews']); toast.success('Interview started') }
  })

  const evalMut = useMutation({
    mutationFn: data => api.post('/interviewer/evaluations', {
      ...data,
      interviewId: evalModal?.id,
      technicalScore: Number(data.technicalScore),
      communicationScore: Number(data.communicationScore),
      problemSolvingScore: Number(data.problemSolvingScore),
    }),
    onSuccess: () => { qc.invalidateQueries(['interviewer-interviews']); setEvalModal(null); toast.success('Evaluation submitted!') },
    onError: () => toast.error('Failed to submit evaluation')
  })

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { technicalScore: 7, communicationScore: 7, problemSolvingScore: 7 }
  })

  const scores = watch(['technicalScore', 'communicationScore', 'problemSolvingScore'])
  const avgScore = (scores.reduce((a, b) => a + Number(b), 0) / 3).toFixed(1)

  const pending = interviews.filter(iv => iv.status !== 'COMPLETED')
  const done = interviews.filter(iv => iv.status === 'COMPLETED')

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Interviews"
        subtitle={`${pending.length} upcoming / ${done.length} completed`}
      />

      {isLoading ? (
        <div className="glass-card p-8 text-center text-slate-500">Loading...</div>
      ) : interviews.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Calendar className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No interviews assigned yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {interviews.map((iv, i) => (
            <motion.div
              key={iv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card p-4 flex items-center gap-4 hover:border-slate-300/50 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {iv.candidate?.fullName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800">{iv.candidate?.fullName}</p>
                <p className="text-xs text-slate-500">{iv.jobRole} &bull; {dayjs(iv.scheduledAt).format('MMM D, YYYY h:mm A')}</p>
              </div>
              <span className={statusBadge[iv.status] || 'badge-gray'}>{iv.status}</span>
              {iv.status === 'SCHEDULED' && (
                <button
                  onClick={() => startMut.mutate(iv.id)}
                  disabled={startMut.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-medium transition-all"
                >
                  <Play className="w-3 h-3" /> Start
                </button>
              )}
              {iv.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => { reset({ technicalScore: 7, communicationScore: 7, problemSolvingScore: 7 }); setEvalModal(iv) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 border border-violet-500/30 text-xs font-medium transition-all"
                >
                  <Star className="w-3 h-3" /> Evaluate
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={!!evalModal} onClose={() => setEvalModal(null)} title={`Evaluate: ${evalModal?.candidate?.fullName}`}>
        <form onSubmit={handleSubmit(d => evalMut.mutate(d))} className="space-y-4">
          {[
            { label: 'Technical Score', name: 'technicalScore' },
            { label: 'Communication Score', name: 'communicationScore' },
            { label: 'Problem Solving Score', name: 'problemSolvingScore' },
          ].map(({ label, name }) => (
            <div key={name}>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-slate-500">{label}</label>
                <span className="text-xs font-semibold text-blue-400">{watch(name)}/10</span>
              </div>
              <input type="range" min="1" max="10" step="0.5" {...register(name)} className="w-full accent-blue-500" />
            </div>
          ))}
          <div className="glass p-3 rounded-xl text-center">
            <p className="text-xs text-slate-500">Estimated Final Score</p>
            <p className="text-2xl font-bold text-amber-400">{avgScore}/10</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Comments</label>
            <textarea {...register('comments')} rows={3} className="input-field resize-none" placeholder="Provide detailed feedback..." />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setEvalModal(null)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={evalMut.isPending} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Send className="w-3.5 h-3.5" />
              {evalMut.isPending ? 'Submitting...' : 'Submit Evaluation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
