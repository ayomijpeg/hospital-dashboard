// GET /api/doctors/available
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { status: 'Available' },
      select: {
        id: true,
        name: true,
        department: true,
      },
    })

    return NextResponse.json(doctors)
  } catch (error) {
    console.error('[DOCTORS_AVAILABLE_GET]', error)
    return NextResponse.json({ error: 'Failed to fetch available doctors' }, { status: 500 })
  }
}
