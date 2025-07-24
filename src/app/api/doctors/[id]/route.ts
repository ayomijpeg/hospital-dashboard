// src/app/api/doctors/[id]/route.ts
import { prisma } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'
import type { AppRouteHandlerFnContext } from 'next/dist/shared/lib/app-router-context'

// GET /api/doctors/[id]
export async function GET(
  req: NextRequest,
  context: AppRouteHandlerFnContext
) {
  const { id } = context.params as { id: string }

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: Number(id) },
    })

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    return NextResponse.json(doctor)
  } catch (error) {
    console.error('Failed to fetch doctor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/doctors/[id]
export async function PUT(
  req: NextRequest,
  context: AppRouteHandlerFnContext
) {
  const { id } = context.params as { id: string }

  try {
    const updatedDoctor = await prisma.doctor.update({
      where: { id: Number(id) },
      data: await req.json(),
    })

    return NextResponse.json(updatedDoctor)
  } catch (error) {
    console.error('Failed to update doctor:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

// DELETE /api/doctors/[id]
export async function DELETE(
  req: NextRequest,
  context: AppRouteHandlerFnContext
) {
  const { id } = context.params as { id: string }

  try {
    await prisma.doctor.delete({
      where: { id: Number(id) },
    })

    return NextResponse.json({ message: 'Doctor deleted' })
  } catch (error) {
    console.error('Failed to delete doctor:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
