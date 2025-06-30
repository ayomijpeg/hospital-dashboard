// src/app/api/doctors/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany()
    return NextResponse.json(doctors) // 👈 This must be an array
  } catch (error) {
    console.error('Error fetching doctors:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch doctors' }), {
      status: 500,
    })
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, department } = body;

    if (!name || !email || !department) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newDoctor = await prisma.doctor.create({
      data: {
        name,
        email,
        department,
      },
    });

    return NextResponse.json(newDoctor, { status: 201 });
  } catch (error) {
    console.error('[DOCTOR_POST_ERROR]', error);
    return NextResponse.json({ error: 'Doctor creation failed' }, { status: 500 });
  }
}
