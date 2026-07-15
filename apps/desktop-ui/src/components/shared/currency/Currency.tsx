type CurrencyProps = {
  value: number;
};

function Currency({
  value,
}: CurrencyProps) {
  return (
    <>
      {new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(value)}
    </>
  );
}

export default Currency;