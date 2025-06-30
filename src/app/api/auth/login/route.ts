// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/libs/prisma';

export async function POST(req: Request) {
  try {
    // Validate request content type
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 415 }
      );
    }

    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable not configured');
    }

    // Find doctor with timing attack protection
    const doctor = await prisma.doctor.findUnique({ 
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        password: true,
        createdAt: true
      }
    });
    
    // Always perform hash comparison to prevent timing attacks
    const hashComparison = doctor 
      ? await bcrypt.compare(password, doctor.password)
      : await bcrypt.compare(password, '$2a$10$dummyhash');

    if (!doctor || !hashComparison) {
      return NextResponse.json(
        { error: 'Invalid email or password' }, // Generic message for security
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate token with additional security claims
const token = jwt.sign(
  { userId: doctor.id },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

    // Create response with security headers
    const response = NextResponse.json(
      {
        success: true,
        doctor: {
          id: doctor.id,
          name: doctor.name,
          email: doctor.email,
          department: doctor.department
        }
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY'
        }
      }
    );

    // Set secure HTTP-only cookie
    response.cookies.set('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', // Changed from 'strict' for better compatibility
  maxAge: 8 * 60 * 60, // 8 hours in seconds (matches JWT expiry)
  path: '/', // Accessible across all routes
});

    return response;

  } catch (error: unknown) {
    console.error('Login error:', error);
    
    // Ensure JSON response even for errors
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' 
          ? error instanceof Error 
            ? error.message 
            : 'Unknown error'
          : undefined
      },
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}