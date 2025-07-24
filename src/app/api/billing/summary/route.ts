// src/app/api/billing/summary/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function GET() {
  try {
    // Total Revenue (Sum of Paid Bills)
    const totalRevenue = await prisma.bill.aggregate({
      _sum: { amount: true },
      where: { status: 'Paid' },
    })

    // Pending Invoices Count
    const pendingInvoices = await prisma.bill.count({
      where: { status: 'Unpaid' },
    })

    // Overdue Payments Count (Unpaid + older than 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const overduePayments = await prisma.bill.count({
      where: {
        status: 'Unpaid',
        issuedAt: { lt: sevenDaysAgo },
      },
    })

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingInvoices,
      overduePayments,
    })
  } catch (error) {
    console.error('[BILLING_SUMMARY_ERROR]', error)
    return NextResponse.json({ error: 'Failed to fetch billing summary' }, { status: 500 })
  }
}
