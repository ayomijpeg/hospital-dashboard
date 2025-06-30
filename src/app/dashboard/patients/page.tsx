'use client'

import { useState } from 'react'
import { patients } from '@/data/patients'
import { Patient } from '@/data/patients'

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 bg-[#eaedf0] min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Patients</h1>

    <input
    type="text"
    placeholder="Search patients..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="mb-4 w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder:text-gray-500"
    />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100 text-gray-700 text-left text-sm uppercase">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Age</th>
              <th className="py-3 px-4">Gender</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filteredPatients.map((patient: Patient) => (
              <tr key={patient.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{patient.name}</td>
                <td className="py-3 px-4">{patient.age}</td>
                <td className="py-3 px-4">{patient.gender}</td>
                <td className="py-3 px-4">{patient.email}</td>
                <td className="py-3 px-4">{patient.phone}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      patient.status === 'Admitted'
                        ? 'bg-green-100 text-green-700'
                        : patient.status === 'Discharged'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
