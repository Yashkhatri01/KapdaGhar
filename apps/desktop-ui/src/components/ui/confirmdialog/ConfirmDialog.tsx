import Modal from "../modal/Modal";
import Button from "../button/Button";

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

const typeStyles = {
  danger: "bg-red-600 hover:bg-red-700 text-white",
  info: "bg-blue-600 hover:bg-blue-700 text-white",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-black",
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
  const confirmClass = typeStyles[type];

  return (
    <Modal isOpen={open} title={title} onClose={onCancel}>
      <div className="space-y-4">

        {/* MESSAGE */}
        <p className="text-sm text-gray-600">
          {message}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">

          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            onClick={onConfirm}
            className={confirmClass}
            disabled={loading}
          >
            {loading ? "Saving..." : confirmText}
          </Button>

        </div>

      </div>
    </Modal>
  );
}

export default ConfirmDialog;