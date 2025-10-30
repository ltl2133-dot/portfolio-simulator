import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/utils";

export async function GET() {
  const res = await fetch(`${API_BASE_URL}/properties`, { cache: "no-store" });
  const data = await res.text();
  return new NextResponse(data, { status: res.status, headers: { "Content-Type": "application/json" } });
}

export async function POST(request: Request) {
  const body = await request.text();
  const res = await fetch(`${API_BASE_URL}/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const data = await res.text();
  return new NextResponse(data, { status: res.status, headers: { "Content-Type": "application/json" } });
}
