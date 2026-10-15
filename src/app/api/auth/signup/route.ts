// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/libs/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, 
      email, 
      password, 
      role = 'patient',
      gender = 'Male',
      department = 'General Medicine',
      age = 30,
      condition = ''
    } = body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const normalizedRole = role.toLowerCase() === 'doctor' ? 'doctor' : 'patient';

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Attempt Database persistence with automatic Dev Store fallback
    try {
      // Check for duplicate account across user, doctor, and patient tables
      const [existingUser, existingDoctor, existingPatient] = await Promise.all([
        prisma.user.findUnique({ where: { email: cleanEmail } }),
        prisma.doctor.findUnique({ where: { email: cleanEmail } }),
        prisma.patient.findUnique({ where: { email: cleanEmail } })
      ]);

      if (existingUser || existingDoctor || existingPatient) {
        return NextResponse.json(
          { error: 'An account with this email address already exists' },
          { status: 409 }
        );
      }

      // Create role-specific records in PostgreSQL
      if (normalizedRole === 'doctor') {
        const avatar = gender === 'Female' ? 'female-doctor.jpg' : 'male-doctor.jpg';

        const doctor = await prisma.doctor.create({
          data: {
            name,
            email: cleanEmail,
            department: department || 'General Medicine',
            gender,
            avatar,
            password: hashedPassword,
            status: 'Available',
          },
        });

        await prisma.user.create({
          data: {
            name,
            email: cleanEmail,
            password: hashedPassword,
            role: 'doctor',
          },
        });

        return NextResponse.json(
          {
            success: true,
            message: 'Doctor account created successfully',
            user: {
              id: doctor.id,
              name: doctor.name,
              email: doctor.email,
              role: 'doctor',
              department: doctor.department,
            },
          },
          { status: 201 }
        );
      } else {
        const avatar = gender === 'Female' ? 'female1.jpg' : 'male1.jpg';
        const parsedAge = parseInt(String(age), 10) || 25;

        await prisma.patient.create({
          data: {
            name,
            email: cleanEmail,
            age: parsedAge,
            condition: condition || 'General Health Consultation',
            avatar,
          },
        });

        const user = await prisma.user.create({
          data: {
            name,
            email: cleanEmail,
            password: hashedPassword,
            role: 'patient',
          },
        });

        return NextResponse.json(
          {
            success: true,
            message: 'Patient account created successfully',
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: 'patient',
            },
          },
          { status: 201 }
        );
      }
    } catch (dbError) {
      console.warn('[SIGNUP_DB_FALLBACK] Database offline or unreachable, registering via Dev Store:', dbError);
      
      const { devAuthStore } = await import('@/libs/devAuthStore');
      
      const existingDevUser = devAuthStore.findByEmail(cleanEmail);
      if (existingDevUser) {
        return NextResponse.json(
          { error: 'An account with this email address already exists' },
          { status: 409 }
        );
      }

      const devUser = devAuthStore.create({
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: normalizedRole,
        department: normalizedRole === 'doctor' ? (department || 'General Medicine') : 'Patient Care',
        gender,
        avatar: normalizedRole === 'doctor'
          ? (gender === 'Female' ? 'female-doctor.jpg' : 'male-doctor.jpg')
          : (gender === 'Female' ? 'female1.jpg' : 'male1.jpg'),
        age: parseInt(String(age), 10) || 25,
        condition: condition || 'General Health Consultation',
      });

      return NextResponse.json(
        {
          success: true,
          message: `${normalizedRole === 'doctor' ? 'Doctor' : 'Patient'} account created successfully`,
          user: {
            id: devUser.id,
            name: devUser.name,
            email: devUser.email,
            role: devUser.role,
            department: devUser.department,
          },
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('[SIGNUP_FATAL_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error while creating account' },
      { status: 500 }
    );
  }
}