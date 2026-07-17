import { AlertTriangle } from "lucide-react";

import type {
  LowStockItem,
} from "../api/reportsApi";

type Props = {
  items: LowStockItem[];
};

function LowStockCard({
  items,
}: Props) {

  return (

    <div className="bg-white border rounded-xl p-5">

      <div className="flex items-center gap-2 mb-4">

        <AlertTriangle
          className="text-red-500"
          size={20}
        />

        <h2 className="font-semibold text-lg">
          Low Stock
        </h2>

      </div>

      <div className="space-y-3">

        {items.length === 0 && (

          <p className="text-sm text-gray-500">

            Everything looks good.

          </p>

        )}

        {items.map((item) => (

          <div
            key={item.id}
            className="flex justify-between"
          >

            <div>

              <p className="font-medium">

                {item.item_name}

              </p>

              <p className="text-xs text-gray-500">

                {item.brand}

              </p>

            </div>

            <span className="text-red-600 font-semibold">

              {item.stock}

            </span>

          </div>

        ))}

      </div>

    </div>

  );

}

export default LowStockCard;