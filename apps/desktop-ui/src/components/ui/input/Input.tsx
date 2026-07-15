import {
  forwardRef,
  type InputHTMLAttributes,
} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
function Input(
{
  label,
  helper,
  error,
  id,
  className = "",
  ...props
}: InputProps,
ref
) {
  return (
    <div className="space-y-1.5">

      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <input
      ref={ref}
        id={id}
        {...props}
        className={[
          "w-full rounded-lg border border-gray-300 bg-white px-3 py-2",
          "text-sm text-gray-900 placeholder:text-gray-400",
          "transition-colors duration-150",
          "focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200",
          "disabled:bg-gray-100 disabled:cursor-not-allowed",
          error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "",
          className,
        ].join(" ")}
      />

      {helper && !error && (
        <p className="text-xs text-gray-500">
          {helper}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}

);

export default Input;