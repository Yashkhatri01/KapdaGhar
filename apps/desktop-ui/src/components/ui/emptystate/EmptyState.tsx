import Button from "../button/Button";

type EmptyStateProps = {
  title: string;
  description: string;

  icon?: React.ReactNode;

  actionLabel?: string;
  onAction?: () => void;
};

function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
      
      {icon && (
        <div className="mb-4 flex justify-center">
          {icon}
        </div>
      )}


      <h3 className="text-lg font-semibold text-gray-800">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>

      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}

    </div>
  );
}

export default EmptyState;