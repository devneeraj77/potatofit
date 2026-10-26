import { NextRequest, NextResponse } from "next/server";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  seedAdmins,
} from "@/lib/admin-store";

export async function GET() {
  try {
    const admins = getAdmins();
    return NextResponse.json({ success: true, count: admins.length, admins });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch admins";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "seed") {
      const res = seedAdmins();
      return NextResponse.json({ success: true, seeded: res.count, admins: res.admins });
    }

    const result = createAdmin(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, admin: result.admin }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create admin";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, ...updates } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Admin email is required" }, { status: 400 });
    }

    const result = updateAdmin(email, updates);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, admin: result.admin });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update admin";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Admin email is required" }, { status: 400 });
    }

    const result = deleteAdmin(email);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Admin ${email} removed` });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete admin";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
