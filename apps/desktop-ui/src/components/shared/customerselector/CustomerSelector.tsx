import { useEffect, useMemo, useState } from "react";
import {
  Search,
  User,
  Phone,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { getCustomers } from "../../../features/customers/api/customerApi";
import type { Customer } from "../../../features/customers/types/customer";

type Props = {
  onSelect: (customer: Customer | null) => void;
};

export default function CustomerSelector({
  onSelect,
}: Props) {
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [search, setSearch] =
    useState("");

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  useEffect(() => {
    async function load() {
      const data =
        await getCustomers();

      setCustomers(
        Array.isArray(data)
          ? data
          : []
      );
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    return customers.filter((c) =>
      c.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
  }, [customers, search]);

  return (
    <div className="space-y-4">

      {/* SELECTED CUSTOMER */}

      {selectedCustomer ? (
        <div
          className="
            animate-[fadeIn_.25s_ease]

            rounded-xl

            border
            border-green-200

            bg-green-50

            p-4
          "
        >
          <div className="flex items-start justify-between">

            <div className="flex gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center

                  rounded-full

                  bg-green-100
                  text-green-700
                "
              >
                <CheckCircle2 size={20} />
              </div>

              <div>

                <p
                  className="
                    text-xs
                    uppercase
                    tracking-wide
                    text-green-600
                  "
                >
                  Customer Selected
                </p>

                <h3
                  className="
                    text-lg
                    font-semibold
                  "
                >
                  {selectedCustomer.name}
                </h3>

                {selectedCustomer.phone && (
                  <div
                    className="
                      mt-1
                      flex
                      items-center
                      gap-2

                      text-sm
                      text-gray-600
                    "
                  >
                    <Phone size={14} />
                    {selectedCustomer.phone}
                  </div>
                )}

              </div>

            </div>

            <button
              onClick={() => {
                setSelectedCustomer(
                  null
                );
                setSearch("");
                onSelect(null);
              }}
              className="
                rounded-lg

                px-3
                py-2

                text-sm

                text-red-600

                transition-all

                hover:bg-red-100
              "
            >
              Remove
            </button>

          </div>
        </div>
      ) : (
        <>
          {/* SEARCH */}

          <div className="relative">

            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search customer..."
              className="
                w-full

                rounded-xl

                border

                bg-white

                py-3
                pl-10
                pr-4

                text-sm

                transition-all

                focus:border-blue-400
                focus:ring-4
                focus:ring-blue-100
                focus:outline-none
              "
            />

          </div>

          {/* WALK IN */}

          <button
            onClick={() =>
              onSelect(null)
            }
            className="
              flex
              w-full
              items-center
              gap-2

              rounded-xl

              border
              border-dashed

              px-4
              py-3

              text-sm

              text-gray-600

              transition-all

              hover:border-gray-400
              hover:bg-gray-50
            "
          >
            <XCircle size={18} />
            Walk-in Customer
          </button>

          {/* RESULTS */}

          <div
            className="
              max-h-60

              overflow-y-auto

              rounded-xl

              border

              divide-y
            "
          >
            {filtered.length ===
            0 ? (
              <div
                className="
                  py-8
                  text-center
                  text-sm
                  text-gray-400
                "
              >
                No customer found
              </div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomer(
                      c
                    );
                    setSearch("");
                    onSelect(c);
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between

                    px-4
                    py-3

                    text-left

                    transition-all
                    duration-200

                    hover:bg-blue-50
                    hover:translate-x-1
                  "
                >
                  <div className="flex gap-3">

                    <div
                      className="
                        mt-1

                        flex
                        h-8
                        w-8

                        items-center
                        justify-center

                        rounded-full

                        bg-blue-100

                        text-blue-700
                      "
                    >
                      <User size={15} />
                    </div>

                    <div>

                      <div className="font-medium">
                        {c.name}
                      </div>

                      {c.phone && (
                        <div
                          className="
                            text-xs
                            text-gray-500
                          "
                        >
                          {c.phone}
                        </div>
                      )}

                    </div>

                  </div>

                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}