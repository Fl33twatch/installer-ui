import { Storage } from "@google-cloud/storage";
import sharp from "sharp";

const projectId = process.env.GOOGLE_CLOUD_PROJECT;
const bucketName = process.env.BUCKET || "fleetwatch-installer-uploads";
const maxPhotoKB = Number(process.env.MAX_PHOTO_SIZE || "1024"); // default 1MB
const maxPixels = 1600; // downscale longest side to 1600px

const storage = new Storage({ projectId });
const bucket = storage.bucket(bucketName);

export async function compressIfNeeded(input: Buffer, contentType: string) {
  // Only attempt to process JPEG/PNG/WEBP
  const ct = (contentType || "").toLowerCase();
  const canProcess = ct.includes("jpeg") || ct.includes("jpg") || ct.includes("png") || ct.includes("webp");
  if (!canProcess) return { buffer: input, contentType };

  // Resize to maxPixels longest side, re-encode to JPEG with decent quality
  const out = await sharp(input)
    .rotate()                 // auto-orient
    .resize({ width: maxPixels, height: maxPixels, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 72, mozjpeg: true })
    .toBuffer();

  // If still larger than maxPhotoKB, try a second pass at lower quality
  if (out.byteLength > maxPhotoKB * 1024) {
    const out2 = await sharp(input)
      .rotate()
      .resize({ width: maxPixels, height: maxPixels, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 60, mozjpeg: true })
      .toBuffer();
    return { buffer: out2, contentType: "image/jpeg" };
  }

  return { buffer: out, contentType: "image/jpeg" };
}

export async function uploadBuffer(
  buffer: Buffer,
  key: string,
  contentType: string
) {
  const file = bucket.file(key);
  await file.save(buffer, { contentType, resumable: false, public: false });
  // Short-lived signed URL for quick preview if you need it in UI logs
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 15 * 60 * 1000,
  });
  return { gcsPath: `gs://${bucketName}/${key}`, url };
}
