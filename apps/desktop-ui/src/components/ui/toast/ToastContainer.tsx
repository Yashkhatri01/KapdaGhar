import Toast from "./Toast";
import type { ToastItem } from "./types";

type Props = {
  toasts: ToastItem[];
  onClose: (id: string) => void;
};

function ToastContainer({
  toasts,
  onClose,
}: Props) {
  return (
    <div
      className="
        fixed
        top-5
        right-5
        z-[9999]

        flex
        flex-col
        gap-3

        pointer-events-none
      "
    >
      {toasts.map((toast) => (

        <div
          key={toast.id}
          className="
            pointer-events-auto

            transition-all
            duration-300

            animate-[toastStack_.25s_ease]
          "
        >
          <Toast
            toast={toast}
            onClose={onClose}
          />
        </div>

      ))}
    </div>
  );
}

export default ToastContainer;