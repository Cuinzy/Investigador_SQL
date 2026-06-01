import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ ok: false, error: "Contraseña de administrador no configurada" }, { status: 500 });
  }

  if (!password || password !== adminPassword) {
    return NextResponse.json({ ok: false, error: "Contraseña incorrecta" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
