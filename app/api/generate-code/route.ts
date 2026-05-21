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
    const body = await req.json();
    const {
      investigatorCode,
      investigatorName,
      caseId,
      caseTitle,
      culpritName,
      queryCount,
      queriesHash,
      solvedAt,
    } = body;

    const payload = JSON.stringify({
      game_id: GAME_ID,
      version: "1",
      investigator_code: investigatorCode,
      investigator_name: investigatorName,
      case_id: caseId,
      case_title: caseTitle,
      solved: true,
      culprit: culpritName,
      query_count: queryCount,
      queries_hash: queriesHash,
      solved_at: solvedAt,
      nonce: crypto.randomBytes(8).toString("hex"),
    });

    const key = deriveKey(investigatorCode);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    cipher.setAAD(Buffer.from(GAME_ID + investigatorCode));
    const encrypted = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();

    const code = [
      "SQLCASE1",
      GAME_ID,
      investigatorCode,
      iv.toString("base64url"),
      encrypted.toString("base64url"),
      tag.toString("base64url"),
    ].join(".");

    return NextResponse.json({ code });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
