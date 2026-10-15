'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { 
  Users, 
  Search, 
  Plus, 
  X, 
  Calendar, 
  FileText, 
  Activity, 
  Mail 
} from 'lucide-react'
import RoleGuard from '@/components/RoleGuard'

type PatientRecord = {
  id: number
  name: string
  email: string
  age: number
  condition: string | null
  avatar: string | null
  createdAt: string
  _count?: {
    appointments: number
    bills: number
  }
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // New Patient Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    gender: 'Male',
    condition: '',
  })

  const fetchPatients = useCallback(async (query = '') => {
    try {
      setLoading(true)
      const res = await fetch(`/api/patients${query ? `?query=${encodeURIComponent(query)}` : ''}`)
      if (!res.ok) throw new Error('Failed to fetch patients')
      const data = await res.json()
      setPatients(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load patients:', err)
      toast.error('Failed to load patients list')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, fetchPatients])

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create patient')
      }

      toast.success(`Patient ${form.name} registered successfully!`)
      setIsModalOpen(false)
      setForm({ name: '', email: '', age: '', gender: 'Male', condition: '' })
      fetchPatients(search)
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : 'Error registering patient')
    } finally {
      setSubmitting(false)
    }
  }

  const resolveAvatar = (avatar: string | null, index: number) => {
    if (!avatar) {
      return index % 2 === 0 ? '/images/male1.jpg' : '/images/female1.jpg'
    }
    return avatar.startsWith('/') ? avatar : `/images/${avatar}`
  }

  return (
    <RoleGuard
      allowedRoles={['DOCTOR', 'ADMIN']}
      fallbackMessage="The Master Patient Registry contains protected health information (PHI) and is restricted to Attending Medical Staff and Hospital Administrators."
    >
      <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Patient Directory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage electronic health profiles, medical conditions, and consultations
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search & Statistics Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, or diagnosed condition..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Users className="w-4 h-4 text-teal-600" />
          <span>Total Records:</span>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-900 rounded font-mono font-bold">
            {patients.length}
          </span>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent" />
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">No patients found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {search
                ? `No patient records matched "${search}". Try searching by a different name or email.`
                : 'Get started by registering your first patient into the system.'}
            </p>
            {!search && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition"
              >
                Register Patient
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Patient Details</th>
                  <th scope="col" className="px-4 py-3.5">Age</th>
                  <th scope="col" className="px-4 py-3.5">Primary Condition</th>
                  <th scope="col" className="px-4 py-3.5 text-center">Appointments</th>
                  <th scope="col" className="px-4 py-3.5 text-center">Invoices</th>
                  <th scope="col" className="px-4 py-3.5">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {patients.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Patient Name + Avatar */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                          <Image
                            src={resolveAvatar(p.avatar, idx)}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{p.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            <span>{p.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Age */}
                    <td className="px-4 py-4 whitespace-nowrap text-slate-700 font-mono text-xs">
                      {p.age} yrs
                    </td>

                    {/* Condition */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        <Activity className="w-3 h-3 text-teal-600" />
                        <span>{p.condition || 'General Care'}</span>
                      </span>
                    </td>

                    {/* Appointments Count */}
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-mono font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {p._count?.appointments ?? 0}
                      </span>
                    </td>

                    {/* Bills Count */}
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-mono font-medium">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {p._count?.bills ?? 0}
                      </span>
                    </td>

                    {/* Registration Date */}
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                      {new Date(p.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Register Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Register New Patient</h3>
                  <p className="text-xs text-slate-500">Create an official clinical health record</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robert Smith"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="patient@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="125"
                    required
                    placeholder="e.g. 42"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Gender *
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Primary Condition / Concern
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hypertension, Asthma"
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100 mt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? 'Registering...' : 'Save Patient Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </RoleGuard>
  )
}
