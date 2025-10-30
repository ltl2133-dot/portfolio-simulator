import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/utils";

export async function GET() {
  const res = await fetch(`${API_BASE_URL}/portfolio/analytics`, { cache: "no-store" });
  const data = await res.text();
  return new NextResponse(data, { status: res.status, headers: { "Content-Type": "application/json" } });
}
