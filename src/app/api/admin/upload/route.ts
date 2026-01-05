import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { ensureUploadsDir } from "../../../lib/files";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { filename, data } = body;
    if (!filename || !data)
      return NextResponse.json(
        { ok: false, error: "missing filename or data" },
        { status: 400 }
      );

    // Data may be data:<mime>;base64,<base64> or just base64
    const matches = (data as string).match(/^data:(.+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = filename.split(".").pop() || "png";
    if (matches) {
      const base64 = matches[2];
      const mime = matches[1];
      const mimeExt = mime.split("/")[1];
      if (mimeExt) ext = mimeExt;
      buffer = Buffer.from(base64, "base64");
    } else {
      buffer = Buffer.from(data as string, "base64");
    }

    const unique = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;
    const uploadDir = await ensureUploadsDir();
    const filePath = path.join(uploadDir, unique);

    await fs.writeFile(filePath, buffer);

    // Return a URL relative to project public folder
    const url = `/uploads/${unique}`;
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
