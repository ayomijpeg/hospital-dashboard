import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { prisma } from "@/libs/prisma";
import { devAuthStore } from "@/libs/devAuthStore";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase().trim();

    // 1. Check DevAuthStore
    const devUser = devAuthStore.findByEmail(email);

    // 2. If not in DevAuthStore and DB is available, check Prisma
    let dbUser: any = null;
    if (!devUser) {
      try {
        dbUser = await (prisma as any).user.findUnique({
          where: { email },
          select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
      } catch {
        // Offline mode
      }
    }

    const role = (session.user as any).role || devUser?.role || dbUser?.role || "patient";

    // Build comprehensive profile response
    const profile = {
      id: devUser?.id || dbUser?.id || 1,
      name: devUser?.name || session.user.name || "User",
      email: email,
      role: role.toUpperCase(),
      avatar: devUser?.avatar || (session.user as any).avatar || null,
      gender: devUser?.gender || "Not Specified",
      age: devUser?.age || 32,
      department: devUser?.department || (session.user as any).department || "General Medicine",
      condition: devUser?.condition || "Primary Care Wellness",
      phone: devUser?.phone || "+1 (555) 234-5678",
      address: devUser?.address || "742 Evergreen Terrace, Medical District, Springfield",
      bloodGroup: devUser?.bloodGroup || "O+",
      allergies: devUser?.allergies || "No known drug allergies (NKDA)",
      emergencyContact: devUser?.emergencyContact || {
        name: "Sarah Parker",
        phone: "+1 (555) 987-6543",
        relation: "Spouse",
      },
      insurance: devUser?.insurance || {
        provider: "Blue Cross Blue Shield Health Network",
        policyNumber: "BCBS-84920491",
        groupNumber: "GRP-9021",
      },
      // Doctor specifics
      licenseNumber: devUser?.licenseNumber || "MED-84920-STATE",
      npi: devUser?.npi || "1948201948",
      roomNumber: devUser?.roomNumber || "Suite 402 - Clinical Wing A",
      consultationDuration: devUser?.consultationDuration || 30,
      acceptingPatients: devUser?.acceptingPatients ?? true,
      createdAt: devUser?.createdAt || new Date().toISOString(),
    };

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Failed to load user profile:", error);
    return NextResponse.json(
      { error: "Internal server error fetching profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase().trim();
    const body = await req.json();

    const existingAccount = devAuthStore.findByEmail(email);

    // Password change flow
    if (body.newPassword) {
      if (!body.currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password" },
          { status: 400 }
        );
      }

      if (existingAccount && existingAccount.password) {
        const isMatch = await bcrypt.compare(body.currentPassword, existingAccount.password);
        if (!isMatch) {
          return NextResponse.json(
            { error: "The current password entered is incorrect" },
            { status: 400 }
          );
        }
      }

      if (body.newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }

      const newHash = bcrypt.hashSync(body.newPassword, 10);
      devAuthStore.update(email, { password: newHash });

      try {
        await (prisma as any).user.update({
          where: { email },
          data: { password: newHash },
        });
      } catch {
        // Offline resilience
      }

      return NextResponse.json({
        success: true,
        message: "Password updated successfully",
      });
    }

    // Standard profile updates
    const updates: any = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.phone !== undefined) updates.phone = body.phone;
    if (body.address !== undefined) updates.address = body.address;
    if (body.age !== undefined) updates.age = Number(body.age);
    if (body.gender !== undefined) updates.gender = body.gender;
    if (body.bloodGroup !== undefined) updates.bloodGroup = body.bloodGroup;
    if (body.allergies !== undefined) updates.allergies = body.allergies;
    if (body.emergencyContact !== undefined) updates.emergencyContact = body.emergencyContact;
    if (body.insurance !== undefined) updates.insurance = body.insurance;
    if (body.department !== undefined) updates.department = body.department;
    if (body.licenseNumber !== undefined) updates.licenseNumber = body.licenseNumber;
    if (body.npi !== undefined) updates.npi = body.npi;
    if (body.roomNumber !== undefined) updates.roomNumber = body.roomNumber;
    if (body.consultationDuration !== undefined) updates.consultationDuration = Number(body.consultationDuration);
    if (body.acceptingPatients !== undefined) updates.acceptingPatients = Boolean(body.acceptingPatients);

    let updatedAccount = null;
    if (existingAccount) {
      updatedAccount = devAuthStore.update(email, updates);
    }

    // Attempt Prisma updates if DB is live
    try {
      if (body.name) {
        await (prisma as any).user.updateMany({
          where: { email },
          data: { name: body.name },
        });
        await (prisma as any).patient.updateMany({
          where: { email },
          data: { name: body.name, age: body.age ? Number(body.age) : undefined },
        });
        await (prisma as any).doctor.updateMany({
          where: { email },
          data: { name: body.name, department: body.department },
        });
      }
    } catch {
      // Offline fallback
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedAccount,
    });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile changes" },
      { status: 500 }
    );
  }
}
