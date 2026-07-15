import Modal from "../../../components/ui/modal/Modal";

import CustomerForm from "./CustomerForm";

import type {
  Customer,
  CustomerPayload,
} from "../types/customer";

type Props = {
  open: boolean;
  customer: Customer | null;

  onClose: () => void;

  onSave: (data: CustomerPayload) => void;
};

function CustomerModal({
  open,
  customer,
  onClose,
  onSave,
}: Props) {
  return (
    <Modal
      isOpen={open}
      title={
        customer
          ? "Edit Customer"
          : "Add Customer"
      }
      onClose={onClose}
    >
      <CustomerForm
        customer={customer}
        onSubmit={onSave}
        onClose={onClose}
      />
    </Modal>
  );
}

export default CustomerModal;