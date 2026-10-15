// src/app/api/doctors/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import bcrypt from 'bcryptjs';

const FALLBACK_DOCTORS = [
  { id: 1, name: 'Sarah Jenkins', email: 's.jenkins@hospital.com', department: 'Cardiology', gender: 'Female', avatar: 'female-doctor.jpg', status: 'Available' },
  { id: 2, name: 'David Chen', email: 'd.chen@hospital.com', department: 'Neurology', gender: 'Male', avatar: 'male-doctor.jpg', status: 'Available' },
  { id: 3, name: 'Emily Taylor', email: 'e.taylor@hospital.com', department: 'Pediatrics', gender: 'Female', avatar: 'doctor3.jpg', status: 'Available' },
  { id: 4, name: 'Marcus Vance', email: 'm.vance@hospital.com', department: 'Orthopedics', gender: 'Male', avatar: 'doctor4.jpg', status: 'Available' },
];

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (doctors.length === 0) {
      return NextResponse.json(FALLBACK_DOCTORS);
    }
    return NextResponse.json(doctors);
  } catch (error) {
    console.warn('[DOCTORS_GET_FALLBACK] Database offline, returning default clinicians:', error instanceof Error ? error.message : error);
    return NextResponse.json(FALLBACK_DOCTORS);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, department, gender } = body;

    if (!name || !email || !department || !gender) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tempPassword = await bcrypt.hash('hospital123', 10);
    const avatar = gender === 'Female' ? 'female-doctor.jpg' : 'male-doctor.jpg';

    const newDoctor = await prisma.doctor.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        department,
        gender,
        password: tempPassword,
        avatar,
        status: 'Available',
      },
    });

    return NextResponse.json(newDoctor, { status: 201 });
  } catch (error) {
    console.error('[DOCTOR_POST_ERROR]', error);
    return NextResponse.json({ error: 'Doctor creation failed' }, { status: 500 });
  }
}
