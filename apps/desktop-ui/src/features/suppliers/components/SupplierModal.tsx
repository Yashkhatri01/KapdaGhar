import Modal from "../../../components/ui/modal/Modal";
import SupplierForm from "./SupplierForm";
import type { Supplier, SupplierPayload } from "../types/supplier";

type Props = {
  open: boolean;
  supplier: Supplier | null;
  onClose: () => void;
  onSave: (data: SupplierPayload) => void;
};

function SupplierModal({
  open,
  supplier,
  onClose,
  onSave,
}: Props) {
  return (
    <Modal
      isOpen={open}
      title={supplier ? "Edit Supplier" : "Add Supplier"}
      onClose={onClose}
    >
      <SupplierForm
        supplier={supplier}
        onSubmit={onSave}
        onClose={onClose}
      />
    </Modal>
  );
}

export default SupplierModal;