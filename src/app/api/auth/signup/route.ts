// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/libs/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, password, department, gender } = await req.json();

    
    // Validate input
    if (!name || !email || !password || !department || !gender) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    const avatar = gender === 'Male' ? 'male-doctor.jpg' : 'female-doctor.jpg';

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: 'JWT secret not configured' },
        { status: 500 }
      );
    }

    // Check for existing doctor
    const existingDoctor = await prisma.doctor.findUnique({ 
      where: { email } 
    });
    
    if (existingDoctor) {
      // Timing attack protection
      await bcrypt.compare(password, '$2a$10$dummyhash');
      return NextResponse.json(
        { error: 'Doctor with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create doctor
    const doctor = await prisma.doctor.create({
      data: { 
        name, 
        email, 
        department,
        gender,
         avatar,
        password: hashedPassword 
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: doctor.id, role: 'doctor' }, // Include role in token
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set HTTP-only cookie
    const response = NextResponse.json(
      {
        doctor: {
          id: doctor.id,
          name: doctor.name,
          email: doctor.email,
          department: doctor.department
        }
      },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 1 day
    });

    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}