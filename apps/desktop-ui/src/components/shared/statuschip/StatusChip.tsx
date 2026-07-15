export type StatusVariant =
  | "success"
  | "warning"
  | "danger";

type StatusChipProps = {
  label: string;
  variant: StatusVariant;
};

const styles = {
  success:
    "bg-green-100 text-green-700",

  warning:
    "bg-amber-100 text-amber-700",

  danger:
    "bg-red-100 text-red-700",
};

function StatusChip({
  label,
  variant,
}: StatusChipProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

export default StatusChip;