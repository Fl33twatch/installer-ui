// src/utils/image.ts
// Downscale & compress an image File using a canvas.
// Returns a new File and an object URL preview.

export async function compressImageFile(
  file: File,
  opts: { maxDim?: number; quality?: number } = {}
): Promise<{ file: File; url: string }> {
  const maxDim = opts.maxDim ?? 1600;     // max width or height
  const quality = opts.quality ?? 0.8;    // JPEG/WebP quality (0-1)

  // Read to data URL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });

  // Load image
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });

  // Compute target size
  const { width, height } = img;
  const scale = Math.min(1, maxDim / Math.max(width, height));
  const targetW = Math.round(width * scale);
  const targetH = Math.round(height * scale);

  // Draw on canvas
  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D not available");
  ctx.drawImage(img, 0, 0, targetW, targetH);

  // Choose output type (prefer JPEG)
  const outType = "image/jpeg";
  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), outType, quality)
  );

  const ext = outType === "image/jpeg" ? "jpg" : "webp";
  const outFile = new File([blob], renameWithSuffix(file.name, `compressed.${ext}`), {
    type: outType,
    lastModified: Date.now(),
  });

  const url = URL.createObjectURL(outFile);
  return { file: outFile, url };
}

function renameWithSuffix(name: string, suffix: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? `${name.slice(0, dot)}.${suffix}` : `${name}.${suffix}`;
}
