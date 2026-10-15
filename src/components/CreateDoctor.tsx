'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { FaUserMd, FaEnvelope, FaClinicMedical, FaVenusMars } from 'react-icons/fa'

const DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Gynecology',
  'Ophthalmology',
  'Surgery',
  'Emergency',
]

export default function CreateDoctor({ onDoctorCreated }: { onDoctorCreated: () => void }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: 'General Medicine',
    gender: 'Male',
  })
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create doctor')
      }

      toast.success(`Dr. ${form.name} added successfully!`)
      onDoctorCreated()
      setForm({
        name: '',
        email: '',
        department: 'General Medicine',
        gender: 'Male',
      })
      setIsOpen(false)
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : 'Error creating doctor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <FaUserMd className="text-teal-600 text-xl" />
          <h2 className="font-semibold text-gray-800">Add New Doctor</h2>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-sm font-medium text-teal-600 hover:text-teal-700 transition"
        >
          {isOpen ? 'Close Form' : '+ New Doctor'}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Doctor Name *
              </label>
              <div className="relative">
                <FaUserMd className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Dr. Sarah Jenkins"
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Email Address *
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="doctor@hospital.com"
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Department *
              </label>
              <div className="relative">
                <FaClinicMedical className="absolute left-3 top-3 text-gray-400" />
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Gender *
              </label>
              <div className="relative">
                <FaVenusMars className="absolute left-3 top-3 text-gray-400" />
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Creating Doctor...' : 'Save Doctor'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
