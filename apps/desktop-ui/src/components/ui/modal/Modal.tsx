import React from "react";

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

function Modal({ isOpen, title, children, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-lg flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b shrink-0">
          <h2 className="font-semibold text-lg">{title}</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 overflow-y-auto">
          {children}
        </div>

      </div>

    </div>
  );
}

export default Modal;