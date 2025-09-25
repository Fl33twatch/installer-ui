// ==============================================================
// src/utils/toast.ts
// Tiny helper for ion toasts (no external type imports)
// ==============================================================

type ToastPosition = "top" | "bottom" | "middle";

type SimpleToastOptions = {
  message: string;
  color?: string;
  duration?: number;
  position?: ToastPosition;
};

export async function showToast(
  present: (options: SimpleToastOptions) => Promise<void>,
  message: string,
  color: string = "success",
  duration = 1600
) {
  const opts: SimpleToastOptions = {
    message,
    color,
    duration,
    position: "bottom",
  };
  await present(opts);
}
