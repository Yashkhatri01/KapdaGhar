import Modal from "../../../components/ui/modal/Modal";
import InventoryForm from "./InventoryForm";
import type { Inventory } from "../types/inventory";

type Props = {
  open: boolean;
  item: Inventory | null;
  onClose: () => void;
  onSave: (data: Partial<Inventory>) => void;
};

function InventoryModal({ open, item, onClose, onSave }: Props) {
  return (
    <Modal
      isOpen={open}
      title={item ? "Edit Item" : "Add New Item"}
      onClose={onClose}
    >
      <InventoryForm
        item={item}
        onSubmit={onSave}
        onClose={onClose}
      />
    </Modal>
  );
}

export default InventoryModal;