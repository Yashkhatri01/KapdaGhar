import type { TopProduct } from "../api/reportsApi";

type Props = {
  products: TopProduct[];
};

function TopProductsCard({
  products,
}: Props) {

  return (

    <div className="bg-white border rounded-xl p-5">

      <h2 className="text-lg font-semibold">
        Top Selling Products
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        Best performers
      </p>

      <div className="space-y-3">

        {products.map((item) => (

          <div
            key={`${item.item_name}-${item.size}`}
            className="flex justify-between items-center border-b pb-2 last:border-b-0"
          >

            <div>

              <p className="font-medium">
                {item.item_name}
              </p>

              <p className="text-xs text-gray-500">
                {item.brand}
              </p>

            </div>

            <div className="text-right">

              <p className="font-semibold">
                {item.quantity} pcs
              </p>

              <p className="text-sm text-green-600">
                ₹{item.revenue}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default TopProductsCard;