// backend/storage.js
const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");

const projectId = process.env.GOOGLE_CLOUD_PROJECT;
const bucketName = process.env.BUCKET || "fleetwatch-installer-uploads";
const maxPhotoKB = Number(process.env.MAX_PHOTO_SIZE || "1024"); // default 1MB
const maxPixels = 1600; // downscale longest side to 1600px

const storage = new Storage({ projectId });
const bucket = storage.bucket(bucketName);

async function compressIfNeeded(input, contentType) {
  const ct = (contentType || "").toLowerCase();
  const canProcess =
    ct.includes("jpeg") || ct.includes("jpg") || ct.includes("png") || ct.includes("webp");
  if (!canProcess) return { buffer: input, contentType };

  const out = await sharp(input)
    .rotate()
    .resize({ width: maxPixels, height: maxPixels, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 72, mozjpeg: true })
    .toBuffer();

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

async function uploadBuffer(buffer, key, contentType) {
  const file = bucket.file(key);
  await file.save(buffer, { contentType, resumable: false, public: false });
  // No signed URL -> avoids iam.serviceAccounts.signBlob
  return { gcsPath: `gs://${bucketName}/${key}`, url: null };
}

module.exports = {
  compressIfNeeded,
  uploadBuffer,
};
