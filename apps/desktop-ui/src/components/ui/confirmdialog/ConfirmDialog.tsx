import Modal from "../modal/Modal";
import Button from "../button/Button";

import {
  AlertTriangle,
  Info,
  ShieldAlert,
} from "lucide-react";

type Props = {
  open: boolean;

  title?: string;
  message?: string;

  confirmText?: string;
  cancelText?: string;

  type?: "danger" | "info" | "warning";

  loading?: boolean;

  onConfirm: () => void;
  onCancel: () => void;
};

const config = {

  danger: {

    icon: ShieldAlert,

    iconBg: "bg-red-100",

    iconColor: "text-red-600",

    button: "danger" as const,

  },

  warning: {

    icon: AlertTriangle,

    iconBg: "bg-amber-100",

    iconColor: "text-amber-600",

    button: "primary" as const,

  },

  info: {

    icon: Info,

    iconBg: "bg-blue-100",

    iconColor: "text-blue-600",

    button: "primary" as const,

  },

};

function ConfirmDialog({

  open,

  title = "Are you sure?",

  message = "This action cannot be undone.",

  confirmText = "Confirm",

  cancelText = "Cancel",

  type = "danger",

  loading = false,

  onConfirm,

  onCancel,

}: Props) {

  const current = config[type];

  const Icon = current.icon;

  return (

    <Modal
      isOpen={open}
      title=""
      onClose={onCancel}
    >

      <div
        className="
          animate-in
          fade-in
          zoom-in-95
          duration-200
        "
      >

        {/* Icon */}

        <div
          className={`
            mx-auto
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            ${current.iconBg}
          `}
        >

          <Icon
            size={30}
            className={current.iconColor}
          />

        </div>

        {/* Title */}

        <h2
          className="
            mt-5
            text-center
            text-xl
            font-bold
            text-gray-900
          "
        >
          {title}
        </h2>

        {/* Message */}

        <p
          className="
            mt-3
            text-center
            text-sm
            leading-6
            text-gray-500
          "
        >
          {message}
        </p>

        {/* Buttons */}

        <div
          className="
            mt-8
            flex
            justify-center
            gap-3
          "
        >

          <Button
            variant="secondary"
            disabled={loading}
            onClick={onCancel}
          >
            {cancelText}
          </Button>

          <Button
            variant={current.button}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>

        </div>

      </div>

    </Modal>

  );

}

export default ConfirmDialog;