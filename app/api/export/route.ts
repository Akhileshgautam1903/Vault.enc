import { NextResponse } from "next/server";

import fs from "fs";
import path from "path";

export async function GET() {
  // Create the path
  const filePath = path.join(process.cwd(), "data", "vault.enc");

  // Check if the file exists
  const fileExists = fs.existsSync(filePath);

  // If file exists then return the content else error
  if (!fileExists) {
    return NextResponse.json({ error: "No vault found" }, { status: 404 });
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");
  return NextResponse.json({ content: fileContents });
}
