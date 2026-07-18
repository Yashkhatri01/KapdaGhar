import React, {
  useEffect,
  useState,
} from "react";
import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

function Modal({
  isOpen,
  title,
  children,
  onClose,
}: ModalProps) {

  const [mounted, setMounted] =
  useState(isOpen);

const [closing, setClosing] =
  useState(false);

  useEffect(() => {

  if (isOpen) {

    setMounted(true);
    setClosing(false);

    document.body.style.overflow = "hidden";

  } else if (mounted) {

    setClosing(true);

    const timer =
      setTimeout(() => {

        setMounted(false);
        setClosing(false);

      }, 220);

    document.body.style.overflow = "";

    return () =>
      clearTimeout(timer);

  }

}, [isOpen]);


  useEffect(() => {

  if (!mounted) return;

  function handleKeyDown(
    e: KeyboardEvent
  ) {

    if (e.key === "Escape") {

      onClose();

    }

  }

  document.addEventListener(
    "keydown",
    handleKeyDown
  );

  return () => {

    document.removeEventListener(
      "keydown",
      handleKeyDown
    );

  };

}, [mounted, onClose]);

if (!mounted) return null;

  return (

    <div
      className={`
  fixed
  inset-0
  z-50

  flex
  items-center
  justify-center

  bg-black/45
  backdrop-blur-[4px]

  p-4

  ${
    closing
      ? "animate-[fadeOut_.22s_ease_forwards]"
      : "animate-[fadeIn_.18s_ease]"
  }
`}
      onClick={() => {

  if (!closing) {

    onClose();

  }

}}
    >

      <div

        onClick={(e) =>
          e.stopPropagation()
        }

        className={`
  w-full
  max-w-4xl
  max-h-[90vh]

  overflow-hidden

  rounded-2xl

  border
  border-white/50

  bg-white

  shadow-2xl
  shadow-black/20

  flex
  flex-col

  ${
    closing
      ? "animate-[modalClose_.22s_cubic-bezier(.4,0,.2,1)_forwards]"
      : "animate-[modalPop_.24s_cubic-bezier(.22,1,.36,1)]"
  }
`}
      >

        {/* Header */}

        <div
          className="
sticky
top-0
z-10

flex
items-center
justify-between

border-b

bg-white/80

supports-[backdrop-filter]:backdrop-blur-md

px-6
py-4
"
        >

          <h2
            className="
              text-lg
              font-semibold
              text-gray-900
            "
          >
            {title}
          </h2>

          <button

            onClick={() => {

  if (!closing) {

    onClose();

  }

}}

            className="
              rounded-xl

              p-2

              text-gray-500

              transition-all
              duration-200

              hover:bg-red-50
hover:text-red-600
hover:rotate-90

              active:scale-95
            "
          >

            <X size={18} />

          </button>

        </div>

        <div
  className="
    h-px
    w-full
    bg-gradient-to-r
    from-transparent
    via-blue-200/70
    to-transparent
  "
/>

        {/* Body */}

        <div
          className="
            overflow-y-auto

            px-6
            py-6
          "
        >

          {children}

        </div>

      </div>

    </div>

  );

}

export default Modal;