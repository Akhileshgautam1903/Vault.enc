import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  // 1. build the path to vault.enc
  const filePath = path.join(process.cwd(), "data", "vault.enc");

  // 2. check if it exists
  const fileExists = fs.existsSync(filePath);

  // 3. return { exists: true/false }
  return NextResponse.json({ exists: fileExists });
}
