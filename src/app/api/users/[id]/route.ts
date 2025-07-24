import { prisma } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/libs/auth'
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest, context) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = context.params?.id

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
