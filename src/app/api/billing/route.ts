import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { Prisma } from '@prisma/client'
import type { bill } from '@prisma/client'

type BillWithRelations = bill & {
  patient?: { id: number; name: string } | null
  doctor?: { id: number; name: string } | null
  appointment?: { id: string; name: string } | null
}

export async function GET() {
  try {
    const bills = await prisma.bill.findMany({
      include: {
        appointment: {
          select: {
            id: true,
            name: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true
          }
        },
        patient: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        issuedAt: 'desc'
      }
    });

    // Add patientName to processed bills
    const processedBills = bills.map((bill: BillWithRelations) => {
      // Get patient name from multiple sources
      const patientName = bill.patientName || 
                         bill.patient?.name || 
                         bill.appointment?.name || 
                         'Unknown Patient'
      
      const patientInfo = bill.patient
        ? { id: bill.patient.id, name: bill.patient.name }
        : bill.patientId
        ? { id: bill.patientId, name: 'Patient not found' }
        : { id: null, name: patientName }  // Use the determined patient name

      const doctorInfo = bill.doctor
        ? { id: bill.doctor.id, name: bill.doctor.name }
        : { id: bill.doctorId, name: 'Unknown Doctor' }

      return {
        ...bill,
        patientName,  // Add patientName to the response
        patient: patientInfo,
        doctor: doctorInfo,
        appointmentName: bill.appointment?.name || null,
      }
    })

    return NextResponse.json(processedBills)
  } catch (error) {
    console.error('[BILL_FETCH_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to fetch billing data' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { appointmentId, services, amount } = await req.json()

    // Validate required fields
    if (!appointmentId || !services || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get appointment data with patient relation
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          select: { name: true }
        }
      }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Get patient name from either patient record or appointment
    const patientName = appointment.patient?.name || appointment.name

    // Verify patient exists if patientId is present
    let validPatientId: number | undefined = undefined

    if (appointment.patientId) {
      const patientExists = await prisma.patient.count({
        where: { id: appointment.patientId }
      })

      if (patientExists) {
        validPatientId = appointment.patientId
      } else {
        // Clear invalid reference
        await prisma.appointment.update({
          where: { id: appointmentId },
          data: { patientId: null }
        })
      }
    }

    // Prepare bill data with patientName
    const billData = {
      appointmentId: appointment.id,
      doctorId: appointment.doctorId,
      services,
      amount: Number(amount),
      status: 'Unpaid',
      issuedAt: new Date(),
      patientName,  // Store patient name directly
      ...(validPatientId ? { patientId: validPatientId } : {})
    }

    // Execute in transaction
    const result = await prisma.$transaction([
      prisma.bill.create({ data: billData }),
      prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'Completed' }
      })
    ])

    return NextResponse.json(result[0], { status: 201 })

  } catch (error) {
    console.error('[BILL_CREATION_ERROR]', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          { 
            error: 'Data integrity issue',
            details: 'Please check appointment patient reference'
          },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to create bill' },
      { status: 500 }
    )
  }
}