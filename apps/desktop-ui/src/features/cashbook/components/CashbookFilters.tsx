import { useMemo } from "react";

type Props = {
  year: number;
  month: number;
  day: number;

  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onDayChange: (day: number) => void;
};

function CashbookFilters({
  year,
  month,
  day,
  onYearChange,
  onMonthChange,
  onDayChange,
}: Props) {

  const currentYear = new Date().getFullYear();

  const years = useMemo(() => {

    const arr = [];

    for (
      let y = currentYear;
      y >= currentYear - 5;
      y--
    ) {
      arr.push(y);
    }

    return arr;

  }, []);

  const months = [
    "All Months",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const maxDay = useMemo(() => {

  if (month === 0) {
    return 31;
  }

  const today = new Date();

  // Current month -> only till today
  if (
    year === today.getFullYear() &&
    month === today.getMonth() + 1
  ) {
    return today.getDate();
  }

  // Previous months -> full month
  return new Date(
    year,
    month,
    0
  ).getDate();

}, [year, month]);

  return (

    <div className="bg-white border rounded-lg p-5">

      <div className="flex flex-wrap gap-4 items-end">

        {/* YEAR */}

        <div>

          <label className="block text-sm text-gray-600 mb-1">
            Year
          </label>

          <select
            value={year}
            onChange={(e) => {

  onYearChange(
    Number(e.target.value)
  );

  if (month === 0) {
    onDayChange(0);
  }

}}
            className="border rounded-lg px-3 py-2"
          >

            {years.map((y) => (

              <option
                key={y}
                value={y}
              >
                {y}
              </option>

            ))}

          </select>

        </div>

        {/* MONTH */}

        <div>

          <label className="block text-sm text-gray-600 mb-1">
            Month
          </label>

          <select
            value={month}
            onChange={(e) => {

  const value = Number(e.target.value);

  onMonthChange(value);

  if (value === 0) {
    onDayChange(0);
  }

}}
            className="border rounded-lg px-3 py-2"
          >

            {months.map(
              (m, index) => (

                <option
                  key={index}
                  value={index}
                >
                  {m}
                </option>

              )
            )}

          </select>

        </div>

        {/* DAY */}

        <div>

          <label className="block text-sm text-gray-600 mb-1">
            Day
          </label>

          <select
            value={day}
            onChange={(e) =>
              onDayChange(
                Number(e.target.value)
              )
            }
            className="border rounded-lg px-3 py-2"
          >

            <option value={0}>
              All Days
            </option>

            {Array.from({ length: maxDay }).map((_, i) => (

  <option
    key={i + 1}
    value={i + 1}
  >
    {i + 1}
  </option>

))}

          </select>

        </div>

      </div>

      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">

        <p className="text-sm font-medium text-blue-900">
          💡 Cashbook
        </p>

        <p className="mt-1 text-sm text-blue-700">
          Sales, Purchases aur Returns ki
          saari cash entries yahan automatically
          maintain hoti hain. Sirf month ya day
          change karke kisi bhi period ka
          hisaab dekh sakte hain.
        </p>

      </div>

    </div>

  );

}

export default CashbookFilters;