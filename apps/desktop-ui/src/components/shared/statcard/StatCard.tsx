import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  subtitle?: string;
  value: string | number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

function StatCard({
  title,
  subtitle,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs text-gray-400">
              {subtitle}
            </p>
          )}

        </div>

        <div className={`rounded-lg p-3 ${iconBg}`}>
          <Icon
            className={`h-6 w-6 ${iconColor}`}
          />
        </div>

      </div>

      <h2 className="mt-6 text-3xl font-bold text-gray-900">
        {value}
      </h2>

    </div>
  );
}

export default StatCard;