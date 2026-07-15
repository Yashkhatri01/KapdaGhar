import Modal from "../../../components/ui/modal/Modal";
import PurchaseForm from "./PurchaseForm";

type Props = {
  open: boolean;
  onClose: () => void;
};

function PurchaseModal({ open, onClose }: Props) {
  return (
    <Modal
      isOpen={open}
      title="New Purchase"
      onClose={onClose}
    >
      <PurchaseForm />
    </Modal>
  );
}

export default PurchaseModal;