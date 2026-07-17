import type {
  DeadStockItem,
} from "../api/reportsApi";

type Props = {
  items: DeadStockItem[];
};

function DeadStockCard({
  items,
}: Props) {

  return (

    <div className="bg-white border rounded-xl p-5">

      <h2 className="font-semibold text-lg">

        Dead Stock

      </h2>

      <p className="text-sm text-gray-500 mb-4">

        Unsold for 12+ months

      </p>

      <div className="space-y-3">

        {items.length === 0 && (

          <p className="text-sm text-gray-500">

            No dead stock 🎉

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

                {item.last_sale
                  ? item.last_sale
                  : "Never Sold"}

              </p>

            </div>

            <span className="font-semibold">

              {item.stock}

            </span>

          </div>

        ))}

      </div>

    </div>

  );

}

export default DeadStockCard;