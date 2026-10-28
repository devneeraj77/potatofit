import { NextRequest, NextResponse } from "next/server";
import {
  bulkUpdateBlogs,
  bulkToggleBlogStatus,
  bulkDeleteBlogs,
} from "@/lib/blog-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, action, status, categoryId } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please select at least one article." },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Missing required bulk action parameter." },
        { status: 400 }
      );
    }

    if (action === "toggle_status") {
      const res = bulkToggleBlogStatus(ids);
      return NextResponse.json({
        success: true,
        count: res.count,
        message: `Toggled publication status for ${res.count} article${res.count > 1 ? "s" : ""}.`,
        updatedBlogs: res.updatedBlogs,
      });
    }

    if (action === "update_status") {
      if (!status || !["published", "draft", "archived"].includes(status)) {
        return NextResponse.json(
          { success: false, error: "Invalid or missing status ('published', 'draft', or 'archived')." },
          { status: 400 }
        );
      }
      const res = bulkUpdateBlogs(ids, { status });
      return NextResponse.json({
        success: true,
        count: res.count,
        message: `Set status to "${status}" for ${res.count} article${res.count > 1 ? "s" : ""}.`,
        updatedBlogs: res.updatedBlogs,
      });
    }

    if (action === "update_category") {
      if (!categoryId) {
        return NextResponse.json(
          { success: false, error: "Please choose a category to assign." },
          { status: 400 }
        );
      }
      const res = bulkUpdateBlogs(ids, { categoryId });
      return NextResponse.json({
        success: true,
        count: res.count,
        message: `Updated category to "${res.updatedBlogs[0]?.categoryName || "selected category"}" for ${res.count} article${res.count > 1 ? "s" : ""}.`,
        updatedBlogs: res.updatedBlogs,
      });
    }

    if (action === "delete") {
      const res = bulkDeleteBlogs(ids);
      return NextResponse.json({
        success: true,
        count: res.count,
        message: `Permanently deleted ${res.count} article${res.count > 1 ? "s" : ""}.`,
      });
    }

    return NextResponse.json(
      { success: false, error: `Unknown bulk action: "${action}"` },
      { status: 400 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Bulk operation failed";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
