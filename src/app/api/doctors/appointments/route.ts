import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/libs/auth'
import { v4 as uuidv4 } from 'uuid'
import { devHospitalStore } from '@/libs/devDataStore'

const DEFAULT_DOCTORS: Record<number, { name: string; department: string }> = {
  1: { name: "Sarah Jenkins", department: "Cardiology" },
  2: { name: "Jonathan Reyes", department: "Pediatrics" },
  3: { name: "Elena Rostova", department: "Neurology" },
  4: { name: "Marcus Vance", department: "Orthopedics" },
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()
    const { name, gender, age, dateTime, doctorId } = body

    // Validate required fields
    const missingFields = []
    if (!name) missingFields.push('name')
    if (!gender) missingFields.push('gender')
    if (!age) missingFields.push('age')
    if (!dateTime) missingFields.push('dateTime')
    if (!doctorId) missingFields.push('doctorId')
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` }, 
        { status: 400 }
      )
    }

    const doctorIdNum = Number(doctorId)
    if (isNaN(doctorIdNum)) {
      return NextResponse.json({ error: 'Invalid doctor ID format' }, { status: 400 })
    }

    const maleAvatars = ['male1.jpg', 'male2.jpg', 'male3.jpg', 'male4.jpg', 'male5.jpg']
    const femaleAvatars = ['female1.jpg', 'female2.jpg', 'female3.jpg', 'female4.jpg', 'female5.jpg']
    
    const avatar = gender === 'Male'
      ? maleAvatars[Math.floor(Math.random() * maleAvatars.length)]
      : femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)]

    const appointmentId = uuidv4()

    // 1. Try PostgreSQL
    try {
      const doctor = await prisma.doctor.findUnique({ 
        where: { id: doctorIdNum },
      })
      
      if (!doctor) {
        return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
      }

      const appointment = await prisma.appointment.create({
        data: {
          id: appointmentId, 
          name,
          gender,
          age: Number(age),
          dateTime: new Date(dateTime),
          doctor: {
            connect: { id: doctorIdNum }
          },
          avatar,
        }
      })

      return NextResponse.json({ success: true, appointment }, { status: 201 })
    } catch (dbError) {
      console.warn('[APPT_POST_DB_FALLBACK] Database offline, saving appointment to dev store:', dbError)
      
      const docInfo = DEFAULT_DOCTORS[doctorIdNum] || { name: "Specialist Physician", department: "General Practice" }
      const newAppt = devHospitalStore.createAppointment({
        name,
        gender,
        age: Number(age),
        dateTime: new Date(dateTime).toISOString(),
        status: "Pending",
        doctorId: doctorIdNum,
        patientEmail: session?.user?.email || undefined,
        avatar,
        doctor: {
          id: doctorIdNum,
          name: docInfo.name,
          department: docInfo.department,
        },
      })

      return NextResponse.json({ success: true, appointment: newAppt }, { status: 201 })
    }
  } catch (error: unknown) {
    console.error('[APPOINTMENT_POST_ERROR]', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: 'Failed to create appointment', details: errorMessage }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const role = (session?.user?.role || '').toUpperCase()
    const userEmail = session?.user?.email?.toLowerCase().trim() || null
    const userName = session?.user?.name || null

    const doctorId = session?.user?.id ? parseInt(session.user.id, 10) : null
    const isDoctor = role === 'DOCTOR' && !isNaN(doctorId!)
    const isPatient = role === 'PATIENT' || role === 'USER'

    // 1. Try PostgreSQL
    try {
      let whereClause: any = {}
      if (isDoctor) {
        whereClause = { doctorId: doctorId! }
      } else if (isPatient) {
        whereClause = {
          OR: [
            ...(userEmail ? [{ patient: { email: userEmail } }] : []),
            ...(userName ? [{ name: userName }] : []),
          ]
        }
      }

      const appointments = await prisma.appointment.findMany({
        where: whereClause,
        orderBy: {
          dateTime: 'asc'
        },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              department: true,
            },
          },
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
      })

      return NextResponse.json(appointments, { status: 200 })
    } catch (dbError) {
      console.warn('[APPT_FETCH_FALLBACK] Database offline, retrieving from dev store:', dbError)

      // Patient Data Isolation: If patient, ONLY return their own appointments
      if (isPatient) {
        const patientAppointments = devHospitalStore.getAppointments({
          patientEmail: userEmail,
          patientName: userName,
        })
        return NextResponse.json(patientAppointments, { status: 200 })
      }

      if (isDoctor) {
        const doctorAppointments = devHospitalStore.getAppointments({
          doctorId: doctorId || 1,
        })
        return NextResponse.json(doctorAppointments, { status: 200 })
      }

      // Admin sees all
      return NextResponse.json(devHospitalStore.getAppointments(), { status: 200 })
    }
  } catch (error: unknown) {
    console.error('[APPT_FETCH_FATAL]', error)
    return NextResponse.json([], { status: 200 })
  }
}

