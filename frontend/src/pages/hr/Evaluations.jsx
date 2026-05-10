import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ClipboardList, CheckCircle, XCircle, Star, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'
import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'

export default function HrEvaluations() {
  const [selected, setSelected] = useState(null)
  const qc = useQueryClient()

  const { data: evaluations = [], isLoading } = useQuery({
    queryKey: ['hr-evaluations'],
    queryFn: () => api.get('/hr/evaluations').then(r => r.data)
  })

  const decisionMut = useMutation({
    mutationFn: ({ id, decision }) => api.patch(`/hr/evaluations/${id}/decision`, { decision }),
    onSuccess: () => { qc.invalidateQueries(['hr-evaluations']); setSelected(null); toast.success('Decision saved') },
    onError: () => toast.error('Failed to save decision')
  })

  const ScoreBar = ({ label, value }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-700 font-medium">{value}/10</span>
      </div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / 10) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
        />
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader title="Evaluations" subtitle={`${evaluations.length} completed interviews`} />

      {isLoading ? (
        <div className="glass-card p-8 text-center text-slate-500">Loading...</div>
      ) : evaluations.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ClipboardList className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No evaluations yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {evaluations.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card p-4 hover:border-slate-300/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {ev.interview?.candidate?.fullName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{ev.interview?.candidate?.fullName}</p>
                    <p className="text-xs text-slate-500">{ev.interview?.jobRole}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-amber-400">{ev.finalScore}/10</span>
                      {ev.aiScore && (
                        <>
                          <span className="mx-1 text-slate-300">•</span>
                          <Sparkles className="w-3 h-3 text-purple-500" />
                          <span className="text-xs font-semibold text-purple-600">AI: {ev.aiScore}/10</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ev.hrDecision ? (
                    <span className={ev.hrDecision === 'SELECTED' ? 'badge-green' : 'badge-red'}>
                      {ev.hrDecision}
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelected(ev)}
                      className="btn-primary text-xs py-1.5 px-3"
                    >
                      Make Decision
                    </button>
                  )}
                </div>
              </div>
              {ev.comments && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500 italic">" {ev.comments} "</p>
                </div>
              )}
              {ev.aiFeedback && (
                <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-100 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-purple-800 leading-snug">{ev.aiFeedback}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Final Decision">
        {selected && (
          <div className="space-y-5">
            <div className="glass p-4 rounded-xl">
              <p className="font-semibold text-slate-800">{selected.interview?.candidate?.fullName}</p>
              <p className="text-xs text-slate-500 mt-0.5">{selected.interview?.jobRole}</p>
            </div>

            <div className="space-y-3">
              <ScoreBar label="Technical"         value={selected.technicalScore} />
              <ScoreBar label="Communication"     value={selected.communicationScore} />
              <ScoreBar label="Problem Solving"   value={selected.problemSolvingScore} />
            </div>

            <div className="glass p-3 rounded-xl">
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg mb-2">
                <span className="text-sm font-medium text-slate-500">Human Score</span>
                <span className="text-sm font-bold text-slate-700">
                  {((selected.technicalScore + selected.communicationScore + selected.problemSolvingScore)/3).toFixed(1)}/10
                </span>
              </div>
              {selected.aiScore && (
                <div className="flex justify-between items-center bg-purple-50 p-2 rounded-lg mb-2">
                  <span className="text-sm font-medium text-purple-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> AI Evaluation Score
                  </span>
                  <span className="text-sm font-bold text-purple-700">{selected.aiScore}/10</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-slate-200 pt-2 mt-1">
                <span className="text-sm font-bold text-slate-800">Final Weighted Score</span>
                <span className="text-lg font-bold text-amber-500">{selected.finalScore}/10</span>
              </div>
            </div>

            {selected.comments && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interviewer Notes</p>
                <p className="text-sm text-slate-700 italic border-l-2 border-slate-300 pl-3">"{selected.comments}"</p>
              </div>
            )}

            {selected.aiFeedback && (
              <div className="space-y-2 mt-2">
                <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider flex items-center gap-1"><Sparkles className="w-3 h-3"/> AI Analysis</p>
                <p className="text-sm text-purple-900 bg-purple-50 p-3 rounded-xl border border-purple-100 leading-relaxed">{selected.aiFeedback}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => decisionMut.mutate({ id: selected.id, decision: 'SELECTED' })}
                disabled={decisionMut.isPending}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 font-semibold transition-all"
              >
                <CheckCircle className="w-4 h-4" /> Select
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => decisionMut.mutate({ id: selected.id, decision: 'REJECTED' })}
                disabled={decisionMut.isPending}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-semibold transition-all"
              >
                <XCircle className="w-4 h-4" /> Reject
              </motion.button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
