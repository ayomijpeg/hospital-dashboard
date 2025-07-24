// src/app/api/appointments/[id]/route.ts

import { prisma } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/appointments/[id]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, context: any) {
  const id = context?.params?.id

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: true,
        patient: true,
      },
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Failed to fetch appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/appointments/[id]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(req: NextRequest, context: any) {
  const id = context?.params?.id

  try {
    const { status } = await req.json()

    if (!['Confirmed', 'Declined'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Failed to update appointment:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
