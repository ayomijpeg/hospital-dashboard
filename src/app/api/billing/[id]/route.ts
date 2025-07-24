// Do NOT import from next/dist/... (this is unstable and unnecessary)

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

// Correct and stable handler format
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const updated = await prisma.bill.update({
      where: { id: parseInt(id) },
      data: {
        status: 'Paid',
        paidAt: new Date(),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating bill:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
