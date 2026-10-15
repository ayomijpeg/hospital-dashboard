import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";
import { devHospitalStore } from "@/libs/devDataStore";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user?.role || "").toUpperCase();
  const userEmail = session?.user?.email?.toLowerCase().trim() || null;
  const userName = session?.user?.name || null;
  const isPatient = role === "PATIENT" || role === "USER";
  const doctorId = session?.user?.id ? parseInt(session.user.id, 10) : null;
  const isDoctor = role === "DOCTOR" && !isNaN(doctorId!);

  try {
    let whereClause: any = {};
    if (isPatient) {
      whereClause = {
        OR: [
          ...(userEmail ? [{ patient: { email: userEmail } }] : []),
          ...(userName ? [{ appointment: { name: userName } }] : []),
        ],
      };
    } else if (isDoctor) {
      whereClause = { doctorId: doctorId! };
    }

    const bills = await prisma.bill.findMany({
      where: whereClause,
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
    console.warn("[BILL_FETCH_FALLBACK] Database offline, retrieving from dev store:", error);

    // Patient Data Isolation: ONLY return bills belonging to this patient
    if (isPatient) {
      const patientBills = devHospitalStore.getBills({
        patientEmail: userEmail,
        patientName: userName,
      });
      return NextResponse.json(patientBills);
    }

    if (isDoctor) {
      const doctorBills = devHospitalStore.getBills({ doctorId: doctorId || 1 });
      return NextResponse.json(doctorBills);
    }

    // Admin sees all bills
    return NextResponse.json(devHospitalStore.getBills());
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

    // 1. Try PostgreSQL
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: String(appointmentId) },
      });

      if (!appointment) {
        throw new Error("Appointment not found in PostgreSQL");
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
    } catch (dbError) {
      console.warn("[BILL_CREATE_DB_FALLBACK] Database offline, saving bill to dev store:", dbError);

      const devBill = devHospitalStore.createBill({
        appointmentId: String(appointmentId),
        patientName: "Consultation Patient",
        patient: { id: 1, name: "Consultation Patient" },
        doctor: { id: 1, name: "Attending Physician" },
        doctorId: 1,
        services: String(services),
        amount: Number(amount),
        status: "Unpaid",
      });

      return NextResponse.json(
        { message: "Bill created successfully", bill: devBill },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("[BILL_CREATION_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create bill" },
      { status: 500 }
    );
  }
}
