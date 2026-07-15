import { useEffect, useState } from "react";

import Input from "../../../components/ui/input/Input";
import Button from "../../../components/ui/button/Button";

import type {
  Supplier,
  SupplierPayload,
} from "../types/supplier";

type Props = {
  supplier: Supplier | null;
  onSubmit: (data: SupplierPayload) => void;
  onClose: () => void;
};

function SupplierForm({
  supplier,
  onSubmit,
  onClose,
}: Props) {
  const [form, setForm] = useState<SupplierPayload>({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name,
        phone: supplier.phone ?? "",
        address: supplier.address ?? "",
      });
    }
  }, [supplier]);

  function handleChange(
    key: keyof SupplierPayload,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        label="Supplier Name"
        value={form.name}
        onChange={(e) =>
          handleChange("name", e.target.value)
        }
      />

      <Input
        label="Phone"
        value={form.phone}
        onChange={(e) =>
          handleChange("phone", e.target.value)
        }
      />

      <Input
        label="Address"
        value={form.address}
        helper="City or full supplier address"
        onChange={(e) =>
          handleChange("address", e.target.value)
        }
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button type="submit">
          Save Supplier
        </Button>
      </div>
    </form>
  );
}

export default SupplierForm;