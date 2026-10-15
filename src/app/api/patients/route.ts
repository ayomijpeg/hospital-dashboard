import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { devHospitalStore } from '@/libs/devDataStore';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('query')?.toLowerCase().trim() || '';

  try {
    const patients = await prisma.patient.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
              { condition: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        _count: {
          select: {
            appointments: true,
            bills: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (patients.length === 0 && !query) {
      return NextResponse.json(devHospitalStore.getPatients());
    }

    return NextResponse.json(patients);
  } catch (error) {
    console.warn('[PATIENTS_GET_FALLBACK] Database offline, returning dev store patients:', error instanceof Error ? error.message : error);
    return NextResponse.json(devHospitalStore.getPatients(query));
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, age, condition, gender } = body;

    if (!name || !email || !age) {
      return NextResponse.json(
        { error: 'Name, email, and age are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const maleAvatars = ['male1.jpg', 'male2.jpg', 'male3.jpg', 'male4.jpg', 'male5.jpg'];
    const femaleAvatars = ['female1.jpg', 'female2.jpg', 'female3.jpg', 'female4.jpg', 'female5.jpg'];
    const avatar = gender === 'Female'
      ? femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)]
      : maleAvatars[Math.floor(Math.random() * maleAvatars.length)];

    // 1. Try PostgreSQL
    try {
      const existing = await prisma.patient.findUnique({
        where: { email: cleanEmail },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'A patient with this email is already registered' },
          { status: 409 }
        );
      }

      const newPatient = await prisma.patient.create({
        data: {
          name,
          email: cleanEmail,
          age: Number(age),
          condition: condition || 'Routine Checkup',
          avatar,
        },
      });

      return NextResponse.json(newPatient, { status: 201 });
    } catch (dbError) {
      console.warn('[PATIENT_POST_DB_FALLBACK] Database offline, saving patient to dev store:', dbError);
      
      try {
        const devPatient = devHospitalStore.createPatient({
          name,
          email: cleanEmail,
          age: Number(age),
          condition: condition || 'Routine Checkup',
          avatar,
          gender: gender || 'Female',
        });
        return NextResponse.json(devPatient, { status: 201 });
      } catch (storeErr: any) {
        if (storeErr.message?.includes('already registered')) {
          return NextResponse.json({ error: storeErr.message }, { status: 409 });
        }
        throw storeErr;
      }
    }
  } catch (error) {
    console.error('[PATIENT_POST_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to register patient' },
      { status: 500 }
    );
  }
}
