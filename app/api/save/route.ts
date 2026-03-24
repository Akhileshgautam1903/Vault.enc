import { NextResponse } from "next/server";
import { encryptVault } from "@/lib/crypto";

import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  // Take the master password and entries
  const { masterPassword, entries } = await request.json();

  // Encrypt the data
  const encryptedData = encryptVault(entries, masterPassword);

  // Write to the file and return appropriate message
  const filePath = path.join(process.cwd(), "data", "vault.enc");

  try {
    fs.writeFileSync(filePath, encryptedData);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to save to vault" },
      { status: 500 },
    );
  }
}
