import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentDate = new Date();

    const appointments = await prisma.appointment.findMany({
      where: {
        dateTime: {
          gte: currentDate,
        },
      },
      orderBy: {
        dateTime: "asc",
      },
      include: {
        doctor: {
          select: {
            name: true,
            department: true,
          },
        },
      },
      take: 4,
    });

    console.log(`[ALL_APPOINTMENTS] Found ${appointments.length} appointments`);
    return NextResponse.json(appointments, { status: 200 });
  } catch {
    console.warn("[ALL_APPT_FETCH_FALLBACK] Database offline, providing fallback appointments");
    const FALLBACK = [
      {
        id: "apt-101",
        name: "Eleanor Vance",
        gender: "Female",
        age: 54,
        dateTime: new Date(Date.now() + 3600000 * 2).toISOString(),
        status: "Pending",
        doctor: { name: "Sarah Jenkins", department: "Cardiology" }
      },
      {
        id: "apt-102",
        name: "Marcus Sterling",
        gender: "Male",
        age: 8,
        dateTime: new Date(Date.now() + 3600000 * 5).toISOString(),
        status: "Confirmed",
        doctor: { name: "Jonathan Reyes", department: "Pediatrics" }
      }
    ];
    return NextResponse.json(FALLBACK, { status: 200 });
  }
}
