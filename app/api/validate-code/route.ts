import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const GAME_ID = "EXPEDIENTE_SQL";
const SECRET = process.env.VALIDATION_SECRET ?? "expediente-sql-default-secret";

function deriveKey(investigatorCode: string): Buffer {
  const raw = crypto.hkdfSync(
    "sha256",
    Buffer.from(SECRET),
    Buffer.from(investigatorCode + GAME_ID),
    Buffer.from("exp-sql-v1"),
    32
  );
  return Buffer.from(raw);
}

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ valid: false, error: "Código vacío" });
    }

    const parts = code.trim().split(".");
    if (parts.length !== 6 || parts[0] !== "SQLCASE1") {
      return NextResponse.json({ valid: false, error: "Formato de código inválido" });
    }

    const [, gameId, investigatorCode, ivB64, ciphertextB64, tagB64] = parts;
    if (gameId !== GAME_ID) {
      return NextResponse.json({ valid: false, error: "Identificador de juego incorrecto" });
    }

    const iv = Buffer.from(ivB64, "base64url");
    const ciphertext = Buffer.from(ciphertextB64, "base64url");
    const tag = Buffer.from(tagB64, "base64url");
    const key = deriveKey(investigatorCode);

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAAD(Buffer.from(GAME_ID + investigatorCode));
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    const payload = JSON.parse(decrypted.toString("utf8"));

    return NextResponse.json({ valid: true, payload });
  } catch {
    return NextResponse.json({ valid: false, error: "Código inválido o corrupto" });
  }
}
