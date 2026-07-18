import { useEffect, useState } from "react";
import Input from "../../../components/ui/input/Input";
import Button from "../../../components/ui/button/Button";
import type { Inventory } from "../types/inventory";
import { useRef } from "react";
import LowSellingPriceModal from "../components/LowSellingPriceModal";
import { useToast } from "../../../contexts/ToastContext";

type Props = {
  item: Inventory | null;
  onSubmit: (data: Partial<Inventory>) => void;
  onClose: () => void;
};

function InventoryForm({ item, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<Partial<Inventory>>({
    item_name: "",
    category: "",
    brand: "",
    size: "",
    color: "",
    purchase_price: 0,
    selling_price: 0,
    stock: 0,
    min_stock: 1, // ✅ default safe value
    barcode: "",
  });

  const [showWarning, setShowWarning] = useState(false);

  const [errors, setErrors] = useState({
  purchase_price: "",
  selling_price: "",
  stock: "",
  min_stock: "",
  });
  const toast = useToast();

  const sellingPriceRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item) {
      setForm(item);
    }
  }, [item]);

  const handleChange = (key: keyof Inventory, value: any) => {
  setForm((prev) => ({
    ...prev,
    [key]: value,
  }));

  if (key in errors) {
    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  }
};

  function saveItem() {
  onSubmit({
    ...form,
    purchase_price: Number(form.purchase_price),
    selling_price: Number(form.selling_price),
    stock: Number(form.stock),
    min_stock: Number(form.min_stock || 1),
  });
}

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const purchase = Number(form.purchase_price);
  const selling = Number(form.selling_price);
  const stock = Number(form.stock);
  const minStock = Number(form.min_stock || 1);

  const newErrors = {
    purchase_price: "",
    selling_price: "",
    stock: "",
    min_stock: "",
  };

  if (purchase <= 0) {
    newErrors.purchase_price =
      "Purchase Price should be greater than 0";
  }

  if (selling <= 0) {
    newErrors.selling_price =
      "Selling Price should be greater than 0";
  }

  if (stock < 0) {
    newErrors.stock =
      "Stock cannot be negative";
  }

  if (minStock < 0) {
    newErrors.min_stock =
      "Minimum Stock cannot be negative";
  }

  setErrors(newErrors);

  // Stop if any validation failed
  if (
  newErrors.purchase_price ||
  newErrors.selling_price ||
  newErrors.stock ||
  newErrors.min_stock
) {

  toast.warning({

    title:"Check the highlighted fields",

    description:
      "Some values are invalid."

  });

  return;

}

  // Warning only (not an error)
  if (selling < purchase) {
    setShowWarning(true);
    return;
  }

  saveItem();
};

  return (
    


    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

      {/* LEFT */}
      <div
  className="
    space-y-3

    opacity-0

    animate-[fadeUp_.35s_ease_forwards]
  "
>

        <Input
          label="Item Name"
          value={form.item_name}
          onChange={(e) => handleChange("item_name", e.target.value)}
          helper="e.g. Shirt, Jeans, Kurta"
        />

        <Input
          label="Category"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          helper="Men / Women / Kids"
        />

        <Input
          label="Brand"
          value={form.brand}
          onChange={(e) => handleChange("brand", e.target.value)}
        />

        <Input
          label="Size"
          value={form.size}
          onChange={(e) =>
            handleChange("size", e.target.value)
          }
          helper="e.g. S, M, L, XL, 32, 34"
        />

        <Input
  label="Color"
  value={form.color}
  onChange={(e) =>
    handleChange("color", e.target.value)
  }
  helper="e.g. Black, Blue, Olive"
/>

        

      </div>

      {/* RIGHT */}
      <div
  className="
    space-y-3

    opacity-0

    animate-[fadeUp_.35s_ease_forwards]
  "

  style={{
    animationDelay:"80ms"
  }}
>

        <Input
  label="Purchase Price"
  type="number"
  min={0}
  value={form.purchase_price}
  error={errors.purchase_price}
  onChange={(e) =>
    handleChange("purchase_price", e.target.value)
  }
/>

        <Input
  ref={sellingPriceRef}
  label="Selling Price"
  type="number"
  min={0}
  value={form.selling_price}
  error={errors.selling_price}
  onChange={(e) =>
    handleChange("selling_price", e.target.value)
  }
/>

        <Input
  label="Stock"
  type="number"
  min={0}
  value={form.stock}
  error={errors.stock}
  onChange={(e) =>
    handleChange("stock", e.target.value)
  }
/>

        <Input
          label="Barcode"
          value={form.barcode}
          onChange={(e) => handleChange("barcode", e.target.value)}
        />

        <Input
  label="Min Stock (optional)"
  type="number"
  min={0}
  value={form.min_stock}
  error={errors.min_stock}
  helper="Default is 1"
  onChange={(e) =>
    handleChange("min_stock", e.target.value)
  }
/>

      </div>

      {/* ACTIONS */}
      <div className="col-span-2 flex justify-end gap-2 mt-4">

        <Button
type="button"
onClick={onClose}
variant="secondary"
leftIcon={<span>↩</span>}
>
Cancel
</Button>

        <Button
type="submit"
leftIcon={<span>💾</span>}
>
{item ? "Save Changes" : "Save Item"}
</Button>

      </div>

      <LowSellingPriceModal
  open={showWarning}
  purchasePrice={Number(form.purchase_price)}
  sellingPrice={Number(form.selling_price)}
  onEdit={() => {
    setShowWarning(false);

    setTimeout(() => {
      sellingPriceRef.current?.focus();
    }, 100);
  }}
  onSaveAnyway={() => {
    setShowWarning(false);
    saveItem();
  }}
/>

    </form>
  );
}

export default InventoryForm;