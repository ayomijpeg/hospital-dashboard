import { prisma } from '@/libs/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const currentDate = new Date()

    const appointments = await prisma.appointment.findMany({
      where: {
        dateTime: {
          gte: currentDate
        }
      },
      orderBy: {
        dateTime: 'asc'
      },
      include: {
        doctor: {
          select: {
            name: true,
            department: true,
          },
        },
      },
      take: 4
    })

    console.log(`[ALL_APPOINTMENTS] Found ${appointments.length} appointments`)
    return NextResponse.json(appointments, { status: 200 })
  } catch (error: unknown) {
    console.error('[ALL_APPT_FETCH_ERROR]', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: 'Failed to load all appointments', details: errorMessage },
      { status: 500 }
    )
  }
}
