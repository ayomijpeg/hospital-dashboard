import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const bills = await prisma.bill.findMany({
      include: {
        appointment: {
          select: {
            id: true,
            name: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        issuedAt: "desc",
      },
    });

    const processedBills = bills.map((bill: any) => {
      const patientName =
        bill.patient?.name || bill.appointment?.name || "Unknown Patient";

      const patientInfo = bill.patient
        ? { id: bill.patient.id, name: bill.patient.name }
        : bill.patientId
        ? { id: bill.patientId, name: "Patient not found" }
        : { id: null, name: patientName };

      const doctorInfo = bill.doctor
        ? { id: bill.doctor.id, name: bill.doctor.name }
        : { id: bill.doctorId, name: "Unknown Doctor" };

      return {
        ...bill,
        patientName,
        patient: patientInfo,
        doctor: doctorInfo,
        appointmentName: bill.appointment?.name || null,
      };
    });

    return NextResponse.json(processedBills);
  } catch (error) {
    console.error("[BILL_FETCH_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch billing data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { appointmentId, services, amount } = await req.json();

    if (!appointmentId || !services || amount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: String(appointmentId) }, // ensure type matches schema
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    const bill = await prisma.bill.create({
      data: {
        appointmentId: appointment.id,
        doctorId: appointment.doctorId,
        services: String(services),
        amount: Number(amount),
        status: "Unpaid",
        issuedAt: new Date(),
        ...(appointment.patientId && { patientId: appointment.patientId }),
      },
    });

    return NextResponse.json(
      { message: "Bill created successfully", bill },
      { status: 201 }
    );
  } catch (error) {
    console.error("[BILL_CREATION_ERROR]", error);

    return NextResponse.json(
      { error: "Failed to create bill" },
      { status: 500 }
    );
  }
}
