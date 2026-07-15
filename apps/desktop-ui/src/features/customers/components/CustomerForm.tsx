import { useEffect, useState } from "react";

import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";

import type {
  Customer,
  CustomerPayload,
} from "../types/customer";

type Props = {
  customer: Customer | null;
  onSubmit: (data: CustomerPayload) => void;
  onClose: () => void;
};

function CustomerForm({
  customer,
  onSubmit,
  onClose,
}: Props) {
  const [form, setForm] = useState<CustomerPayload>({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name,
        phone: customer.phone ?? "",
      });
    } else {
      setForm({
        name: "",
        phone: "",
      });
    }
  }, [customer]);

  const handleChange = (
    key: keyof CustomerPayload,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    onSubmit({
      name: form.name.trim(),
      phone: form.phone.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        label="Customer Name"
        value={form.name}
        onChange={(e) =>
          handleChange("name", e.target.value)
        }
        helper="Enter customer's full name"
      />

      <Input
        label="Phone Number"
        value={form.phone}
        onChange={(e) =>
          handleChange("phone", e.target.value)
        }
        helper="Optional"
      />

      <div className="flex justify-end gap-2 pt-4">

        <Button
          type="button"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button type="submit">
          Save Customer
        </Button>

      </div>
    </form>
  );
}

export default CustomerForm;