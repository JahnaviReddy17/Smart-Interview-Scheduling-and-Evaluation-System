import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CalendarPlus, Calendar, Video, XCircle, Edit, Briefcase } from 'lucide-react'
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

export default function HrInterviews() {
  const [open, setOpen] = useState(false)
  const [rescheduleModal, setRescheduleModal] = useState(null)
  const qc = useQueryClient()

  const { data: interviews = [], isLoading } = useQuery({
    queryKey: ['hr-interviews'],
    queryFn: () => api.get('/hr/interviews').then(r => r.data)
  })

  const { data: candidates = [] } = useQuery({
    queryKey: ['hr-candidates'],
    queryFn: () => api.get('/hr/candidates').then(r => r.data)
  })

  const { data: interviewers = [] } = useQuery({
    queryKey: ['hr-interviewers'],
    queryFn: () => api.get('/hr/interviewers').then(r => r.data)
  })

  const scheduleMut = useMutation({
    mutationFn: data => api.post('/hr/interviews', {
      ...data,
      candidateId: Number(data.candidateId),
      interviewerId: Number(data.interviewerId),
      duration: Number(data.duration),
    }),
    onSuccess: () => { qc.invalidateQueries(['hr-interviews']); setOpen(false); toast.success('Interview scheduled') },
    onError: e => toast.error(e.response?.data?.message || 'Failed to schedule')
  })

  const cancelMut = useMutation({
    mutationFn: id => api.patch(`/hr/interviews/${id}/cancel`),
    onSuccess: () => { qc.invalidateQueries(['hr-interviews']); toast.success('Interview cancelled') },
    onError: e => toast.error('Failed to cancel')
  })

  const rescheduleMut = useMutation({
    mutationFn: data => api.put(`/hr/interviews/${data.id}/reschedule`, {
      scheduledAt: data.scheduledAt,
      duration: Number(data.duration),
      meetingLink: data.meetingLink,
      interviewerId: Number(data.interviewerId)
    }),
    onSuccess: () => { qc.invalidateQueries(['hr-interviews']); setRescheduleModal(null); toast.success('Interview rescheduled') },
    onError: e => toast.error('Failed to reschedule')
  })

  const { register, handleSubmit, reset } = useForm()
  const { register: registerReschedule, handleSubmit: handleRescheduleSubmit, reset: resetReschedule } = useForm()

  return (
    <div>
      <PageHeader
        title="Interviews"
        subtitle={`${interviews.length} total`}
        action={
          <button onClick={() => { reset(); setOpen(true) }} className="btn-primary flex items-center gap-2">
            <CalendarPlus className="w-4 h-4" /> Schedule Interview
          </button>
        }
      />

      {isLoading ? (
        <div className="glass-card p-12 text-center text-slate-500 animate-pulse">Loading scheduled interviews...</div>
      ) : interviews.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-4 opacity-50" />
          <p className="text-slate-500 font-medium">No interviews scheduled yet</p>
          <p className="text-xs text-slate-400 mt-1">Start by adding a candidate and setting a date.</p>
        </motion.div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid gap-4"
        >
          {interviews.map((iv) => (
            <motion.div
              key={iv.id}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
              whileHover={{ y: -4, borderColor: 'rgba(59, 130, 246, 0.4)' }}
              className="glass-card p-5 flex items-center gap-5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-slate-800 text-lg leading-tight">{iv.candidate?.fullName}</p>
                  <span className={`${statusBadge[iv.status] || 'badge-gray'} scale-90`}>{iv.status}</span>
                </div>
                <p className="text-sm text-slate-500 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" /> {iv.jobRole} 
                  <span className="text-slate-300">&bull;</span>
                  Interviewer: <span className="text-slate-700 font-medium">{iv.interviewer?.fullName}</span>
                </p>
              </div>

              <div className="text-right hidden md:block border-l border-slate-200 pl-6">
                <p className="font-semibold text-slate-800">{dayjs(iv.scheduledAt).format('MMM D, YYYY')}</p>
                <p className="text-xs text-slate-500 font-medium">{dayjs(iv.scheduledAt).format('h:mm A')} ({iv.duration} min)</p>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {iv.meetingLink && (
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={iv.meetingLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 hover:bg-violet-500/30 transition-all shadow-sm"
                    title="Join Meeting"
                  >
                    <Video className="w-5 h-5" />
                  </motion.a>
                )}
                
                {iv.status === 'SCHEDULED' && (
                  <>
                    <button onClick={() => { 
                        setRescheduleModal(iv);
                        resetReschedule({
                          id: iv.id,
                          interviewerId: iv.interviewer?.id,
                          scheduledAt: dayjs(iv.scheduledAt).format('YYYY-MM-DDTHH:mm'),
                          duration: iv.duration,
                          meetingLink: iv.meetingLink || ''
                        });
                      }} 
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => { if(window.confirm('Cancel this interview?')) cancelMut.mutate(iv.id); }} disabled={cancelMut.isPending} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500 transition-all">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Schedule Interview">
        <form onSubmit={handleSubmit(d => scheduleMut.mutate(d))} className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Candidate *</label>
            <select {...register('candidateId', { required: true })} className="input-field">
              <option value="">Select candidate</option>
              {candidates.filter(c => ['PENDING','SCHEDULED'].includes(c.status)).map(c => (
                <option key={c.id} value={c.id}>{c.fullName} — {c.jobRole}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Interviewer *</label>
            <select {...register('interviewerId', { required: true })} className="input-field">
              <option value="">Select interviewer</option>
              {interviewers.map(i => (
                <option key={i.id} value={i.id}>{i.fullName}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Date & Time *</label>
              <input type="datetime-local" {...register('scheduledAt', { required: true })} className="input-field" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Duration (min) *</label>
              <input type="number" defaultValue={60} {...register('duration', { required: true })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Meeting Link</label>
            <input {...register('meetingLink')} className="input-field" placeholder="https://meet.google.com/..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={scheduleMut.isPending} className="btn-primary flex-1">
              {scheduleMut.isPending ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!rescheduleModal} onClose={() => setRescheduleModal(null)} title="Reschedule Interview">
        <form onSubmit={handleRescheduleSubmit(d => rescheduleMut.mutate(d))} className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Interviewer *</label>
            <select {...registerReschedule('interviewerId', { required: true })} className="input-field">
              {interviewers.map(i => (
                <option key={i.id} value={i.id}>{i.fullName}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">New Date & Time *</label>
              <input type="datetime-local" {...registerReschedule('scheduledAt', { required: true })} className="input-field" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Duration (min) *</label>
              <input type="number" {...registerReschedule('duration', { required: true })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Meeting Link</label>
            <input {...registerReschedule('meetingLink')} className="input-field" placeholder="https://meet.google.com/..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setRescheduleModal(null)} className="btn-secondary flex-1">Abort</button>
            <button type="submit" disabled={rescheduleMut.isPending} className="btn-primary flex-1">
              {rescheduleMut.isPending ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
