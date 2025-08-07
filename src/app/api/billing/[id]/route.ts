import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: {params: Promise < { id: string } >} // Wrap in Promise
) {
 const {id}= await params; // Destructure after awaiting

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