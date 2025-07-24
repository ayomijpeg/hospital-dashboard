import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/libs/auth'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
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

    // Convert doctorId to number
    const doctorIdNum = Number(doctorId)
    if (isNaN(doctorIdNum)) {
      return NextResponse.json({ error: 'Invalid doctor ID format' }, { status: 400 })
    }

    // Validate doctor exists
    const doctor = await prisma.doctor.findUnique({ 
      where: { id: doctorIdNum },
    })
    
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    } 

    // Pick avatar based on gender
    const maleAvatars = ['male1.jpg', 'male2.jpg', 'male3.jpg', 'male4.jpg', 'male5.jpg', 'male6.jpg', 'male7.jpg', 'male8.jpg', 'male9.jpg']
    const femaleAvatars = ['female1.jpg', 'female2.jpg', 'female3.jpg', 'female4.jpg', 'female5.jpg', 'female6.jpg', 'female7.jpg', 'female8.jpg', 'female9.jpg']
    
    const avatar = gender === 'Male'
      ? maleAvatars[Math.floor(Math.random() * maleAvatars.length)]
      : femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)]

        const appointmentId = uuidv4()
    // Create the appointment
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

    // Update doctor status to "Booked"
    await prisma.doctor.update({
      where: { id: doctorIdNum },
      data: { status: 'Booked' },
    })

    return NextResponse.json({ success: true, appointment }, { status: 201 })
  } catch (error: unknown) {
    console.error('[APPOINTMENT_POST]', error)
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
    
    console.log('[DEBUG SESSION]', session)

    // Validate session
    if (!session?.user?.id) {
      console.error('[UNAUTHORIZED] No user ID in session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Convert session ID to number
    const doctorId = parseInt(session.user.id, 10)
    if (isNaN(doctorId)) {
      console.error('[INVALID_DOCTOR_ID]', session.user.id)
      return NextResponse.json({ error: 'Invalid doctor ID format' }, { status: 400 })
    }

    // Get current date for filtering upcoming appointments
    const currentDate = new Date()
    
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorId,
        dateTime: {
          gte: currentDate
        }
      },
      orderBy: {                                                                             
        dateTime: 'asc'
      },
      include: {
        doctor: {
          select: {
            name: true,
            department: true,
          },
        },
      },
    })

    console.log(`[APPOINTMENTS] Found ${appointments.length} for doctor ${doctorId}`)
    return NextResponse.json(appointments, { status: 200 })
  } catch (error: unknown) {
    console.error('[APPT_FETCH_ERROR]', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: 'Failed to load appointments', details: errorMessage },
      { status: 500 }
    )
  }
}

