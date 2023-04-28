import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) return new NextResponse("No URL provided", { status: 400 });
  let body;
  try {
    const response = await fetch(url);
    body = await response.text();
  } catch (e) {
    console.log(e);
    return new NextResponse("Error fetching URL", { status: 400 });
  }
  return new NextResponse(body, { status: 200 });
}
