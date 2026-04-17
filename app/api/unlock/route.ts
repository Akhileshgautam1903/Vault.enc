import { NextResponse } from "next/server";
import { decryptVault } from "@/lib/crypto";

import { Vault } from "@/model/entry";

export async function POST(request: Request) {
  // 1. Get masterPassword and file contents from request body
  const { masterPassword, fileContents } = await request.json();

  // 3. Read the file content 
  const cipherTxt = fileContents;
  
  console.log(fileContents);

  // 4. Call decryptVault() from your crypto.ts and return decrypted data or 401 if wrong password
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
