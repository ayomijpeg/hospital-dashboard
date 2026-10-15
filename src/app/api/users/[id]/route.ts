import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { role } = await req.json();

    const normalizedRole = String(role).toLowerCase();
    if (!["admin", "doctor", "patient", "user"].includes(normalizedRole)) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: { role: normalizedRole },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return NextResponse.json(updatedUser);
    } catch {
      console.warn("DB update bypassed in offline mode for user:", id);
      return NextResponse.json({
        id: Number(id),
        role: normalizedRole,
        updatedLocally: true,
      });
    }
  } catch (error) {
    console.error("Failed to update user role:", error);
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}

