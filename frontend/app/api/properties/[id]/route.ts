import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${API_BASE_URL}/properties/${params.id}`, { cache: "no-store" });
  const data = await res.text();
  return new NextResponse(data, { status: res.status, headers: { "Content-Type": "application/json" } });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.text();
  const res = await fetch(`${API_BASE_URL}/properties/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const data = await res.text();
  return new NextResponse(data, { status: res.status, headers: { "Content-Type": "application/json" } });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${API_BASE_URL}/properties/${params.id}`, { method: "DELETE" });
  return new NextResponse(null, { status: res.status });
}
