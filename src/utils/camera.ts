// src/utils/camera.ts
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

/** Capture a photo and return a File + preview URL */
export async function takePhotoAsFile(prefix: string): Promise<{ file: File; url: string }> {
  const photo = await Camera.getPhoto({
    quality: 80,
    resultType: CameraResultType.Uri,
    source: CameraSource.Prompt,
    correctOrientation: true,
    promptLabelHeader: "Add Photo",
    promptLabelPhoto: "Choose from Photos",
    promptLabelPicture: "Take Photo",
  });
  const webPath = photo.webPath;
  if (!webPath) throw new Error("No photo path");

  const resp = await fetch(webPath);
  const blob = await resp.blob();
  const ext =
    blob.type.includes("jpeg") || blob.type.includes("jpg")
      ? "jpg"
      : blob.type.includes("png")
      ? "png"
      : "jpg";
  const file = new File([blob], `${prefix}-${Date.now()}.${ext}`, { type: blob.type });

  const url = URL.createObjectURL(file);
  return { file, url };
}
