import type { LucideIcon } from "lucide-react";

type QuickActionCardProps = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  onClick?: () => void;
};

function QuickActionCard({
  title,
  subtitle,
  icon: Icon,
  onClick,
}: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >

      <Icon className="mb-4 h-8 w-8 text-indigo-600" />

      <h3 className="font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {subtitle}
      </p>

    </button>
  );
}

export default QuickActionCard;