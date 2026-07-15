import { useMemo, useState } from "react";
import { createPurchase } from "../api/purchaseApi";

export type PurchaseCartItem = {
  inventory_id: number;

  item_name: string;
  brand?: string;
  size?: string;
  color?: string;

  quantity: number;

  unit_cost: number;
  selling_price: number;

  // true => purchase page se abhi create hua
  // false => pehle se inventory me tha
  isNewItem: boolean;
  initialStock: number;
};

export function usePurchaseCart() {
  const [cart, setCart] = useState<PurchaseCartItem[]>([]);
  const [loading, setLoading] = useState(false);


  function addItem(item: any) {
    setCart((prev) => {
      const exists = prev.find(
        (i) => i.inventory_id === item.id
      );

      if (exists) {
        return prev.map((i) =>
          i.inventory_id === item.id
            ? {
                ...i,
                quantity: i.quantity + 1,
              }
            : i
        );
      }

      return [
  ...prev,
  {
    inventory_id: item.id,
    item_name: item.item_name,

    brand: item.brand,
    size: item.size,
    color: item.color,

    quantity: 1,
    initialStock: 0,

    unit_cost: item.purchase_price,
    selling_price: item.selling_price,

    isNewItem: false,
  },
];
    });
  }

  function updateSellingPrice(
  id: number,
  value: string
) {
  setCart((prev) =>
    prev.map((i) =>
      i.inventory_id === id
        ? {
            ...i,
            selling_price: Number(value),
          }
        : i
    )
  );
}

  function increaseQty(id: number) {
    setCart((prev) =>
      prev.map((i) =>
        i.inventory_id === id
          ? {
              ...i,
              quantity: i.quantity + 1,
            }
          : i
      )
    );
  }

  function decreaseQty(id: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.inventory_id === id
            ? {
                ...i,
                quantity: i.quantity - 1,
              }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(id: number) {
    setCart((prev) =>
      prev.filter(
        (i) => i.inventory_id !== id
      )
    );
  }

  function updateUnitCost(
    id: number,
    value: string
  ) {
    setCart((prev) =>
      prev.map((i) =>
        i.inventory_id === id
          ? {
              ...i,
              unit_cost: Number(value),
            }
          : i
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  function loadCart(items: any[]) {
  setCart(items);
  }

  function addNewInventoryItem(item: any) {
  setCart((prev) => [
    ...prev,
    {
      inventory_id: item.id,

      item_name: item.item_name,
      brand: item.brand,
      size: item.size,
      color: item.color,

      quantity: item.stock,

      // ⭐ inventory me create hote waqt jitna stock add hua
      initialStock: item.stock,

      unit_cost: item.purchase_price,
      selling_price: item.selling_price,

      isNewItem: true,
    },
  ]);
}

  const totals = useMemo(() => {
    const totalQty = cart.reduce(
      (sum, i) => sum + i.quantity,
      0
    );

    const subtotal = cart.reduce(
      (sum, i) =>
        sum + i.quantity * i.unit_cost,
      0
    );

    return {
      totalQty,
      subtotal,
    };
  }, [cart]);

  async function checkout(supplierId: number | null) {
  if (loading) return;

  if (cart.length === 0) {
    throw new Error("Purchase cart is empty");
  }

  setLoading(true);

  try {
    const payload = {
      supplier_id: supplierId,
      total: totals.subtotal,

      items: cart.map((item) => ({
  inventory_id: item.inventory_id,

  quantity: item.quantity,

  unit_cost: item.unit_cost,
  selling_price: item.selling_price,

  total: item.quantity * item.unit_cost,

  isNewItem: item.isNewItem,
  initialStock: item.initialStock,
}))
    };

    console.log("PURCHASE PAYLOAD →", payload);

    const response = await createPurchase(payload);

    setCart([]);

    return response;
  } finally {
    setLoading(false);
  }
}


  return {
    cart,

    addItem,
    addNewInventoryItem,
    increaseQty,
    decreaseQty,

    removeItem,

    updateUnitCost,
    updateSellingPrice,
    checkout,
    loading,

    clearCart,
    loadCart,
    totals,
  };
}