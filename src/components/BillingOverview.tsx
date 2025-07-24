'use client'

import { useEffect, useState } from 'react'
import { FaMoneyBillWave, FaFileInvoice, FaExclamationTriangle } from 'react-icons/fa'
import Link from 'next/link'

export default function BillingOverview() {
  const [billingOverview, setBillingOverview] = useState({
    totalRevenue: 0,
    pendingInvoices: 0,
    overduePayments: 0,
    growth: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const res = await fetch('/api/billing/summary')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setBillingOverview(data)
      } catch (error) {
        console.error('Error loading billing summary:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBillingData()
  }, [])

  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Billing Overview</h2>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <>
          {/* Total Revenue */}
          <Link href="/billing">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer">
              <div className="flex items-center gap-3 text-green-700">
                <FaMoneyBillWave className="text-xl" />
                <div>
                  <p className="text-sm font-medium">Total Revenue</p>
                  <p className="text-lg font-bold">
                    ₦{billingOverview.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
              <span className="text-green-600 text-sm font-semibold">
                ↑ {billingOverview.growth || 12}%
              </span>
            </div>
          </Link>

          {/* Pending Invoices */}
          <Link href="/billing?filter=pending">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer">
              <div className="flex items-center gap-3 text-blue-700">
                <FaFileInvoice className="text-xl" />
                <div>
                  <p className="text-sm font-medium">Pending Invoices</p>
                  <p className="text-lg font-semibold">{billingOverview.pendingInvoices}</p>
                </div>
              </div>
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                {billingOverview.pendingInvoices} Unpaid
              </span>
            </div>
          </Link>

          {/* Overdue Payments */}
          <Link href="/billing?filter=overdue">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer">
              <div className="flex items-center gap-3 text-red-700">
                <FaExclamationTriangle className="text-xl" />
                <div>
                  <p className="text-sm font-medium">Overdue Payments</p>
                  <p className="text-lg font-semibold">{billingOverview.overduePayments}</p>
                </div>
              </div>
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                {billingOverview.overduePayments} Late
              </span>
            </div>
          </Link>
        </>
      )}
    </div>
  )
}
