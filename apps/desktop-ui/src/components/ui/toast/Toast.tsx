import {
  CheckCircle2,
  XCircle,
  TriangleAlert,
  Info,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  ToastItem,
  ToastVariant,
} from "./types";

type Props = {
  toast: ToastItem;
  onClose: (id: string) => void;
};

const styles: Record<
  ToastVariant,
  {
    icon: React.ElementType;
    iconColor: string;
    accent: string;
    progress: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    accent: "border-l-emerald-500",
    progress: "bg-emerald-500",
  },

  error: {
    icon: XCircle,
    iconColor: "text-red-600",
    accent: "border-l-red-500",
    progress: "bg-red-500",
  },

  warning: {
    icon: TriangleAlert,
    iconColor: "text-amber-500",
    accent: "border-l-amber-500",
    progress: "bg-amber-500",
  },

  info: {
    icon: Info,
    iconColor: "text-blue-600",
    accent: "border-l-blue-500",
    progress: "bg-blue-500",
  },
};

function Toast({
  toast,
  onClose,
}: Props) {
  const style = styles[toast.variant];

  const Icon = style.icon;

  const duration =
  toast.duration ?? 4000;

const [progress, setProgress] =
  useState(100);

const remaining =
  useRef(duration);

const startTime =
  useRef(Date.now());

const frame =
  useRef<number | null>(null);

useEffect(() => {

  startTime.current = Date.now();

  frame.current =
    requestAnimationFrame(animate);

  return () => {

    if (frame.current) {
      cancelAnimationFrame(frame.current);
    }

  };

}, [toast.id]);

function animate() {

  const elapsed =
    Date.now() -
    startTime.current;

  const value =
    Math.max(
      0,
      remaining.current - elapsed
    );

  setProgress(
    (value / duration) * 100
  );

  if (value <= 0) {

    onClose(toast.id);

    return;

  }

  frame.current =
    requestAnimationFrame(
      animate
    );

}

function pause() {

  if (frame.current === null) return;

  remaining.current = Math.max(
    0,
    remaining.current -
      (Date.now() - startTime.current)
  );

  cancelAnimationFrame(frame.current);

  frame.current = null;

}

function resume() {

  if (frame.current !== null) return;

  startTime.current =
    Date.now();

  frame.current =
    requestAnimationFrame(
      animate
    );

}





  return (
    <div
        onMouseEnter={pause}

        onMouseLeave={resume}

      className="
        relative
        overflow-hidden

        w-[360px]
        max-w-[calc(100vw-2rem)]

        rounded-2xl

        border
        border-gray-200
        border-l-4

        bg-white/95
        backdrop-blur-md

        shadow-lg
        hover:shadow-xl

        animate-[toastIn_.25s_ease]

        transition-all
        duration-200
      "
    >
      {/* CONTENT */}

      <div
        className={`
          ${style.accent}

          flex
          items-start
          gap-3

          p-4
        `}
      >
        <div
  className="
    shrink-0
    rounded-xl
    bg-gray-50
    p-2
  "
>
  <Icon
    size={20}
    className={style.iconColor}
  />
</div>

        <div className="flex-1">

          <h3 className="font-semibold text-gray-900">
            {toast.title}
          </h3>

          {toast.description && (

            <p className="mt-1 text-sm text-gray-500">
              {toast.description}
            </p>

          )}

        </div>

        <button
          onClick={() => {

  if (frame.current) {

    cancelAnimationFrame(frame.current);

  }

  onClose(toast.id);

}}
          className="
            rounded-lg
            p-1

            text-gray-400

            transition

            hover:bg-gray-100
            hover:text-gray-700
          "
        >
          <X size={16} />
        </button>

      </div>

      {/* PROGRESS */}

      <div className="h-1 w-full bg-gray-100">

  <div

    className={`
      ${style.progress}
      h-full
      transition-[width]
      duration-75
    `}

    style={{
      width: `${progress}%`,
    }}

  />

</div>
    </div>
  );
}

export default Toast;