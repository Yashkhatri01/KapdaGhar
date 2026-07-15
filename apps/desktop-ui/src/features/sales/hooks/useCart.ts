import { useMemo, useState } from "react";
import {
  createSale,
  updateSale,
} from "../api/salesApi";

export type CartItem = {
  inventory_id: number;
  item_name: string;
  
  brand?: string;
  size?: string;
  color?: string;

  purchase_price: number;
  selling_price: number;

  custom_selling_price?: number;

  quantity: number;
};

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] =
  useState<"CASH" | "UPI">("CASH");
  const [loading, setLoading] = useState(false);

  function addItem(item: any) {
  setCart((prev) => {
    const exists = prev.find(
      (i) => i.inventory_id === item.id
    );

    if (exists) {
      return prev.map((i) =>
        i.inventory_id === item.id
          ? { ...i, quantity: i.quantity + 1 }
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

    purchase_price: item.purchase_price,
    selling_price: item.selling_price,

    custom_selling_price: undefined,

    quantity: 1,
  },
];
  });
}

function updateSellingPrice(id: number, price: number) {
  setCart((prev) =>
    prev.map((i) =>
      i.inventory_id === id
        ? { ...i, selling_price: price }
        : i
    )
  );
}

  function increaseQty(id: number) {
    setCart((prev) =>
      prev.map((i) =>
        i.inventory_id === id
          ? { ...i, quantity: i.quantity + 1 }
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

  // ✅ ADD THIS (fix missing function)
  function removeItem(id: number) {
    setCart((prev) =>
      prev.filter((i) => i.inventory_id !== id)
    );
  }

  function updateCustomSellingPrice(
  id: number,
  value: string
) {
  setCart((prev) =>
    prev.map((item) => {
      if (item.inventory_id !== id) return item;

      if (value.trim() === "") {
        return {
          ...item,
          custom_selling_price: undefined,
        };
      }

      return {
        ...item,
        custom_selling_price: Number(value),
      };
    })
  );
}

  function loadCart(items: any[], payment: "CASH" | "UPI") {
  setCart(
    
  items.map((i) => ({
    inventory_id: i.inventory_id,

    item_name: i.item_name,
    brand: i.brand,
    size: i.size,
    color: i.color,

    purchase_price: i.purchase_price,
    selling_price: i.selling_price,

    custom_selling_price:
      i.selling_price === i.default_selling_price
        ? undefined
        : i.selling_price,

    quantity: i.quantity,
  }))
);
console.log("LOAD CART", items);
  setPaymentMethod(payment);
}

  function clearCart() {
  setCart([]);
  setPaymentMethod("CASH");
  }

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, i) => {
  const sellingPrice =
    i.custom_selling_price ?? i.selling_price;

  return sum + i.quantity * sellingPrice;
}, 0);

    const totalQty = cart.reduce(
      (sum, i) => sum + i.quantity,
      0
    );

    return {
      subtotal,
      totalQty, // ✅ FIXED
    };
  }, [cart]);

  async function checkout(
  payload?: {
    customer_id?: number | null;
    discount?: number;
    tax?: number;
    payment_method?: string;
  },
  saleId?: number
) {
  if (loading) return; // 🚫 prevent double click

  if (cart.length === 0) {
    throw new Error("Cart is empty");
  }

  setLoading(true);
    console.log(cart);
  try {
    const subtotal = cart.reduce((sum, i) => {
  const sellingPrice =
    i.custom_selling_price ?? i.selling_price;

  return sum + i.quantity * sellingPrice;
}, 0);

    const grand_total =
      subtotal -
      (payload?.discount || 0) +
      (payload?.tax || 0);

    const salePayload = {
  customer_id: payload?.customer_id || null,
  subtotal,
  discount: payload?.discount || 0,
  tax: payload?.tax || 0,
  grand_total,
  payment_method: payload?.payment_method || paymentMethod,
  payment_status: "PAID",

  items: cart.map((i) => {
  const sellingPrice =
    i.custom_selling_price ??
    i.selling_price;

  return {
    inventory_id: i.inventory_id,
    quantity: i.quantity,
    selling_price: sellingPrice,
    discount: 0,
    total: i.quantity * sellingPrice,
  };
})
};

console.log("SALE PAYLOAD →", salePayload);
console.log("CART →", cart);
console.log("SALE ID →", saleId);

const apiRes = saleId
  ? await updateSale(saleId, salePayload)
  : await createSale(salePayload);

console.log("API RESPONSE →", apiRes);

if (!apiRes) {
  throw new Error("Server se empty response aaya hai");
}

setCart([]);
return apiRes;

  } finally {
    setLoading(false);
  }
}

  return {
  cart,
  addItem,
  increaseQty,
  decreaseQty,
  removeItem,
  clearCart,
  loadCart,
  updateSellingPrice,
  updateCustomSellingPrice,
  paymentMethod,
  setPaymentMethod,

  totals,
  checkout,
  loading,
};
}