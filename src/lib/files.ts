import { promises as fs } from "fs";
import path from "path";

export async function deletePublicFile(url: string) {
  // only delete files under /uploads to be safe
  if (!url || !url.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", url);
  try {
    await fs.unlink(filePath);
  } catch (err) {
    // ignore if file doesn't exist
  }
}

export async function ensureUploadsDir() {
  const dir = path.join(process.cwd(), "public", "uploads");
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    // ignore
  }
  return dir;
}
