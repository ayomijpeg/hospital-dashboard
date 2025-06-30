// src/app/api/doctors/[id]/route.ts
import { prisma } from '@/libs/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const doctor = await prisma.doctor.findMany({ where: { id: params.id } })
  if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(doctor)
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json()
  const updated = await prisma.doctorId.update({
    where: { id: params.id },
    data,
  })
  return NextResponse.json(updated)
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.doctorId.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
