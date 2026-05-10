import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { UserPlus, Shield, ToggleLeft, ToggleRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../lib/api'
import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'

const roleBadge = {
  ADMIN: 'badge-purple', HR: 'badge-blue',
  INTERVIEWER: 'badge-green', APPLICANT: 'badge-yellow'
}

export default function AdminUsers() {
  const [open, setOpen] = useState(false)
  const qc = useQueryClient()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then(r => r.data)
  })

  const createMut = useMutation({
    mutationFn: data => api.post('/admin/users', data),
    onSuccess: () => { qc.invalidateQueries(['admin-users']); setOpen(false); toast.success('User created') }
  })

  const toggleMut = useMutation({
    mutationFn: id => api.patch(`/admin/users/${id}/toggle`),
    onSuccess: () => qc.invalidateQueries(['admin-users'])
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = data => createMut.mutate(data)

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle={`${users.length} total accounts`}
        action={
          <button onClick={() => { reset(); setOpen(true) }} className="btn-primary flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        }
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {['Name', 'Username', 'Role', 'Department', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {users.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-slate-100/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                        {user.fullName?.[0]}
                      </div>
                      <span className="font-medium text-slate-800">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{user.username}</td>
                  <td className="px-4 py-3">
                    <span className={roleBadge[user.role] || 'badge-gray'}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{user.department ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={user.active ? 'badge-green' : 'badge-red'}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleMut.mutate(user.id)} className="text-slate-500 hover:text-slate-900 transition-colors">
                      {user.active ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create New User">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Full Name</label>
              <input {...register('fullName', { required: true })} className="input-field" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Username</label>
              <input {...register('username', { required: true })} className="input-field" placeholder="janedoe" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Password</label>
              <input type="password" {...register('password', { required: true })} className="input-field" placeholder="••••••" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Email</label>
              <input type="email" {...register('email')} className="input-field" placeholder="jane@co.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Role</label>
              <select {...register('role', { required: true })} className="input-field">
                <option value="">Select role</option>
                {['ADMIN','HR','INTERVIEWER','APPLICANT'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Department</label>
              <input {...register('department')} className="input-field" placeholder="Engineering" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={createMut.isPending} className="btn-primary flex-1">
              {createMut.isPending ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
