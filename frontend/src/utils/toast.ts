import { toast } from "sonner";

export const showSuccess = (msg: string) =>
  toast.success(msg, { duration: 2500 });

export const showError = (msg: string) =>
  toast.error(msg, { duration: 3000 });

export const showInfo = (msg: string) =>
  toast.message(msg, { duration: 2000 });
