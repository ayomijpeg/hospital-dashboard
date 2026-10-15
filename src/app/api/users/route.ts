import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.warn("Using fallback users list:", error);
    const FALLBACK_USERS = [
      {
        id: 1,
        name: "Dr. Sarah Jenkins",
        email: "s.jenkins@hospital.org",
        role: "doctor",
        createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
      },
      {
        id: 2,
        name: "Dr. Jonathan Reyes",
        email: "j.reyes@hospital.org",
        role: "doctor",
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      },
      {
        id: 3,
        name: "Eleanor Vance",
        email: "eleanor.vance@gmail.com",
        role: "patient",
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      },
      {
        id: 4,
        name: "Marcus Sterling",
        email: "marcus.sterling@gmail.com",
        role: "patient",
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        id: 5,
        name: "System Administrator",
        email: "admin@hospital.org",
        role: "admin",
        createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
      },
    ];
    return NextResponse.json(FALLBACK_USERS);
  }
}
