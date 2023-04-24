import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) return new NextResponse("No URL provided", { status: 400 });
  const response = await fetch(url);
  const body = await response.text();
  return new NextResponse(body, { status: 200 });
}
