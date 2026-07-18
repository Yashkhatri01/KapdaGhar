export type ToastVariant =
  | "success"
  | "error"
  | "warning"
  | "info";

export type ToastItem = {
  id: string;

  variant: ToastVariant;

  title: string;

  description?: string;

  duration?: number;
};