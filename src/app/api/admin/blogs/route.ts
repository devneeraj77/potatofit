import { NextRequest, NextResponse } from "next/server";
import { getBlogs, createBlog } from "@/lib/blog-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase();

    let blogs = getBlogs();

    if (category && category !== "all") {
      blogs = blogs.filter((b) => b.categoryId === category);
    }

    if (status && status !== "all") {
      blogs = blogs.filter((b) => b.status === status);
    }

    if (search) {
      blogs = blogs.filter(
        (b) =>
          b.title.toLowerCase().includes(search) ||
          b.excerpt.toLowerCase().includes(search) ||
          b.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ success: true, count: blogs.length, blogs });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch blogs";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = createBlog(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, blog: result.blog }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create blog post";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
