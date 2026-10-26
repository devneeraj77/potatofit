import { NextRequest, NextResponse } from "next/server";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/blog-store";

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json({ success: true, count: categories.length, categories });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch categories";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = createCategory(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, category: result.category }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create category";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Category ID is required" }, { status: 400 });
    }

    const result = updateCategory(id, updates);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, category: result.category });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update category";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Category ID is required" }, { status: 400 });
    }

    const result = deleteCategory(id);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete category";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
