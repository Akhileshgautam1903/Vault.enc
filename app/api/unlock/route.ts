import { NextResponse } from "next/server";
import { decryptVault } from "@/lib/crypto";

import fs from "fs";
import path from "path";
import { Vault } from "@/model/entry";

export async function POST(request: Request) {
  // 1. Get masterPassword from request body
  const { masterPassword, fileContents } = await request.json();

  const filePath = path.join(process.cwd(), "data", "vault.enc");

  // 2. Check vault.enc exists — use fs.existsSync directly
  const fileExists = fs.existsSync(filePath);

  // 3. Read the file — fs.readFileSync(filePath, "utf-8")
  if (!fileExists) {
    return NextResponse.json(
      { error: "File does not exists" },
      { status: 404 },
    );
  }
  const cipherTxt = fileContents ?? fs.readFileSync(filePath, "utf-8");

  // 4. Call decryptVault() from your crypto.ts and return decrypted data or 401 if wrong password
  var decryptedData;
  try {
    const decryptedData = decryptVault(cipherTxt, masterPassword) as Vault;
    return NextResponse.json({ data: decryptedData.entries });
  } catch (error) {
    return NextResponse.json(
      { error: "Incorrect master password" },
      { status: 401 },
    );
  }
}
