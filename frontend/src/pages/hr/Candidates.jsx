import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { UserPlus, Search, Briefcase } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../lib/api'
import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'

const statusBadge = {
  PENDING: 'badge-yellow', SCHEDULED: 'badge-blue',
  INTERVIEWED: 'badge-purple', SELECTED: 'badge-green', REJECTED: 'badge-red'
}

export default function HrCandidates() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const qc = useQueryClient()

  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ['hr-candidates'],
    queryFn: () => api.get('/hr/candidates').then(r => r.data)
  })

  const createMut = useMutation({
    mutationFn: data => api.post('/hr/candidates', data),
    onSuccess: () => { qc.invalidateQueries(['hr-candidates']); setOpen(false); toast.success('Candidate added') },
    onError: e => toast.error(e.response?.data?.message || 'Failed to add candidate')
  })

  const { register, handleSubmit, reset } = useForm()
  const filtered = candidates.filter(c =>
    c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    c.jobRole?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader
        title="Candidates"
        subtitle={`${candidates.length} total`}
        action={
          <button onClick={() => { reset(); setOpen(true) }} className="btn-primary flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Add Candidate
          </button>
        }
      />

      <div className="glass-card p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or role..."
            className="input-field pl-9"
          />
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No candidates found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {['Candidate', 'Job Role', 'Experience', 'Skills', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-slate-100/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {c.fullName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{c.fullName}</p>
                        <p className="text-xs text-slate-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{c.jobRole}</td>
                  <td className="px-4 py-3 text-slate-500">{c.experience ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-[150px] truncate">{c.skills ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={statusBadge[c.status] || 'badge-gray'}>{c.status}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add New Candidate">
        <form onSubmit={handleSubmit(d => createMut.mutate(d))} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Full Name *</label>
              <input {...register('fullName', { required: true })} className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Email *</label>
              <input type="email" {...register('email', { required: true })} className="input-field" placeholder="john@email.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Phone</label>
              <input {...register('phone')} className="input-field" placeholder="+1-555-0000" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Job Role *</label>
              <input {...register('jobRole', { required: true })} className="input-field" placeholder="Software Engineer" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Experience</label>
              <input {...register('experience')} className="input-field" placeholder="3 years" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Skills</label>
              <input {...register('skills')} className="input-field" placeholder="React, Java, SQL" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Resume Summary</label>
            <textarea {...register('resumeSummary')} rows={2} className="input-field resize-none" placeholder="Brief summary..." />
          </div>
          <div className="border-t border-slate-300 pt-3">
            <p className="text-xs text-slate-500 mb-2">Portal Login Credentials</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Username *</label>
                <input {...register('username', { required: true })} className="input-field" placeholder="johndoe" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Password *</label>
                <input type="password" {...register('password', { required: true })} className="input-field" placeholder="••••••" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={createMut.isPending} className="btn-primary flex-1">
              {createMut.isPending ? 'Adding...' : 'Add Candidate'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
