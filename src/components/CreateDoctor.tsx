'use client'

import { useState } from 'react'

export default function CreateDoctor({ onDoctorCreated }: { onDoctorCreated: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', department: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      if (!res.ok) throw new Error('Failed to create doctor')
      onDoctorCreated()
      setForm({ name: '', email: '', department: '' }) // reset
    } catch (err) {
      console.error(err)
      alert('Error creating doctor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Doctor</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Full Name"
          className="border p-2 rounded text-gray-600"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Email"
          className="border p-2 rounded text-gray-600"
        />
        <input
          name="department"
          type="text"
          value={form.department}
          onChange={handleChange}
          required
          placeholder="Department"
          className="border p-2 rounded text-gray-600"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
      >
        {loading ? 'Adding...' : 'Add Doctor'}
      </button>
    </form>
  )
}
