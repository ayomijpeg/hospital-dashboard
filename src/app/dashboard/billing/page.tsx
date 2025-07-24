'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa'
import clsx from 'clsx'

type Bill = {
  id: number
  patientId: number | null
  doctorId: number
  patientName: string
  services: string
  amount: number
  status: 'Paid' | 'Unpaid' | 'Overdue'
  issuedAt: string
  paidAt: string | null
  patient: {
    name: string
  } | null
  doctor: {
    name: string
  } | null
}

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch('/api/billing')
        console.log('Billing fetch response:', res)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setBills(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load billing records.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBills()
  }, [])

  const filteredBills = bills.filter((bill) => {
    if (filter === 'pending') return bill.status === 'Unpaid'
    if (filter === 'overdue') return bill.status === 'Overdue'
    return true
  })

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Billing Records</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm text-center">{error}</p>
      ) : filteredBills.length === 0 ? (
        <p className="text-gray-500 text-center italic">No billing records found for this filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase text-left">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Services</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Issued</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {bill.patientName || "Unknown Patient"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {bill.doctor?.name || "Unknown Doctor"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{bill.services}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">₦{bill.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                        {
                          'bg-green-100 text-green-700': bill.status === 'Paid',
                          'bg-yellow-100 text-yellow-700': bill.status === 'Unpaid',
                          'bg-red-100 text-red-600': bill.status === 'Overdue',
                        }
                      )}
                    >
                      {bill.status === 'Paid' && <FaCheckCircle />}
                      {bill.status === 'Unpaid' && <FaClock />}
                      {bill.status === 'Overdue' && <FaTimesCircle />}
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(bill.issuedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}