// src/app/api/doctors/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma'
import bcrypt from 'bcryptjs';

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
    const { name, email, department , gender} = body;

    if (!name || !email || !department || !gender) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const tempPassword = await bcrypt.hash('hospital123', 10)
const avatar = gender === 'Male' ? 'male-doctor.jpg' : 'female-doctor.jpg'

    const newDoctor = await prisma.doctor.create({
      data: {
        name,
        email,
        department,
         gender,
    password: tempPassword,
    avatar,
      },
    });

    return NextResponse.json(newDoctor, { status: 201 });
  } catch (error) {
    console.error('[DOCTOR_POST_ERROR]', error);
    return NextResponse.json({ error: 'Doctor creation failed' }, { status: 500 });
  }
}
