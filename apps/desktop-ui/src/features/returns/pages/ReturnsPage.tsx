import { RotateCcw, ArrowRightLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/shared/pageheader/PageHeader";

function ReturnsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">

      <PageHeader
        title="Returns"
        subtitle="Customer aur Supplier Returns manage karein"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CUSTOMER RETURNS */}

        <div
          className="
            bg-white
            rounded-xl
            border
            shadow-sm
            hover:shadow-lg
            transition-all
            p-6
          "
        >

          <div className="flex items-center gap-3 mb-4">

            <div className="bg-blue-100 p-3 rounded-full">
              <RotateCcw
                className="text-blue-700"
                size={24}
              />
            </div>

            <div>

              <h2 className="text-xl font-semibold">
                Customer Returns
              </h2>

              <p className="text-gray-500 text-sm">
                Customer se return process karein
              </p>

            </div>

          </div>

          <p className="text-gray-600 mb-6">
            Refund aur Exchange requests ko manage karein.
            Previous returns bhi yahin se dekhe ja sakte hain.
          </p>

          <button
            onClick={() =>
              navigate("/returns/customer")
            }
            className="
              bg-blue-700
              hover:bg-black
              text-white
              px-5
              py-2
              rounded-lg
              transition-all
              flex
              items-center
              gap-2
            "
          >
            Open Customer Returns
          </button>

        </div>

        {/* SUPPLIER RETURNS */}

        <div
          className="
            bg-white
            rounded-xl
            border
            shadow-sm
            hover:shadow-lg
            transition-all
            p-6
          "
        >

          <div className="flex items-center gap-3 mb-4">

            <div className="bg-green-100 p-3 rounded-full">
              <ArrowRightLeft
                className="text-green-700"
                size={24}
              />
            </div>

            <div>

              <h2 className="text-xl font-semibold">
                Supplier Returns
              </h2>

              <p className="text-gray-500 text-sm">
                Supplier ko maal wapas bhejein
              </p>

            </div>

          </div>

          <p className="text-gray-600 mb-6">
            Damaged ya unwanted stock supplier ko return karein
            aur purani supplier returns bhi dekhein.
          </p>

          <button
            onClick={() =>
              navigate("/returns/supplier")
            }
            className="
              bg-green-700
              hover:bg-black
              text-white
              px-5
              py-2
              rounded-lg
              transition-all
              flex
              items-center
              gap-2
            "
          >
            Open Supplier Returns
          </button>

        </div>

      </div>

    </div>
  );
}

export default ReturnsPage;