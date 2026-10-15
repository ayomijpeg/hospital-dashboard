'use client'

import { useEffect, useState } from 'react'
import { DollarSign, FileText, AlertCircle, ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function BillingOverview() {
  const [billingOverview, setBillingOverview] = useState({
    totalRevenue: 0,
    pendingInvoices: 0,
    overduePayments: 0,
    growth: 12,
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
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 tracking-tight">Institutional Billing Summary</h2>
            <p className="text-[11px] text-slate-400">Claims, copays, and reconciled encounters</p>
          </div>
        </div>

        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 transition"
        >
          <span>Ledger</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-7 h-7 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Total Revenue */}
          <Link
            href="/dashboard/billing"
            className="group block p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition hover:border-slate-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Settled Revenue</p>
                  <p className="text-lg font-bold font-mono text-slate-900">
                    ₦{billingOverview.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                +{billingOverview.growth || 12}%
              </span>
            </div>
          </Link>

          {/* Pending Invoices */}
          <Link
            href="/dashboard/billing?filter=pending"
            className="group block p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition hover:border-slate-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Insurance Claims</p>
                  <p className="text-base font-bold font-mono text-slate-900">{billingOverview.pendingInvoices} Invoices</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Awaiting Payer
              </span>
            </div>
          </Link>

          {/* Overdue Payments */}
          <Link
            href="/dashboard/billing?filter=overdue"
            className="group block p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition hover:border-slate-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue Copays</p>
                  <p className="text-base font-bold font-mono text-slate-900">{billingOverview.overduePayments} Encounters</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                Action Required
              </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
